import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { JAIPUR_LOCALITIES } from '../services/solarDataService';
import { LocationData, SolarRadiationData } from '../types/solar';
import {
  MapPin,
  Search,
  Layers,
  Compass,
  Sun,
  ShieldCheck,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  Info
} from 'lucide-react';

interface InteractiveMapProps {
  currentLocation: LocationData;
  radiationData: SolarRadiationData;
  onLocationChange: (loc: LocationData) => void;
  onSaveLocation?: (loc: LocationData) => void;
  isLoadingWeather?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  currentLocation,
  radiationData,
  onLocationChange,
  onSaveLocation,
  isLoadingWeather = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const zoneLayersRef = useRef<L.LayerGroup | null>(null);

  const [mapType, setMapType] = useState<'streets' | 'satellite'>('satellite');
  const [searchQuery, setSearchQuery] = useState(currentLocation.locality || 'Malviya Nagar, Jaipur');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Fix default marker icon assets
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
    });

    const map = L.map(mapContainerRef.current, {
      center: [currentLocation.latitude, currentLocation.longitude],
      zoom: 13,
      zoomControl: true
    });

    // Custom solar pin icon
    const solarIcon = L.divIcon({
      className: 'custom-solar-pin',
      html: `
        <div style="background-color: #059669; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(5,150,105,0.4); border: 2px solid #ffffff;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
            <path d="m19.07 4.93-1.41 1.41"></path>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Base Tile Layers
    const streetTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    });

    const satelliteTile = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18
      }
    );

    // Default to satellite as requested for rooftop viewing
    satelliteTile.addTo(map);

    const marker = L.marker([currentLocation.latitude, currentLocation.longitude], {
      icon: solarIcon,
      draggable: true
    }).addTo(map);

    marker.bindPopup(`
      <div style="font-size: 13px; font-family: inherit;">
        <strong style="color: #0f172a; display: block; font-size: 14px; margin-bottom: 4px;">${currentLocation.locality || 'Selected Rooftop'}</strong>
        <span style="color: #64748b; display: block; margin-bottom: 6px;">${currentLocation.address}</span>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 4px 8px; font-size: 12px; color: #166534; font-weight: 500;">
          Solar GHI: ${radiationData.annualDailyAverageGHI} kWh/m²/day
        </div>
      </div>
    `).openPopup();

    // Map Click to Drop Pin
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onLocationChange({
        ...currentLocation,
        locality: 'Custom Rooftop Point',
        address: `Custom Location Pin (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E), Jaipur`,
        latitude: Number(lat.toFixed(4)),
        longitude: Number(lng.toFixed(4))
      });
      map.panTo([lat, lng]);
    });

    // Marker drag end
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      onLocationChange({
        ...currentLocation,
        locality: 'Custom Rooftop Pin',
        address: `Pinned Location (${pos.lat.toFixed(4)}°N, ${pos.lng.toFixed(4)}°E), Jaipur`,
        latitude: Number(pos.lat.toFixed(4)),
        longitude: Number(pos.lng.toFixed(4))
      });
    });

    // Zone polygons for Jaipur localities (Solar Potential Heatmap zones)
    const zoneGroup = L.layerGroup();
    JAIPUR_LOCALITIES.forEach(loc => {
      const circle = L.circle([loc.lat, loc.lng], {
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.18,
        radius: 1200,
        weight: 1.5
      });
      circle.bindTooltip(`
        <div style="font-weight: 600; font-size: 12px; color: #065f46;">
          ${loc.name}
          <div style="font-weight: normal; font-size: 11px; color: #374151;">Solar Index: ${loc.solarIndex}</div>
        </div>
      `);
      circle.on('click', () => {
        onLocationChange({
          ...currentLocation,
          locality: loc.name,
          address: `${loc.name}, Jaipur, Rajasthan`,
          latitude: loc.lat,
          longitude: loc.lng
        });
      });
      zoneGroup.addLayer(circle);
    });

    zoneGroup.addTo(map);

    mapInstanceRef.current = map;
    markerRef.current = marker;
    zoneLayersRef.current = zoneGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map when coordinates change
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    const currentCenter = mapInstanceRef.current.getCenter();
    const isDifferent =
      Math.abs(currentCenter.lat - currentLocation.latitude) > 0.001 ||
      Math.abs(currentCenter.lng - currentLocation.longitude) > 0.001;

    if (isDifferent) {
      mapInstanceRef.current.flyTo([currentLocation.latitude, currentLocation.longitude], 14, {
        duration: 1.2
      });
      markerRef.current.setLatLng([currentLocation.latitude, currentLocation.longitude]);
      markerRef.current.setPopupContent(`
        <div style="font-size: 13px; font-family: inherit;">
          <strong style="color: #0f172a; display: block; font-size: 14px; margin-bottom: 4px;">${currentLocation.locality}</strong>
          <span style="color: #64748b; display: block; margin-bottom: 6px;">${currentLocation.address}</span>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 4px 8px; font-size: 12px; color: #166534; font-weight: 500;">
            Solar GHI: ${radiationData.annualDailyAverageGHI} kWh/m²/day
          </div>
        </div>
      `);
    }
  }, [currentLocation.latitude, currentLocation.longitude, currentLocation.locality, radiationData.annualDailyAverageGHI]);

  // Switch Base Layers
  const toggleMapLayer = (type: 'streets' | 'satellite') => {
    if (!mapInstanceRef.current) return;
    setMapType(type);

    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    if (type === 'streets') {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
    } else {
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri',
          maxZoom: 18
        }
      ).addTo(mapInstanceRef.current);
    }
  };

  // Toggle heatmap zones
  const toggleHeatmap = () => {
    if (!mapInstanceRef.current || !zoneLayersRef.current) return;
    if (showHeatmap) {
      mapInstanceRef.current.removeLayer(zoneLayersRef.current);
      setShowHeatmap(false);
    } else {
      mapInstanceRef.current.addLayer(zoneLayersRef.current);
      setShowHeatmap(true);
    }
  };

  const handleLocalitySelect = (loc: typeof JAIPUR_LOCALITIES[0]) => {
    onLocationChange({
      ...currentLocation,
      locality: loc.name,
      address: `${loc.name}, Jaipur, Rajasthan`,
      latitude: loc.lat,
      longitude: loc.lng
    });
    setSearchQuery(`${loc.name}, Jaipur`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    const matched = JAIPUR_LOCALITIES.find(l => l.name.toLowerCase().includes(query));
    if (matched) {
      handleLocalitySelect(matched);
    } else {
      // Default to Jaipur center if custom query
      onLocationChange({
        ...currentLocation,
        locality: searchQuery,
        address: `${searchQuery}, Jaipur, Rajasthan`,
        latitude: 26.9124,
        longitude: 75.7873
      });
    }
  };

  const handleSave = () => {
    if (onSaveLocation) {
      onSaveLocation(currentLocation);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2400);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Top Controls Bar */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/70">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search address or Jaipur locality (e.g. Mansarovar)..."
            className="w-full pl-9 pr-20 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            Locate
          </button>
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Map Layer Switcher */}
          <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => toggleMapLayer('satellite')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                mapType === 'satellite'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satellite (Rooftop)
            </button>
            <button
              type="button"
              onClick={() => toggleMapLayer('streets')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                mapType === 'streets'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Street Map
            </button>
          </div>

          {/* Heatmap Layer Toggle */}
          <button
            type="button"
            onClick={toggleHeatmap}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
              showHeatmap
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            Solar Potential Zones
          </button>

          {/* Save Location Button */}
          {onSaveLocation && (
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Saved!
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  Save Location
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Quick Locality Selector Pills (Clean filter buttons) */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
        <span className="text-slate-500 font-medium whitespace-nowrap shrink-0 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-slate-400" />
          Jaipur Localities:
        </span>
        {JAIPUR_LOCALITIES.map((loc) => {
          const isActive = currentLocation.locality === loc.name;
          return (
            <button
              key={loc.name}
              type="button"
              onClick={() => handleLocalitySelect(loc)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {loc.name}
            </button>
          );
        })}
      </div>

      {/* Map Viewport */}
      <div className="relative">
        <div ref={mapContainerRef} className="w-full h-[440px] md:h-[480px] bg-slate-900" />

        {/* Floating Solar Resource Indicator Card */}
        <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-3 shadow-lg max-w-xs text-xs pointer-events-auto">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Solar Potential Metric</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              Top Tier Zone
            </span>
          </div>

          <div className="space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span>Daily Irradiance (GHI):</span>
              <span className="font-mono font-bold text-slate-900">
                {radiationData.annualDailyAverageGHI} kWh/m²/day
              </span>
            </div>
            <div className="flex justify-between">
              <span>Peak Sun Hours:</span>
              <span className="font-mono font-medium text-slate-800">~5.4 hrs/day</span>
            </div>
            <div className="flex justify-between">
              <span>Coordinates:</span>
              <span className="font-mono text-slate-500">
                {currentLocation.latitude.toFixed(4)}°N, {currentLocation.longitude.toFixed(4)}°E
              </span>
            </div>
            <div className="flex justify-between">
              <span>Data Source:</span>
              <span className="font-medium text-slate-700 truncate max-w-[130px]">
                {radiationData.dataSourceName}
              </span>
            </div>
          </div>

          {isLoadingWeather && (
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1 text-[11px] text-emerald-600">
              <div className="w-2.5 h-2.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              Updating NASA satellite radiation metrics...
            </div>
          )}
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 z-[400] bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg p-2.5 shadow-md text-[11px] pointer-events-auto">
          <div className="font-medium text-slate-700 mb-1.5">Solar Potential Scale</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="text-slate-600">&gt; 5.2 kWh/m²</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="text-slate-600">4.5 - 5.2</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 italic">
            Click map or drag pin to inspect any rooftop
          </div>
        </div>
      </div>

      {/* Selected Location Details Strip */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-slate-700">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="font-semibold text-slate-900">{currentLocation.locality || 'Jaipur'}</span>
            <span className="text-slate-500 mx-1.5">·</span>
            <span className="text-slate-600">{currentLocation.address}</span>
            <span className="text-slate-500 mx-1.5">·</span>
            <span className="font-mono text-slate-500">
              [{currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}]
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 shrink-0">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Note: City GHI radiation data is contextualized with your rooftop area below.</span>
        </div>
      </div>
    </div>
  );
};
