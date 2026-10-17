import React from 'react';
import { Stock, ThemeMode, NightModeSettings } from '../types/stock';
import {
  TrendingUp,
  Moon,
  Sun,
  Flame,
  Star,
  Maximize2,
  Minimize2,
  HelpCircle,
  Sliders,
  Sparkles,
  Layers,
  Landmark,
  Newspaper,
  Hand,
  Volume2,
  Mic,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { kokoroVoice } from '../utils/kokoroVoice';

interface HeaderBarProps {
  currentStock: Stock;
  totalStocks: number;
  filteredIndex: number;
  totalFiltered: number;
  themeMode: ThemeMode;
  onOpenNightModal: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  bookmarkedCount: number;
  onOpenWatchlist: () => void;
  onOpenShortcuts: () => void;
  currentLiveMarketCap?: string;
  onOpenInstallModal?: () => void;
  onOpenEconomicSection?: () => void;
  onOpenNewsOverlay?: () => void;
  isTabletMode?: boolean;
  onToggleTabletMode?: () => void;
  onOpenVoiceModal?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentStock,
  totalStocks,
  filteredIndex,
  totalFiltered,
  themeMode,
  onOpenNightModal,
  isFullscreen,
  onToggleFullscreen,
  bookmarkedCount,
  onOpenWatchlist,
  onOpenShortcuts,
  currentLiveMarketCap,
  onOpenInstallModal,
  onOpenEconomicSection,
  onOpenNewsOverlay,
  isTabletMode,
  onToggleTabletMode,
  onOpenVoiceModal,
}) => {
  const [voiceState, setVoiceState] = React.useState(kokoroVoice.state);

  React.useEffect(() => {
    const unsub = kokoroVoice.subscribe(setVoiceState);
    return () => unsub();
  }, []);

  const activePersona = kokoroVoice.getActivePersona();

  const getNightButtonTheme = () => {
    if (themeMode === 'bedtime-amber') {
      return 'bg-amber-500/25 text-amber-300 border-amber-500/40 hover:bg-amber-500/35';
    }
    if (themeMode === 'bedtime-oled') {
      return 'bg-neutral-800 text-emerald-400 border-neutral-700 hover:bg-neutral-700';
    }
    return 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/15';
  };

  return (
    <header
      className={`px-4 py-2.5 border-b z-30 transition-colors flex items-center justify-between gap-3 shrink-0 select-none ${
        themeMode === 'bedtime-amber'
          ? 'bg-[#140e08] border-amber-950/60 text-amber-100'
          : themeMode === 'bedtime-oled'
          ? 'bg-black border-neutral-900 text-white'
          : 'bg-slate-900 border-slate-800 text-white'
      }`}
    >
      {/* Brand & Market Cap Ranking Tagline */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-xl ${
              themeMode === 'bedtime-amber'
                ? 'bg-amber-500 text-slate-950 shadow-amber-900/40'
                : 'bg-gradient-to-tr from-blue-600 to-emerald-500 text-white'
            } shadow-md`}
          >
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-tight text-white uppercase font-mono">
                ApexFlipper
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                Largest-to-Smallest Market Cap
              </span>
              {currentStock && (
                <span className="sm:hidden px-1.5 py-0.5 text-[10px] font-bold font-mono rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  #{currentStock.globalRank} {currentStock.symbol}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block">
              US-tradable equities ordered strictly by market cap · Free live & delayed charts
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Live Market Cap & Current Stock Quick Info */}
      {currentStock && (
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 border border-white/10 font-mono text-xs">
          <span className="text-emerald-400 font-bold">#{currentStock.globalRank}</span>
          <span className="text-white font-black tracking-wide">{currentStock.symbol}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-300 font-medium truncate max-w-[150px]">{currentStock.name}</span>
          <span className="text-slate-500">·</span>
          <span className="text-emerald-300 font-bold">{currentLiveMarketCap || currentStock.marketCap}</span>
        </div>
      )}

      {/* Right Controls: Bedtime Mode, Watchlist, Fullscreen, Keyboard Shortcuts */}
      <div className="flex items-center gap-2">
        {/* Night / Bedtime Mode Toggle */}
        <button
          onClick={onOpenNightModal}
          title="Night & Bedtime Viewing Mode (Warm Amber / OLED Black)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${getNightButtonTheme()}`}
        >
          {themeMode === 'bedtime-amber' ? (
            <>
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Bedtime Amber</span>
            </>
          ) : themeMode === 'bedtime-oled' ? (
            <>
              <Moon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">OLED Black</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Bedtime Mode</span>
            </>
          )}
        </button>

        {/* Macroeconomic Data Section Button */}
        {onOpenEconomicSection && (
          <button
            onClick={onOpenEconomicSection}
            title="Open US Macroeconomic Indicators Flipper"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/40 transition-colors shadow-sm"
          >
            <Landmark className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Economics</span>
          </button>
        )}

        {/* News Intelligence Overlay Button */}
        {onOpenNewsOverlay && (
          <button
            onClick={onOpenNewsOverlay}
            title="Open Stock News Side Panel (N)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-200 border border-cyan-500/40 transition-colors shadow-sm"
          >
            <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">News</span>
          </button>
        )}

        {/* Android Tablet Thumb Manual Mode Toggle (Left or Right Hand) */}
        {onToggleTabletMode && (
          <button
            onClick={onToggleTabletMode}
            title={
              isTabletMode
                ? 'Tablet Thumb Mode Active (Manual flipping with left or right thumb). Click to toggle.'
                : 'Turn ON Tablet Thumb Mode (Designed for holding an Android tablet with left or right thumb navigation)'
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isTabletMode
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/15 text-slate-200 border-white/10'
            }`}
          >
            <Hand className={`w-3.5 h-3.5 ${isTabletMode ? 'text-white' : 'text-emerald-400'}`} />
            <span className="hidden sm:inline">Tablet Mode</span>
            {isTabletMode && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            )}
          </button>
        )}

        {/* AI Voice Persona Selector Button */}
        {onOpenVoiceModal && (
          <button
            onClick={onOpenVoiceModal}
            title={`AI Audio Voice: ${activePersona.name} (${activePersona.style}). Click to change voice persona or speed (V).`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              voiceState.isSpeaking
                ? 'bg-rose-600/35 text-white border-rose-500/60 shadow-md animate-pulse font-bold'
                : 'bg-violet-600/20 hover:bg-violet-600/35 text-violet-200 border-violet-500/40'
            }`}
          >
            <span className="text-sm drop-shadow">{activePersona.avatarIcon}</span>
            <span className="hidden sm:inline font-mono">
              {activePersona.name.replace('Kokoro ', '')}
            </span>
            {voiceState.isSpeaking ? (
              <span className="flex items-center gap-0.5 ml-0.5">
                <span className="w-1 h-2.5 bg-rose-400 rounded-full animate-bounce" />
                <span className="w-1 h-3.5 bg-rose-300 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1 h-2 bg-rose-400 rounded-full animate-bounce [animation-delay:0.3s]" />
              </span>
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-violet-300 opacity-75" />
            )}
          </button>
        )}

        {/* Watchlist Button with Badge */}
        <button
          onClick={onOpenWatchlist}
          title="Open Flagged Watchlist"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 transition-colors"
        >
          <Star
            className={`w-3.5 h-3.5 ${
              bookmarkedCount > 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
            }`}
          />
          <span className="hidden sm:inline">Watchlist</span>
          {bookmarkedCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 font-mono">
              {bookmarkedCount}
            </span>
          )}
        </button>

        {/* Install on Mobile / Tablet (APK / PWA) */}
        {onOpenInstallModal && (
          <PWAInstallButton onOpenModal={onOpenInstallModal} />
        )}

        {/* Shortcuts Info */}
        <button
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts"
          className="hidden sm:flex p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Fullscreen Expand Button (Requested Feature) */}
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Full Screen' : 'Expand to Full Screen (F)'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md active:scale-95"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Exit Fullscreen</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Full Screen</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
