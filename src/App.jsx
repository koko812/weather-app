// src/App.jsx
import { useState, useRef, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  useMapEvents
} from 'react-leaflet';
import LocaleButton from './components/LocaleButton';
import { fetchWeather } from "./utils/weatherUtils";
import { cities } from './data/cities-japan';
import CityWeatherMarkers from './components/CityWeatherMarkers';
import UserMarker from './components/UserMarker';
import { useMemo } from 'react';



function ClickHandler({ setWeather, setPosition, weatherCache }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      try {
        const data = await fetchWeather(lat, lng, weatherCache);
        setWeather(data);
      } catch (err) {
        console.error("天気取得失敗:", err);
      }
    }
  });
  return null;
}

function ZoomWatcher({ setZoom }) {
  useMapEvents({
    zoomend: (e) => {
      setZoom(e.target.getZoom());
    }
  });
  return null;
}


function App() {
  const [cityWeatherList, setCityWeatherList] = useState([]);
  const [weather, setWeather] = useState(null);
  const [position, setPosition] = useState(null);
  const [cacheReady, setCacheReady] = useState(false);
  const [zoom, setZoom] = useState(2);


  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const weatherCache = useRef(new Map());

  const CACHE_VERSION = 2;

  // ✅ キャッシュ復元処理
  useEffect(() => {
    const saved = localStorage.getItem("weatherCache");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (parsed.version !== CACHE_VERSION) {
          console.warn("⚠️ キャッシュバージョン不一致。初期化します");
          localStorage.removeItem("weatherCache");
        } else {
          const entries = parsed.entries.map(([key, value]) => {
            if (value?.timestamp && value?.data) return [key, value];
            if (value?.weather) {
              return [key, { data: value, timestamp: Date.now() - 1000 * 60 * 60 }];
            }
            return null;
          }).filter(Boolean);

          weatherCache.current = new Map(entries);
          console.log("🧠 キャッシュ復元完了:", entries.length);
        }
      } catch (err) {
        console.warn("⚠️ キャッシュ読み込み失敗:", err);
        localStorage.removeItem("weatherCache");
      }
    }

    setCacheReady(true);
  }, []);

  // ✅ キャッシュ復元後に都市データを取得
  useEffect(() => {
    if (!cacheReady) return;

    const timeout = setTimeout(() => {
      const load = async () => {
        const results = [];
        for (const city of cities) {
          const result = await fetchWeather(city.lat, city.lon, weatherCache);
          if (!result || !result.data) continue;
          const { data, timestamp } = result;
          results.push({ ...city, data, timestamp });
        }
        console.log("📍 マーカー描画対象数:", results.length);
        setCityWeatherList(results);
      };
      load();
    }, 0);

    return () => clearTimeout(timeout);
  }, [cacheReady]);

  useEffect(() => {
    if (position && weather && markerRef.current) {
      const timeout = setTimeout(() => {
        markerRef.current.openPopup();
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [position, weather]);

  return (
    <div style={{ position: 'relative' }}>
      {cacheReady && (
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100vh', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          <ZoomWatcher setZoom={setZoom} /> {/* ← これも忘れず */}

          <CityWeatherMarkers
            weatherCache={weatherCache}
            cityWeatherList={
              zoom < 5
                ? cityWeatherList.filter(city => city.rank === 1)
                : cityWeatherList
            }
          />

          <ClickHandler
            setWeather={setWeather}
            setPosition={setPosition}
            weatherCache={weatherCache}
          />

          <UserMarker
            position={position}
            weather={weather}
            markerRef={markerRef}
            mapRef={mapRef}
          />
        </MapContainer>
      )}

      <LocaleButton
        mapRef={mapRef}
        setPosition={setPosition}
        setWeather={setWeather}
        weatherCache={weatherCache}
      />
    </div>
  );
}

export default App;
