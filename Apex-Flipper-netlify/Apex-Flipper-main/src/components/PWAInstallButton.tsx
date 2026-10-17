import React, { useState } from 'react';
import { Download, Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenModal: () => void;
  className?: string;
  variant?: 'compact' | 'normal';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  onOpenModal,
  className = '',
  variant = 'normal',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  // If already running in standalone PWA mode, don't clutter the header
  if (isInstalled) {
    return (
      <button
        onClick={onOpenModal}
        title="ApexFlipper is running as an installed standalone app"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all ${className}`}
      >
        <Check className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">Installed</span>
      </button>
    );
  }

  // If browser fired beforeinstallprompt, install directly or open guide
  const handleClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        onOpenModal();
      }
    } else {
      onOpenModal();
    }
  };

  return (
    <button
      onClick={handleClick}
      title="Install as App on Phone, Tablet or Desktop (APK / PWA)"
      className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-400/40 ${className}`}
    >
      <Download className="w-3.5 h-3.5 animate-bounce text-blue-200 group-hover:text-white" />
      <span>{variant === 'compact' ? 'Install' : 'Install App'}</span>
      <span className="hidden md:inline px-1 py-0.2 text-[9px] bg-white/20 rounded-md font-mono uppercase tracking-wider">
        APK
      </span>
    </button>
  );
};
