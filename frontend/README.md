# Experiment Management Frontend

React (Vite + TypeScript) 製のフロントエンドです。FastAPI バックエンドの API を呼び出し、実験の一覧・登録 UI を提供します。

## 開発サーバー
```bash
npm install
npm run dev
```

`.env.local` (任意) に `VITE_API_BASE_URL` を指定すると API の接続先を上書きできます。既定値は `http://localhost:8000/api/v1` です。

## ビルド
```bash
npm run build
npm run preview # ビルド結果を確認する場合
```

## 静的配信
Dockerfile を用意しているので、`docker build -t experiment-frontend .` でビルドし、Nginx で配信できます。
