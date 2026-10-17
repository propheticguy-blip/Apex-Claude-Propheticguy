import React, { useMemo } from 'react';
import { Stock, HudSettings, ThemeMode, LiveQuote, CorporateEvents } from '../types/stock';
import { getCompanyDescription } from '../data/companyDescriptions';
import { ShieldCheck, Tag, Star, TrendingUp, TrendingDown, Minus, Rocket, Eye, ZoomIn, ZoomOut, Calendar, Coins, DollarSign } from 'lucide-react';

interface InChartHudProps {
  stock: Stock;
  filteredRank: number;
  totalFiltered: number;
  hudSettings: HudSettings;
  onUpdateHudSettings: (settings: Partial<HudSettings>) => void;
  isBookmarked: boolean;
  onToggleBookmark: (symbol: string) => void;
  themeMode: ThemeMode;
  liveQuote?: LiveQuote | null;
  corporateEvents?: CorporateEvents | null;
  onOpenInfoOptions?: () => void;
}

export const InChartHud: React.FC<InChartHudProps> = ({
  stock,
  filteredRank,
  totalFiltered,
  hudSettings,
  onUpdateHudSettings,
  isBookmarked,
  onToggleBookmark,
  themeMode,
  liveQuote,
  corporateEvents,
  onOpenInfoOptions,
}) => {
  // Determine positioning class for the floating information
  const getPositionClass = () => {
    switch (hudSettings.position) {
      case 'top-center':
        return 'top-8 left-1/2 -translate-x-1/2 items-center text-center';
      case 'bottom-center':
        return 'bottom-16 left-1/2 -translate-x-1/2 items-center text-center';
      case 'top-left':
        return 'top-8 left-8 items-start text-left';
      case 'center':
      default:
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center text-center';
    }
  };

  // Font scale multiplier (default 1.0, scalable from 0.8x up to 2.6x for bedtime viewing)
  const fontScale = hudSettings.fontSizeScale || (
    hudSettings.scale === 'bedtime-max' ? 2.4 :
    hudSettings.scale === 'jumbo' ? 2.0 :
    hudSettings.scale === 'xl' ? 1.6 :
    hudSettings.scale === 'large' ? 1.3 :
    hudSettings.scale === 'compact' ? 0.85 : 1.0
  );

  // Minimalist company description (short sentence or small group of words)
  const companyDescription = useMemo(() => {
    return getCompanyDescription(stock);
  }, [stock]);

  // Dynamic Live Market Cap: Updates in real-time as the live price ticks
  const currentMarketCap = useMemo(() => {
    if (stock.isPrivate) return stock.marketCap;
    if (liveQuote?.marketCap) return liveQuote.marketCap;
    if (liveQuote?.price && stock.marketCapNum > 0) {
      const basePrice = stock.approxPrice || stock.priceApprox || liveQuote.price;
      if (basePrice > 0) {
        const liveCapNum = (stock.marketCapNum * liveQuote.price) / basePrice;
        if (liveCapNum >= 1000) {
          return `$${(liveCapNum / 1000).toFixed(2)} Trillion`;
        }
        return `$${liveCapNum.toFixed(1)} Billion`;
      }
    }
    return stock.marketCap;
  }, [liveQuote?.price, liveQuote?.marketCap, stock.marketCap, stock.marketCapNum, stock.approxPrice, stock.priceApprox, stock.isPrivate]);

  // Text color based on theme
  const getTextColor = () => {
    if (themeMode === 'bedtime-amber') {
      return {
        ticker: '#fef3c7',
        company: '#fde68a',
        description: '#fed7aa',
        accent: '#f59e0b',
        muted: '#d97706',
        glow: 'rgba(245, 158, 11, 0.4)',
      };
    }
    if (themeMode === 'bedtime-oled') {
      return {
        ticker: '#ffffff',
        company: '#f3f4f6',
        description: '#d1d5db',
        accent: '#34d399',
        muted: '#9ca3af',
        glow: 'rgba(0, 0, 0, 0.9)',
      };
    }
    return {
      ticker: '#ffffff',
      company: '#f1f5f9',
      description: '#cbd5e1',
      accent: '#38bdf8',
      muted: '#94a3b8',
      glow: 'rgba(15, 23, 42, 0.8)',
    };
  };

  const colors = getTextColor();

  // Container width scales dynamically with font size
  const maxWidthPx = Math.round(620 * Math.max(1, fontScale * 0.95));

  return (
    <div
      className={`absolute z-20 pointer-events-none select-none flex flex-col transition-all duration-150 ${getPositionClass()}`}
      style={{
        opacity: hudSettings.opacity,
        maxWidth: '94%',
        width: `${maxWidthPx}px`,
      }}
    >
      {/* 
        NO BOX / NO CARD BACKGROUND:
        Pure transparent floating typography with scalable font sizes
      */}
      <div className="flex flex-col items-center justify-center space-y-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
        
        {/* Top Mini Badges: Rank, Exchange, Total Filtered */}
        <div
          className="flex items-center justify-center gap-2 flex-wrap font-mono font-semibold tracking-wider"
          style={{ fontSize: `${Math.round(11.5 * fontScale)}px` }}
        >
          <span
            className="px-2 py-0.5 rounded backdrop-blur-[2px]"
            style={{
              color: colors.accent,
              textShadow: '0 1px 3px rgba(0,0,0,0.9)',
            }}
          >
            RANK #{stock.globalRank}
          </span>
          <span style={{ color: colors.muted }}>•</span>
          <span
            style={{
              color: colors.company,
              textShadow: '0 1px 3px rgba(0,0,0,0.9)',
            }}
          >
            {stock.isPrivate ? 'PRIVATE EQUITY' : stock.exchange}
          </span>
          {totalFiltered > 0 && (
            <>
              <span style={{ color: colors.muted }}>•</span>
              <span
                style={{
                  color: colors.muted,
                  textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                }}
              >
                ({filteredRank} of {totalFiltered})
              </span>
            </>
          )}
        </div>

        {/* Scalable Prominent Ticker Symbol - Pure transparent text */}
        <div className="flex items-center justify-center gap-3">
          <h1
            className="font-black font-mono tracking-tight leading-none"
            style={{
              fontSize: `${Math.round(48 * fontScale)}px`,
              color: colors.ticker,
              textShadow: '0 3px 16px rgba(0,0,0,0.95), 0 0 28px ' + colors.glow,
            }}
          >
            {stock.symbol}
          </h1>

          {/* Interactive Bookmark Star */}
          <button
            onClick={() => onToggleBookmark(stock.symbol)}
            title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist (W)'}
            className="pointer-events-auto p-1.5 rounded-full hover:bg-white/10 active:scale-95 transition-all text-amber-400"
          >
            <Star
              className={`${
                isBookmarked ? 'fill-amber-400' : 'text-slate-400 opacity-60 hover:opacity-100'
              }`}
              style={{
                width: `${Math.round(22 * Math.min(fontScale, 1.4))}px`,
                height: `${Math.round(22 * Math.min(fontScale, 1.4))}px`,
              }}
            />
          </button>
        </div>

        {/* Scalable Company Full Name */}
        <h2
          className="font-bold tracking-tight text-center max-w-full px-2 leading-tight"
          style={{
            fontSize: `${Math.round(21 * fontScale)}px`,
            color: colors.company,
            textShadow: '0 2px 10px rgba(0,0,0,0.95)',
          }}
        >
          {stock.name}
        </h2>

        {/* Minimalist Company Activity / What the Company Does */}
        {hudSettings.showDescription !== false && companyDescription && (
          <p
            className="text-center max-w-2xl px-3 leading-snug font-medium tracking-normal"
            style={{
              fontSize: `${Math.round(13.5 * fontScale)}px`,
              color: colors.description,
              textShadow: '0 2px 8px rgba(0,0,0,0.95)',
            }}
          >
            {companyDescription}
          </p>
        )}

        {/* Live Market Price & Change (Real Yahoo Finance feed or Private Tracker) */}
        {stock.isPrivate ? (
          <div
            className="flex items-center justify-center gap-2 font-mono font-bold pt-0.5"
            style={{ fontSize: `${Math.round(16 * fontScale)}px` }}
          >
            <span className="text-amber-300 flex items-center gap-1.5">
              <Rocket className="w-4 h-4 inline animate-pulse" />
              Private Secondary Valuation Tracker
            </span>
          </div>
        ) : liveQuote && (
          <div
            className="flex items-center justify-center gap-2.5 font-mono font-bold pt-0.5 flex-wrap"
            style={{ fontSize: `${Math.round(17 * fontScale)}px` }}
          >
            <span
              style={{
                color: '#ffffff',
                textShadow: '0 2px 8px rgba(0,0,0,0.95)',
              }}
            >
              ${liveQuote.price.toFixed(2)}
            </span>
            <span
              className={`inline-flex items-center gap-1 font-semibold ${
                Math.abs(liveQuote.change) < 0.005
                  ? 'text-slate-300'
                  : liveQuote.change > 0
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
              style={{ textShadow: '0 2px 6px rgba(0,0,0,0.95)' }}
            >
              {Math.abs(liveQuote.change) < 0.005 ? (
                <Minus
                  style={{
                    width: `${Math.round(14 * fontScale)}px`,
                    height: `${Math.round(14 * fontScale)}px`,
                  }}
                  className="inline"
                />
              ) : liveQuote.change > 0 ? (
                <TrendingUp
                  style={{
                    width: `${Math.round(15 * fontScale)}px`,
                    height: `${Math.round(15 * fontScale)}px`,
                  }}
                  className="inline"
                />
              ) : (
                <TrendingDown
                  style={{
                    width: `${Math.round(15 * fontScale)}px`,
                    height: `${Math.round(15 * fontScale)}px`,
                  }}
                  className="inline"
                />
              )}
              {liveQuote.change > 0.005 ? '+' : ''}
              {liveQuote.change.toFixed(2)} ({liveQuote.changePercent > 0.005 ? '+' : ''}
              {liveQuote.changePercent.toFixed(2)}%)
            </span>
            {liveQuote.dayHigh && liveQuote.dayLow && (
              <span
                className="font-normal opacity-80"
                style={{
                  fontSize: `${Math.round(12 * fontScale)}px`,
                  color: colors.muted,
                  textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                }}
              >
                (H: ${liveQuote.dayHigh.toFixed(2)} · L: ${liveQuote.dayLow.toFixed(2)})
              </span>
            )}
          </div>
        )}

        {/* Live Dynamic Market Cap & Options Tradable Status */}
        <div
          className="flex items-center justify-center gap-3 flex-wrap pt-0.5"
          style={{ fontSize: `${Math.round(14 * fontScale)}px` }}
        >
          <span
            className="font-mono font-bold"
            style={{
              color: '#34d399', // Emerald
              textShadow: '0 2px 8px rgba(0,0,0,0.95)',
            }}
          >
            Market Cap: {currentMarketCap}
          </span>

          <span style={{ color: colors.muted }}>•</span>

          {stock.isPrivate ? (
            <span
              className="font-medium text-amber-300"
              style={{ textShadow: '0 2px 6px rgba(0,0,0,0.95)' }}
            >
              Secondary Tender Market
            </span>
          ) : stock.hasOptions ? (
            <span
              className="inline-flex items-center gap-1 font-semibold"
              style={{
                color: '#38bdf8', // Sky blue
                textShadow: '0 2px 6px rgba(0,0,0,0.95)',
              }}
            >
              <ShieldCheck
                style={{
                  width: `${Math.round(14 * fontScale)}px`,
                  height: `${Math.round(14 * fontScale)}px`,
                }}
                className="inline"
              />
              Options Tradable
            </span>
          ) : (
            <span
              className="font-medium"
              style={{
                color: '#f87171',
                textShadow: '0 2px 6px rgba(0,0,0,0.95)',
              }}
            >
              No Options
            </span>
          )}
        </div>

        {/* Sector and Industry */}
        <div
          className="flex items-center justify-center gap-2 flex-wrap pt-0.5"
          style={{ fontSize: `${Math.round(13 * fontScale)}px` }}
        >
          <span
            className="font-bold uppercase tracking-wider"
            style={{
              color: colors.accent,
              textShadow: '0 2px 6px rgba(0,0,0,0.95)',
            }}
          >
            {stock.sector}
          </span>

          <span style={{ color: colors.muted }}>—</span>

          <span
            className="font-medium"
            style={{
              color: colors.company,
              textShadow: '0 2px 6px rgba(0,0,0,0.95)',
            }}
          >
            {stock.industry}
          </span>
        </div>

        {/* Sub-Industry Badge */}
        {hudSettings.showSubIndustry && stock.subIndustry && (
          <div
            className="flex items-center justify-center gap-1 font-medium pt-0.5 max-w-xl text-center"
            style={{
              fontSize: `${Math.round(11.5 * fontScale)}px`,
              color: colors.muted,
              textShadow: '0 2px 6px rgba(0,0,0,0.95)',
            }}
          >
            <Tag
              style={{
                width: `${Math.round(12 * fontScale)}px`,
                height: `${Math.round(12 * fontScale)}px`,
              }}
              className="shrink-0"
            />
            <span>{stock.subIndustry}</span>
          </div>
        )}

        {/* Corporate Dividend & Earnings Information in Company Info */}
        <div
          className="flex items-center justify-center gap-2 flex-wrap pt-1.5 max-w-2xl px-2"
          style={{ fontSize: `${Math.round(12 * fontScale)}px` }}
        >
          {/* Dividend Information Pill */}
          {corporateEvents && corporateEvents.dividendYield && corporateEvents.dividendYield !== 'None' && corporateEvents.dividendYield !== '0.00%' ? (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 font-semibold backdrop-blur-md shadow-md"
              style={{
                color: '#34d399',
                textShadow: '0 2px 6px rgba(0,0,0,0.95)',
              }}
              title={`Annual Dividend: ${corporateEvents.annualDividend || 'N/A'} · Frequency: ${corporateEvents.payoutFrequency || 'Quarterly'}`}
            >
              <Coins
                style={{
                  width: `${Math.round(13.5 * fontScale)}px`,
                  height: `${Math.round(13.5 * fontScale)}px`,
                }}
                className="shrink-0 text-emerald-400"
              />
              <span>Dividend: <strong>{corporateEvents.dividendYield}</strong></span>
              {corporateEvents.quarterlyDividend && corporateEvents.quarterlyDividend !== '$0.00' && (
                <span className="opacity-90 font-mono text-[11px]">({corporateEvents.quarterlyDividend}/qtr)</span>
              )}
              {corporateEvents.nextExDate && (
                <span className="text-[11px] opacity-80 hidden sm:inline">
                  · Ex-Div: {corporateEvents.nextExDate}
                </span>
              )}
            </div>
          ) : stock.dividendYield && stock.dividendYield !== 'N/A' && stock.dividendYield !== '-' && stock.dividendYield !== '0.00%' ? (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 font-semibold backdrop-blur-md shadow-md"
              style={{
                color: '#34d399',
                textShadow: '0 2px 6px rgba(0,0,0,0.95)',
              }}
            >
              <Coins
                style={{
                  width: `${Math.round(13.5 * fontScale)}px`,
                  height: `${Math.round(13.5 * fontScale)}px`,
                }}
                className="shrink-0 text-emerald-400"
              />
              <span>Dividend: <strong>{stock.dividendYield}</strong></span>
              {stock.dividendRate && (
                <span className="opacity-90 font-mono text-[11px]">({stock.dividendRate}/yr)</span>
              )}
            </div>
          ) : !stock.isPrivate && !stock.symbol.includes('USD') && stock.sector !== 'Cryptocurrencies' ? (
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 font-medium backdrop-blur-sm"
              style={{
                color: colors.muted,
                textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                fontSize: `${Math.round(11 * fontScale)}px`,
              }}
              title="Company does not currently pay cash dividends (reinvests 100% of capital for business expansion)"
            >
              <DollarSign
                style={{
                  width: `${Math.round(12 * fontScale)}px`,
                  height: `${Math.round(12 * fontScale)}px`,
                }}
                className="shrink-0 opacity-50"
              />
              <span>Dividend: <strong>Non-Payer</strong> (Reinvestment)</span>
            </div>
          ) : null}

          {/* Earnings Date Badge */}
          {corporateEvents?.nextEarningsDate && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/35 font-semibold backdrop-blur-md shadow-md"
              style={{
                color: '#c084fc',
                textShadow: '0 2px 6px rgba(0,0,0,0.95)',
              }}
              title={corporateEvents.nextEarningsAnnouncement || `Upcoming Earnings on ${corporateEvents.nextEarningsDate}`}
            >
              <Calendar
                style={{
                  width: `${Math.round(13.5 * fontScale)}px`,
                  height: `${Math.round(13.5 * fontScale)}px`,
                }}
                className="shrink-0 text-violet-400"
              />
              <span>Earnings: <strong>{corporateEvents.nextEarningsDate}</strong></span>
              {corporateEvents.nextEarningsTime && (
                <span className="text-[10px] px-1 py-0.2 rounded bg-violet-500/25 text-violet-200 border border-violet-400/30 font-mono">
                  {corporateEvents.nextEarningsTime}
                </span>
              )}
              {corporateEvents.nextEarningsEPS && (
                <span className="opacity-85 font-mono text-[11px] hidden sm:inline">
                  (Est: {corporateEvents.nextEarningsEPS})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Interactive Text Size Pill (allows quick resizing to make text larger) */}
        <div className="pointer-events-auto flex items-center justify-center gap-1.5 pt-2 opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 border border-white/20 backdrop-blur-md shadow-lg text-[11px] font-mono">
            <button
              onClick={() => {
                const newScale = Math.max(0.8, Number((fontScale - 0.15).toFixed(2)));
                onUpdateHudSettings({ fontSizeScale: newScale });
              }}
              title="Decrease text size (-)"
              className="px-1.5 py-0.5 rounded hover:bg-white/20 text-slate-300 hover:text-white font-bold transition-colors"
            >
              A-
            </button>
            <span className="text-cyan-400 font-bold px-1 select-none">
              Size: {Math.round(fontScale * 100)}%
            </span>
            <button
              onClick={() => {
                const newScale = Math.min(2.6, Number((fontScale + 0.15).toFixed(2)));
                onUpdateHudSettings({ fontSizeScale: newScale });
              }}
              title="Increase text size (+)"
              className="px-1.5 py-0.5 rounded hover:bg-white/20 text-cyan-300 hover:text-cyan-100 font-bold transition-colors"
            >
              A+
            </button>
            <span className="text-white/20 px-0.5">|</span>
            <button
              onClick={() => {
                const nextScale = fontScale >= 1.8 ? 1.0 : fontScale >= 1.4 ? 1.8 : 1.4;
                onUpdateHudSettings({ fontSizeScale: nextScale });
              }}
              title="Toggle Large / Jumbo size"
              className="text-[10px] text-slate-300 hover:text-white px-1 font-sans font-semibold"
            >
              {fontScale >= 1.8 ? 'Reset' : 'Enlarge'}
            </button>
            {onOpenInfoOptions && (
              <>
                <span className="text-white/20 px-0.5">|</span>
                <button
                  onClick={onOpenInfoOptions}
                  title="Open In-Chart Company Information Options (Transparency, Size, Fields, Placement)"
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 px-1 font-sans font-semibold flex items-center gap-1 hover:underline"
                >
                  <Eye className="w-3 h-3 text-blue-400" />
                  <span>Options</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
