import { useEffect, useRef, useState, useCallback } from 'react';
import { TileLayer, useMapEvents } from 'react-leaflet';

const OWM_LAYER_KEYS = ['clouds_new', 'temp', 'wind_new', 'precipitation_new'];

const opacityByLayer = {
    temp: 0.6,
    clouds_new: 0.9,
    wind_new: 0.9,
    precipitation_new: 0.7
};

function HeatmapLayers({ selectedLayer, apiKey }) {
    const [loadedLayers, setLoadedLayers] = useState([]);
    const [zooming, setZooming] = useState(false);
    const mountedRef = useRef(true);
    const loadingTimeout = useRef(null);
    const tileLoadCounts = useRef({});

    // ✅ lazyLoad トリガーを useCallback で再利用可能に
    const triggerLazyLoad = useCallback(() => {
        const isValidLayer = selectedLayer && selectedLayer !== 'none';

        const targets = isValidLayer
            ? OWM_LAYER_KEYS.filter(l => !loadedLayers.includes(l) && l !== selectedLayer)
            : OWM_LAYER_KEYS.filter(l => !loadedLayers.includes(l));

        let current = 0;

        const loadNext = () => {
            if (!mountedRef.current || current >= targets.length) return;

            const targetLayer = targets[current];
            if (targetLayer) {
                setLoadedLayers(prev => {
                    if (!prev.includes(targetLayer)) {
                        console.log(`🧱 読み込み中: ${targetLayer}`);
                        return [...prev, targetLayer];
                    }
                    return prev;
                });
            }

            current++;
            loadingTimeout.current = setTimeout(loadNext, 300);
        };

        loadNext();
    }, [loadedLayers, selectedLayer]);

    // ✅ 地図イベントフック
    useMapEvents({
        zoomstart: () => {
            setZooming(true);
            clearTimeout(loadingTimeout.current);
        },
        zoomend: () => {
            setTimeout(() => setZooming(false), 800);
        },
        movestart: () => {
            clearTimeout(loadingTimeout.current);
        },
        moveend: () => {
            // 🔁 裏レイヤー再読み込みを遅らせて開始
            loadingTimeout.current = setTimeout(() => {
                triggerLazyLoad();
            }, 1500);
        }
    });

    // ✅ 初回 useEffect（表示レイヤー＋裏レイヤー遅延開始）
    useEffect(() => {
        mountedRef.current = true;

        const isValidLayer = selectedLayer && selectedLayer !== 'none';

        if (isValidLayer) {
            setLoadedLayers(prev => {
                if (!prev.includes(selectedLayer)) {
                    console.log(`🧱 読み込み中: ${selectedLayer}`);
                    return [...prev, selectedLayer];
                }
                return prev;
            });
        }

        loadingTimeout.current = setTimeout(() => {
            triggerLazyLoad();
        }, isValidLayer ? 3000 : 0);

        return () => {
            mountedRef.current = false;
            clearTimeout(loadingTimeout.current);
        };
    }, [selectedLayer, triggerLazyLoad]);

    const createEventHandlers = (layer) => ({
        tileload: () => {
            if (!tileLoadCounts.current[layer]) {
                tileLoadCounts.current[layer] = 0;
            }
            tileLoadCounts.current[layer]++;
            console.log(`✅ [${layer}] tileload count: ${tileLoadCounts.current[layer]}`);
        }
    });

    return (
        <>
            {/* ✅ 表示レイヤー：最優先で即時描画 */}
            {selectedLayer && selectedLayer !== 'none' && loadedLayers.includes(selectedLayer) && (
                <TileLayer
                    key={`layer-${selectedLayer}`}
                    url={`https://tile.openweathermap.org/map/${selectedLayer}/{z}/{x}/{y}.png?appid=${apiKey}`}
                    zIndex={100}
                    opacity={opacityByLayer[selectedLayer] ?? 0.6}
                    updateWhenIdle={false}
                    updateWhenZooming={false}
                    eventHandlers={createEventHandlers(selectedLayer)}
                />
            )}

            {/* ✅ 非表示レイヤー：ズーム中は表示せず、updateWhenIdle で遅延描画 */}
            {loadedLayers
                .filter(layer => layer !== selectedLayer)
                .filter(() => !zooming)
                .map((layer, index) => (
                    <TileLayer
                        key={`layer-${layer}-${index}`}
                        url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${apiKey}`}
                        opacity={0}
                        zIndex={-1}
                        updateWhenIdle={true}
                        eventHandlers={createEventHandlers(layer)}
                    />
                ))}
        </>
    );
}

export default HeatmapLayers;
