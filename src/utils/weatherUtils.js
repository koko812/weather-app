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

    if (cacheRef.current.has(key)) {
        cacheHitCount++;
        console.log(`🧠 キャッシュ命中 [${key}]（命中回数: ${cacheHitCount}）`);
        return cacheRef.current.get(key);
    }

    requestCount++;
    console.log(`🌐 APIリクエスト実行 [${key}]（リクエスト回数: ${requestCount}）`);

    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();

    cacheRef.current.set(key, data);

    localStorage.setItem(
        "weatherCache",
        JSON.stringify(Array.from(cacheRef.current.entries()))
    );

    printCacheStats()
    return data;
}

