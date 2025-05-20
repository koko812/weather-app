# 📘 LEARNED.md - Weather Map Viewer v1.6.3

## 🧠 今回実装・設計した内容（v1.6.3）

### ✅ `UserMarker` コンポーネントの岐務分離

* ユーザーがクリックまたは現在地ボタンで指定した地点にピンを立てる処理を `UserMarker.jsx` に分離
* これにより `App.jsx` から `<Marker>` や `<Popup>` の UI コードを完全に排除
* ピンが立った直後に `openPopup()` を呼ぶ `useEffect` も `UserMarker` 側に移した
* `position`, `weather`, `markerRef` を props で受け受け取り、描画のみに集中した構成

```jsx
<UserMarker
  position={position}
  weather={weather}
  markerRef={markerRef}
  mapRef={mapRef} // 使用しない場合は省略可能
/>
```

---

### 🧩 App.jsx の状態（整理完了）

`App.jsx` は状態の管理と地図コンテナの配置のみに岐務が限定された。

`MapContainer` 内は以下のように簡潔に構成：

```jsx
<MapContainer>
  <TileLayer ... />
  <CityWeatherMarkers weatherCache={weatherCache} />
  <ClickHandler ... />
  <UserMarker ... />
</MapContainer>
```

App は状態は (`weather`, `position`, `markerRef`, `weatherCache`) を保持するだけで、描画ロジックを持たない設計に。

---

### 🔍 ClickHandler の設計意図と保留

* `ClickHandler` は `useMapEvents()` を使ってクリックイベントを検知し、緯度縦度から天気を取得してピンを立てる
* 現在は簡潔かつ一目的な処理のため、`App.jsx` 内に留め置いている
* 将来的に `zoom`, `moveend` などのイベントを扱うようになれば `ClickHandler.jsx` に分離を検討

---

### 💡 設計改善の評価と今後の検討

| 改善内容               | 効果                                 |
| ------------------ | ---------------------------------- |
| `UserMarker` の岐務分離 | UIと状態管理の明確な分離、再利用しやすい構造            |
| `App.jsx` の簡約化     | 保守性・可読性が向上、各部の独立性が高まった             |
| `Popup` 表示ロジックの集縮  | `openPopup` の制御も `UserMarker` 側に統一 |

---

### 📆 バージョン履歴補足

* **v1.6.2**: `useCityWeather` による都市天気取得のロジック分離（カスタムフック化）
* **v1.6.3**: `UserMarker` の分離と `App.jsx` の構造整理、`ClickHandler` の役割明確化

---

### 🔄 次の候補ステップ（v1.6.4 または v1.7 以降）

* `ClickHandler.jsx` のファイル分離
* `<Popup>` 内の UI 部品を `WeatherPopup.jsx` に共通化
* `useWeatherCache()` のようなキャッシュ初期化フックの検討
* 地図の移動・ズームに応じて都市を切り替えるダイナミック描画への移行（v1.7）

---



# 📘 LEARNED.md - Weather Map Viewer v1.6.2

## 🧠 今回実装・設計した内容（v1.6.2）

### ✅ `useCityWeather`：天気取得ロジックのカスタムフック化

- 都市ごとの天気取得処理を `useCityWeather()` に抽出
- `CityWeatherMarkers.jsx` 内から `useState` / `useEffect` を完全に削除
- 表示とロジックの責務分離により、**再利用性と可読性が大幅に向上**
- キャッシュ（`weatherCache`）は引き続き `App.jsx` からフックに引数として受け渡し

---

## 🧩 構成の変化

| コンポーネント / フック        | 主な役割                             |
|-------------------------------|--------------------------------------|
| `App.jsx`                    | キャッシュ保持・全体構成             |
| `CityWeatherMarkers.jsx`     | 都市ごとの `<Marker>` 表示だけを担当 |
| `useCityWeather.js`          | 都市天気取得ロジック全般             |
| `weatherUtils.js`            | fetch + キャッシュ + localStorage    |

---

## 💡 カスタムフック導入のメリット

| Before（v1.6）                                  | After（v1.6.2）                          |
|-------------------------------------------------|------------------------------------------|
| useEffect + ループがコンポーネント内に直書き   | `useCityWeather()` により完全分離        |
| 状態管理と UI 表示が混ざっていた               | 表示だけのシンプルなコンポーネントに     |
| `App.jsx` の責務が重い                          | ロジックを別ファイルに移して整理されている |

