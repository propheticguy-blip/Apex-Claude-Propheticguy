import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Tablet,
  Download,
  Share2,
  Check,
  Copy,
  ExternalLink,
  X,
  Sparkles,
  Zap,
  Maximize2,
  Layers,
  ArrowRight,
  QrCode,
} from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { ThemeMode } from '../types/stock';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  themeMode,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android');
  const [appUrl, setAppUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAppUrl(window.location.href);
      if (isIOS) {
        setActiveTab('ios');
      } else {
        setActiveTab('android');
      }
    }
  }, [isIOS]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    appUrl
  )}&bgcolor=090d16&color=38bdf8&margin=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className={`relative w-full max-w-xl rounded-2xl border shadow-2xl p-6 sm:p-7 overflow-hidden my-auto ${
          themeMode === 'bedtime-amber'
            ? 'bg-[#181109] border-amber-900/60 text-amber-100'
            : themeMode === 'bedtime-oled'
            ? 'bg-neutral-950 border-neutral-800 text-white'
            : 'bg-slate-900 border-slate-800 text-white'
        }`}
      >
        {/* Decorative Top Accent Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white shadow-lg shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Install on Phone &amp; Tablet
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                WebAPK / PWA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Run standalone in full-screen with zero browser address bar, straight from your home screen or app drawer.
            </p>
          </div>
        </div>

        {/* Standalone Installed Notification */}
        {isInstalled ? (
          <div className="mb-5 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center gap-3">
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-emerald-300">
                ApexFlipper is already installed as a standalone app!
              </p>
              <p className="text-slate-300 mt-0.5">
                You can launch it anytime directly from your tablet or phone home screen with full offline access.
              </p>
            </div>
          </div>
        ) : isInstallable ? (
          /* Instant 1-Click Install Button when browser supports direct prompt */
          <div className="mb-5 p-4 rounded-xl bg-blue-600/20 border border-blue-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="font-bold text-sm text-blue-200">
                One-Click Installation Available
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Install as a native application on your device right now.
              </p>
            </div>
            <button
              onClick={handleInstallClick}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Install Now</span>
            </button>
          </div>
        ) : null}

        {/* Operating System Platform Selector */}
        <div className="flex rounded-xl bg-white/5 p-1 mb-5 border border-white/10">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'android'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android Phone &amp; Tablet (WebAPK)</span>
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ios'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span>iPad &amp; iPhone (iOS Standalone)</span>
          </button>
        </div>

        {/* Step-by-Step Instructions */}
        {activeTab === 'android' ? (
          <div className="space-y-3.5 mb-5 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white font-bold text-[11px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-white block">Open on Android Chrome</strong>
                <span className="text-slate-400">
                  Open this app URL in Google Chrome on your Android phone or tablet (outside the developer frame).
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white font-bold text-[11px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-white block">Tap Chrome Menu (⋮) &rarr; "Install app"</strong>
                <span className="text-slate-400">
                  Tap the three vertical dots in the top right corner of Chrome, then select <strong className="text-slate-200">"Install app"</strong> or <strong className="text-slate-200">"Add to Home screen"</strong>.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[11px] shrink-0 mt-0.5">
                ✓
              </span>
              <div>
                <strong className="text-emerald-300 block">System WebAPK Generated</strong>
                <span className="text-slate-300">
                  Android builds an official system package (WebAPK) with the ApexFlipper logo in your app drawer! Opening it delivers 100% full-screen view with zero browser search bar.
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 mb-5 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white font-bold text-[11px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-white block">Open in Safari</strong>
                <span className="text-slate-400">
                  Open the app link in Apple Safari on your iPhone or iPad.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white font-bold text-[11px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-white block">Tap Share [↑] &rarr; "Add to Home Screen"</strong>
                <span className="text-slate-400">
                  Tap the Share button at the bottom (or top on iPad), scroll down and tap <strong className="text-slate-200">"Add to Home Screen"</strong>.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[11px] shrink-0 mt-0.5">
                ✓
              </span>
              <div>
                <strong className="text-emerald-300 block">Launches Full-Screen</strong>
                <span className="text-slate-300">
                  Tap the home screen icon anytime to launch directly without Safari navigation bars or tabs.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Connect: QR Code & Direct URL Link */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider font-mono">
              <QrCode className="w-3.5 h-3.5 text-blue-400" />
              Scan with Tablet / Phone Camera
            </span>
            <span className="text-[10px] text-slate-500">Opens straight in mobile browser</span>
          </div>

          <div className="flex items-center gap-4">
            {/* QR Code image */}
            <div className="p-1.5 bg-slate-950 border border-blue-500/30 rounded-xl shrink-0 shadow-md">
              <img
                src={qrCodeUrl}
                alt="Scan to open on tablet or phone"
                className="w-20 h-20 rounded-lg object-contain"
                loading="lazy"
              />
            </div>

            {/* Direct Link & Copy button */}
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="flex-1 px-2.5 py-1.5 text-[11px] font-mono rounded-lg bg-black/60 border border-white/15 text-slate-300 truncate focus:outline-none"
                />
                <button
                  onClick={handleCopy}
                  title="Copy direct app link"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Point your phone or tablet camera at the QR code above or copy the link to install in seconds.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Optimizations Highlights */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center text-[10px]">
          <div className="p-2 rounded-lg bg-white/5">
            <span className="font-bold text-white block">👈 Touch Swipe 👉</span>
            <span className="text-slate-400">Flip stocks left / right</span>
          </div>
          <div className="p-2 rounded-lg bg-white/5">
            <span className="font-bold text-white block">📱 Mobile Viewport</span>
            <span className="text-slate-400">Thumb-friendly controls</span>
          </div>
          <div className="p-2 rounded-lg bg-white/5">
            <span className="font-bold text-white block">⚡ Offline Mode</span>
            <span className="text-slate-400">Fast local caching</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
