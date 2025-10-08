# セットアップ手順

## 依存関係のインストール

```bash
npm install
```

## 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開きます。

## ビルド

```bash
npm run build
```

ビルド成果物は `dist/` ディレクトリに生成されます。

## デプロイ

### 静的ホスティング（GitHub Pages、Netlify、Vercel等）

1. `npm run build` でビルドを実行
2. `dist/` フォルダの内容をデプロイ

### GitHub Pages の場合

```bash
npm run build
# dist/ フォルダをgh-pagesブランチにプッシュ
```

## 使い方

1. **OpenRouter APIキーを取得**
   - https://openrouter.ai/keys でAPIキーを取得
   - アプリの上部にAPIキーを入力（localStorageに保存されます）

2. **フレームワークを選択**
   - ビジネスモデルキャンバス（BMC）
   - SWOT分析
   - 3C分析
   - ユーザーストーリーマッピング

3. **フォームに入力**
   - 各項目に必要な情報を入力

4. **AI生成開始**
   - ボタンをクリックしてAIに分析を依頼

5. **結果を確認・保存**
   - 生成された結果をMarkdownでコピーまたはダウンロード

## セキュリティ

- APIキーはlocalStorageにのみ保存され、サーバーには送信されません
- すべての通信はブラウザから直接OpenRouterへ行われます
