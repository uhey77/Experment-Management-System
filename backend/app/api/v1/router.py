from fastapi import APIRouter

from app.api.v1.endpoints import experiments

api_router = APIRouter()
api_router.include_router(experiments.router)
