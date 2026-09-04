import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  MATALE_DEFAULT_CENTER,
  SRI_LANKA_TOWN_PRESETS,
  createPickerMarkerIcon,
  createIssueMarkerIcon,
  reverseGeocodeNominatim,
  searchLocationNominatim,
  getCoordinatesFromLocation,
} from '../../utils/mapUtils';
import { Issue } from '../../types/issue';
import {
  MapPin,
  Navigation,
  Search,
  Loader2,
  CheckCircle2,
  Info,
  Maximize2,
  Minimize2,
  Compass,
} from 'lucide-react';

interface LocationPickerMapProps {
  initialLocation?: string;
  initialLat?: number | null;
  initialLng?: number | null;
  onLocationSelect: (address: string, lat: number, lng: number) => void;
  nearbyIssues?: Issue[];
  className?: string;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  initialLocation = '',
  initialLat,
  initialLng,
  onLocationSelect,
  nearbyIssues = [],
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const nearbyLayerRef = useRef<L.LayerGroup | null>(null);

  // Determine starting coordinates
  const getInitialCoords = (): [number, number] => {
    if (initialLat && initialLng && !isNaN(initialLat) && !isNaN(initialLng)) {
      return [initialLat, initialLng];
    }
    if (initialLocation) {
      return getCoordinatesFromLocation(initialLocation);
    }
    return MATALE_DEFAULT_CENTER;
  };

