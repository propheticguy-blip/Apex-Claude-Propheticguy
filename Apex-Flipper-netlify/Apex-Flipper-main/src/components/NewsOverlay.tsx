import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Stock, ThemeMode, NewsArticle, StockNewsData } from '../types/stock';
import {
  Newspaper,
  RefreshCw,
  X,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
  Copy,
  Check,
  Globe2,
  Clock,
  ShieldCheck,
  Share2,
} from 'lucide-react';

interface NewsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  stock: Stock | null;
  themeMode: ThemeMode;
  onNextStock?: () => void;
  onPrevStock?: () => void;
  stockPositionText?: string; // e.g. "1 of 314"
}

export const NewsOverlay: React.FC<NewsOverlayProps> = ({
  isOpen,
  onClose,
  stock,
  themeMode,
  onNextStock,
  onPrevStock,
  stockPositionText,
}) => {
  const [newsData, setNewsData] = useState<StockNewsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sentimentFilter, setSentimentFilter] = useState<'ALL' | 'bullish' | 'bearish' | 'neutral'>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch news for currently displayed stock
  const fetchNews = useCallback(async (symbol: string, name: string, isManualRefresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const nocacheParam = isManualRefresh ? '&nocache=1' : '';
      const url = `/api/news/${encodeURIComponent(symbol)}?name=${encodeURIComponent(name)}${nocacheParam}`;
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(`Failed to load news (HTTP ${resp.status})`);
      }
      const data: StockNewsData = await resp.json();
      setNewsData(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to retrieve headlines for this symbol.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch whenever the active stock changes (or when overlay opens)
  useEffect(() => {
    if (isOpen && stock?.symbol) {
      fetchNews(stock.symbol, stock.name);
    }
  }, [isOpen, stock?.symbol, stock?.name, fetchNews]);

  // Copy headline handler
  const handleCopyHeadline = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    }).catch(() => {});
  };

  // Keyboard navigation within the news panel
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'r' || e.key === 'R') {
        if (stock?.symbol) {
          e.preventDefault();
          fetchNews(stock.symbol, stock.name, true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, stock, fetchNews]);

  // Filtered articles list
  const filteredArticles = useMemo(() => {
    if (!newsData?.articles) return [];
    return newsData.articles.filter((art) => {
      if (sentimentFilter !== 'ALL' && art.sentiment !== sentimentFilter) {
        return false;
      }
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase().trim();
        const matchTitle = art.title.toLowerCase().includes(q);
        const matchSource = art.source.toLowerCase().includes(q);
        const matchSummary = (art.summary || '').toLowerCase().includes(q);
        if (!matchTitle && !matchSource && !matchSummary) return false;
      }
      return true;
    });
  }, [newsData?.articles, sentimentFilter, searchFilter]);

  if (!isOpen) return null;

  // Theme styling helpers
  const getPanelBg = () => {
    if (themeMode === 'bedtime-amber') {
      return 'bg-[#181109] text-amber-100 border-amber-900/50';
    }
    if (themeMode === 'bedtime-oled') {
      return 'bg-black text-neutral-100 border-neutral-900';
    }
    return 'bg-slate-950 text-slate-100 border-slate-800';
  };

  const getCardBg = () => {
    if (themeMode === 'bedtime-amber') {
      return 'bg-[#22170b]/90 border-amber-800/40 hover:border-amber-700/60';
    }
    if (themeMode === 'bedtime-oled') {
      return 'bg-neutral-950 border-neutral-800/80 hover:border-neutral-700';
    }
    return 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700';
  };

  const getBriefingBg = () => {
    if (themeMode === 'bedtime-amber') {
      return 'bg-amber-950/30 border-amber-800/50 text-amber-200';
    }
    if (themeMode === 'bedtime-oled') {
      return 'bg-neutral-900/40 border-neutral-800 text-neutral-200';
    }
    return 'bg-blue-950/30 border-blue-500/30 text-blue-100';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Side Panel Drawer */}
      <aside
        className={`absolute top-0 right-0 h-full w-full sm:w-[480px] md:w-[540px] shadow-2xl flex flex-col border-l transition-transform duration-300 ease-in-out ${getPanelBg()}`}
        role="dialog"
        aria-label="Stock News Intelligence Panel"
      >
        {/* Top Header */}
        <header className="px-5 py-3.5 border-b flex items-center justify-between gap-3 shrink-0 select-none bg-black/20">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-md">
              <Newspaper className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                  Live News Intelligence
                </h2>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Search-Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Real-time market headlines for {stock?.symbol || 'Active Asset'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => stock && fetchNews(stock.symbol, stock.name, true)}
              disabled={isLoading}
              title="Refresh latest headlines (R)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              title="Close News Panel (Esc)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Current Stock Banner & Navigation Flipper Row */}
        {stock && (
          <div className="px-5 py-2.5 border-b bg-white/5 flex items-center justify-between gap-3 shrink-0 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-black font-mono text-sm tracking-wide text-white bg-blue-600/30 px-2 py-0.5 rounded border border-blue-500/40">
                {stock.symbol}
              </span>
              <span className="font-semibold text-slate-200 truncate">
                {stock.name}
              </span>
              <span className="text-[11px] font-mono text-slate-400 shrink-0">
                ({stock.marketCap})
              </span>
            </div>

            {/* Quick stock flipper navigation inside panel */}
            {(onPrevStock || onNextStock) && (
              <div className="flex items-center gap-1 shrink-0">
                {stockPositionText && (
                  <span className="text-[10px] font-mono text-slate-400 mr-1 hidden sm:inline">
                    {stockPositionText}
                  </span>
                )}
                {onPrevStock && (
                  <button
                    onClick={onPrevStock}
                    title="Previous Stock (Left Arrow)"
                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                )}
                {onNextStock && (
                  <button
                    onClick={onNextStock}
                    title="Next Stock (Right Arrow)"
                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Sentiment Filter Pills & Quick Search Row */}
        <div className="px-5 py-2.5 border-b flex items-center justify-between gap-2 shrink-0 text-xs bg-black/10">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {(['ALL', 'bullish', 'bearish', 'neutral'] as const).map((s) => {
              const isSelected = sentimentFilter === s;
              const count =
                s === 'ALL'
                  ? newsData?.articles?.length || 0
                  : newsData?.articles?.filter((a) => a.sentiment === s).length || 0;

              return (
                <button
                  key={s}
                  onClick={() => setSentimentFilter(s)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 flex items-center gap-1 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {s === 'bullish' ? (
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                  ) : s === 'bearish' ? (
                    <TrendingDown className="w-3 h-3 text-amber-400" />
                  ) : s === 'neutral' ? (
                    <Minus className="w-3 h-3 text-slate-400" />
                  ) : null}
                  <span className="capitalize">{s}</span>
                  <span className="text-[9px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Quick search input */}
          <div className="relative shrink-0 w-32 sm:w-40">
            <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter news..."
              className="w-full pl-6 pr-2 py-1 text-[11px] rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
          {/* Loading Skeleton */}
          {isLoading && !newsData && (
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 animate-pulse space-y-2">
                <div className="h-3.5 bg-white/15 rounded w-1/3" />
                <div className="h-2.5 bg-white/10 rounded w-full" />
                <div className="h-2.5 bg-white/10 rounded w-4/5" />
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/10 animate-pulse space-y-2"
                >
                  <div className="flex justify-between">
                    <div className="h-2.5 bg-white/15 rounded w-20" />
                    <div className="h-2.5 bg-white/10 rounded w-12" />
                  </div>
                  <div className="h-3.5 bg-white/20 rounded w-5/6" />
                  <div className="h-2.5 bg-white/10 rounded w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Error Notice */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-300">
                <span>Headline Retrieval Notice</span>
              </div>
              <p>{error}</p>
              <button
                onClick={() => stock && fetchNews(stock.symbol, stock.name, true)}
                className="px-3 py-1 bg-rose-600/40 hover:bg-rose-600 text-white rounded font-medium transition-colors"
              >
                Retry Search
              </button>
            </div>
          )}

          {/* AI Search-Grounded Executive Briefing Box */}
          {newsData?.summary && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2.5 shadow-sm ${getBriefingBg()}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-cyan-300 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Search-Grounded Intelligence Briefing</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                  {newsData.groundedSource === 'gemini-search' ? 'Gemini AI Search' : 'Real-Time Market Wire'}
                </span>
              </div>
              <div className="text-slate-200 whitespace-pre-line text-xs font-normal">
                {newsData.summary}
              </div>

              {/* Grounded Web Citations */}
              {newsData.groundingSources && newsData.groundingSources.length > 0 && (
                <div className="pt-2 border-t border-white/10">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
                    <Globe2 className="w-3 h-3 text-cyan-400" /> Grounded Source Citations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {newsData.groundingSources.slice(0, 5).map((src, i) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-white/10 hover:bg-white/20 text-cyan-200 border border-white/10 transition-colors max-w-[200px] truncate"
                        title={src.title}
                      >
                        <span className="truncate">{src.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Articles Feed */}
          {filteredArticles.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
                <span>Latest Headlines ({filteredArticles.length})</span>
                {newsData?.lastFetched && (
                  <span className="font-mono text-[10px]">
                    Updated {new Date(newsData.lastFetched).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>

              {filteredArticles.map((article) => {
                const isCopied = copiedId === article.id;
                return (
                  <article
                    key={article.id}
                    className={`p-3.5 rounded-xl border transition-all duration-150 flex flex-col justify-between gap-2.5 group ${getCardBg()}`}
                  >
                    {/* Meta row: Publisher, Relative Time, Sentiment */}
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-slate-200 truncate px-2 py-0.5 rounded bg-white/5 border border-white/5">
                          {article.source}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Clock className="w-3 h-3" />
                          {article.relativeTime}
                        </span>
                      </div>

                      {/* Sentiment Badge */}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 shrink-0 ${
                          article.sentiment === 'bullish'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : article.sentiment === 'bearish'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {article.sentiment === 'bullish' && <TrendingUp className="w-2.5 h-2.5" />}
                        {article.sentiment === 'bearish' && <TrendingDown className="w-2.5 h-2.5" />}
                        {article.sentiment === 'neutral' && <Minus className="w-2.5 h-2.5" />}
                        <span className="capitalize">{article.sentiment}</span>
                      </span>
                    </div>

                    {/* Title Link */}
                    <div className="flex items-start justify-between gap-3">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-xs sm:text-sm text-white group-hover:text-blue-300 transition-colors leading-snug flex-1"
                      >
                        {article.title}
                      </a>
                      {article.imageUrl && (
                        <img
                          src={article.imageUrl}
                          alt=""
                          className="w-14 h-14 rounded-lg object-cover shrink-0 bg-white/5 border border-white/10"
                          loading="lazy"
                        />
                      )}
                    </div>

                    {/* Summary Snippet if available */}
                    {article.summary && (
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                        {article.summary}
                      </p>
                    )}

                    {/* Bottom Actions Bar */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => handleCopyHeadline(article.id, `${article.title} - ${article.source} (${article.url})`)}
                        className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                        title="Copy headline & link"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold group/link"
                      >
                        <span>Read Story</span>
                        <ExternalLink className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            !isLoading && (
              <div className="text-center py-12 px-4 space-y-2">
                <Newspaper className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="font-bold text-sm text-slate-200">No headlines found</h4>
                <p className="text-xs text-slate-400">
                  {searchFilter
                    ? 'No articles match your current search query.'
                    : `No recent news articles detected for ${stock?.symbol || 'this symbol'}.`}
                </p>
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter('')}
                    className="text-xs text-blue-400 hover:underline pt-2 font-medium"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            )
          )}
        </div>

        {/* Bottom Footer Info */}
        <footer className="px-5 py-3 border-t bg-black/40 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Search-Grounded Intelligence Engine</span>
          </div>
          <span className="font-mono text-[10px]">
            Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-slate-300">Esc</kbd> or <kbd className="px-1 py-0.5 bg-white/10 rounded text-slate-300">N</kbd>
          </span>
        </footer>
      </aside>
    </div>
  );
};
