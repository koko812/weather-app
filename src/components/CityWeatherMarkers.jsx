// src/components/CityWeatherMarkers.jsx
import { Marker, Popup } from 'react-leaflet';
import { cityPinIcon } from '../utils/icons';

function CityWeatherMarkers({ cityWeatherList }) {
    console.log("📍 マーカー数:", cityWeatherList.length);

    return (
        <>
            {cityWeatherList.map((city, idx) => (
                <Marker
                    key={`${city.name}-${idx}`}
                    position={[city.lat, city.lon]}
                    icon={cityPinIcon}
                >
                    <Popup
                        offset={[0, -30]}
                        autoClose={false}
                        closeOnClick={false}>
                        <div style={{ textAlign: 'center' }}>
                            <strong>{city.name}</strong><br />
                            <img
                                src={`https://openweathermap.org/img/wn/${city.data.weather[0].icon}@2x.png`}
                                alt={city.data.weather[0].description}
                                style={{ width: '60px', height: '60px' }}
                            /><br />
                            {city.data.weather[0].main} - {city.data.weather[0].description}<br />
                            🌡 {city.data.main.temp}°C<br />
                            💧 {city.data.main.humidity}%<br />
                            🌬 {city.data.wind.speed} m/s<br />
                            <span style={{ fontSize: '0.75em', color: 'gray' }}>
                                🕒 取得時刻: {new Date(city.timestamp).toLocaleString()}
                            </span>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
}

export default CityWeatherMarkers;
