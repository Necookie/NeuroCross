import math
import random
from dataclasses import dataclass

from config import (
    ACCEL_MAX,
    DECEL_COMF,
    MIN_GAP,
    SAFE_HEADWAY,
    VEHICLE_SPECS,
)


@dataclass(slots=True)
class VehicleAgent:
    id: int
    type: str
    lane: int
    pos: float
    length: float
    aggression: float
    v_desired: float
    speed: float
    status: str

    @classmethod
    def spawn(cls, v_id: int, type_name: str, lane_idx: int) -> "VehicleAgent":
        length = VEHICLE_SPECS[type_name]["len"]
        aggression = random.uniform(0.1, 0.9)
        v_desired = VEHICLE_SPECS[type_name]["v_max"] * (0.8 + (aggression * 0.3))
        speed = v_desired * 0.6
        return cls(
            id=v_id,
            type=type_name,
            lane=lane_idx,
            pos=0.0,
            length=length,
            aggression=aggression,
            v_desired=v_desired,
            speed=speed,
            status="moving",
        )

    def update_physics(self, dt: float, leader: "VehicleAgent | None", stop_target: float | None, friction: float) -> None:
        gap = 1000.0
        target_speed = 0.0

        if leader is not None:
            dist_to_leader = (leader.pos - leader.length / 2) - (self.pos + self.length / 2)
            if dist_to_leader < gap:
                gap = dist_to_leader
                target_speed = leader.speed

        if stop_target is not None:
            dist_to_line = stop_target - (self.pos + self.length / 2)
            if 0 < dist_to_line < gap:
                gap = dist_to_line
                target_speed = 0.0

        s0 = MIN_GAP + (1.0 - self.aggression)
        delta_v = self.speed - target_speed
        s_star = s0 + (self.speed * SAFE_HEADWAY) + (
            (self.speed * delta_v) / (2.0 * math.sqrt(ACCEL_MAX * DECEL_COMF))
        )

        safe_gap = max(0.1, gap)
        acc = ACCEL_MAX * (1 - (self.speed / self.v_desired) ** 4 - (s_star / safe_gap) ** 2)

        if acc < 0:
            acc *= friction

        self.speed = max(0.0, self.speed + acc * dt)
        self.pos += self.speed * dt

        if leader is not None:
            actual_gap = (leader.pos - leader.length / 2) - (self.pos + self.length / 2)
            if actual_gap < 0.5:
                self.speed = 0.0
                self.pos = leader.pos - leader.length / 2 - self.length / 2 - 0.5
                self.status = "stopped"
                return

        if stop_target is not None:
            dist_to_line = stop_target - (self.pos + self.length / 2)
            if 0 > dist_to_line > -2.0:
                self.speed = 0.0
                self.pos = stop_target - self.length / 2
                self.status = "stopped"
                return

        if self.speed < 1:
            self.status = "stopped"
        elif acc < -1.5:
            self.status = "slowing"
        else:
            self.status = "moving"
