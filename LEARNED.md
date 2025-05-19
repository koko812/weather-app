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
