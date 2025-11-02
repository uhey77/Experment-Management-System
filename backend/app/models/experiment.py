from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional

from slugify import slugify
from sqlalchemy import Column, DateTime, event, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.types import JSON
from sqlmodel import Field, SQLModel


class ExperimentStatus(str, Enum):
    PLANNED = "planned"
    RUNNING = "running"
    REVIEW = "review"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class ExperimentBase(SQLModel):
    title: str = Field(index=True, max_length=200)
    description: Optional[str] = Field(default=None)
    owner: str = Field(max_length=120, index=True)
    status: ExperimentStatus = Field(default=ExperimentStatus.PLANNED, index=True)
    tags: List[str] = Field(
        default_factory=list,
        sa_column=Column(
            JSON().with_variant(JSONB, "postgresql"),
            nullable=False,
            default=list,
        ),
    )
    repo_url: Optional[str] = Field(default=None, max_length=300)
    notes: Optional[str] = Field(default=None)
    results_url: Optional[str] = Field(default=None, max_length=300)
    external_links: List[str] = Field(
        default_factory=list,
        sa_column=Column(
            JSON().with_variant(JSONB, "postgresql"),
            nullable=False,
            default=list,
        ),
    )


class Experiment(ExperimentBase, table=True):
    __tablename__ = "experiments"

    id: Optional[int] = Field(default=None, primary_key=True)
    slug: Optional[str] = Field(default=None, max_length=220, unique=True, index=True)
    created_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), nullable=False, server_default=func.now()),
    )
    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=func.now(),
            onupdate=func.now(),
        ),
    )


class ExperimentCreate(ExperimentBase):
    pass


class ExperimentUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    owner: Optional[str] = None
    status: Optional[ExperimentStatus] = None
    tags: Optional[List[str]] = None
    repo_url: Optional[str] = None
    notes: Optional[str] = None
    results_url: Optional[str] = None
    external_links: Optional[List[str]] = None


class ExperimentRead(ExperimentBase):
    id: int
    slug: Optional[str]
    created_at: datetime
    updated_at: datetime


@event.listens_for(Experiment, "before_insert", propagate=True)
def set_slug_before_insert(mapper, connection, target: Experiment) -> None:  # type: ignore[override]
    """タイトルから slug を自動生成する。"""
    if target.slug:
        return
    base_slug = slugify(target.title)
    target.slug = base_slug


@event.listens_for(Experiment, "before_update", propagate=True)
def refresh_updated_at(mapper, connection, target: Experiment) -> None:  # type: ignore[override]
    target.updated_at = datetime.now(timezone.utc)
    if target.title:
        target.slug = slugify(target.title)
