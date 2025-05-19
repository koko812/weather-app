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

const API_KEY = import.meta.env.VITE_OWM_API_KEY;

function ClickHandler({ setWeather, setPosition }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      setWeather(data);
    }
  });
  return null;
}

function App() {
  const [weather, setWeather] = useState(null);
  const [position, setPosition] = useState(null);

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (position && weather && markerRef.current) {
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
        <ClickHandler setWeather={setWeather} setPosition={setPosition} />
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
      />

    </div>

  );
}

export default App;
