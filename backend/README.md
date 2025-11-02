# Experiment Management Backend

FastAPI + SQLModel ベースの実験管理 API です。uv と PostgreSQL を利用して構築されています。

## セットアップ
```bash
uv sync
uv run uvicorn app.main:app --reload
```

`.env.example` をコピーして環境変数を設定してください。

## テスト
```bash
uv run pytest
```

## 主要エンドポイント
- `POST /api/v1/experiments/` 実験を登録
- `GET /api/v1/experiments/` 実験一覧取得（フィルタ付き）
- `PUT /api/v1/experiments/{id}` 実験情報更新
- `DELETE /api/v1/experiments/{id}` 実験削除

OpenAPI ドキュメントは `http://localhost:8000/docs` から参照できます。
