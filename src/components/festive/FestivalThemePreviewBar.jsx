import React, { useState } from 'react';
import { useFestivalTheme } from '../../hooks/useFestivalTheme';
import { Sparkles, Eye, X, ChevronDown, RefreshCw, Calendar, Power, AlertCircle } from 'lucide-react';

/**
 * FestivalThemePreviewBar
 * 
 * Developer & QA Studio Controller:
 * - 1-Click preview of all 15 supported festival themes or Normal Mode.
 * - Live Asia/Kolkata date display & simulated date testing.
 * - Emergency Theme Disable Switch.
 * - Displays overlapping festival detection.
 * - Strictly isolated: only renders in DEV mode, when ?festival=... or ?festive_debug=1 is in URL.
 *   Real visitors on production will never see this controller.
 */
export default function FestivalThemePreviewBar() {
  const { 
    isSystemEnabled,
    isFestivalMode, 
    activeFestival, 
    overlappingFestivals,
    isManualPreview, 
    currentISTDate, 
    previewFestival, 
    toggleEmergencyDisable,
    allFestivals 
  } = useFestivalTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Guard: only show if dev mode, manual preview active, or debug flag in URL
  const isDebugRequested = typeof window !== 'undefined' && (
    window.location.search.includes('festival') ||
    window.location.search.includes('festive_debug') ||
    window.location.search.includes('festive_date')
  );

  const shouldRender = (import.meta.env.DEV || isManualPreview || isDebugRequested) && !isDismissed;

  if (!shouldRender) {
    return null;
  }

  const handleSelectFestival = (festivalId) => {
    previewFestival(festivalId);
    setIsOpen(false);
  };

  const handleSimulateDate = (dateStr) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (dateStr) {
        url.searchParams.set('festive_date', dateStr);
        url.searchParams.delete('festival');
      } else {
        url.searchParams.delete('festive_date');
      }
      window.location.href = url.toString();
    }
  };

  return (
    <aside 
      aria-label="Festival Theme Experience Controller"
      className="fixed bottom-4 left-4 z-50 select-none font-sans"
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl shadow-2xl p-2.5 sm:p-3 text-xs flex items-center gap-2.5 transition-all">
        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 pl-1">
          <span className={`w-2.5 h-2.5 rounded-full ${!isSystemEnabled ? 'bg-rose-500' : isFestivalMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
          <span className="font-bold tracking-wide uppercase text-[10px] text-slate-300">
            {!isSystemEnabled ? 'System OFF' : isManualPreview ? 'Preview Mode' : 'Live IST'}
          </span>
        </div>

        {/* Current State Pill */}
        <div className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-1.5 font-medium">
          <span className="text-sm">{activeFestival?.badgeIcon || '🏛️'}</span>
          <span className="max-w-[120px] sm:max-w-[160px] truncate">
            {activeFestival ? activeFestival.nameEn : 'Normal Mode (Clean)'}
          </span>
        </div>

        {/* Date Display */}
        <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/60 text-slate-400 text-[11px]">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>{currentISTDate}</span>
        </div>

        {/* Overlapping Festivals Pill (if any) */}
        {overlappingFestivals && overlappingFestivals.length > 0 && (
          <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-900/50 border border-purple-500/30 text-purple-200 text-[10px]" title="Overlapping celebration dates detected">
            <AlertCircle className="w-3 h-3 text-purple-400" />
            <span>+{overlappingFestivals.length} overlapping</span>
          </div>
        )}

        {/* Festival Dropdown Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-semibold text-[11px] transition-colors"
            title="Switch Festival Experience"
          >
            <Eye className="w-3 h-3" />
            <span>Test Experience</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {isOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-72 max-h-96 overflow-y-auto rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 space-y-1.5 z-50">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 border-b border-slate-800 flex justify-between items-center">
                <span>Festival Experience Studio</span>
                <span className="text-emerald-400 font-mono">15 Themes</span>
              </div>

              {/* Normal Mode Button */}
              <button
                onClick={() => handleSelectFestival('normal')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  !isFestivalMode 
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' 
                    : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>🏛️</span>
                  <span>Normal Mode (Clean Fintech)</span>
                </span>
                {!isFestivalMode && <span className="text-[10px] text-emerald-400">Active</span>}
              </button>

              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-1.5 pb-0.5">
                Indian Festivals & Celebrations
              </div>

              {allFestivals.map((fest) => {
                const isCurrent = activeFestival?.id === fest.id;
                return (
                  <button
                    key={fest.id}
                    onClick={() => handleSelectFestival(fest.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isCurrent 
                        ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' 
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span>{fest.badgeIcon || '✨'}</span>
                      <span className="truncate">{fest.nameEn}</span>
                    </span>
                    {isCurrent && <span className="text-[10px] text-amber-400 shrink-0">Active</span>}
                  </button>
                );
              })}

              {/* Quick Date Simulation Shortcuts */}
              <div className="border-t border-slate-800 pt-1.5 px-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Simulate Live Date (IST)
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <button 
                    onClick={() => handleSimulateDate('2026-11-08')}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-left truncate"
                  >
                    🪔 Diwali (Nov 08)
                  </button>
                  <button 
                    onClick={() => handleSimulateDate('2026-03-03')}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-left truncate"
                  >
                    🎨 Holi (Mar 03)
                  </button>
                  <button 
                    onClick={() => handleSimulateDate('2026-12-25')}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-left truncate"
                  >
                    🎄 Christmas (Dec 25)
                  </button>
                  <button 
                    onClick={() => handleSimulateDate('2026-08-15')}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-left truncate"
                  >
                    🇮🇳 Independence (Aug 15)
                  </button>
                </div>
              </div>

              {/* Emergency Switch Toggle */}
              <div className="border-t border-slate-800 pt-1.5 px-2">
                <button
                  onClick={() => toggleEmergencyDisable(!isSystemEnabled)}
                  className={`w-full p-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors ${
                    isSystemEnabled 
                      ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30' 
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{isSystemEnabled ? 'Emergency Disable All Themes' : 'Re-enable Festival System'}</span>
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Hide preview bar"
          aria-label="Hide preview bar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
