/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  STOCKS_DATA,
  STOCK_SECTORS,
  ETF_SECTOR,
  CRYPTO_SECTOR,
  AssetCategory,
} from './data/stocksData';
import {
  Stock,
  HudSettings,
  TimerSettings,
  NightModeSettings,
  ThemeMode,
  LiveQuote,
  CorporateEvents,
} from './types/stock';
import { HeaderBar } from './components/HeaderBar';
import { FilterBar } from './components/FilterBar';
import { ChartViewer } from './components/ChartViewer';
import { TimerControls } from './components/TimerControls';
import { FullscreenRemote } from './components/FullscreenRemote';
import { NightModeModal } from './components/NightModeModal';
import { WatchlistModal } from './components/WatchlistModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { InstallModal } from './components/InstallModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { EconomicViewer } from './components/EconomicViewer';
import { NewsOverlay } from './components/NewsOverlay';
import { TabletThumbRemote } from './components/TabletThumbRemote';
import { VoiceModal } from './components/VoiceModal';
import { kokoroVoice } from './utils/kokoroVoice';

const HUD_SETTINGS_KEY = 'apexflipper_hud_settings';
const NIGHT_SETTINGS_KEY = 'apexflipper_night_settings';
const BOOKMARKS_KEY = 'apexflipper_bookmarks';
const TIMER_KEY = 'apexflipper_timer_duration';
const TABLET_MODE_KEY = 'apexflipper_tablet_mode';
const ASSET_CAT_KEY = 'apexflipper_asset_category';

