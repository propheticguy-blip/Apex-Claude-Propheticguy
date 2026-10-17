import React, { useState, useEffect } from 'react';
import { TimerSettings, HudSettings, ThemeMode } from '../types/stock';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Clock,
  Minimize2,
  Moon,
  Sliders,
  Eye,
  Star,
  Sparkles,
  Landmark,
  Newspaper,
  Hand,
  Pin,
  PinOff,
  ChevronDown,
  ChevronUp,
  Volume2,
  Mic,
} from 'lucide-react';
import { kokoroVoice } from '../utils/kokoroVoice';

interface FullscreenRemoteProps {
  timerSettings: TimerSettings;
  onUpdateTimerSettings: (settings: Partial<TimerSettings>) => void;
  onNextStock: () => void;
  onPrevStock: () => void;
  currentIndex: number;
  totalStocks: number;
  onExitFullscreen: () => void;
  onOpenNightModal: () => void;
  hudSettings: HudSettings;
  onUpdateHudSettings: (settings: Partial<HudSettings>) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  progressPercent: number;
  themeMode: ThemeMode;
  showPatterns?: boolean;
  onTogglePatterns?: () => void;
  onOpenEconomicSection?: () => void;
  onOpenNewsOverlay?: () => void;
  isTabletMode?: boolean;
  onToggleTabletMode?: () => void;
  onOpenVoiceModal?: () => void;
}

