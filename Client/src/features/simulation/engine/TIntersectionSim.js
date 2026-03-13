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

export class TIntersectionSim {
  constructor() {
    this.intersection = {
      roads: { north: [[], []], south: [[], []], east: [[], []], west: [[], []] },
      state: 'N_GREEN',
      timer: 0.0,
    };
    this.roadKeys = ['north', 'south', 'east', 'west'];
    this.activeRoadKeys = ['north', 'east', 'west']; // T-junction: no top approach
    this.metrics = { accidents: 0, throughput: 0, avg_speed: 0 };
    this.globalId = 0;
  }

  step(params) {
    const dt = 0.1;
    const friction = params.weather === 'rain' ? 0.6 : 1.0;
    const ix = this.intersection;
    ix.timer += dt;

    let totalSpeed = 0;
    let carCount = 0;

    this._updateLights(ix, params.mode);
    this._spawnTraffic(ix, params, dt);

    for (const direction of this.roadKeys) {
      const lanes = ix.roads[direction];
      const isActiveRoad = this.activeRoadKeys.includes(direction);
      const isGreen = this._isGreen(ix, direction);
      const blocked = this._isBlocked(ix, direction);

      for (let laneIdx = 0; laneIdx < lanes.length; laneIdx++) {
        const cars = lanes[laneIdx];
        const stopTarget = (!isActiveRoad || !isGreen || blocked) ? STOP_LINE : null;

        let leader = null;
        for (let i = 0; i < cars.length; i++) {
          cars[i].pathMode = 'tintersection';
          cars[i].singleRoundabout = false;
          cars[i].updatePhysics(dt, leader, stopTarget, friction);
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

    if (carCount > 0) {
      this.metrics.avg_speed = Math.floor(totalSpeed / carCount);
    }

    return this.getState();
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
        if ((!isFixed && this._isClear(ix, ['north'])) || ix.timer > RED_DUR) { ix.state = 'E_GREEN'; ix.timer = 0; }
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
      default:
        ix.state = 'N_GREEN';
        ix.timer = 0;
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
    if (ix.state === 'E_GREEN' && direction === 'east') return true;
    if (ix.state === 'W_GREEN' && direction === 'west') return true;
    return false;
  }

  _isBlocked(ix, direction) {
    if (!this.activeRoadKeys.includes(direction)) return true;
    const lanes = ix.roads[direction];
    for (const lane of lanes) {
      for (const car of lane) {
        if (car.pos > STOP_LINE && car.pos < INTERSECTION_EXIT && car.speed < 5) return true;
      }
    }
    return false;
  }

  _spawnTraffic(ix, params, dt) {
    for (const direction of this.activeRoadKeys) {
      let rate = direction === 'north' ? params.arrival_rate_ns : params.arrival_rate_ew;
      if (params.weather === 'rain') rate *= 0.8;

      if (Math.random() < (rate * dt)) {
        let laneIdx = Math.floor(Math.random() * 2);
        // Keep lane/route combinations on available T exits only.
        if (direction === 'east' && laneIdx === 1) laneIdx = 0; // avoid east->north turn
        if (direction === 'west' && laneIdx === 0) laneIdx = 1; // avoid west->north turn
        this._trySpawn(ix, direction, laneIdx);
      }
    }
  }

  _trySpawn(ix, direction, laneIdx) {
    const laneCars = ix.roads[direction][laneIdx];
    const minSpawnGap = 40;
    for (const car of laneCars) {
      if ((car.pos - car.length / 2) < minSpawnGap) return;
    }

    this.globalId++;
    const types = Object.keys(VEHICLE_SPECS);
    const probs = types.map((t) => VEHICLE_SPECS[t].prob);

    let routes;
    let routeProbs;
    if (direction === 'east') {
      routes = ['straight', 'right'];
      routeProbs = [0.65, 0.35];
    } else if (direction === 'west') {
      routes = ['straight', 'left'];
      routeProbs = [0.65, 0.35];
    } else {
      // From south stem, do not allow straight-to-missing-top arm.
      routes = ['left', 'right'];
      routeProbs = [0.5, 0.5];
    }

    const route = weightedRandomChoice(routes, routeProbs);
    const vType = weightedRandomChoice(types, probs);

    const car = VehicleAgent.spawn(this.globalId, vType, laneIdx, route, direction, 0);
    car.pathMode = 'tintersection';
    car.singleRoundabout = false;
    laneCars.push(car);
  }

  getState() {
    const jsonRoads = { north: [[], []], south: [[], []], east: [[], []], west: [[], []] };

    for (const dir of this.roadKeys) {
      const lanes = this.intersection.roads[dir];
      for (let i = 0; i < lanes.length; i++) {
        jsonRoads[dir][i] = lanes[i].map((c) => ({
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

    return {
      intersections: [{ light_state: this.intersection.state, roads: jsonRoads }],
      metrics: this.metrics,
    };
  }
}
