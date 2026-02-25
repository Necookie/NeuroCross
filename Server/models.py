from pydantic import BaseModel


class SimParams(BaseModel):
    arrival_rate_ns: float
    arrival_rate_ew: float
    mode: str
    weather: str
