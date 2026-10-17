import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Stock, ThemeMode, LiveQuote, CorporateEvents, EarningsEvent, DividendEvent } from '../types/stock';
import { detectChartPatterns, DetectedPattern } from '../utils/chartPatterns';
import { Sparkles, TrendingUp, TrendingDown, Target, Shield, CheckCircle2, Calendar, Coins } from 'lucide-react';

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface NativeStockChartProps {
  stock: Stock;
  timeRange: string;
  chartStyle: 'candles' | 'line' | 'heikin';
  themeMode: ThemeMode;
  liveQuote?: LiveQuote | null;
  showMovingAverages: boolean;
  showPatterns?: boolean;
  onTogglePatterns?: () => void;
  corporateEvents?: CorporateEvents | null;
  showEvents?: boolean;
  onToggleEvents?: () => void;
}

export const NativeStockChart: React.FC<NativeStockChartProps> = ({
  stock,
  timeRange,
  chartStyle,
  themeMode,
  liveQuote,
  showMovingAverages,
  showPatterns = true,
  onTogglePatterns,
  corporateEvents,
  showEvents = true,
  onToggleEvents,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [candles, setCandles] = useState<Candle[]>([]);
  const [chartDividends, setChartDividends] = useState<any[]>([]);
  const [localEvents, setLocalEvents] = useState<CorporateEvents | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Map timeRange to Yahoo Finance interval
  const getIntervalForRange = (range: string) => {
    switch (range) {
      case '1d':
        return '5m';
      case '5d':
        return '15m';
      case '1mo':
        return '1d';
      case '3mo':
      case '6mo':
      case '1y':
        return '1d';
      case '5y':
      case '10y':
        return '1wk';
      case '20y':
        return '1mo';
      default:
        return '1d';
    }
  };

  // Fetch candle data from backend
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const interval = getIntervalForRange(timeRange);
    fetch(`/api/chart/${encodeURIComponent(stock.symbol)}?range=${timeRange}&interval=${interval}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load chart');
        return res.json();
      })
      .then((data) => {
        if (!isCancelled && data.candles && Array.isArray(data.candles)) {
          setCandles(data.candles);
          if (data.dividends && Array.isArray(data.dividends)) {
            setChartDividends(data.dividends);
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        // Fallback synthetic candles based on approx price if network hiccup
        if (!isCancelled) {
          const base = liveQuote?.price || stock.approxPrice || 100;
          const fallbackCandles: Candle[] = [];
          const now = Math.floor(Date.now() / 1000);
          
          let count = 60;
          let stepSec = 86400;
          if (timeRange === '20y') {
            count = 200;
            stepSec = 30 * 86400; // 20 years
          } else if (timeRange === '10y') {
            count = 160;
            stepSec = 22 * 86400; // 10 years
          } else if (timeRange === '5y') {
            count = 120;
            stepSec = 15 * 86400;
          } else if (timeRange === '5d') {
            count = 35;
            stepSec = 3600 * 3;
          }

          let current = base * (timeRange === '20y' || timeRange === '10y' ? 0.35 : 0.88);
          for (let i = count; i >= 0; i--) {
            const delta = (Math.random() - 0.47) * (current * 0.035);
            const open = current;
            const close = Math.max(1, current + delta);
            const high = Math.max(open, close) + Math.random() * (close * 0.015);
            const low = Math.max(0.5, Math.min(open, close) - Math.random() * (close * 0.015));
            const volume = Math.floor(Math.random() * 20000000) + 5000000;
            fallbackCandles.push({
              time: now - i * stepSec,
              open: Number(open.toFixed(2)),
              high: Number(high.toFixed(2)),
              low: Number(low.toFixed(2)),
              close: Number(close.toFixed(2)),
              volume,
            });
            current = close;
          }
          setCandles(fallbackCandles);
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [stock.symbol, timeRange]);

  // Fetch Corporate Events (Earnings Dates & Dividend Dates)
  useEffect(() => {
    if (corporateEvents) return;
    let isCancelled = false;
    fetch(`/api/events/${encodeURIComponent(stock.symbol)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isCancelled && data) {
          setLocalEvents(data);
        }
      })
      .catch(() => {});
    return () => {
      isCancelled = true;
    };
  }, [stock.symbol, corporateEvents]);

  // Combined Corporate Events (from props or locally fetched)
  const activeEvents = corporateEvents || localEvents;

  // Compute Heikin Ashi if selected
  const displayCandles = useMemo(() => {
    if (chartStyle !== 'heikin' || candles.length === 0) return candles;
    const ha: Candle[] = [];
    for (let i = 0; i < candles.length; i++) {
      const c = candles[i];
      if (i === 0) {
        ha.push({ ...c });
      } else {
        const prevHa = ha[i - 1];
        const haClose = (c.open + c.high + c.low + c.close) / 4;
        const haOpen = (prevHa.open + prevHa.close) / 2;
        const haHigh = Math.max(c.high, haOpen, haClose);
        const haLow = Math.min(c.low, haOpen, haClose);
        ha.push({
          time: c.time,
          open: Number(haOpen.toFixed(2)),
          high: Number(haHigh.toFixed(2)),
          low: Number(haLow.toFixed(2)),
          close: Number(haClose.toFixed(2)),
          volume: c.volume,
        });
      }
    }
    return ha;
  }, [candles, chartStyle]);

  // Compute Technical Patterns
  const [selectedPatternIndex, setSelectedPatternIndex] = useState(0);

  const detectedPatterns = useMemo(() => {
    if (!showPatterns || displayCandles.length < 15) return [];
    return detectChartPatterns(displayCandles);
  }, [showPatterns, displayCandles]);

  // Reset pattern index if out of bounds when patterns change
  useEffect(() => {
    if (selectedPatternIndex >= detectedPatterns.length) {
      setSelectedPatternIndex(0);
    }
  }, [detectedPatterns.length, selectedPatternIndex]);

  const activePattern = detectedPatterns.length > 0
    ? detectedPatterns[selectedPatternIndex % detectedPatterns.length]
    : null;

  // Compute SMA (Simple Moving Average)
  const computeSMA = (data: Candle[], period: number) => {
    const sma: (number | null)[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        sma.push(null);
      } else {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += data[i - j].close;
        }
        sma.push(sum / period);
      }
    }
    return sma;
  };

  const sma20 = useMemo(() => computeSMA(displayCandles, 20), [displayCandles]);
  const sma50 = useMemo(() => computeSMA(displayCandles, 50), [displayCandles]);

  // Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || displayCandles.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    // Color definitions based on theme
    const isAmber = themeMode === 'bedtime-amber';
    const isOled = themeMode === 'bedtime-oled';

    const bgFill = isOled ? '#000000' : isAmber ? '#0d0905' : '#070b13';
    const gridColor = isAmber ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.06)';
    const textColor = isAmber ? '#d97706' : '#94a3b8';
    const upColor = isAmber ? '#f59e0b' : '#10b981'; // Amber up or Emerald up
    const downColor = isAmber ? '#b91c1c' : '#ef4444'; // Crimson or Red
    const sma20Color = '#06b6d4'; // Cyan
    const sma50Color = '#a855f7'; // Purple

    // Clear background
    ctx.fillStyle = bgFill;
    ctx.fillRect(0, 0, width, height);

    // Margins (Enlarged marginRight to 84px for prominent right-axis price badge)
    const marginTop = 30;
    const marginBottom = 42;
    const marginRight = 84; // Room for larger price scale and bold tags
    const marginLeft = 10;

    const plotWidth = width - marginLeft - marginRight;
    const plotHeight = height - marginTop - marginBottom;

    // Volume section takes bottom 18% of plotHeight
    const volumeHeight = plotHeight * 0.18;
    const priceHeight = plotHeight * 0.80;

    // Calculate Min & Max Price
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVolume = 0;

    displayCandles.forEach((c) => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
      if (c.volume > maxVolume) maxVolume = c.volume;
    });

    // If active pattern has a target price, ensure it fits comfortably within the vertical scale
    if (showPatterns && activePattern?.targetPrice) {
      if (activePattern.targetPrice > maxPrice) maxPrice = activePattern.targetPrice;
      if (activePattern.targetPrice < minPrice) minPrice = activePattern.targetPrice;
    }

    // Add 5% padding to price bounds for breathing room
    const pricePadding = (maxPrice - minPrice) * 0.06 || 1;
    const chartMin = Math.max(0, minPrice - pricePadding);
    const chartMax = maxPrice + pricePadding;
    const priceRange = chartMax - chartMin;

    const getY = (val: number) => {
      return marginTop + priceHeight - ((val - chartMin) / priceRange) * priceHeight;
    };

    const getX = (idx: number) => {
      const step = plotWidth / (displayCandles.length || 1);
      return marginLeft + idx * step + step / 2;
    };

    // 1. Draw Grid Lines & Price Labels
    const gridSteps = 6;
    ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= gridSteps; i++) {
      const priceVal = chartMin + (priceRange / gridSteps) * i;
      const y = getY(priceVal);

      // Horizontal grid line
      ctx.beginPath();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.moveTo(marginLeft, y);
      ctx.lineTo(marginLeft + plotWidth, y);
      ctx.stroke();

      // Right Y-axis regular label
      const formattedGridPrice = priceVal >= 1000
        ? `$${priceVal.toLocaleString('en-US', { maximumFractionDigits: 1 })}`
        : `$${priceVal.toFixed(2)}`;
      ctx.fillText(formattedGridPrice, marginLeft + plotWidth + 8, y);
    }

    // 2. Draw Volume Bars
    const candleWidth = Math.max(1, (plotWidth / displayCandles.length) * 0.72);
    displayCandles.forEach((c, idx) => {
      const x = getX(idx);
      const isUp = c.close >= c.open;
      const volH = maxVolume ? (c.volume / maxVolume) * volumeHeight : 0;
      const volY = marginTop + plotHeight - volH;

      ctx.fillStyle = isUp
        ? isAmber ? 'rgba(245,158,11,0.22)' : 'rgba(16,185,129,0.22)'
        : isAmber ? 'rgba(185,28,28,0.22)' : 'rgba(239,68,68,0.22)';
      ctx.fillRect(x - candleWidth / 2, volY, candleWidth, volH);
    });

    // 3. Draw Candlesticks or Line Chart
    if (chartStyle === 'line') {
      // Line Chart with smooth area gradient
      const gradient = ctx.createLinearGradient(0, marginTop, 0, marginTop + priceHeight);
      gradient.addColorStop(0, isAmber ? 'rgba(245,158,11,0.25)' : 'rgba(56,189,248,0.25)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.beginPath();
      displayCandles.forEach((c, idx) => {
        const x = getX(idx);
        const y = getY(c.close);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      // Close path for gradient fill
      const lastX = getX(displayCandles.length - 1);
      const firstX = getX(0);
      ctx.lineTo(lastX, marginTop + priceHeight);
      ctx.lineTo(firstX, marginTop + priceHeight);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Stroke line
      ctx.beginPath();
      displayCandles.forEach((c, idx) => {
        const x = getX(idx);
        const y = getY(c.close);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = isAmber ? '#f59e0b' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      // Candlestick Chart (Standard & Heikin Ashi)
      displayCandles.forEach((c, idx) => {
        const x = getX(idx);
        const isUp = c.close >= c.open;
        const color = isUp ? upColor : downColor;

        const openY = getY(c.open);
        const closeY = getY(c.close);
        const highY = getY(c.high);
        const lowY = getY(c.low);

        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(1.5, Math.abs(closeY - openY));

        // Draw Wick
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        // Draw Body
        ctx.fillStyle = color;
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      });
    }

    // 4. Draw Moving Averages (SMA 20 & SMA 50)
    if (showMovingAverages) {
      // SMA 20
      ctx.beginPath();
      let startedSma20 = false;
      sma20.forEach((val, idx) => {
        if (val !== null) {
          const x = getX(idx);
          const y = getY(val);
          if (!startedSma20) {
            ctx.moveTo(x, y);
            startedSma20 = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.strokeStyle = sma20Color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // SMA 50
      ctx.beginPath();
      let startedSma50 = false;
      sma50.forEach((val, idx) => {
        if (val !== null) {
          const x = getX(idx);
          const y = getY(val);
          if (!startedSma50) {
            ctx.moveTo(x, y);
            startedSma50 = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.strokeStyle = sma50Color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // 5. CHART PATTERN MODE: Highlighting, Keypoints, Polygons & Target Projection
    if (showPatterns && activePattern) {
      const isBear = activePattern.type === 'bearish';
      const isNeutral = activePattern.type === 'neutral';

      // A. Translucent Polygon Fill
      if (activePattern.polygon && activePattern.polygon.length >= 3) {
        ctx.save();
        ctx.beginPath();
        activePattern.polygon.forEach((pt, pIdx) => {
          const x = getX(pt.index);
          const y = getY(pt.price);
          if (pIdx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = isBear
          ? 'rgba(239, 68, 68, 0.14)'
          : isNeutral
          ? 'rgba(245, 158, 11, 0.12)'
          : 'rgba(16, 185, 129, 0.14)';
        ctx.fill();
        ctx.restore();
      }

      // B. Pattern Structural Lines
      activePattern.lines.forEach((line) => {
        const x1 = getX(line.x1Index);
        const y1 = getY(line.y1Price);
        const x2 = getX(line.x2Index);
        const y2 = getY(line.y2Price);

        ctx.save();
        ctx.beginPath();
        if (line.dash) ctx.setLineDash(line.dash);
        ctx.strokeStyle = line.color || (isBear ? '#f43f5e' : isNeutral ? '#f59e0b' : '#10b981');
        ctx.lineWidth = line.lineWidth || 2;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();

        // Line Label
        if (line.label) {
          ctx.save();
          ctx.font = 'bold 9.5px ui-monospace, monospace';
          ctx.fillStyle = line.color || (isBear ? '#fca5a5' : isNeutral ? '#fde68a' : '#a7f3d0');
          ctx.textAlign = 'right';
          ctx.fillText(line.label, x2 - 4, y2 - 6);
          ctx.restore();
        }
      });

      // C. KeyPoint Nodes (L1, Peak, Neckline, Apex, etc.)
      activePattern.keyPoints.forEach((kp) => {
        const x = getX(kp.index);
        const y = getY(kp.price);

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = isBear ? '#ef4444' : isNeutral ? '#f59e0b' : '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (kp.label) {
          ctx.font = 'bold 9px ui-monospace, monospace';
          ctx.fillStyle = '#f8fafc';
          ctx.textAlign = 'center';
          ctx.fillText(kp.label, x, y - 8);
        }
        ctx.restore();
      });

      // D. Target Price Projection Line & Tag
      if (activePattern.targetPrice && activePattern.targetPrice >= chartMin && activePattern.targetPrice <= chartMax) {
        const targetY = getY(activePattern.targetPrice);

        ctx.save();
        // Dashed target guideline across chart
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = isBear ? '#f43f5e' : isNeutral ? '#f59e0b' : '#10b981';
        ctx.lineWidth = 1.5;
        ctx.moveTo(marginLeft, targetY);
        ctx.lineTo(marginLeft + plotWidth, targetY);
        ctx.stroke();
        ctx.restore();

        // Right axis Target Badge
        const tbW = marginRight - 8;
        const tbH = 22;
        const tbX = marginLeft + plotWidth + 4;
        ctx.fillStyle = isBear ? '#dc2626' : isNeutral ? '#d97706' : '#059669';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(tbX, targetY - tbH / 2, tbW, tbH, 4) : ctx.rect(tbX, targetY - tbH / 2, tbW, tbH);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const targetArrow = isBear ? '▼' : isNeutral ? '⟷' : '▲';
        ctx.fillText(`🎯 ${targetArrow} $${activePattern.targetPrice.toFixed(2)}`, tbX + tbW / 2, targetY);
      }

      // E. Stop Loss Guideline & Axis Tag (Complete Trade Setup Visibility)
      if (activePattern.stopLossPrice && activePattern.stopLossPrice >= chartMin && activePattern.stopLossPrice <= chartMax) {
        const slY = getY(activePattern.stopLossPrice);

        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
        ctx.lineWidth = 1;
        ctx.moveTo(marginLeft, slY);
        ctx.lineTo(marginLeft + plotWidth, slY);
        ctx.stroke();
        ctx.restore();

        // Right axis Stop Loss Tag
        const slW = marginRight - 8;
        const slH = 19;
        const slX = marginLeft + plotWidth + 4;
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(slX, slY - slH / 2, slW, slH, 3) : ctx.rect(slX, slY - slH / 2, slW, slH);
        ctx.fill();
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9.5px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🛑 $${activePattern.stopLossPrice.toFixed(2)}`, slX + slW / 2, slY);
      }
    }

    // 6. Draw Date Labels along bottom X-axis (WITH CLEARLY VISIBLE YEARS)
    const formatDateForRange = (timestampSec: number, range: string) => {
      const d = new Date(timestampSec * 1000);
      const year = d.getFullYear();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[d.getMonth()];
      const day = d.getDate();

      if (range === '20y' || range === '10y') {
        // Full 4-digit Year is prominently shown
        return `${year}`;
      } else if (range === '5y') {
        return `${month} ${year}`;
      } else if (range === '1y') {
        return `${month} '${String(year).slice(-2)}`;
      } else if (range === '6mo' || range === '3mo' || range === '1mo') {
        return `${month} ${day}, '${String(year).slice(-2)}`;
      } else {
        // 5d or 1d
        return `${month} ${day}, ${year}`;
      }
    };

    // Determine evenly spaced ticks with prominent year labels
    const numTicks = width < 550 ? 4 : width < 900 ? 6 : 8;
    const tickIndices: number[] = [];

    if (timeRange === '20y' || timeRange === '10y') {
      let lastYear = -1;
      const yearPoints: { year: number; index: number }[] = [];
      displayCandles.forEach((c, idx) => {
        const yr = new Date(c.time * 1000).getFullYear();
        if (yr !== lastYear) {
          yearPoints.push({ year: yr, index: idx });
          lastYear = yr;
        }
      });

      const step = Math.max(1, Math.floor(yearPoints.length / numTicks));
      for (let i = 0; i < yearPoints.length; i += step) {
        tickIndices.push(yearPoints[i].index);
      }
      if (tickIndices.length === 0 || tickIndices[tickIndices.length - 1] < displayCandles.length - 8) {
        tickIndices.push(displayCandles.length - 1);
      }
    } else {
      const step = Math.max(1, Math.floor((displayCandles.length - 1) / (numTicks - 1)));
      for (let i = 0; i < displayCandles.length; i += step) {
        tickIndices.push(i);
      }
      if (tickIndices[tickIndices.length - 1] !== displayCandles.length - 1) {
        tickIndices.push(displayCandles.length - 1);
      }
    }

    // Baseline separator line
    ctx.beginPath();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.moveTo(marginLeft, marginTop + plotHeight);
    ctx.lineTo(marginLeft + plotWidth, marginTop + plotHeight);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = 'bold 11px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillStyle = isAmber ? '#fbbf24' : '#cbd5e1'; // High-contrast visible text

    tickIndices.forEach((idx) => {
      const c = displayCandles[idx];
      if (!c) return;
      const x = getX(idx);

      // Tick mark
      ctx.beginPath();
      ctx.strokeStyle = isAmber ? 'rgba(245, 158, 11, 0.45)' : 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.moveTo(x, marginTop + plotHeight);
      ctx.lineTo(x, marginTop + plotHeight + 5);
      ctx.stroke();

      // Formatted date string with year clearly visible
      const dateStr = formatDateForRange(c.time, timeRange);
      ctx.fillText(dateStr, x, marginTop + plotHeight + 8);
    });

    // 7. Draw Current Live Price Reference Line & Enlarged Right Price Bar Tag
    const latestPrice = liveQuote?.price || displayCandles[displayCandles.length - 1]?.close;
    if (latestPrice && latestPrice >= chartMin && latestPrice <= chartMax) {
      const curY = getY(latestPrice);

      // Determine price direction: up, down, or neutral
      let priceDirection: 'up' | 'down' | 'neutral' = 'neutral';
      if (liveQuote && typeof liveQuote.change === 'number') {
        if (liveQuote.change > 0.001) {
          priceDirection = 'up';
        } else if (liveQuote.change < -0.001) {
          priceDirection = 'down';
        } else {
          priceDirection = 'neutral';
        }
      } else if (stock.dayChange !== undefined && stock.dayChange !== null && stock.dayChange !== 0) {
        if (stock.dayChange > 0.001) {
          priceDirection = 'up';
        } else if (stock.dayChange < -0.001) {
          priceDirection = 'down';
        } else {
          priceDirection = 'neutral';
        }
      } else if (displayCandles.length >= 2) {
        const baseCandle = displayCandles[0];
        const diff = latestPrice - (baseCandle.open || baseCandle.close);
        if (Math.abs(diff) < 0.005) {
          priceDirection = 'neutral';
        } else if (diff > 0) {
          priceDirection = 'up';
        } else {
          priceDirection = 'down';
        }
      }

      // Configure high-contrast color scheme based on direction and theme
      let guideLineColor = '#10b981';
      let tagBgColor = '#059669';
      let tagBorderColor = '#34d399';
      const tagTextColor = '#ffffff';

      if (priceDirection === 'up') {
        guideLineColor = isAmber ? '#f59e0b' : '#10b981';
        tagBgColor = isAmber ? '#d97706' : '#059669';
        tagBorderColor = isAmber ? '#fbbf24' : '#34d399';
      } else if (priceDirection === 'down') {
        // Red box for down stocks
        guideLineColor = '#ef4444';
        tagBgColor = isAmber ? '#b91c1c' : '#dc2626';
        tagBorderColor = '#f87171';
      } else {
        // Neutral box
        guideLineColor = isAmber ? '#a8a29e' : '#94a3b8';
        tagBgColor = isAmber ? '#57534e' : '#475569';
        tagBorderColor = isAmber ? '#d6d3d1' : '#cbd5e1';
      }

      // Horizontal dashed guide line
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = guideLineColor;
      ctx.lineWidth = 1.5;
      ctx.moveTo(marginLeft, curY);
      ctx.lineTo(marginLeft + plotWidth, curY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Enlarged, high-contrast Price Tag Badge on Right Axis
      const badgeH = 26;
      const badgeW = marginRight - 6;
      const badgeX = marginLeft + plotWidth + 3;
      const badgeY = curY - badgeH / 2;

      // Draw stylish tag with pointer arrow
      ctx.fillStyle = tagBgColor;
      ctx.beginPath();
      ctx.moveTo(marginLeft + plotWidth, curY);
      ctx.lineTo(badgeX, curY - 5);
      ctx.lineTo(badgeX + 3, badgeY);
      ctx.lineTo(badgeX + badgeW, badgeY);
      ctx.lineTo(badgeX + badgeW, badgeY + badgeH);
      ctx.lineTo(badgeX + 3, badgeY + badgeH);
      ctx.lineTo(badgeX, curY + 5);
      ctx.closePath();
      ctx.fill();

      // Border glow outline
      ctx.strokeStyle = tagBorderColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Bold, enlarged price text
      ctx.fillStyle = tagTextColor;
      ctx.font = 'bold 12.5px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const formattedPrice = latestPrice >= 1000
        ? `$${latestPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : `$${latestPrice.toFixed(2)}`;
      ctx.fillText(formattedPrice, badgeX + badgeW / 2 + 1, curY);
    }

    // 7b. Corporate Events Markers: Earnings Dates [E] and Dividend Dates [D]
    const activeEvents = corporateEvents || localEvents;
    const isEventsVisible = showEvents !== false;
    const eventHotspots: { type: 'earnings' | 'dividend'; x: number; y: number; r: number; data: any }[] = [];

    if (isEventsVisible && activeEvents) {
      // 1. Gather all unique dividends from chart and corporate events
      const divMap = new Map<string, any>();
      chartDividends.forEach((d) => {
        const key = d.date || String(d.timestamp || d.time);
        divMap.set(key, { ...d, timestamp: d.timestamp || d.time });
      });
      (activeEvents.dividends || []).forEach((d) => {
        const key = d.date || String(d.timestamp);
        if (!divMap.has(key)) divMap.set(key, d);
      });
      const allDivs = Array.from(divMap.values()).sort((a, b) => a.timestamp - b.timestamp);
      const allEarnings = activeEvents.earnings || [];

      // Determine time window per candle for matching
      const candleCount = displayCandles.length;
      displayCandles.forEach((c, idx) => {
        const x = getX(idx);
        const prevTime = idx > 0 ? displayCandles[idx - 1].time : c.time - 43200;
        const nextTime = idx < candleCount - 1 ? displayCandles[idx + 1].time : c.time + 43200;
        const minT = (prevTime + c.time) / 2;
        const maxT = (c.time + nextTime) / 2;
        const cDateStr = new Date(c.time * 1000).toISOString().split('T')[0];

        // Find matching dividend for this candle
        const matchedDiv = allDivs.find(
          (d) => (d.timestamp >= minT && d.timestamp <= maxT) || d.date === cDateStr
        );

        // Find matching earnings report for this candle
        const matchedEarn = allEarnings.find(
          (e) => (e.timestamp >= minT && e.timestamp <= maxT) || e.date === cDateStr
        );

        // Price reaction calculation on this event candle
        const prevClose = idx > 0 ? displayCandles[idx - 1].close : c.open;
        const priceReactionDiff = c.close - prevClose;
        const priceReactionPct = prevClose > 0 ? (priceReactionDiff / prevClose) * 100 : 0;
        const isUpReaction = priceReactionDiff >= 0;

        const yHigh = getY(c.high);
        const yLow = getY(c.low);

        // 1. ANCHORED EARNINGS BADGE [E] DIRECTLY ABOVE CANDLE (To see reaction immediately)
        if (matchedEarn) {
          // Positioned above candle wick with a connecting dashed guide stem
          const earnBadgeY = Math.max(marginTop + 24, yHigh - 32);

          ctx.save();
          // Connecting vertical dashed stem from candle top to E badge
          ctx.beginPath();
          ctx.setLineDash([2, 2]);
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 1.5;
          ctx.moveTo(x, earnBadgeY + 12);
          ctx.lineTo(x, yHigh);
          ctx.stroke();
          ctx.setLineDash([]);

          // Large, prominent Letter 'E' Circle Badge
          ctx.shadowColor = 'rgba(168, 85, 247, 0.7)';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(x, earnBadgeY, 12, 0, Math.PI * 2);
          ctx.fillStyle = '#7c3aed'; // Vibrant violet
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Bold letter 'E'
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffffff';
          ctx.font = '900 13px ui-monospace, SFMono-Regular, Menlo, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('E', x, earnBadgeY);

          // Price Reaction Pill Tag right above 'E' (e.g. ▲ +4.2% or ▼ -3.1%)
          const pillW = 46;
          const pillH = 15;
          const pillX = x - pillW / 2;
          const pillY = earnBadgeY - 24;

          ctx.fillStyle = isUpReaction ? '#059669' : '#dc2626';
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(pillX, pillY, pillW, pillH, 3) : ctx.rect(pillX, pillY, pillW, pillH);
          ctx.fill();
          ctx.strokeStyle = isUpReaction ? '#34d399' : '#f87171';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px ui-monospace, monospace';
          ctx.fillText(
            `${isUpReaction ? '▲+' : '▼'}${Math.abs(priceReactionPct).toFixed(1)}%`,
            x,
            pillY + pillH / 2 + 0.5
          );

          // Timeline marker at bottom date axis
          const timelineY = marginTop + plotHeight - 12;
          ctx.beginPath();
          ctx.arc(x, timelineY, 7, 0, Math.PI * 2);
          ctx.fillStyle = '#7c3aed';
          ctx.fill();
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8.5px sans-serif';
          ctx.fillText('E', x, timelineY);

          ctx.restore();

          eventHotspots.push({
            type: 'earnings',
            x,
            y: earnBadgeY,
            r: 14,
            data: {
              ...matchedEarn,
              candle: c,
              reactionDiff: priceReactionDiff,
              reactionPct: priceReactionPct,
              isUpReaction,
            },
          });
        }

        // 2. ANCHORED DIVIDEND BADGE [D] DIRECTLY BELOW CANDLE (To see ex-date drop/reaction)
        if (matchedDiv) {
          // Positioned below candle low wick with a connecting dashed guide stem
          const divBadgeY = Math.min(marginTop + plotHeight - 26, yLow + 32);

          ctx.save();
          // Connecting vertical dashed stem from candle bottom to D badge
          ctx.beginPath();
          ctx.setLineDash([2, 2]);
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1.5;
          ctx.moveTo(x, yLow);
          ctx.lineTo(x, divBadgeY - 12);
          ctx.stroke();
          ctx.setLineDash([]);

          // Large, prominent Letter 'D' Circle Badge
          ctx.shadowColor = 'rgba(16, 185, 129, 0.7)';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(x, divBadgeY, 12, 0, Math.PI * 2);
          ctx.fillStyle = '#059669'; // Emerald green
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Bold letter 'D'
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffffff';
          ctx.font = '900 13px ui-monospace, SFMono-Regular, Menlo, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('D', x, divBadgeY);

          // Dividend Cash Payout Pill right below 'D' (e.g. $0.27)
          const divPillW = 42;
          const divPillH = 15;
          const divPillX = x - divPillW / 2;
          const divPillY = divBadgeY + 14;

          ctx.fillStyle = 'rgba(6, 78, 59, 0.95)';
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(divPillX, divPillY, divPillW, divPillH, 3) : ctx.rect(divPillX, divPillY, divPillW, divPillH);
          ctx.fill();
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#a7f3d0';
          ctx.font = 'bold 9px ui-monospace, monospace';
          ctx.fillText(`$${matchedDiv.amount.toFixed(2)}`, x, divPillY + divPillH / 2 + 0.5);

          // Timeline marker at bottom date axis
          const timelineY = marginTop + plotHeight - 12;
          ctx.beginPath();
          ctx.arc(x, timelineY, 7, 0, Math.PI * 2);
          ctx.fillStyle = '#059669';
          ctx.fill();
          ctx.strokeStyle = '#6ee7b7';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8.5px sans-serif';
          ctx.fillText('D', x, timelineY);

          ctx.restore();

          eventHotspots.push({
            type: 'dividend',
            x,
            y: divBadgeY,
            r: 14,
            data: {
              ...matchedDiv,
              candle: c,
              reactionDiff: priceReactionDiff,
              reactionPct: priceReactionPct,
              isUpReaction,
            },
          });
        }
      });

      // Draw Upcoming Earnings milestone tag on the right edge
      if (activeEvents.nextEarningsDate) {
        const upX = marginLeft + plotWidth - 146;
        const upY = marginTop + 38;

        ctx.save();
        ctx.fillStyle = 'rgba(88, 28, 135, 0.9)';
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(upX, upY, 142, 23, 5) : ctx.rect(upX, upY, 142, 23);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f3e8ff';
        ctx.font = 'bold 9.5px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`📅 [E] ${activeEvents.nextEarningsDate}`, upX + 6, upY + 11.5);

        if (activeEvents.nextEarningsEPS) {
          ctx.fillStyle = '#e9d5ff';
          ctx.font = 'bold 9px ui-monospace, monospace';
          ctx.textAlign = 'right';
          ctx.fillText(`${activeEvents.nextEarningsEPS}`, upX + 136, upY + 11.5);
        }
        ctx.restore();
      }

      // Draw Upcoming Dividend milestone tag on the right edge
      if (activeEvents.nextExDate && activeEvents.dividendYield && activeEvents.dividendYield !== 'None' && activeEvents.dividendYield !== '0.00%') {
        const upDivX = marginLeft + plotWidth - 146;
        const upDivY = marginTop + 66;

        ctx.save();
        ctx.fillStyle = 'rgba(6, 78, 59, 0.9)';
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(upDivX, upDivY, 142, 23, 5) : ctx.rect(upDivX, upDivY, 142, 23);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ecfdf5';
        ctx.font = 'bold 9.5px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`💰 [D] Ex: ${activeEvents.nextExDate}`, upDivX + 6, upDivY + 11.5);

        const payoutText = activeEvents.quarterlyDividend || activeEvents.annualDividend;
        if (payoutText) {
          ctx.fillStyle = '#a7f3d0';
          ctx.font = 'bold 9px ui-monospace, monospace';
          ctx.textAlign = 'right';
          ctx.fillText(`${payoutText}`, upDivX + 136, upDivY + 11.5);
        }
        ctx.restore();
      }
    }

    // 8. Interactive Crosshair on Mouse Move
    if (mousePos && mousePos.x >= marginLeft && mousePos.x <= marginLeft + plotWidth) {
      const x = mousePos.x;
      const y = mousePos.y;

      // Dashed vertical and horizontal crosshair lines
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;

      // Vertical
      ctx.moveTo(x, marginTop);
      ctx.lineTo(x, marginTop + plotHeight);

      // Horizontal
      if (y >= marginTop && y <= marginTop + plotHeight) {
        ctx.moveTo(marginLeft, y);
        ctx.lineTo(marginLeft + plotWidth, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Hovered Price Badge on Right Axis
      if (y >= marginTop && y <= marginTop + plotHeight) {
        const hoveredPrice = chartMax - ((y - marginTop) / priceHeight) * priceRange;
        const hBadgeH = 20;
        const hBadgeW = marginRight - 8;
        const hBadgeX = marginLeft + plotWidth + 3;
        const hBadgeY = y - hBadgeH / 2;

        ctx.fillStyle = isAmber ? '#451a03' : '#1e293b';
        ctx.beginPath();
        ctx.roundRect
          ? ctx.roundRect(hBadgeX, hBadgeY, hBadgeW, hBadgeH, 3)
          : ctx.rect(hBadgeX, hBadgeY, hBadgeW, hBadgeH);
        ctx.fill();
        ctx.strokeStyle = isAmber ? '#b45309' : '#64748b';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const formattedHover = hoveredPrice >= 1000
          ? `$${hoveredPrice.toLocaleString('en-US', { maximumFractionDigits: 1 })}`
          : `$${hoveredPrice.toFixed(2)}`;
        ctx.fillText(formattedHover, hBadgeX + hBadgeW / 2, y);
      }
    }

    // 9. Interactive Event Marker Tooltip Popover (Appears on hover near any [E] or [D] badge)
    if (mousePos && eventHotspots.length > 0) {
      const hoveredSpot = eventHotspots.find((h) => {
        const dx = mousePos.x - h.x;
        const dy = mousePos.y - h.y;
        return Math.sqrt(dx * dx + dy * dy) <= 18;
      });

      if (hoveredSpot) {
        const isEarn = hoveredSpot.type === 'earnings';
        const cardW = 230;
        const cardH = 80;
        let cardX = hoveredSpot.x - cardW / 2;
        if (cardX < marginLeft + 4) cardX = marginLeft + 4;
        if (cardX + cardW > marginLeft + plotWidth) cardX = marginLeft + plotWidth - cardW - 4;
        const cardY = Math.max(marginTop + 8, hoveredSpot.y - cardH - 16);

        ctx.save();
        ctx.shadowColor = isEarn ? 'rgba(168, 85, 247, 0.75)' : 'rgba(16, 185, 129, 0.75)';
        ctx.shadowBlur = 16;
        ctx.fillStyle = isEarn ? 'rgba(28, 16, 48, 0.97)' : 'rgba(6, 36, 26, 0.97)';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(cardX, cardY, cardW, cardH, 6) : ctx.rect(cardX, cardY, cardW, cardH);
        ctx.fill();
        ctx.strokeStyle = isEarn ? '#c084fc' : '#34d399';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.shadowBlur = 0;
        if (isEarn) {
          ctx.fillStyle = '#e9d5ff';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(`📅 Earnings Reaction & Result`, cardX + 10, cardY + 8);

          // Reaction line
          const rDiff = hoveredSpot.data.reactionDiff;
          const rPct = hoveredSpot.data.reactionPct;
          const isUp = hoveredSpot.data.isUpReaction;
          ctx.fillStyle = isUp ? '#34d399' : '#f87171';
          ctx.font = 'bold 11px ui-monospace, monospace';
          const rText = typeof rDiff === 'number'
            ? `${isUp ? '▲ Gain' : '▼ Drop'}: ${rDiff >= 0 ? '+' : ''}$${rDiff.toFixed(2)} (${rPct >= 0 ? '+' : ''}${rPct.toFixed(2)}%)`
            : 'Event Recorded';
          ctx.fillText(rText, cardX + 10, cardY + 25);

          // Date and quarter
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px ui-monospace, monospace';
          ctx.fillText(
            `${hoveredSpot.data.date || 'Report Date'} (${hoveredSpot.data.timeOfDay || 'AMC'}) · ${hoveredSpot.data.fiscalQuarter || 'Quarterly'}`,
            cardX + 10,
            cardY + 44
          );

          // Consensus EPS
          ctx.fillStyle = '#c084fc';
          ctx.font = 'bold 9.5px sans-serif';
          const eps = hoveredSpot.data.consensusEPS
            ? `Consensus EPS: ${hoveredSpot.data.consensusEPS}`
            : 'Official Earnings Report';
          ctx.fillText(eps, cardX + 10, cardY + 62);
        } else {
          ctx.fillStyle = '#a7f3d0';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(`💰 Cash Dividend Ex-Date & Move`, cardX + 10, cardY + 8);

          // Cash amount
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11.5px ui-monospace, monospace';
          const amountVal = hoveredSpot.data.amount;
          const amountStr = typeof amountVal === 'number'
            ? `$${amountVal.toFixed(2)} / share distribution`
            : String(amountVal);
          ctx.fillText(amountStr, cardX + 10, cardY + 25);

          // Ex-date price move
          const rDiff = hoveredSpot.data.reactionDiff;
          const rPct = hoveredSpot.data.reactionPct;
          const isUp = hoveredSpot.data.isUpReaction;
          ctx.fillStyle = isUp ? '#34d399' : '#f87171';
          ctx.font = 'bold 10px ui-monospace, monospace';
          const rText = typeof rDiff === 'number'
            ? `Ex-Date Move: ${rDiff >= 0 ? '+' : ''}$${rDiff.toFixed(2)} (${rPct >= 0 ? '+' : ''}${rPct.toFixed(2)}%)`
            : 'Cash Dividend';
          ctx.fillText(rText, cardX + 10, cardY + 44);

          ctx.fillStyle = '#a7f3d0';
          ctx.font = 'bold 9.5px sans-serif';
          ctx.fillText(
            `Ex-Date: ${hoveredSpot.data.date || 'Distribution'}`,
            cardX + 10,
            cardY + 62
          );
        }
        ctx.restore();
      }
    }
  }, [
    displayCandles,
    sma20,
    sma50,
    chartStyle,
    themeMode,
    liveQuote,
    showMovingAverages,
    mousePos,
    timeRange,
    showPatterns,
    activePattern,
    showEvents,
    corporateEvents,
    localEvents,
    chartDividends,
  ]);

  // Handle Mouse Move for inspection
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container || displayCandles.length === 0) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const marginLeft = 10;
    const marginRight = 84;
    const plotWidth = rect.width - marginLeft - marginRight;

    if (x >= marginLeft && x <= marginLeft + plotWidth) {
      const idx = Math.floor(((x - marginLeft) / plotWidth) * displayCandles.length);
      const clampedIdx = Math.max(0, Math.min(displayCandles.length - 1, idx));
      setHoveredCandle(displayCandles[clampedIdx]);
    } else {
      setHoveredCandle(null);
    }
  };

  const handleMouseLeave = () => {
    setMousePos(null);
    setHoveredCandle(null);
  };

  const activeCandle = hoveredCandle || displayCandles[displayCandles.length - 1];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full select-none cursor-crosshair overflow-hidden"
    >
      {/* Top Left Real-Time Candle Data Bar */}
      {stock.isPrivate ? (
        <div className="absolute top-2 left-4 z-10 flex items-center gap-2 font-mono text-[11px] bg-amber-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-600/40 text-amber-200 pointer-events-none">
          <span className="font-bold text-amber-300">SpaceX Private Valuation Tracker</span>
          <span className="text-amber-400/50">•</span>
          <span>Secondary Tender Market: <strong className="text-white">$210.0B</strong></span>
          <span className="hidden md:inline text-amber-400/50">•</span>
          <span className="hidden md:inline text-amber-300/80">Comps: LMT, RTX, BA, RKLB</span>
        </div>
      ) : activeCandle ? (
        <div className="absolute top-2 left-4 z-10 flex items-center gap-2.5 font-mono text-[11px] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 pointer-events-none">
          <span className="text-white font-bold">
            {new Date(activeCandle.time * 1000).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span>O: <strong className="text-white">${activeCandle.open.toFixed(2)}</strong></span>
          <span>H: <strong className="text-emerald-400">${activeCandle.high.toFixed(2)}</strong></span>
          <span>L: <strong className="text-rose-400">${activeCandle.low.toFixed(2)}</strong></span>
          <span>C: <strong className="text-white">${activeCandle.close.toFixed(2)}</strong></span>
          <span className="hidden sm:inline">
            Vol: <strong className="text-slate-400">{(activeCandle.volume / 1000000).toFixed(1)}M</strong>
          </span>
        </div>
      ) : null}

      {/* Top Center-Right: Active Pattern Recognition HUD Badge */}
      {showPatterns && activePattern && (
        <div
          title={activePattern.description}
          className={`absolute top-2 right-24 z-10 hidden sm:flex items-center gap-2 font-mono text-[11px] backdrop-blur-md px-3 py-1.5 rounded-lg border shadow-lg transition-all ${
            activePattern.type === 'bearish'
              ? 'bg-rose-950/85 border-rose-500/50 text-rose-200 shadow-rose-950/50'
              : activePattern.type === 'neutral'
              ? 'bg-slate-900/90 border-amber-500/50 text-amber-200 shadow-slate-950/50'
              : 'bg-emerald-950/85 border-emerald-500/50 text-emerald-200 shadow-emerald-950/50'
          }`}
        >
          {activePattern.type === 'bearish' ? (
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
          ) : activePattern.type === 'neutral' ? (
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          )}

          {/* Directional Trade Bias Pill */}
          <span
            className={`px-1.5 py-0.5 rounded font-bold text-[9px] tracking-wider border ${
              activePattern.type === 'bearish'
                ? 'bg-rose-500/25 border-rose-400/40 text-rose-200'
                : activePattern.type === 'neutral'
                ? 'bg-amber-500/25 border-amber-400/40 text-amber-200'
                : 'bg-emerald-500/25 border-emerald-400/40 text-emerald-200'
            }`}
          >
            {activePattern.biasLabel || activePattern.type.toUpperCase()}
          </span>

          <span className="font-bold text-white max-w-[200px] truncate">{activePattern.name}</span>
          <span className="opacity-40">•</span>

          <span
            className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${
              activePattern.type === 'bearish'
                ? 'bg-rose-900/60 text-rose-300'
                : activePattern.type === 'neutral'
                ? 'bg-amber-900/60 text-amber-300'
                : 'bg-emerald-900/60 text-emerald-300'
            }`}
          >
            {activePattern.status}
          </span>
          <span className="opacity-40">•</span>

          <span className="text-white">
            Target:{' '}
            <strong
              className={`font-bold ${
                activePattern.type === 'bearish'
                  ? 'text-rose-400'
                  : activePattern.type === 'neutral'
                  ? 'text-amber-300'
                  : 'text-emerald-400'
              }`}
            >
              ${activePattern.targetPrice.toFixed(2)}
            </strong>
            <span
              className={`text-[10px] ml-0.5 ${
                activePattern.type === 'bearish'
                  ? 'text-rose-400'
                  : activePattern.type === 'neutral'
                  ? 'text-amber-300'
                  : 'text-emerald-400'
              }`}
            >
              ({activePattern.targetPercent >= 0 ? '+' : ''}
              {activePattern.targetPercent}%)
            </span>
          </span>

          {/* Stop Loss Level */}
          <span className="text-slate-400 hidden lg:inline">
            SL:{' '}
            <strong
              className={activePattern.type === 'bearish' ? 'text-amber-300' : 'text-rose-300'}
            >
              ${activePattern.stopLossPrice.toFixed(2)}
            </strong>
          </span>

          {/* Realistic Probability Confidence */}
          <span
            className={`text-[10px] font-semibold ${
              activePattern.type === 'bearish'
                ? 'text-rose-300/80'
                : activePattern.type === 'neutral'
                ? 'text-amber-300/80'
                : 'text-emerald-300/80'
            }`}
          >
            ({activePattern.confidence}% prob)
          </span>

          {/* Multi-pattern cycler if more than one candidate exists */}
          {detectedPatterns.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPatternIndex((prev) => (prev + 1) % detectedPatterns.length);
              }}
              title={`Cycle through ${detectedPatterns.length} detected patterns`}
              className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] border border-white/20 ml-1 transition-colors cursor-pointer"
            >
              {selectedPatternIndex + 1}/{detectedPatterns.length} ↻
            </button>
          )}
        </div>
      )}

      {/* Moving Average Legend */}
      {showMovingAverages && (
        <div className="absolute top-2 right-2 z-10 hidden md:flex items-center gap-2 font-mono text-[10px] bg-black/60 px-2 py-1 rounded border border-white/10 pointer-events-none">
          <span className="flex items-center gap-1 text-cyan-400 font-semibold">
            <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
            SMA 20
          </span>
          <span className="flex items-center gap-1 text-purple-400 font-semibold">
            <span className="w-2.5 h-0.5 bg-purple-400 inline-block" />
            SMA 50
          </span>
        </div>
      )}

      {/* Corporate Events Legend & Quick Milestone Chips */}
      {showEvents && activeEvents && (activeEvents.nextEarningsDate || activeEvents.nextExDate) && (
        <div className="absolute bottom-7 left-4 z-10 hidden sm:flex items-center gap-2 font-mono text-[10px] bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/15 shadow-xl pointer-events-auto">
          {activeEvents.nextEarningsDate && (
            <div
              className="flex items-center gap-1.5 text-violet-300 font-semibold"
              title={activeEvents.nextEarningsAnnouncement || `Upcoming Earnings on ${activeEvents.nextEarningsDate}`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-[8.5px] shadow-sm">
                E
              </span>
              <span>Next Earnings: <strong className="text-white">{activeEvents.nextEarningsDate}</strong></span>
              {activeEvents.nextEarningsEPS && (
                <span className="text-violet-400 font-mono text-[9px]">({activeEvents.nextEarningsEPS})</span>
              )}
            </div>
          )}

          {activeEvents.nextEarningsDate && activeEvents.nextExDate && (
            <span className="text-white/20">•</span>
          )}

          {activeEvents.nextExDate && activeEvents.dividendYield && activeEvents.dividendYield !== 'None' && activeEvents.dividendYield !== '0.00%' && (
            <div
              className="flex items-center gap-1.5 text-emerald-300 font-semibold"
              title={`Dividend Yield: ${activeEvents.dividendYield} · Next Ex-Dividend Date: ${activeEvents.nextExDate}`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[8.5px] shadow-sm">
                D
              </span>
              <span>Ex-Div: <strong className="text-white">{activeEvents.nextExDate}</strong></span>
              {activeEvents.quarterlyDividend && activeEvents.quarterlyDividend !== '$0.00' && (
                <span className="text-emerald-400 font-mono text-[9px]">({activeEvents.quarterlyDividend})</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Subtle Hairline Progress Indicator at Top (NO intrusive center modal) */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 animate-pulse pointer-events-none z-20" />
      )}

      {/* HTML5 Canvas Rendering Area */}
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
