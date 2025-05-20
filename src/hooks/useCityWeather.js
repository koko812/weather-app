import { useState, useEffect } from 'react';
import { cities } from '../data/cities-japan';
import { fetchWeather } from '../utils/weatherUtils';

export default function useCityWeather(weatherCache, cacheReady) {
    const [cityWeatherList, setCityWeatherList] = useState([]);

    useEffect(() => {
        if (!cacheReady) return; // ✅ キャッシュ復元完了まで待つ！

        const load = async () => {
            const results = [];
            for (const city of cities) {
                const result = await fetchWeather(city.lat, city.lon, weatherCache);
                if (!result || !result.data) continue;
                results.push({ ...city, ...result });
            }
            setCityWeatherList(results);
        };

        load();
    }, [weatherCache, cacheReady]); // ✅ cacheReady 依存に含める

    return cityWeatherList;
}