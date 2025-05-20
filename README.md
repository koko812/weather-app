# 🌏 Weather Map Viewer

React と Leaflet を用いたシンプルかつ拡張性のある天気地図アプリケーション。
指定都市や任意の地点の天気情報をマップ上に視覚的に表示できます。

---

## 🚀 機能一覧

* OpenStreetMap ベースのインタラクティブな地図表示
* 都市ごとの天気情報をピン付きで表示（`CityWeatherMarkers`）
* 地図上のクリックまたは現在地ボタンによる天気取得（`ClickHandler` + `LocaleButton`）
* 任意地点にピンを表示し、天気をポップアップ表示（`UserMarker`）
* 天気情報の取得に外部 API を使用し、`Map` によるキャッシュを導入
* キャッシュは `localStorage` 経由で永続化・復元にも対応

---

## 🧩 技術スタック

* React 18 + Vite
* Leaflet + react-leaflet
* OpenWeatherMap API
* Tailwind CSS（任意導入可能）

---

## 🗂️ ディレクトリ構成（主要部分）

```
.
├── src
│   ├── App.jsx               # メインアプリケーション
│   ├── components
│   │   ├── CityWeatherMarkers.jsx   # 都市一覧の天気マーカー表示
│   │   ├── LocaleButton.jsx         # 現在地取得ボタン
│   │   └── UserMarker.jsx           # 任意地点のマーカー表示
│   ├── data
│   │   └── cities-japan.js   # 都市一覧と緯度経度情報
│   ├── hooks
│   │   └── useCityWeather.js # カスタムフック（都市天気取得）
│   ├── utils
│   │   ├── icons.js          # 天気アイコン定義
│   │   └── weatherUtils.js  # 天気取得API関数・キャッシュ処理
│   └── fixLeafletIcon.js    # Leaflet アイコン表示修正
├── public
│   └── vite.svg
├── README.md
├── LEARNED.md
└── ...
```

---

## 🛠️ 使用方法

### 1. 環境変数の設定

OpenWeatherMap API のキーが必要です。
`.env` に以下を記載してください：

```env
VITE_OWM_API_KEY=your_openweathermap_key_here
```

### 2. インストールと起動

```bash
yarn install  # または npm install

yarn dev      # または npm run dev
```

### 3. 開発用ホットリロード環境で自動反映されます

---

## 📍 主な構成要素の解説

### `App.jsx`

アプリ全体の状態（都市天気一覧、選択地点の天気、マーカー位置など）を管理。

* 都市一覧は `cities-japan.js` から読み込み、初回 `useEffect` で天気を一括取得。
* `weatherCache` によって API 呼び出しの無駄を削減しつつ、キャッシュを `localStorage` に保存。
* `<MapContainer>` 内部に以下の描画部品を配置：

  * `<TileLayer>`: OSM タイル表示
  * `<CityWeatherMarkers>`: 都市ごとの天気ピン
  * `<ClickHandler>`: クリックイベントから天気取得
  * `<UserMarker>`: 任意地点の天気とピン
  * `<LocaleButton>`: 現在地取得ボタン

---

## 🧠 学習ログ

学習記録・開発ログは [`LEARNED.md`](./LEARNED.md) に随時まとめています。

---

## ✨ 今後の拡張アイデア

* ピン表示用 `<Popup>` の部品化（`WeatherPopup.jsx`）
* ズームや地図移動に応じた動的天気描画（`moveend`, `zoomend` イベント）
* キャッシュ初期化処理のカスタムフック化（`useWeatherCache`）
* スタイリングの Tailwind への統一
* 天気以外のレイヤー追加（気温マップ、降雨量など）

---

## 📄 ライセンス

MIT License

---

## 🙋 お問い合わせ

開発や設計についての相談や改善提案など、大歓迎です！
お気軽にどうぞ ☀️
