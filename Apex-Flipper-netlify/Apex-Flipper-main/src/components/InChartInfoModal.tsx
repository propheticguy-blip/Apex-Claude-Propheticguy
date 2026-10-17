import React from 'react';
import { X, Eye, Type, Sliders, Layers, CheckSquare, Square, Check, Sparkles } from 'lucide-react';
import { HudSettings, ThemeMode } from '../types/stock';

interface InChartInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  hudSettings: HudSettings;
  onUpdateHudSettings: (settings: Partial<HudSettings>) => void;
  themeMode?: ThemeMode;
}

export const InChartInfoModal: React.FC<InChartInfoModalProps> = ({
  isOpen,
  onClose,
  hudSettings,
  onUpdateHudSettings,
  themeMode,
}) => {
  if (!isOpen) return null;

  const currentFontScale = hudSettings.fontSizeScale || 1.0;

  const opacityPresets = [
    { label: 'Ghost (20%)', val: 0.20 },
    { label: 'Subtle (40%)', val: 0.40 },
    { label: 'Balanced (65%)', val: 0.65 },
    { label: 'Prominent (85%)', val: 0.85 },
    { label: 'Solid (100%)', val: 1.0 },
  ];

  const sizePresets = [
    { label: '80%', val: 0.80 },
    { label: '100% (Normal)', val: 1.0 },
    { label: '130%', val: 1.30 },
    { label: '160%', val: 1.60 },
    { label: '200%', val: 2.00 },
  ];

  const getThemeClasses = () => {
    if (themeMode === 'bedtime-amber') {
      return {
        bg: 'bg-[#18120a] border-amber-900/40 text-amber-100',
        card: 'bg-black/40 border-amber-900/30 text-amber-200',
        activeBtn: 'bg-amber-500/30 text-amber-200 border-amber-500/50',
        accentText: 'text-amber-400',
        accentSlider: 'accent-amber-500',
      };
    }
    if (themeMode === 'bedtime-oled') {
      return {
        bg: 'bg-black border-neutral-800 text-neutral-200',
        card: 'bg-neutral-950 border-neutral-900 text-neutral-300',
        activeBtn: 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50',
        accentText: 'text-emerald-400',
        accentSlider: 'accent-emerald-400',
      };
    }
    return {
      bg: 'bg-slate-900 border-slate-800 text-slate-100',
      card: 'bg-slate-800/50 border-white/10 text-slate-200',
      activeBtn: 'bg-blue-600/30 text-blue-300 border-blue-500/50',
      accentText: 'text-blue-400',
      accentSlider: 'accent-blue-500',
    };
  };

  const t = getThemeClasses();

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden select-none ${t.bg}`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>In-Chart Information Options</span>
              </h2>
              <p className="text-xs text-slate-400">
                Adjust transparency, text size, and information fields shown over the stock chart.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 no-scrollbar text-xs">
          {/* Section 1: Transparency */}
          <div className={`p-4 rounded-xl border ${t.card} space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-white">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Information Transparency</span>
              </div>
              <span className="font-mono text-sm font-bold text-emerald-400">
                {Math.round(hudSettings.opacity * 100)}%
              </span>
            </div>

            <input
              type="range"
              min="0.10"
              max="1.00"
              step="0.05"
              value={hudSettings.opacity}
              onChange={(e) =>
                onUpdateHudSettings({ opacity: parseFloat(e.target.value) })
              }
              className={`w-full h-2 rounded-lg bg-white/20 cursor-pointer ${t.accentSlider}`}
            />

            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {opacityPresets.map((p) => {
                const isActive = Math.abs(hudSettings.opacity - p.val) < 0.04;
                return (
                  <button
                    key={p.val}
                    onClick={() => onUpdateHudSettings({ opacity: p.val })}
                    className={`py-1.5 px-1 rounded-lg text-center font-mono text-[10.5px] border transition-all ${
                      isActive ? t.activeBtn + ' font-bold shadow' : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-400'
                    }`}
                  >
                    {Math.round(p.val * 100)}%
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Text Size Scaling */}
          <div className={`p-4 rounded-xl border ${t.card} space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-white">
                <Type className="w-4 h-4 text-cyan-400" />
                <span>Information Text Size</span>
              </div>
              <span className="font-mono text-sm font-bold text-cyan-400">
                {Math.round(currentFontScale * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newScale = Math.max(0.8, Number((currentFontScale - 0.15).toFixed(2)));
                  onUpdateHudSettings({ fontSizeScale: newScale });
                }}
                title="Decrease font size"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono font-bold"
              >
                A-
              </button>

              <input
                type="range"
                min="0.80"
                max="2.60"
                step="0.10"
                value={currentFontScale}
                onChange={(e) =>
                  onUpdateHudSettings({ fontSizeScale: parseFloat(e.target.value) })
                }
                className="w-full h-2 rounded-lg bg-white/20 cursor-pointer accent-cyan-400"
              />

              <button
                onClick={() => {
                  const newScale = Math.min(2.6, Number((currentFontScale + 0.15).toFixed(2)));
                  onUpdateHudSettings({ fontSizeScale: newScale });
                }}
                title="Increase font size"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-300 font-mono font-bold"
              >
                A+
              </button>
            </div>

            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {sizePresets.map((s) => {
                const isActive = Math.abs(currentFontScale - s.val) < 0.08;
                return (
                  <button
                    key={s.val}
                    onClick={() => onUpdateHudSettings({ fontSizeScale: s.val })}
                    className={`py-1.5 px-1 rounded-lg text-center font-mono text-[10.5px] border transition-all ${
                      isActive ? 'bg-cyan-500/30 text-cyan-200 border-cyan-500/50 font-bold shadow' : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-400'
                    }`}
                  >
                    {s.label.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Visible Elements Toggles */}
          <div className={`p-4 rounded-xl border ${t.card} space-y-2.5`}>
            <div className="font-bold text-white flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Visible Elements</span>
            </div>

            {/* Toggle Description */}
            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer">
              <span className="text-slate-300">Company Description & Summary</span>
              <input
                type="checkbox"
                checked={hudSettings.showDescription !== false}
                onChange={(e) => onUpdateHudSettings({ showDescription: e.target.checked })}
                className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
              />
            </label>

            {/* Toggle Sub-Industry */}
            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer">
              <span className="text-slate-300">Sub-Industry Classification</span>
              <input
                type="checkbox"
                checked={hudSettings.showSubIndustry !== false}
                onChange={(e) => onUpdateHudSettings({ showSubIndustry: e.target.checked })}
                className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
              />
            </label>

            {/* Toggle Market Cap */}
            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer">
              <span className="text-slate-300">Market Capitalization Tag</span>
              <input
                type="checkbox"
                checked={hudSettings.showMarketCap !== false}
                onChange={(e) => onUpdateHudSettings({ showMarketCap: e.target.checked })}
                className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
              />
            </label>

            {/* Toggle Options Tradable Badge */}
            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer">
              <span className="text-slate-300">Options Tradable Badge</span>
              <input
                type="checkbox"
                checked={hudSettings.showOptionsBadge !== false}
                onChange={(e) => onUpdateHudSettings({ showOptionsBadge: e.target.checked })}
                className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
              />
            </label>

            {/* Toggle Glass Blur */}
            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer">
              <span className="text-slate-300">Glass Backdrop Blur Effect</span>
              <input
                type="checkbox"
                checked={hudSettings.blurBackground !== false}
                onChange={(e) => onUpdateHudSettings({ blurBackground: e.target.checked })}
                className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
              />
            </label>
          </div>

          {/* Section 4: Position On Chart */}
          <div className={`p-4 rounded-xl border ${t.card} space-y-2`}>
            <div className="font-bold text-white flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Chart Placement</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'center', label: 'Center' },
                { id: 'top-center', label: 'Top' },
                { id: 'bottom-center', label: 'Bottom' },
                { id: 'top-left', label: 'Top Left' },
              ].map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => onUpdateHudSettings({ position: pos.id as any })}
                  className={`py-2 px-2 rounded-lg font-medium text-xs border transition-all ${
                    hudSettings.position === pos.id
                      ? 'bg-blue-600 text-white border-blue-500 font-bold shadow'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">
            Opacity: {Math.round(hudSettings.opacity * 100)}% • Size: {Math.round(currentFontScale * 100)}%
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
