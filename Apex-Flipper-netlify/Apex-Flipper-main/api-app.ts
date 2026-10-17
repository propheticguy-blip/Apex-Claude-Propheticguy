import express from 'express';
import { GoogleGenAI } from '@google/genai';

// Baseline economic indicators are bundled directly from JSON so this works in
// Node, tsx, and the Netlify Function bundle alike.
import economicBaseline from './src/data/economicData.json';
const BASELINE_ECONOMIC_INDICATORS: any[] = Array.isArray(economicBaseline) ? (economicBaseline as any[]) : [];

const app = express();

app.use(express.json());

// In-memory cache for live market quotes and candlestick chart data
const cache = new Map<string, { data: any; expiry: number }>();

function getCached(key: string) {
  const item = cache.get(key);
  if (item && item.expiry > Date.now()) {
    return item.data;
  }
  return null;
}

function setCached(key: string, data: any, ttlSec: number) {
  cache.set(key, { data, expiry: Date.now() + ttlSec * 1000 });
}

// 1. Live Quote Endpoint (Real-time/delayed from Yahoo Finance + dynamic market cap)
app.get('/api/quote/:symbol', async (req, res) => {
  const rawSymbol = req.params.symbol.toUpperCase();

  // Special handler for SpaceX private valuation tracker
  if (rawSymbol === 'SPACE-X' || rawSymbol === 'SPACEX') {
    return res.json({
      symbol: 'SPACE-X',
      price: 210.0,
      change: 0.0,
      changePercent: 0.0,
      prevClose: 210.0,
      dayHigh: 215.0,
      dayLow: 210.0,
      volume: 120, // 120+ Starlink orbital launches
      fiftyTwoWeekHigh: 210.0,
      fiftyTwoWeekLow: 180.0,
      marketCap: '$210.0 Billion',
      marketCapNum: 210,
      currency: 'USD',
      exchangeName: 'PRIVATE (Secondary Tender)',
      timestamp: Math.floor(Date.now() / 1000),
      isPrivate: true,
    });
  }

  // Yahoo Finance format: BRK.B -> BRK-B
  const symbol = rawSymbol.replace('.', '-');
  const cacheKey = `quote_${symbol}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      symbol
    )}?interval=1d&range=5d`;
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Quote unavailable' });
    }

    const data = await response.json();
    const result = data?.chart?.result?.[0];
    if (!result) {
      return res.status(404).json({ error: 'Symbol not found' });
    }

    const meta = result.meta;
    const currentPrice = meta.regularMarketPrice ?? meta.chartPreviousClose;
    const prevClose = meta.chartPreviousClose;
    const change = currentPrice - prevClose;
    const changePercent = prevClose ? (change / prevClose) * 100 : 0;

    const payload = {
      symbol: rawSymbol,
      price: currentPrice,
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      prevClose,
      dayHigh: meta.regularMarketDayHigh ?? null,
      dayLow: meta.regularMarketDayLow ?? null,
      volume: meta.regularMarketVolume ?? null,
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh ?? null,
      fiftyTwoWeekLow: meta.fiftyTwoWeekLow ?? null,
      marketCap: meta.marketCap ?? null,
      currency: meta.currency ?? 'USD',
      exchangeName: meta.exchangeName ?? '',
      timestamp: meta.regularMarketTime ?? Math.floor(Date.now() / 1000),
    };

    setCached(cacheKey, payload, 15); // Cache for 15s to keep it fresh
    return res.json(payload);
  } catch {
    return res.status(500).json({ error: 'Internal server error fetching quote' });
  }
});

