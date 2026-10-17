import React, { useEffect, useState } from 'react';
import { TimerSettings, ThemeMode } from '../types/stock';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Clock,
  Volume2,
  VolumeX,
  Repeat,
  FastForward,
  RotateCcw,
  Hand,
  ChevronDown,
  ChevronUp,
  Mic,
} from 'lucide-react';

interface TimerControlsProps {
  timerSettings: TimerSettings;
  onUpdateTimerSettings: (settings: Partial<TimerSettings>) => void;
  onNextStock: () => void;
  onPrevStock: () => void;
  currentIndex: number;
  totalStocks: number;
  onJumpToIndex: (index: number) => void;
  themeMode: ThemeMode;
  progressPercent: number; // 0 to 100
  isTabletMode?: boolean;
  onToggleTabletMode?: () => void;
  voiceState?: { isSpeaking: boolean; currentTitle: string };
  narrationPhase?: 'reading' | 'pausing' | 'idle';
  currentStockSymbol?: string;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  timerSettings,
  onUpdateTimerSettings,
  onNextStock,
  onPrevStock,
  currentIndex,
  totalStocks,
  onJumpToIndex,
  themeMode,
  progressPercent,
  isTabletMode,
  onToggleTabletMode,
  voiceState,
  narrationPhase,
  currentStockSymbol,
}) => {
  const [jumpInput, setJumpInput] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('apexflipper_bottombar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('apexflipper_bottombar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const quickSeconds = [1, 2, 3, 5, 8, 10, 15, 30];

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const rank = parseInt(jumpInput, 10);
    if (!isNaN(rank) && rank >= 1 && rank <= totalStocks) {
      onJumpToIndex(rank - 1);
      setJumpInput('');
    }
  };

  const getThemeClasses = () => {
    if (themeMode === 'bedtime-amber') {
      return {
        bg: 'bg-[#18120a] border-amber-900/40 text-amber-200',
        activeBtn: 'bg-amber-600 text-white hover:bg-amber-500',
        progressBar: 'bg-amber-500',
      };
    }
    if (themeMode === 'bedtime-oled') {
      return {
        bg: 'bg-black border-neutral-800 text-neutral-300',
        activeBtn: 'bg-white text-black hover:bg-neutral-200',
        progressBar: 'bg-emerald-400',
      };
    }
    return {
      bg: 'bg-slate-900 border-slate-800 text-slate-200',
      activeBtn: 'bg-blue-600 text-white hover:bg-blue-500',
      progressBar: 'bg-blue-500',
    };
  };

  const themeStyle = getThemeClasses();

  if (isCollapsed) {
    return (
      <div className={`relative border-t z-20 select-none ${themeStyle.bg}`}>
        {/* Sleek countdown line */}
        <div className="w-full h-1 bg-white/10 relative overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ease-linear ${themeStyle.progressBar}`}
            style={{
              width: timerSettings.isPlaying ? `${progressPercent}%` : '0%',
            }}
          />
        </div>
        {/* Compact Expand Pill */}
        <div className="flex items-center justify-between px-3 py-0.5 text-[10px]">
          <span className="font-mono text-slate-400">
            #{currentIndex + 1} / {totalStocks}
          </span>
          <button
            onClick={toggleCollapse}
            title="Expand Bottom Controls Bar"
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 font-semibold"
          >
            <ChevronUp className="w-3 h-3" />
            <span>Expand Controls</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative border-t shadow-lg z-20 transition-colors select-none ${themeStyle.bg}`}
    >
      {/* Top Progress countdown line */}
      <div className="w-full h-1.5 bg-white/10 relative overflow-hidden">
        <div
          className={`h-full transition-all duration-100 ease-linear ${
            timerSettings.autoReadOnFlip && timerSettings.isPlaying && voiceState?.isSpeaking
              ? 'bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400 animate-pulse'
              : themeStyle.progressBar
          }`}
          style={{
            width: timerSettings.isPlaying ? `${progressPercent}%` : '0%',
          }}
        />
      </div>

      <div className="px-3 sm:px-4 py-2.5 sm:py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-3 flex-wrap">
        {/* Playback Controls & Current Position */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Previous Button */}
          <button
            onClick={onPrevStock}
            title="Previous Stock (Left Arrow)"
            className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Primary Play / Pause Button */}
          <button
            onClick={() =>
              onUpdateTimerSettings({ isPlaying: !timerSettings.isPlaying })
            }
            title={timerSettings.isPlaying ? 'Pause Auto-Flipper (Space)' : 'Start Auto-Flipper (Space)'}
            className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold active:scale-95 transition-all shadow-md text-xs sm:text-sm ${
              timerSettings.isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : themeStyle.activeBtn
            }`}
          >
            {timerSettings.isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Auto Flip</span>
              </>
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={onNextStock}
            title="Next Stock (Right Arrow / Space)"
            className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Auto Reader Toggle (Synchronized with Auto-Flipper) */}
          <button
            onClick={() =>
              onUpdateTimerSettings({ autoReadOnFlip: !timerSettings.autoReadOnFlip })
            }
            title={
              timerSettings.autoReadOnFlip
                ? 'Auto Reader Active: Voice reads each stock aloud & flipper advances after reading. Click to disable (R).'
                : 'Turn ON Auto Reader: Reads each stock aloud with AI Voice & coordinates with auto-flipper (R).'
            }
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 shadow-sm ${
              timerSettings.autoReadOnFlip
                ? 'bg-violet-600 hover:bg-violet-500 text-white border-violet-400 shadow-violet-950/40'
                : 'bg-white/10 hover:bg-white/15 text-slate-300 border-white/10'
            }`}
          >
            <Mic className={`w-3.5 h-3.5 ${timerSettings.autoReadOnFlip ? 'text-white' : 'text-violet-400'}`} />
            <span className="hidden sm:inline">Auto Read</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-black ${
                timerSettings.autoReadOnFlip
                  ? 'bg-white/25 text-white'
                  : 'bg-black/30 text-slate-400'
              }`}
            >
              {timerSettings.autoReadOnFlip ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Stock Counter */}
          <div className="flex items-center gap-1.5 font-mono text-xs px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <span className="font-bold text-white">#{currentIndex + 1}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-400">{totalStocks}</span>
          </div>

          {/* Android Tablet Thumb Manual Mode Switch (Left or Right Hand) */}
          {onToggleTabletMode && (
            <button
              onClick={onToggleTabletMode}
              title="Toggle Tablet Thumb Manual Mode (Hold tablet with hands, flip with left or right thumb)"
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isTabletMode
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50 shadow-sm font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/10'
              }`}
            >
              <Hand className={`w-3.5 h-3.5 ${isTabletMode ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>Tablet Mode</span>
            </button>
          )}
        </div>

        {/* Timer Duration or Live Speech Synchronization Status */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {timerSettings.autoReadOnFlip ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-violet-600/20 text-violet-200 border border-violet-500/35 font-medium text-xs shadow-sm">
              <Mic className="w-3.5 h-3.5 text-violet-400" />
              {voiceState?.isSpeaking ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  <span className="font-semibold text-white">
                    Reading {currentStockSymbol || 'stock'} · <span className="text-violet-300 font-normal">holds flip until finished</span>
                  </span>
                </>
              ) : timerSettings.isPlaying ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-semibold text-emerald-300">
                    Narration complete · <span className="text-slate-300 font-normal">flipping in 1.5s</span>
                  </span>
                </>
              ) : (
                <span>Auto Reader Synced (Paused)</span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline text-slate-300">Duration:</span>
              <span className="font-bold font-mono text-emerald-400 text-sm">
                {timerSettings.seconds}s
              </span>
            </div>
          )}

          {/* Quick Preset Buttons (only show when not in auto-read mode) */}
          {!timerSettings.autoReadOnFlip ? (
            <>
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-[210px] sm:max-w-none">
                {quickSeconds.map((sec) => (
                  <button
                    key={sec}
                    onClick={() => onUpdateTimerSettings({ seconds: sec })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      timerSettings.seconds === sec
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                        : 'bg-white/5 hover:bg-white/15 text-slate-300'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>

              {/* Precision Slider */}
              <div className="hidden lg:flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="60"
                  step="1"
                  value={timerSettings.seconds}
                  onChange={(e) =>
                    onUpdateTimerSettings({ seconds: parseInt(e.target.value, 10) })
                  }
                  className="w-24 accent-emerald-400 h-1.5 bg-slate-700 rounded cursor-pointer"
                />
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px]">
              <span className="text-slate-400 font-sans">Pause after read:</span>
              {[1.0, 2.0, 3.0, 5.0].map((pauseSec) => (
                <button
                  key={pauseSec}
                  onClick={() => onUpdateTimerSettings({ postNarrationPauseSec: pauseSec })}
                  className={`px-2 py-0.5 rounded font-mono transition-all ${
                    (timerSettings.postNarrationPauseSec ?? 2.0) === pauseSec
                      ? 'bg-violet-600 text-white font-bold shadow-sm'
                      : 'hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {pauseSec}s
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right side: Jump to rank & Loop / Sound toggles */}
        <div className="flex items-center gap-2.5">
          {/* Jump to Rank Form */}
          <form onSubmit={handleJump} className="flex items-center gap-1">
            <input
              type="number"
              min="1"
              max={totalStocks}
              placeholder="Jump #"
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              className="w-20 px-2.5 py-1 text-xs rounded-lg bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 font-mono"
            />
            <button
              type="submit"
              className="px-2 py-1 text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg transition-colors"
            >
              Go
            </button>
          </form>

          {/* Loop toggle */}
          <button
            onClick={() =>
              onUpdateTimerSettings({
                loopBackToStart: !timerSettings.loopBackToStart,
              })
            }
            title={
              timerSettings.loopBackToStart
                ? 'Looping enabled (restarts after #1)'
                : 'Stop at end of list'
            }
            className={`p-2 rounded-lg transition-colors ${
              timerSettings.loopBackToStart
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Repeat className="w-4 h-4" />
          </button>

          {/* Soft Sound toggle */}
          <button
            onClick={() =>
              onUpdateTimerSettings({ soundEnabled: !timerSettings.soundEnabled })
            }
            title={timerSettings.soundEnabled ? 'Mute Flip Tick' : 'Enable Flip Tick Chime'}
            className={`p-2 rounded-lg transition-colors ${
              timerSettings.soundEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            {timerSettings.soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Minimize / Collapse Bottom Bar */}
          <button
            onClick={toggleCollapse}
            title="Minimize Bottom Bar (Give charts full height)"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors ml-0.5"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
