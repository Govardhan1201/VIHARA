'use client';
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function UserLocationController() {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    (window as any).__viharaSetLocation = (coords: [number, number] | null) => {
      if (coords) {
        if (markerRef.current) map.removeLayer(markerRef.current);
        markerRef.current = L.marker(coords).addTo(map).bindPopup('📍 Your Location').openPopup();
        map.setView(coords, 10);
      } else {
        map.setView([20.5937, 78.9629], 5);
      }
    };
    (window as any).__viharaClearLocation = () => {
      if (markerRef.current) { map.removeLayer(markerRef.current); markerRef.current = null; }
    };
    return () => {
      delete (window as any).__viharaSetLocation;
      delete (window as any).__viharaClearLocation;
    };
  }, [map]);

  return null;
}

interface MapProps {
  destinations: any[];
  center: [number, number];
  zoom: number;
  statesData: Record<string, { coords: [[number,number],[number,number]]; color: string; subZones: string[] }>;
}

export default function Map({ destinations, center, zoom, statesData }: MapProps) {
  return (
    <div style={{ height: 420, width: '100%' }}>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%', borderRadius: '10px' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={center} zoom={zoom} />
        <UserLocationController />
        {Object.entries(statesData).map(([state, data]) => (
          <Rectangle
            key={state}
            bounds={data.coords}
            pathOptions={{ color: data.color, weight: 2, opacity: 0.7, fillOpacity: 0.08 }}
          >
            <Popup>{state}</Popup>
          </Rectangle>
        ))}
      </MapContainer>
    </div>
  );
}
