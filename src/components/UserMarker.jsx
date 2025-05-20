// src/components/UserMarker.jsx
import { useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { userPinIcon } from '../utils/icons';

function UserMarker({ position, weather, markerRef, mapRef }) {
    useEffect(() => {
        if (position && weather && markerRef.current) {
            const timeout = setTimeout(() => {
                markerRef.current.openPopup();
            }, 0);
            return () => clearTimeout(timeout);
        }
    }, [position, weather]);

    if (!position || !weather) return null;

    return (
        <Marker
            position={position}
            icon={userPinIcon}
            ref={markerRef}
        >
            <Popup offset={[0, -30]}>
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
    );
}

export default UserMarker;