---

## 🛠 今後の設計改善方針

### 1. `UserMarker.jsx` のコンポーネント化
- ユーザーのクリックまたは現在地表示を扱うロジックも分離する
- `position`, `weather`, `markerRef` を props として渡す

### 2. 共通スタイルやロジックの統一
- `<Popup>` 内の UI 部分を `WeatherPopup.jsx` として切り出し可
- 複数箇所で再利用される構成になる可能性

### 3. ロジックと UI の役割を今後も明確に
- 「APIを叩く/キャッシュする」はフック or ユーティリティ
- 「表示する」は純粋な JSX のみで完結するように意識する

---

## 📆 バージョン履歴補足

- **v1.6**: 都市マーカーの導入、マーカー種別アイコン切り替え、表示UI
- **v1.6.2**: 都市天気取得ロジックをカスタムフック化し、ロジックと描画の責務を明確に分離

</br>
</br>
</br>
</br>
</br>

# 📘 LEARNED.md - Weather Map Viewer v1.6

## 🌏 実装内容（日本の都市の天気表示）

このバージョンでは、日本全国の主要都市（約10地点）に対し、起動時に天気情報を自動取得して地図上にマーカー表示する機能を実装した。OpenWeatherMap API のキャッシュ機構も引き続き有効にし、無駄なリクエストを発生させず、ポップアップで各都市の天気詳細を表示できるようにした。

---

## ✅ 実装詳細

### 1. `cities-japan.js` の作成

* 都市名・緯度・経度のリストを定義し、エクスポートするモジュールとして保存。

```js
export const cities = [
  { name: "東京", lat: 35.6895, lon: 139.6917 },
  { name: "大阪", lat: 34.6937, lon: 135.5023 },
  ...
];
```

### 2. `App.jsx` 側で天気一括取得処理

* 起動時に `useEffect` で都市リストをループし、`fetchWeather()` により天気情報を取得
* 結果を `cityWeatherList` ステートに配列として格納し、マッピングに活用

```jsx
const [cityWeatherList, setCityWeatherList] = useState([]);

useEffect(() => {
  const load = async () => {
    const results = [];
    for (const city of cities) {
      const data = await fetchWeather(city.lat, city.lon, weatherCache);
      results.push({ ...city, data });
    }
    setCityWeatherList(results);
  };
  load();
}, []);
```

### 3. `<Marker>` の配列レンダリング

* `cityWeatherList.map(...)` で `<Marker>` を生成
* `<Popup>` 内に天気、湿度、風速、天気アイコンを表示

### 4. 天気アイコンの追加

* OpenWeatherMap のアイコンURL形式に従い `<img>` を表示

```jsx
<img
  src={`https://openweathermap.org/img/wn/${city.data.weather[0].icon}@2x.png`}
  alt={city.data.weather[0].description}
  style={{ width: '60px', height: '60px' }}
/>
```

---

## 🎯 UI/UX 向上の工夫

### ✅ ユーザーがクリックして取得した天気との区別

* `userPinIcon`（赤）と `cityPinIcon`（青）を作成し、アイコン差し替え
* Leaflet の `L.icon()` を利用：

```js
export const userPinIcon = L.icon({
  iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});
