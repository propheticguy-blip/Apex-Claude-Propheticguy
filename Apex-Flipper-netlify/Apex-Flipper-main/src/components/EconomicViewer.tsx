import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { EconomicIndicator, ThemeMode } from '../types/stock';
import {
  BASELINE_ECONOMIC_INDICATORS,
  ECONOMIC_CATEGORIES,
  ECONOMIC_REGIONS,
  fetchLiveEconomicData,
} from '../data/economicData';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Layers,
  Globe2,
  Search,
  Clock,
  Info,
  Sliders,
  CheckCircle2,
  Flame,
  X,
  ExternalLink,
  Volume2,
  VolumeX,
  Mic,
  Square,
  Sparkles,
  ShieldAlert,
  Gauge,
  Calendar,
  LineChart,
  Coins,
  Building2,
} from 'lucide-react';
import { kokoroVoice, KOKORO_VOICES } from '../utils/kokoroVoice';

interface EconomicViewerProps {
  themeMode: ThemeMode;
  onClose: () => void;
  isFullscreen?: boolean;
}

// Region flag and badge helper
const REGION_FLAGS: Record<string, string> = {
  ALL: '🌐',
  'United States': '🇺🇸',
  'Global / World': '🌐',
  Eurozone: '🇪🇺',
  Japan: '🇯🇵',
  China: '🇨🇳',
  'United Kingdom': '🇬🇧',
  Canada: '🇨🇦',
  India: '🇮🇳',
  Australia: '🇦🇺',
  Switzerland: '🇨🇭',
  'South Korea': '🇰🇷',
  Taiwan: '🇹🇼',
  Singapore: '🇸🇬',
  'Latin America': '🌎',
  'Middle East & GCC': '🇸🇦',
  'Other Economies': '🏛️',
};

