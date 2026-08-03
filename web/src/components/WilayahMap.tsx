import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map as MapIcon } from 'lucide-react';

interface WilayahMapProps {
  code?: string;
  name?: string;
  level?: string;
  lat?: number | null;
  lng?: number | null;
  path?: any;
  logoUrl?: string | null;
}

export const WilayahMap: React.FC<WilayahMapProps> = ({
  code,
  name,
  level,
  lat,
  lng,
  path,
  logoUrl,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Fix Leaflet marker icon asset URLs in Vite
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  // Initialize Map instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-2.5489, 118.0149], // Center Indonesia
        zoom: 5,
        zoomControl: true,
      });

      // CartoDB Voyager basemap for modern clean aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Plot Boundary & Marker on props update
  useEffect(() => {
    const map = mapRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    let polygonLayer: L.Polygon | null = null;
    let hasValidBounds = false;

    // 1. Plot Polygon Boundary if path exists
    if (path && Array.isArray(path) && path.length > 0) {
      try {
        polygonLayer = L.polygon(path as any, {
          color: '#2563eb',
          weight: 3,
          opacity: 0.9,
          fillColor: '#3b82f6',
          fillOpacity: 0.25,
        }).addTo(layerGroup);

        const bounds = polygonLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
          hasValidBounds = true;
        }
      } catch (e) {
        console.warn('Gagal memproses data polygon boundary:', e);
      }
    }

    // 2. Plot Centroid Marker if lat & lng exist
    if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) {
      const marker = L.marker([lat, lng]).addTo(layerGroup);

      const popupHtml = `
        <div style="font-family: system-ui, -apple-system, sans-serif; padding: 4px; max-width: 220px; text-align: center;">
          ${
            logoUrl
              ? `<div style="margin-bottom: 8px;">
                   <img src="${logoUrl}" alt="Logo ${name || ''}" style="height: 60px; max-width: 100px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));" onerror="this.style.display='none'" />
                 </div>`
              : ''
          }
          <div style="font-size: 0.75rem; color: #6b7280; font-weight: 600; text-transform: uppercase;">
            ${level || 'Wilayah'}
          </div>
          <div style="font-size: 0.95rem; font-weight: 700; color: #111827; margin: 2px 0 4px 0;">
            ${name || 'Wilayah'}
          </div>
          <div style="font-size: 0.75rem; background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 9999px; display: inline-block; font-weight: 600; margin-bottom: 6px;">
            Kode: ${code}
          </div>
          <div style="font-size: 0.7rem; color: #4b5563;">
            📍 Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      if (!hasValidBounds) {
        map.setView([lat, lng], level === 'Provinsi' ? 8 : level === 'Kabupaten/Kota' ? 11 : 13);
      } else {
        setTimeout(() => marker.openPopup(), 400);
      }
    } else if (!hasValidBounds) {
      map.setView([-2.5489, 118.0149], 5);
    }
  }, [code, name, level, lat, lng, path, logoUrl]);

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
      <div style={{ padding: '12px 16px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-title)' }}>
          <MapIcon size={18} color="#3b82f6" /> Peta Geospasial Wilayah & Polygon Boundaries
        </div>
        {code && (
          <div style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '2px 10px', borderRadius: '12px', fontWeight: 600 }}>
            {name ? `${name} (${code})` : code}
          </div>
        )}
      </div>

      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '420px',
          background: '#f3f4f6',
          zIndex: 1,
        }}
      />
    </div>
  );
};
