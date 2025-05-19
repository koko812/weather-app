
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
