import React from 'react';
import { ThemeMode, NightModeSettings } from '../types/stock';
import { Moon, Sun, Flame, Sparkles, Clock, X, Eye, ShieldAlert } from 'lucide-react';

interface NightModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  nightSettings: NightModeSettings;
  onUpdateNightSettings: (settings: Partial<NightModeSettings>) => void;
}

export const NightModeModal: React.FC<NightModeModalProps> = ({
  isOpen,
  onClose,
  nightSettings,
  onUpdateNightSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200 select-none">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Bedtime & Night Mode</h2>
              <p className="text-xs text-slate-400">
                Optimized for comfortable viewing from bed in total darkness
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Theme Mode Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Night Viewing Style:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  id: 'bedtime-amber',
                  name: 'Bedtime Amber',
                  desc: 'Warm anti-blue light circadian glow',
                  badge: '2700K Warm',
                  icon: Flame,
                  activeColor: 'border-amber-500 bg-amber-500/20 text-amber-200',
                },
                {
                  id: 'bedtime-oled',
                  name: 'OLED Pure Black',
                  desc: 'True #000000 zero-glow background',
                  badge: '0% Light Leak',
                  icon: Moon,
                  activeColor: 'border-emerald-500 bg-emerald-500/20 text-emerald-200',
                },
                {
                  id: 'midnight-dark',
                  name: 'Midnight Pro',
                  desc: 'Standard pro dark theme',
                  badge: 'Deep Navy',
                  icon: Eye,
                  activeColor: 'border-blue-500 bg-blue-500/20 text-blue-200',
                },
              ].map((style) => {
                const Icon = style.icon;
                const isSelected = nightSettings.mode === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() =>
                      onUpdateNightSettings({ mode: style.id as ThemeMode })
                    }
                    className={`flex flex-col items-center justify-between p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? style.activeColor
                        : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-bold">{style.name}</span>
                    <span className="text-[10px] text-slate-400 mt-1">{style.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bedroom Brightness Dimmer */}
          <div className="space-y-2 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Night Brightness Dimmer:
              </span>
              <span className="font-mono text-amber-400 font-bold">
                {Math.round(nightSettings.brightness * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400">30% (Ultra Dim)</span>
              <input
                type="range"
                min="0.30"
                max="1.00"
                step="0.05"
                value={nightSettings.brightness}
                onChange={(e) =>
                  onUpdateNightSettings({ brightness: parseFloat(e.target.value) })
                }
                className="flex-1 accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">100% (Standard)</span>
            </div>

            {/* Quick Dim Presets */}
            <div className="flex items-center gap-1.5 pt-1">
              {[
                { label: '40% Bedtime', val: 0.4 },
                { label: '60% Dim', val: 0.6 },
                { label: '80% Soft', val: 0.8 },
                { label: '100% Full', val: 1.0 },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => onUpdateNightSettings({ brightness: p.val })}
                  className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                    Math.abs(nightSettings.brightness - p.val) < 0.04
                      ? 'bg-amber-500/30 text-amber-200 border-amber-500/50'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bedtime Sleep Timer */}
          <div className="space-y-2 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Bedtime Sleep Timer (Auto-Stop):
              </span>
              <span className="font-mono text-slate-400">
                {nightSettings.sleepTimerMinutes
                  ? `${nightSettings.sleepTimerMinutes} min`
                  : 'Off (Continuous)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Automatically pauses the flipper if you fall asleep in bed.
            </p>

            <div className="flex items-center gap-1.5 pt-1">
              {[
                { label: 'Disabled', val: null },
                { label: '15 Min', val: 15 },
                { label: '30 Min', val: 30 },
                { label: '45 Min', val: 45 },
                { label: '60 Min', val: 60 },
              ].map((timerOpt) => (
                <button
                  key={String(timerOpt.val)}
                  onClick={() =>
                    onUpdateNightSettings({ sleepTimerMinutes: timerOpt.val })
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    nightSettings.sleepTimerMinutes === timerOpt.val
                      ? 'bg-blue-500/30 text-blue-200 border-blue-500/50 font-bold'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {timerOpt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-black/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow"
          >
            Apply & View Bedtime Charts
          </button>
        </div>
      </div>
    </div>
  );
};
