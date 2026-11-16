from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query, status
from slugify import slugify
from sqlalchemy import func, or_, select
from sqlmodel import Session

from app.api.deps import SessionDep
from app.models.experiment import (
    Experiment,
    ExperimentCreate,
    ExperimentRead,
    ExperimentStatus,
    ExperimentUpdate,
)

router = APIRouter(prefix="/experiments", tags=["experiments"])


def _generate_unique_slug(session: Session, base_slug: str) -> str:
    """スラッグの重複を避けるヘルパー。"""
    cleaned_slug = base_slug or "experiment"
    slug_candidate = cleaned_slug
    suffix = 1

    while _slug_exists(session, slug_candidate):
        slug_candidate = f"{cleaned_slug}-{suffix}"
        suffix += 1

    return slug_candidate


def _slug_exists(session: Session, slug: str) -> bool:
    statement = select(Experiment.id).where(Experiment.slug == slug)
    return session.exec(statement).scalar_one_or_none() is not None


def _get_or_404(session: Session, experiment_id: int) -> Experiment:
    """実験を取得する。存在しなければ 404 を返す。"""
    experiment = session.get(Experiment, experiment_id)
    if not experiment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experiment not found")
    return experiment


@router.post("/", response_model=ExperimentRead, status_code=status.HTTP_201_CREATED)
def create_experiment(
    *,
    session: SessionDep,
    experiment_in: ExperimentCreate,
) -> Experiment:
    experiment = Experiment(**experiment_in.model_dump())
    experiment.slug = _generate_unique_slug(session, slugify(experiment.title))

    session.add(experiment)
    session.commit()
    session.refresh(experiment)

    return ExperimentRead.model_validate(experiment)


@router.get("/", response_model=List[ExperimentRead])
def list_experiments(
    *,
    session: SessionDep,
    owner: Optional[str] = None,
    status_filter: Optional[ExperimentStatus] = Query(default=None, alias="status"),
    tag: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
) -> List[Experiment]:
    statement = select(Experiment).order_by(Experiment.created_at.desc())

    if owner:
        statement = statement.where(Experiment.owner == owner)
    if status_filter:
        statement = statement.where(Experiment.status == status_filter)
    if tag:
        statement = statement.where(Experiment.tags.contains([tag]))
    if search:
        like_pattern = f"%{search.lower()}%"
        statement = statement.where(
            or_(
                func.lower(Experiment.title).like(like_pattern),
                func.lower(Experiment.description).like(like_pattern),
            )
        )

    statement = statement.offset(offset).limit(limit)
    results = session.exec(statement).scalars().all()
    return [ExperimentRead.model_validate(result) for result in results]


@router.get("/{experiment_id}", response_model=ExperimentRead)
def get_experiment(*, session: SessionDep, experiment_id: int) -> Experiment:
    experiment = _get_or_404(session, experiment_id)
    return ExperimentRead.model_validate(experiment)


@router.put("/{experiment_id}", response_model=ExperimentRead)
def update_experiment(
    *,
    session: SessionDep,
    experiment_id: int,
    experiment_in: ExperimentUpdate,
) -> Experiment:
    experiment = _get_or_404(session, experiment_id)

    update_data = experiment_in.model_dump(exclude_unset=True)
    if "title" in update_data and update_data["title"]:
        new_slug = slugify(update_data["title"])
        experiment.slug = _generate_unique_slug(session, new_slug)

    for field, value in update_data.items():
        setattr(experiment, field, value)

    session.add(experiment)
    session.commit()
    session.refresh(experiment)

    return ExperimentRead.model_validate(experiment)


@router.delete("/{experiment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experiment(*, session: SessionDep, experiment_id: int) -> None:
    experiment = _get_or_404(session, experiment_id)

    session.delete(experiment)
    session.commit()
