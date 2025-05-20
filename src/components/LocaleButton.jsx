import { useEffect } from "react";
import { fetchWeather } from "../utils/weatherUtils"; // パスは適宜調整



function LocaleButton({ mapRef, setPosition, setWeather, weatherCache }) {
    const handleClick = () => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;

                const map = mapRef.current;
                if (map) {
                    map.flyTo([lat, lon], 14, { duration: 1.0 });
                }

                setPosition([lat, lon]);

                try {
                    const data = await fetchWeather(lat, lon, weatherCache);
                    setWeather(data);
                } catch (err) {
                    console.error("天気取得失敗:", err);
                }
            },
            (err) => {
                console.error("現在地取得失敗:", err);
            }
        );
    };

    return (
        <button
            onClick={handleClick}
            style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                zIndex: 100000,
                backgroundColor: "yellow",
                color: "black",
                padding: "10px 14px",
                fontWeight: "bold",
                boxShadow: "0 0 8px rgba(0,0,0,0.5)",
                cursor: "pointer"
            }}
        >
            📍 現在地
        </button>
    );
}

export default LocaleButton;