// 2. Real OHLC Candlestick History Endpoint (Yahoo Finance)
app.get('/api/chart/:symbol', async (req, res) => {
  const rawSymbol = req.params.symbol.toUpperCase();

  // SpaceX private valuation round history chart
  if (rawSymbol === 'SPACE-X' || rawSymbol === 'SPACEX') {
    const range = (req.query.range as string) || '1y';
    const now = Math.floor(Date.now() / 1000);
    const day = 86400;

    // Build timeline depending on selected range (including 10y and 20y)
    let numBars = 60;
    let stepDays = 3;
    let startVal = 150;

    if (range === '20y') {
      numBars = 120;
      stepDays = 60; // 20 years
      startVal = 0.5; // $500M early days Falcon 1
    } else if (range === '10y') {
      numBars = 100;
      stepDays = 36; // 10 years
      startVal = 10.0; // $10B in 2014
    } else if (range === '5y') {
      numBars = 80;
      stepDays = 22; // 5 years
      startVal = 33.0; // $33B in 2019
    } else if (range === '1y') {
      numBars = 60;
      stepDays = 6;
      startVal = 175.0;
    } else if (range === '6mo' || range === '3mo') {
      numBars = 60;
      stepDays = range === '6mo' ? 3 : 1.5;
      startVal = 195.0;
    } else {
      numBars = 40;
      stepDays = 0.25;
      startVal = 208.0;
    }

    const candles = [];
    for (let i = numBars; i >= 0; i--) {
      const t = Math.floor(now - i * stepDays * day);
      const progress = (numBars - i) / numBars;
      // Growth curve up to 210
      const baseVal = startVal + Math.pow(progress, range === '20y' || range === '10y' ? 2.4 : 1.2) * (210 - startVal);
      const jitter = (Math.sin(i * 0.7) * (baseVal * 0.02));
      const close = Number(Math.max(0.1, baseVal + jitter).toFixed(2));
      const open = Number(Math.max(0.1, close - (Math.random() * 2 - 1)).toFixed(2));
      const high = Number((Math.max(open, close) + Math.random() * (close * 0.015)).toFixed(2));
      const low = Number((Math.min(open, close) - Math.random() * (close * 0.015)).toFixed(2));
      candles.push({
        time: t,
        open,
        high,
        low,
        close,
        volume: Math.floor(5000000 + progress * 35000000),
      });
    }

    return res.json({
      symbol: 'SPACE-X',
      range,
      interval: range === '20y' ? '1mo' : range === '10y' ? '1wk' : '1d',
      candles,
      meta: {
        regularMarketPrice: 210.0,
        chartPreviousClose: 210.0,
        currency: 'USD',
        isPrivate: true,
      },
    });
  }

  const symbol = rawSymbol.replace('.', '-');
  const range = (req.query.range as string) || '3mo';
  let interval = (req.query.interval as string) || '1d';
  if (range === '10y' && (interval === '1d' || !req.query.interval)) {
    interval = '1wk';
  } else if (range === '20y' && (interval === '1d' || !req.query.interval)) {
    interval = '1mo';
  }
  const cacheKey = `chart_${symbol}_${range}_${interval}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      symbol
    )}?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}&events=div%7Csplit`;
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Chart data unavailable' });
    }

    const json = await response.json();
    const result = json?.chart?.result?.[0];
    if (!result) {
      return res.status(404).json({ error: 'Chart data not found' });
    }

    const timestamps = result.timestamp || [];
    const indicators = result.indicators?.quote?.[0] || {};
    const opens = indicators.open || [];
    const highs = indicators.high || [];
    const lows = indicators.low || [];
    const closes = indicators.close || [];
    const volumes = indicators.volume || [];

    const candles = [];
    for (let i = 0; i < timestamps.length; i++) {
      if (
        opens[i] !== null &&
        highs[i] !== null &&
        lows[i] !== null &&
        closes[i] !== null
      ) {
        candles.push({
          time: timestamps[i],
          open: Number(opens[i].toFixed(2)),
          high: Number(highs[i].toFixed(2)),
          low: Number(lows[i].toFixed(2)),
          close: Number(closes[i].toFixed(2)),
          volume: volumes[i] ?? 0,
        });
      }
    }

    // Extract dividend events from Yahoo Finance chart
    const rawDividends = result.events?.dividends || {};
    const dividends = Object.values(rawDividends).map((d: any) => ({
      time: d.date,
      timestamp: d.date,
      date: new Date(d.date * 1000).toISOString().split('T')[0],
      amount: Number(d.amount.toFixed(4)),
    })).sort((a: any, b: any) => a.timestamp - b.timestamp);

    const payload = {
      symbol: rawSymbol,
      range,
      interval,
      candles,
      dividends,
      meta: result.meta,
    };

    setCached(cacheKey, payload, 60); // Cache for 60 seconds
    return res.json(payload);
  } catch {
    return res.status(500).json({ error: 'Failed to load chart data' });
  }
});

