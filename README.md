# SMSV PDF Tools

PDF を端末内だけで加工する、SMSV 派生のブラウザアプリです。

## できること

- PDF の読み込み
- ページの回転
- ページの削除
- ページの並べ替え
- 2-in-1 見開きの分割
- PDF タイトルやメタデータの書き換え
- ブラウザ内での書き出し

## 方針

- PDF はサーバーへ送信しません
- 端末内・ブラウザ内だけで処理します
- 無料配布を前提にしています

## 開発

```bash
npm install
npm run dev
```

## 公開

GitHub Pages で無料公開する構成です。ビルド済みの `dist/` を `gh-pages` ブランチへ配置して公開します。

- 公開予定URL: `https://meetto3.github.io/smsv-pdf-tools/`
- `main` ブランチはアプリ本体のソースを管理します
- `gh-pages` ブランチは公開用のビルド成果物を管理します

## 構成

- `src/` - アプリ本体
- `outputs/` - 仕様メモや設計資料
