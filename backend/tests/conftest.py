from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

from app.core.config import reset_settings_cache
from app.db.session import get_session, reset_session_cache
from app.main import create_application

TEST_DATABASE_URL = "sqlite://"


@pytest.fixture(autouse=True)
def _configure_sqlite(monkeypatch: pytest.MonkeyPatch) -> Generator[None, None, None]:
    monkeypatch.setenv("DATABASE_URL", TEST_DATABASE_URL)
    reset_settings_cache()
    reset_session_cache()
    yield
    reset_settings_cache()
    reset_session_cache()


@pytest.fixture()
def engine() -> Generator:
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    try:
        yield engine
    finally:
        SQLModel.metadata.drop_all(engine)
        engine.dispose()


@pytest.fixture()
def session(engine) -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


@pytest.fixture()
def client(session: Session) -> Generator[TestClient, None, None]:
    app = create_application()

    def override_get_session() -> Generator[Session, None, None]:
        yield session

    app.dependency_overrides[get_session] = override_get_session

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
