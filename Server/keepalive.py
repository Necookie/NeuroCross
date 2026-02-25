import asyncio
import os
import urllib.request


async def keep_alive() -> None:
    url = os.getenv("RENDER_PING_URL", "https://neurocross-backend.onrender.com/ping")
    interval_min = int(os.getenv("RENDER_PING_MINUTES", "14"))
    while True:
        await asyncio.sleep(interval_min * 60)
        try:
            await asyncio.to_thread(urllib.request.urlopen, url)
        except Exception as exc:
            print(f"Ping failed: {exc}")
