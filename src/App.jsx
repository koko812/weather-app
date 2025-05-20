import { useState } from 'react';
import { useRef, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from 'react-leaflet';
import LocaleButton from './components/LocaleButton';
import { fetchWeather } from "./utils/weatherUtils"; // ✅ 追加


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


function App() {
  const [weather, setWeather] = useState(null);
  const [position, setPosition] = useState(null);
  console.log("🧪 現在の position:", position);
  console.log("🧪 現在の weather:", weather);

  const mapRef = useRef(null);
  console.log('🔁 コンポーネント関数が実行されました');

  const markerRef = useRef(null);
  const weatherCache = useRef(new Map()); // ✅ 1. キャッシュ作成

  useEffect(() => {
    const saved = localStorage.getItem("weatherCache");
    if (saved) {
      try {
        weatherCache.current = new Map(JSON.parse(saved));
        console.log("🧠 localStorage からキャッシュ復元");
      } catch (err) {
        console.warn("⚠️ キャッシュ読み込み失敗:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (position && weather && markerRef.current) {
      console.log('📍 markerRef.current:', markerRef.current);


      // 遅延させることで DOM 確実に描画されたあとに openPopup を呼べる
      const timeout = setTimeout(() => {
        markerRef.current.openPopup();
      }, 0); // ← または 100ms 程度でもOK

      return () => clearTimeout(timeout);
    }
  }, [position, weather]);

  return (
    <div style={{ position: 'relative' }}>

      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100vh', width: '100%' }}
        ref={mapRef} // ✅ ここがポイント！
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <ClickHandler
          setWeather={setWeather}
          setPosition={setPosition}
          weatherCache={weatherCache}
        />
        {position && weather && (
          <Marker position={position} ref={markerRef}>
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>{weather.name || 'Unknown'}</strong><br />
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  style={{ width: '60px', height: '60px' }}
                /><br />
                {weather.weather[0].main} - {weather.weather[0].description}<br />
                🌡 {weather.main.temp}°C<br />
                💧 {weather.main.humidity}%<br />
                🌬 {weather.wind.speed} m/s
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
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
