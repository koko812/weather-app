import { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from 'react-leaflet';

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

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <ClickHandler setWeather={setWeather} setPosition={setPosition} />
      {position && weather && weather.cod === 200 && (
        <Marker position={position}>
          <Popup>
            <strong>{weather.name || 'Unknown'}</strong><br />
            {weather.weather[0].main} - {weather.weather[0].description}<br />
            🌡 {weather.main.temp}°C<br />
            💧 {weather.main.humidity}%<br />
            🌬 {weather.wind.speed} m/s
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default App;
