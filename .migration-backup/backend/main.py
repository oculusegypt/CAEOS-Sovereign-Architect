"""
CAEOS — Constitutional AI Engineering Operating System
Backend Entry Point | نقطة دخول الخلفية

FastAPI application serving the 15 Sovereign Layers and 22-Phase Pipeline.
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.database import engine, init_db
from api.v1.routers import projects, decisions, wizard, audit, agents


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — init DB on startup."""
    await init_db()
    yield


app = FastAPI(
    title="CAEOS — Sovereign Architect API",
    description="Constitutional AI Engineering Operating System v2.0",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(projects.router, prefix="/api/v1/projects", tags=["Projects"])
app.include_router(decisions.router, prefix="/api/v1/decisions", tags=["Decisions"])
app.include_router(wizard.router, prefix="/api/v1/wizard", tags=["Interactive Wizard"])
app.include_router(audit.router, prefix="/api/v1/audit", tags=["Audit Trail"])
app.include_router(agents.router, prefix="/api/v1/agents", tags=["CAEOS Agents"])


@app.get("/")
async def root():
    return {
        "system": "CAEOS v2.0",
        "status": "SOVEREIGN",
        "layers": 15,
        "phases": 22,
        "constitution": "ACTIVE",
        "message": "The system is not a prompt. The system is an OS.",
        "message_ar": "النظام ليس Prompt. النظام هو OS.",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "constitution_enforced": True,
        "knowledge_graph_connected": True,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
