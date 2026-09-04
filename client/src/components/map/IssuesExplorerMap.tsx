import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Issue } from '../../types/issue';
import {
  SRI_LANKA_DEFAULT_CENTER,
  getCoordinatesFromLocation,
  createIssueMarkerIcon,
} from '../../utils/mapUtils';
import { getPriorityBadgeColor } from '../../utils/priority';
import {
  MapPin,
  Layers,
  Eye,
} from 'lucide-react';
import { SriLankanLion } from '../common/SriLankanLion';

interface IssuesExplorerMapProps {
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  selectedIssueId?: number | null;
  className?: string;
}

export const IssuesExplorerMap: React.FC<IssuesExplorerMapProps> = ({
  issues,
  onSelectIssue,
  selectedIssueId,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: SRI_LANKA_DEFAULT_CENTER,
      zoom: 8,
      zoomControl: false,
      attributionControl: true,
    });

    // OpenStreetMap 100% Free Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Update markers when issues list changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    const bounds = L.latLngBounds([]);

    issues.forEach((issue) => {
      let lat = issue.latitude;
      let lng = issue.longitude;

      if (!lat || !lng) {
        const fallback = getCoordinatesFromLocation(issue.location);
        lat = fallback[0];
        lng = fallback[1];
      }

      const latLng = L.latLng(lat, lng);
      bounds.extend(latLng);

      const isSelected = selectedIssueId === issue.id;
      const marker = L.marker(latLng, {
        icon: createIssueMarkerIcon(issue.priorityLevel, issue.priorityScore, isSelected),
        title: issue.title,
      });

      marker.on('click', () => {
        setActiveIssue(issue);
        mapInstanceRef.current?.panTo(latLng, { animate: true });
      });

      markersLayerRef.current?.addLayer(marker);
    });

    // Automatically fit map bounds to cover all issues if available
    if (bounds.isValid() && issues.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 14,
      });
    }
  }, [issues, selectedIssueId]);

  // Center on selected issue if changed externally
  useEffect(() => {
    if (!selectedIssueId || !mapInstanceRef.current) return;
    const target = issues.find((i) => i.id === selectedIssueId);
    if (target) {
      setActiveIssue(target);
      const lat = target.latitude || getCoordinatesFromLocation(target.location)[0];
      const lng = target.longitude || getCoordinatesFromLocation(target.location)[1];
      mapInstanceRef.current.flyTo([lat, lng], 15, { animate: true, duration: 1 });
    }
  }, [selectedIssueId, issues]);

  const activeBadge = activeIssue ? getPriorityBadgeColor(activeIssue.priorityLevel) : null;

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl bg-white dark:bg-surface ${className}`}>
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-10 bg-white/90 dark:bg-surface/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-md flex items-center space-x-2 text-xs">
        <Layers className="w-4 h-4 text-red-500" />
        <span className="font-bold text-slate-800 dark:text-slate-100">
          Showing {issues.length} Community Reports Across Sri Lanka
        </span>
      </div>

      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-[520px]" />

      {/* Interactive Active Issue Drawer/Card at Bottom */}
      {activeIssue && activeBadge && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-white dark:bg-surface-elevated p-4 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl z-20 animate-fadeIn space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md">
                {activeIssue.category}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeBadge.bg} ${activeBadge.text} ${activeBadge.border}`}>
                {activeIssue.priorityLevel} ({activeIssue.priorityScore} pts)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveIssue(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold px-1"
            >
              &times;
            </button>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
              {activeIssue.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              <span className="truncate">{activeIssue.location}</span>
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center space-x-1 text-xs text-rose-500 font-bold">
              <SriLankanLion size={14} color="#EF4444" accentColor="#991B1B" />
              <span>{activeIssue.supportCount || 0} Upvotes</span>
            </div>

            <button
              type="button"
              onClick={() => onSelectIssue(activeIssue)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold liquid-btn-crimson flex items-center space-x-1 cursor-pointer transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View & Endorse</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
