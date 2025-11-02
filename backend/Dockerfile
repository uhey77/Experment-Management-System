FROM ghcr.io/astral-sh/uv:python3.11-bookworm AS base

WORKDIR /app

COPY pyproject.toml ./
# uv.lock が存在すればコピーされる
COPY uv.lock* ./

RUN uv sync --no-dev

COPY app ./app

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
