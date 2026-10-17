import React from 'react';
import {
  STOCK_SECTORS,
  ETF_SECTOR,
  CRYPTO_SECTOR,
  AssetCategory,
  getIndustriesForSector,
  STOCKS_DATA,
} from '../data/stocksData';
import { ThemeMode } from '../types/stock';
import {
  CheckSquare,
  Square,
  Search,
  RotateCcw,
  Layers,
  Building2,
  Star,
  Coins,
  PieChart,
  Briefcase,
  Hand,
} from 'lucide-react';

interface FilterBarProps {
  selectedSector: string;
  onSelectSector: (sector: string) => void;
  selectedIndustry: string;
  onSelectIndustry: (industry: string) => void;
  optionsOnly: boolean;
  onToggleOptionsOnly: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  bookmarksOnly: boolean;
  onToggleBookmarksOnly: () => void;
  totalFiltered: number;
  totalAvailable: number;
  onResetFilters: () => void;
  themeMode: ThemeMode;
  onOpenEconomicSection?: () => void;
  assetCategory: AssetCategory;
  onSelectAssetCategory: (category: AssetCategory) => void;
  isTabletMode?: boolean;
  onToggleTabletMode?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedSector,
  onSelectSector,
  selectedIndustry,
  onSelectIndustry,
  optionsOnly,
  onToggleOptionsOnly,
  searchQuery,
  onSearchChange,
  bookmarksOnly,
  onToggleBookmarksOnly,
  totalFiltered,
  totalAvailable,
  onResetFilters,
  themeMode,
  onOpenEconomicSection,
  assetCategory,
  onSelectAssetCategory,
  isTabletMode,
  onToggleTabletMode,
}) => {
  const industries = getIndustriesForSector(selectedSector, assetCategory);

  // Sector stock count helper
  const getSectorCount = (sec: string) => {
    return STOCKS_DATA.filter((s) => s.sector === sec).length;
  };

  // Asset class total counts
  const totalStockCount = STOCKS_DATA.filter(
    (s) => s.sector !== CRYPTO_SECTOR && s.sector !== ETF_SECTOR
  ).length; // ~1,943 corporate stocks
  const totalEtfCount = STOCKS_DATA.filter((s) => s.sector === ETF_SECTOR).length; // ~114 ETFs
  const totalCryptoCount = STOCKS_DATA.filter((s) => s.sector === CRYPTO_SECTOR).length; // ~52 Crypto

  const isFiltered =
    selectedSector !== 'ALL' ||
    selectedIndustry !== 'ALL' ||
    optionsOnly ||
    bookmarksOnly ||
    searchQuery.trim().length > 0;

  // Short labels for quick sector tabs
  const getShortSectorName = (sec: string) => {
    switch (sec) {
      case 'Information Technology':
        return 'Tech';
      case 'Consumer Discretionary':
        return 'Discretionary';
      case 'Consumer Staples':
        return 'Staples';
      case 'Communication Services':
        return 'Comm Services';
      case 'Health Care':
        return 'Health Care';
      case 'Cryptocurrencies':
        return 'Crypto';
      case 'ETFs':
        return 'ETFs';
      default:
        return sec;
    }
  };

  return (
    <div
      className={`px-4 py-2 border-b z-20 text-xs transition-colors select-none ${
        themeMode === 'bedtime-amber'
          ? 'bg-[#18120a] border-amber-900/40 text-amber-200'
          : themeMode === 'bedtime-oled'
          ? 'bg-black border-neutral-900 text-neutral-300'
          : 'bg-slate-900 border-slate-800 text-slate-300'
      }`}
    >
      {/* Top Filter Row: Asset Category Switcher, Sector dropdown, Industry, Options Checkbox, Search & Count */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-[280px]">
          {/* 1. SEPARATED ASSET CLASS TABS (User request: separate Cryptocurrencies and ETFs from Stocks) */}
          <div className="flex items-center rounded-lg bg-black/40 border border-white/15 p-0.5 shadow-inner">
            <button
              onClick={() => {
                onSelectAssetCategory('stocks');
                onSelectSector('ALL');
                onSelectIndustry('ALL');
              }}
              title="Corporate Equities across 11 sectors (ETFs & Crypto separated out)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                assetCategory === 'stocks'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Stocks ({totalStockCount})</span>
            </button>

            <button
              onClick={() => {
                onSelectAssetCategory('etfs');
                onSelectSector(ETF_SECTOR);
                onSelectIndustry('ALL');
              }}
              title="Exchange Traded Funds (ETFs) separated from company stocks"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                assetCategory === 'etfs'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>ETFs ({totalEtfCount})</span>
            </button>

            <button
              onClick={() => {
                onSelectAssetCategory('crypto');
                onSelectSector(CRYPTO_SECTOR);
                onSelectIndustry('ALL');
              }}
              title="Cryptocurrencies & Digital Assets separated from company stocks"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                assetCategory === 'crypto'
                  ? 'bg-amber-600 text-slate-950 shadow-sm font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Crypto ({totalCryptoCount})</span>
            </button>
          </div>

          <div className="h-4 w-px bg-white/20 hidden sm:block mx-0.5" />

          {/* Sector Selector Dropdown */}
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="font-semibold text-slate-400 hidden sm:inline">Sector:</span>
            <select
              value={selectedSector}
              onChange={(e) => {
                const val = e.target.value;
                if (val === ETF_SECTOR) {
                  onSelectAssetCategory('etfs');
                } else if (val === CRYPTO_SECTOR) {
                  onSelectAssetCategory('crypto');
                } else {
                  onSelectAssetCategory('stocks');
                }
                onSelectSector(val);
                onSelectIndustry('ALL');
              }}
              className="bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              <optgroup label="🏢 Corporate Stock Sectors (Pure Equities)">
                <option value="ALL">All Stock Sectors ({totalStockCount})</option>
                {STOCK_SECTORS.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector} ({getSectorCount(sector)})
                  </option>
                ))}
              </optgroup>

              <optgroup label="📊 Separated Asset Classes">
                <option value={ETF_SECTOR}>ETFs ({totalEtfCount})</option>
                <option value={CRYPTO_SECTOR}>Cryptocurrencies ({totalCryptoCount})</option>
              </optgroup>
            </select>
          </div>

          {/* Industry Selector Dropdown */}
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-semibold text-slate-400 hidden sm:inline">Sub-Industry:</span>
            <select
              value={selectedIndustry}
              onChange={(e) => onSelectIndustry(e.target.value)}
              className="bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-blue-400 cursor-pointer max-w-[190px] truncate"
            >
              <option value="ALL">
                {selectedSector !== 'ALL'
                  ? `All ${selectedSector} (${getSectorCount(selectedSector)})`
                  : assetCategory === 'stocks'
                  ? `All Stock Sub-Industries (${industries.length})`
                  : `All Sub-Categories (${industries.length})`}
              </option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Options Tradable Only Checkbox (Relevant primarily to equities and ETFs) */}
          {assetCategory !== 'crypto' && (
            <label className="flex items-center gap-1.5 cursor-pointer px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
              <input
                type="checkbox"
                checked={optionsOnly}
                onChange={onToggleOptionsOnly}
                className="hidden"
              />
              {optionsOnly ? (
                <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-500 shrink-0" />
              )}
              <span className={`font-semibold ${optionsOnly ? 'text-emerald-300' : 'text-slate-300'}`}>
                Options Only
              </span>
            </label>
          )}

          {/* Watchlist toggle */}
          <button
            onClick={onToggleBookmarksOnly}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
              bookmarksOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                bookmarksOnly ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
              }`}
            />
            <span className="font-semibold">Watchlist</span>
          </button>

          {/* Android Tablet Manual Mode Quick Toggle */}
          {onToggleTabletMode && (
            <button
              onClick={onToggleTabletMode}
              title="Toggle Tablet Right-Thumb Manual Mode: Hold your tablet and use your right thumb to flip forward or back"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all ${
                isTabletMode
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/60 shadow-sm font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
            >
              <Hand className={`w-3.5 h-3.5 ${isTabletMode ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden md:inline">Tablet Thumb Mode:</span>
              <strong className={isTabletMode ? 'text-emerald-300' : 'text-slate-400'}>
                {isTabletMode ? 'ON' : 'OFF'}
              </strong>
            </button>
          )}
        </div>

        {/* Right side: Search Box, Filter Count & Reset */}
        <div className="flex items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter ticker / name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 pr-3 py-1.5 w-32 sm:w-40 bg-black/50 border border-white/15 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-400 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Active Filter Counter */}
          <div className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 shrink-0">
            <span className="text-emerald-400 font-bold">{totalFiltered}</span>
            <span className="text-slate-400">
              /{assetCategory === 'stocks' ? totalStockCount : assetCategory === 'etfs' ? totalEtfCount : totalCryptoCount}{' '}
              {assetCategory === 'stocks' ? 'Stocks' : assetCategory === 'etfs' ? 'ETFs' : 'Crypto'}
            </span>
          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              title="Reset all filters"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sector Pill Carousel: Clearly separated stock sectors from ETFs and Cryptocurrencies */}
      <div className="flex items-center gap-1.5 pt-2 overflow-x-auto no-scrollbar pb-0.5">
        {assetCategory === 'stocks' ? (
          <>
            {/* All Stock Sectors Button (Pure Equities, Zero Crypto, Zero ETFs) */}
            <button
              onClick={() => {
                onSelectSector('ALL');
                onSelectIndustry('ALL');
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-all ${
                selectedSector === 'ALL'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              All Stock Sectors ({totalStockCount})
            </button>

            {/* 11 Corporate Stock Sectors */}
            {STOCK_SECTORS.map((sector) => {
              const isSelected = selectedSector === sector;
              const count = getSectorCount(sector);
              return (
                <button
                  key={sector}
                  onClick={() => {
                    onSelectSector(sector);
                    onSelectIndustry('ALL');
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 font-bold shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }`}
                >
                  <span>{getShortSectorName(sector)}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-emerald-300' : 'text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}

            <div className="h-4 w-px bg-white/20 shrink-0 mx-1" />

            {/* Separated Asset Class Quick Launchers */}
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider shrink-0 hidden sm:inline">
              Separated:
            </span>

            <button
              onClick={() => {
                onSelectAssetCategory('etfs');
                onSelectSector(ETF_SECTOR);
                onSelectIndustry('ALL');
              }}
              title="Switch to separated ETFs view"
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 border border-emerald-600/40 shrink-0 transition-all flex items-center gap-1"
            >
              <PieChart className="w-3 h-3 text-emerald-400" />
              <span>ETFs</span>
              <span className="text-[10px] text-emerald-400 font-mono">({totalEtfCount})</span>
            </button>

            <button
              onClick={() => {
                onSelectAssetCategory('crypto');
                onSelectSector(CRYPTO_SECTOR);
                onSelectIndustry('ALL');
              }}
              title="Switch to separated Cryptocurrencies view"
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 border border-amber-600/40 shrink-0 transition-all flex items-center gap-1"
            >
              <Coins className="w-3 h-3 text-amber-400" />
              <span>Crypto</span>
              <span className="text-[10px] text-amber-400 font-mono">({totalCryptoCount})</span>
            </button>
          </>
        ) : assetCategory === 'etfs' ? (
          /* When in ETF Mode */
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-emerald-400" />
              <span>Exchange Traded Funds ({totalEtfCount} ETFs) · Separated from Corporate Stocks</span>
            </div>
            <button
              onClick={() => {
                onSelectAssetCategory('stocks');
                onSelectSector('ALL');
                onSelectIndustry('ALL');
              }}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
            >
              ← Back to Corporate Stocks
            </button>
          </div>
        ) : (
          /* When in Crypto Mode */
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-600/30 text-amber-300 border border-amber-500/50 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Cryptocurrencies & Digital Assets ({totalCryptoCount} Coins) · Separated from Corporate Stocks</span>
            </div>
            <button
              onClick={() => {
                onSelectAssetCategory('stocks');
                onSelectSector('ALL');
                onSelectIndustry('ALL');
              }}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
            >
              ← Back to Corporate Stocks
            </button>
          </div>
        )}

        {onOpenEconomicSection && (
          <button
            onClick={onOpenEconomicSection}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/40 border border-indigo-500/40 shrink-0 transition-all flex items-center gap-1 shadow-sm ml-auto"
            title="Open US Macroeconomic Indicators Flipper"
          >
            <span>Macro Economics</span>
            <span className="text-[10px] bg-indigo-500/30 px-1.5 py-0.2 rounded-full text-indigo-200">
              187
            </span>
          </button>
        )}

        {/* Rapid Cycle to Next Stock Sector */}
        {assetCategory === 'stocks' && (
          <button
            onClick={() => {
              const sectors = ['ALL', ...STOCK_SECTORS];
              const currIdx = sectors.indexOf(selectedSector);
              const nextIdx = (currIdx + 1) % sectors.length;
              onSelectSector(sectors[nextIdx]);
              onSelectIndustry('ALL');
            }}
            title="Cycle to next equity sector (Shortcut: S)"
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-emerald-300 shrink-0 transition-all flex items-center gap-1 font-mono"
          >
            <span>Next Sector (S) →</span>
          </button>
        )}
      </div>
    </div>
  );
};
