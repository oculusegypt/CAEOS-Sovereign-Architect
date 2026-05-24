"""
CAEOS Project Models | نماذج المشاريع

Pydantic v2 models for project CRUD and validation.
"""

from datetime import datetime
from typing import Optional, Dict, Any, List
from uuid import UUID

from pydantic import BaseModel, Field


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    status: str = Field(default="DRAFT", pattern=r"^(DRAFT|REVIEW|VALIDATED|APPROVED|EXECUTING|VERIFIED|SEALED|ARCHIVED)$")
    delivery_mode: Optional[str] = Field(None, pattern=r"^(AGENT_ONLY|WEB_APP|HYBRID|DOCS_ONLY)$")
    team_size: Optional[str] = None
    preferred_stack: Optional[Dict[str, Any]] = None
    language_mode: str = Field(default="BILINGUAL", pattern=r"^(ARABIC|ENGLISH|BILINGUAL)$")


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = None
    status: Optional[str] = Field(None, pattern=r"^(DRAFT|REVIEW|VALIDATED|APPROVED|EXECUTING|VERIFIED|SEALED|ARCHIVED)$")
    delivery_mode: Optional[str] = None
    team_size: Optional[str] = None
    preferred_stack: Optional[Dict[str, Any]] = None
    language_mode: Optional[str] = None
    health_score: Optional[int] = Field(None, ge=0, le=100)


class ProjectResponse(ProjectBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    ratified_at: Optional[datetime] = None
    ratified_by: Optional[str] = None
    health_score: Optional[int] = None

    class Config:
        from_attributes = True


class ProjectList(BaseModel):
    items: List[ProjectResponse]
    total: int
    page: int
    page_size: int
