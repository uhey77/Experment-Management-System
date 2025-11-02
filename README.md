# 実験管理システム（研究室向け）

## 概要
研究室全体で機械学習やLLMの実験結果を共有・追跡するための FastAPI + React ベースの実験管理システムです。実験の登録、進捗・成果の共有、タグ付けによる検索を行えます。PostgreSQL を永続データストアとして採用し、Docker Compose により誰でも同一の環境を再現できます。

## 主な機能
- 実験の登録（タイトル、説明、担当者、利用するリポジトリやノートのリンク等）
- ステータス管理（準備中/実行中/完了/検証中など）
- タグ、メモ、成果物 URL の保存
- 実験一覧の検索・フィルタ（担当者、ステータス、タグなど）

## 技術スタック
- バックエンド: FastAPI, SQLAlchemy, Pydantic
- フロントエンド: React (Vite + TypeScript)
- データベース: PostgreSQL
- インフラ/実行: Docker Compose, uv (Python), pnpm (推奨)

## 事前準備
- Docker / Docker Compose
- Node.js (18+) と pnpm または npm
- uv (https://github.com/astral-sh/uv)

## クイックスタート（Docker）
```bash
# 初回は環境変数ファイルをコピー
cp .env.example .env

# 起動
docker compose up --build

# バックエンド: http://localhost:8000
# フロントエンド: http://localhost:5173
```

## ローカル開発（バックエンドのみ）
```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload
```

## ローカル開発（フロントエンドのみ）
```bash
cd frontend
pnpm install  # npm でも可
pnpm dev
```

## Makefile コマンド
```bash
make init       # .env 作成、依存関係の同期
make up         # Docker Compose で起動
make down       # コンテナ停止
make fmt        # コード整形 (backend: ruff/black, frontend: prettier)
make test       # backend テスト
```

## ディレクトリ構成
```
experiment_management_syste/
├── backend/          # FastAPI アプリケーション
├── frontend/         # React (Vite) フロントエンド
├── docs/             # 設計資料やメモ
├── docker-compose.yml
├── Makefile
└── README.md
```

## 今後の拡張案
- GitHub や Slack Webhook との連携
- 実験結果のファイル保存（S3 等）
- ワークフロー管理（ジョブスケジューラ連携）
- 役割ベースアクセス制御（RBAC）

## ライセンス
研究室内利用を想定しています。必要に応じて利用規約を整備してください。
