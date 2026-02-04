import uvicorn
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Enable React to talk to Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimParams(BaseModel):
    arrival_rate_ns: float
    arrival_rate_ew: float
    mode: str

class IntersectionSim:
    def __init__(self):
        self.lanes = {'north': [], 'south': [], 'east': [], 'west': []}
        self.light_state = "NS_GREEN"
        self.light_timer = 0
        self.car_id_counter = 0

    def step(self, params: SimParams):
        dt = 0.1 # 100ms per step

        # 1. Spawn Cars (Poisson Process)
        for lane in ['north', 'south']:
            if np.random.random() < (params.arrival_rate_ns * dt): self.spawn_car(lane)
        for lane in ['east', 'west']:
            if np.random.random() < (params.arrival_rate_ew * dt): self.spawn_car(lane)

        # 2. Traffic Light Logic
        self.light_timer += dt
        q_ns = self.count_queue('north') + self.count_queue('south')
        q_ew = self.count_queue('east') + self.count_queue('west')

        if params.mode == "fixed":
            if self.light_timer > 5: self.toggle_light()
        else:
            # Smart Logic
            if self.light_timer > 2:
                if self.light_state == "NS_GREEN" and q_ew > q_ns * 1.5: self.toggle_light()
                elif self.light_state == "EW_GREEN" and q_ns > q_ew * 1.5: self.toggle_light()

        # 3. Move Cars
        for lane, cars in self.lanes.items():
            is_green = (self.light_state == "NS_GREEN" and lane in ['north', 'south']) or \
                       (self.light_state == "EW_GREEN" and lane in ['east', 'west'])

            cars.sort(key=lambda x: x['pos'], reverse=True)
            next_obs = 200 # Virtual obstacle

            for car in cars:
                # Stop line logic (Line is at pos 90)
                if not is_green and car['pos'] < 85:
                    dist_to_stop = 90 - car['pos']
                    if dist_to_stop < (next_obs - car['pos']): next_obs = 90

                dist = next_obs - car['pos']

                if dist < 6: # Stop
                    car['speed'] = 0
                    car['status'] = 'stopped'
                elif dist < 20: # Slow
                    car['speed'] *= 0.9
                    car['status'] = 'slowing'
                    car['pos'] += car['speed'] * dt
                else: # Go
                    if car['speed'] < 40: car['speed'] += 2
                    car['status'] = 'moving'
                    car['pos'] += car['speed'] * dt

                next_obs = car['pos']

            # Cleanup cars that left map
            self.lanes[lane] = [c for c in cars if c['pos'] < 190]

        return {
            "light_state": self.light_state,
            "lanes": self.lanes,
            "stats": {"q_ns": q_ns, "q_ew": q_ew}
        }

    def spawn_car(self, lane):
        self.car_id_counter += 1
        v_type = "truck" if np.random.random() < 0.2 else "sedan"
        self.lanes[lane].append({"id": self.car_id_counter, "pos": 0, "speed": 30, "type": v_type, "status": "moving"})

    def count_queue(self, lane):
        return sum(1 for c in self.lanes[lane] if c['speed'] < 1)

    def toggle_light(self):
        self.light_state = "EW_GREEN" if self.light_state == "NS_GREEN" else "NS_GREEN"
        self.light_timer = 0

sim = IntersectionSim()

@app.post("/step")
def step(params: SimParams):
    return sim.step(params)

@app.post("/reset")
def reset():
    global sim
    sim = IntersectionSim()
    return {"msg": "ok"}