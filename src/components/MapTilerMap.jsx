import React, { useEffect, useRef, useState } from 'react';
import { loadMapTilerSDK } from '../utils/mapTilerLoader';
import { ExternalLink, Navigation, MapPin, AlertCircle, Key, RefreshCw } from 'lucide-react';

const BANK_COLORS = {
  'HDFC Bank': '#004c8f',
  'SBI': '#280071',
  'ICICI Bank': '#f58220',
  'Axis Bank': '#97144d',
  'Kotak Mahindra Bank': '#ed1c24',
  'IndusInd Bank': '#8b0000',
  'Federal Bank': '#003366',
  'IDFC FIRST Bank': '#9c1c26',
  'Punjab National Bank': '#a20a1d'
};

function getBankColor(bankName) {
  const norm = String(bankName || '').trim();
  for (const [key, color] of Object.entries(BANK_COLORS)) {
    if (norm.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(norm.toLowerCase())) {
      return color;
    }
  }
  return '#2563eb';
}

function MapTilerMap({
  userCoords,
  branches = [],
  focusedBranch = null,
  onSelectBranch = null,
  radiusKm = 10,
  className = ""
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  const [sdkStatus, setSdkStatus] = useState('loading'); // 'loading' | 'ready' | 'missing-key' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);

  const apiKey = import.meta.env.MAPTILER_API_KEY;
  const isKeyConfigured = apiKey && apiKey.trim() !== '' && apiKey !== 'your-maptiler-api-key';

  // 1. Initialize MapTiler Map
  useEffect(() => {
    if (!isKeyConfigured) {
      setSdkStatus('missing-key');
      return;
    }

    let isSubscribed = true;

    loadMapTilerSDK()
      .then((maptilersdk) => {
        if (!isSubscribed || !mapContainerRef.current) return;

        maptilersdk.config.apiKey = apiKey.trim();

        // Default center: User coordinates or fallback to Kharar/Chandigarh (30.7463, 76.6469)
        const centerLng = userCoords?.lng || 76.6469;
        const centerLat = userCoords?.lat || 30.7463;

        // Clean existing map instance if any
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.remove();
          } catch (e) {
            // ignore cleanup error
          }
        }

        const map = new maptilersdk.Map({
          container: mapContainerRef.current,
          style: maptilersdk.MapStyle.STREETS,
          center: [centerLng, centerLat],
          zoom: 12,
          navigationControl: false
        });

        // Add standard navigation & fullscreen controls
        map.addControl(new maptilersdk.NavigationControl(), 'top-right');
        map.addControl(new maptilersdk.FullscreenControl(), 'top-right');

        mapInstanceRef.current = map;

        map.on('load', () => {
          if (isSubscribed) {
            setSdkStatus('ready');
          }
        });

        map.on('error', (e) => {
          console.warn('[MapTiler Map Error]:', e);
          if (e && e.error && e.error.status === 403) {
            if (isSubscribed) setSdkStatus('missing-key');
          }
        });
      })
      .catch((err) => {
        console.warn('[MapTiler SDK Load Failed]:', err);
        if (isSubscribed) {
          setErrorMessage(err.message || 'Unable to connect to MapTiler map tiles.');
          setSdkStatus('error');
        }
      });

    return () => {
      isSubscribed = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore cleanup
        }
        mapInstanceRef.current = null;
      }
    };
  }, [apiKey, isKeyConfigured]);

  // 2. Update User & Branch Markers when map is ready or branches change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || sdkStatus !== 'ready' || !window.maptilersdk) return;

    // A. Clear old branch markers safely
    markersRef.current.forEach((item) => {
      try {
        if (item.marker && typeof item.marker.remove === 'function') {
          item.marker.remove();
        } else if (typeof item.remove === 'function') {
          item.remove();
        }
      } catch (e) {
        // ignore
      }
    });
    markersRef.current = [];

    // B. Place or Update User Marker
    if (userMarkerRef.current) {
      try {
        if (typeof userMarkerRef.current.remove === 'function') {
          userMarkerRef.current.remove();
        }
      } catch (e) {
        // ignore
      }
      userMarkerRef.current = null;
    }

    if (userCoords?.lat && userCoords?.lng) {
      const userEl = document.createElement('div');
      userEl.className = 'relative flex items-center justify-center cursor-pointer group';
      userEl.innerHTML = `
        <div class="absolute -inset-2 bg-blue-500/20 rounded-full animate-ping"></div>
        <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white font-bold text-xs">
          📍
        </div>
      `;

      const userPopup = new window.maptilersdk.Popup({ offset: 25 }).setHTML(`
        <div class="p-2 text-xs font-sans">
          <p class="font-extrabold text-blue-600">Your Detected Location</p>
          <p class="text-slate-600 mt-0.5 text-[11px]">${userCoords.lat.toFixed(4)}, ${userCoords.lng.toFixed(4)}</p>
        </div>
      `);

      userMarkerRef.current = new window.maptilersdk.Marker({ element: userEl })
        .setLngLat([userCoords.lng, userCoords.lat])
        .setPopup(userPopup)
        .addTo(map);
    }

    // C. Place Branch Markers
    const bounds = new window.maptilersdk.LngLatBounds();
    let hasPoints = false;

    if (userCoords?.lat && userCoords?.lng) {
      bounds.extend([userCoords.lng, userCoords.lat]);
      hasPoints = true;
    }

    branches.forEach((branch) => {
      const color = getBankColor(branch.bank_name);
      bounds.extend([branch.longitude, branch.latitude]);
      hasPoints = true;

      const markerEl = document.createElement('div');
      markerEl.className = 'relative cursor-pointer transition-transform hover:scale-110 active:scale-95';
      markerEl.id = `map-marker-${branch.id}`;
      markerEl.innerHTML = `
        <div style="background-color: ${color};" class="px-2 py-1 rounded-lg text-white font-black text-[10px] shadow-md border-2 border-white flex items-center gap-1">
          <span>${branch.branch_type === 'ATM' ? '🏧' : '🏦'}</span>
          <span class="max-w-[80px] truncate">${branch.bank_name}</span>
        </div>
      `;

      const popupContent = `
        <div class="p-3 text-xs font-sans max-w-[240px] text-left">
          <div class="flex items-center gap-1.5 font-black text-slate-900 mb-1">
            <span class="text-sm">${branch.branch_type === 'ATM' ? '🏧' : '🏦'}</span>
            <span>${branch.bank_name}</span>
          </div>
          <p class="font-bold text-slate-800 text-[11px]">${branch.branch_name}</p>
          <p class="text-slate-600 text-[10px] mt-1 leading-snug">${branch.address}, ${branch.city} - ${branch.pincode}</p>
          <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span class="font-extrabold text-emerald-600">${branch.distanceFormatted || ''}</span>
            <a 
              href="${branch.directionsUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-bold hover:bg-blue-700 transition-colors"
            >
              Directions ↗
            </a>
          </div>
        </div>
      `;

      const popup = new window.maptilersdk.Popup({ offset: 25 }).setHTML(popupContent);

      const marker = new window.maptilersdk.Marker({ element: markerEl })
        .setLngLat([branch.longitude, branch.latitude])
        .setPopup(popup)
        .addTo(map);

      markerEl.addEventListener('click', () => {
        if (onSelectBranch) onSelectBranch(branch);
      });

      markersRef.current.push({ id: branch.id, marker, popup, branch });
    });

    // D. Fit bounds smoothly
    if (hasPoints) {
      map.fitBounds(bounds, {
        padding: { top: 60, bottom: 60, left: 60, right: 60 },
        maxZoom: 14,
        duration: 1000
      });
    }

    return () => {
      markersRef.current.forEach((item) => {
        try {
          if (item.marker && typeof item.marker.remove === 'function') {
            item.marker.remove();
          }
        } catch (e) {
          // ignore
        }
      });
      markersRef.current = [];
    };
  }, [branches, userCoords, sdkStatus, onSelectBranch]);

  // 3. React to focusedBranch change (from card click or View on Map)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !focusedBranch) return;

    map.flyTo({
      center: [focusedBranch.longitude, focusedBranch.latitude],
      zoom: 15,
      essential: true,
      duration: 1200
    });

    const target = markersRef.current.find((m) => m.id === focusedBranch.id);
    if (target && target.marker) {
      target.marker.togglePopup();
    }
  }, [focusedBranch]);

  // Fallback View when MapTiler API Key is not yet populated in .env
  if (sdkStatus === 'missing-key') {
    return (
      <div className={`relative flex flex-col items-center justify-center p-6 text-center rounded-3xl bg-slate-900 border border-slate-800 text-white overflow-hidden shadow-xl min-h-[420px] ${className}`}>
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 max-w-md space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl border border-blue-500/30">
            <Key className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-lg font-black tracking-tight text-white">
              MapTiler API Key Required
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              To render the interactive MapTiler map tiles, add your MapTiler API key to your <code className="px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 font-mono text-[11px]">.env</code> file:
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-blue-300 select-all text-left">
            MAPTILER_API_KEY=your_key_here
          </div>

          <p className="text-[11px] text-slate-400">
            ✅ All {branches.length} bank branches, distance sorting, and Google Maps directions below remain <strong>fully functional</strong>.
          </p>

          {/* Fallback Interactive Mini-Visualizer */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            {branches.slice(0, 4).map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => onSelectBranch && onSelectBranch(b)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                📍 {b.bank_name} ({b.distanceFormatted})
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (sdkStatus === 'error') {
    return (
      <div className={`flex flex-col items-center justify-center p-6 text-center rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 min-h-[420px] ${className}`}>
        <AlertCircle className="w-10 h-10 text-amber-500 mb-3" />
        <h4 className="font-extrabold text-sm">Map Connection Notice</h4>
        <p className="text-xs text-slate-500 max-w-sm mt-1">{errorMessage || 'Map tiles temporarily unavailable.'}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload Page</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md ${className}`}>
      {sdkStatus === 'loading' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs text-white text-xs font-bold">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 shadow-lg">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading MapTiler Map...</span>
          </div>
        </div>
      )}

      {/* Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />

      {/* Map Overlay Badge */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[10px] font-black text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>MapTiler Vector Map • {branches.length} Branches within {radiusKm} km</span>
        </span>
      </div>
    </div>
  );
}

export default MapTilerMap;
