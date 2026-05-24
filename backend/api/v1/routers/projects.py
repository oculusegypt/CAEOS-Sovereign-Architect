"""
CAEOS Projects Router | مسار المشاريع

CRUD for projects with constitution enforcement.
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from api.v1.models.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectList

router = APIRouter()


@router.get("", response_model=ProjectList)
async def list_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """List all projects with optional filtering."""
    return ProjectList(items=[], total=0, page=page, page_size=page_size)


@router.post("", response_model=ProjectResponse, status_code=201)
async def create_project(project: ProjectCreate, db: AsyncSession = Depends(get_db)):
    """Create a new project — triggers L1 Intent Extraction."""
    raise HTTPException(status_code=501, detail="Requires full SQLAlchemy model implementation")


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get project by ID with full decision history."""
    raise HTTPException(status_code=501, detail="Requires full SQLAlchemy model implementation")


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    update: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update project — triggers Constitution Check (Law 8)."""
    raise HTTPException(status_code=501, detail="Requires full SQLAlchemy model implementation")


@router.delete("/{project_id}", status_code=204)
async def delete_project(project_id: UUID, db: AsyncSession = Depends(get_db)):
    """Archive project — never hard delete (Law 20: Recovery)."""
    raise HTTPException(status_code=501, detail="Requires full SQLAlchemy model implementation")
