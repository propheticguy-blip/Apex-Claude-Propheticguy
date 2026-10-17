import { EconomicIndicator } from '../types/stock';
import rawEconomicData from './economicData.json';

export const BASELINE_ECONOMIC_INDICATORS: EconomicIndicator[] = rawEconomicData as EconomicIndicator[];

export const ECONOMIC_REGIONS: string[] = [
  "ALL",
  "United States",
  "Global / World",
  "Eurozone",
  "Japan",
  "China",
  "United Kingdom",
  "Canada",
  "India",
  "Taiwan",
  "Australia",
  "Switzerland",
  "South Korea",
  "Singapore",
  "Latin America",
  "Middle East & GCC",
  "Other Economies"
];

export const ECONOMIC_CATEGORIES: string[] = [
  "ALL",
  "Growth & Output",
  "Inflation",
  "Interest Rates & Central Banks",
  "Currencies & FX",
  "Commodities & Energy",
  "Labor Market",
  "Consumer & Housing",
  "Surveys & Sentiment",
  "Money & Debt"
];

/**
 * Fetch live updated economic indicator dataset from backend with cache busting
 */
export async function fetchLiveEconomicData(): Promise<{
  indicators: EconomicIndicator[];
  lastRefreshed: string;
}> {
  try {
    const res = await fetch('/api/economic-data?t=' + Date.now());
    if (!res.ok) {
      return { indicators: BASELINE_ECONOMIC_INDICATORS, lastRefreshed: new Date().toISOString() };
    }
    const data = await res.json();
    if (data?.indicators && Array.isArray(data.indicators) && data.indicators.length > 0) {
      return { indicators: data.indicators, lastRefreshed: data.lastRefreshed || new Date().toISOString() };
    }
    return { indicators: BASELINE_ECONOMIC_INDICATORS, lastRefreshed: new Date().toISOString() };
  } catch {
    return { indicators: BASELINE_ECONOMIC_INDICATORS, lastRefreshed: new Date().toISOString() };
  }
}
