import asyncio
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from keepalive import keep_alive
from models import SimParams
from sim import IntersectionSim


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = None
    if os.getenv("RENDER_KEEP_ALIVE", "1") == "1":
        task = asyncio.create_task(keep_alive())
    yield
    if task is not None:
        task.cancel()


def create_app() -> FastAPI:
    app = FastAPI(lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    sim = IntersectionSim()

    @app.post("/step")
    def step(params: SimParams):
        return sim.step(params)

    @app.post("/reset")
    def reset():
        nonlocal sim
        sim = IntersectionSim()
        return {"msg": "ok"}

    @app.get("/ping")
    def ping():
        return {"status": "alive"}

    return app
