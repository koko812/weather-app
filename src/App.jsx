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
import LayerTogglePanel from './components/LayerTogglePanel';
import { LayersControl } from 'react-leaflet'; // ✅
import HeatmapSelector from './components/HeatmapSelector';
import LegendPanel from './components/LegendPanel';
import HeatmapLayers from './components/HeatmapLayers';







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

const opacityByLayer = {
  temp: 0.5,
  clouds_new: 0.6,  // ← 濃くする
  wind_new: 0.9,
  precipitation_new: 0.7
};


function App() {
  const API_KEY = import.meta.env.VITE_OWM_API_KEY; // ✅ ここに移動

  const [cityWeatherList, setCityWeatherList] = useState([]);
  const [weather, setWeather] = useState(null);
  const [position, setPosition] = useState(null);
  const [cacheReady, setCacheReady] = useState(false);
  const [zoom, setZoom] = useState(2);
  const [selectedLayer, setSelectedLayer] = useState('none');



  const getBaseMapUrl = (layer) => {
    return layer === 'clouds_new'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
  };


  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const weatherCache = useRef(new Map());

  const CACHE_VERSION = 2;

  const [showHeatmap, setShowHeatmap] = useState(false);

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
            url={getBaseMapUrl(selectedLayer)}
            attribution="&copy; CARTO"
            zIndex={0}
          />

          <LegendPanel selectedLayer={selectedLayer} />

          <ZoomWatcher setZoom={setZoom} /> {/* ← これも忘れず */}

          <HeatmapLayers selectedLayer={selectedLayer} apiKey={import.meta.env.VITE_OWM_API_KEY} />


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
      <HeatmapSelector
        selectedLayer={selectedLayer}
        setSelectedLayer={setSelectedLayer}
      />
    </div>
  );
}

export default App;
