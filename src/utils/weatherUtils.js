const API_KEY = import.meta.env.VITE_OWM_API_KEY;

let requestCount = 0;
let cacheHitCount = 0;

function printCacheStats() {
    const total = requestCount + cacheHitCount;
    const hitRate = total === 0 ? 0 : (cacheHitCount / total * 100).toFixed(1);
    console.log(`📊 総アクセス数: ${total}`);
    console.log(`📈 キャッシュ命中率: ${hitRate}%`);
}

export async function fetchWeather(lat, lon, cacheRef) {
    const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;

    // ✅ 改良点1: キャッシュ構造を { data, timestamp } に変更
    const cached = cacheRef.current.get(key);
    if (cached) {
        cacheHitCount++;
        console.log(`🧠 キャッシュ命中 [${key}]（命中回数: ${cacheHitCount}）`);
        return cached; // ここで返すのは data + timestamp を含むオブジェクト
    }

    requestCount++;
    console.log(`🌐 APIリクエスト実行 [${key}]（リクエスト回数: ${requestCount}）`);

    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();

    // ✅ キャッシュに保存する形式を統一
    const value = {
        data,
        timestamp: Date.now()
    };

    cacheRef.current.set(key, value);

    // ✅ localStorage に保存
    localStorage.setItem(
        "weatherCache",
        JSON.stringify({
            version: 2,
            entries: Array.from(cacheRef.current.entries())
        })
    );

    console.log("📦 fetchWeather result:", { lat, lon, key, type: typeof data, data });
    // ✅ 統一された形式で返す（←ここが超重要！）
    return value;

    printCacheStats()
    // ✅ ここで明示的に構造を包むよう修正
    return value; // ✅ 呼び出し元では data + timestamp を受け取る
}
