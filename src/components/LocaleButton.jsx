const API_KEY = import.meta.env.VITE_OWM_API_KEY;


function LocaleButton({ mapRef, setPosition, setWeather }) {
    const handleClick = () => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;

                const map = mapRef.current;
                if (map) {
                    map.flyTo([lat, lon], 14, { duration: 1.0 }); // ✅ ふわっと中心へ
                }

                setPosition([lat, lon]);

                try {
                    const res = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
                    );
                    const data = await res.json();
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
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 100000,
                backgroundColor: 'yellow',
                color: 'black',
                padding: '10px 14px',
                fontWeight: 'bold',
                boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                cursor: 'pointer'
            }}
        >
            📍 現在地
        </button>
    );
}

export default LocaleButton;
