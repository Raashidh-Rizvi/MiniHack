import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { getCoordinatesFromLocation, createPickerMarkerIcon } from '../../utils/mapUtils';
import { ExternalLink, MapPin } from 'lucide-react';

interface IssueLocationMiniMapProps {
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  title?: string;
  className?: string;
}

export const IssueLocationMiniMap: React.FC<IssueLocationMiniMapProps> = ({
  location,
  latitude,
  longitude,
  title,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Compute coordinates
  const coords: [number, number] =
    latitude && longitude && !isNaN(latitude) && !isNaN(longitude)
      ? [latitude, longitude]
      : getCoordinatesFromLocation(location);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: coords,
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker(coords, {
      icon: createPickerMarkerIcon(),
      interactive: false,
    }).addTo(map);

    if (title) {
      marker.bindPopup(`
        <div class="p-2 text-xs">
          <strong>${title}</strong><br/>
          <span class="text-slate-500">${location}</span>
        </div>
      `);
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [coords[0], coords[1]]);

  const openInOpenStreetMap = () => {
    window.open(
      `https://www.openstreetmap.org/?mlat=${coords[0]}&mlon=${coords[1]}#map=16/${coords[0]}/${coords[1]}`,
      '_blank',
      'noreferrer'
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
          <MapPin className="w-3.5 h-3.5 text-red-500" />
          <span>Location & Neighborhood Map</span>
        </span>

        <button
          type="button"
          onClick={openInOpenStreetMap}
          className="text-[11px] font-semibold text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center space-x-1 cursor-pointer"
        >
          <span>OpenStreetMap View</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full" />
        <div className="absolute bottom-1.5 right-2 text-[10px] text-slate-500 bg-white/80 dark:bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm z-10 pointer-events-none">
          © OpenStreetMap
        </div>
      </div>
    </div>
  );
};
