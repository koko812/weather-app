// src/components/UserMarker.jsx
import { useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { userPinIcon } from '../utils/icons';

function UserMarker({ position, weather, markerRef, mapRef }) {
    useEffect(() => {
        if (position && weather && markerRef.current) {
            // ✅ Markerが描画された後にPopupを自動で開く
            const timeout = setTimeout(() => {
                markerRef.current.openPopup();
            }, 0);
            return () => clearTimeout(timeout);
        }
    }, [position, weather]);

    // ✅ 表示条件：位置と天気データが両方そろっている場合のみ表示
    if (!position || !weather) return null;

    return (
        <Marker
            position={position}
            icon={userPinIcon}
            ref={markerRef}>
            <Popup offset={[0, -30]}
                autoClose={false} 
                closeOnClick={false}>
                <div style={{ textAlign: 'center' }}>
                    {/* ✅ 天気データは weather.data に格納されている前提に変更 */}
                    <strong>{weather.data.name || 'Unknown'}</strong><br />
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                        alt={weather.data.weather[0].description}
                        style={{ width: '60px', height: '60px' }}
                    /><br />
                    {weather.data.weather[0].main} - {weather.data.weather[0].description}<br />
                    🌡 {weather.data.main.temp}°C<br />
                    💧 {weather.data.main.humidity}%<br />
                    🌬 {weather.data.wind.speed} m/s<br />
                    {/* ✅ ここが新機能：キャッシュ保存時刻を表示する */}
                    <span style={{ fontSize: '0.75em', color: 'gray' }}>
                        🕒 取得時刻: {new Date(weather.timestamp).toLocaleString()}
                    </span>
                </div>
            </Popup>
        </Marker>
    );
}

export default UserMarker; 8
