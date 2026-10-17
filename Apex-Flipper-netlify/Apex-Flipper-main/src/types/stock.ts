export interface Stock {
  symbol: string;
  name: string;
  marketCap: string;
  marketCapNum: number; // In Billions USD for accurate sorting
  sharesInBillions?: number; // For live dynamic market cap calculation
  sector: string;
  industry: string;
  subIndustry: string;
  exchange: 'NASDAQ' | 'NYSE' | 'PRIVATE' | 'CRYPTO' | 'ARCA' | 'BATS' | 'AMEX' | string;
  hasOptions: boolean;
  globalRank: number;
  peRatio?: number | string;
  dividendYield?: string;
  dividendRate?: string; // Annual dividend payout e.g. "$1.08"
  dividendAmount?: number; // Per-quarter or latest cash dividend e.g. 0.27
  nextEarningsDate?: string; // e.g. "Nov 02, 2026"
  nextDividendDate?: string; // e.g. "Aug 10, 2026"
  payoutFrequency?: string; // "Quarterly" | "Monthly" | "Annual"
  approxPrice?: number;
  priceApprox?: number;
  price?: number;
  dayChange?: number;
  summary?: string;
  description?: string;
  isPrivate?: boolean;
}

export interface EarningsEvent {
  date: string;
  timestamp: number; // Unix seconds
  isUpcoming?: boolean;
  announcement?: string;
  reportText?: string;
  consensusEPS?: string;
  timeOfDay?: 'BMO' | 'AMC' | 'During Market';
  fiscalQuarter?: string;
  estimatedEPS?: number;
  actualEPS?: number;
}

export interface DividendEvent {
  date: string;
  timestamp: number; // Unix seconds
  amount: number;
  isUpcoming?: boolean;
  paymentDate?: string;
  declarationDate?: string;
  recordDate?: string;
  yield?: string;
  frequency?: string;
}

export interface CorporateEvents {
  symbol: string;
  earnings: EarningsEvent[];
  dividends: DividendEvent[];
  dividendYield?: string;
  annualDividend?: string;
  quarterlyDividend?: string;
  payoutFrequency?: string;
  nextEarningsDate?: string;
  nextEarningsTime?: string;
  nextEarningsEPS?: string;
  nextEarningsAnnouncement?: string;
  nextExDate?: string;
  nextPaymentDate?: string;
  lastExDate?: string;
  lastDividendAmount?: number;
}

export type ThemeMode = 'midnight-dark' | 'bedtime-amber' | 'bedtime-oled';

export interface HudSettings {
  opacity: number; // 0.1 to 1.0
  position: 'center' | 'top-center' | 'bottom-center' | 'top-left';
  showDescription?: boolean;
  showSubIndustry: boolean;
  showMarketCap: boolean;
  showOptionsBadge: boolean;
  blurBackground: boolean;
  scale: 'compact' | 'normal' | 'large' | 'xl' | 'jumbo' | 'bedtime-max';
  fontSizeScale: number; // 0.8 to 2.6 for customizable text size
}

export interface TimerSettings {
  seconds: number;
  isPlaying: boolean;
  pauseOnHover: boolean;
  soundEnabled: boolean;
  loopBackToStart: boolean;
  autoReadOnFlip?: boolean; // Synchronize AI voice narration with chart auto-flipper
  postNarrationPauseSec?: number; // Absorption pause in seconds after narration finishes before flipping
}

export interface NightModeSettings {
  mode: ThemeMode;
  brightness: number; // 0.4 to 1.0
  warmth: number; // 0 to 100% amber filter
  sleepTimerMinutes: number | null; // e.g. 15, 30, 45, 60 or null
}

export interface LiveQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  prevClose?: number;
  dayHigh?: number;
  dayLow?: number;
  volume?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  timestamp?: number;
  marketCap?: string;
  marketCapNum?: number;
  isPrivate?: boolean;
}

export interface AssetClassImpact {
  equities: string;
  bonds: string;
  currencies: string;
  commodities?: string;
}

export interface EconomicIndicator {
  id: string;
  name: string;
  shortName: string;
  category: string;
  region?: string;
  countryCode?: string;
  currentValue: string;
  numericValue?: number;
  unit: string;
  frequency: string;
  latestPeriod: string;
  priorValue: string;
  consensusEstimate?: string;
  historicalRange?: string;
  description: string;
  significance: string;
  source: string;
  trend: 'up' | 'down' | 'neutral';
  impact: 'positive' | 'negative' | 'neutral';
  sparklineData?: number[];
  liveSymbol?: string;
  lastUpdated?: string;

  // Enriched analytical details
  indicatorType?: 'Leading' | 'Coincident' | 'Lagging';
  marketSensitivity?: 'High' | 'Medium' | 'Low';
  assetClassImpact?: AssetClassImpact;
  keyThresholds?: string;
  historicalExtreme?: string;
  nextReleaseDate?: string;
  fedOrCbRelevance?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary?: string;
  source: string;
  url: string;
  publishedAt: string;
  relativeTime: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  imageUrl?: string;
}

export interface StockNewsData {
  symbol: string;
  name: string;
  headlineCount: number;
  groundedSource: 'gemini-search' | 'live-feed';
  summary?: string;
  articles: NewsArticle[];
  groundingSources?: Array<{ title: string; url: string }>;
  lastFetched: string;
}

