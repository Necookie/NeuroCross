import {
    INTERSECTION_EXIT,
    ROAD_LENGTH,
    STOP_LINE,
    VEHICLE_SPECS,
} from './config';
import { VehicleAgent } from './VehicleAgent';

// Helper for weighted random choice equivalent to random.choices
function weightedRandomChoice(choices, weights) {
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    let randomNum = Math.random() * totalWeight;

    for (let i = 0; i < choices.length; i++) {
        if (randomNum < weights[i]) {
            return choices[i];
        }
        randomNum -= weights[i];
    }
    return choices[choices.length - 1]; // Fallback
}

export class IntersectionSim {
    constructor() {
        this.roads = {
            north: [[], []],
            south: [[], []],
            east: [[], []],
            west: [[], []],
        };
        this.state = 'NS_GREEN';
        this.timer = 0.0;
        this.globalId = 0;
        this.metrics = { accidents: 0, throughput: 0, avg_speed: 0 };
    }

    step(params) {
        const dt = 0.1;
        this.timer += dt;
        const friction = params.weather === 'rain' ? 0.6 : 1.0;

        this._updateLights();
        this._spawnTraffic(params, dt);

        const blockedNs = this._isIntersectionBlockedGroup(['north', 'south']);
        const blockedEw = this._isIntersectionBlockedGroup(['east', 'west']);

        let totalSpeed = 0.0;
        let carCount = 0;

        for (const [direction, lanes] of Object.entries(this.roads)) {
            const isGreen = this._isGreen(direction);
            const intersectionBlocked = ['north', 'south'].includes(direction) ? blockedNs : blockedEw;

            lanes.forEach((cars, laneIdx) => {
                const stopTarget = (!isGreen || intersectionBlocked) ? STOP_LINE : null;

                let leader = null;
                for (let i = 0; i < cars.length; i++) {
                    const car = cars[i];
                    car.updatePhysics(dt, leader, stopTarget, friction);
                    totalSpeed += car.speed;
                    carCount += 1;
                    leader = car;
                }

                if (cars.length > 0) {
                    let finishedCount = 0;
                    for (let i = 0; i < cars.length; i++) {
                        if (cars[i].pos >= ROAD_LENGTH) {
                            finishedCount += 1;
                        } else {
                            break;
                        }
                    }

                    if (finishedCount > 0) {
                        this.metrics.throughput += finishedCount;
                        this.roads[direction][laneIdx] = cars.slice(finishedCount);
                    }
                }
            });
        }

        if (carCount > 0) {
            this.metrics.avg_speed = Math.floor(totalSpeed / carCount);
        }

        return this.getState();
    }

    _updateLights() {
        if (this.state === 'NS_GREEN' && this.timer > 8) {
            this.state = 'NS_YELLOW';
            this.timer = 0;
        } else if (this.state === 'NS_YELLOW' && this.timer > 2) {
            this.state = 'ALL_RED_NS_TO_EW';
            this.timer = 0;
        } else if (this.state === 'ALL_RED_NS_TO_EW') {
            if (this._isClear(['north', 'south']) || this.timer > 5) {
                this.state = 'EW_GREEN';
                this.timer = 0;
            }
        } else if (this.state === 'EW_GREEN' && this.timer > 8) {
            this.state = 'EW_YELLOW';
            this.timer = 0;
        } else if (this.state === 'EW_YELLOW' && this.timer > 2) {
            this.state = 'ALL_RED_EW_TO_NS';
            this.timer = 0;
        } else if (this.state === 'ALL_RED_EW_TO_NS') {
            if (this._isClear(['east', 'west']) || this.timer > 5) {
                this.state = 'NS_GREEN';
                this.timer = 0;
            }
        }
    }

    _isClear(directions) {
        for (const d of directions) {
            for (const lane of this.roads[d]) {
                for (const car of lane) {
                    if (car.pos > STOP_LINE && car.pos < INTERSECTION_EXIT) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    _spawnTraffic(params, dt) {
        for (const direction of Object.keys(this.roads)) {
            let rate = ['north', 'south'].includes(direction) ? params.arrival_rate_ns : params.arrival_rate_ew;
            if (params.weather === 'rain') {
                rate *= 0.8;
            }
            if (Math.random() < (rate * dt)) {
                this.trySpawn(direction, Math.random() < 0.5 ? 0 : 1);
            }
        }
    }

    _isGreen(direction) {
        if (this.state === 'NS_GREEN' && ['north', 'south'].includes(direction)) {
            return true;
        }
        if (this.state === 'EW_GREEN' && ['east', 'west'].includes(direction)) {
            return true;
        }
        return false;
    }

    _isIntersectionBlockedGroup(directions) {
        for (const direction of directions) {
            const lanes = this.roads[direction];
            for (const lane of lanes) {
                for (const car of lane) {
                    if (car.pos > STOP_LINE && car.pos < INTERSECTION_EXIT && car.speed < 5) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    trySpawn(direction, laneIdx) {
        const laneCars = this.roads[direction][laneIdx];
        // Check if spawn area is clear
        for (const car of laneCars) {
            if ((car.pos - car.length / 2) < 25) {
                return;
            }
        }

        this.globalId += 1;
        const types = Object.keys(VEHICLE_SPECS);
        const probs = types.map(t => VEHICLE_SPECS[t].prob);

        const vType = weightedRandomChoice(types, probs);
        laneCars.push(VehicleAgent.spawn(this.globalId, vType, laneIdx));
    }

    getState() {
        const jsonRoads = { north: [[], []], south: [[], []], east: [[], []], west: [[], []] };
        for (const [d, lanes] of Object.entries(this.roads)) {
            lanes.forEach((lane, i) => {
                jsonRoads[d][i] = lane.map(c => ({
                    id: c.id, pos: c.pos, type: c.type, status: c.status, lane: c.lane
                }));
            });
        }
        return { light_state: this.state, roads: jsonRoads, metrics: this.metrics };
    }
}