```

### ✅ ポップアップとピンの重なり解消

* ユーザーが立てたマーカーの `<Popup>` に `offset={[0, -30]}` を設定
* ポップアップがピンの真上にずれることで、ピンが視認可能に

---

## 🧠 学びと気づき

* React-Leaflet はアイコンのカスタマイズが必要な場合、Leaflet (`L.icon`) の力を借りる必要がある
* `Popup` の位置調整に `offset` プロパティを使うと UI が崩れにくい
* 起動時の一括取得は、`fetchWeather()` のキャッシュ機構と組み合わせることで非常に高速に動作
* `cityWeatherList` のように一覧状態を `useState` にまとめることで `map()` によるマッピング処理が簡潔に書ける

---

## 🚀 今後の展望（v1.7〜）

| バージョン | 拡張案                       |
| ----- | ------------------------- |
| v1.7  | 地図移動・ズーム連動で動的に都市を読み込み     |
| v1.8  | 天気に応じたマーカー色・ポップアップ背景のカスタム |
| v1.9  | ユーザーの履歴一覧表示・エクスポート機能追加    |
| v2.0  | 世界全体の主要都市に対応              |

---

## 📆 バージョン履歴

* v1.6: 日本の主要都市の天気を自動表示し、ピンの区別とUI改善を実装。キャッシュ利用・天気アイコンの追加も達成。

</br>
</br>
</br>
</br>
</br>

# 📘 LEARNED.md - Weather Map Viewer v1.5.1

## 🔍 React Hooks の整理と理解

このセクションでは、React アプリ開発において多用された `Hooks` の意味・種類・使い分け・設計思想について整理する。

---

## ✅ 1. Hook という名前の由来

「Hook（フック）」とは、もともとソフトウェア設計で「処理の途中に差し込む仕組み」を意味する用語。釣り針のように、特定のタイミングで処理を引っかけて実行できるようにする。

React における Hooks も同様で：

> 「関数コンポーネントに\*\*状態（state）や副作用（effect）をフック（引っかける）\*\*するためのAPI群」

がその本質である。

従来は class コンポーネント + ライフサイクルメソッド（`componentDidMount` など）で実現していた機能を、Hooks によって関数ベースで書けるようになった。

---

## 🔧 2. よく使う標準 Hooks とその役割

| フック名              | 主な用途          | 説明                                 |
| ----------------- | ------------- | ---------------------------------- |
| `useState`        | 状態管理          | UI に影響するデータを保持し、変更すると再描画される        |
| `useEffect`       | 副作用処理（初回・更新時） | データ取得や購読登録など。レンダリング後に実行される         |
| `useRef`          | DOM参照 / 値の保持  | UI に影響を与えずに、レンダリング間で永続する値を保持       |
| `useMemo`         | 値のメモ化         | 高コストな計算結果を再利用。依存配列が変わらない限り再計算しない   |
| `useCallback`     | 関数のメモ化        | 同じ関数インスタンスを保持し、再レンダリングでも変わらないように   |
| `useContext`      | グローバル状態の共有    | コンポーネントツリー間で状態や値を共有                |
| `useReducer`      | 複雑な状態管理       | `useState` より複雑なロジックに向いた状態遷移       |
| `useLayoutEffect` | レイアウト確定後に同期実行 | `useEffect` より前に、DOM描画直後に同期的に実行される |

---

## 🧠 3. useRef と `.current` の構造と意図

```js
const ref = useRef(initialValue); // { current: initialValue }
```

* `useRef()` が返すオブジェクトは `{ current: 値 }` の形
* `.current` に代入しても再描画は発生しない（非UI状態）
* 外部ライブラリのインスタンスやキャッシュ、メモ帳のような用途に最適

### よくある活用例：

| 用途         | 例                               | 説明                      |
| ---------- | ------------------------------- | ----------------------- |
| DOMアクセス    | `divRef.current.focus()`        | HTML要素にアクセス             |
| 外部ライブラリの操作 | `markerRef.current.openPopup()` | Leaflet のインスタンス操作       |
| 値のキャッシュ保持  | `weatherCache.current.set(...)` | API結果のキャッシュなど、再描画に依存しない |

---

## 🧩 4. カスタムフックはいつ使うのか？

### ✅ 再利用・共通化したいとき

* `useEffect + useState` のパターンを複数箇所で繰り返すとき
* `useLocalStorage()`, `useGeolocation()` などのようにロジックの意味を明確にしたいとき

### ❌ 一度きりの簡単な処理であれば不要

* 単発の useState や useRef はそのまま直接書く方が明快

---

## 📌 まとめ

* Hook とは「処理に割り込む仕組み」であり、React のレンダリング・副作用・状態に“引っかける”ことでUI構築を支援する
* `useRef.current` を使えば非UIな値（キャッシュや外部APIインスタンスなど）を安全に保持できる
* 標準Hooksで事足りる場合も多いが、重複ロジックが増えてきたら**カスタムフックに切り出すべきタイミング**

Reactの関数型UI設計におけるHookの役割は非常に根幹的であり、再描画、非同期、副作用などの扱いにおいて欠かせないツールである。

</br>
</br>
</br>
</br>
</br>

# 📘 LEARNED.md - Weather Map Viewer v1.5

## 🧠 今回実装・確認した内容（v1.5）

天気APIの呼び出しを最適化し、ブラウザをリロードしても即座に天気が表示できるよう、**キャッシュの永続化（localStorage）対応**を行った。また、キャッシュの有効期限や取得履歴の構造化についても議論を行った。

---

## ✅ 実装内容と技術的変更点

### 1. `fetchWeather()` 関数の導入と共通化

* 天気情報の取得処理を `fetchWeather(lat, lon, weatherCache)` に一本化
* API リクエストを行う前に、`weatherCache.current` を参照してキャッシュを確認
* `weatherCache` は `useRef(new Map())` で管理され、React の再レンダリングと独立
* キャッシュミス時には OpenWeatherMap API からデータを取得し、キャッシュに格納

### 2. `localStorage` によるキャッシュの永続化

* `weatherCache` の内容を `Array.from(map.entries())` を使ってJSON化し、`localStorage` に保存
* 起動時に `useEffect(() => {...}, [])` で `localStorage.getItem("weatherCache")` を読み込み、`weatherCache.current` に復元
* JSON.parse + Map再構築のパターンに注意

### 3. `LocaleButton` および `ClickHandler` の改修

* それぞれで直接 `fetch(...)` を使っていた箇所を `fetchWeather()` に書き換え
* `weatherCache` を `App` から `props` 経由で受け渡し
* 共通のロジックによって重複コードを解消し、バグ発生リスクを低減

---

## 🎓 学びと設計のポイント

### useRef vs useState

* `weatherCache` のように UI に反映させないが長期間保持したいデータには `useRef` を使用
* `useRef` は再レンダリングを発生させず、状態が変わっても UI が不要に再描画されない
* 一方 `weather` は表示に直結するため `useState` で管理する（再描画トリガー）

### localStorage のアクセスタイミング

* `App()` 関数内で `localStorage.getItem(...)` を直接呼ぶのは NG → 毎レンダリングで実行されるため
* 代わりに `useEffect(() => {...}, [])` により、**初回マウント時に1回だけ読み込む**のが正解

### fetchWeather の設計

* 副作用を伴う処理は App の外部に切り出し、UIとビジネスロジックの分離を実現
* コンポーネントから `weatherCache` を渡すことで再利用性を高め、拡張もしやすい

### ログによるキャッシュ確認

* `fetchWeather()` に `requestCount` と `cacheHitCount` を導入し、キャッシュの効果を可視化
* ブラウザコンソールから `printCacheStats()` を呼び出すことで、命中率や呼び出し数を確認できるようにした

### useRef の `.current` についての理解

* `useRef()` は `{ current: 初期値 }` の形でオブジェクトを返す
* `.current` を通じて値を保持し続ける（再レンダリングでも変わらない）
* `markerRef.current` や `weatherCache.current` のように、DOM要素やインスタンス、非UIの状態を保持するのに適している
* `useRef` は UI に関係しない「メモ帳」「キャッシュ」「外部APIオブジェクト」などに向いている

| 用途         | 例                               | 説明                 |
| ---------- | ------------------------------- | ------------------ |
| DOMアクセス    | `divRef.current.focus()`        | HTML要素にアクセスしたいとき   |
| 外部ライブラリの操作 | `markerRef.current.openPopup()` | Leafletなどのインスタンス操作 |
| 状態キャッシュ    | `weatherCache.current.set(...)` | 表示に関係ない長期データの保持    |

---

## ⏲ 今後の拡張に向けた考察

### 1. キャッシュの有効期限（TTL）

* `timestamp` を一緒に保存し、一定時間（例：1時間）を過ぎたキャッシュは再取得する
* `fetchWeather()` 内部で `Date.now() - cached.timestamp < TTL` をチェック

### 2. 取得履歴の記録

* `weatherHistory` を `useRef([])` で保持し、天気データ取得時に `lat, lon, timestamp, location, temp` を保存
* `localStorage` にも保存し、次回起動時に復元可能
* 将来的にはテーブル表示やCSVエクスポートにも拡張可能

### 3. データベース化の検討

* キャッシュや履歴データが複雑化した場合には、localStorage の構造化限界を超える
* IndexedDB や SQLite、Supabase などのクライアントDBを導入すると、検索性や拡張性が高まる
* 小規模なら localStorage + Map / Array の構成で十分だが、数千件を超えるならDBを検討

---

## 🌐 ユースケースの拡張案

| 拡張内容         | 説明                                           |
| ------------ | -------------------------------------------- |
| 🧰 キャッシュ削除   | 明示的な「全消去」ボタン（`localStorage.removeItem(...)`） |
| ⏰ キャッシュの期限管理 | 古いデータを `fetchWeather()` 内で破棄または上書き           |
| 📊 履歴の一覧表示   | 緯度・経度・地名・気温を画面にテーブル表示                        |
| 💪 API制限回避対応 | キャッシュによって同一地点の連続アクセスを回避                      |

---

## 📆 バージョン履歴

* v1.5: fetchWeather() を導入し、キャッシュの永続化・命中判定・履歴記録の土台を整備

  * useRef の `.current` の意味と用途を明確にし、DOM参照やキャッシュ用途の基礎を整理


</br>
</br>
</br>
</br>
</br>

# 📘 LEARNED.md - Weather Map Viewer v1.4.1

## 🧠 今回確認した内容の詳細まとめ（v1.4.1）

React-Leaflet v5 において、地図上にピンを立てた際に**天気情報を自動で表示（ポップアップ表示）するまでの流れと、その背景にある技術的要点**について理解を深めた。

---

## ✅ 確認した挙動とログ観察結果

* `useRef` によって `<Marker>` の背後にある **Leaflet の `L.Marker` インスタンス** を取得していた
* `useEffect(() => ..., [position, weather])` によって、**position, weather がそろったとき**に `openPopup()` を実行
* ログにより React の描画と状態変化のタイミングが明確に可視化された：

  * `App()` 関数が複数回再実行されている（`setState` によるレンダリング）
  * `markerRef.current` に `L.Marker` が入るのは描画完了後
  * `setTimeout(..., 0)` を使って、確実に DOM 構築後に `openPopup()` を実行

---

## 🎓 技術的理解ポイント

### 1. `useRef` と `ref={markerRef}` の役割

* `useRef(null)` によって空の箱を用意（`current` に後から値が入る）
* `<Marker ref={markerRef}>` により、描画後 `markerRef.current` に `L.Marker` インスタンスが格納される
* これにより、React の外の DOM/Leaflet オブジェクトにアクセス可能

### 2. `Popup` は自動では開かない

* `<Popup>...</Popup>` を書いただけでは、あくまで `bindPopup()` 相当の関連付けしかされない
* **表示をトリガーするには `openPopup()` を明示的に呼ぶ必要がある**

### 3. `useEffect` と `setTimeout` の組み合わせが重要

* `useEffect` は描画**後**に呼ばれるが、**その時点で `ref.current` がまだ null の場合がある**（特に外部ライブラリ）
* `setTimeout(..., 0)` によって、React の描画と Leaflet の初期化が完全に終わったタイミングに処理をずらせる

---

## 🔄 React-Leaflet v5 での構文変更と注意点

| 機能            | v4 以前                        | v5 以降                     |
| ------------- | ---------------------------- | ------------------------- |
| map インスタンスの取得 | `whenCreated={(map) => ...}` | `ref={mapRef}` を使う        |
| Popup の自動表示   | `<Popup autoOpen />`（非推奨）    | `ref` + `openPopup()` で制御 |
| DOM 制御の前提     | 暗黙的な初期化が多い                   | 明示的な副作用制御が必要              |

---

## 🔧 知識の確認ログ（一部）

```bash
🧪 現在の position: null
🧪 現在の weather: null
🔁 コンポーネント関数が実行されました
🚡 markerRef.current: NewClass {...} // Leaflet Marker instance
```

---

## 🎯 要点のまとめ

* `useRef` は React の再描画とは独立して値を保持できる "非UI状態のメモ帳"
* `ref={...}` を使って React コンポーネントから DOM/Leaflet インスタンスを取得する
* `Popup` を自動で開くには `markerRef.current.openPopup()` が必要
* React-Leaflet v5 では `whenCreated` は廃止 → `ref` で操作すべき
* `useEffect` は描画後に実行されるが、外部ライブラリとの整合性をとるには `setTimeout(..., 0)` が有効

---

## 📆 バージョン履歴（追記）

* v1.4.1: Popup 表示制御における useRef, useEffect, setTimeout の連携と Leaflet のインスタンス理解を確認

</br>
</br>
</br>
</br>
</br>

# 📘 LEARNED.md - Weather Map Viewer v1.4

## 🧠 今回実装した内容（v1.4）

- 現在地ボタンを押すと、`navigator.geolocation` により現在地を取得し、地図がその地点へスムーズにズームイン（`map.flyTo()` を使用）
- 取得した位置にマーカー（ピン）を立て、OpenWeatherMap の API を使ってその地点の天気を自動取得
- 取得直後に天気情報をポップアップで表示（手動クリック不要）
- 初回だけポップアップが表示されない問題を、`ref` + `useEffect` + `setTimeout` によって解消

---

## ❓ 今回浮かんだ疑問とその解消

### Q. マーカーは表示されるのに、天気情報が最初に出ないのはなぜ？

→ A. `Marker` と `Popup` は React 再描画後に DOM に追加されるため、`openPopup()` の呼び出しが間に合っていなかった。  
→ 対策として、`useEffect(..., [weather, position])` と `setTimeout(..., 0)` を使い、描画完了後に `openPopup()` を呼び出すよう修正。

### Q. ピンが中央に来ないのはなぜ？

→ A. `setView()` では瞬間的に移動するため、状態の反映タイミングによっては中央にピンが来ないように見える。  
→ 対策として `map.flyTo()` を用い、ズームと移動をアニメーションで実行。

---

## ✅ このバージョンで学んだこと（v1.4）

### 1. React + Leaflet におけるポップアップのタイミング制御

- `<Marker ref={markerRef}>` で `ref` を使い、プログラムから `openPopup()` を呼べる
- `useEffect(() => markerRef.current.openPopup(), [weather, position])` だけでは不安定
- `setTimeout(..., 0)` により描画完了後に確実に開ける（イベントループの仕組みを活用）

### 2. `setView()` vs `flyTo()`

| メソッド     | 説明                     | 特徴                       |
|--------------|--------------------------|----------------------------|
| `setView()`  | 即座にジャンプ           | 高速だがカクつきやすい     |
| `flyTo()`    | スムーズな移動           | UXが滑らか・中心に留まる   |

### 3. 状態反映とDOM描画の非同期性

- React の `setState` → 再レンダリング → DOM構築の順序に注意
- Leaflet UI に影響を与える操作（Popup表示など）は、**描画後のタイミングで呼び出す**

---

## 💪 バグとの戦いから得た知見（v1.4）

- Leaflet のインタラクション制御は、DOM構築タイミングに強く依存する
- React による状態変化は非同期なので、「見た目に起こってほしいタイミング」と一致しないことがある
- `ref` を使って DOM 操作する場合は、**描画完了を保証する工夫（setTimeout）** が必要

---

## ✅ 次にやると良さそうなこと（TODO）

- 天気情報のキャッシュ（同じ地点を再取得しない） → `Map<string, object>` などで簡易実装可能
- API 取得エラー時のリトライやトースト通知の追加
- Leaflet の `Control` を使って、ズームボタンのような形式で現在地ボタンを統合
- マーカーの複数設置や履歴の表示などの拡張機能
- 地点に応じた OGP プレビューや関連情報の表示

---

## 📝 バージョン履歴

- v1.0 地図表示、TileLayer 設定、基本構造
- v1.1 クリック地点の天気取得とマーカー表示
- v1.3 現在地ボタンの追加と mapRef の運用確立
- **v1.4 現在地での天気取得＆ポップアップ表示の完全自動化、UXの安定化対応**

</br>
</br>
</br>
</br>
</br>

# 📘 LEARNED.md - Weather Map Viewer v1.3

## 🧠 今回実装した内容（v1.3）

* React-Leaflet v5 環境において、地図インスタンス（map）を取得するための方法を修正
* `whenCreated` は v5 で廃止されているため、代わりに `ref={mapRef}` を使用して地図インスタンスを取得
* 現在地ボタン（📍）を地図の右上に自然に配置し、押すと `navigator.geolocation` により現在地にズームイン
* 地図へのアクセスは `useRef` に格納された `mapRef.current` を通して行う
* `LocateButton` は `MapContainer` の外に配置し、スタイルや z-index に依存せず自然に表示されるようにした

---

## ❓ このバージョンで浮かんだ疑問とその解消

### Q. `whenCreated` が発火しないのはなぜ？

→ A. `react-leaflet v5` では `whenCreated` が廃止されたため、map インスタンスは `ref` を直接渡すことで取得する必要がある。

### Q. `mapRef.current` が null のままだったのはなぜ？

→ A. `ref` を正しく `MapContainer` に渡していなかった、または描画順の問題により初期化前にアクセスしていたため。

### Q. 現在地ボタンは表示されているのに反応しなかったのは？

→ A. `mapRef.current` が null の状態で `setView()` を呼んでいたため。初期化確認の工夫や disabled による防止策が有効。

---

## ✅ このバージョンで学んだこと（v1.3）

### 1. React-Leaflet v5 の map インスタンス取得方法

* `whenCreated` は廃止されているため、map の取得には `ref` を使う必要がある
* `useRef(null)` → `<MapContainer ref={mapRef} />` でインスタンスがセットされる
* `mapRef.current` は初期描画後にのみ有効

### 2. 地図外コンポーネントからの地図操作

* `MapContainer` の外にある `LocateButton` でも、`mapRef.current.setView(...)` により地図の操作が可能
* `useMap()` は MapContainer の外では使えないためこの構成が最適

### 3. ボタンが表示されない・効かない原因の特定法

* CSS の `zIndex` や `position: relative` の有無
* ファイル名の typo による import 不一致
* `console.log()` による段階的な状態確認（lat/lon, ref, map instance）

### 4. バージョンに応じた API 使用法の違い

* ライブラリの major version アップ時には破壊的変更に注意
* `react-leaflet@5` のドキュメントを再確認し、古い習慣（`whenCreated` など）を見直す

---

## 💪 バグとの戦いから得た知見（v1.3）

* 地図と React の橋渡しには「描画タイミング」と「DOM構造」の正確な理解が必要
* `ref` ベースの地図制御は見落としがちな一歩であるが、v5では必須手段
* エラーが出ていないのに動かないときは、ファイル名・レンダリング順・非同期のタイミングを疑え

---

## ✅ 次にやると良さそうなこと（TODO）

* 現在地ボタン押下時に自動で天気も取得して表示する
* `setWeather` / `setPosition` を `LocateButton` に渡して再利用する
* 天気 API のレスポンスをキャッシュ or リトライする仕組み
* LEAFLET コントロールとの統合でボタンを Leaflet UI に完全に組み込む

---

</br>
</br>
</br>
</br>
</br>

# 📘 LEARNED.md - Weather Map Viewer v1.1

## 🧠 今回実装した内容

* 地図をクリックすると、その地点の緯度・経度を取得し、OpenWeatherMap の API を使って天気情報を取得する
* 取得した地点にマーカー（ピン）を立て、ポップアップに天気情報を表示する
* `react-leaflet` の `useMapEvents` を用いて、React フレンドリーに Leaflet のクリックイベントをハンドリング
* API リクエストと状態管理を組み合わせて、データ取得と UI 表示を連動させた

---

## ❓ このバージョンで浮かんだ疑問とその解消

### Q. JSXで `<ClickHandler />` と書いてるけど、これって普通の関数じゃないの？

→ A. JSXで `<ClickHandler />` として使えば、それは **Reactコンポーネント**とみなされる。
内部で `useMapEvents()` を使えるのは、**Reactコンポーネントであるからこそ**。

### Q. じゃあ `ClickHandler` を関数として定義して `const handleClick = () => {}` にしたら使えない？

→ A. その通り。`useMapEvents` は **React Hook** なので、**ただの関数内では使えない**。React が呼び出す関数コンポーネントかカスタム Hook 内でしか動作しない。

### Q. `useMapEvents` はどこから来た？

→ A. `react-leaflet` が提供している Hook。Leaflet のイベント (`click`, `zoom`, `drag` など) を React のライフサイクルと結びつけるもの。

### Q. `<Popup>` の見た目がきれいなのはなぜ？

→ A. Leaflet 本体の CSS (`leaflet.css`) によって標準スタイルが定義されている。React 側では見た目は一切書いていない。

### Q. `MapContainer` に `style={{ height: '100vh' }}` を入れ忘れると？

→ A. 地図が **高さゼロ**の状態になり、何も描画されない。Leaflet 自体は動作しているが、見えないだけ。

### Q. `{z}` って地図の高さ？ CSSのz-index？

→ A. まったく関係ない。`{z}` はタイルのズームレベル（拡大率）で、画像を取得するパラメータ。

---

## ✅ このバージョンで学んだこと（v1.1）

### 1. Leaflet 地図にイベントを追加するための仕組み

* `react-leaflet` の `useMapEvents()` を使うことで、クリック・移動・ズームなどのイベントを検知できる
* `useMapEvents()` は React Hook なので、**React コンポーネント内でしか使用できない**（通常の関数内では使えない）
* `ClickHandler` のように UI を返さない副作用専用のコンポーネントを作ることでイベント登録が可能になる

### 2. JSX における関数コンポーネントと通常の関数の違い

* `function ClickHandler(...)` のように定義した関数を `<ClickHandler />` と JSX で呼ぶと、**React コンポーネントとして扱われる**
* このとき `useMapEvents` などの Hook を安全に使うことができる
* 一方、`const handleClick = () => {}` のような普通の関数の中で Hook を使おうとするとエラーになる

### 3. イベント処理と状態管理の連携

* `useState` で保持した `weather`（天気情報）や `position`（緯度経度）に、地図クリックイベントで値を代入することで
  UI の更新が自動で行われる（React の再描画フロー）
* `<Marker />` や `<Popup />` は、状態がそろっているときだけ `&&` 演算子で描画する

### 4. Leaflet のデフォルトデザインの魅力

* `<Popup>` のデザインは `leaflet.css` によって定義されており、非常に洗練されたUIが標準で提供されている
* カスタムも可能だが、デフォルトでも実用的な見た目になる

### 5. Leaflet と React-Leaflet の関係

* `leaflet` は純粋な JavaScript ライブラリ（DOM操作ベース）
* `react-leaflet` はそれを React の「宣言的UI」パターンに適合させたラッパー
* `MapContainer`, `TileLayer`, `Marker`, `Popup`, `useMapEvents` などが提供されている

### 6. `useMapEvents` の使い方

* イベント名とコールバック関数をオブジェクトで渡す形式
* `click`, `move`, `zoom`, `drag`, `dblclick` など多くのイベントに対応
* 戻り値として `map` オブジェクトが返るので、必要なら `map.setView()` などの操作も可能

### 7. HTML 版 Leaflet との違い

* HTML で書く場合は `<div id="map">` に `height: 100vh` を与えておく必要がある
* React では `<MapContainer style={{ height: '100vh' }} />` のように `style` 属性を使って高さを指定する
* `{z}` は Leaflet における「ズームレベル」指定であり、CSSの `z-index` や地図の高さとは関係ない

### 8. タイルAPI（OpenStreetMap）について

* `TileLayer` に与える URL（例：`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`）は、OpenStreetMap が提供する
  地図タイル画像APIである
* `{z}`, `{x}`, `{y}` は Leaflet が地図座標系に基づいて自動計算・差し替えしてくれる
* 画像を取得して DOM 上に並べるのは Leaflet の内部処理

---

## 💡 地図が表示されなかったときのチェックリスト（再確認用）

* ✅ `MapContainer` に高さがあるか？
* ✅ `leaflet.css` を読み込んでいるか？
* ✅ `#root` の div が `index.html` にあるか？
* ✅ タイルURLにアクセスできるか？（ネットワーク制限がないか）
* ✅ Vite特有のアセット問題に注意しているか？
* ✅ Marker を使うなら画像アイコンパス問題に対処しているか？

