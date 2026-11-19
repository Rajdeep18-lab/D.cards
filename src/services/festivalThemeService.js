import { FESTIVAL_SYSTEM_CONFIG, FESTIVALS } from '../config/festivalCalendar';

export const festivalThemeService = {
  /**
   * Get current calendar date string 'YYYY-MM-DD' in Asia/Kolkata timezone (IST, UTC+5:30)
   */
  getCurrentISTDate(overrideDate = null) {
    if (overrideDate && /^\d{4}-\d{2}-\d{2}$/.test(overrideDate)) {
      return overrideDate;
    }

    if (typeof window !== 'undefined') {
      // 1. In-memory dev/test override
      if (window.__DCARD_FESTIVE_DATE_OVERRIDE__) {
        return String(window.__DCARD_FESTIVE_DATE_OVERRIDE__).trim();
      }
      // 2. URL search param override (for testing, e.g. ?festive_date=2026-11-08)
      try {
        const params = new URLSearchParams(window.location.search);
        const queryDate = params.get('festive_date');
        if (queryDate && /^\d{4}-\d{2}-\d{2}$/.test(queryDate)) {
          return queryDate;
        }
      } catch (_) {}
    }

    // Live Asia/Kolkata (IST) production date
    try {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: FESTIVAL_SYSTEM_CONFIG.timeZone || 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      return formatter.format(new Date());
    } catch (e) {
      // Fallback with exact +5:30 offset
      const istOffsetMs = 5.5 * 60 * 60 * 1000;
      const istDate = new Date(Date.now() + istOffsetMs);
      return istDate.toISOString().slice(0, 10);
    }
  },

  /**
   * Check if manual preview mode is requested (via URL query ?festival=... or sessionStorage)
   */
  getManualPreviewId() {
    if (!FESTIVAL_SYSTEM_CONFIG.previewAllowed) return null;

    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const queryFestival = params.get('festival');
        if (queryFestival) {
          const cleanId = queryFestival.toLowerCase().trim();
          if (cleanId === 'normal' || cleanId === 'reset' || cleanId === 'none') {
            sessionStorage.removeItem('dcard_festival_preview');
            return 'normal';
          }
          if (FESTIVALS.some(f => f.id === cleanId)) {
            sessionStorage.setItem('dcard_festival_preview', cleanId);
            return cleanId;
          }
        }

        const savedPreview = sessionStorage.getItem('dcard_festival_preview');
        if (savedPreview && (savedPreview === 'normal' || FESTIVALS.some(f => f.id === savedPreview))) {
          return savedPreview;
        }
      } catch (_) {}
    }

    return null;
  },

  /**
   * Set or clear manual preview theme
   */
  setManualPreview(festivalId) {
    if (typeof window === 'undefined') return;
    try {
      if (!festivalId || festivalId === 'normal' || festivalId === 'reset' || festivalId === 'none') {
        sessionStorage.removeItem('dcard_festival_preview');
      } else if (FESTIVALS.some(f => f.id === festivalId)) {
        sessionStorage.setItem('dcard_festival_preview', festivalId);
      }
    } catch (_) {}
  },

  /**
   * Detect which festivals are currently active based on date (with priority sorting)
   * Handles multi-day windows and overlapping dates gracefully.
   */
  getActiveFestivalsByDate(dateStr) {
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return [];

    const [yearStr, monthStr, dayStr] = dateStr.split('-');
    const currentYear = parseInt(yearStr, 10);
    const currentMonth = parseInt(monthStr, 10);
    const currentDay = parseInt(dayStr, 10);

    const matches = [];

    for (const festival of FESTIVALS) {
      // 1. Check fixed solar holiday (e.g. Independence Day Aug 15, Republic Day Jan 26)
      if (festival.fixedSolarDate) {
        const { startMonth, startDay, endMonth, endDay } = festival.fixedSolarDate;
        let isMatch = false;

        if (startMonth === endMonth) {
          isMatch = currentMonth === startMonth && currentDay >= startDay && currentDay <= endDay;
        } else {
          // Span across months (e.g. Dec 31 to Jan 2)
          isMatch = (currentMonth === startMonth && currentDay >= startDay) ||
                    (currentMonth === endMonth && currentDay <= endDay);
        }

        if (isMatch) matches.push(festival);
        continue;
      }

      // 2. Check year-specific verified periods (for lunisolar / Islamic / Vikram Samvat dates)
      if (Array.isArray(festival.periods)) {
        const periodForYear = festival.periods.find(p => p.year === currentYear);
        if (periodForYear) {
          if (dateStr >= periodForYear.startDate && dateStr <= periodForYear.endDate) {
            matches.push(festival);
          }
        }
      }
    }

    // Sort by priority weight (higher priority wins during overlap)
    return matches.sort((a, b) => (b.priority || 50) - (a.priority || 50));
  },

  /**
   * Detect top prioritized festival for given date
   */
  getActiveFestivalByDate(dateStr) {
    const matches = this.getActiveFestivalsByDate(dateStr);
    return matches.length > 0 ? matches[0] : null;
  },

  /**
   * Master Emergency switch toggle (runtime in-memory or persisted via sessionStorage)
   */
  isEmergencyDisabled() {
    if (typeof window !== 'undefined') {
      try {
        if (sessionStorage.getItem('dcard_festival_system_disabled') === 'true') {
          return true;
        }
      } catch (_) {}
    }
    return !FESTIVAL_SYSTEM_CONFIG.isFestivalSystemEnabled;
  },

  setEmergencyDisabled(disabled) {
    if (typeof window !== 'undefined') {
      try {
        if (disabled) {
          sessionStorage.setItem('dcard_festival_system_disabled', 'true');
        } else {
          sessionStorage.removeItem('dcard_festival_system_disabled');
        }
      } catch (_) {}
    }
  },

  /**
   * Resolve complete current state:
   * Considers master switch, manual preview, automatic date detection, and overlap priorities.
   */
  resolveThemeState() {
    const isEmergencyOff = this.isEmergencyDisabled();

    // If master switch is off or emergency disabled, strictly force Normal Mode
    if (isEmergencyOff) {
      return {
        isSystemEnabled: false,
        isFestivalMode: false,
        activeFestival: null,
        overlappingFestivals: [],
        isManualPreview: false,
        currentISTDate: this.getCurrentISTDate(),
        theme: null
      };
    }

    // 1. Check manual preview
    const previewId = this.getManualPreviewId();
    if (previewId) {
      if (previewId === 'normal') {
        return {
          isSystemEnabled: true,
          isFestivalMode: false,
          activeFestival: null,
          overlappingFestivals: [],
          isManualPreview: true,
          currentISTDate: this.getCurrentISTDate(),
          theme: null
        };
      }
      const previewFest = FESTIVALS.find(f => f.id === previewId);
      if (previewFest) {
        return {
          isSystemEnabled: true,
          isFestivalMode: true,
          activeFestival: previewFest,
          overlappingFestivals: [],
          isManualPreview: true,
          currentISTDate: this.getCurrentISTDate(),
          theme: previewFest.theme
        };
      }
    }

    // 2. Automatic live IST date detection with priority resolution
    const currentISTDate = this.getCurrentISTDate();
    const activeFestivals = this.getActiveFestivalsByDate(currentISTDate);

    if (activeFestivals.length > 0) {
      const topFestival = activeFestivals[0];
      return {
        isSystemEnabled: true,
        isFestivalMode: true,
        activeFestival: topFestival,
        overlappingFestivals: activeFestivals.slice(1),
        isManualPreview: false,
        currentISTDate,
        theme: topFestival.theme
      };
    }

    // 3. Normal Mode
    return {
      isSystemEnabled: true,
      isFestivalMode: false,
      activeFestival: null,
      overlappingFestivals: [],
      isManualPreview: false,
      currentISTDate,
      theme: null
    };
  },

  /**
   * Get all supported festivals for UI dropdown/picker
   */
  getAllFestivals() {
    return FESTIVALS;
  }
};
