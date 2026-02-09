import uvicorn
import numpy as np
import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)

class SimParams(BaseModel):
    arrival_rate_ns: float
    arrival_rate_ew: float
    mode: str
    weather: str

# --- PHYSICS CONSTANTS (SCALED FOR WIDER ROADS) ---
ROAD_LENGTH = 400
STOP_LINE = 100        # FIXED: 25% of 400 = 100. Stops exactly at the white line.
INTERSECTION_EXIT = 280 # FIXED: Exit point of the 320px wide intersection box.
SAFE_HEADWAY = 2.0   
MIN_GAP = 4.0        
ACCEL_MAX = 3.0
DECEL_COMF = 2.5

# Vehicle Specs
VEHICLE_SPECS = {
    'car':      {'len': 6,  'v_max': 60, 'prob': 0.45},
    'suv':      {'len': 7,  'v_max': 55, 'prob': 0.25},
    'truck':    {'len': 14, 'v_max': 40, 'prob': 0.10},
    'bus':      {'len': 12, 'v_max': 35, 'prob': 0.05},
    'jeepney':  {'len': 8,  'v_max': 45, 'prob': 0.10},
    'bike':     {'len': 3,  'v_max': 70, 'prob': 0.05}
}

class VehicleAgent:
    def __init__(self, v_id, type_name, lane_idx):
        self.id = v_id
        self.type = type_name
        self.lane = lane_idx 
        self.pos = 0 
        self.length = VEHICLE_SPECS[type_name]['len']
        
        # Human Behavior
        self.aggression = np.random.uniform(0.1, 0.9)
        self.v_desired = VEHICLE_SPECS[type_name]['v_max'] * (0.8 + (self.aggression * 0.3))
        self.speed = self.v_desired * 0.6 
        
        self.status = "moving"

    def update_physics(self, dt, leader, stop_target, friction):
        gap = 1000
        target_speed = 0

        # Check Car Ahead
        if leader:
            dist_to_leader = leader.pos - self.pos - leader.length
            if dist_to_leader < gap:
                gap = dist_to_leader
                target_speed = leader.speed

        # Check Stop Target
        if stop_target is not None:
            dist_to_line = stop_target - self.pos
            if 0 < dist_to_line < gap:
                gap = dist_to_line
                target_speed = 0

        # IDM Calculation
        s0 = MIN_GAP + (1.0 - self.aggression)
        delta_v = self.speed - target_speed
        s_star = s0 + (self.speed * SAFE_HEADWAY) + \
                 (self.speed * delta_v) / (2 * np.sqrt(ACCEL_MAX * DECEL_COMF))
        
        safe_gap = max(0.1, gap)
        acc = ACCEL_MAX * (1 - (self.speed / self.v_desired)**4 - (s_star / safe_gap)**2)
        
        if acc < 0: acc *= friction 

        self.speed += acc * dt
        self.speed = max(0, self.speed)
        self.pos += self.speed * dt

        # Status & Anti-Ghosting
        if gap < 0.5:
            self.speed = 0
            self.pos -= (0.5 - gap) 
            self.status = "crashed"
        elif self.speed < 1:
            self.status = "stopped"
        elif acc < -1.5:
            self.status = "slowing"
        else:
            self.status = "moving"

class IntersectionSim:
    def __init__(self):
        self.roads = {d: [[], []] for d in ['north', 'south', 'east', 'west']}
        self.state = "NS_GREEN"
        self.timer = 0
        self.global_id = 0
        self.metrics = {"accidents": 0, "throughput": 0, "avg_speed": 0}

    def step(self, params: SimParams):
        dt = 0.1
        self.timer += dt
        friction = 0.6 if params.weather == "rain" else 1.0

        if self.timer > 8:
            self.state = "EW_GREEN" if "NS" in self.state else "NS_GREEN"
            self.timer = 0

        for direction in self.roads.keys():
            rate = params.arrival_rate_ns if direction in ['north', 'south'] else params.arrival_rate_ew
            if params.weather == "rain": rate *= 0.8
            if np.random.random() < (rate * dt):
                self.try_spawn(direction, random.choice([0, 1]))

        total_speed = 0
        car_count = 0

        for direction, lanes in self.roads.items():
            is_green = self.check_light(direction)
            
            for lane_idx, cars in enumerate(lanes):
                cars.sort(key=lambda x: x.pos, reverse=True)
                
                stop_target = STOP_LINE if not is_green else None
                # Gridlock Prevention
                if is_green and len(cars) > 1:
                    for car in cars:
                        if STOP_LINE < car.pos < INTERSECTION_EXIT and car.speed < 5:
                            stop_target = STOP_LINE
                            break

                for i, car in enumerate(cars):
                    leader = cars[i-1] if i > 0 else None
                    car.update_physics(dt, leader, stop_target, friction)
                    total_speed += car.speed
                    car_count += 1

                finished = [c for c in cars if c.pos >= ROAD_LENGTH]
                self.metrics["throughput"] += len(finished)
                self.roads[direction][lane_idx] = [c for c in cars if c.pos < ROAD_LENGTH]

        if car_count > 0:
            self.metrics["avg_speed"] = int(total_speed / car_count)

        return self.get_state()

    def check_light(self, direction):
        if "NS" in self.state and direction in ['north', 'south']: return True
        if "EW" in self.state and direction in ['east', 'west']: return True
        return False

    def try_spawn(self, direction, lane_idx):
        lane_cars = self.roads[direction][lane_idx]
        for car in lane_cars:
            if car.pos < 30: return 

        self.global_id += 1
        types = list(VEHICLE_SPECS.keys())
        probs = [VEHICLE_SPECS[t]['prob'] for t in types]
        v_type = np.random.choice(types, p=probs)
        self.roads[direction][lane_idx].append(VehicleAgent(self.global_id, v_type, lane_idx))

    def get_state(self):
        json_roads = {d: [[], []] for d in self.roads}
        for d, lanes in self.roads.items():
            for i, lane in enumerate(lanes):
                json_roads[d][i] = [{
                    "id": c.id, "pos": c.pos, "type": c.type, 
                    "status": c.status, "lane": c.lane
                } for c in lane]
        return { "light_state": self.state, "roads": json_roads, "metrics": self.metrics }

sim = IntersectionSim()

@app.post("/step")
def step(params: SimParams): return sim.step(params)

@app.post("/reset")
def reset():
    global sim
    sim = IntersectionSim()
    return {"msg": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)