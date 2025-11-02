from collections.abc import Generator
from functools import lru_cache

from sqlalchemy.orm import sessionmaker
from sqlmodel import Session, SQLModel, create_engine

from app.core.config import get_settings


@lru_cache(maxsize=1)
def get_engine():
    settings = get_settings()
    return create_engine(settings.sync_database_uri, echo=False, pool_pre_ping=True)


@lru_cache(maxsize=1)
def get_session_factory() -> sessionmaker[Session]:
    engine = get_engine()
    return sessionmaker(engine, class_=Session, expire_on_commit=False)


def init_db() -> None:
    """テーブルを初期化する。"""
    SQLModel.metadata.create_all(get_engine())


def get_session() -> Generator[Session, None, None]:
    """依存性として使用するセッションファクトリ。"""
    session_factory = get_session_factory()
    session = session_factory()
    try:
        yield session
    finally:
        session.close()


def reset_session_cache() -> None:
    get_session_factory.cache_clear()
    get_engine.cache_clear()