export default function App() {
  // 1. Asset Category & Filter States (User request: separate cryptocurrency and ETFs from stock sectors)
  const [assetCategory, setAssetCategory] = useState<AssetCategory>(() => {
    try {
      const saved = localStorage.getItem(ASSET_CAT_KEY) as AssetCategory;
      if (saved === 'stocks' || saved === 'etfs' || saved === 'crypto') return saved;
    } catch {}
    return 'stocks'; // default to corporate stocks
  });

  const [selectedSector, setSelectedSector] = useState<string>('Information Technology');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ALL');
  const [optionsOnly, setOptionsOnly] = useState<boolean>(false);
  const [bookmarksOnly, setBookmarksOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSelectAssetCategory = (cat: AssetCategory) => {
    setAssetCategory(cat);
    try {
      localStorage.setItem(ASSET_CAT_KEY, cat);
    } catch {}
  };

  // 1b. Android Tablet Right-Thumb Manual Mode (User request: easy to use manual mode for holding tablet with right thumb navigation)
  const [isTabletMode, setIsTabletMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(TABLET_MODE_KEY);
      if (saved !== null) return JSON.parse(saved);
      // Auto-detect tablet / touch device with wide screen
      if (
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(pointer: coarse)').matches &&
        window.innerWidth >= 600
      ) {
        return true;
      }
    } catch {}
    return false;
  });

  // 2. Watchlist / Bookmarks
  const [bookmarkedSymbols, setBookmarkedSymbols] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save bookmarks
  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarkedSymbols));
    } catch {
      // LocalStorage quota or access exception
    }
  }, [bookmarkedSymbols]);

  // 3. Filtered Stocks strictly sorted by Market Cap descending with clean asset separation
  const filteredStocks = useMemo(() => {
    return STOCKS_DATA.filter((stock) => {
      // Asset Category separation:
      // When looking through "stocks" (including "All Sectors"), Cryptocurrencies and ETFs are 100% EXCLUDED!
      if (assetCategory === 'stocks') {
        if (stock.sector === CRYPTO_SECTOR || stock.sector === ETF_SECTOR) {
          return false;
        }
        if (selectedSector !== 'ALL' && stock.sector !== selectedSector) {
          return false;
        }
      } else if (assetCategory === 'etfs') {
        if (stock.sector !== ETF_SECTOR) {
          return false;
        }
      } else if (assetCategory === 'crypto') {
        if (stock.sector !== CRYPTO_SECTOR) {
          return false;
        }
      }

      // Industry filter
      if (selectedIndustry !== 'ALL' && stock.industry !== selectedIndustry) {
        return false;
      }
      // Options-only filter (requested feature)
      if (optionsOnly && !stock.hasOptions) {
        return false;
      }
      // Bookmarks-only filter
      if (bookmarksOnly && !bookmarkedSymbols.includes(stock.symbol)) {
        return false;
      }
      // Search query (Supports symbol, name, sector, industry, and SpaceX)
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.trim().toLowerCase().replace(/[\s-_.]/g, '');
        const normSymbol = stock.symbol.toLowerCase().replace(/[\s-_.]/g, '');
        const normName = stock.name.toLowerCase().replace(/[\s-_.]/g, '');
        const matchSymbol = normSymbol.includes(query);
        const matchName = normName.includes(query);
        const rawQuery = searchQuery.trim().toLowerCase();
        const matchSector = stock.sector.toLowerCase().includes(rawQuery);
        const matchIndustry = stock.industry.toLowerCase().includes(rawQuery);
        const matchDescription = stock.description?.toLowerCase().includes(rawQuery);
        const matchSpaceX =
          (query === 'spacex' || query === 'starlink' || query === 'elon') && stock.symbol === 'SPACE-X';
        if (!matchSymbol && !matchName && !matchSector && !matchIndustry && !matchDescription && !matchSpaceX) {
          return false;
        }
      }
      return true;
    });
  }, [
    assetCategory,
    selectedSector,
    selectedIndustry,
    optionsOnly,
    bookmarksOnly,
    searchQuery,
    bookmarkedSymbols,
  ]);

  // 4. Current Stock Index
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Clamp current index if filtered list changes
  useEffect(() => {
    if (currentIndex >= filteredStocks.length && filteredStocks.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredStocks.length, currentIndex]);

  const currentStock: Stock | undefined = filteredStocks[currentIndex] || filteredStocks[0];

  // 4b. Live/Delayed Market Quote Fetching from Yahoo Finance Backend Endpoint
  const [liveQuote, setLiveQuote] = useState<LiveQuote | null>(null);

  useEffect(() => {
    if (!currentStock) return;
    let isCancelled = false;

    // Fast-path: seed with known approximation while network loads
    setLiveQuote({
      symbol: currentStock.symbol,
      price: currentStock.approxPrice || 100,
      change: currentStock.dayChange || 0,
      changePercent: currentStock.dayChange ? Number((currentStock.dayChange * 0.8).toFixed(2)) : 0,
    });

    fetch(`/api/quote/${encodeURIComponent(currentStock.symbol)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Quote error');
        return res.json();
      })
      .then((data: LiveQuote) => {
        if (!isCancelled && data && data.price) {
          setLiveQuote(data);
        }
      })
      .catch((err) => {
        // Keep approximation on error
      });

    return () => {
      isCancelled = true;
    };
  }, [currentStock?.symbol]);

  // 4c. Dynamic Live Market Cap: Updates in real-time as live quote prices change
  const currentLiveMarketCap = useMemo(() => {
    if (!currentStock) return '';
    if (currentStock.isPrivate) return currentStock.marketCap;
    if (liveQuote?.marketCap) return liveQuote.marketCap;
    if (liveQuote?.price && currentStock.marketCapNum > 0) {
      const basePrice = currentStock.approxPrice || currentStock.priceApprox || liveQuote.price;
      if (basePrice > 0) {
        const liveCapNum = (currentStock.marketCapNum * liveQuote.price) / basePrice;
        if (liveCapNum >= 1000) {
          return `$${(liveCapNum / 1000).toFixed(2)} Trillion`;
        }
        return `$${liveCapNum.toFixed(1)} Billion`;
      }
    }
    return currentStock.marketCap;
  }, [currentStock, liveQuote?.price, liveQuote?.marketCap]);

  // 4d. Corporate Events (Earnings & Dividends) fetch for the active stock
  const [corporateEvents, setCorporateEvents] = useState<CorporateEvents | null>(null);

  useEffect(() => {
    if (!currentStock) return;
    let isCancelled = false;
    fetch(`/api/events/${encodeURIComponent(currentStock.symbol)}`)
      .then((res) => {
        if (!res.ok) throw new Error('No events');
        return res.json();
      })
      .then((data: CorporateEvents) => {
        if (!isCancelled && data) {
          setCorporateEvents(data);
        }
      })
      .catch(() => {});
    return () => {
      isCancelled = true;
    };
  }, [currentStock?.symbol]);

  // 4e. Tablet Right-Thumb Manual Mode toggle
  const handleToggleTabletMode = useCallback(() => {
    setIsTabletMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(TABLET_MODE_KEY, JSON.stringify(next));
      } catch {}
      // If activating Tablet Manual Mode, automatically pause auto-timer for full manual thumb pacing
      if (next) {
        setTimerSettings((t) => ({ ...t, isPlaying: false }));
      }
      return next;
    });
  }, []);

  // 5. In-Chart HUD Settings (Synchronous & Adjustable Transparency)
  const [hudSettings, setHudSettings] = useState<HudSettings>(() => {
    try {
      const saved = localStorage.getItem(HUD_SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.showDescription === undefined) parsed.showDescription = true;
        return parsed;
      }
    } catch {
      // fallback
    }
    return {
      opacity: 0.70, // 70% balanced default
      position: 'center',
      showDescription: true,
      showSubIndustry: true,
      showMarketCap: true,
      showOptionsBadge: true,
      blurBackground: true,
      scale: 'normal',
      fontSizeScale: 1.0,
    };
  });

  const handleUpdateHudSettings = (newSettings: Partial<HudSettings>) => {
    setHudSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(HUD_SETTINGS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 6. Night & Bedtime Settings
  const [nightSettings, setNightSettings] = useState<NightModeSettings>(() => {
    try {
      const saved = localStorage.getItem(NIGHT_SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      mode: 'midnight-dark',
      brightness: 1.0,
      warmth: 0,
      sleepTimerMinutes: null,
    };
  });

  const handleUpdateNightSettings = (newSettings: Partial<NightModeSettings>) => {
    setNightSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(NIGHT_SETTINGS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 7. Timer & Auto-Flipper Settings
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(() => {
    let savedSec = 5;
    let savedAutoRead = false;
    try {
      const s = localStorage.getItem(TIMER_KEY);
      if (s) savedSec = parseInt(s, 10) || 5;
      const ar = localStorage.getItem('apexflipper_auto_read');
      if (ar !== null) savedAutoRead = ar === 'true';
    } catch {}
    return {
      seconds: savedSec,
      isPlaying: false,
      pauseOnHover: false,
      soundEnabled: false,
      loopBackToStart: true,
      autoReadOnFlip: savedAutoRead,
      postNarrationPauseSec: 1.5,
    };
  });

  const handleUpdateTimerSettings = (newSettings: Partial<TimerSettings>) => {
    setTimerSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.seconds !== undefined) {
        try {
          localStorage.setItem(TIMER_KEY, String(newSettings.seconds));
        } catch {}
      }
      if (newSettings.autoReadOnFlip !== undefined) {
        try {
          localStorage.setItem('apexflipper_auto_read', String(newSettings.autoReadOnFlip));
        } catch {}
      }
      return updated;
    });
  };

  // Kokoro Voice State subscription
  const [voiceState, setVoiceState] = useState(kokoroVoice.state);
  useEffect(() => {
    const unsub = kokoroVoice.subscribe(setVoiceState);
    return () => unsub();
  }, []);

  // 8. Progress Bar State & Sound
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [currentStockNarrationDone, setCurrentStockNarrationDone] = useState<boolean>(false);
  const totalDurationMs = timerSettings.seconds * 1000;
  const pauseDurationMs = (timerSettings.postNarrationPauseSec ?? 2.0) * 1000;

  // Active narration phase when Auto-Read is synced with Auto-Flipper
  const narrationPhase = useMemo<'reading' | 'pausing' | 'idle'>(() => {
    if (!timerSettings.autoReadOnFlip) return 'idle';
    if (voiceState.isSpeaking || (!currentStockNarrationDone && timerSettings.isPlaying)) return 'reading';
    if (timerSettings.isPlaying && currentStockNarrationDone) return 'pausing';
    return 'idle';
  }, [timerSettings.autoReadOnFlip, timerSettings.isPlaying, voiceState.isSpeaking, currentStockNarrationDone]);

  const progressPercent = useMemo(() => {
    if (timerSettings.autoReadOnFlip && timerSettings.isPlaying) {
      if (voiceState.isSpeaking || !currentStockNarrationDone) {
        return 100; // Active speech waveform
      }
      return Math.min((elapsedMs / pauseDurationMs) * 100, 100);
    }
    return Math.min((elapsedMs / totalDurationMs) * 100, 100);
  }, [
    timerSettings.autoReadOnFlip,
    timerSettings.isPlaying,
    voiceState.isSpeaking,
    currentStockNarrationDone,
    elapsedMs,
    pauseDurationMs,
    totalDurationMs,
  ]);

  // Soft Web Audio API click chime
  const playFlipChime = useCallback(() => {
    if (!timerSettings.soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 soft tone
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch (e) {
      // Ignore web audio errors
    }
  }, [timerSettings.soundEnabled]);

  // Flip Actions
  const handleNextStock = useCallback(() => {
    if (filteredStocks.length === 0) return;
    kokoroVoice.stop();
    setCurrentStockNarrationDone(false);
    setCurrentIndex((prev) => {
      if (prev + 1 < filteredStocks.length) {
        return prev + 1;
      }
      if (timerSettings.loopBackToStart) {
        return 0;
      }
      setTimerSettings((t) => ({ ...t, isPlaying: false }));
      return prev;
    });
    setElapsedMs(0);
    playFlipChime();
  }, [filteredStocks.length, timerSettings.loopBackToStart, playFlipChime]);

  const handlePrevStock = useCallback(() => {
    if (filteredStocks.length === 0) return;
    kokoroVoice.stop();
    setCurrentStockNarrationDone(false);
    setCurrentIndex((prev) => {
      if (prev - 1 >= 0) {
        return prev - 1;
      }
      return filteredStocks.length - 1;
    });
    setElapsedMs(0);
    playFlipChime();
  }, [filteredStocks.length, playFlipChime]);

  // Jump helper for tablet +5 / -5 buttons
  const handleJumpBy = useCallback(
    (delta: number) => {
      if (filteredStocks.length === 0) return;
      kokoroVoice.stop();
      setCurrentStockNarrationDone(false);
      setCurrentIndex((prev) => {
        let next = prev + delta;
        if (next >= filteredStocks.length) next = 0;
        if (next < 0) next = filteredStocks.length - 1;
        return next;
      });
      setElapsedMs(0);
      playFlipChime();
    },
    [filteredStocks.length, playFlipChime]
  );

  // Auto-Read Trigger on Stock Change / Playback
  const currentSymbol = currentStock?.symbol;
  useEffect(() => {
    if (!currentStock) return;
    if (timerSettings.autoReadOnFlip) {
      setCurrentStockNarrationDone(false);
      setElapsedMs(0);
      let isCurrent = true;
      kokoroVoice.speakStock(currentStock, liveQuote, corporateEvents).then(() => {
        if (isCurrent) {
          setCurrentStockNarrationDone(true);
          setElapsedMs(0);
        }
      });
      return () => {
        isCurrent = false;
      };
    } else {
      setCurrentStockNarrationDone(false);
    }
  }, [currentSymbol, timerSettings.autoReadOnFlip, timerSettings.isPlaying]);

  // Stop speech if Auto-Flipper is explicitly paused by user
  const prevPlayingRef = useRef(timerSettings.isPlaying);
  useEffect(() => {
    if (prevPlayingRef.current && !timerSettings.isPlaying) {
      // User paused the auto-flipper
      kokoroVoice.stop();
      setCurrentStockNarrationDone(false);
      setElapsedMs(0);
    }
    prevPlayingRef.current = timerSettings.isPlaying;
  }, [timerSettings.isPlaying]);

  // Auto-Flipper Tick Loop (with speech-synchronized holding!)
  useEffect(() => {
    if (!timerSettings.isPlaying || filteredStocks.length <= 1) {
      setElapsedMs(0);
      return;
    }

    // MODE A: Auto Reader is synchronized with Auto-Flipper
    if (timerSettings.autoReadOnFlip) {
      // While AI voice is actively reading or preparing narration, HOLD the flipper!
      if (voiceState.isSpeaking || !currentStockNarrationDone) {
        return;
      }

      // Voice has finished narrating: run the post-narration countdown before advancing
      const tickInterval = 50;
      const timer = setInterval(() => {
        setElapsedMs((prev) => {
          const next = prev + tickInterval;
          if (next >= pauseDurationMs) {
            handleNextStock();
            return 0;
          }
          return next;
        });
      }, tickInterval);

      return () => clearInterval(timer);
    }

    // MODE B: Standard fixed-interval Auto-Flipper
    const tickInterval = 50;
    const timer = setInterval(() => {
      setElapsedMs((prev) => {
        const next = prev + tickInterval;
        if (next >= totalDurationMs) {
          handleNextStock();
          return 0;
        }
        return next;
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [
    timerSettings.isPlaying,
    timerSettings.autoReadOnFlip,
    voiceState.isSpeaking,
    currentStockNarrationDone,
    pauseDurationMs,
    totalDurationMs,
    filteredStocks.length,
    handleNextStock,
  ]);

  // 9. Sleep Timer Logic (auto-pause after bedtime timer expires)
  useEffect(() => {
    if (!nightSettings.sleepTimerMinutes || !timerSettings.isPlaying) return;

    const sleepMs = nightSettings.sleepTimerMinutes * 60 * 1000;
    const sleepTimer = setTimeout(() => {
      setTimerSettings((prev) => ({ ...prev, isPlaying: false }));
      alert(`Bedtime Sleep Timer reached (${nightSettings.sleepTimerMinutes}m). Auto-flipper paused.`);
    }, sleepMs);

    return () => clearTimeout(sleepTimer);
  }, [nightSettings.sleepTimerMinutes, timerSettings.isPlaying]);

  // 10. Fullscreen Mode
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // 11. Modal Dialog States
  const [isNightModalOpen, setIsNightModalOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isEconomicOpen, setIsEconomicOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // 11b. Touch Swipe Gesture Handling for Mobile Phones & Tablets
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    // Minimum swipe distance of 45px, mostly horizontal
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0) {
        // Swiped left -> Next stock
        handleNextStock();
      } else {
        // Swiped right -> Previous stock
        handlePrevStock();
      }
    }
  };

  // 12. Chart Configuration (Interval, Style & Pattern Mode)
  const [chartInterval, setChartInterval] = useState('3mo');
  const [chartStyle, setChartStyle] = useState<'candles' | 'line' | 'heikin'>('candles');
  const [showPatterns, setShowPatterns] = useState<boolean>(() => {
    try {
      const s = localStorage.getItem('ticker_show_patterns');
      return s !== null ? JSON.parse(s) : true;
    } catch {
      return true;
    }
  });

  const handleTogglePatterns = () => {
    setShowPatterns((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('ticker_show_patterns', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Bookmark Toggle
  const handleToggleBookmark = (symbol: string) => {
    setBookmarkedSymbols((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  // Auto-Read Toggle helper (Synchronize AI Voice with Auto-Flipper)
  const handleToggleAutoRead = useCallback(() => {
    setTimerSettings((prev) => {
      const nextVal = !prev.autoReadOnFlip;
      try {
        localStorage.setItem('apexflipper_auto_read', String(nextVal));
      } catch {}
      if (!nextVal) {
        kokoroVoice.stop();
      }
      return { ...prev, autoReadOnFlip: nextVal };
    });
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger shortcuts when typing inside form inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA'
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setTimerSettings((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNextStock();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevStock();
          break;
        case 'KeyF':
          e.preventDefault();
          handleToggleFullscreen();
          break;
        case 'KeyB':
          e.preventDefault();
          setIsNightModalOpen((prev) => !prev);
          break;
        case 'KeyT': {
          e.preventDefault();
          const presets = [1, 2, 3, 5, 8, 10, 15, 30];
          const curr = timerSettings.seconds;
          const idx = presets.indexOf(curr);
          const nextSec = idx === -1 || idx === presets.length - 1 ? presets[0] : presets[idx + 1];
          handleUpdateTimerSettings({ seconds: nextSec });
          break;
        }
        case 'KeyO':
          e.preventDefault();
          setOptionsOnly((prev) => !prev);
          break;
        case 'KeyS': {
          e.preventDefault();
          if (assetCategory === 'stocks') {
            const sectors = ['ALL', ...STOCK_SECTORS];
            const currIdx = sectors.indexOf(selectedSector);
            const nextIdx = (currIdx + 1) % sectors.length;
            setSelectedSector(sectors[nextIdx]);
            setSelectedIndustry('ALL');
          }
          break;
        }
        case 'KeyM': {
          e.preventDefault();
          handleToggleTabletMode();
          break;
        }
        case 'Equal':
        case 'NumpadAdd': {
          e.preventDefault();
          setHudSettings((prev) => ({
            ...prev,
            fontSizeScale: Math.min(2.6, Number(((prev.fontSizeScale || 1.0) + 0.15).toFixed(2))),
          }));
          break;
        }
        case 'Minus':
        case 'NumpadSubtract': {
          e.preventDefault();
          setHudSettings((prev) => ({
            ...prev,
            fontSizeScale: Math.max(0.8, Number(((prev.fontSizeScale || 1.0) - 0.15).toFixed(2))),
          }));
          break;
        }
        case 'KeyW':
          if (currentStock) {
            e.preventDefault();
            handleToggleBookmark(currentStock.symbol);
          }
          break;
        case 'KeyP':
          e.preventDefault();
          handleTogglePatterns();
          break;
        case 'KeyE':
          e.preventDefault();
          setIsEconomicOpen((prev) => !prev);
          break;
        case 'KeyN':
          e.preventDefault();
          setIsNewsOpen((prev) => !prev);
          break;
        case 'KeyR':
          e.preventDefault();
          handleToggleAutoRead();
          break;
        case 'KeyV':
          e.preventDefault();
          setIsVoiceModalOpen((prev) => !prev);
          break;
        case 'Escape':
          setIsNightModalOpen(false);
          setIsWatchlistOpen(false);
          setIsShortcutsOpen(false);
          setIsEconomicOpen(false);
          setIsNewsOpen(false);
          setIsVoiceModalOpen(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleNextStock,
    handlePrevStock,
    timerSettings.seconds,
    currentStock,
    selectedSector,
    assetCategory,
    handleToggleTabletMode,
    handleToggleAutoRead,
  ]);

  // Bookmarked Stock Objects
  const bookmarkedStocks = useMemo(() => {
    return STOCKS_DATA.filter((s) => bookmarkedSymbols.includes(s.symbol));
  }, [bookmarkedSymbols]);

  const handleResetFilters = () => {
    setAssetCategory('stocks');
    setSelectedSector('ALL');
    setSelectedIndustry('ALL');
    setOptionsOnly(false);
    setBookmarksOnly(false);
    setSearchQuery('');
  };

  return (
    <div
      className={`w-screen h-screen flex flex-col overflow-hidden font-sans select-none transition-colors duration-300 ${
        nightSettings.mode === 'bedtime-oled'
          ? 'bg-black text-neutral-100'
          : nightSettings.mode === 'bedtime-amber'
          ? 'bg-[#0f0c08] text-amber-100'
          : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Top Header - hidden in Fullscreen mode for zero browser distractions */}
      {!isFullscreen && (
        <HeaderBar
          currentStock={currentStock || STOCKS_DATA[0]}
          totalStocks={STOCKS_DATA.length}
          filteredIndex={currentIndex + 1}
          totalFiltered={filteredStocks.length}
          themeMode={nightSettings.mode}
          onOpenNightModal={() => setIsNightModalOpen(true)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          bookmarkedCount={bookmarkedSymbols.length}
          onOpenWatchlist={() => setIsWatchlistOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          currentLiveMarketCap={currentLiveMarketCap}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          onOpenEconomicSection={() => setIsEconomicOpen(true)}
          onOpenNewsOverlay={() => setIsNewsOpen(true)}
          isTabletMode={isTabletMode}
          onToggleTabletMode={handleToggleTabletMode}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        />
      )}

      {/* Filter Bar - hidden in Fullscreen mode */}
      {!isFullscreen && (
        <FilterBar
          selectedSector={selectedSector}
          onSelectSector={setSelectedSector}
          selectedIndustry={selectedIndustry}
          onSelectIndustry={setSelectedIndustry}
          optionsOnly={optionsOnly}
          onToggleOptionsOnly={() => setOptionsOnly((prev) => !prev)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          bookmarksOnly={bookmarksOnly}
          onToggleBookmarksOnly={() => setBookmarksOnly((prev) => !prev)}
          totalFiltered={filteredStocks.length}
          totalAvailable={STOCKS_DATA.length}
          onResetFilters={handleResetFilters}
          themeMode={nightSettings.mode}
          onOpenEconomicSection={() => setIsEconomicOpen(true)}
          assetCategory={assetCategory}
          onSelectAssetCategory={handleSelectAssetCategory}
          isTabletMode={isTabletMode}
          onToggleTabletMode={handleToggleTabletMode}
        />
      )}

      {/* Main Chart Viewer Viewport (Expands 100% in fullscreen with Touch Swipe for Tablets & Phones) */}
      <main
        className="relative flex-1 w-full h-full min-h-0 overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {currentStock ? (
          <ChartViewer
            stock={currentStock}
            filteredRank={currentIndex + 1}
            totalFiltered={filteredStocks.length}
            hudSettings={hudSettings}
            onUpdateHudSettings={handleUpdateHudSettings}
            isBookmarked={bookmarkedSymbols.includes(currentStock.symbol)}
            onToggleBookmark={handleToggleBookmark}
            themeMode={nightSettings.mode}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            brightness={nightSettings.brightness}
            interval={chartInterval}
            onIntervalChange={setChartInterval}
            chartStyle={chartStyle}
            onChartStyleChange={setChartStyle}
            liveQuote={liveQuote}
            showPatterns={showPatterns}
            onTogglePatterns={handleTogglePatterns}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
            <p className="text-lg font-bold text-slate-300">
              No stocks matched the selected filters
            </p>
            <p className="text-sm text-slate-500 max-w-md">
              Try selecting a different sector, clearing the search query, or toggling off the options filter.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Fullscreen Floating Remote Bar (Auto-hides on mouse rest) */}
        {isFullscreen && currentStock && (
          <FullscreenRemote
            timerSettings={timerSettings}
            onUpdateTimerSettings={handleUpdateTimerSettings}
            onNextStock={handleNextStock}
            onPrevStock={handlePrevStock}
            currentIndex={currentIndex}
            totalStocks={filteredStocks.length}
            onExitFullscreen={handleToggleFullscreen}
            onOpenNightModal={() => setIsNightModalOpen(true)}
            hudSettings={hudSettings}
            onUpdateHudSettings={handleUpdateHudSettings}
            isBookmarked={bookmarkedSymbols.includes(currentStock.symbol)}
            onToggleBookmark={() => handleToggleBookmark(currentStock.symbol)}
            progressPercent={progressPercent}
            themeMode={nightSettings.mode}
            showPatterns={showPatterns}
            onTogglePatterns={handleTogglePatterns}
            onOpenEconomicSection={() => setIsEconomicOpen(true)}
            onOpenNewsOverlay={() => setIsNewsOpen(true)}
            isTabletMode={isTabletMode}
            onToggleTabletMode={handleToggleTabletMode}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          />
        )}

        {/* Dedicated Android Tablet Right-Thumb Manual Controller */}
        <TabletThumbRemote
          currentStock={currentStock || STOCKS_DATA[0]}
          currentIndex={currentIndex}
          totalStocks={filteredStocks.length}
          onNextStock={handleNextStock}
          onPrevStock={handlePrevStock}
          onJumpBy={handleJumpBy}
          isBookmarked={bookmarkedSymbols.includes(currentStock?.symbol || '')}
          onToggleBookmark={() => currentStock && handleToggleBookmark(currentStock.symbol)}
          themeMode={nightSettings.mode}
          timerSettings={timerSettings}
          onUpdateTimerSettings={handleUpdateTimerSettings}
          isTabletMode={isTabletMode}
          onToggleTabletMode={handleToggleTabletMode}
          corporateEvents={corporateEvents}
          liveQuote={liveQuote}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        />
      </main>

      {/* Bottom Playback & Timer Controller (hidden in Fullscreen mode where floating remote is used) */}
      {!isFullscreen && (
        <TimerControls
          timerSettings={timerSettings}
          onUpdateTimerSettings={handleUpdateTimerSettings}
          onNextStock={handleNextStock}
          onPrevStock={handlePrevStock}
          currentIndex={currentIndex}
          totalStocks={filteredStocks.length}
          onJumpToIndex={(idx) => {
            setCurrentIndex(idx);
            setElapsedMs(0);
          }}
          themeMode={nightSettings.mode}
          progressPercent={progressPercent}
          isTabletMode={isTabletMode}
          onToggleTabletMode={handleToggleTabletMode}
          voiceState={voiceState}
          narrationPhase={narrationPhase}
          currentStockSymbol={currentStock?.symbol}
        />
      )}

      {/* Modals */}
      <NightModeModal
        isOpen={isNightModalOpen}
        onClose={() => setIsNightModalOpen(false)}
        nightSettings={nightSettings}
        onUpdateNightSettings={handleUpdateNightSettings}
      />

      <WatchlistModal
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        bookmarkedStocks={bookmarkedStocks}
        onRemoveBookmark={handleToggleBookmark}
        onSelectStock={(sym) => {
          const idx = filteredStocks.findIndex((s) => s.symbol === sym);
          if (idx !== -1) {
            setCurrentIndex(idx);
            setElapsedMs(0);
          } else {
            // If currently filtered out, reset filter and jump
            handleResetFilters();
            const globalIdx = STOCKS_DATA.findIndex((s) => s.symbol === sym);
            if (globalIdx !== -1) {
              setCurrentIndex(globalIdx);
              setElapsedMs(0);
            }
          }
        }}
        onClearAll={() => setBookmarkedSymbols([])}
        themeMode={nightSettings.mode}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* PWA / WebAPK / APK Installation Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        themeMode={nightSettings.mode}
      />

      {/* US Macroeconomic Indicators Flipper (Keep Up-To-Date with Live Market Feeds) */}
      {isEconomicOpen && (
        <EconomicViewer
          themeMode={nightSettings.mode}
          onClose={() => setIsEconomicOpen(false)}
          isFullscreen={isFullscreen}
        />
      )}

      {/* Stock News Intelligence Side Panel (Search-Grounded Headlines) */}
      <NewsOverlay
        isOpen={isNewsOpen}
        onClose={() => setIsNewsOpen(false)}
        stock={currentStock}
        themeMode={nightSettings.mode}
        onNextStock={handleNextStock}
        onPrevStock={handlePrevStock}
        stockPositionText={`${currentIndex + 1} of ${filteredStocks.length}`}
      />

      {/* AI Voice Persona Selection Modal */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        themeMode={nightSettings.mode}
      />

      {/* Offline connectivity indicator */}
      <OfflineIndicator />
    </div>
  );
}
