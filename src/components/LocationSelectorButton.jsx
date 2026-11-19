import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useAppLocation } from '../context/LocationContext';

/**
 * LocationSelectorButton component for Navbar & Mobile views
 * - Desktop: [ 📍 Location ▾ ]
 * - Mobile: [ 📍 City ]
 */
export default function LocationSelectorButton({
  variant = 'desktop',
  className = '',
  onClick
}) {
  const { selectedLocation, openLocationSelector, getCityDisplayName, getFormattedLocation, isAllIndia } = useAppLocation();

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else {
      openLocationSelector();
    }
  };

  const displayText = isAllIndia
    ? 'All India'
    : selectedLocation?.stateCode
      ? `${selectedLocation.name}, ${selectedLocation.stateCode}`
      : selectedLocation?.name || 'All India';

  const fullLocationText = getFormattedLocation(selectedLocation);

  if (variant === 'mobile') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 text-xs font-bold text-gray-800 dark:text-slate-100 hover:border-[#006B50] dark:hover:border-[#159B72] transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 max-w-[130px] whitespace-nowrap ${className}`}
        aria-label={`Change current location from ${displayText}`}
        title={`Current location: ${fullLocationText}. Click to change.`}
      >
        <MapPin className="w-3.5 h-3.5 text-[#006B50] dark:text-[#159B72] shrink-0" />
        <span className="truncate max-w-[85px] whitespace-nowrap overflow-hidden text-ellipsis block">
          {selectedLocation?.name || 'All India'}
        </span>
      </button>
    );
  }

  // Desktop Pill Button
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group inline-flex items-center gap-1.5 px-2.5 sm:px-2.5 py-1.5 rounded-xl border border-gray-200/90 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 hover:bg-[#FAF9F4]/50 dark:hover:bg-slate-700/50 hover:border-[#006B50]/40 dark:hover:border-[#159B72]/40 transition-all cursor-pointer shadow-xs active:scale-98 shrink-0 max-w-[155px] select-none ${className}`}
      aria-label={`Select location, currently ${displayText}`}
      title={`Current location: ${fullLocationText}. Click to change.`}
    >
      <div className="w-5 h-5 rounded-lg bg-[#006B50]/10 dark:bg-[#006B50]/20 text-[#006B50] dark:text-[#159B72] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
        <MapPin className="w-3.5 h-3.5 shrink-0" />
      </div>

      <div className="flex flex-col text-left min-w-0 max-w-[90px] sm:max-w-[95px]">
        <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 dark:text-slate-400 leading-none whitespace-nowrap overflow-hidden text-ellipsis block">
          Location
        </span>
        <span className="text-xs font-bold text-gray-800 dark:text-slate-100 truncate leading-tight whitespace-nowrap overflow-hidden text-ellipsis block">
          {displayText}
        </span>
      </div>

      <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-slate-400 group-hover:text-[#006B50] dark:group-hover:text-[#159B72] transition-colors shrink-0 ml-0.5" />
    </button>
  );
}
