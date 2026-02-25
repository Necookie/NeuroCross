ROAD_LENGTH = 400
STOP_LINE = 100
INTERSECTION_EXIT = 280
SAFE_HEADWAY = 2.0
MIN_GAP = 4.0
ACCEL_MAX = 3.0
DECEL_COMF = 2.5

# Vehicle Specs (Lengths updated to match visual pixel sizes: 1 unit = 2px)
VEHICLE_SPECS = {
    "car": {"len": 16, "v_max": 60, "prob": 0.45},
    "suv": {"len": 18, "v_max": 55, "prob": 0.25},
    "truck": {"len": 32, "v_max": 40, "prob": 0.10},
    "bus": {"len": 28, "v_max": 35, "prob": 0.05},
    "jeepney": {"len": 20, "v_max": 45, "prob": 0.10},
    "bike": {"len": 10, "v_max": 70, "prob": 0.05},
}
