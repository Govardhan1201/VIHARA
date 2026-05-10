'use client';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapController({ center, zoom, bounds }: { center: [number, number]; zoom: number; bounds: L.LatLngBounds | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    } else {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, bounds, map]);
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
  selectedState?: string | null;
}

export default function Map({ destinations, center, zoom, statesData, selectedState }: MapProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const [districtData, setDistrictData] = useState<any>(null);
  const [selectedBounds, setSelectedBounds] = useState<L.LatLngBounds | null>(null);

  useEffect(() => {
    // Fetch state boundaries
    fetch('/india_states_updated.geojson')
      .then(r => r.json())
      .then(d => setGeoData(d))
      .catch(() => console.error('Could not load State GeoJSON'));
      
    // Pre-fetch district boundaries for deep-dive
    fetch('/india_districts_updated.geojson')
      .then(r => r.json())
      .then(d => setDistrictData(d))
      .catch(() => console.error('Could not load District GeoJSON'));
  }, []);

  useEffect(() => {
    if (geoData && selectedState) {
      const feature = geoData.features.find((f: any) => f.properties.NAME_1 === selectedState);
      if (feature) {
        const layer = L.geoJSON(feature);
        setSelectedBounds(layer.getBounds());
      } else {
        setSelectedBounds(null);
      }
    } else {
      setSelectedBounds(null);
    }
  }, [geoData, selectedState]);

  return (
    <div style={{ height: 420, width: '100%' }}>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%', borderRadius: '10px', background: '#080C0C' }}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapController center={center} zoom={zoom} bounds={selectedBounds} />
        <UserLocationController />
        
        {geoData && !selectedState && (
          <GeoJSON
            data={geoData}
            style={(feature) => {
              const stateName = feature?.properties?.NAME_1;
              const isDefined = statesData[stateName] ? true : false;
              
              if (isDefined) {
                return { color: 'var(--gold)', weight: 1, opacity: 0.3, fillColor: 'transparent', fillOpacity: 0 };
              } else {
                return { color: '#333', weight: 1, opacity: 0.2, fillColor: 'transparent', fillOpacity: 0 };
              }
            }}
            onEachFeature={(feature, layer) => {
              if (feature.properties && feature.properties.NAME_1) {
                layer.bindPopup(feature.properties.NAME_1);
              }
            }}
          />
        )}

        {selectedState && geoData && (
          <GeoJSON
            key={`state-${selectedState}`}
            data={geoData.features.find((f: any) => f.properties.NAME_1 === selectedState)}
            style={() => ({ color: 'var(--gold)', weight: 3, opacity: 1, fillColor: 'var(--gold)', fillOpacity: 0.15, className: 'glowing-state' })}
          />
        )}

        {selectedState && districtData && (
          <GeoJSON
            key={`districts-${selectedState}`}
            data={{ ...districtData, features: districtData.features.filter((f: any) => f.properties.NAME_1 === selectedState) }}
            style={() => ({ color: 'var(--teal)', weight: 1, opacity: 0.6, fillColor: 'transparent', fillOpacity: 0, dashArray: '4' })}
            onEachFeature={(feature, layer) => {
              if (feature.properties && feature.properties.NAME_2) {
                layer.bindTooltip(feature.properties.NAME_2, { permanent: false, direction: 'center', className: 'district-tooltip' });
              }
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