export const EconomicViewer: React.FC<EconomicViewerProps> = ({
  themeMode,
  onClose,
  isFullscreen = false,
}) => {
  const [indicators, setIndicators] = useState<EconomicIndicator[]>(BASELINE_ECONOMIC_INDICATORS);
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Auto-flipper state
  const [isFlipperPlaying, setIsFlipperPlaying] = useState<boolean>(false);
  const [flipperSeconds, setFlipperSeconds] = useState<number>(6);

  // Kokoro AI Voice Narration state
  const [voiceState, setVoiceState] = useState(kokoroVoice.state);
  const [autoReadOnFlip, setAutoReadOnFlip] = useState<boolean>(false);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'transmission' | 'profile'>('transmission');

  // Subscribe to Kokoro Voice state changes
  useEffect(() => {
    const unsubscribe = kokoroVoice.subscribe(setVoiceState);
    return () => {
      unsubscribe();
      kokoroVoice.stop();
    };
  }, []);

  // Auto-update (data polling) state
  const [autoUpdateInterval, setAutoUpdateInterval] = useState<number>(15); // in seconds, 0 = off
  const [secondsUntilUpdate, setSecondsUntilUpdate] = useState<number>(15);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<number>(Date.now());
  const [secondsSinceRefresh, setSecondsSinceRefresh] = useState<number>(0);
  const [justUpdatedFlash, setJustUpdatedFlash] = useState<boolean>(false);

  // Load live economic data from server
  const refreshData = useCallback(async (manual = false) => {
    setIsRefreshing(true);
    try {
      const { indicators: freshData } = await fetchLiveEconomicData();
      if (freshData && freshData.length > 0) {
        setIndicators(freshData);
      }
      setLastRefreshedAt(Date.now());
      setSecondsSinceRefresh(0);
      setJustUpdatedFlash(true);
      setTimeout(() => setJustUpdatedFlash(false), 1200);
    } catch {
      // Quiet fallback if polling interval encounters a transient network pause
    } finally {
      setIsRefreshing(false);
      if (autoUpdateInterval > 0) {
        setSecondsUntilUpdate(autoUpdateInterval);
      }
    }
  }, [autoUpdateInterval]);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Live Auto-Update Interval & Countdown Timer
  useEffect(() => {
    if (autoUpdateInterval <= 0) return;

    const intervalTimer = setInterval(() => {
      setSecondsUntilUpdate((prev) => {
        if (prev <= 1) {
          refreshData();
          return autoUpdateInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalTimer);
  }, [autoUpdateInterval, refreshData]);

  // Tick elapsed seconds since last successful refresh
  useEffect(() => {
    const elapsedTimer = setInterval(() => {
      setSecondsSinceRefresh(Math.floor((Date.now() - lastRefreshedAt) / 1000));
    }, 1000);
    return () => clearInterval(elapsedTimer);
  }, [lastRefreshedAt]);

  // Filter indicators by Region, Category, and Search Query
  const filteredIndicators = useMemo(() => {
    return indicators.filter((ind) => {
      // Region filter
      if (selectedRegion !== 'ALL') {
        if (selectedRegion === 'Latin America') {
          if (ind.region !== 'Latin America' && ind.countryCode !== 'BR' && ind.countryCode !== 'MX') {
            return false;
          }
        } else if (selectedRegion === 'Eurozone') {
          if (ind.region !== 'Eurozone' && ind.countryCode !== 'EU' && ind.countryCode !== 'DE' && ind.countryCode !== 'FR' && ind.countryCode !== 'IT' && ind.countryCode !== 'ES') {
            return false;
          }
        } else if (selectedRegion === 'Middle East & GCC') {
          if (ind.region !== 'Middle East & GCC' && ind.countryCode !== 'SA' && ind.countryCode !== 'AE') {
            return false;
          }
        } else if (ind.region !== selectedRegion) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'ALL' && ind.category !== selectedCategory) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = ind.name.toLowerCase().includes(q);
        const matchShort = ind.shortName.toLowerCase().includes(q);
        const matchDesc = ind.description.toLowerCase().includes(q);
        const matchRegion = (ind.region || '').toLowerCase().includes(q);
        const matchSymbol = (ind.liveSymbol || '').toLowerCase().includes(q);
        const matchSource = ind.source.toLowerCase().includes(q);
        if (!matchName && !matchShort && !matchDesc && !matchRegion && !matchSymbol && !matchSource) {
          return false;
        }
      }

      return true;
    });
  }, [indicators, selectedRegion, selectedCategory, searchQuery]);

  // Clamp index if filtered list changes
  useEffect(() => {
    if (currentIndex >= filteredIndicators.length) {
      setCurrentIndex(0);
    }
  }, [filteredIndicators.length, currentIndex]);

  const currentIndicator =
    filteredIndicators[currentIndex] || filteredIndicators[0] || BASELINE_ECONOMIC_INDICATORS[0];

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredIndicators.length - 1));
  }, [filteredIndicators.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < filteredIndicators.length - 1 ? prev + 1 : 0));
  }, [filteredIndicators.length]);

  // Voice control handlers
  const handleToggleVoice = useCallback(() => {
    if (voiceState.isSpeaking) {
      if (voiceState.isPaused) {
        kokoroVoice.resume();
      } else {
        kokoroVoice.pause();
      }
    } else if (currentIndicator) {
      kokoroVoice.speakIndicator(currentIndicator);
    }
  }, [voiceState.isSpeaking, voiceState.isPaused, currentIndicator]);

  const handleStopVoice = useCallback(() => {
    kokoroVoice.stop();
  }, []);

  const handleSpeakDeepAnalysis = useCallback(() => {
    if (!currentIndicator) return;
    let text = `${currentIndicator.name} Deep Macro Analysis. `;
    if (currentIndicator.indicatorType) {
      text += `Classified as a ${currentIndicator.indicatorType} macroeconomic indicator with ${currentIndicator.marketSensitivity || 'High'} market sensitivity. `;
    }
    if (currentIndicator.keyThresholds) {
      text += `Key decision benchmark: ${currentIndicator.keyThresholds} `;
    }
    if (currentIndicator.assetClassImpact) {
      if (currentIndicator.assetClassImpact.equities) {
        text += `Impact on Equities: ${currentIndicator.assetClassImpact.equities} `;
      }
      if (currentIndicator.assetClassImpact.bonds) {
        text += `Impact on Bonds and Yields: ${currentIndicator.assetClassImpact.bonds} `;
      }
      if (currentIndicator.assetClassImpact.currencies) {
        text += `Impact on Currencies: ${currentIndicator.assetClassImpact.currencies} `;
      }
      if (currentIndicator.assetClassImpact.commodities) {
        text += `Impact on Commodities: ${currentIndicator.assetClassImpact.commodities} `;
      }
    }
    if (currentIndicator.historicalExtreme) {
      text += `Historical extreme: ${currentIndicator.historicalExtreme} `;
    }
    kokoroVoice.speak(text, `${currentIndicator.shortName} Deep Analysis`);
  }, [currentIndicator]);

  // Auto-read on indicator change if autoReadOnFlip is enabled
  useEffect(() => {
    if (autoReadOnFlip && currentIndicator) {
      kokoroVoice.speakIndicator(currentIndicator);
    }
  }, [currentIndex, autoReadOnFlip, currentIndicator]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsFlipperPlaying((prev) => !prev);
      } else if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        handleToggleVoice();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        refreshData(true);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        kokoroVoice.stop();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, refreshData, onClose, handleToggleVoice]);

  // Auto-flipper timer
  useEffect(() => {
    if (!isFlipperPlaying) return;
    const interval = setInterval(() => {
      handleNext();
    }, flipperSeconds * 1000);
    return () => clearInterval(interval);
  }, [isFlipperPlaying, flipperSeconds, handleNext]);

  // SVG Sparkline calculation
  const sparklineSvg = useMemo(() => {
    const data = currentIndicator.sparklineData;
    if (!data || data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 360;
    const height = 76;
    const padding = 12;

    const points = data
      .map((val, idx) => {
        const x = padding + (idx / (data.length - 1)) * (width - 2 * padding);
        const y = height - padding - ((val - min) / range) * (height - 2 * padding);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    const isUp = data[data.length - 1] >= data[0];
    const strokeColor = isUp ? '#10b981' : '#f59e0b';
    const fillColor = isUp ? 'rgba(16, 185, 129, 0.16)' : 'rgba(245, 158, 11, 0.16)';

    // Build area path
    const firstX = padding;
    const lastX = width - padding;
    const bottomY = height;
    const areaPath = `M ${firstX},${bottomY} L ${points} L ${lastX},${bottomY} Z`;

    const lastVal = data[data.length - 1];
    const lastY = height - padding - ((lastVal - min) / range) * (height - 2 * padding);

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#sparkGradient)" />
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {/* Min and Max dotted reference lines */}
        <line
          x1={padding}
          y1={padding}
          x2={width - padding}
          y2={padding}
          stroke="rgba(255,255,255,0.1)"
          strokeDasharray="2,2"
        />
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="rgba(255,255,255,0.1)"
          strokeDasharray="2,2"
        />
        {/* Latest point circle */}
        <circle
          cx={lastX}
          cy={lastY}
          r="4.5"
          fill={strokeColor}
          stroke="#ffffff"
          strokeWidth="1.8"
        />
      </svg>
    );
  }, [currentIndicator.sparklineData]);

  const getThemeBg = () => {
    if (themeMode === 'bedtime-amber') return 'bg-[#120d07] text-amber-100 border-amber-900/40';
    if (themeMode === 'bedtime-oled') return 'bg-black text-white border-neutral-900';
    return 'bg-slate-950 text-slate-100 border-slate-800';
  };

  const getCardBg = () => {
    if (themeMode === 'bedtime-amber') return 'bg-[#1c150c]/95 border-amber-800/40 text-amber-100';
    if (themeMode === 'bedtime-oled') return 'bg-neutral-950 border-neutral-800 text-white';
    return 'bg-slate-900/95 border-slate-800 text-slate-100';
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col backdrop-blur-md overflow-hidden ${getThemeBg()}`}>
      {/* Top Header Bar */}
      <header className="px-5 py-3 border-b flex items-center justify-between gap-4 shrink-0 select-none bg-black/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-500 text-white shadow-lg">
            <Landmark className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                Global & Macroeconomic Indicators
              </h1>
              {/* Pulsing Live Beacon */}
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Feeds Active</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Flip through {indicators.length} comprehensive metrics across US, World & international economies with live automated updates
            </p>
          </div>
        </div>

        {/* Live Auto-Update Controls & Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Auto-Update Polling Interval Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 text-[11px]">Auto-Update:</span>
            <select
              value={autoUpdateInterval}
              onChange={(e) => {
                const val = Number(e.target.value);
                setAutoUpdateInterval(val);
                setSecondsUntilUpdate(val);
              }}
              className="bg-transparent text-emerald-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value={10} className="bg-slate-900 text-white">10s</option>
              <option value={15} className="bg-slate-900 text-white">15s</option>
              <option value={30} className="bg-slate-900 text-white">30s</option>
              <option value={60} className="bg-slate-900 text-white">60s</option>
              <option value={0} className="bg-slate-900 text-white">Off</option>
            </select>

            {autoUpdateInterval > 0 && (
              <span className="text-[10px] font-mono text-slate-400 ml-1">
                ({secondsUntilUpdate}s)
              </span>
            )}
          </div>

          {/* Manual Refresh Button with Flash Indicator */}
          <button
            onClick={() => refreshData(true)}
            disabled={isRefreshing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              justUpdatedFlash
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md scale-105'
                : themeMode === 'bedtime-amber'
                ? 'bg-amber-900/30 text-amber-200 border-amber-700/50 hover:bg-amber-800/40'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
            title="Force refresh live quotes and indicators now (R)"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isRefreshing ? 'animate-spin text-emerald-400' : 'text-slate-300'
              }`}
            />
            <span>
              {isRefreshing
                ? 'Refreshing...'
                : justUpdatedFlash
                ? 'Updated!'
                : secondsSinceRefresh <= 2
                ? 'Just now'
                : `${secondsSinceRefresh}s ago`}
            </span>
          </button>

          {/* Close Modal */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Return to Stock Flipper (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Region & Country Filter Tabs */}
      <div className="px-5 py-2 border-b flex items-center gap-1.5 overflow-x-auto select-none scrollbar-none text-xs bg-black/20">
        <span className="text-slate-400 font-semibold mr-1 text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Globe2 className="w-3.5 h-3.5 text-blue-400" />
          Region / Country:
        </span>
        {ECONOMIC_REGIONS.map((region) => {
          const flag = REGION_FLAGS[region] || '🌐';
          const count =
            region === 'ALL'
              ? indicators.length
              : region === 'Latin America'
              ? indicators.filter((i) => i.region === 'Latin America' || i.countryCode === 'BR' || i.countryCode === 'MX').length
              : region === 'Eurozone'
              ? indicators.filter((i) => i.region === 'Eurozone' || i.countryCode === 'EU' || i.countryCode === 'DE' || i.countryCode === 'FR' || i.countryCode === 'IT' || i.countryCode === 'ES').length
              : region === 'Middle East & GCC'
              ? indicators.filter((i) => i.region === 'Middle East & GCC' || i.countryCode === 'SA' || i.countryCode === 'AE').length
              : indicators.filter((i) => i.region === region).length;

          const isSelected = selectedRegion === region;
          return (
            <button
              key={region}
              onClick={() => {
                setSelectedRegion(region);
                setCurrentIndex(0);
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                  : themeMode === 'bedtime-amber'
                  ? 'bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 border border-amber-800/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              <span>{flag}</span>
              <span>{region}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-white/10 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Filter Pills & Search Input Row */}
      <div className="px-5 py-2 border-b flex items-center justify-between gap-3 overflow-x-auto select-none scrollbar-none text-xs">
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto scrollbar-none">
          <span className="text-slate-400 font-semibold mr-1 text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Category:
          </span>
          {ECONOMIC_CATEGORIES.map((cat) => {
            const count =
              cat === 'ALL'
                ? filteredIndicators.length
                : indicators.filter((i) => i.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentIndex(0);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : themeMode === 'bedtime-amber'
                    ? 'bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 border border-amber-800/30'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 border border-slate-700/50'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Search Input */}
        <div className="relative shrink-0 ml-auto flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentIndex(0);
            }}
            placeholder="Search indicator, ticker, country..."
            className="pl-8 pr-7 py-1 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-56 sm:w-64"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Kokoro AI Voice Narration Control Bar */}
      <div className="px-5 py-2.5 border-b flex items-center justify-between gap-3 bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-slate-950/50 border-white/10 shrink-0 text-xs flex-wrap backdrop-blur-sm">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Main Kokoro Play / Pause Button */}
          <button
            onClick={handleToggleVoice}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-md transition-all ${
              voiceState.isSpeaking && !voiceState.isPaused
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-900/40 ring-2 ring-rose-400/50'
                : voiceState.isPaused
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-indigo-900/40 ring-1 ring-violet-400/40'
            }`}
            title="Read current indicator out loud with Kokoro AI Voice (Shortcut: V)"
          >
            {voiceState.isSpeaking && !voiceState.isPaused ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Voice</span>
              </>
            ) : voiceState.isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Voice</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>Read Out Loud (Kokoro AI)</span>
              </>
            )}
          </button>

          {/* Stop Narration Button */}
          {voiceState.isSpeaking && (
            <button
              onClick={handleStopVoice}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 font-semibold transition-colors"
              title="Stop Narration"
            >
              <Square className="w-3 h-3 fill-current text-rose-400" />
              <span>Stop</span>
            </button>
          )}

          {/* Kokoro Voice Model Selector */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1">
            <span className="text-[11px] text-slate-400 font-medium">Voice:</span>
            <select
              value={voiceState.activeVoiceId}
              onChange={(e) => kokoroVoice.setVoice(e.target.value)}
              className="bg-transparent text-violet-300 font-semibold text-xs focus:outline-none cursor-pointer"
            >
              {KOKORO_VOICES.map((v) => (
                <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                  {v.avatarIcon} {v.name} ({v.style})
                </option>
              ))}
            </select>
          </div>

          {/* Speed Rate Selector */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-lg px-2 py-1">
            <span className="text-[11px] text-slate-400 font-medium">Speed:</span>
            <select
              value={voiceState.playbackRate}
              onChange={(e) => kokoroVoice.setRate(Number(e.target.value))}
              className="bg-transparent text-emerald-300 font-semibold text-xs focus:outline-none cursor-pointer"
            >
              <option value={0.8} className="bg-slate-900 text-white">0.8x</option>
              <option value={1.0} className="bg-slate-900 text-white">1.0x (Normal)</option>
              <option value={1.2} className="bg-slate-900 text-white">1.2x</option>
              <option value={1.5} className="bg-slate-900 text-white">1.5x (Fast)</option>
            </select>
          </div>

          {/* Auto-Read on Flip Toggle */}
          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none bg-black/30 px-2.5 py-1 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
            <input
              type="checkbox"
              checked={autoReadOnFlip}
              onChange={(e) => setAutoReadOnFlip(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-[11px]">Auto-narrate on flip</span>
          </label>
        </div>

        {/* Live Animated Equalizer Waveform & Status */}
        <div className="flex items-center gap-3 ml-auto">
          {voiceState.isSpeaking && (
            <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
              <span className="text-[10px] font-mono text-indigo-300 truncate max-w-[150px] sm:max-w-[200px]">
                {voiceState.isPaused ? 'Paused' : `Narrating: ${voiceState.currentTitle || 'Indicator'}`}
              </span>
              {/* Dynamic 5-bar Waveform */}
              <div className="flex items-end gap-0.5 h-4 w-9">
                {voiceState.waveformLevels.map((lvl, idx) => (
                  <span
                    key={idx}
                    style={{ height: `${Math.max(15, Math.min(100, lvl))}%` }}
                    className={`w-1 rounded-t transition-all duration-100 ${
                      voiceState.isPaused ? 'bg-slate-500' : 'bg-gradient-to-t from-violet-500 via-indigo-400 to-emerald-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
          <span className="text-[10px] text-slate-400 hidden xl:inline">
            Kokoro AI Voice • Press <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-300 border border-slate-700">V</kbd> to play/pause
          </span>
        </div>
      </div>

      {/* Main Economic Flipper Showcase View */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col items-center justify-center">
        {filteredIndicators.length === 0 ? (
          <div className="text-center py-16">
            <Globe2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No indicators match current filters</h3>
            <p className="text-xs text-slate-400 mb-4">
              Try resetting the region, category or search query to see all available economic metrics.
            </p>
            <button
              onClick={() => {
                setSelectedRegion('ALL');
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            className={`w-full max-w-4xl rounded-2xl border p-6 shadow-2xl relative transition-all ${getCardBg()}`}
          >
            {/* Top Card Meta Row */}
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 mb-5 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Country Flag & Region */}
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                  <span>{REGION_FLAGS[currentIndicator.region || ''] || '🌐'}</span>
                  <span>{currentIndicator.region || 'Global'}</span>
                </span>

                {/* Category Pill */}
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25">
                  {currentIndicator.category}
                </span>

                {/* Frequency */}
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {currentIndicator.frequency}
                </span>

                {/* Source */}
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-slate-400">
                  Source: {currentIndicator.source}
                </span>

                {/* Live Real-Time Feed Badge */}
                {currentIndicator.liveSymbol ? (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-sm">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    LIVE: {currentIndicator.liveSymbol}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                    Official Release
                  </span>
                )}
              </div>

              {/* Position indicator */}
              <div className="text-xs font-mono text-slate-400">
                <span className="text-white font-bold">{currentIndex + 1}</span> of{' '}
                <span>{filteredIndicators.length}</span>
              </div>
            </div>

            {/* Indicator Title & Primary Headline Figure */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-6">
              <div className="md:col-span-7">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                  {currentIndicator.shortName}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                  {currentIndicator.name}
                </h2>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {currentIndicator.description}
                </p>
              </div>

              {/* Big Headline Figure Box */}
              <div className="md:col-span-5 flex flex-col items-start md:items-end justify-center bg-black/40 p-5 rounded-xl border border-white/10 shadow-inner">
                <span className="text-xs text-slate-400 mb-1">
                  Latest Reading ({currentIndicator.latestPeriod})
                </span>
                <div className="text-4xl md:text-5xl font-black tracking-tight text-white flex items-baseline gap-2">
                  <span
                    className={
                      currentIndicator.trend === 'up'
                        ? 'text-emerald-400'
                        : currentIndicator.trend === 'down'
                        ? 'text-amber-400'
                        : 'text-blue-300'
                    }
                  >
                    {currentIndicator.currentValue}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-400 mt-1">
                  Unit: {currentIndicator.unit}
                </span>

                {/* Trend & Macro Impact Indicators */}
                <div className="flex items-center gap-2 mt-3 text-xs flex-wrap">
                  {currentIndicator.trend === 'up' ? (
                    <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <TrendingUp className="w-3.5 h-3.5" /> Trend: Upward
                    </span>
                  ) : currentIndicator.trend === 'down' ? (
                    <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <TrendingDown className="w-3.5 h-3.5" /> Trend: Downward
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      <Minus className="w-3.5 h-3.5" /> Trend: Stable
                    </span>
                  )}

                  <span
                    className={`px-2 py-0.5 rounded ${
                      currentIndicator.impact === 'positive'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : currentIndicator.impact === 'negative'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    Impact: {currentIndicator.impact.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Comparative Metrics & Multi-Period Sparkline Chart */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-black/25 p-4 rounded-xl border border-white/5 mb-6">
              <div className="md:col-span-5 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-400 block text-[11px]">Prior Reading</span>
                  <span className="font-semibold text-sm text-slate-200">
                    {currentIndicator.priorValue}
                  </span>
                </div>
                {currentIndicator.consensusEstimate && (
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                    <span className="text-slate-400 block text-[11px]">Consensus / Target</span>
                    <span className="font-semibold text-sm text-slate-200">
                      {currentIndicator.consensusEstimate}
                    </span>
                  </div>
                )}
                {currentIndicator.historicalRange && (
                  <div className="col-span-2 bg-white/5 p-2.5 rounded-lg border border-white/5">
                    <span className="text-slate-400 block text-[11px]">5-Year Historical Range</span>
                    <span className="font-semibold text-sm text-slate-200">
                      {currentIndicator.historicalRange}
                    </span>
                  </div>
                )}
              </div>

              {/* Sparkline Visualization */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Sliders className="w-3 h-3 text-blue-400" /> Multi-Period Trajectory
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    Current: {currentIndicator.currentValue}
                  </span>
                </div>
                <div className="h-20 w-full bg-black/50 rounded-lg p-2.5 border border-white/10 flex items-center justify-center">
                  {sparklineSvg || (
                    <span className="text-xs text-slate-500">Sparkline historical points updating...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Market Significance & Why It Matters Box */}
            <div className="p-4 rounded-xl bg-blue-950/25 border border-blue-500/25 text-xs">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-blue-300 block mb-0.5">Why It Matters for Markets</span>
                  <p className="text-slate-300 leading-relaxed">{currentIndicator.significance}</p>
                </div>
              </div>
            </div>

            {/* Deep Macro Transmission & Multi-Asset Analysis Section */}
            <div className="mt-4 rounded-xl border border-white/10 bg-black/40 overflow-hidden shadow-lg">
              {/* Header with Title, Badges, and Kokoro Listen Button */}
              <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                      Deep Macro Transmission & Multi-Asset Analysis
                    </h3>
                  </div>

                  {/* Indicator Classification Badge */}
                  {currentIndicator.indicatorType && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 ${
                        currentIndicator.indicatorType === 'Leading'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : currentIndicator.indicatorType === 'Coincident'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      }`}
                    >
                      <Gauge className="w-3 h-3" />
                      {currentIndicator.indicatorType} Indicator
                    </span>
                  )}

                  {/* Market Sensitivity Badge */}
                  {currentIndicator.marketSensitivity && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 ${
                        currentIndicator.marketSensitivity === 'High'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : currentIndicator.marketSensitivity === 'Medium'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-700/50 text-slate-300 border border-slate-600'
                      }`}
                    >
                      <ShieldAlert className="w-3 h-3" />
                      {currentIndicator.marketSensitivity} Sensitivity
                    </span>
                  )}
                </div>

                {/* Direct Listen Button */}
                <button
                  onClick={handleSpeakDeepAnalysis}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-[11px] font-semibold transition-all hover:scale-105 shadow-sm"
                  title="Listen to this deep macro analysis read out loud with Kokoro AI Voice"
                >
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Read Deep Analysis</span>
                </button>
              </div>

              {/* Sub-tabs: Multi-Asset Transmission vs Indicator DNA & Thresholds */}
              <div className="px-4 pt-2.5 border-b border-white/5 flex items-center gap-2">
                <button
                  onClick={() => setActiveAnalysisTab('transmission')}
                  className={`pb-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeAnalysisTab === 'transmission'
                      ? 'border-indigo-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LineChart className="w-3.5 h-3.5" />
                  <span>Multi-Asset Transmission (Equities, Bonds, FX)</span>
                </button>
                <button
                  onClick={() => setActiveAnalysisTab('profile')}
                  className={`pb-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeAnalysisTab === 'profile'
                      ? 'border-indigo-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Gauge className="w-3.5 h-3.5" />
                  <span>Macro DNA, Thresholds & Next Release</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-4">
                {activeAnalysisTab === 'transmission' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Equities Impact */}
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Equities & Valuation Multiples</span>
                      </div>
                      <p className="text-slate-300 text-[11.5px] leading-relaxed">
                        {currentIndicator.assetClassImpact?.equities ||
                          'Influences equity risk premium, corporate margin forecasts, and sector rotation between cyclicals and defensive dividend payers.'}
                      </p>
                    </div>

                    {/* Fixed Income & Yield Curve */}
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="flex items-center gap-1.5 font-bold text-blue-400 mb-1">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Fixed Income & Yield Curve (Duration)</span>
                      </div>
                      <p className="text-slate-300 text-[11.5px] leading-relaxed">
                        {currentIndicator.assetClassImpact?.bonds ||
                          'Transmits directly into sovereign Treasury curve steepening/flattening and corporate credit risk spreads.'}
                      </p>
                    </div>

                    {/* Currencies & FX */}
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
                        <Coins className="w-3.5 h-3.5" />
                        <span>Currencies & US Dollar (DXY)</span>
                      </div>
                      <p className="text-slate-300 text-[11.5px] leading-relaxed">
                        {currentIndicator.assetClassImpact?.currencies ||
                          'Drives global interest rate differentials, sovereign carry trade unwinds, and bilateral exchange rate trajectories.'}
                      </p>
                    </div>

                    {/* Commodities or Real Economy */}
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="flex items-center gap-1.5 font-bold text-orange-400 mb-1">
                        <Flame className="w-3.5 h-3.5" />
                        <span>Commodities & Real-Economy Inputs</span>
                      </div>
                      <p className="text-slate-300 text-[11.5px] leading-relaxed">
                        {currentIndicator.assetClassImpact?.commodities ||
                          'Impacts industrial commodity consumption, transportation fuel demand, and physical supply chain tightness.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    {/* Cycle Position & Lead Time */}
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                        Cycle Role
                      </span>
                      <span className="font-bold text-indigo-300 block mb-0.5">
                        {currentIndicator.indicatorType || 'Leading'} Indicator
                      </span>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {currentIndicator.indicatorType === 'Leading'
                          ? 'Shifts 6 to 9 months ahead of broad economic turning points.'
                          : currentIndicator.indicatorType === 'Coincident'
                          ? 'Reflects real-time state of the macro economy concurrently.'
                          : 'Confirms structural shifts after trends have firmly established.'}
                      </p>
                    </div>

                    {/* Key Inflection Thresholds */}
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                        Key Inflection Benchmark
                      </span>
                      <p className="font-semibold text-slate-200 text-[11.5px] leading-snug">
                        {currentIndicator.keyThresholds || 'Monitored against historical moving averages.'}
                      </p>
                    </div>

                    {/* Historical Extremes */}
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                        Historical Record Extreme
                      </span>
                      <p className="font-semibold text-slate-200 text-[11.5px] leading-snug">
                        {currentIndicator.historicalExtreme || currentIndicator.historicalRange || 'Multi-cycle tracking range.'}
                      </p>
                    </div>

                    {/* Next Release Date */}
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                        Release Cadence
                      </span>
                      <div className="flex items-center gap-1 text-emerald-400 font-semibold mb-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[11.5px]">{currentIndicator.frequency}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {currentIndicator.nextReleaseDate || 'Scheduled official release'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation & Auto-Timer Controls Bar */}
      <footer className="px-5 py-3 border-t flex items-center justify-between gap-4 shrink-0 select-none bg-black/50">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
            title="Previous Indicator (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-xs font-bold transition-colors shadow-md"
            title="Next Indicator (Right Arrow)"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-xs text-slate-400 ml-2 hidden sm:inline">
            Use <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 border border-slate-700">←</kbd>{' '}
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 border border-slate-700">→</kbd> or{' '}
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 border border-slate-700">Space</kbd> to flip •{' '}
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 border border-slate-700">R</kbd> to refresh
          </span>
        </div>

        {/* Auto Flipper Timer Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 text-[11px]">Flip Timer:</span>
            <select
              value={flipperSeconds}
              onChange={(e) => setFlipperSeconds(Number(e.target.value))}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value={3} className="bg-slate-900 text-white">3s</option>
              <option value={6} className="bg-slate-900 text-white">6s</option>
              <option value={10} className="bg-slate-900 text-white">10s</option>
              <option value={15} className="bg-slate-900 text-white">15s</option>
              <option value={20} className="bg-slate-900 text-white">20s</option>
            </select>
          </div>

          <button
            onClick={() => setIsFlipperPlaying(!isFlipperPlaying)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
              isFlipperPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-300/40'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isFlipperPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Auto-Flip</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Auto-Flip</span>
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};
