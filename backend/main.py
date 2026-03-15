from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="GoneByFriday API",
    description="Last-minute weekend trip planner",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from backend.routers import deals, itinerary, alerts, calendar, wallet

app.include_router(deals.router)
app.include_router(itinerary.router)
app.include_router(alerts.router)
app.include_router(calendar.router)
app.include_router(wallet.router)


@app.get("/")
async def root():
    return {"app": "GoneByFriday", "version": "1.0.0", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "ok"}
