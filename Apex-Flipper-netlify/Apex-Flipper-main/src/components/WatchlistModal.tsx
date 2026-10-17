import React from 'react';
import { Stock, ThemeMode } from '../types/stock';
import { Star, X, Download, Copy, Trash2, ExternalLink, ArrowRight } from 'lucide-react';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedStocks: Stock[];
  onRemoveBookmark: (symbol: string) => void;
  onSelectStock: (symbol: string) => void;
  onClearAll: () => void;
  themeMode: ThemeMode;
}

export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  isOpen,
  onClose,
  bookmarkedStocks,
  onRemoveBookmark,
  onSelectStock,
  onClearAll,
  themeMode,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyTickers = () => {
    const list = bookmarkedStocks.map((s) => s.symbol).join(', ');
    navigator.clipboard.writeText(list);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const headers = 'Rank,Symbol,Company,MarketCap,Sector,Industry,SubIndustry,Exchange,HasOptions\n';
    const rows = bookmarkedStocks
      .map(
        (s) =>
          `${s.globalRank},"${s.symbol}","${s.name}","${s.marketCap}","${s.sector}","${s.industry}","${s.subIndustry}","${s.exchange}",${s.hasOptions}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ApexFlipper_Watchlist_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200 select-none max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Flagged Watchlist
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {bookmarkedStocks.length} Stocks
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Saved charts during flipping session. Export or copy to any broker or spreadsheet.
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

        {/* Action Toolbar */}
        {bookmarkedStocks.length > 0 && (
          <div className="px-5 py-2.5 bg-black/20 border-b border-white/10 flex items-center justify-between gap-2 flex-wrap text-xs shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyTickers}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors font-semibold"
              >
                <Copy className="w-3.5 h-3.5 text-blue-400" />
                {copied ? 'Copied to Clipboard!' : 'Copy Tickers'}
              </button>

              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors font-semibold"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                Export CSV / Spreadsheet
              </button>
            </div>

            <button
              onClick={onClearAll}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Watchlist
            </button>
          </div>
        )}

        {/* Stock List Scroll area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {bookmarkedStocks.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Star className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
              <p className="text-sm font-semibold">No stocks bookmarked yet</p>
              <p className="text-xs text-slate-500">
                Press <span className="font-mono text-amber-400 font-bold">W</span> or click the Star icon on any chart to save stocks here while flipping.
              </p>
            </div>
          ) : (
            bookmarkedStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
              >
                <div
                  onClick={() => {
                    onSelectStock(stock.symbol);
                    onClose();
                  }}
                  className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                >
                  <span className="font-mono text-xs font-bold text-slate-400 w-8 shrink-0">
                    #{stock.globalRank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-white group-hover:text-blue-400 transition-colors">
                        {stock.symbol}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        {stock.marketCap}
                      </span>
                      {stock.hasOptions && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                          OPTIONS
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 truncate">{stock.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {stock.sector} · {stock.industry}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectStock(stock.symbol);
                      onClose();
                    }}
                    title="Jump to this chart"
                    className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onRemoveBookmark(stock.symbol)}
                    title="Remove from Watchlist"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-black/40 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
