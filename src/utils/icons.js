import L from 'leaflet';

export const cityPinIcon = L.icon({
    iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

export const userPinIcon = L.icon({
    iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});
