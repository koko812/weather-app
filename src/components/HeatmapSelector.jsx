// ✅ ヒートマップ切り替え UI + TileLayer 切り替え対応版

import { useState } from 'react';

const HEATMAP_OPTIONS = {
    none: 'なし',          // ✅ 新規
    temp: '気温',
    clouds_new: '雲量',
    wind_new: '風速',
    precipitation_new: '降水量'
};


function HeatmapSelector({ selectedLayer, setSelectedLayer }) {
    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'rgba(255,255,255,0.95)',
            padding: '10px 12px',
            borderRadius: '8px',
            zIndex: 100010,
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            fontWeight: 'bold'
        }}>
            <label style={{ display: 'block', marginBottom: '6px' }}>🗺 表示レイヤー</label>
            <select
                value={selectedLayer}
                onChange={(e) => setSelectedLayer(e.target.value)}
                style={{ padding: '6px', borderRadius: '6px' }}
            >
                {Object.entries(HEATMAP_OPTIONS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                ))}
            </select>
        </div>
    );
}

export default HeatmapSelector;
