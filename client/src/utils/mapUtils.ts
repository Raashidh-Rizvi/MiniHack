import L from 'leaflet';
import { PriorityLevel } from '../types/issue';

export interface LocationCoordinate {
  lat: number;
  lng: number;
}

export const SRI_LANKA_DEFAULT_CENTER: [number, number] = [7.8731, 80.7718]; // Geographic center of Sri Lanka
export const MATALE_DEFAULT_CENTER: [number, number] = [7.4675, 80.6234]; // Primary demo area

export interface TownPreset {
  name: string;
  coords: [number, number];
  district: string;
}

export const SRI_LANKA_TOWN_PRESETS: TownPreset[] = [
  { name: 'Matale', coords: [7.4675, 80.6234], district: 'Central Province' },
  { name: 'Kandy', coords: [7.2906, 80.6337], district: 'Central Province' },
  { name: 'Colombo', coords: [6.9271, 79.8612], district: 'Western Province' },
  { name: 'Galle', coords: [6.0535, 80.2210], district: 'Southern Province' },
  { name: 'Jaffna', coords: [9.6615, 80.0255], district: 'Northern Province' },
  { name: 'Kurunegala', coords: [7.4863, 80.3623], district: 'North Western Province' },
  { name: 'Negombo', coords: [7.2008, 79.8736], district: 'Western Province' },
  { name: 'Trincomalee', coords: [8.5874, 81.2152], district: 'Eastern Province' },
];

/**
 * Approximate coordinates resolver for existing issues based on text location
 */
export function getCoordinatesFromLocation(locationText: string): [number, number] {
  if (!locationText) return MATALE_DEFAULT_CENTER;
  const lower = locationText.toLowerCase();

  for (const preset of SRI_LANKA_TOWN_PRESETS) {
    if (lower.includes(preset.name.toLowerCase())) {
      // Small deterministic jitter so multiple issues in the same town don't stack directly on top of each other
      const hash = Math.abs(locationText.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
      const jitterLat = ((hash % 100) - 50) * 0.0003;
      const jitterLng = (((hash * 7) % 100) - 50) * 0.0003;
      return [preset.coords[0] + jitterLat, preset.coords[1] + jitterLng];
    }
  }

  return MATALE_DEFAULT_CENTER;
}

// In-memory cache to prevent spamming the open-source Nominatim API
const reverseGeocodeCache = new Map<string, string>();

/**
 * OpenStreetMap Nominatim Reverse Geocoding
 * Converts [lat, lng] into a clean Sri Lankan neighborhood address string.
 */
export async function reverseGeocodeNominatim(lat: number, lng: number): Promise<string> {
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  if (reverseGeocodeCache.has(cacheKey)) {
    return reverseGeocodeCache.get(cacheKey)!;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        // Identify application politely per OpenStreetMap Nominatim Usage Policy
        'User-Agent': 'GramaFix-Civic-Platform/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.status}`);
    }

    const data = await response.json();
    const addr = data.address || {};

    // Build an intuitive, concise civic address
    const street = addr.road || addr.pedestrian || addr.street || addr.neighbourhood || '';
    const suburb = addr.suburb || addr.quarter || addr.village || addr.hamlet || '';
    const city = addr.city || addr.town || addr.municipality || addr.county || addr.district || '';

    const parts = [street, suburb, city].filter(Boolean);
    const resolved = parts.length > 0 ? parts.join(', ') : data.display_name?.split(',').slice(0, 3).join(',') || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

    reverseGeocodeCache.set(cacheKey, resolved);
    return resolved;
  } catch (err) {
    console.warn('Reverse geocode fallback:', err);
    return `Pinned Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }
}

/**
 * Forward Geocoding Search via Nominatim OpenStreetMap
 */
export async function searchLocationNominatim(query: string): Promise<Array<{ display_name: string; lat: number; lng: number }>> {
  if (!query || query.trim().length < 3) return [];

  try {
    const encoded = encodeURIComponent(query.trim());
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encoded}&countrycodes=lk&limit=5&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'GramaFix-Civic-Platform/1.0',
      },
    });

    if (!response.ok) return [];
    const data = await response.json();

    return data.map((item: any) => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch (err) {
    console.warn('Geocoding search failed:', err);
    return [];
  }
}

/**
 * Custom SVG Leaflet Pin for Problem Picker
 */
export function createPickerMarkerIcon(isDragging = false) {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full cursor-pointer transition-transform ${isDragging ? 'scale-110' : ''}">
        <!-- Radar wave -->
        <span class="absolute w-8 h-8 rounded-full bg-red-500/30 animate-ping pointer-events-none"></span>
        <span class="absolute w-12 h-12 rounded-full bg-red-500/15 pointer-events-none"></span>
        
        <!-- Pin Body -->
        <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-red-500 border-2 border-white shadow-[0_4px_16px_rgba(239,68,68,0.6)] flex items-center justify-center text-white z-10">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <!-- Pointer tail -->
        <div class="absolute -bottom-1 w-2 h-2 bg-red-600 rotate-45 border-r border-b border-white z-0"></div>
      </div>
    `,
    iconSize: [36, 42],
    iconAnchor: [18, 42],
    popupAnchor: [0, -42],
  });
}

/**
 * Priority color mapping for issue map markers
 */
const PRIORITY_COLORS: Record<PriorityLevel, { bg: string; border: string; glow: string }> = {
  CRITICAL: { bg: '#dc2626', border: '#b91c1c', glow: 'rgba(220, 38, 38, 0.45)' },
  HIGH: { bg: '#ea580c', border: '#c2410c', glow: 'rgba(234, 88, 12, 0.4)' },
  MEDIUM: { bg: '#0284c7', border: '#0369a1', glow: 'rgba(2, 132, 199, 0.35)' },
  LOW: { bg: '#059669', border: '#047857', glow: 'rgba(5, 150, 105, 0.3)' },
};

/**
 * Custom SVG Marker for Displaying Community Issues on the Map
 */
export function createIssueMarkerIcon(priorityLevel: PriorityLevel, score: number, isSelected = false) {
  const color = PRIORITY_COLORS[priorityLevel] || PRIORITY_COLORS.MEDIUM;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-115'}">
        ${priorityLevel === 'CRITICAL' ? `<span class="absolute w-8 h-8 rounded-full bg-red-500/40 animate-ping pointer-events-none"></span>` : ''}
        <div class="w-8 h-8 rounded-full border-2 border-white text-white font-extrabold text-[10px] flex items-center justify-center shadow-lg"
             style="background-color: ${color.bg}; box-shadow: 0 4px 12px ${color.glow};">
          ${score}
        </div>
        <div class="absolute -bottom-1 w-2 h-2 rotate-45 border-r border-b border-white" style="background-color: ${color.bg};"></div>
      </div>
    `,
    iconSize: [32, 38],
    iconAnchor: [16, 38],
    popupAnchor: [0, -38],
  });
}
