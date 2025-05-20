// src/hooks/useCityWeather.js
import { useState, useEffect } from 'react';
import { cities } from '../data/cities-japan';
import { fetchWeather } from '../utils/weatherUtils';

export default function useCityWeather(weatherCache) {
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
    }, [weatherCache]);

    return cityWeatherList;
}
