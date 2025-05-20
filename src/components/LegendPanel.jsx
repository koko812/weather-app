// src/components/LegendPanel.jsx

const legendByLayer = {
    temp: '/legend/temp.png',
    // clouds_new: '/legend/clouds.png',
    // wind_new: '/legend/wind.png',
    // precipitation_new: '/legend/precipitation.png'
};

function LegendPanel({ selectedLayer }) {
    const legendUrl = legendByLayer[selectedLayer];

    if (!legendUrl) return null;

    return (
        <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.85)',
            padding: '8px',
            borderRadius: '8px',
            zIndex: 1000,
            boxShadow: '0 0 6px rgba(0,0,0,0.3)'
        }}>
            <img
                src={legendUrl}
                alt="凡例"
                style={{ maxWidth: '200px', display: 'block' }}
            />
        </div>
    );
}

export default LegendPanel;
