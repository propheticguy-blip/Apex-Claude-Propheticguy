import React from 'react';
import { X, Keyboard, Sparkles } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Start / Pause automatic chart flipper' },
    { key: '→  /  Right Arrow', desc: 'Flip to Next Stock (descending market cap)' },
    { key: '←  /  Left Arrow', desc: 'Flip to Previous Stock' },
    { key: '+  /  =', desc: 'Make middle information larger (+15%)' },
    { key: '-  /  _', desc: 'Make middle information smaller (-15%)' },
    { key: 'S', desc: 'Cycle to Next Sector (one sector at a time)' },
    { key: 'N', desc: 'Toggle Stock News & Search-Grounded Headlines Panel' },
    { key: 'E', desc: 'Toggle US Macroeconomic Indicators Flipper' },
    { key: 'F', desc: 'Toggle Full Screen (hide browser headers & distractions)' },
    { key: 'B', desc: 'Toggle Bedtime Night Mode (Amber / OLED Black / Dimmer)' },
    { key: 'T', desc: 'Cycle timer interval (1s, 2s, 3s, 5s, 8s, 10s...)' },
    { key: 'O', desc: 'Toggle Options Tradable Only filter' },
    { key: 'W', desc: 'Bookmark / Add current stock to Watchlist' },
    { key: 'R', desc: 'Toggle Auto Reader sync with Auto-Flipper (voice narration pace)' },
    { key: 'V', desc: 'Change AI Voice Persona (Kokoro voices & reading speed)' },
    { key: 'M', desc: 'Toggle Tablet Thumb Manual Mode (Left or Right thumb browsing)' },
    { key: 'P', desc: 'Toggle Chart Pattern Mode (highlight triangles, flags, targets)' },
    { key: 'Esc', desc: 'Close open dialogs or exit fullscreen' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200 select-none">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-xs text-slate-400">
            Control the chart flipper rapidly from your keyboard without clicking:
          </p>
          <div className="space-y-2">
            {shortcuts.map((s) => (
              <div
                key={s.key}
                className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-xs"
              >
                <span className="text-slate-300">{s.desc}</span>
                <kbd className="px-2 py-1 rounded bg-black/50 border border-white/20 text-white font-mono font-bold text-[11px] shrink-0">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-white/10 bg-black/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
