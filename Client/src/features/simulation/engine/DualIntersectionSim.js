import {
    INTERSECTION_EXIT,
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
        this.intersections = [
            {
                roads: { north: [[], []], south: [[], []], east: [[], []], west: [[], []] },
                state: 'N_GREEN',
                timer: 0.0,
            },
            {
                roads: { north: [[], []], south: [[], []], east: [[], []], west: [[], []] },
                state: 'N_GREEN',
                timer: 0.0,
            },
        ];
        this.roadKeys = ['north', 'south', 'east', 'west'];
        this.globalId = 0;
        this.metrics = { accidents: 0, throughput: 0, avg_speed: 0 };
    }

    step(params) {
        const dt = 0.1;
        const friction = params.weather === 'rain' ? 0.6 : 1.0;

        let totalSpeed = 0;
        let carCount = 0;

        // Collect pending transfers so they are applied AFTER both intersections
        // have been processed, preventing double-updates in the same tick.
        const pendingTransfers = [];

        for (let intIdx = 0; intIdx < 2; intIdx++) {
            const ix = this.intersections[intIdx];
            ix.timer += dt;

            this._updateLights(ix, params.mode);
            this._spawnTraffic(ix, intIdx, params, dt);

            for (const direction of this.roadKeys) {
                const lanes = ix.roads[direction];
                const isGreen = this._isGreen(ix, direction);
                const blocked = this._isBlocked(ix, direction);

                for (let laneIdx = 0; laneIdx < lanes.length; laneIdx++) {
                    const cars = lanes[laneIdx];
                    const stopTarget = (!isGreen || blocked) ? STOP_LINE : null;

                    let leader = null;
                    for (let i = 0; i < cars.length; i++) {
                        // Cap transfer-waiting cars at road end so they don't fly off
                        if (cars[i].pos >= ROAD_LENGTH && this._canTransferVehicle(intIdx, cars[i], direction)) {
                            cars[i].pos = ROAD_LENGTH;
                            cars[i].speed = 0;
                            cars[i]._update2DCoords();
                            leader = cars[i];
                            continue;
                        }
                        cars[i].updatePhysics(dt, leader, stopTarget, friction);
                        totalSpeed += cars[i].speed;
                        carCount++;
                        leader = cars[i];
                    }

                    // Remove finished vehicles / queue transfers
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
                            // Separate transferable vs non-transferable finished vehicles
                            const toRemove = [];
                            for (let i = 0; i < finishedCount; i++) {
                                if (this._canTransferVehicle(intIdx, cars[i], direction)) {
                                    pendingTransfers.push({
                                        car: cars[i],
                                        fromIntIdx: intIdx,
                                        exitDirection: this._getExitDirection(direction, cars[i].route),
                                        laneRef: lanes,
                                        laneIdx,
                                    });
                                } else {
                                    toRemove.push(i);
                                }
                            }
                            // Remove non-transferable vehicles (iterate in reverse to preserve indices)
                            for (let r = toRemove.length - 1; r >= 0; r--) {
                                cars.splice(toRemove[r], 1);
                                this.metrics.throughput++;
                            }
                        }
                    }
                }
            }
        }

        // Apply deferred transfers — only remove from source on success
        for (const { car, fromIntIdx, exitDirection, laneRef, laneIdx } of pendingTransfers) {
            if (this._applyTransfer(car, fromIntIdx, exitDirection)) {
                const srcLane = laneRef[laneIdx];
                const idx = srcLane.indexOf(car);
                if (idx !== -1) srcLane.splice(idx, 1);
            }
            // If transfer fails, car stays in source lane and retries next tick
        }

        if (carCount > 0) {
            this.metrics.avg_speed = Math.floor(totalSpeed / carCount);
        }

        return this.getState();
    }

    _getExitDirection(direction, route) {
        if (route === 'straight') return direction;
        const turns = {
            north: { left: 'west', right: 'east' },
            south: { left: 'east', right: 'west' },
            east: { left: 'north', right: 'south' },
            west: { left: 'south', right: 'north' },
        };
        return turns[direction][route];
    }

    _canTransfer(fromIntIdx, direction) {
        if (direction === 'east' && fromIntIdx === 0) return true;
        if (direction === 'west' && fromIntIdx === 1) return true;
        return false;
    }

    _canTransferVehicle(fromIntIdx, car, roadDirection) {
        const exitDir = this._getExitDirection(roadDirection, car.route);
        return this._canTransfer(fromIntIdx, exitDir);
    }

    _applyTransfer(car, fromIntIdx, exitDirection) {
        // East vehicles exiting int 0 → enter int 1's east road
        if (exitDirection === 'east' && fromIntIdx === 0) {
            const targetLane = this.intersections[1].roads.east[car.lane];
            for (const c of targetLane) {
                if ((c.pos - c.length / 2) < 25) return false;
            }
            car.pos = 0;
            car.speed *= 0.9;
            car.intersectionIdx = 1;
            car.direction = 'east';
            car.route = 'straight';
            car._update2DCoords();
            targetLane.push(car);
            return true;
        }
        // West vehicles exiting int 1 → enter int 0's west road
        if (exitDirection === 'west' && fromIntIdx === 1) {
            const targetLane = this.intersections[0].roads.west[car.lane];
            for (const c of targetLane) {
                if ((c.pos - c.length / 2) < 25) return false;
            }
            car.pos = 0;
            car.speed *= 0.9;
            car.intersectionIdx = 0;
            car.direction = 'west';
            car.route = 'straight';
            car._update2DCoords();
            targetLane.push(car);
            return true;
        }
        return false;
    }

    _updateLights(ix, mode) {
        const isFixed = mode === 'fixed';
        const GREEN_DUR = isFixed ? 18 : 12;
        const YELLOW_DUR = isFixed ? 3 : 2;
        const RED_DUR = isFixed ? 2 : 4;

        switch (ix.state) {
            case 'N_GREEN':
                if (ix.timer > GREEN_DUR) { ix.state = 'N_YELLOW'; ix.timer = 0; }
                break;
            case 'N_YELLOW':
                if (ix.timer > YELLOW_DUR) { ix.state = 'N_ALL_RED'; ix.timer = 0; }
                break;
            case 'N_ALL_RED':
                if ((!isFixed && this._isClear(ix, ['north'])) || ix.timer > RED_DUR) { ix.state = 'S_GREEN'; ix.timer = 0; }
                break;
            case 'S_GREEN':
                if (ix.timer > GREEN_DUR) { ix.state = 'S_YELLOW'; ix.timer = 0; }
                break;
            case 'S_YELLOW':
                if (ix.timer > YELLOW_DUR) { ix.state = 'S_ALL_RED'; ix.timer = 0; }
                break;
            case 'S_ALL_RED':
                if ((!isFixed && this._isClear(ix, ['south'])) || ix.timer > RED_DUR) { ix.state = 'E_GREEN'; ix.timer = 0; }
                break;
            case 'E_GREEN':
                if (ix.timer > GREEN_DUR) { ix.state = 'E_YELLOW'; ix.timer = 0; }
                break;
            case 'E_YELLOW':
                if (ix.timer > YELLOW_DUR) { ix.state = 'E_ALL_RED'; ix.timer = 0; }
                break;
            case 'E_ALL_RED':
                if ((!isFixed && this._isClear(ix, ['east'])) || ix.timer > RED_DUR) { ix.state = 'W_GREEN'; ix.timer = 0; }
                break;
            case 'W_GREEN':
                if (ix.timer > GREEN_DUR) { ix.state = 'W_YELLOW'; ix.timer = 0; }
                break;
            case 'W_YELLOW':
                if (ix.timer > YELLOW_DUR) { ix.state = 'W_ALL_RED'; ix.timer = 0; }
                break;
            case 'W_ALL_RED':
                if ((!isFixed && this._isClear(ix, ['west'])) || ix.timer > RED_DUR) { ix.state = 'N_GREEN'; ix.timer = 0; }
                break;
        }
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

    _spawnTraffic(ix, intIdx, params, dt) {
        for (const direction of this.roadKeys) {
            // Don't externally spawn directions fed by transfers
            if (intIdx === 0 && direction === 'west') continue;
            if (intIdx === 1 && direction === 'east') continue;

            let rate = (direction === 'north' || direction === 'south')
                ? params.arrival_rate_ns
                : params.arrival_rate_ew;
            if (params.weather === 'rain') rate *= 0.8;

            if (Math.random() < (rate * dt)) {
                this._trySpawn(ix, intIdx, direction, Math.floor(Math.random() * 2));
            }
        }
    }

    _trySpawn(ix, intIdx, direction, laneIdx) {
        const laneCars = ix.roads[direction][laneIdx];
        for (const car of laneCars) {
            if ((car.pos - car.length / 2) < 25) return;
        }

        this.globalId++;
        const types = Object.keys(VEHICLE_SPECS);
        const probs = types.map(t => VEHICLE_SPECS[t].prob);

        // 2 lanes: lane 0 = outer (straight/right), lane 1 = inner (straight/left)
        let routes, routeProbs;
        if (laneIdx === 1) {
            routes = ['straight', 'left'];
            routeProbs = [0.65, 0.35];
        } else {
            routes = ['straight', 'right'];
            routeProbs = [0.65, 0.35];
        }
        const route = weightedRandomChoice(routes, routeProbs);
        const vType = weightedRandomChoice(types, probs);

        laneCars.push(VehicleAgent.spawn(this.globalId, vType, laneIdx, route, direction, intIdx));
    }

    getState() {
        const out = {
            intersections: [],
            metrics: this.metrics,
        };

        for (let intIdx = 0; intIdx < 2; intIdx++) {
            const ix = this.intersections[intIdx];
            const jsonRoads = { north: [[], []], south: [[], []], east: [[], []], west: [[], []] };

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
                    }));
                }
            }

            out.intersections.push({ light_state: ix.state, roads: jsonRoads });
        }

        return out;
    }
}
