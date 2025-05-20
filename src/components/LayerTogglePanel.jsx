// src/components/LayerTogglePanel.jsx
import { useState } from 'react';

function LayerTogglePanel({ onToggle, isVisible }) {
    return (
        <div style={{
            position: 'absolute',
            top: '50px',
            left: '10px',
            background: 'rgba(255,255,255,0.9)',
            padding: '8px 12px',
            borderRadius: '8px',
            boxShadow: '0 0 5px rgba(0,0,0,0.2)',
            zIndex: 100010
        }}>
            <label>
                <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => onToggle(e.target.checked)}
                />{" "}
                気温ヒートマップ
            </label>
        </div>
    );
}

export default LayerTogglePanel;
