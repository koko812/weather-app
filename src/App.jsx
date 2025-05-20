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
import { cities } from './data/cities-japan';
import CityWeatherMarkers from './components/CityWeatherMarkers';
import UserMarker from './components/UserMarker';


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
  }, []);


  const [weather, setWeather] = useState(null);
  const [position, setPosition] = useState(null);

  const mapRef = useRef(null);

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

        <CityWeatherMarkers weatherCache={weatherCache} />
        <ClickHandler
          setWeather={setWeather}
          setPosition={setPosition}
          weatherCache={weatherCache}
        />

        <UserMarker
          position={position}
          weather={weather}
          markerRef={markerRef}
          mapRef={mapRef} // 使ってなければ省略してOK
        />

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
