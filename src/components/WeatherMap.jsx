// src/components/WeatherMap.jsx
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import { useState } from 'react';

const API_KEY = import.meta.env.VITE_OWM_API_KEY;

function WeatherMap() {
    const [weatherData, setWeatherData] = useState(null);
    const [clickedPos, setClickedPos] = useState(null);

    const handleClick = async (e) => {
        const { lat, lng } = e.latlng;
        setClickedPos([lat, lng]);

        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        setWeatherData(data);
    };

    function ClickHandler() {
        useMapEvents({ click: handleClick });
        return null;
    }

    return (
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <ClickHandler />
            {clickedPos && weatherData && weatherData.cod === 200 && (
                <Marker position={clickedPos}>
                    <Popup>
                        <strong>{weatherData.name || 'Unknown place'}</strong><br />
                        {weatherData.weather[0].main} ({weatherData.weather[0].description})<br />
                        🌡 {weatherData.main.temp}°C<br />
                        💧 {weatherData.main.humidity}%<br />
                        🌬 {weatherData.wind.speed} m/s
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
}

export default WeatherMap;
