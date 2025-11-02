# 実験管理システム アーキテクチャ概要

## 目的
- 機械学習・LLM 実験を研究室メンバー間で共有し、再現性を高める
- 実験のステータス・担当者・成果物を横断的に把握できるようにする
- Slack / GitHub など既存ツールとの連携余地を残す

## 全体構成
```
┌──────────────┐      ┌──────────────┐
│  React (Vite) │ <--> │  FastAPI API  │ <--> PostgreSQL
└──────────────┘      └──────────────┘
        ▲                     ▲
        │ Docker Compose      │
        └───────────┬─────────┘
                    │
              ローカル環境
```

- `frontend/`: Vite + React(TypeScript)。API を呼び出してダッシュボード表示・実験登録フォームを提供。
- `backend/`: FastAPI + SQLModel。実験テーブルの CRUD API を公開。
- `PostgreSQL`: 実験メタデータ永続化。開発時は Docker Compose で起動。

## データモデル
`experiments` テーブル（SQLModel）

| カラム | 型 | 説明 |
| --- | --- | --- |
| id | SERIAL | 主キー |
| slug | VARCHAR | タイトルから生成される URL 用文字列（ユニーク） |
| title | VARCHAR | 実験タイトル |
| description | TEXT | 実験概要 |
| owner | VARCHAR | 担当者 |
| status | ENUM | `planned / running / review / completed / archived` |
| tags | JSONB | タグ一覧 |
| repo_url | VARCHAR | GitHub などのリポジトリ URL |
| results_url | VARCHAR | レポート・ダッシュボード URL |
| external_links | JSONB | 参考リンク集 |
| notes | TEXT | 補足メモ |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

## 主な API エンドポイント
- `POST /api/v1/experiments/`
  - 実験の登録。重複しない slug を自動生成。
- `GET /api/v1/experiments/`
  - 一覧取得。クエリパラメータで `owner`, `status`, `search`, `tag` フィルタ。
- `GET /api/v1/experiments/{id}`
  - 詳細取得。
- `PUT /api/v1/experiments/{id}`
  - 更新。タイトル変更時は slug を再生成。
- `DELETE /api/v1/experiments/{id}`
  - 削除。

## 運用・展開
- `docker-compose.yml` で `db`, `backend`, `frontend` を一括起動。
- `Makefile` から `make init`, `make up`, `make test`, `make fmt` などのコマンドを提供。
- FastAPI 側は `uv` を利用して依存関係を管理し再現性を確保。
- フロントエンドは Vite + npm。Dockerfile でビルド＆ Nginx 配信に対応。

## 拡張余地
- Slack 連携: 実験登録/更新時に通知する Webhook 実装。
- GitHub 連携: リポジトリとの同期、コミットハッシュの自動保存。
- 認証・認可: 研究室メンバー単位のアクセス制御、Role-Based Access Control (RBAC)。
- 結果ファイル保管: S3 等との連携による成果物アップロード管理。