  const [coords, setCoords] = useState<[number, number]>(getInitialCoords());
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodedAddress, setGeocodedAddress] = useState<string>(initialLocation || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: number; lng: number }>>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Reverse geocodes and alerts parent
  const handleCoordsUpdate = useCallback(
    async (lat: number, lng: number, manualAddress?: string) => {
      setCoords([lat, lng]);
      setIsGeocoding(true);

      try {
        const address = manualAddress || (await reverseGeocodeNominatim(lat, lng));
        setGeocodedAddress(address);
        onLocationSelect(address, lat, lng);
      } catch (e) {
        console.error('Failed to resolve address:', e);
        const fallback = manualAddress || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        setGeocodedAddress(fallback);
        onLocationSelect(fallback, lat, lng);
      } finally {
        setIsGeocoding(false);
      }
    },
    [onLocationSelect]
  );

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double init

    const initialPos = getInitialCoords();

    const map = L.map(mapContainerRef.current, {
      center: initialPos,
      zoom: 15,
      zoomControl: false,
      attributionControl: true,
    });

    // OpenStreetMap 100% Free & Open-Source Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Zoom controls on top-right
    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(map);

    // Interactive Draggable Marker
    const marker = L.marker(initialPos, {
      icon: createPickerMarkerIcon(),
      draggable: true,
      autoPan: true,
    }).addTo(map);

    marker.bindPopup(`
      <div class="p-2 text-xs">
        <strong class="text-slate-900 block font-bold mb-0.5">Problem Location</strong>
        <span class="text-slate-500">Drag or tap anywhere to reposition</span>
      </div>
    `);

    // Handle Marker Drag End
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      handleCoordsUpdate(pos.lat, pos.lng);
    });

    // Handle Map Click to Move Marker
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      handleCoordsUpdate(lat, lng);
    });

    // Layer group for nearby issues
    const nearbyGroup = L.layerGroup().addTo(map);
    nearbyLayerRef.current = nearbyGroup;

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update nearby issue markers
  useEffect(() => {
    if (!mapInstanceRef.current || !nearbyLayerRef.current) return;
    nearbyLayerRef.current.clearLayers();

    if (nearbyIssues.length > 0) {
      nearbyIssues.forEach((issue) => {
        let issueLat = issue.latitude;
        let issueLng = issue.longitude;

        if (!issueLat || !issueLng) {
          const fallback = getCoordinatesFromLocation(issue.location);
          issueLat = fallback[0];
          issueLng = fallback[1];
        }

        const nearbyMarker = L.marker([issueLat, issueLng], {
          icon: createIssueMarkerIcon(issue.priorityLevel, issue.priorityScore),
          opacity: 0.85,
        });

        nearbyMarker.bindPopup(`
          <div class="p-3 max-w-xs text-xs">
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="font-bold text-[10px] uppercase text-red-500">${issue.category}</span>
              <span class="font-bold text-[10px] text-slate-500">${issue.priorityLevel} (${issue.priorityScore} pts)</span>
            </div>
            <div class="font-bold text-slate-900 text-xs mb-1 line-clamp-1">${issue.title}</div>
            <div class="text-[11px] text-slate-500 mb-2 line-clamp-2">${issue.location}</div>
            <div class="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded font-medium">
              Existing problem reported nearby
            </div>
          </div>
        `);

        nearbyLayerRef.current?.addLayer(nearbyMarker);
      });
    }
  }, [nearbyIssues]);

  // If initialLocation changed externally (e.g., from quick suggestions or editing)
  useEffect(() => {
    if (initialLocation && initialLocation !== geocodedAddress && mapInstanceRef.current && markerRef.current) {
      const parsedCoords = getCoordinatesFromLocation(initialLocation);
      setCoords(parsedCoords);
      setGeocodedAddress(initialLocation);
      markerRef.current.setLatLng(parsedCoords);
      mapInstanceRef.current.panTo(parsedCoords, { animate: true });
    }
  }, [initialLocation]);

  // Trigger search on Nominatim
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchLocationNominatim(searchQuery);
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: { display_name: string; lat: number; lng: number }) => {
    if (mapInstanceRef.current && markerRef.current) {
      const newPos: [number, number] = [result.lat, result.lng];
      markerRef.current.setLatLng(newPos);
      mapInstanceRef.current.flyTo(newPos, 16, { animate: true, duration: 1 });
      handleCoordsUpdate(result.lat, result.lng, result.display_name.split(',').slice(0, 3).join(', '));
    }
    setSearchResults([]);
    setSearchQuery('');
  };

  // Jump to town preset
  const handleSelectPreset = (preset: (typeof SRI_LANKA_TOWN_PRESETS)[0]) => {
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng(preset.coords);
      mapInstanceRef.current.flyTo(preset.coords, 15, { animate: true, duration: 0.8 });
      handleCoordsUpdate(preset.coords[0], preset.coords[1], `${preset.name} Town, ${preset.district}`);
    }
  };

  // HTML5 Geolocation ("Locate Me")
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationSuccess(false);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current && markerRef.current) {
          const userPos: [number, number] = [latitude, longitude];
          markerRef.current.setLatLng(userPos);
          mapInstanceRef.current.flyTo(userPos, 17, { animate: true, duration: 1.2 });
          handleCoordsUpdate(latitude, longitude);
          setLocationSuccess(true);
          setTimeout(() => setLocationSuccess(false), 3000);
        }
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation failed:', err);
        setIsLocating(false);
        // Fallback to Matale default
        if (mapInstanceRef.current && markerRef.current) {
          markerRef.current.setLatLng(MATALE_DEFAULT_CENTER);
          mapInstanceRef.current.flyTo(MATALE_DEFAULT_CENTER, 15);
          handleCoordsUpdate(MATALE_DEFAULT_CENTER[0], MATALE_DEFAULT_CENTER[1], 'Matale Town, Matale');
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Map Resize trigger when container expands/collapses
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 250);
    }
  }, [isExpanded]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Map Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Compass className="w-4 h-4 text-red-500 animate-spin-slow" />
          <span>Interactive OpenStreetMap (Click or Drag Pin to Define Problem Location)</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Locate Me GPS Button */}
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer ${
              locationSuccess
                ? 'liquid-btn-emerald'
                : 'liquid-btn-glass text-red-600 dark:text-red-400'
            }`}
            title="Use current GPS location"
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : locationSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Navigation className="w-3.5 h-3.5" />
            )}
            <span>{isLocating ? 'Locating…' : locationSuccess ? 'Located!' : 'Locate Me'}</span>
          </button>

          {/* Expand/Collapse Map */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl liquid-btn-glass text-slate-600 dark:text-slate-300 cursor-pointer"
            title={isExpanded ? 'Collapse Map' : 'Enlarge Map'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Search Bar for Map */}
      <div className="relative">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Sri Lankan town or landmark (e.g. 'Matale Clock Tower', 'Kandy Lake')…"
              className="w-full pl-10 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-surface-elevated border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/40"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 py-2 rounded-xl text-xs font-bold liquid-btn-crimson disabled:opacity-50 transition-all flex items-center space-x-1 cursor-pointer"
          >
            {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Search</span>}
          </button>
        </form>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-surface-elevated rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl z-30 overflow-hidden divide-y divide-slate-100 dark:divide-white/5">
            <div className="p-2 text-[10px] uppercase font-bold text-slate-400 bg-slate-50 dark:bg-surface flex items-center justify-between">
              <span>Matching Sri Lankan Locations</span>
              <button
                type="button"
                onClick={() => setSearchResults([])}
                className="text-red-500 hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
            {searchResults.map((res, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSearchResult(res)}
                className="w-full text-left p-2.5 hover:bg-slate-50 dark:hover:bg-surface flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="truncate">{res.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Leaflet Map Frame */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-inner transition-all duration-300 ${
          isExpanded ? 'h-96' : 'h-64'
        }`}
      >
        {/* Leaflet DOM container */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Info Overlay at Map Bottom */}
        <div className="absolute bottom-2 left-2 right-2 sm:right-auto sm:max-w-md bg-white/95 dark:bg-surface/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-lg z-10 flex items-center justify-between gap-2 pointer-events-auto">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            <div className="truncate">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Selected Coordinates
              </div>
              <div className="text-xs font-mono font-bold text-slate-900 dark:text-white tabular-nums truncate">
                {coords[0].toFixed(5)}, {coords[1].toFixed(5)}
              </div>
            </div>
          </div>

          {isGeocoding && (
            <div className="flex items-center space-x-1 text-[11px] text-red-500 font-semibold bg-red-500/10 px-2 py-1 rounded-lg">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Resolving address…</span>
            </div>
          )}
        </div>
      </div>

      {/* Sri Lankan Town Quick Jumps */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
        <span className="text-slate-400 whitespace-nowrap font-medium flex items-center space-x-1">
          <Info className="w-3 h-3 text-slate-400" />
          <span>Quick Towns:</span>
        </span>
        {SRI_LANKA_TOWN_PRESETS.map((town) => (
          <button
            key={town.name}
            type="button"
            onClick={() => handleSelectPreset(town)}
            className="px-2.5 py-1 text-xs whitespace-nowrap cursor-pointer transition-all liquid-pill"
          >
            {town.name}
          </button>
        ))}
      </div>
    </div>
  );
};
