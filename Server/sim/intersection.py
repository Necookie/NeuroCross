import random
from typing import Dict, List

from config import INTERSECTION_EXIT, ROAD_LENGTH, STOP_LINE, VEHICLE_SPECS
from models import SimParams
from sim.vehicle import VehicleAgent


class IntersectionSim:
    def __init__(self) -> None:
        self.roads: Dict[str, List[List[VehicleAgent]]] = {d: [[], []] for d in ["north", "south", "east", "west"]}
        self.state = "NS_GREEN"
        self.timer = 0.0
        self.global_id = 0
        self.metrics = {"accidents": 0, "throughput": 0, "avg_speed": 0}

    def step(self, params: SimParams) -> dict:
        dt = 0.1
        self.timer += dt
        friction = 0.6 if params.weather == "rain" else 1.0

        self._update_lights()
        self._spawn_traffic(params, dt)

        blocked_ns = self._is_intersection_blocked_group(["north", "south"])
        blocked_ew = self._is_intersection_blocked_group(["east", "west"])

        total_speed = 0.0
        car_count = 0

        for direction, lanes in self.roads.items():
            is_green = self._is_green(direction)
            intersection_blocked = blocked_ns if direction in ["north", "south"] else blocked_ew

            for lane_idx, cars in enumerate(lanes):
                stop_target = STOP_LINE if (not is_green or intersection_blocked) else None

                leader = None
                for car in cars:
                    car.update_physics(dt, leader, stop_target, friction)
                    total_speed += car.speed
                    car_count += 1
                    leader = car

                if cars:
                    finished_count = 0
                    for car in cars:
                        if car.pos >= ROAD_LENGTH:
                            finished_count += 1
                        else:
                            break

                    if finished_count:
                        self.metrics["throughput"] += finished_count
                        self.roads[direction][lane_idx] = cars[finished_count:]

        if car_count > 0:
            self.metrics["avg_speed"] = int(total_speed / car_count)

        return self.get_state()

    def _update_lights(self) -> None:
        if self.state == "NS_GREEN" and self.timer > 8:
            self.state = "NS_YELLOW"
            self.timer = 0
        elif self.state == "NS_YELLOW" and self.timer > 2:
            self.state = "ALL_RED_NS_TO_EW"
            self.timer = 0
        elif self.state == "ALL_RED_NS_TO_EW":
            if self._is_clear(["north", "south"]) or self.timer > 5:
                self.state = "EW_GREEN"
                self.timer = 0
        elif self.state == "EW_GREEN" and self.timer > 8:
            self.state = "EW_YELLOW"
            self.timer = 0
        elif self.state == "EW_YELLOW" and self.timer > 2:
            self.state = "ALL_RED_EW_TO_NS"
            self.timer = 0
        elif self.state == "ALL_RED_EW_TO_NS":
            if self._is_clear(["east", "west"]) or self.timer > 5:
                self.state = "NS_GREEN"
                self.timer = 0

    def _is_clear(self, directions: list[str]) -> bool:
        for d in directions:
            for lane in self.roads[d]:
                for car in lane:
                    if STOP_LINE < car.pos < INTERSECTION_EXIT:
                        return False
        return True

    def _spawn_traffic(self, params: SimParams, dt: float) -> None:
        for direction in self.roads.keys():
            rate = params.arrival_rate_ns if direction in ["north", "south"] else params.arrival_rate_ew
            if params.weather == "rain":
                rate *= 0.8
            if random.random() < (rate * dt):
                self.try_spawn(direction, random.choice([0, 1]))

    def _is_green(self, direction: str) -> bool:
        if self.state == "NS_GREEN" and direction in ["north", "south"]:
            return True
        if self.state == "EW_GREEN" and direction in ["east", "west"]:
            return True
        return False

    def _is_intersection_blocked_group(self, directions: list[str]) -> bool:
        for direction in directions:
            lanes = self.roads[direction]
            for lane in lanes:
                for car in lane:
                    if STOP_LINE < car.pos < INTERSECTION_EXIT and car.speed < 5:
                        return True
        return False

    def try_spawn(self, direction: str, lane_idx: int) -> None:
        lane_cars = self.roads[direction][lane_idx]
        for car in lane_cars:
            if (car.pos - car.length / 2) < 25:
                return

        self.global_id += 1
        types = list(VEHICLE_SPECS.keys())
        probs = [VEHICLE_SPECS[t]["prob"] for t in types]
        v_type = random.choices(types, weights=probs, k=1)[0]
        lane_cars.append(VehicleAgent.spawn(self.global_id, v_type, lane_idx))

    def get_state(self) -> dict:
        json_roads = {d: [[], []] for d in self.roads}
        for d, lanes in self.roads.items():
            for i, lane in enumerate(lanes):
                json_roads[d][i] = [
                    {"id": c.id, "pos": c.pos, "type": c.type, "status": c.status, "lane": c.lane} for c in lane
                ]
        return {"light_state": self.state, "roads": json_roads, "metrics": self.metrics}
