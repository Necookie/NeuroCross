import {
    INTERSECTION_EXIT,
    RAIN_BRAKE_GRIP,
    ROAD_LENGTH,
    STOP_LINE,
    VEHICLE_SPECS,
} from './config';
import { VehicleAgent } from './VehicleAgent';

function weightedRandomChoice(choices, weights) {
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    let randomNum = Math.random() * totalWeight;
    for (let i = 0; i < choices.length; i++) {
        if (randomNum < weights[i]) return choices[i];
        randomNum -= weights[i];
    }
    return choices[choices.length - 1];
}

export class DualIntersectionSim {
    constructor() {
        this.intersection = {
            roads: { north: [[], []], south: [[], []], east: [[], []], west: [[], []] },
            state: 'N_GREEN',
            timer: 0.0,
            phaseTime: 0.0,
        };
        this.roadKeys = ['north', 'south', 'east', 'west'];
        this.globalId = 0;
        this.metrics = { accidents: 0, throughput: 0, avg_speed: 0, active_count: 0, efficiency: 98, wait_time: 0 };
    }

    step(params) {
        const dt = 0.1;
        const friction = params.weather === 'rain' ? RAIN_BRAKE_GRIP : 1.0;
        const ix = this.intersection;
        ix.timer += dt;
        ix.phaseTime += dt;

        let totalSpeed = 0;
        let carCount = 0;
        let stoppedCount = 0;

        this._updateLights(ix, params.mode);
        this._spawnTraffic(ix, params, dt);

        for (const direction of this.roadKeys) {
            const lanes = ix.roads[direction];
            const isGreen = this._isGreen(ix, direction);
            const blocked = this._isBlocked(ix, direction);

            for (let laneIdx = 0; laneIdx < lanes.length; laneIdx++) {
                const cars = lanes[laneIdx];
                const stopTarget = (!isGreen || blocked) ? STOP_LINE : null;

                let leader = null;
                for (let i = 0; i < cars.length; i++) {
                    cars[i].pathMode = 'cross';
                    cars[i].singleRoundabout = false;
                    cars[i].singleCross = true;
                    cars[i].updatePhysics(dt, leader, stopTarget, friction);
                    if (cars[i].emergencyBrake) this.metrics.accidents += 1;
                    if (cars[i].speed < 1.5) stoppedCount += 1;
                    totalSpeed += cars[i].speed;
                    carCount++;
                    leader = cars[i];
                }

                if (cars.length > 0) {
                    let finishedCount = 0;
                    for (let i = 0; i < cars.length; i++) {
                        if (cars[i].pos >= ROAD_LENGTH) {
                            finishedCount++;
                        } else {
                            break;
                        }
                    }
                    if (finishedCount > 0) {
                        cars.splice(0, finishedCount);
                        this.metrics.throughput += finishedCount;
                    }
                }
            }
        }

        this.metrics.active_count = carCount;
        if (carCount > 0) {
            this.metrics.avg_speed = Math.floor(totalSpeed / carCount);
            const movingRatio = (carCount - stoppedCount) / carCount;
            this.metrics.efficiency = Math.min(100, Math.max(50, Math.round(movingRatio * 100)));
            this.metrics.wait_time = Number(((stoppedCount / carCount) * 12.5).toFixed(1));
        } else {
            this.metrics.avg_speed = 0;
            this.metrics.efficiency = 100;
            this.metrics.wait_time = 0.0;
        }

        return this.getState();
    }

    _updateLights(ix, mode) {
        const isSmart = mode === 'smart';
        
        // Smart adaptive timing adjusts green time dynamically based on queue length
        let greenDur = 14;
        let yellowDur = 2.5;
        let redDur = 2.0;

        if (isSmart) {
            const currentDir = this._getActiveDirection(ix.state);
            const queueAtActive = this._getQueueCount(ix, currentDir);
            // If cars are waiting, extend green up to 22s; if none, truncate to 8s
            greenDur = Math.max(7, Math.min(22, 8 + (queueAtActive * 2.2)));
        } else {
            greenDur = 16;
            yellowDur = 3.0;
            redDur = 2.5;
        }

        switch (ix.state) {
            case 'N_GREEN':
                if (ix.phaseTime > greenDur) { ix.state = 'N_YELLOW'; ix.phaseTime = 0; }
                break;
            case 'N_YELLOW':
                if (ix.phaseTime > yellowDur) { ix.state = 'N_ALL_RED'; ix.phaseTime = 0; }
                break;
            case 'N_ALL_RED':
                if ((isSmart && this._isClear(ix, ['north'])) || ix.phaseTime > redDur) { ix.state = 'S_GREEN'; ix.phaseTime = 0; }
                break;
            case 'S_GREEN':
                if (ix.phaseTime > greenDur) { ix.state = 'S_YELLOW'; ix.phaseTime = 0; }
                break;
            case 'S_YELLOW':
                if (ix.phaseTime > yellowDur) { ix.state = 'S_ALL_RED'; ix.phaseTime = 0; }
                break;
            case 'S_ALL_RED':
                if ((isSmart && this._isClear(ix, ['south'])) || ix.phaseTime > redDur) { ix.state = 'E_GREEN'; ix.phaseTime = 0; }
                break;
            case 'E_GREEN':
                if (ix.phaseTime > greenDur) { ix.state = 'E_YELLOW'; ix.phaseTime = 0; }
                break;
            case 'E_YELLOW':
                if (ix.phaseTime > yellowDur) { ix.state = 'E_ALL_RED'; ix.phaseTime = 0; }
                break;
            case 'E_ALL_RED':
                if ((isSmart && this._isClear(ix, ['east'])) || ix.phaseTime > redDur) { ix.state = 'W_GREEN'; ix.phaseTime = 0; }
                break;
            case 'W_GREEN':
                if (ix.phaseTime > greenDur) { ix.state = 'W_YELLOW'; ix.phaseTime = 0; }
                break;
            case 'W_YELLOW':
                if (ix.phaseTime > yellowDur) { ix.state = 'W_ALL_RED'; ix.phaseTime = 0; }
                break;
            case 'W_ALL_RED':
                if ((isSmart && this._isClear(ix, ['west'])) || ix.phaseTime > redDur) { ix.state = 'N_GREEN'; ix.phaseTime = 0; }
                break;
        }
    }

