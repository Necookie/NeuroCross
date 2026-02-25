# NeuroCross

Realtime traffic intersection simulation with a FastAPI physics engine and a React + Vite control desk UI.

**What It Does**
- Simulates a four-way, two-lane intersection with adaptive traffic light phases and vehicle dynamics.
- Streams live simulation state to a visual dashboard with controls for weather, traffic arrival rates, and speed.
- Renders vehicle motion, lane geometry, and signal states with subtle motion and a glassy UI style.

**Tech Stack**
- **Frontend**: React 19, Vite 7, Tailwind CSS, Framer Motion, Lucide icons, Axios
- **Backend**: Python, FastAPI, Uvicorn
- **Styling**: Tailwind + custom CSS variables (`Client/src/index.css`)

**Architecture**
- **Client (UI)** polls the backend on an interval and renders vehicles + signals.
- **Server (Sim)** advances the physics model by discrete time steps and returns a JSON snapshot of the world.

```
Client (React)  --->  POST /step (params)  --->  Server (FastAPI)
         ^                        |
         |                        v
   Render state <--- JSON snapshot (roads, light state, metrics)
```

**Simulation Model Highlights**
- **Vehicle dynamics** use an IDM-style model with acceleration, deceleration, and safe headway.
- **Traffic signals** cycle through NS/EW green + yellow with an all-red clearance phase that waits for the intersection to clear (or times out).
- **Weather** affects friction and arrival rates (rain lowers both).
- **Gridlock prevention** stops cars from entering an already blocked intersection.

**System Requirements**
- Node.js + npm for the frontend
- Python 3 for the backend
- A modern browser with good Canvas/CSS support

**API**
- `POST /step` advances the simulation by one tick and returns the current state.
Request body example:
```json
{
  "arrival_rate_ns": 0.8,
  "arrival_rate_ew": 0.4,
  "mode": "smart",
  "weather": "sunny"
}
```
Response fields:
- `light_state`: signal phase (e.g., `NS_GREEN`, `EW_YELLOW`)
- `roads`: vehicles per direction/lane with `id`, `pos`, `type`, `status`, `lane`
- `metrics`: `throughput`, `avg_speed`, `accidents` (currently not incremented)

- `POST /reset` resets the simulation state.

**Running Locally**
1. Backend
```powershell
cd Server
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```
The API listens on `http://localhost:8000`.

2. Frontend
```powershell
cd Client
npm install
npm run dev
```
Vite dev server runs on `http://localhost:5173` by default.

**Build and Preview**
- `npm run build` generates a production build in `Client/dist`.
- `npm run preview` serves the build locally.

**Controls**
- **Weather**: `sunny` or `rain` (rain reduces friction and spawns).
- **Mode**: `smart` / `fixed` (currently passed through; reserved for logic).
- **Arrival Rates**: slider inputs for NS and EW traffic.
- **Simulation Speed**: scales animation and polling rate.

**Frontend Behavior**
- Polling interval is derived from speed: `tickMs = max(30, 100 / simSpeed)`.
- Vehicle animation timing scales with `speedFactor` in `Vehicle.jsx`.
- Roads and stop lines are drawn in `RoadLayer.jsx` using a fixed 800x800 visual grid.

**Backend Behavior**
- Simulation tick uses `dt = 0.1` seconds.
- Vehicles are spawned probabilistically by direction and lane.
- Rain applies friction (`0.6`) and reduces arrival rates by `20%`.

**Vehicle Types**
Defined in `Server/config.py`:
- `car`, `suv`, `truck`, `bus`, `jeepney`, `bike`
- Each type has a length, max speed, and spawn probability.

Rendered in the UI in `Client/src/features/simulation/components/VehicleTemplates.jsx` with SVG templates.

**Traffic Signal Phases**
- `NS_GREEN` → `NS_YELLOW` → `ALL_RED_NS_TO_EW` → `EW_GREEN` → `EW_YELLOW` → `ALL_RED_EW_TO_NS`
- Clearance waits for the intersection to clear or times out after 5 seconds.

**Metrics**
- `throughput`: count of vehicles that exit the road length.
- `avg_speed`: average speed across all active vehicles in a tick.
- `accidents`: currently static (placeholder for future collision logic).

**Project Structure**
- `Server/main.py` — entry point
- `Server/app.py` — FastAPI app + routes
- `Server/sim/` — simulation core (vehicles + intersection)
- `Server/requirements.txt` — backend dependencies
- `Client/src/App.jsx` — UI state, controls, and polling
- `Client/src/features/simulation/components` — rendering primitives (roads, vehicles, rain, signals)
- `Client/src/index.css` — palette + utility styles

**Key Constants (Server)**
- `ROAD_LENGTH = 400`, `STOP_LINE = 100`, `INTERSECTION_EXIT = 280`
- `ACCEL_MAX = 3.0`, `DECEL_COMF = 2.5`, `SAFE_HEADWAY = 2.0`
- Two lanes per direction, with stop line at 25% of road length.

**CORS**
- CORS is open to all origins for local development in `Server/app.py`.

**Known Limitations**
- `mode` does not currently change behavior.
- `accidents` is not computed.
- No persistence layer for metrics or runs.

**Next Ideas**
- Use `mode` to switch between fixed-time and adaptive signal control.
- Add collision detection and update `accidents`.
- Persist metrics over time for charts or exports.
