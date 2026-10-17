import React, { useState, useEffect } from 'react';
import { Stock, HudSettings, ThemeMode, LiveQuote, CorporateEvents } from '../types/stock';
import { InChartHud } from './InChartHud';
import { NativeStockChart } from './NativeStockChart';
import { InChartInfoModal } from './InChartInfoModal';
import {
  Clock,
  Maximize2,
  Minimize2,
  Eye,
  Activity,
  Layers,
  Sparkles,
  Mic,
  Volume2,
  Calendar,
  Coins,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { kokoroVoice } from '../utils/kokoroVoice';

interface ChartViewerProps {
  stock: Stock;
  filteredRank: number;
  totalFiltered: number;
  hudSettings: HudSettings;
  onUpdateHudSettings: (settings: Partial<HudSettings>) => void;
  isBookmarked: boolean;
  onToggleBookmark: (symbol: string) => void;
  themeMode: ThemeMode;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  brightness: number;
  interval: string;
  onIntervalChange: (interval: string) => void;
  chartStyle: 'candles' | 'line' | 'heikin';
  onChartStyleChange: (style: 'candles' | 'line' | 'heikin') => void;
  liveQuote?: LiveQuote | null;
  showPatterns?: boolean;
  onTogglePatterns?: () => void;
  onOpenVoiceModal?: () => void;
}

export const ChartViewer: React.FC<ChartViewerProps> = ({
  stock,
  filteredRank,
  totalFiltered,
  hudSettings,
  onUpdateHudSettings,
  isBookmarked,
  onToggleBookmark,
  themeMode,
  isFullscreen,
  onToggleFullscreen,
  brightness,
  interval,
  onIntervalChange,
  chartStyle,
  onChartStyleChange,
  liveQuote,
  showPatterns,
  onTogglePatterns,
  onOpenVoiceModal,
}) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showMovingAverages, setShowMovingAverages] = useState(true);
  const [localShowPatterns, setLocalShowPatterns] = useState(true);
  const [corporateEvents, setCorporateEvents] = useState<CorporateEvents | null>(null);
  const [showEvents, setShowEvents] = useState<boolean>(true);
  const [showEventsDrawer, setShowEventsDrawer] = useState<boolean>(false);
  const [voiceState, setVoiceState] = useState(kokoroVoice.state);

  // Subscribe to Kokoro Voice state changes
  useEffect(() => {
    const unsubscribe = kokoroVoice.subscribe(setVoiceState);
    return () => unsubscribe();
  }, []);

  // Fetch Corporate Events (Earnings & Dividends) for the current stock
  useEffect(() => {
    let isCancelled = false;
    fetch(`/api/events/${encodeURIComponent(stock.symbol)}`)
      .then((res) => {
        if (!res.ok) throw new Error('No events');
        return res.json();
      })
      .then((data) => {
        if (!isCancelled && data) {
          setCorporateEvents(data);
        }
      })
      .catch(() => {});
    return () => {
      isCancelled = true;
    };
  }, [stock.symbol]);

  const handleToggleStockVoice = () => {
    if (voiceState.isSpeaking) {
      kokoroVoice.stop();
    } else {
      kokoroVoice.speakStock(stock, liveQuote, corporateEvents);
    }
  };

  const isPatternsActive = showPatterns !== undefined ? showPatterns : localShowPatterns;
  const handleTogglePatterns = onTogglePatterns || (() => setLocalShowPatterns(!localShowPatterns));

  // Dynamic Live Market Cap for the top toolbar
  const dynamicMarketCap = React.useMemo(() => {
    if (stock.isPrivate) return stock.marketCap;
    if (liveQuote?.marketCap) return liveQuote.marketCap;
    if (liveQuote?.price && stock.marketCapNum > 0) {
      const basePrice = stock.approxPrice || stock.priceApprox || liveQuote.price;
      if (basePrice > 0) {
        const liveCapNum = (stock.marketCapNum * liveQuote.price) / basePrice;
        if (liveCapNum >= 1000) {
          return `$${(liveCapNum / 1000).toFixed(2)}T`;
        }
        return `$${liveCapNum.toFixed(1)}B`;
      }
    }
    return stock.marketCap;
  }, [liveQuote?.price, liveQuote?.marketCap, stock.marketCap, stock.marketCapNum, stock.approxPrice, stock.priceApprox, stock.isPrivate]);

  // Current font scale
  const currentFontScale = hudSettings.fontSizeScale || 1.0;

  // Timeframe options (10 Year and 20 Year options added)
  const timeRanges = [
    { label: '5D', val: '5d' },
    { label: '1M', val: '1mo' },
    { label: '3M', val: '3mo' },
    { label: '6M', val: '6mo' },
    { label: '1Y', val: '1y' },
    { label: '5Y', val: '5y' },
    { label: '10Y', val: '10y' },
    { label: '20Y', val: '20y' },
  ];

  // Determine container bedtime filter
  const getNightFilter = () => {
    let filter = `brightness(${brightness})`;
    if (themeMode === 'bedtime-amber') {
      filter += ' sepia(0.35) hue-rotate(-15deg) contrast(0.92)';
    } else if (themeMode === 'bedtime-oled') {
      filter += ' contrast(1.05)';
    }
    return filter;
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col overflow-hidden select-none transition-colors duration-300 ${
        themeMode === 'bedtime-oled'
          ? 'bg-black'
          : themeMode === 'bedtime-amber'
          ? 'bg-[#0d0905]'
          : 'bg-[#070b13]'
      }`}
      style={{
        filter: getNightFilter(),
      }}
    >
      {/* Top Chart Micro Toolbar */}
      <div
        className={`flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2 border-b z-30 shrink-0 text-xs backdrop-blur-sm gap-2 overflow-x-auto no-scrollbar ${
          themeMode === 'bedtime-amber'
            ? 'bg-[#18120a]/90 border-amber-900/40 text-amber-200'
            : themeMode === 'bedtime-oled'
            ? 'bg-black border-neutral-900 text-neutral-300'
            : 'bg-slate-900/90 border-slate-800 text-slate-300'
        }`}
      >
        {/* Left: Timeframe, Style & MA Toggles */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Range:
          </span>

          {timeRanges.map((tr) => (
            <button
              key={tr.val}
              onClick={() => onIntervalChange(tr.val)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                interval === tr.val
                  ? themeMode === 'bedtime-amber'
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                    : 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400'
              }`}
            >
              {tr.label}
            </button>
          ))}

          <div className="h-3.5 w-px bg-white/15 mx-1" />

          {/* Chart Style: Candlesticks / Line / Heikin Ashi */}
          {[
            { id: 'candles', label: 'Candles' },
            { id: 'line', label: 'Line' },
            { id: 'heikin', label: 'Heikin Ashi' },
          ].map((styleItem) => (
            <button
              key={styleItem.id}
              onClick={() =>
                onChartStyleChange(styleItem.id as 'candles' | 'line' | 'heikin')
              }
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                chartStyle === styleItem.id
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {styleItem.label}
            </button>
          ))}

          {/* Moving Average Toggle */}
          <button
            onClick={() => setShowMovingAverages(!showMovingAverages)}
            title="Toggle 20/50 Moving Averages"
            className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
              showMovingAverages
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-white/5'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>MA (20/50)</span>
          </button>

          {/* Chart Pattern Mode Toggle (Requested Feature) */}
          <button
            onClick={handleTogglePatterns}
            title="Toggle Chart Pattern Recognition Mode (Highlights Bullish & Bearish Flags, Triangles, Head & Shoulders, Double Tops/Bottoms, Targets & Stops) (P)"
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
              isPatternsActive
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/60 shadow-purple-950/50'
                : 'text-slate-400 hover:text-slate-200 bg-white/5 border border-transparent'
            }`}
          >
            <Sparkles className={`w-3 h-3 ${isPatternsActive ? 'text-purple-300 animate-pulse' : 'text-slate-400'}`} />
            <span>Patterns: <strong className={isPatternsActive ? 'text-white' : 'text-slate-400'}>{isPatternsActive ? 'ON' : 'OFF'}</strong></span>
          </button>

          {/* Corporate Events Toggle: Earnings Dates [E] & Dividend Dates [D] (Requested Feature) */}
          <button
            onClick={() => setShowEvents(!showEvents)}
            title="Toggle Earnings Dates [E] and Dividend Dates [D] markers on the chart"
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
              showEvents
                ? 'bg-gradient-to-r from-violet-600/30 to-emerald-600/30 text-white border border-violet-400/50 shadow-indigo-950/40'
                : 'text-slate-400 hover:text-slate-200 bg-white/5 border border-transparent'
            }`}
          >
            <Calendar className={`w-3 h-3 ${showEvents ? 'text-violet-300' : 'text-slate-400'}`} />
            <span>Events [E/D]: <strong className={showEvents ? 'text-white' : 'text-slate-400'}>{showEvents ? 'ON' : 'OFF'}</strong></span>
          </button>

          {/* Quick Corporate Calendar Drawer Toggle */}
          {corporateEvents && (corporateEvents.nextEarningsDate || (corporateEvents.dividendYield && corporateEvents.dividendYield !== 'None')) && (
            <button
              onClick={() => setShowEventsDrawer(!showEventsDrawer)}
              title="View full Corporate Events & Dividend details breakdown"
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                showEventsDrawer
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <Coins className="w-3 h-3 text-emerald-400" />
              <span className="hidden xl:inline">Calendar Details</span>
              {showEventsDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          <div className="h-3.5 w-px bg-white/15 mx-1" />

          {/* In-Chart Company Information Quick Button & Options Modal Trigger */}
          <button
            onClick={() => setShowInfoModal(true)}
            title="Adjust In-Chart Company Information (Transparency, Text Size, Visible Elements & Placement)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 active:scale-95 text-slate-300 hover:text-white font-medium transition-all border border-white/5 hover:border-white/20"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>
              Info:{' '}
              <strong className="text-emerald-400 font-mono">
                {Math.round(hudSettings.opacity * 100)}%
              </strong>
            </span>
          </button>

          {/* Prominent Information Text Size Control */}
          <div className="flex items-center rounded-md bg-white/5 border border-white/10 overflow-hidden">
            <button
              onClick={() => {
                const newScale = Math.max(0.8, Number((currentFontScale - 0.15).toFixed(2)));
                onUpdateHudSettings({ fontSizeScale: newScale });
              }}
              title="Decrease information text size (-)"
              className="px-2 py-1 hover:bg-white/15 text-slate-300 hover:text-white font-mono font-bold text-xs active:bg-white/25"
            >
              A-
            </button>
            <button
              onClick={() => setShowInfoModal(true)}
              title="Click to adjust Information Text Size, Transparency and Displayed Fields"
              className="px-2 py-1 hover:bg-white/10 text-cyan-300 hover:text-cyan-100 font-medium text-[11px] font-mono border-x border-white/10"
            >
              Size: <strong className="text-white">{Math.round(currentFontScale * 100)}%</strong>
            </button>
            <button
              onClick={() => {
                const newScale = Math.min(2.6, Number((currentFontScale + 0.15).toFixed(2)));
                onUpdateHudSettings({ fontSizeScale: newScale });
              }}
              title="Increase information text size (+)"
              className="px-2 py-1 hover:bg-white/15 text-cyan-300 hover:text-cyan-100 font-mono font-bold text-xs active:bg-white/25"
            >
              A+
            </button>
          </div>
        </div>

        {/* Right: Live Market Quote, Dynamic Cap & Fullscreen Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Dynamic Market Cap Badge */}
          <div className="hidden lg:flex items-center gap-1.5 font-mono text-[11px] bg-emerald-500/10 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/20">
            <span className="text-[10px] text-slate-400 font-sans">Cap:</span>
            <strong className="font-bold">{dynamicMarketCap}</strong>
          </div>

          {liveQuote ? (
            <div className="flex items-center gap-2 font-mono text-[11px] bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
              <span className="font-bold text-white">${liveQuote.price.toFixed(2)}</span>
              <span
                className={`font-semibold ${
                  Math.abs(liveQuote.change) < 0.005
                    ? 'text-slate-300'
                    : liveQuote.change > 0
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {liveQuote.change > 0.005 ? '+' : ''}
                {liveQuote.changePercent.toFixed(2)}%
              </span>
              <span className="text-[10px] text-slate-400 hidden md:inline">
                · Live Feed
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Market Data
            </div>
          )}

          {/* Kokoro Voice Narration & Persona Selector */}
          <div className="flex items-center rounded-lg bg-violet-950/30 border border-violet-500/30 p-0.5 shadow-sm">
            <button
              onClick={handleToggleStockVoice}
              title={
                voiceState.isSpeaking
                  ? 'Stop Kokoro Voice Narration'
                  : `Read Stock Summary with ${kokoroVoice.getActivePersona().name} (${kokoroVoice.getActivePersona().style})`
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                voiceState.isSpeaking
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'hover:bg-violet-600/30 text-violet-200'
              }`}
            >
              <Mic className={`w-3.5 h-3.5 ${voiceState.isSpeaking ? 'text-white' : 'text-violet-400'}`} />
              <span className="hidden sm:inline">
                {voiceState.isSpeaking ? 'Stop' : 'Read Chart'}
              </span>
            </button>

            {onOpenVoiceModal && (
              <>
                <div className="w-px h-4 bg-violet-500/30 mx-0.5" />
                <button
                  onClick={onOpenVoiceModal}
                  title={`Active Voice: ${kokoroVoice.getActivePersona().name} (${kokoroVoice.getActivePersona().style}). Click to change voice persona or speed.`}
                  className="flex items-center gap-1 px-1.5 py-1 rounded-md text-xs hover:bg-violet-600/30 text-violet-200 hover:text-white transition-colors"
                >
                  <span className="text-sm drop-shadow">{kokoroVoice.getActivePersona().avatarIcon}</span>
                  <span className="hidden md:inline font-mono text-[11px] text-violet-300">
                    {kokoroVoice.getActivePersona().name.replace('Kokoro ', '')}
                  </span>
                  <ChevronDown className="w-3 h-3 text-violet-400 opacity-75" />
                </button>
              </>
            )}
          </div>

          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Full Screen' : 'Expand Full Screen (F)'}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Full Screen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Corporate Events Drawer (Earnings & Dividend details) */}
      {showEventsDrawer && corporateEvents && (
        <div className="px-4 py-2.5 bg-slate-900/95 border-b border-white/10 text-xs backdrop-blur-md flex items-center justify-between gap-4 flex-wrap z-20 shadow-xl">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Earnings Card */}
            {corporateEvents.nextEarningsDate ? (
              <div className="flex items-center gap-2.5 bg-violet-950/45 border border-violet-500/35 px-3 py-1.5 rounded-lg">
                <div className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                  E
                </div>
                <div>
                  <div className="text-[10px] text-violet-300 uppercase font-semibold">Next Earnings Report</div>
                  <div className="text-white font-bold font-mono">
                    {corporateEvents.nextEarningsDate}{' '}
                    {corporateEvents.nextEarningsTime && (
                      <span className="text-violet-400 text-[10px] font-sans">({corporateEvents.nextEarningsTime})</span>
                    )}
                  </div>
                </div>
                {corporateEvents.nextEarningsEPS && (
                  <div className="border-l border-violet-500/30 pl-2.5 ml-1 text-right">
                    <div className="text-[9.5px] text-slate-400">Consensus EPS</div>
                    <div className="text-violet-200 font-mono font-bold">{corporateEvents.nextEarningsEPS}</div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Dividend Card */}
            {corporateEvents.dividendYield && corporateEvents.dividendYield !== 'None' && corporateEvents.dividendYield !== '0.00%' ? (
              <div className="flex items-center gap-2.5 bg-emerald-950/45 border border-emerald-500/35 px-3 py-1.5 rounded-lg">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                  D
                </div>
                <div>
                  <div className="text-[10px] text-emerald-300 uppercase font-semibold">Dividend Profile</div>
                  <div className="text-white font-bold font-mono">
                    Yield: <strong className="text-emerald-400">{corporateEvents.dividendYield}</strong>
                    {corporateEvents.quarterlyDividend && (
                      <span className="text-slate-300 font-normal ml-1">({corporateEvents.quarterlyDividend}/qtr)</span>
                    )}
                  </div>
                </div>
                {corporateEvents.nextExDate && (
                  <div className="border-l border-emerald-500/30 pl-2.5 ml-1 text-right">
                    <div className="text-[9.5px] text-slate-400">Next Ex-Date</div>
                    <div className="text-emerald-200 font-mono font-bold">{corporateEvents.nextExDate}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-slate-800/60 border border-white/10 px-3 py-1.5 rounded-lg text-slate-400">
                <Coins className="w-4 h-4 opacity-50" />
                <span>Dividend Policy: <strong className="text-slate-300">Non-Payer</strong> (Reinvests earnings for growth)</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowEventsDrawer(false)}
            className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 ml-auto transition-colors"
          >
            Close
          </button>
        </div>
      )}

      {/* Main Chart Canvas Area */}
      <div className="relative flex-1 w-full h-full min-h-0 bg-transparent overflow-hidden">
        {/* Synchronized In-Chart HUD Overlay (Centered transparent typography) */}
        <InChartHud
          stock={stock}
          filteredRank={filteredRank}
          totalFiltered={totalFiltered}
          hudSettings={hudSettings}
          onUpdateHudSettings={onUpdateHudSettings}
          isBookmarked={isBookmarked}
          onToggleBookmark={onToggleBookmark}
          themeMode={themeMode}
          liveQuote={liveQuote}
          corporateEvents={corporateEvents}
          onOpenInfoOptions={() => setShowInfoModal(true)}
        />

        {/* 100% Native Financial Chart Engine (Zero TradingView) */}
        <NativeStockChart
          stock={stock}
          timeRange={interval || '3mo'}
          chartStyle={chartStyle}
          themeMode={themeMode}
          liveQuote={liveQuote}
          showMovingAverages={showMovingAverages}
          showPatterns={isPatternsActive}
          onTogglePatterns={handleTogglePatterns}
          corporateEvents={corporateEvents}
          showEvents={showEvents}
          onToggleEvents={() => setShowEvents(!showEvents)}
        />
      </div>

      {/* In-Chart Company Information Options Modal (Transparency, Size, Fields, Placement) */}
      <InChartInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        hudSettings={hudSettings}
        onUpdateHudSettings={onUpdateHudSettings}
        themeMode={themeMode}
      />
    </div>
  );
};
