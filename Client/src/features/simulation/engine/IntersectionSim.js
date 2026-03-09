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
            north: [[], [], []],
            south: [[], [], []],
            east: [[], [], []],
            west: [[], [], []],
        };
        this.roadKeys = ['north', 'south', 'east', 'west'];
        this.state = 'N_GREEN';
        this.timer = 0.0;
        this.globalId = 0;
        this.metrics = { accidents: 0, throughput: 0, avg_speed: 0 };
    }

    step(params) {
        const dt = 0.1;
        this.timer += dt;
        const friction = params.weather === 'rain' ? 0.6 : 1.0;

        this._updateLights(params.mode);
        this._spawnTraffic(params, dt);

        let totalSpeed = 0.0;
        let carCount = 0;

        // Update vehicle physics and remove vehicles that exit the road.
        for (let d = 0; d < this.roadKeys.length; d += 1) {
            const direction = this.roadKeys[d];
            const lanes = this.roads[direction];
            const isGreen = this._isGreen(direction);
            const intersectionBlocked = this._isIntersectionBlockedGroup([direction]);

            for (let laneIdx = 0; laneIdx < lanes.length; laneIdx += 1) {
                const cars = lanes[laneIdx];
                const stopTarget = (!isGreen || intersectionBlocked) ? STOP_LINE : null;

                let leader = null;
                for (let i = 0; i < cars.length; i += 1) {
                    const car = cars[i];
                    car.updatePhysics(dt, leader, stopTarget, friction);
                    totalSpeed += car.speed;
                    carCount += 1;
                    leader = car;
                }

                if (cars.length > 0) {
                    let finishedCount = 0;
                    for (let i = 0; i < cars.length; i += 1) {
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
            }
        }

        if (carCount > 0) {
            this.metrics.avg_speed = Math.floor(totalSpeed / carCount);
        }

        return this.getState();
    }

    _updateLights(mode) {
        const isFixed = mode === 'fixed';
        const GREEN_DUR = isFixed ? 18 : 12;
        const YELLOW_DUR = isFixed ? 3 : 2;
        const RED_DUR = isFixed ? 2 : 4;

        switch (this.state) {
            case 'N_GREEN':
                if (this.timer > GREEN_DUR) { this.state = 'N_YELLOW'; this.timer = 0; }
                break;
            case 'N_YELLOW':
                if (this.timer > YELLOW_DUR) { this.state = 'N_ALL_RED'; this.timer = 0; }
                break;
            case 'N_ALL_RED':
                if ((!isFixed && this._isClear(['north'])) || this.timer > RED_DUR) { this.state = 'S_GREEN'; this.timer = 0; }
                break;

            case 'S_GREEN':
                if (this.timer > GREEN_DUR) { this.state = 'S_YELLOW'; this.timer = 0; }
                break;
            case 'S_YELLOW':
                if (this.timer > YELLOW_DUR) { this.state = 'S_ALL_RED'; this.timer = 0; }
                break;
            case 'S_ALL_RED':
                if ((!isFixed && this._isClear(['south'])) || this.timer > RED_DUR) { this.state = 'E_GREEN'; this.timer = 0; }
                break;

            case 'E_GREEN':
                if (this.timer > GREEN_DUR) { this.state = 'E_YELLOW'; this.timer = 0; }
                break;
            case 'E_YELLOW':
                if (this.timer > YELLOW_DUR) { this.state = 'E_ALL_RED'; this.timer = 0; }
                break;
            case 'E_ALL_RED':
                if ((!isFixed && this._isClear(['east'])) || this.timer > RED_DUR) { this.state = 'W_GREEN'; this.timer = 0; }
                break;

            case 'W_GREEN':
                if (this.timer > GREEN_DUR) { this.state = 'W_YELLOW'; this.timer = 0; }
                break;
            case 'W_YELLOW':
                if (this.timer > YELLOW_DUR) { this.state = 'W_ALL_RED'; this.timer = 0; }
                break;
            case 'W_ALL_RED':
                if ((!isFixed && this._isClear(['west'])) || this.timer > RED_DUR) { this.state = 'N_GREEN'; this.timer = 0; }
                break;
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
        for (let i = 0; i < this.roadKeys.length; i += 1) {
            const direction = this.roadKeys[i];
            let rate = (direction === 'north' || direction === 'south')
                ? params.arrival_rate_ns
                : params.arrival_rate_ew;
            if (params.weather === 'rain') {
                rate *= 0.8;
            }
            if (Math.random() < (rate * dt)) {
                this.trySpawn(direction, Math.floor(Math.random() * 3));
            }
        }
    }

    _isGreen(direction) {
        if (this.state === 'N_GREEN' && direction === 'north') return true;
        if (this.state === 'S_GREEN' && direction === 'south') return true;
        if (this.state === 'E_GREEN' && direction === 'east') return true;
        if (this.state === 'W_GREEN' && direction === 'west') return true;
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

        // Assign a route based on lane: inner (lane 2) = Left, middle (lane 1) = Straight, outer (lane 0) = Right
        let routes, routeProbs;
        if (laneIdx === 2) {
            routes = ['straight', 'left'];
            routeProbs = [0.60, 0.40];
        } else if (laneIdx === 0) {
            routes = ['straight', 'right'];
            routeProbs = [0.60, 0.40];
        } else {
            routes = ['straight'];
            routeProbs = [1.0];
        }
        const route = weightedRandomChoice(routes, routeProbs);

        const vType = weightedRandomChoice(types, probs);
        laneCars.push(VehicleAgent.spawn(this.globalId, vType, laneIdx, route, direction));
    }

    getState() {
        // Build a plain JSON snapshot for React rendering.
        const jsonRoads = { north: [[], [], []], south: [[], [], []], east: [[], [], []], west: [[], [], []] };
        for (let d = 0; d < this.roadKeys.length; d += 1) {
            const dir = this.roadKeys[d];
            const lanes = this.roads[dir];
            for (let i = 0; i < lanes.length; i += 1) {
                const lane = lanes[i];
                const out = new Array(lane.length);
                for (let j = 0; j < lane.length; j += 1) {
                    const c = lane[j];
                    out[j] = {
                        id: c.id,
                        pos: c.pos,
                        type: c.type,
                        status: c.status,
                        lane: c.lane,
                        x: c.x,
                        y: c.y,
                        angle: c.angle,
                        route: c.route
                    };
                }
                jsonRoads[dir][i] = out;
            }
        }
        return { light_state: this.state, roads: jsonRoads, metrics: this.metrics };
    }
}
