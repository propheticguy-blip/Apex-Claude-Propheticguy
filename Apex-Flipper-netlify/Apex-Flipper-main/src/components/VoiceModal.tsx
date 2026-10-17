import React, { useState, useEffect } from 'react';
import { X, Volume2, Mic, Play, Pause, Check, Sparkles, Gauge } from 'lucide-react';
import { kokoroVoice, KOKORO_VOICES, KokoroVoicePersona } from '../utils/kokoroVoice';
import { ThemeMode } from '../types/stock';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode?: ThemeMode;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, onClose, themeMode }) => {
  const [voiceState, setVoiceState] = useState(kokoroVoice.state);
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = kokoroVoice.subscribe((s) => {
      setVoiceState(s);
      if (!s.isSpeaking) {
        setPreviewingVoiceId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleSelectVoice = (voice: KokoroVoicePersona) => {
    kokoroVoice.setVoice(voice.id);
  };

  const handlePlayPreview = (e: React.MouseEvent, voice: KokoroVoicePersona) => {
    e.stopPropagation();
    if (voiceState.isSpeaking && previewingVoiceId === voice.id) {
      kokoroVoice.stop();
      setPreviewingVoiceId(null);
    } else {
      setPreviewingVoiceId(voice.id);
      kokoroVoice.previewVoice(voice.id);
    }
  };

  const handleSpeedChange = (rate: number) => {
    kokoroVoice.setRate(rate);
  };

  const getThemeModalClasses = () => {
    if (themeMode === 'bedtime-amber') {
      return {
        bg: 'bg-[#18120a] border-amber-900/40 text-amber-100',
        cardActive: 'bg-amber-950/40 border-amber-500/50 text-amber-200',
        cardInactive: 'bg-black/40 border-amber-900/30 hover:border-amber-700/40 text-amber-200/80',
        accentBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        highlightText: 'text-amber-400',
      };
    }
    if (themeMode === 'bedtime-oled') {
      return {
        bg: 'bg-black border-neutral-800 text-neutral-200',
        cardActive: 'bg-neutral-900 border-emerald-500 text-white',
        cardInactive: 'bg-neutral-950 border-neutral-900 hover:border-neutral-800 text-neutral-300',
        accentBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        highlightText: 'text-emerald-400',
      };
    }
    return {
      bg: 'bg-slate-900 border-slate-800 text-slate-100',
      cardActive: 'bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10',
      cardInactive: 'bg-slate-800/40 border-white/5 hover:border-white/15 text-slate-300',
      accentBadge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      highlightText: 'text-blue-400',
    };
  };

  const t = getThemeModalClasses();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${t.bg}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-600/25 border border-violet-500/30 text-violet-300">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>AI Voice Personas</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Kokoro TTS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Choose the voice that reads your stock charts, live prices, earnings, and macro analysis.
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

        {/* Voice List Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 no-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {KOKORO_VOICES.map((voice) => {
              const isSelected = voice.id === voiceState.activeVoiceId;
              const isPlayingThis = voiceState.isSpeaking && previewingVoiceId === voice.id;

              return (
                <div
                  key={voice.id}
                  onClick={() => handleSelectVoice(voice)}
                  className={`relative p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between select-none ${
                    isSelected ? t.cardActive : t.cardInactive
                  }`}
                >
                  <div>
                    {/* Top row: Avatar, Name, Selection check */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl drop-shadow">{voice.avatarIcon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-white">{voice.name}</span>
                            {isSelected && (
                              <span className="flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                <Check className="w-3 h-3 stroke-[3]" /> Active
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {voice.gender === 'female' ? 'Female' : 'Male'} • {voice.accent}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Style Badge */}
                    <div className="mb-2">
                      <span className={`text-[10.5px] px-2 py-0.5 rounded-md border font-medium ${t.accentBadge}`}>
                        {voice.style}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300/90 leading-relaxed mb-3">
                      {voice.description}
                    </p>
                  </div>

                  {/* Bottom Action Bar: Preview Sample */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={(e) => handlePlayPreview(e, voice)}
                      title={`Listen to ${voice.name} sample`}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isPlayingThis
                          ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {isPlayingThis ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Stop Preview</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Preview Sample</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleSelectVoice(voice)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                        isSelected
                          ? 'text-emerald-400 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Use Voice'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Voice Speed Controls */}
          <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <span>Reading Speed</span>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-400">
                {voiceState.playbackRate.toFixed(2)}x
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.7"
                max="1.6"
                step="0.05"
                value={voiceState.playbackRate}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 rounded-lg bg-white/20 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
              {[0.8, 1.0, 1.2, 1.4].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleSpeedChange(rate)}
                  className={`px-2 py-0.5 rounded font-mono transition-colors ${
                    Math.abs(voiceState.playbackRate - rate) < 0.05
                      ? 'bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'hover:bg-white/10 text-slate-400'
                  }`}
                >
                  {rate.toFixed(1)}x {rate === 1.0 ? '(Normal)' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-black/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Volume2 className="w-4 h-4 text-slate-400" />
            <span>
              Active: <strong className="text-white">{kokoroVoice.getActivePersona().name}</strong> ({kokoroVoice.getActivePersona().style})
            </span>
          </div>
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
