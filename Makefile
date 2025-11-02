SHELL := /bin/bash

.PHONY: init init-backend init-frontend up down logs backend-dev frontend-dev fmt fmt-backend fmt-frontend test clean

init: ## 依存パッケージのセットアップと .env 作成
	cp -n .env.example .env || true
	cd backend && uv sync --extra dev
	cd frontend && npm install

init-backend:
	cd backend && uv sync --extra dev

init-frontend:
	cd frontend && npm install

up: ## Docker Compose で全コンテナを起動
	docker compose up --build

down: ## コンテナを停止・削除
	docker compose down

logs:
	docker compose logs -f

backend-dev:
	cd backend && uv run uvicorn app.main:app --reload

frontend-dev:
	cd frontend && npm run dev

fmt: fmt-backend fmt-frontend

fmt-backend:
	cd backend && uv run --extra dev ruff check app tests --fix
	cd backend && uv run --extra dev black app tests

fmt-frontend:
	cd frontend && npm run format

test:
	cd backend && uv run --extra dev pytest

clean:
	rm -rf backend/.uv backend/.venv frontend/node_modules frontend/dist