    _getActiveDirection(state) {
        if (state.startsWith('N_')) return 'north';
        if (state.startsWith('S_')) return 'south';
        if (state.startsWith('E_')) return 'east';
        return 'west';
    }

    _getQueueCount(ix, direction) {
        let count = 0;
        const lanes = ix.roads[direction];
        for (const lane of lanes) {
            for (const car of lane) {
                if (car.pos < STOP_LINE && car.speed < 12) count++;
            }
        }
        return count;
    }

    _isClear(ix, directions) {
        for (const d of directions) {
            for (const lane of ix.roads[d]) {
                for (const car of lane) {
                    if (car.pos > STOP_LINE && car.pos < INTERSECTION_EXIT) return false;
                }
            }
        }
        return true;
    }

    _isGreen(ix, direction) {
        if (ix.state === 'N_GREEN' && direction === 'north') return true;
        if (ix.state === 'S_GREEN' && direction === 'south') return true;
        if (ix.state === 'E_GREEN' && direction === 'east') return true;
        if (ix.state === 'W_GREEN' && direction === 'west') return true;
        return false;
    }

    _isBlocked(ix, direction) {
        const lanes = ix.roads[direction];
        for (const lane of lanes) {
            for (const car of lane) {
                if (car.pos > STOP_LINE && car.pos < INTERSECTION_EXIT && car.speed < 5) return true;
            }
        }
        return false;
    }

    _spawnTraffic(ix, params, dt) {
        for (const direction of this.roadKeys) {
            let rate = (direction === 'north' || direction === 'south')
                ? params.arrival_rate_ns
                : params.arrival_rate_ew;
            if (params.weather === 'rain') rate *= 0.8;

            if (Math.random() < (rate * dt)) {
                const laneIdx = Math.floor(Math.random() * 2);
                this._trySpawn(ix, direction, laneIdx);
            }
        }
    }

    dispatchInterceptor() {
        const ix = this.intersection;
        // Spawn an emergency interceptor vehicle on an available approach
        for (const direction of ['north', 'south', 'east', 'west']) {
            const laneIdx = 1; // inner fast lane
            const laneCars = ix.roads[direction][laneIdx];
            let clear = true;
            for (const car of laneCars) {
                if (car.pos < 50) { clear = false; break; }
            }
            if (clear) {
                this.globalId++;
                const car = VehicleAgent.spawn(this.globalId, 'interceptor', laneIdx, 'straight', direction, 0);
                car.pathMode = 'cross';
                car.singleRoundabout = false;
                car.singleCross = true;
                laneCars.push(car);
                return true;
            }
        }
        return false;
    }

    _trySpawn(ix, direction, laneIdx) {
        const laneCars = ix.roads[direction][laneIdx];
        const minSpawnGap = 42;
        for (const car of laneCars) {
            if ((car.pos - car.length / 2) < minSpawnGap) return;
        }

        this.globalId++;
        const types = Object.keys(VEHICLE_SPECS);
        const probs = types.map(t => VEHICLE_SPECS[t].prob);

        let routes;
        let routeProbs;
        if (laneIdx === 1) {
            // Lane 1 = inner (straight / left)
            routes = ['straight', 'left'];
            routeProbs = [0.65, 0.35];
        } else {
            // Lane 0 = outer (straight / right)
            routes = ['straight', 'right'];
            routeProbs = [0.65, 0.35];
        }
        const route = weightedRandomChoice(routes, routeProbs);
        const vType = weightedRandomChoice(types, probs);

        const car = VehicleAgent.spawn(this.globalId, vType, laneIdx, route, direction, 0);
        car.pathMode = 'cross';
        car.singleRoundabout = false;
        car.singleCross = true;
        laneCars.push(car);
    }

    getState() {
        const jsonRoads = { north: [[], []], south: [[], []], east: [[], []], west: [[], []] };
        const ix = this.intersection;

        for (const dir of this.roadKeys) {
            const lanes = ix.roads[dir];
            for (let i = 0; i < lanes.length; i++) {
                jsonRoads[dir][i] = lanes[i].map(c => ({
                    id: c.id,
                    pos: c.pos,
                    type: c.type,
                    status: c.status,
                    lane: c.lane,
                    x: c.x,
                    y: c.y,
                    angle: c.angle,
                    route: c.route,
                    pathMode: c.pathMode,
                    speed: Math.round(c.speed),
                    acceleration: Number(c.acceleration.toFixed(2)),
                    brakeIntensity: Number(c.brakeIntensity.toFixed(2)),
                    throttle: Number(c.throttle.toFixed(2)),
                    lateralG: c.lateralG,
                    pitch: Number(c.pitch.toFixed(1)),
                    isInterceptor: c.isInterceptor,
                    direction: c.direction,
                }));
            }
        }

        return {
            intersections: [{ light_state: ix.state, roads: jsonRoads }],
            metrics: this.metrics,
        };
    }
}