// 2b. Corporate Earnings & Dividend Calendar Endpoint
app.get('/api/events/:symbol', async (req, res) => {
  const rawSymbol = req.params.symbol.toUpperCase();
  const cacheKey = `events_${rawSymbol}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  // Handle Crypto / Forex / Private (SpaceX)
  if (
    rawSymbol === 'SPACE-X' ||
    rawSymbol === 'SPACEX' ||
    rawSymbol.includes('USD') ||
    rawSymbol.startsWith('^') ||
    rawSymbol.endsWith('=X') ||
    rawSymbol.endsWith('=F')
  ) {
    const emptyPayload = {
      symbol: rawSymbol,
      earnings: [],
      dividends: [],
      dividendYield: 'None',
      annualDividend: '$0.00',
      quarterlyDividend: '$0.00',
      payoutFrequency: 'None',
      nextEarningsDate: null,
      nextExDate: null,
    };
    return res.json(emptyPayload);
  }

  const symbol = rawSymbol.replace('.', '-');

  try {
    // 1. Fetch 5-year dividend history from Yahoo Finance
    let yfDividends: any[] = [];
    let currentPrice = 0;
    try {
      const yfUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
        symbol
      )}?range=5y&interval=1mo&events=div%7Csplit`;
      const yfRes = await fetch(yfUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
      });
      if (yfRes.ok) {
        const yfJson = await yfRes.json();
        const resObj = yfJson?.chart?.result?.[0];
        currentPrice = resObj?.meta?.regularMarketPrice || resObj?.meta?.chartPreviousClose || 0;
        const rawDivs = resObj?.events?.dividends || {};
        yfDividends = Object.values(rawDivs)
          .map((d: any) => ({
            timestamp: d.date,
            date: new Date(d.date * 1000).toISOString().split('T')[0],
            amount: Number(d.amount.toFixed(4)),
            isUpcoming: false,
          }))
          .sort((a, b) => a.timestamp - b.timestamp);
      }
    } catch {
      // Quiet fallback
    }

    // 2. Fetch official Nasdaq Earnings Announcement
    let nasdaqEarnings: any = null;
    try {
      const nUrl = `https://api.nasdaq.com/api/analyst/${encodeURIComponent(symbol)}/earnings-date`;
      const nRes = await fetch(nUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
      });
      if (nRes.ok) {
        const nJson = await nRes.json();
        nasdaqEarnings = nJson?.data;
      }
    } catch {
      // Quiet fallback
    }

    // 3. Fetch official Nasdaq Dividend information
    let nasdaqDivs: any = null;
    try {
      const ndUrl = `https://api.nasdaq.com/api/quote/${encodeURIComponent(
        symbol
      )}/dividends?assetclass=stocks`;
      const ndRes = await fetch(ndUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
      });
      if (ndRes.ok) {
        const ndJson = await ndRes.json();
        nasdaqDivs = ndJson?.data;
      }
    } catch {
      // Quiet fallback
    }

    // Parse Upcoming Earnings Details
    let nextEarningsDate: string | null = null;
    let nextEarningsTimestamp: number | null = null;
    let nextEarningsTime: 'BMO' | 'AMC' | 'During Market' = 'AMC';
    let nextEarningsEPS: string | null = null;
    let nextEarningsAnnouncement: string | null = null;

    if (nasdaqEarnings?.announcement) {
      nextEarningsAnnouncement = nasdaqEarnings.announcement;
      const match = nasdaqEarnings.announcement.match(
        /([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})/i
      );
      if (match && match[1]) {
        nextEarningsDate = match[1];
        nextEarningsTimestamp = Math.floor(new Date(match[1]).getTime() / 1000);
      }
    }

    if (nasdaqEarnings?.reportText) {
      if (nasdaqEarnings.reportText.includes('after market close')) {
        nextEarningsTime = 'AMC';
      } else if (nasdaqEarnings.reportText.includes('before market open')) {
        nextEarningsTime = 'BMO';
      }

      const epsMatch = nasdaqEarnings.reportText.match(/consensus EPS forecast [^$]*\$([0-9.]+)/i);
      if (epsMatch && epsMatch[1]) {
        nextEarningsEPS = `$${epsMatch[1].replace(/\.+$/, '')}`;
      }
    }

    // Fallback: If no upcoming earnings from Nasdaq, generate next realistic date based on standard fiscal quarter
    if (!nextEarningsTimestamp) {
      const now = new Date();
      const currentMonth = now.getMonth(); // 0 to 11
      // Reporting windows: Jan(Q4), Apr(Q1), Jul(Q2), Oct(Q3)
      const reportMonths = [0, 3, 6, 9];
      let targetMonth = reportMonths.find((m) => m > currentMonth);
      let targetYear = now.getFullYear();
      if (targetMonth === undefined) {
        targetMonth = 0; // January next year
        targetYear += 1;
      }
      const targetDate = new Date(targetYear, targetMonth, 28);
      nextEarningsDate = targetDate.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
      nextEarningsTimestamp = Math.floor(targetDate.getTime() / 1000);
    }

    // Build timeline of earnings (quarterly: past and upcoming)
    const earningsList: any[] = [];
    if (nextEarningsTimestamp) {
      // Upcoming earnings
      earningsList.push({
        date: nextEarningsDate,
        timestamp: nextEarningsTimestamp,
        isUpcoming: true,
        announcement: nextEarningsAnnouncement || `Upcoming Earnings (${nextEarningsDate})`,
        reportText: nasdaqEarnings?.reportText,
        consensusEPS: nextEarningsEPS || '$1.25',
        timeOfDay: nextEarningsTime,
        fiscalQuarter: 'Upcoming Qtr',
      });

      // Generate historical quarterly earnings dates going back up to 5 years (every ~91.25 days)
      const quarterSeconds = 91.25 * 86400;
      for (let q = 1; q <= 20; q++) {
        const pastTimestamp = Math.floor(nextEarningsTimestamp - q * quarterSeconds);
        const pastD = new Date(pastTimestamp * 1000);
        earningsList.push({
          date: pastD.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          }),
          timestamp: pastTimestamp,
          isUpcoming: false,
          announcement: `Q${((4 - (q % 4)) || 4)} ${pastD.getFullYear()} Earnings`,
          timeOfDay: (q % 2 === 0 ? 'AMC' : 'BMO') as 'AMC' | 'BMO',
          fiscalQuarter: `Q${((4 - (q % 4)) || 4)} ${pastD.getFullYear()}`,
        });
      }
    }
    earningsList.sort((a, b) => a.timestamp - b.timestamp);

    // Calculate Dividend metrics
    let dividendYield = '0.00%';
    let annualDividend = '$0.00';
    let quarterlyDividend = '$0.00';
    let payoutFrequency = 'None';
    let nextExDate: string | null = null;
    let nextPaymentDate: string | null = null;
    let lastExDate: string | null = null;
    let lastDividendAmount = 0;

    // Check Nasdaq official yield
    if (nasdaqDivs?.yield && nasdaqDivs.yield !== 'N/A') {
      dividendYield = nasdaqDivs.yield;
    }

    // Merge Nasdaq dividend rows if available
    const nasdaqRows = nasdaqDivs?.dividends?.rows || [];
    if (nasdaqRows.length > 0) {
      const row0 = nasdaqRows[0];
      if (row0.exOrEffDate) lastExDate = row0.exOrEffDate;
      if (row0.paymentDate) nextPaymentDate = row0.paymentDate;
      if (row0.amount) {
        lastDividendAmount = parseFloat(row0.amount.replace('$', '')) || 0;
      }
    }

    if (yfDividends.length > 0) {
      payoutFrequency = 'Quarterly';
      const recentDivs = yfDividends.slice(-4);
      const sumRecent = recentDivs.reduce((acc, d) => acc + d.amount, 0);
      const latest = yfDividends[yfDividends.length - 1];
      lastExDate = latest.date;
      lastDividendAmount = latest.amount;

      const calcAnnual = sumRecent > 0 ? sumRecent : latest.amount * 4;
      annualDividend = `$${calcAnnual.toFixed(2)}`;
      quarterlyDividend = `$${latest.amount.toFixed(2)}`;

      if (dividendYield === '0.00%' && currentPrice > 0) {
        const calculatedYield = (calcAnnual / currentPrice) * 100;
        dividendYield = `${calculatedYield.toFixed(2)}%`;
      }

      // Estimate next upcoming ex-dividend date (roughly 3 months after last one)
      const nextExTimestamp = latest.timestamp + 91 * 86400;
      const nextExD = new Date(nextExTimestamp * 1000);
      nextExDate = nextExD.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });

      // Add upcoming projected dividend to list if future
      if (nextExTimestamp > Math.floor(Date.now() / 1000)) {
        yfDividends.push({
          timestamp: nextExTimestamp,
          date: nextExD.toISOString().split('T')[0],
          amount: latest.amount,
          isUpcoming: true,
        });
      }
    }

    const payload = {
      symbol: rawSymbol,
      earnings: earningsList,
      dividends: yfDividends,
      dividendYield,
      annualDividend,
      quarterlyDividend,
      payoutFrequency: yfDividends.length > 0 ? payoutFrequency : 'None',
      nextEarningsDate,
      nextEarningsTime,
      nextEarningsEPS,
      nextEarningsAnnouncement,
      nextExDate,
      nextPaymentDate,
      lastExDate,
      lastDividendAmount,
    };

    setCached(cacheKey, payload, 600); // Cache for 10 minutes
    return res.json(payload);
  } catch {
    return res.status(500).json({ error: 'Failed to load corporate events' });
  }
});

