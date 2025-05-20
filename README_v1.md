# 🌍 Weather Map Viewer v1.0

このアプリは、React + Vite + Leaflet を使用して作成された、**世界地図上で任意の場所を探索できるビューア**です。v1.0 では、まず地図の描画を成功させることを目標としました。

---

## 🚀 機能概要（v1.0）

* 世界地図を表示（OpenStreetMap タイル）
* ユーザーは地図上を自由にズーム・パン可能

---

## 🛠 技術スタック

* [React](https://reactjs.org/)
* [Vite](https://vitejs.dev/)
* [React Leaflet](https://react-leaflet.js.org/)
* [OpenStreetMap](https://www.openstreetmap.org/)

---

## 📁 ディレクトリ構成（一部）

```
src/
├── App.jsx            # 地図を表示するコンポーネント
├── main.jsx           # アプリエントリーポイント
└── index.html         # Vite用HTMLテンプレート
```

---

## 📦 セットアップ手順

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開くと地図が表示されます。

---

## 🔮 今後の開発予定

* 地図クリック時に天気情報を取得し、ポップアップ表示
* 気温ヒートマップや降水レイヤーの表示
* 検索履歴機能
* 現在地取得機能
