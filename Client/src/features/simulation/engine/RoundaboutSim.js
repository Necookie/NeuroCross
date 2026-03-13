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

export class RoundaboutSim {
  constructor() {
    this.intersection = {
      roads: { north: [[], []], south: [[], []], east: [[], []], west: [[], []] },
      state: 'N_GREEN',
      timer: 0.0,
    };
    this.roadKeys = ['north', 'south', 'east', 'west'];
    this.globalId = 0;
    this.metrics = { accidents: 0, throughput: 0, avg_speed: 0 };
  }

  step(params) {
    const dt = 0.1;
    const friction = params.weather === 'rain' ? 0.6 : 1.0;

    let totalSpeed = 0;
    let carCount = 0;

    const ix = this.intersection;
    ix.timer += dt;

    this._normalizeRoundaboutLanes(ix);
    this._updateLights(ix, params.mode);
    this._spawnTraffic(ix, params, dt);

    for (const direction of this.roadKeys) {
      const lanes = ix.roads[direction];
      const isGreen = this._isGreen(ix, direction);
      const blocked = this._isBlocked(ix);

      for (let laneIdx = 0; laneIdx < lanes.length; laneIdx++) {
        const cars = lanes[laneIdx];
        const stopTarget = (!isGreen || blocked) ? STOP_LINE : null;

        let leader = null;
        for (let i = 0; i < cars.length; i++) {
          cars[i].pathMode = 'roundabout';
          cars[i].singleRoundabout = true;
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
    } else {
      this.metrics.avg_speed = 0;
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

  _isBlocked(ix) {
    for (const dir of this.roadKeys) {
      const lanes = ix.roads[dir];
      for (const lane of lanes) {
        for (const car of lane) {
          if (car.pos > STOP_LINE && car.pos < INTERSECTION_EXIT) return true;
        }
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
        this._trySpawn(ix, direction, 0);
      }
    }
  }

  _trySpawn(ix, direction, laneIdx) {
    const laneCars = ix.roads[direction][laneIdx];
    const minSpawnGap = 58;
    for (const car of laneCars) {
      if ((car.pos - car.length / 2) < minSpawnGap) return;
    }

    this.globalId++;
    const types = Object.keys(VEHICLE_SPECS);
    const probs = types.map((t) => VEHICLE_SPECS[t].prob);

    const routes = ['straight', 'left', 'right'];
    const routeProbs = [0.5, 0.3, 0.2];
    const route = weightedRandomChoice(routes, routeProbs);
    const vType = weightedRandomChoice(types, probs);

    const car = VehicleAgent.spawn(this.globalId, vType, laneIdx, route, direction, 0);
    car.pathMode = 'roundabout';
    car.singleRoundabout = true;
    laneCars.push(car);
  }

  _normalizeRoundaboutLanes(ix) {
    for (const direction of this.roadKeys) {
      const lanes = ix.roads[direction];
      if (lanes[1].length === 0) continue;

      for (const car of lanes[1]) {
        car.lane = 0;
      }

      lanes[0] = lanes[0].concat(lanes[1]);
      lanes[1] = [];
      lanes[0].sort((a, b) => b.pos - a.pos);
    }
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