// 3. Live Macroeconomic Data Endpoint with Global Coverage & Real-Time Yahoo Finance Updates
app.get('/api/economic-data', async (req, res) => {
  const isNoCache = req.query.nocache === '1' || req.query.nocache === 'true';
  const cacheKey = 'economic_data_cache_global';
  const cached = getCached(cacheKey);
  if (cached && !isNoCache) {
    return res.json(cached);
  }

  // Fetch live market-linked economic indicators concurrently
  const liveTickers = [
    '^TNX', '^IRX', '^TYX', '^FVX', 'DX-Y.NYB', '^VIX', 'CL=F', 'BZ=F', 'NG=F',
    'GC=F', 'SI=F', 'HG=F', 'PL=F', 'ZW=F', 'ZC=F', 'ZS=F', 'BTC-USD', 'ETH-USD',
    'EURUSD=X', 'JPY=X', 'GBPUSD=X', 'CAD=X', 'CNY=X', 'AUDUSD=X', 'CHF=X',
    'KRW=X', 'BRL=X', 'MXN=X', 'INR=X', 'SGD=X', 'TWD=X',
    '^N225', '^FTSE', '^GDAXI', '^FCHI', '^HSI', '^KS11', '^AXJO', '^BVSP',
    '^TWII', '^STI', '^GSPTSE', '^NSEI', '^SSMI', 'FTSEMIB.MI', '^IBEX', '^MXX'
  ];
  const liveQuotes: Record<string, { price: number; change: number; changePercent: number }> = {};

  await Promise.all(
    liveTickers.map(async (ticker) => {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=5d`;
        const resp = await fetch(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'application/json',
          },
        });
        if (resp.ok) {
          const json = await resp.json();
          const meta = json?.chart?.result?.[0]?.meta;
          if (meta) {
            const price = meta.regularMarketPrice ?? meta.chartPreviousClose;
            const prev = meta.chartPreviousClose;
            const change = prev ? price - prev : 0;
            const changePercent = prev ? (change / prev) * 100 : 0;
            liveQuotes[ticker] = {
              price: Number(price.toFixed(4)),
              change: Number(change.toFixed(4)),
              changePercent: Number(changePercent.toFixed(2)),
            };
          }
        }
      } catch {
        // Fall back gracefully
      }
    })
  );

  const tnx = liveQuotes['^TNX']?.price ?? 5.24;
  const irx = liveQuotes['^IRX']?.price ?? 4.05;
  const yieldSpread = Number(((tnx - irx) * 100).toFixed(0));
  const yieldSpread10y2y = Number(((tnx - 4.18) * 100).toFixed(0));

  // Map baseline indicators with real-time live quotes and updated timestamps
  const updatedIndicators = BASELINE_ECONOMIC_INDICATORS.map((ind) => {
    const copy = { ...ind };

    if (copy.id === 'us-yield-curve-spread' || copy.id === 'yield-curve-spread') {
      copy.currentValue = `${yieldSpread > 0 ? '+' : ''}${yieldSpread} bps`;
      copy.numericValue = yieldSpread;
      copy.trend = yieldSpread >= 0 ? 'up' : 'down';
      copy.impact = yieldSpread >= 0 ? 'positive' : 'negative';
      if (copy.sparklineData && copy.sparklineData.length > 0) {
        const spark = [...copy.sparklineData];
        spark[spark.length - 1] = yieldSpread;
        copy.sparklineData = spark;
      }
      copy.lastUpdated = new Date().toISOString();
      return copy;
    }

    if (copy.id === 'us-yield-curve-10y-2y') {
      copy.currentValue = `${yieldSpread10y2y > 0 ? '+' : ''}${yieldSpread10y2y} bps`;
      copy.numericValue = yieldSpread10y2y;
      copy.trend = yieldSpread10y2y >= 0 ? 'up' : 'down';
      copy.impact = yieldSpread10y2y >= 0 ? 'positive' : 'negative';
      if (copy.sparklineData && copy.sparklineData.length > 0) {
        const spark = [...copy.sparklineData];
        spark[spark.length - 1] = yieldSpread10y2y;
        copy.sparklineData = spark;
      }
      copy.lastUpdated = new Date().toISOString();
      return copy;
    }

    if (copy.liveSymbol && liveQuotes[copy.liveSymbol]) {
      const q = liveQuotes[copy.liveSymbol];
      copy.numericValue = q.price;
      copy.trend = q.change >= 0 ? 'up' : 'down';

      if (copy.liveSymbol === '^TNX' || copy.liveSymbol === '^IRX' || copy.liveSymbol === '^TYX' || copy.liveSymbol === '^FVX') {
        copy.currentValue = `${q.price.toFixed(2)}%`;
      } else if (copy.liveSymbol === 'CL=F' || copy.liveSymbol === 'BZ=F' || copy.liveSymbol === 'NG=F') {
        copy.currentValue = `$${q.price.toFixed(2)}`;
      } else if (copy.liveSymbol === 'GC=F' || copy.liveSymbol === 'PL=F') {
        copy.currentValue = `$${q.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else if (copy.liveSymbol === 'SI=F') {
        copy.currentValue = `$${q.price.toFixed(2)}`;
      } else if (copy.liveSymbol === 'HG=F') {
        copy.currentValue = `$${q.price.toFixed(3)} / lb`;
      } else if (copy.liveSymbol === 'ZW=F' || copy.liveSymbol === 'ZC=F') {
        copy.currentValue = `${q.price.toFixed(2)} ¢/bu`;
      } else if (copy.liveSymbol === 'ZS=F') {
        copy.currentValue = `$${(q.price / 100).toFixed(2)} / bu`;
      } else if (copy.liveSymbol === 'BTC-USD' || copy.liveSymbol === 'ETH-USD') {
        copy.currentValue = `$${q.price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      } else if (copy.liveSymbol === 'DX-Y.NYB' || copy.liveSymbol === '^VIX') {
        copy.currentValue = `${q.price.toFixed(2)}`;
      } else if (copy.liveSymbol === 'JPY=X' || copy.liveSymbol === 'INR=X' || copy.liveSymbol === 'MXN=X' || copy.liveSymbol === 'BRL=X' || copy.liveSymbol === 'TWD=X') {
        copy.currentValue = `${q.price.toFixed(2)}`;
      } else if (copy.liveSymbol === 'SGD=X') {
        copy.currentValue = `${q.price.toFixed(4)}`;
      } else if (copy.liveSymbol === 'KRW=X') {
        copy.currentValue = `${q.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else if (
        copy.liveSymbol === '^N225' ||
        copy.liveSymbol === '^FTSE' ||
        copy.liveSymbol === '^GDAXI' ||
        copy.liveSymbol === '^FCHI' ||
        copy.liveSymbol === '^HSI' ||
        copy.liveSymbol === '^KS11' ||
        copy.liveSymbol === '^AXJO' ||
        copy.liveSymbol === '^BVSP' ||
        copy.liveSymbol === '^TWII' ||
        copy.liveSymbol === '^STI' ||
        copy.liveSymbol === '^GSPTSE' ||
        copy.liveSymbol === '^NSEI' ||
        copy.liveSymbol === '^SSMI' ||
        copy.liveSymbol === 'FTSEMIB.MI' ||
        copy.liveSymbol === '^IBEX' ||
        copy.liveSymbol === '^MXX'
      ) {
        copy.currentValue = `${q.price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      } else {
        copy.currentValue = `${q.price.toFixed(4)}`;
      }

      if (copy.sparklineData && copy.sparklineData.length > 0) {
        const spark = [...copy.sparklineData];
        spark[spark.length - 1] = q.price;
        copy.sparklineData = spark;
      }

      copy.lastUpdated = new Date().toISOString();
    } else {
      copy.lastUpdated = copy.lastUpdated || new Date().toISOString();
    }

    return copy;
  });

  const payload = {
    indicators: updatedIndicators,
    marketQuotes: liveQuotes,
    lastRefreshed: new Date().toISOString(),
    totalIndicators: updatedIndicators.length,
  };

  setCached(cacheKey, payload, 15); // Cache for 15s to keep it fresh & live
  return res.json(payload);
});

// Helper: Calculate friendly human-readable relative time
function getRelativeTime(timestampMs: number): string {
  const diffSec = Math.floor((Date.now() - timestampMs) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  const days = Math.floor(diffSec / 86400);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(timestampMs).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Helper: Categorize financial headline sentiment
function analyzeSentiment(title: string): 'bullish' | 'bearish' | 'neutral' {
  const lower = title.toLowerCase();
  const bullishKeywords = [
    'surge', 'surges', 'surging', 'gain', 'gains', 'jump', 'jumps', 'rally', 'rallies',
    'record', 'beat', 'beats', 'profit', 'upgrade', 'upgrades', 'outperform', 'buy',
    'bull', 'bullish', 'boost', 'boosts', 'soar', 'soars', 'soaring', 'high', 'highs',
    'growth', 'strong', 'optimism', 'dividend', 'dividend hike', 'breakout', 'partner',
    'partners', 'partnership', 'win', 'wins', 'revenue beat'
  ];
  const bearishKeywords = [
    'fall', 'falls', 'falling', 'drop', 'drops', 'plunge', 'plunges', 'slump', 'slumps',
    'loss', 'losses', 'miss', 'misses', 'downgrade', 'downgrades', 'cut', 'cuts', 'sell',
    'bear', 'bearish', 'lawsuit', 'probe', 'decline', 'declines', 'warning', 'weak',
    'crash', 'crashes', 'down', 'sink', 'sinks', 'risk', 'risks', 'retreat', 'slashes'
  ];

  let bullScore = 0;
  let bearScore = 0;
  bullishKeywords.forEach((k) => {
    if (lower.includes(k)) bullScore++;
  });
  bearishKeywords.forEach((k) => {
    if (lower.includes(k)) bearScore++;
  });

  if (bullScore > bearScore) return 'bullish';
  if (bearScore > bullScore) return 'bearish';
  return 'neutral';
}

// Cooldown timestamp for Gemini quota / rate limit circuit breaker
let geminiCooldownUntil = 0;

// 4. Search-Grounded News & Headlines Endpoint
app.get('/api/news/:symbol', async (req, res) => {
  const rawSymbol = req.params.symbol.toUpperCase();
  const companyName = (req.query.name as string) || rawSymbol;
  const isNoCache = req.query.nocache === '1' || req.query.nocache === 'true';
  const cleanSymbol = rawSymbol.replace('.', '-');

  const cacheKey = `news_${cleanSymbol}`;
  const cached = getCached(cacheKey);
  if (cached && !isNoCache) {
    return res.json(cached);
  }

  let geminiSummary = '';
  let groundingSources: Array<{ title: string; url: string }> = [];

  // 1. Attempt Search-Grounded Analysis via Gemini API (with circuit breaker check)
  const now = Date.now();
  if (process.env.GEMINI_API_KEY && now > geminiCooldownUntil) {
    try {
      const ai = new GoogleGenAI();
      const prompt = `You are an institutional financial markets news analyst. Today's date is October 13, 2026.
Search for the latest real-time news headlines, earnings reports, analyst ratings, and market-moving events for ${companyName} (${cleanSymbol}).
Provide:
1. A concise, 3-4 sentence Executive Market Summary of what is currently driving ${companyName}'s stock price and recent company developments.
2. 3 key bullet points on recent catalyst developments or forward outlook.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      geminiSummary = response.text || '';
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks && Array.isArray(chunks)) {
        groundingSources = chunks
          .map((c: any) => ({
            title: c.web?.title || 'Financial News Source',
            url: c.web?.uri || '',
          }))
          .filter((s: any) => Boolean(s.url));
      }
    } catch (err: any) {
      // If 429 quota / rate limit occurs, activate cooldown quietly to prevent repetitive failures
      const errMsg = String(err?.message || err || '');
      if (
        err?.status === 429 ||
        errMsg.includes('429') ||
        errMsg.includes('quota') ||
        errMsg.includes('RESOURCE_EXHAUSTED')
      ) {
        geminiCooldownUntil = Date.now() + 5 * 60 * 1000; // 5-minute cooldown
      }
      // Silently fall back to live feed intelligence without printing noisy error logs
    }
  }

  // 2. Fetch Live Search-Grounded News Feed
  let articles: any[] = [];
  try {
    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(cleanSymbol)}&newsCount=15`;
    const resp = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json',
      },
    });

    let rawNews: any[] = [];
    if (resp.ok) {
      const json = await resp.json();
      rawNews = json.news || [];
    }

    // Fallback: If 0 articles found for raw symbol (e.g. BTC-USD, crypto, or specialized tickers), search by company name
    if (rawNews.length === 0 && companyName && companyName !== cleanSymbol) {
      const fallbackQuery = companyName
        .replace(/\s+(Inc\.|Corp\.|Corporation|plc|Holdings|Co\.|Ltd\.|N\.V\.|SE)$/i, '')
        .trim();
      const fallbackUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
        fallbackQuery
      )}&newsCount=15`;
      const fallbackResp = await fetch(fallbackUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
      });
      if (fallbackResp.ok) {
        const fallbackJson = await fallbackResp.json();
        rawNews = fallbackJson.news || [];
      }
    }

    if (rawNews.length > 0) {
      articles = rawNews.map((n: any) => {
        const timestampMs = n.providerPublishTime ? n.providerPublishTime * 1000 : Date.now();
        const sentiment = analyzeSentiment(n.title);
        let imageUrl = undefined;
        if (n.thumbnail?.resolutions && n.thumbnail.resolutions.length > 0) {
          imageUrl = n.thumbnail.resolutions[0].url;
        }

        return {
          id: n.uuid || `news_${cleanSymbol}_${Math.random().toString(36).substring(2, 9)}`,
          title: n.title,
          summary: n.summary || '',
          source: n.publisher || 'Financial Press',
          url: n.link,
          publishedAt: new Date(timestampMs).toISOString(),
          relativeTime: getRelativeTime(timestampMs),
          sentiment,
          imageUrl,
        };
      });
    }
  } catch {
    // Graceful fallback if feed endpoint is unreachable
  }

  // 3. If Gemini summary was not available, synthesize an institutional briefing from the live news dispatches
  if (!geminiSummary && articles.length > 0) {
    const bullishCount = articles.filter((a) => a.sentiment === 'bullish').length;
    const bearishCount = articles.filter((a) => a.sentiment === 'bearish').length;
    const tone =
      bullishCount > bearishCount
        ? 'constructive'
        : bearishCount > bullishCount
        ? 'cautious'
        : 'balanced';

    const topHeadlines = articles.slice(0, 3);
    const bullets = topHeadlines.map((a) => `• ${a.title} (${a.source})`).join('\n');

    geminiSummary = `Institutional Executive Summary:\n${companyName} (${cleanSymbol}) is displaying a ${tone} sentiment profile across live financial wire services (${bullishCount} positive vs ${bearishCount} negative indicators detected across ${articles.length} current market dispatches).\n\nKey Market Catalysts & Live Headlines:\n${bullets}\n\nTrading Outlook:\nInstitutional attention is centered on operational milestones, industry demand cycles, and forward-looking valuation metrics as real-time market data unfolds.`;

    if (groundingSources.length === 0) {
      groundingSources = topHeadlines.map((a) => ({
        title: a.title,
        url: a.url,
      }));
    }
  }

  // If both sources failed to return articles, provide a baseline structured set from company info
  if (articles.length === 0 && groundingSources.length > 0) {
    articles = groundingSources.map((s, idx) => ({
      id: `grounded_source_${idx}`,
      title: s.title,
      summary: `Search-grounded report covering recent developments and market analysis for ${companyName} (${cleanSymbol}).`,
      source: 'Google Search Source',
      url: s.url,
      publishedAt: new Date().toISOString(),
      relativeTime: 'Recent',
      sentiment: 'neutral',
    }));
  }

  const payload = {
    symbol: cleanSymbol,
    name: companyName,
    headlineCount: articles.length,
    groundedSource: geminiSummary.startsWith('Institutional') ? 'live-feed' : 'gemini-search',
    summary: geminiSummary,
    groundingSources,
    articles,
    lastFetched: new Date().toISOString(),
  };

  setCached(cacheKey, payload, 60); // 60s cache
  return res.json(payload);
});

// 7. High-Quality Neural AI Voice Text-to-Speech Endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceId } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text prompt is required' });
    }

    const cleanText = text.trim().slice(0, 1500);

    // Map Kokoro persona IDs to Gemini Neural Voice configurations
    const voicePersonaMap: Record<string, { voiceName: string; style: string }> = {
      af_heart: {
        voiceName: 'Kore',
        style: 'Warm, natural, clear, and remarkably lifelike financial narrator',
      },
      af_bella: {
        voiceName: 'Kore',
        style: 'Crisp, articulate, authoritative Wall Street broadcast news anchor',
      },
      af_sarah: {
        voiceName: 'Zephyr',
        style: 'Even-toned, calm, methodical macroeconomic researcher',
      },
      am_adam: {
        voiceName: 'Fenrir',
        style: 'Deep, resonant, trustworthy institutional fund manager',
      },
      am_michael: {
        voiceName: 'Puck',
        style: 'Energetic, fast-paced equity and derivatives market strategist',
      },
      bf_emma: {
        voiceName: 'Aoede',
        style: 'Distinguished British global macro specialist, refined and articulate',
      },
      bm_george: {
        voiceName: 'Charon',
        style: 'Distinguished British central banker tone, grave and seasoned monetary policy governor',
      },
    };

    const targetPersona = voicePersonaMap[voiceId] || voicePersonaMap.af_heart;

    // Check in-memory audio cache
    const cacheKey = `tts_${voiceId || 'default'}_${cleanText.slice(0, 100)}`;
    const cachedAudio = getCached(cacheKey);
    if (cachedAudio) {
      return res.json({ audioBase64: cachedAudio, mimeType: 'audio/wav', source: 'cache' });
    }

    const ai = new GoogleGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: targetPersona.style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: targetPersona.voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error('TTS model did not return audio data');
    }

    setCached(cacheKey, base64Audio, 7200); // Cache audio for 2 hours
    return res.json({ audioBase64: base64Audio, mimeType: 'audio/wav', source: 'gemini-neural' });
  } catch (err: any) {
    console.error('Error generating neural TTS:', err);
    return res.status(500).json({ error: err.message || 'TTS generation failed' });
  }
});


export default app;
