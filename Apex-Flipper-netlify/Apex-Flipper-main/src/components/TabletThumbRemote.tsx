import React, { useState, useEffect, useRef } from 'react';
import { Stock, ThemeMode, TimerSettings } from '../types/stock';
import { ChevronRight, ChevronLeft, Mic, Square } from 'lucide-react';
import { kokoroVoice } from '../utils/kokoroVoice';

interface TabletThumbRemoteProps {
  currentStock: Stock;
  currentIndex: number;
  totalStocks: number;
  onNextStock: () => void;
  onPrevStock: () => void;
  onJumpBy: (delta: number) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  themeMode: ThemeMode;
  timerSettings: TimerSettings;
  onUpdateTimerSettings: (settings: Partial<TimerSettings>) => void;
  isTabletMode: boolean;
  onToggleTabletMode: () => void;
  corporateEvents?: any;
  liveQuote?: any;
  onOpenVoiceModal?: () => void;
}

export const TabletThumbRemote: React.FC<TabletThumbRemoteProps> = ({
  currentStock,
  currentIndex,
  totalStocks,
  onNextStock,
  onPrevStock,
  isTabletMode,
  themeMode,
  corporateEvents,
  liveQuote,
  timerSettings,
  onUpdateTimerSettings,
}) => {
  // Horizontal position as percentage of window width (0% = flush left edge, 100% = flush right edge)
  const [xPercent, setXPercent] = useState<number>(() => {
    try {
      const savedX = localStorage.getItem('apexflipper_thumb_x_pct');
      if (savedX !== null) {
        const parsed = parseFloat(savedX);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) return parsed;
      }
      const savedSide = localStorage.getItem('apexflipper_thumb_side');
      if (savedSide === 'left') return 0;
      if (savedSide === 'right') return 100;
    } catch {}
    return 100; // Default: right edge
  });

  // Vertical position as percentage of window height (8% to 92%)
  const [topPercent, setTopPercent] = useState<number>(() => {
    try {
      const savedY = localStorage.getItem('apexflipper_thumb_y_pct');
      if (savedY !== null) {
        const parsed = parseFloat(savedY);
        if (!isNaN(parsed) && parsed >= 8 && parsed <= 92) return parsed;
      }
    } catch {}
    return 54; // Ergonomic tablet thumb height
  });

  const [voiceState, setVoiceState] = useState(kokoroVoice.state);

  // Active hover/touch feedback state: gently brightens when touched, then dissolves back to ghost glass
  const [isAwake, setIsAwake] = useState(false);
  const wakeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 2D Dragging state and refs
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartYRef = useRef<number>(0);
  const dragStartXPercentRef = useRef<number>(100);
  const dragStartYPercentRef = useRef<number>(54);

  // Button touch & mouse disambiguation: Tap vs 2D Drag
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const buttonDragDetectedRef = useRef<boolean>(false);

  // Tactile haptic feedback helper
  const triggerHaptic = (ms = 20) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {}
    }
  };

  // Mark activity globally so the bottom bar NEVER wakes up from thumb controller taps or drags
  const markInteraction = () => {
    if (typeof window !== 'undefined') {
      (window as any).__lastTabletThumbInteraction = Date.now();
    }
  };

  const wakeThumbPad = () => {
    markInteraction();
    setIsAwake(true);
    if (wakeTimerRef.current) clearTimeout(wakeTimerRef.current);
    wakeTimerRef.current = setTimeout(() => {
      setIsAwake(false);
    }, 1800);
  };

  useEffect(() => {
    return () => {
      if (wakeTimerRef.current) clearTimeout(wakeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = kokoroVoice.subscribe(setVoiceState);
    return () => unsubscribe();
  }, []);

  // Direct Button Touch: Tap to advance or drag in 2D anywhere on screen
  const onButtonTouchStart = (e: React.TouchEvent) => {
    markInteraction();
    e.stopPropagation();
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    dragStartXRef.current = touch.clientX;
    dragStartYRef.current = touch.clientY;
    dragStartXPercentRef.current = xPercent;
    dragStartYPercentRef.current = topPercent;
    buttonDragDetectedRef.current = false;
    wakeThumbPad();
  };

  const onButtonTouchMove = (e: React.TouchEvent) => {
    markInteraction();
    e.stopPropagation();
    const touch = e.touches[0];
    const diffX = Math.abs(touch.clientX - touchStartXRef.current);
    const diffY = Math.abs(touch.clientY - touchStartYRef.current);

    if (diffX > 6 || diffY > 6) {
      buttonDragDetectedRef.current = true;
      setIsDragging(true);

      const windowW = typeof window !== 'undefined' ? window.innerWidth : 1000;
      const windowH = typeof window !== 'undefined' ? window.innerHeight : 800;

      const deltaXPercent = ((touch.clientX - touchStartXRef.current) / windowW) * 100;
      const deltaYPercent = ((touch.clientY - touchStartYRef.current) / windowH) * 100;

      let newX = Math.max(0, Math.min(100, dragStartXPercentRef.current + deltaXPercent));
      let newY = Math.max(8, Math.min(92, dragStartYPercentRef.current + deltaYPercent));

      // Magnetic snap to edges when dragged very close
      if (newX < 10) newX = 0;
      if (newX > 90) newX = 100;

      setXPercent(newX);
      setTopPercent(newY);
    }
  };

  const onButtonTouchEnd = (e: React.TouchEvent, action: () => void) => {
    markInteraction();
    e.stopPropagation();
    setIsDragging(false);
    if (buttonDragDetectedRef.current) {
      // Drag completed: save position
      try {
        localStorage.setItem('apexflipper_thumb_x_pct', xPercent.toFixed(1));
        localStorage.setItem('apexflipper_thumb_y_pct', topPercent.toFixed(1));
        localStorage.setItem('apexflipper_thumb_side', xPercent <= 50 ? 'left' : 'right');
      } catch {}
      triggerHaptic(12);
      buttonDragDetectedRef.current = false;
    } else {
      // Tap completed: perform button action
      action();
    }
  };

  // Mouse drag support for buttons (desktop/laptop/emulated tablet cursor)
  const onButtonMouseDown = (e: React.MouseEvent, action: () => void) => {
    markInteraction();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialXPct = xPercent;
    const initialYPct = topPercent;
    let hasMouseMoved = false;

    const onMove = (me: MouseEvent) => {
      markInteraction();
      const diffX = me.clientX - startX;
      const diffY = me.clientY - startY;
      if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
        hasMouseMoved = true;
        setIsDragging(true);
        const windowW = typeof window !== 'undefined' ? window.innerWidth : 1000;
        const windowH = typeof window !== 'undefined' ? window.innerHeight : 800;

        let newX = Math.max(0, Math.min(100, initialXPct + (diffX / windowW) * 100));
        let newY = Math.max(8, Math.min(92, initialYPct + (diffY / windowH) * 100));

        if (newX < 10) newX = 0;
        if (newX > 90) newX = 100;

        setXPercent(newX);
        setTopPercent(newY);
      }
    };

    const onUp = () => {
      markInteraction();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setIsDragging(false);
      if (hasMouseMoved) {
        try {
          localStorage.setItem('apexflipper_thumb_x_pct', xPercent.toFixed(1));
          localStorage.setItem('apexflipper_thumb_y_pct', topPercent.toFixed(1));
          localStorage.setItem('apexflipper_thumb_side', xPercent <= 50 ? 'left' : 'right');
        } catch {}
        triggerHaptic(12);
      } else {
        action();
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleNextWithHaptic = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    markInteraction();
    wakeThumbPad();
    triggerHaptic(22);
    kokoroVoice.stop();
    onNextStock();
  };

  const handlePrevWithHaptic = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    markInteraction();
    wakeThumbPad();
    triggerHaptic(18);
    kokoroVoice.stop();
    onPrevStock();
  };

  const handleVoiceToggle = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    markInteraction();
    wakeThumbPad();
    triggerHaptic(15);
    if (voiceState.isSpeaking || timerSettings?.autoReadOnFlip) {
      kokoroVoice.stop();
      if (timerSettings?.autoReadOnFlip && onUpdateTimerSettings) {
        onUpdateTimerSettings({ autoReadOnFlip: false });
      }
    } else {
      if (timerSettings?.isPlaying && onUpdateTimerSettings) {
        onUpdateTimerSettings({ autoReadOnFlip: true });
      }
      kokoroVoice.speakStock(currentStock, liveQuote, corporateEvents);
    }
  };

  if (!isTabletMode) {
    return null;
  }

  // Position state: docked flush left or flush right
  const isLeftSide = xPercent <= 50;
  const isFlushLeft = xPercent < 6;
  const isFlushRight = xPercent > 94;

  // Base opacity: subtle ghost glass when idle, brightens when interacted with
  const currentOpacity = isDragging
    ? 0.95
    : isAwake || voiceState.isSpeaking
    ? 0.92
    : 0.38;

  // Adaptive capsule border rounding based on bezel docking
  const getContainerRounding = () => {
    if (isFlushRight) return 'rounded-l-2xl border-r-0';
    if (isFlushLeft) return 'rounded-r-2xl border-l-0';
    return 'rounded-2xl';
  };

  // Theme styling for pure translucent ghost glass
  const getThemeStyle = () => {
    if (themeMode === 'bedtime-amber') {
      return {
        capsule: 'bg-[#18120a]/85 border-amber-600/40 shadow-[0_4px_20px_rgba(0,0,0,0.7)]',
        prevBtn: 'text-amber-300 hover:text-amber-100 hover:bg-amber-500/20 active:bg-amber-500/35 border-amber-600/30',
        micBtn: 'text-amber-300 hover:text-amber-100 hover:bg-amber-500/20 active:bg-amber-500/35 border-amber-600/30',
        micActive: 'bg-rose-600/80 text-white border-rose-400 animate-pulse shadow-md',
        nextBtn: 'bg-amber-500/30 hover:bg-amber-500/45 text-amber-100 border-amber-400/50 shadow-md font-bold',
      };
    }
    if (themeMode === 'bedtime-oled') {
      return {
        capsule: 'bg-black/85 border-neutral-700/50 shadow-[0_4px_24px_rgba(0,0,0,0.95)]',
        prevBtn: 'text-neutral-300 hover:text-white hover:bg-white/10 active:bg-white/20 border-neutral-800',
        micBtn: 'text-emerald-300 hover:text-emerald-100 hover:bg-emerald-500/20 active:bg-emerald-500/35 border-neutral-800',
        micActive: 'bg-rose-600/80 text-white border-rose-400 animate-pulse shadow-md',
        nextBtn: 'bg-emerald-500/30 hover:bg-emerald-500/45 text-emerald-100 border-emerald-400/50 shadow-md font-bold',
      };
    }
    return {
      capsule: 'bg-slate-950/80 border-slate-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.8)]',
      prevBtn: 'text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/20 border-white/10',
      micBtn: 'text-violet-300 hover:text-violet-100 hover:bg-violet-600/25 active:bg-violet-600/40 border-white/10',
      micActive: 'bg-rose-600/85 text-white border-rose-400 animate-pulse shadow-md',
      nextBtn: 'bg-blue-600/40 hover:bg-blue-600/60 text-white border-blue-400/50 shadow-md font-bold',
    };
  };

  const style = getThemeStyle();

  return (
    /* 
      Ultra-Clean, Minimalist Thumb Controller (Requested):
      - Keeps ONLY:
        1. PREV button
        2. MICROPHONE button (read aloud) placed directly to the LEFT of the NEXT button
        3. NEXT button
      - Zero clutter, no other buttons, no side-switchers, no margin zones
      - Draggable in 2D anywhere on screen (touch or mouse)
      - Never wakes up the bottom bar
    */
    <div
      id="tablet-thumb-container"
      data-tablet-remote="true"
      onMouseEnter={wakeThumbPad}
      onTouchStart={(e) => {
        markInteraction();
        e.stopPropagation();
        wakeThumbPad();
      }}
      onTouchMove={(e) => {
        markInteraction();
        e.stopPropagation();
      }}
      onTouchEnd={(e) => {
        markInteraction();
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        markInteraction();
        e.stopPropagation();
      }}
      onClick={(e) => {
        markInteraction();
        e.stopPropagation();
      }}
      className={`fixed z-40 select-none pointer-events-auto ${
        isDragging ? 'transition-none cursor-grabbing' : 'transition-[left,top,opacity] duration-200 cursor-grab'
      }`}
      style={{
        left: `${xPercent}%`,
        top: `${topPercent}%`,
        transform: `translate(-${xPercent}%, -50%)`,
        opacity: currentOpacity,
      }}
    >
      <div
        className={`flex items-center gap-1.5 p-1.5 border backdrop-blur-md ${getContainerRounding()} ${style.capsule} transition-all`}
      >
        {/* 1. PREVIOUS BUTTON */}
        <button
          onClick={(e) => handlePrevWithHaptic(e)}
          onMouseDown={(e) => onButtonMouseDown(e, () => handlePrevWithHaptic(e))}
          onTouchStart={onButtonTouchStart}
          onTouchMove={onButtonTouchMove}
          onTouchEnd={(e) => onButtonTouchEnd(e, () => handlePrevWithHaptic(e))}
          title="Previous Stock (Tap to go back, or drag to move controller)"
          className={`h-10 px-3 rounded-xl border backdrop-blur-sm flex items-center justify-center gap-1 text-xs font-semibold active:scale-95 transition-all touch-none ${style.prevBtn}`}
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span className="text-[11px] font-bold">PREV</span>
        </button>

        {/* 2. MICROPHONE (READ ALOUD) BUTTON — Positioned immediately to the LEFT of the NEXT button */}
        <button
          onClick={(e) => handleVoiceToggle(e)}
          onMouseDown={(e) => onButtonMouseDown(e, () => handleVoiceToggle(e))}
          onTouchStart={onButtonTouchStart}
          onTouchMove={onButtonTouchMove}
          onTouchEnd={(e) => onButtonTouchEnd(e, () => handleVoiceToggle(e))}
          title={
            voiceState.isSpeaking
              ? 'Stop AI Voice Read Aloud'
              : timerSettings?.autoReadOnFlip
              ? 'Auto Reader Active (Synced with Auto-Flipper) - Tap to Stop'
              : timerSettings?.isPlaying
              ? 'Start Auto Reader (Sync with Auto-Flipper)'
              : 'Read aloud stock overview & trends with AI Voice (Tap to read, or drag to move)'
          }
          className={`h-10 px-3 rounded-xl border backdrop-blur-sm flex items-center justify-center gap-1.5 text-xs font-semibold active:scale-95 transition-all touch-none ${
            voiceState.isSpeaking
              ? style.micActive
              : timerSettings?.autoReadOnFlip
              ? 'bg-violet-600/35 text-violet-200 border-violet-400/50 shadow-md font-bold'
              : style.micBtn
          }`}
        >
          {voiceState.isSpeaking ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span className="text-[11px] font-mono font-bold">STOP</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span className="text-[11px] font-mono font-bold">
                {timerSettings?.autoReadOnFlip ? 'AUTO' : 'READ'}
              </span>
            </>
          )}
        </button>

        {/* 3. NEXT BUTTON */}
        <button
          onClick={(e) => handleNextWithHaptic(e)}
          onMouseDown={(e) => onButtonMouseDown(e, () => handleNextWithHaptic(e))}
          onTouchStart={onButtonTouchStart}
          onTouchMove={onButtonTouchMove}
          onTouchEnd={(e) => onButtonTouchEnd(e, () => handleNextWithHaptic(e))}
          title="Next Stock (Tap to advance, or drag to move controller)"
          className={`h-10 px-4 rounded-xl border-2 backdrop-blur-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all touch-none ${style.nextBtn}`}
        >
          <span className="text-xs font-black tracking-wide">NEXT</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