export const FullscreenRemote: React.FC<FullscreenRemoteProps> = ({
  timerSettings,
  onUpdateTimerSettings,
  onNextStock,
  onPrevStock,
  currentIndex,
  totalStocks,
  onExitFullscreen,
  onOpenNightModal,
  hudSettings,
  onUpdateHudSettings,
  isBookmarked,
  onToggleBookmark,
  progressPercent,
  themeMode,
  showPatterns,
  onTogglePatterns,
  onOpenEconomicSection,
  onOpenNewsOverlay,
  isTabletMode,
  onToggleTabletMode,
  onOpenVoiceModal,
}) => {
  // In Tablet Mode, start with bottom bar hidden so it never blocks the screen unless pinned
  const [isPinned, setIsPinned] = useState(() => {
    try {
      return localStorage.getItem('apexflipper_remote_pinned') === 'true';
    } catch {
      return false;
    }
  });

  const [isVisible, setIsVisible] = useState(() => isPinned || !isTabletMode);
  const [showQuickOpacity, setShowQuickOpacity] = useState(false);
  const hideTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const togglePin = () => {
    setIsPinned((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('apexflipper_remote_pinned', String(next));
      } catch {}
      if (next) {
        setIsVisible(true);
      }
      return next;
    });
  };

  const scheduleHide = (delayMs = 15000) => {
    if (isPinned) return;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (!isPinned) {
        setIsVisible(false);
      }
    }, delayMs);
  };

  const cancelHide = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (isPinned) {
      setIsVisible(true);
      cancelHide();
    }
  }, [isPinned]);

  // Activity detection: wake bottom bar when intentional, but NEVER on thumb button taps
  useEffect(() => {
    const handleActivity = (e: MouseEvent | TouchEvent) => {
      if (isPinned) return;

      // 1. If thumb remote or edge zone was touched/clicked recently (within 1500ms), IGNORE COMPLETELY!
      const lastThumbTime = (window as any).__lastTabletThumbInteraction || 0;
      if (Date.now() - lastThumbTime < 1500) {
        return;
      }

      // 2. Check event target and composed path for tablet remote container/buttons
      const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
      for (const el of path) {
        if (
          el instanceof HTMLElement &&
          (el.id === 'tablet-thumb-container' ||
            el.id === 'tablet-edge-zone' ||
            el.hasAttribute('data-tablet-remote') ||
            el.closest?.('#tablet-thumb-container') ||
            el.closest?.('#tablet-edge-zone') ||
            el.closest?.('[data-tablet-remote]'))
        ) {
          return;
        }
      }

      const target = (e.target || (e as TouchEvent).touches?.[0]?.target) as HTMLElement | null;
      if (
        target?.closest?.('#tablet-thumb-container') ||
        target?.closest?.('#tablet-edge-zone') ||
        target?.closest?.('[data-tablet-remote]')
      ) {
        return;
      }

      // 3. In tablet mode, keep bottom bar quiet unless user specifically gestures near the bottom or taps bottom trigger
      if (isTabletMode && !isVisible) {
        const clientY =
          'touches' in e && e.touches.length > 0 ? e.touches[0].clientY : (e as MouseEvent).clientY;
        if (clientY !== undefined && clientY < window.innerHeight - 120) {
          return; // Stay hidden!
        }
      }

      // Wake bottom bar and give it a generous 15 seconds!
      setIsVisible(true);
      scheduleHide(15000);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity, { passive: true });

    // Initial timeout if not pinned
    if (!isPinned) {
      scheduleHide(isTabletMode ? 6000 : 15000);
    }

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      cancelHide();
    };
  }, [isTabletMode, isPinned, isVisible]);

  return (
    <>
      {/* Subtle Bottom Bar Reveal Trigger when bar is hidden */}
      {!isVisible && !isPinned && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(true);
            scheduleHide(15000);
          }}
          title="Show Bottom Controls Bar"
          className="fixed bottom-2.5 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1 rounded-full bg-slate-900/85 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/20 backdrop-blur-md shadow-lg text-[11px] font-semibold flex items-center gap-1.5 active:scale-95 transition-all select-none"
        >
          <ChevronUp className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
          <span>Bottom Controls Bar</span>
        </button>
      )}

      <div
        onMouseEnter={cancelHide}
        onTouchStart={cancelHide}
        onMouseMove={cancelHide}
        onTouchMove={cancelHide}
        onMouseLeave={() => scheduleHide(12000)}
        onTouchEnd={() => scheduleHide(12000)}
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 pointer-events-auto ${
          isVisible || isPinned ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
      <div
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border shadow-2xl backdrop-blur-xl text-white select-none ${
          themeMode === 'bedtime-amber'
            ? 'bg-[#1c160e]/90 border-amber-600/40 shadow-amber-950/50'
            : themeMode === 'bedtime-oled'
            ? 'bg-black/90 border-neutral-800 shadow-black'
            : 'bg-slate-900/90 border-slate-700/80 shadow-slate-950/80'
        }`}
      >
        {/* Progress ring/line */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full overflow-hidden mr-1">
          <div
            className={`h-full transition-all duration-100 ${
              timerSettings.autoReadOnFlip && timerSettings.isPlaying
                ? 'bg-gradient-to-r from-violet-400 to-cyan-400 animate-pulse'
                : 'bg-emerald-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Prev */}
        <button
          onClick={onPrevStock}
          title="Previous (Left Arrow)"
          className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* Play / Pause */}
        <button
          onClick={() =>
            onUpdateTimerSettings({ isPlaying: !timerSettings.isPlaying })
          }
          title={timerSettings.isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          className={`p-2.5 rounded-full font-bold active:scale-95 transition-all shadow-md ${
            timerSettings.isPlaying
              ? 'bg-amber-500 text-black hover:bg-amber-400'
              : 'bg-blue-600 text-white hover:bg-blue-500'
          }`}
        >
          {timerSettings.isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Next */}
        <button
          onClick={onNextStock}
          title="Next (Right Arrow)"
          className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        {/* Auto Read Toggle */}
        <button
          onClick={() =>
            onUpdateTimerSettings({ autoReadOnFlip: !timerSettings.autoReadOnFlip })
          }
          title={
            timerSettings.autoReadOnFlip
              ? 'Auto Reader Active: Synced with Auto-Flipper (Click to turn OFF) (R)'
              : 'Turn ON Auto Reader (Synchronizes AI Voice with Auto-Flipper) (R)'
          }
          className={`p-2 rounded-full transition-all active:scale-95 flex items-center justify-center ${
            timerSettings.autoReadOnFlip
              ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-950/50 border border-violet-400'
              : 'hover:bg-white/10 text-slate-300'
          }`}
        >
          <Mic className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-white/20 mx-1" />

        {/* Counter */}
        <span className="text-xs font-mono font-semibold px-1 text-slate-300">
          #{currentIndex + 1}/{totalStocks}
        </span>

        {/* Timer cycle button */}
        <button
          onClick={() => {
            const presets = [1, 2, 3, 5, 8, 10, 15];
            const currIdx = presets.indexOf(timerSettings.seconds);
            const nextSec =
              currIdx === -1 || currIdx === presets.length - 1
                ? presets[0]
                : presets[currIdx + 1];
            onUpdateTimerSettings({ seconds: nextSec });
          }}
          title="Click to cycle timer seconds (T)"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-emerald-300"
        >
          <Clock className="w-3 h-3" />
          {timerSettings.seconds}s
        </button>

        {/* Star */}
        <button
          onClick={onToggleBookmark}
          title="Bookmark / Watchlist (W)"
          className={`p-2 rounded-full hover:bg-white/10 transition-all ${
            isBookmarked ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
        </button>

        {/* Pattern Mode Toggle */}
        {onTogglePatterns && (
          <button
            onClick={onTogglePatterns}
            title={`Toggle Chart Pattern Mode (P): ${showPatterns ? 'Active' : 'Disabled'}`}
            className={`p-2 rounded-full transition-all ${
              showPatterns
                ? 'bg-purple-600/40 text-purple-200 border border-purple-500/50 shadow-sm'
                : 'hover:bg-white/10 text-slate-400'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${showPatterns ? 'text-purple-300 animate-pulse' : ''}`} />
          </button>
        )}

        {/* Opacity quick cycle */}
        <div className="relative">
          <button
            onClick={() => setShowQuickOpacity(!showQuickOpacity)}
            title="Adjust HUD Transparency"
            className="p-2 rounded-full hover:bg-white/10 text-slate-300"
          >
            <Eye className="w-4 h-4" />
          </button>

          {showQuickOpacity && (
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 p-2.5 rounded-xl bg-slate-900 border border-slate-700 shadow-xl flex flex-col gap-1.5 w-32 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                HUD Opacity
              </span>
              {[0.25, 0.5, 0.75, 1.0].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    onUpdateHudSettings({ opacity: val });
                    setShowQuickOpacity(false);
                  }}
                  className={`px-2 py-1 rounded text-left font-mono ${
                    hudSettings.opacity === val
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {Math.round(val * 100)}%
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text Size Controls (A- / A+) */}
        <div className="flex items-center rounded-full bg-white/10 px-1 py-0.5 border border-white/10 text-[11px] font-mono">
          <button
            onClick={() => {
              const curr = hudSettings.fontSizeScale || 1.0;
              const next = Math.max(0.8, Number((curr - 0.2).toFixed(2)));
              onUpdateHudSettings({ fontSizeScale: next });
            }}
            title="Make info text smaller"
            className="px-1.5 py-0.5 hover:bg-white/20 rounded-full text-slate-300 font-bold"
          >
            A-
          </button>
          <button
            onClick={() => {
              const sizes = [1.0, 1.3, 1.6, 2.0, 2.4];
              const curr = hudSettings.fontSizeScale || 1.0;
              const idx = sizes.findIndex((s) => Math.abs(s - curr) < 0.15);
              const next = idx === -1 || idx === sizes.length - 1 ? sizes[0] : sizes[idx + 1];
              onUpdateHudSettings({ fontSizeScale: next });
            }}
            title="Cycle text size preset"
            className="px-1.5 py-0.5 text-cyan-300 font-bold hover:text-white"
          >
            {Math.round((hudSettings.fontSizeScale || 1.0) * 100)}%
          </button>
          <button
            onClick={() => {
              const curr = hudSettings.fontSizeScale || 1.0;
              const next = Math.min(2.6, Number((curr + 0.2).toFixed(2)));
              onUpdateHudSettings({ fontSizeScale: next });
            }}
            title="Make info text larger"
            className="px-1.5 py-0.5 hover:bg-white/20 rounded-full text-cyan-300 font-bold"
          >
            A+
          </button>
        </div>

        {/* Economics indicators toggle */}
        {onOpenEconomicSection && (
          <button
            onClick={onOpenEconomicSection}
            title="Macroeconomics Indicators Flipper (E)"
            className="p-2 rounded-full hover:bg-white/10 text-indigo-300"
          >
            <Landmark className="w-4 h-4" />
          </button>
        )}

        {/* Stock News Overlay toggle */}
        {onOpenNewsOverlay && (
          <button
            onClick={onOpenNewsOverlay}
            title="Stock News Side Panel (N)"
            className="p-2 rounded-full hover:bg-white/10 text-cyan-300"
          >
            <Newspaper className="w-4 h-4" />
          </button>
        )}

        {/* Tablet Right-Thumb Mode toggle */}
        {onToggleTabletMode && (
          <button
            onClick={onToggleTabletMode}
            title={`Toggle Tablet Right-Thumb Flipper (Hand): ${isTabletMode ? 'ON' : 'OFF'}`}
            className={`p-2 rounded-full transition-all ${
              isTabletMode
                ? 'bg-emerald-600/40 text-emerald-300 border border-emerald-500/50 shadow-sm'
                : 'hover:bg-white/10 text-slate-400'
            }`}
          >
            <Hand className="w-4 h-4" />
          </button>
        )}

        {/* Pin Bottom Bar open toggle */}
        <button
          onClick={togglePin}
          title={isPinned ? 'Bottom Bar Pinned (Will stay open). Click to unpin.' : 'Pin Bottom Bar (Keep visible while using)'}
          className={`p-2 rounded-full transition-all ${
            isPinned
              ? 'bg-blue-600 text-white shadow-sm'
              : 'hover:bg-white/10 text-slate-400 hover:text-white'
          }`}
        >
          {isPinned ? <Pin className="w-4 h-4 fill-current rotate-45" /> : <Pin className="w-4 h-4" />}
        </button>

        {/* AI Voice Persona Modal Button */}
        {onOpenVoiceModal && (
          <button
            onClick={onOpenVoiceModal}
            title={`AI Voice: ${kokoroVoice.getActivePersona().name} (${kokoroVoice.getActivePersona().style}). Click to change voice persona or speed (V).`}
            className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-white/10 text-violet-300 transition-all text-xs"
          >
            <span className="text-sm drop-shadow">{kokoroVoice.getActivePersona().avatarIcon}</span>
            <span className="hidden sm:inline font-mono text-[11px] text-violet-200">
              {kokoroVoice.getActivePersona().name.replace('Kokoro ', '')}
            </span>
          </button>
        )}

        {/* Night mode toggle */}
        <button
          onClick={onOpenNightModal}
          title="Bedtime Night Controls (B)"
          className="p-2 rounded-full hover:bg-white/10 text-amber-300"
        >
          <Moon className="w-4 h-4" />
        </button>

        {/* Hide Bar button */}
        <button
          onClick={() => {
            cancelHide();
            setIsPinned(false);
            setIsVisible(false);
          }}
          title="Dismiss Bottom Bar (Tap trigger at bottom center to reopen)"
          className="p-1.5 rounded-full hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-white/20 mx-1" />

        {/* Exit fullscreen button */}
        <button
          onClick={onExitFullscreen}
          title="Exit Fullscreen (F or Esc)"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-xs font-semibold"
        >
          <Minimize2 className="w-3.5 h-3.5 text-blue-300" />
          <span>Exit</span>
        </button>
      </div>
    </div>
    </>
  );
};
