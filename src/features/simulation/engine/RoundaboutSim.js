import {
  RAIN_HEADWAY_FACTOR,
  ROAD_LENGTH,
  ROUNDABOUT_MIN_RING_GAP_DEG,
  ROUNDABOUT_YIELD_WINDOW_DEG,
  STOP_LINE,
  VEHICLE_SPECS,
} from './config';
import { VehicleAgent, getRoundaboutEntryThetaDeg } from './VehicleAgent';

function weightedRandomChoice(choices, weights) {
  const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
  let randomNum = Math.random() * totalWeight;
  for (let i = 0; i < choices.length; i++) {
    if (randomNum < weights[i]) return choices[i];
    randomNum -= weights[i];
  }
  return choices[choices.length - 1];
}

const ENTRY_THETA = {
  north: getRoundaboutEntryThetaDeg('north'),
  south: getRoundaboutEntryThetaDeg('south'),
  east: getRoundaboutEntryThetaDeg('east'),
  west: getRoundaboutEntryThetaDeg('west'),
};

// Forward angular distance (0-360) from `from` to `to`, walking the same way
// traffic circulates (theta increasing). 0 means "exactly there".
function angleAheadDeg(from, to) {
  return (((to - from) % 360) + 360) % 360;
}

/**
 * RoundaboutSim models a real yield-controlled roundabout: there is no
 * traffic signal cycle. Vehicles already circulating always have the
 * right of way; traffic waiting to enter a leg only pulls out once no
 * circulating vehicle is closing in on that leg's merge point within a
 * safe gap-acceptance window (ROUNDABOUT_YIELD_WINDOW_DEG).
 */
export class RoundaboutSim {
  constructor() {
    this.intersection = {
      roads: { north: [[], []], south: [[], []], east: [[], []], west: [[], []] },
    };
    this.roadKeys = ['north', 'south', 'east', 'west'];
    this.globalId = 0;
    this.metrics = { accidents: 0, throughput: 0, avg_speed: 0 };
  }

  step(params) {
    const dt = 0.1;
    const friction = params.weather === 'rain' ? 0.6 : 1.0;
    // Cautious drivers demand a bigger gap before merging in the wet.
    const yieldWindow = ROUNDABOUT_YIELD_WINDOW_DEG * (friction < 1 ? RAIN_HEADWAY_FACTOR : 1.0);

    let totalSpeed = 0;
    let carCount = 0;

    const ix = this.intersection;

    this._normalizeRoundaboutLanes(ix);
    this._spawnTraffic(ix, params, dt);

    // Resolve each leg's yield state once per tick, from the ring state as
    // it stood at the start of the tick.
    const canEnter = {};
    for (const direction of this.roadKeys) {
      canEnter[direction] = this._hasClearGap(ix, ENTRY_THETA[direction], yieldWindow);
    }

    for (const direction of this.roadKeys) {
      const lanes = ix.roads[direction];

      for (let laneIdx = 0; laneIdx < lanes.length; laneIdx++) {
        const cars = lanes[laneIdx];
        const stopTarget = canEnter[direction] ? null : STOP_LINE;

        let leader = null;
        for (let i = 0; i < cars.length; i++) {
          cars[i].pathMode = 'roundabout';
          cars[i].singleRoundabout = true;
          cars[i].updatePhysics(dt, leader, stopTarget, friction);
          if (cars[i].emergencyBrake) this.metrics.accidents += 1;
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

    // Cars merged in from different legs share one physical ring but live in
    // separate per-leg arrays, so ordinary leader-follow never compares two
    // different legs' traffic against each other. Close that gap here: cap
    // the trailing vehicle's speed whenever it is riding too close to
    // whoever is physically ahead of it on the ring, no matter which leg
    // that vehicle entered from.
    this._enforceRingSpacing(ix);

    if (carCount > 0) {
      this.metrics.avg_speed = Math.floor(totalSpeed / carCount);
    } else {
      this.metrics.avg_speed = 0;
    }

    return this.getState(canEnter);
  }

  // Is `entryTheta` clear to merge into right now? Blocked whenever a
  // circulating vehicle - from any leg - is within `windowDeg` of arriving
  // at that point, i.e. give way to traffic already on the roundabout.
  _hasClearGap(ix, entryTheta, windowDeg) {
    for (const direction of this.roadKeys) {
      for (const lane of ix.roads[direction]) {
        for (const car of lane) {
          if (!car._onRing) continue;
          const closingDistDeg = angleAheadDeg(car._ringTheta, entryTheta);
          if (closingDistDeg > 0 && closingDistDeg <= windowDeg) return false;
        }
      }
    }
    return true;
  }

  _enforceRingSpacing(ix) {
    const circulating = [];
    for (const direction of this.roadKeys) {
      for (const lane of ix.roads[direction]) {
        for (const car of lane) {
          if (car._onRing) circulating.push(car);
        }
      }
    }
    if (circulating.length < 2) return;

    circulating.sort((a, b) => a._ringTheta - b._ringTheta);
    for (let i = 0; i < circulating.length; i++) {
      const car = circulating[i];
      const ahead = circulating[(i + 1) % circulating.length];
      if (ahead === car) continue;

      const gapDeg = angleAheadDeg(car._ringTheta, ahead._ringTheta);
      if (gapDeg > 0 && gapDeg < ROUNDABOUT_MIN_RING_GAP_DEG && car.speed > ahead.speed) {
        car.speed = ahead.speed;
        car.emergencyBrake = true;
      }
    }
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

  getState(canEnter = {}) {
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

    // Per-leg yield indicator: GREEN = clear to merge now, RED = give way.
    // Real roundabouts have no signal cycle, so there is no YELLOW phase.
    const lightState = {};
    for (const dir of this.roadKeys) {
      lightState[dir] = canEnter[dir] === false ? 'RED' : 'GREEN';
    }

    return {
      intersections: [{ light_state: lightState, roads: jsonRoads }],
      metrics: this.metrics,
    };
  }
}
