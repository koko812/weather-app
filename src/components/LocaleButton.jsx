function LocaleButton({ mapRef }) {
    const handleClick = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;

                console.log("📍 現在地:", lat, lon);
                console.log("🗺️ mapRef.current:", mapRef.current);

                // LocateButton 側で使う：
                mapRef.current.setView([lat, lon], 14);
            },
            (err) => {
                console.error("現在地取得失敗:", err);
            }
        );
    };

    return (
        <button onClick={handleClick}
            style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 100000,
                backgroundColor: 'yellow', // ← 一時的に目立たせる
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
