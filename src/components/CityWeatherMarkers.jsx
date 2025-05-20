// src/components/CityWeatherMarkers.jsx
import { Marker, Popup } from 'react-leaflet';
import { cityPinIcon } from '../utils/icons';
import useCityWeather from '../hooks/useCityWeather';

function CityWeatherMarkers({ weatherCache }) {
    const cityWeatherList = useCityWeather(weatherCache);

    return (
        <>
            {cityWeatherList.map((city) => (
                <Marker
                    key={city.name}
                    position={[city.lat, city.lon]}
                    icon={cityPinIcon}
                >
                    <Popup offset={[0, -30]}>
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
                            🌬 {city.data.wind.speed} m/s
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
}

export default CityWeatherMarkers;