</br>
</br>
</br>
</br>
</br>

# 📘 LEARNED.md - Weather Map Viewer v1.0

## ✅ このバージョンで学んだこと

### 1. Leaflet 地図の描画には明示的な高さ指定が必須

* `<MapContainer>` に `style={{ height: '100vh' }}` を指定しないと描画されない
* `div` や親要素にも高さが必要な場合がある

### 2. `leaflet.css` の読み込みが重要

* 読み込まないと地図のUI（ズームボタン、地図タイル）が正しく表示されない
* `main.jsx` で `import 'leaflet/dist/leaflet.css'` を追加

### 3. `Vite` 環境では Leaflet の画像アイコンがうまく解決されないことがある

* 今回はまだ Marker を使っていないため問題は顕在化していないが、将来必要になる
* 対処法として `new URL(..., import.meta.url).href` を使って明示的に読み込む手法を学んだ

### 4. 問題の切り分けの大切さ

* API キーが関係しない部分では「描画・CSS・HTML構造」などの物理的な要素が主因になりやすい
* 開発中は Console や Network タブでブラウザの状態を確認する習慣をつける

## 💡 地図が表示されなかったときのチェックリスト（再確認用）

* ✅ `MapContainer` に高さがあるか？
* ✅ `leaflet.css` を読み込んでいるか？
* ✅ `#root` の div が `index.html` にあるか？
* ✅ タイルURLにアクセスできるか？（ネットワーク制限がないか）
* ✅ Vite特有のアセット問題に注意しているか？
