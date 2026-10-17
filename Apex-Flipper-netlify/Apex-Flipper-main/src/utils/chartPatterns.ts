import { Candle } from '../components/NativeStockChart';

export interface KeyPoint {
  index: number;
  time: number;
  price: number;
  label?: string;
}

export interface PatternLine {
  x1Index: number;
  y1Price: number;
  x2Index: number;
  y2Price: number;
  color?: string;
  dash?: number[];
  lineWidth?: number;
  label?: string;
}

export interface DetectedPattern {
  id: string;
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  confidence: number; // Calibrated realistic probability (52% to 78%)
  status: 'Forming' | 'Active' | 'Breakout Confirmed' | 'Near Apex';
  description: string;
  targetPrice: number;
  targetPercent: number;
  stopLossPrice: number;
  riskRewardRatio?: number;
  biasLabel?: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  keyPoints: KeyPoint[];
  lines: PatternLine[];
  polygon?: { index: number; price: number }[];
  highlightRange?: { startIndex: number; endIndex: number };
  specificityScore?: number;
}

// Swing point detection
interface SwingPoint {
  index: number;
  time: number;
  price: number;
  type: 'high' | 'low';
}

function findSwings(candles: Candle[], windowSize: number): SwingPoint[] {
  const swings: SwingPoint[] = [];
  const n = candles.length;
  if (n < windowSize * 2 + 1) return swings;

  for (let i = windowSize; i < n - windowSize; i++) {
    const cur = candles[i];
    let isHigh = true;
    let isLow = true;

    for (let j = i - windowSize; j <= i + windowSize; j++) {
      if (j === i) continue;
      if (candles[j].high >= cur.high) isHigh = false;
      if (candles[j].low <= cur.low) isLow = false;
    }

    if (isHigh) {
      swings.push({ index: i, time: cur.time, price: cur.high, type: 'high' });
    } else if (isLow) {
      swings.push({ index: i, time: cur.time, price: cur.low, type: 'low' });
    }
  }

  return swings;
}

/**
 * Calculates a realistic, statistical confidence rating (typically 54% to 78%)
 * based on empirical pattern study base rates and real confluence factors.
 */
function calibrateConfidence(
  baseRate: number,
  symmetryFactor: number, // 0 (poor) to 1 (perfect)
  status: 'Forming' | 'Active' | 'Breakout Confirmed' | 'Near Apex',
  trendConfluence: boolean
): number {
  let score = baseRate;

  // Symmetry & geometry precision (+0% to +5%)
  score += Math.round(symmetryFactor * 5);

  // Status progression: Breakout confirmed is statistically stronger than forming
  if (status === 'Breakout Confirmed') score += 5;
  else if (status === 'Near Apex' || status === 'Active') score += 2;
  else if (status === 'Forming') score -= 3;

  // Trend confluence bonus/penalty
  if (trendConfluence) score += 3;
  else score -= 2;

  // Clamp within institutional empirical bounds: 52% to 78%
  return Math.max(52, Math.min(78, score));
}

/**
 * Institutional-Grade, Balanced Technical Pattern Recognition Engine.
 * Evaluates both sides of the trade (Bullish & Bearish) with equal mathematical rigor.
 */
export function detectChartPatterns(candles: Candle[]): DetectedPattern[] {
  if (!candles || candles.length < 15) return [];

  const candidatePatterns: DetectedPattern[] = [];
  const n = candles.length;
  const latestPrice = candles[n - 1].close;

  // Overall moving average and trend context
  const startPrice = candles[0].close;
  const netSlope = (latestPrice - startPrice) / startPrice;
  const isBroadUptrend = netSlope > 0.01;
  const isBroadDowntrend = netSlope < -0.01;

  // Dynamic swing window based on candle series resolution
  const swingWindow = Math.max(2, Math.min(4, Math.floor(n / 28)));
  const swings = findSwings(candles, swingWindow);
  const highs = swings.filter((s) => s.type === 'high');
  const lows = swings.filter((s) => s.type === 'low');

  // =========================================================================
  // 1. BEARISH: Head and Shoulders ("H&S" Distribution Reversal)
  // =========================================================================
  if (highs.length >= 3) {
    for (let i = highs.length - 3; i >= Math.max(0, highs.length - 6); i--) {
      const ls = highs[i];
      const head = highs[i + 1];
      const rs = highs[i + 2];

      // Structural requirements: Head higher than both shoulders
      if (
        head.price > ls.price * 1.015 &&
        head.price > rs.price * 1.015 &&
        head.index - ls.index >= 3 &&
        rs.index - head.index >= 3
      ) {
        const shoulderDiff = Math.abs(ls.price - rs.price) / Math.min(ls.price, rs.price);
        if (shoulderDiff <= 0.055) { // Shoulders within 5.5%
          // Find intervening neckline troughs
          const t1 = lows.find((l) => l.index > ls.index && l.index < head.index);
          const t2 = lows.find((l) => l.index > head.index && l.index < rs.index);

          if (t1 && t2) {
            const avgNeckline = (t1.price + t2.price) / 2;
            const patternHeight = head.price - avgNeckline;
            const target = Number((avgNeckline - patternHeight).toFixed(2));
            const targetPct = Number((((target - latestPrice) / latestPrice) * 100).toFixed(1));
            const stopLoss = Number((rs.price * 1.015).toFixed(2));

            const isConfirmed = latestPrice <= avgNeckline;
            const isNearApex = !isConfirmed && latestPrice <= avgNeckline + patternHeight * 0.35;
            const status = isConfirmed ? 'Breakout Confirmed' : isNearApex ? 'Near Apex' : 'Active';

            const symmetry = 1 - shoulderDiff / 0.055;
            const confidence = calibrateConfidence(66, symmetry, status, isBroadDowntrend);

            const risk = Math.abs(latestPrice - stopLoss) || 0.01;
            const reward = Math.abs(latestPrice - target);
            const rr = Number((reward / risk).toFixed(1));

            candidatePatterns.push({
              id: 'head-and-shoulders',
              name: 'Head & Shoulders (Bearish Distribution Top)',
              type: 'bearish',
              biasLabel: 'BEARISH',
              confidence,
              status,
              specificityScore: 95,
              description: `Classic 3-peak distribution top with Head at $${head.price.toFixed(2)} flanked by Left ($${ls.price.toFixed(2)}) and Right ($${rs.price.toFixed(2)}) shoulders. Neckline support at $${avgNeckline.toFixed(2)}.`,
              targetPrice: target,
              targetPercent: targetPct,
              stopLossPrice: stopLoss,
              riskRewardRatio: rr,
              keyPoints: [
                { index: ls.index, time: ls.time, price: ls.price, label: 'L.Shoulder' },
                { index: t1.index, time: t1.time, price: t1.price, label: 'Trough 1' },
                { index: head.index, time: head.time, price: head.price, label: 'Head Peak' },
                { index: t2.index, time: t2.time, price: t2.price, label: 'Trough 2' },
                { index: rs.index, time: rs.time, price: rs.price, label: 'R.Shoulder' },
              ],
              lines: [
                { x1Index: ls.index, y1Price: ls.price, x2Index: t1.index, y2Price: t1.price, color: '#f43f5e', lineWidth: 2 },
                { x1Index: t1.index, y1Price: t1.price, x2Index: head.index, y2Price: head.price, color: '#f43f5e', lineWidth: 2 },
                { x1Index: head.index, y1Price: head.price, x2Index: t2.index, y2Price: t2.price, color: '#f43f5e', lineWidth: 2 },
                { x1Index: t2.index, y1Price: t2.price, x2Index: rs.index, y2Price: rs.price, color: '#f43f5e', lineWidth: 2 },
                // Neckline
                { x1Index: t1.index, y1Price: t1.price, x2Index: n - 1, y2Price: t2.price, color: '#ef4444', dash: [5, 4], lineWidth: 2, label: 'Neckline Support' },
              ],
              polygon: [
                { index: ls.index, price: ls.price },
                { index: head.index, price: head.price },
                { index: rs.index, price: rs.price },
                { index: t2.index, price: t2.price },
                { index: t1.index, price: t1.price },
              ],
              highlightRange: { startIndex: ls.index, endIndex: n - 1 },
            });
            break;
          }
        }
      }
    }
  }

  // =========================================================================
  // 2. BULLISH: Inverse Head and Shoulders (Accumulation Reversal)
  // =========================================================================
  if (lows.length >= 3) {
    for (let i = lows.length - 3; i >= Math.max(0, lows.length - 6); i--) {
      const ls = lows[i];
      const head = lows[i + 1];
      const rs = lows[i + 2];

      if (
        head.price < ls.price * 0.985 &&
        head.price < rs.price * 0.985 &&
        head.index - ls.index >= 3 &&
        rs.index - head.index >= 3
      ) {
        const shoulderDiff = Math.abs(ls.price - rs.price) / Math.min(ls.price, rs.price);
        if (shoulderDiff <= 0.055) {
          const p1 = highs.find((h) => h.index > ls.index && h.index < head.index);
          const p2 = highs.find((h) => h.index > head.index && h.index < rs.index);

          if (p1 && p2) {
            const avgNeckline = (p1.price + p2.price) / 2;
            const patternHeight = avgNeckline - head.price;
            const target = Number((avgNeckline + patternHeight).toFixed(2));
            const targetPct = Number((((target - latestPrice) / latestPrice) * 100).toFixed(1));
            const stopLoss = Number((rs.price * 0.985).toFixed(2));

            const isConfirmed = latestPrice >= avgNeckline;
            const isNearApex = !isConfirmed && latestPrice >= avgNeckline - patternHeight * 0.35;
            const status = isConfirmed ? 'Breakout Confirmed' : isNearApex ? 'Near Apex' : 'Active';

            const symmetry = 1 - shoulderDiff / 0.055;
            const confidence = calibrateConfidence(67, symmetry, status, isBroadUptrend);

            const risk = Math.abs(latestPrice - stopLoss) || 0.01;
            const reward = Math.abs(target - latestPrice);
            const rr = Number((reward / risk).toFixed(1));

            candidatePatterns.push({
              id: 'inv-head-and-shoulders',
              name: 'Inverse Head & Shoulders (Bullish Reversal Bottom)',
              type: 'bullish',
              biasLabel: 'BULLISH',
              confidence,
              status,
              specificityScore: 95,
              description: `Institutional accumulation base with low at $${head.price.toFixed(2)} between Left ($${ls.price.toFixed(2)}) and Right ($${rs.price.toFixed(2)}) shoulders. Overhead neckline at $${avgNeckline.toFixed(2)}.`,
              targetPrice: target,
              targetPercent: targetPct,
              stopLossPrice: stopLoss,
              riskRewardRatio: rr,
              keyPoints: [
                { index: ls.index, time: ls.time, price: ls.price, label: 'L.Shoulder' },
                { index: p1.index, time: p1.time, price: p1.price, label: 'Neckline 1' },
                { index: head.index, time: head.time, price: head.price, label: 'Head Base' },
                { index: p2.index, time: p2.time, price: p2.price, label: 'Neckline 2' },
                { index: rs.index, time: rs.time, price: rs.price, label: 'R.Shoulder' },
              ],
              lines: [
                { x1Index: ls.index, y1Price: ls.price, x2Index: p1.index, y2Price: p1.price, color: '#10b981', lineWidth: 2 },
                { x1Index: p1.index, y1Price: p1.price, x2Index: head.index, y2Price: head.price, color: '#10b981', lineWidth: 2 },
                { x1Index: head.index, y1Price: head.price, x2Index: p2.index, y2Price: p2.price, color: '#10b981', lineWidth: 2 },
                { x1Index: p2.index, y1Price: p2.price, x2Index: rs.index, y2Price: rs.price, color: '#10b981', lineWidth: 2 },
                // Neckline
                { x1Index: p1.index, y1Price: p1.price, x2Index: n - 1, y2Price: p2.price, color: '#059669', dash: [5, 4], lineWidth: 2, label: 'Neckline Resistance' },
              ],
              polygon: [
                { index: ls.index, price: ls.price },
                { index: head.index, price: head.price },
                { index: rs.index, price: rs.price },
                { index: p2.index, price: p2.price },
                { index: p1.index, price: p1.price },
              ],
              highlightRange: { startIndex: ls.index, endIndex: n - 1 },
            });
            break;
          }
        }
      }
    }
  }

  // =========================================================================
  // 3. BEARISH: Double Top ("M" Reversal)
  // =========================================================================
  if (highs.length >= 2) {
    for (let i = highs.length - 2; i >= Math.max(0, highs.length - 5); i--) {
      const h1 = highs[i];
      const h2 = highs[i + 1];

      if (h2.index - h1.index >= 4 && n - 1 - h2.index <= 28) {
        const priceDiff = Math.abs(h1.price - h2.price) / Math.min(h1.price, h2.price);
        if (priceDiff <= 0.038) {
          const trough = lows.find((l) => l.index > h1.index && l.index < h2.index);
          if (trough && trough.price < Math.min(h1.price, h2.price) * 0.975) {
            const patternHeight = Math.max(h1.price, h2.price) - trough.price;
            const target = Number((trough.price - patternHeight).toFixed(2));
            const targetPct = Number((((target - latestPrice) / latestPrice) * 100).toFixed(1));
            const stopLoss = Number((Math.max(h1.price, h2.price) * 1.015).toFixed(2));

            const isConfirmed = latestPrice <= trough.price;
            const status = isConfirmed ? 'Breakout Confirmed' : latestPrice <= trough.price * 1.02 ? 'Near Apex' : 'Active';

            const symmetry = 1 - priceDiff / 0.038;
            const confidence = calibrateConfidence(64, symmetry, status, isBroadDowntrend);

            const risk = Math.abs(latestPrice - stopLoss) || 0.01;
            const reward = Math.abs(latestPrice - target);
            const rr = Number((reward / risk).toFixed(1));

            candidatePatterns.push({
              id: 'double-top',
              name: 'Double Top ("M" Reversal)',
              type: 'bearish',
              biasLabel: 'BEARISH',
              confidence,
              status,
              specificityScore: 90,
              description: `Twin resistance peaks at $${h1.price.toFixed(2)} and $${h2.price.toFixed(2)} failing to break higher, with critical support neckline at $${trough.price.toFixed(2)}.`,
              targetPrice: target,
              targetPercent: targetPct,
              stopLossPrice: stopLoss,
              riskRewardRatio: rr,
              keyPoints: [
                { index: h1.index, time: h1.time, price: h1.price, label: 'Peak 1' },
                { index: trough.index, time: trough.time, price: trough.price, label: 'Neckline' },
                { index: h2.index, time: h2.time, price: h2.price, label: 'Peak 2' },
              ],
              lines: [
                { x1Index: h1.index, y1Price: h1.price, x2Index: trough.index, y2Price: trough.price, color: '#ef4444', lineWidth: 2 },
                { x1Index: trough.index, y1Price: trough.price, x2Index: h2.index, y2Price: h2.price, color: '#ef4444', lineWidth: 2 },
                { x1Index: h2.index, y1Price: h2.price, x2Index: n - 1, y2Price: latestPrice, color: '#ef4444', lineWidth: 2 },
                { x1Index: h1.index, y1Price: trough.price, x2Index: n - 1, y2Price: trough.price, color: '#f59e0b', dash: [5, 4], lineWidth: 1.5, label: 'Neckline' },
              ],
              polygon: [
                { index: h1.index, price: h1.price },
                { index: trough.index, price: trough.price },
                { index: h2.index, price: h2.price },
              ],
              highlightRange: { startIndex: h1.index, endIndex: n - 1 },
            });
            break;
          }
        }
      }
    }
  }

  // =========================================================================
  // 4. BULLISH: Double Bottom ("W" Reversal)
  // =========================================================================
  if (lows.length >= 2) {
    for (let i = lows.length - 2; i >= Math.max(0, lows.length - 5); i--) {
      const l1 = lows[i];
      const l2 = lows[i + 1];

      if (l2.index - l1.index >= 4 && n - 1 - l2.index <= 28) {
        const priceDiff = Math.abs(l1.price - l2.price) / Math.min(l1.price, l2.price);
        if (priceDiff <= 0.038) {
          const peak = highs.find((h) => h.index > l1.index && h.index < l2.index);
          if (peak && peak.price > Math.max(l1.price, l2.price) * 1.025) {
            const patternHeight = peak.price - Math.min(l1.price, l2.price);
            const target = Number((peak.price + patternHeight).toFixed(2));
            const targetPct = Number((((target - latestPrice) / latestPrice) * 100).toFixed(1));
            const stopLoss = Number((Math.min(l1.price, l2.price) * 0.985).toFixed(2));

            const isConfirmed = latestPrice >= peak.price;
            const status = isConfirmed ? 'Breakout Confirmed' : latestPrice >= peak.price * 0.98 ? 'Near Apex' : 'Active';

            const symmetry = 1 - priceDiff / 0.038;
            const confidence = calibrateConfidence(65, symmetry, status, isBroadUptrend);

            const risk = Math.abs(latestPrice - stopLoss) || 0.01;
            const reward = Math.abs(target - latestPrice);
            const rr = Number((reward / risk).toFixed(1));

            candidatePatterns.push({
              id: 'double-bottom',
              name: 'Double Bottom ("W" Reversal)',
              type: 'bullish',
              biasLabel: 'BULLISH',
              confidence,
              status,
              specificityScore: 90,
              description: `Twin accumulation support lows at $${l1.price.toFixed(2)} and $${l2.price.toFixed(2)} repelling sellers, with breakout neckline at $${peak.price.toFixed(2)}.`,
              targetPrice: target,
              targetPercent: targetPct,
              stopLossPrice: stopLoss,
              riskRewardRatio: rr,
              keyPoints: [
                { index: l1.index, time: l1.time, price: l1.price, label: 'Low 1' },
                { index: peak.index, time: peak.time, price: peak.price, label: 'Neckline' },
                { index: l2.index, time: l2.time, price: l2.price, label: 'Low 2' },
              ],
              lines: [
                { x1Index: l1.index, y1Price: l1.price, x2Index: peak.index, y2Price: peak.price, color: '#10b981', lineWidth: 2 },
                { x1Index: peak.index, y1Price: peak.price, x2Index: l2.index, y2Price: l2.price, color: '#10b981', lineWidth: 2 },
                { x1Index: l2.index, y1Price: l2.price, x2Index: n - 1, y2Price: latestPrice, color: '#10b981', lineWidth: 2 },
                { x1Index: l1.index, y1Price: peak.price, x2Index: n - 1, y2Price: peak.price, color: '#f59e0b', dash: [5, 4], lineWidth: 1.5, label: 'Neckline' },
              ],
              polygon: [
                { index: l1.index, price: l1.price },
                { index: peak.index, price: peak.price },
                { index: l2.index, price: l2.price },
              ],
              highlightRange: { startIndex: l1.index, endIndex: n - 1 },
            });
            break;
          }
        }
      }
    }
  }

  // =========================================================================
  // 5. BEARISH: Descending Triangle (Support Floor, Lower Highs)
  // =========================================================================
  if (highs.length >= 2 && lows.length >= 2) {
    const rHighs = highs.slice(-3);
    const rLows = lows.slice(-3);
    if (rHighs.length >= 2 && rLows.length >= 2) {
      const h1 = rHighs[rHighs.length - 2];
      const h2 = rHighs[rHighs.length - 1];
      const l1 = rLows[rLows.length - 2];
      const l2 = rLows[rLows.length - 1];

      const lowVariance = Math.abs(l1.price - l2.price) / Math.min(l1.price, l2.price);
      const isDescendingHighs = h2.price < h1.price * 0.988 && h2.index > h1.index;

      if (lowVariance <= 0.028 && isDescendingHighs && l2.index > h1.index) {
        const supportPrice = (l1.price + l2.price) / 2;
        const patternHeight = h1.price - supportPrice;
        const target = Number((supportPrice - patternHeight).toFixed(2));
        const targetPct = Number((((target - latestPrice) / latestPrice) * 100).toFixed(1));
        const stopLoss = Number((h2.price * 1.015).toFixed(2));

        const isConfirmed = latestPrice <= supportPrice;
        const status = isConfirmed ? 'Breakout Confirmed' : 'Near Apex';

        const symmetry = 1 - lowVariance / 0.028;
        const confidence = calibrateConfidence(63, symmetry, status, isBroadDowntrend);

        const risk = Math.abs(latestPrice - stopLoss) || 0.01;
        const reward = Math.abs(latestPrice - target);
        const rr = Number((reward / risk).toFixed(1));

        candidatePatterns.push({
          id: 'descending-triangle',
          name: 'Descending Triangle (Bearish Breakdown)',
          type: 'bearish',
          biasLabel: 'BEARISH',
          confidence,
          status,
          specificityScore: 88,
          description: `Persistent selling pressure creating lower highs pressing aggressively against flat support floor at $${supportPrice.toFixed(2)}.`,
          targetPrice: target,
          targetPercent: targetPct,
          stopLossPrice: stopLoss,
          riskRewardRatio: rr,
          keyPoints: [
            { index: h1.index, time: h1.time, price: h1.price, label: 'Lower High 1' },
            { index: h2.index, time: h2.time, price: h2.price, label: 'Lower High 2' },
            { index: l1.index, time: l1.time, price: l1.price, label: 'Floor 1' },
            { index: l2.index, time: l2.time, price: l2.price, label: 'Floor 2' },
          ],
          lines: [
            // Flat support floor
            { x1Index: Math.min(h1.index, l1.index), y1Price: supportPrice, x2Index: n - 1, y2Price: supportPrice, color: '#ef4444', lineWidth: 2, label: 'Support Floor' },
            // Descending upper resistance trendline
            { x1Index: h1.index, y1Price: h1.price, x2Index: n - 1, y2Price: h2.price + ((h2.price - h1.price) / (h2.index - h1.index)) * (n - 1 - h2.index), color: '#f43f5e', lineWidth: 2, label: 'Descending Resistance' },
          ],
          polygon: [
            { index: h1.index, price: h1.price },
            { index: l1.index, price: supportPrice },
            { index: l2.index, price: supportPrice },
            { index: h2.index, price: h2.price },
          ],
          highlightRange: { startIndex: Math.min(h1.index, l1.index), endIndex: n - 1 },
        });
      }
    }
  }

  // =========================================================================
  // 6. BULLISH: Ascending Triangle (Ceiling Resistance, Higher Lows)
  // =========================================================================
  if (highs.length >= 2 && lows.length >= 2) {
    const rHighs = highs.slice(-3);
    const rLows = lows.slice(-3);
    if (rHighs.length >= 2 && rLows.length >= 2) {
      const h1 = rHighs[rHighs.length - 2];
      const h2 = rHighs[rHighs.length - 1];
      const l1 = rLows[rLows.length - 2];
      const l2 = rLows[rLows.length - 1];

      const highVariance = Math.abs(h1.price - h2.price) / Math.min(h1.price, h2.price);
      const isAscendingLows = l2.price > l1.price * 1.012 && l2.index > l1.index;

      if (highVariance <= 0.028 && isAscendingLows && h2.index > l1.index) {
        const resistancePrice = (h1.price + h2.price) / 2;
        const patternHeight = resistancePrice - l1.price;
        const target = Number((resistancePrice + patternHeight).toFixed(2));
        const targetPct = Number((((target - latestPrice) / latestPrice) * 100).toFixed(1));
        const stopLoss = Number((l2.price * 0.985).toFixed(2));

        const isConfirmed = latestPrice >= resistancePrice;
        const status = isConfirmed ? 'Breakout Confirmed' : 'Near Apex';

        const symmetry = 1 - highVariance / 0.028;
        const confidence = calibrateConfidence(64, symmetry, status, isBroadUptrend);

        const risk = Math.abs(latestPrice - stopLoss) || 0.01;
        const reward = Math.abs(target - latestPrice);
        const rr = Number((reward / risk).toFixed(1));

        candidatePatterns.push({
          id: 'ascending-triangle',
          name: 'Ascending Triangle (Bullish Breakout)',
          type: 'bullish',
          biasLabel: 'BULLISH',
          confidence,
          status,
          specificityScore: 88,
          description: `Buyers stepping in higher on each pullback ($${l1.price.toFixed(2)} → $${l2.price.toFixed(2)}) accumulating into overhead ceiling resistance at $${resistancePrice.toFixed(2)}.`,
          targetPrice: target,
          targetPercent: targetPct,
          stopLossPrice: stopLoss,
          riskRewardRatio: rr,
          keyPoints: [
            { index: h1.index, time: h1.time, price: h1.price, label: 'Ceiling 1' },
            { index: h2.index, time: h2.time, price: h2.price, label: 'Ceiling 2' },
            { index: l1.index, time: l1.time, price: l1.price, label: 'Higher Low 1' },
            { index: l2.index, time: l2.time, price: l2.price, label: 'Higher Low 2' },
          ],
          lines: [
            // Flat resistance ceiling
            { x1Index: Math.min(h1.index, l1.index), y1Price: resistancePrice, x2Index: n - 1, y2Price: resistancePrice, color: '#f59e0b', lineWidth: 2, label: 'Resistance Ceiling' },
            // Ascending support trendline
            { x1Index: l1.index, y1Price: l1.price, x2Index: n - 1, y2Price: l2.price + ((l2.price - l1.price) / (l2.index - l1.index)) * (n - 1 - l2.index), color: '#10b981', lineWidth: 2, label: 'Ascending Support' },
          ],
          polygon: [
            { index: l1.index, price: l1.price },
            { index: h1.index, price: resistancePrice },
            { index: h2.index, price: resistancePrice },
            { index: l2.index, price: l2.price },
          ],
          highlightRange: { startIndex: Math.min(h1.index, l1.index), endIndex: n - 1 },
        });
      }
    }
  }

  // =========================================================================
  // 7. BEARISH: Bear Flag (Impulse Drop + Tight Upward/Sideways Flag)
  // =========================================================================
  if (candles.length >= 20) {
    for (let poleEnd = n - 5; poleEnd >= Math.max(7, n - 25); poleEnd--) {
      for (let poleLen = 4; poleLen <= 10; poleLen++) {
        const poleStart = poleEnd - poleLen;
        if (poleStart < 0) continue;

        const drop = (candles[poleStart].high - candles[poleEnd].low) / candles[poleStart].high;
        if (drop >= 0.045) { // At least -4.5% downward impulse pole
          const flagCandles = candles.slice(poleEnd, n);
          if (flagCandles.length >= 4 && flagCandles.length <= 16) {
            const flagMax = Math.max(...flagCandles.map((c) => c.high));
            const flagMin = Math.min(...flagCandles.map((c) => c.low));
            const poleHeight = candles[poleStart].high - candles[poleEnd].low;

            // Retracement should not exceed 50% of the pole drop
            if (flagMax <= candles[poleEnd].low + poleHeight * 0.5) {
              const target = Number((latestPrice - poleHeight).toFixed(2));
              const targetPct = Number((((target - latestPrice) / latestPrice) * 100).toFixed(1));
              const stopLoss = Number((flagMax * 1.015).toFixed(2));

              const isConfirmed = latestPrice <= flagMin * 1.01;
              const status = isConfirmed ? 'Breakout Confirmed' : 'Active';

              const confidence = calibrateConfidence(65, 0.8, status, isBroadDowntrend);
              const risk = Math.abs(latestPrice - stopLoss) || 0.01;
              const reward = Math.abs(latestPrice - target);
              const rr = Number((reward / risk).toFixed(1));

              candidatePatterns.push({
                id: 'bear-flag',
                name: 'Bear Flag (Momentum Breakdown Continuation)',
                type: 'bearish',
                biasLabel: 'BEARISH',
                confidence,
                status,
                specificityScore: 86,
                description: `Sharp -${(drop * 100).toFixed(1)}% downward flagpole followed by shallow counter-trend relief channel prior to next breakdown leg.`,
                targetPrice: target,
                targetPercent: targetPct,
                stopLossPrice: stopLoss,
                riskRewardRatio: rr,
                keyPoints: [
                  { index: poleStart, time: candles[poleStart].time, price: candles[poleStart].high, label: 'Drop Start' },
                  { index: poleEnd, time: candles[poleEnd].time, price: candles[poleEnd].low, label: 'Pole Base' },
                ],
                lines: [
                  // Downward flagpole
                  { x1Index: poleStart, y1Price: candles[poleStart].high, x2Index: poleEnd, y2Price: candles[poleEnd].low, color: '#f43f5e', lineWidth: 2.5, label: 'Drop Flagpole' },
                  // Flag channels
                  { x1Index: poleEnd, y1Price: flagMax, x2Index: n - 1, y2Price: flagMax * 1.01, color: '#fb7185', lineWidth: 1.5, dash: [4, 3] },
                  { x1Index: poleEnd, y1Price: flagMin, x2Index: n - 1, y2Price: flagMin, color: '#fb7185', lineWidth: 1.5, dash: [4, 3] },
                ],
                polygon: [
                  { index: poleEnd, price: flagMin },
                  { index: n - 1, price: flagMin },
                  { index: n - 1, price: flagMax },
                  { index: poleEnd, price: flagMax },
                ],
                highlightRange: { startIndex: poleStart, endIndex: n - 1 },
              });
              break;
            }
          }
        }
      }
      if (candidatePatterns.some((p) => p.id === 'bear-flag')) break;
    }
  }

  // =========================================================================
  // 8. BULLISH: Bull Flag (Momentum Impulse + Consolidation Channel)
  // =========================================================================
  if (candles.length >= 20) {
    for (let poleEnd = n - 5; poleEnd >= Math.max(7, n - 25); poleEnd--) {
      for (let poleLen = 4; poleLen <= 10; poleLen++) {
        const poleStart = poleEnd - poleLen;
        if (poleStart < 0) continue;

        const gain = (candles[poleEnd].high - candles[poleStart].low) / candles[poleStart].low;
        if (gain >= 0.045) { // At least +4.5% upward impulse pole
          const flagCandles = candles.slice(poleEnd, n);
          if (flagCandles.length >= 4 && flagCandles.length <= 16) {
            const flagMax = Math.max(...flagCandles.map((c) => c.high));
            const flagMin = Math.min(...flagCandles.map((c) => c.low));
            const poleHeight = candles[poleEnd].high - candles[poleStart].low;

            if (flagMin >= candles[poleStart].low + poleHeight * 0.5) {
              const target = Number((latestPrice + poleHeight).toFixed(2));
              const targetPct = Number((((target - latestPrice) / latestPrice) * 100).toFixed(1));
              const stopLoss = Number((flagMin * 0.985).toFixed(2));

              const isConfirmed = latestPrice >= flagMax * 0.99;
              const status = isConfirmed ? 'Breakout Confirmed' : 'Active';

              const confidence = calibrateConfidence(66, 0.8, status, isBroadUptrend);
              const risk = Math.abs(latestPrice - stopLoss) || 0.01;
              const reward = Math.abs(target - latestPrice);
              const rr = Number((reward / risk).toFixed(1));

              candidatePatterns.push({
                id: 'bull-flag',
                name: 'Bull Flag (Momentum Expansion Continuation)',
                type: 'bullish',
                biasLabel: 'BULLISH',
                confidence,
                status,
                specificityScore: 86,
                description: `Powerful +${(gain * 100).toFixed(1)}% upward impulse flagpole followed by orderly consolidation channel before next expansion run.`,
                targetPrice: target,
                targetPercent: targetPct,
                stopLossPrice: stopLoss,
                riskRewardRatio: rr,
                keyPoints: [
                  { index: poleStart, time: candles[poleStart].time, price: candles[poleStart].low, label: 'Pole Start' },
                  { index: poleEnd, time: candles[poleEnd].time, price: candles[poleEnd].high, label: 'Pole Apex' },
                ],
                lines: [
                  // Flagpole
                  { x1Index: poleStart, y1Price: candles[poleStart].low, x2Index: poleEnd, y2Price: candles[poleEnd].high, color: '#06b6d4', lineWidth: 2.5, label: 'Flagpole' },
                  // Channel
                  { x1Index: poleEnd, y1Price: candles[poleEnd].high, x2Index: n - 1, y2Price: flagMax * 0.98, color: '#38bdf8', lineWidth: 1.5, dash: [4, 3] },
                  { x1Index: poleEnd, y1Price: candles[poleEnd].high - poleHeight * 0.25, x2Index: n - 1, y2Price: flagMin, color: '#38bdf8', lineWidth: 1.5, dash: [4, 3] },
                ],
                polygon: [
                  { index: poleEnd, price: candles[poleEnd].high },
                  { index: n - 1, price: flagMax },
                  { index: n - 1, price: flagMin },
                  { index: poleEnd, price: candles[poleEnd].high - poleHeight * 0.25 },
                ],
                highlightRange: { startIndex: poleStart, endIndex: n - 1 },
              });
              break;
            }
          }
        }
      }
      if (candidatePatterns.some((p) => p.id === 'bull-flag')) break;
    }
  }

  // =========================================================================
  // 9. BEARISH: Rising Wedge (Upward narrowing exhaustion / Reversal)
  // =========================================================================
  if (highs.length >= 2 && lows.length >= 2) {
    const rHighs = highs.slice(-3);
    const rLows = lows.slice(-3);
    if (rHighs.length >= 2 && rLows.length >= 2) {
      const h1 = rHighs[rHighs.length - 2];
      const h2 = rHighs[rHighs.length - 1];
      const l1 = rLows[rLows.length - 2];
      const l2 = rLows[rLows.length - 1];

      const slopeHighs = (h2.price - h1.price) / (h2.index - h1.index);
      const slopeLows = (l2.price - l1.price) / (l2.index - l1.index);

      // Both slopes positive, but slope of lows steeper than highs (converging upward)
      if (slopeHighs > 0 && slopeLows > slopeHighs * 1.2 && h2.price > h1.price && l2.price > l1.price) {
        const wedgeHeight = h1.price - l1.price;
        const target = Number((l2.price - wedgeHeight * 0.8).toFixed(2));
        const targetPct = Number((((target - latestPrice) / latestPrice) * 100).toFixed(1));
        const stopLoss = Number((h2.price * 1.015).toFixed(2));

        const status = latestPrice <= l2.price ? 'Breakout Confirmed' : 'Near Apex';
        const confidence = calibrateConfidence(63, 0.75, status, isBroadDowntrend);

        const risk = Math.abs(latestPrice - stopLoss) || 0.01;
        const reward = Math.abs(latestPrice - target);
        const rr = Number((reward / risk).toFixed(1));

        candidatePatterns.push({
          id: 'rising-wedge',
          name: 'Rising Wedge (Bearish Exhaustion / Breakdown)',
          type: 'bearish',
          biasLabel: 'BEARISH',
          confidence,
          status,
          specificityScore: 84,
          description: `Diminishing upward momentum inside narrowing wedge corridor. Higher lows ($${l1.price.toFixed(2)} → $${l2.price.toFixed(2)}) converging tightly into resistance.`,
          targetPrice: target,
          targetPercent: targetPct,
          stopLossPrice: stopLoss,
          riskRewardRatio: rr,
          keyPoints: [
            { index: h1.index, time: h1.time, price: h1.price, label: 'High 1' },
            { index: h2.index, time: h2.time, price: h2.price, label: 'High 2' },
            { index: l1.index, time: l1.time, price: l1.price, label: 'Low 1' },
            { index: l2.index, time: l2.time, price: l2.price, label: 'Low 2' },
          ],
          lines: [
            { x1Index: h1.index, y1Price: h1.price, x2Index: n - 1, y2Price: h2.price + slopeHighs * (n - 1 - h2.index), color: '#ef4444', lineWidth: 2, label: 'Wedge Resistance' },
            { x1Index: l1.index, y1Price: l1.price, x2Index: n - 1, y2Price: l2.price + slopeLows * (n - 1 - l2.index), color: '#f43f5e', lineWidth: 2, label: 'Wedge Support' },
          ],
          polygon: [
            { index: l1.index, price: l1.price },
            { index: h1.index, price: h1.price },
            { index: h2.index, price: h2.price },
            { index: l2.index, price: l2.price },
          ],
          highlightRange: { startIndex: Math.min(h1.index, l1.index), endIndex: n - 1 },
        });
      }
    }
  }

  // =========================================================================
  // 10. BULLISH: Falling Wedge (Downward narrowing accumulation / Reversal)
  // =========================================================================
  if (highs.length >= 2 && lows.length >= 2) {
    const rHighs = highs.slice(-3);
    const rLows = lows.slice(-3);
    if (rHighs.length >= 2 && rLows.length >= 2) {
      const h1 = rHighs[rHighs.length - 2];
      const h2 = rHighs[rHighs.length - 1];
      const l1 = rLows[rLows.length - 2];
      const l2 = rLows[rLows.length - 1];

      const slopeHighs = (h2.price - h1.price) / (h2.index - h1.index);
      const slopeLows = (l2.price - l1.price) / (l2.index - l1.index);

      // Both slopes negative, but slope of highs steeper downward than slope of lows (converging downward)
      if (slopeHighs < 0 && slopeLows < 0 && slopeHighs < slopeLows * 1.2 && h2.price < h1.price && l2.price < l1.price) {
        const wedgeHeight = h1.price - l1.price;
        const target = Number((h2.price + wedgeHeight * 0.8).toFixed(2));
        const targetPct = Number((((target - latestPrice) / latestPrice) * 100).toFixed(1));
        const stopLoss = Number((l2.price * 0.985).toFixed(2));

        const status = latestPrice >= h2.price ? 'Breakout Confirmed' : 'Near Apex';
        const confidence = calibrateConfidence(64, 0.75, status, isBroadUptrend);

        const risk = Math.abs(latestPrice - stopLoss) || 0.01;
        const reward = Math.abs(target - latestPrice);
        const rr = Number((reward / risk).toFixed(1));

        candidatePatterns.push({
          id: 'falling-wedge',
          name: 'Falling Wedge (Bullish Reversal / Accumulation)',
          type: 'bullish',
          biasLabel: 'BULLISH',
          confidence,
          status,
          specificityScore: 84,
          description: `Contracting seller volume inside falling wedge. Price declining into converging apex before upward breakout expansion.`,
          targetPrice: target,
          targetPercent: targetPct,
          stopLossPrice: stopLoss,
          riskRewardRatio: rr,
          keyPoints: [
            { index: h1.index, time: h1.time, price: h1.price, label: 'High 1' },
            { index: h2.index, time: h2.time, price: h2.price, label: 'High 2' },
            { index: l1.index, time: l1.time, price: l1.price, label: 'Low 1' },
            { index: l2.index, time: l2.time, price: l2.price, label: 'Low 2' },
          ],
          lines: [
            { x1Index: h1.index, y1Price: h1.price, x2Index: n - 1, y2Price: h2.price + slopeHighs * (n - 1 - h2.index), color: '#10b981', lineWidth: 2, label: 'Wedge Resistance' },
            { x1Index: l1.index, y1Price: l1.price, x2Index: n - 1, y2Price: l2.price + slopeLows * (n - 1 - l2.index), color: '#059669', lineWidth: 2, label: 'Wedge Support' },
          ],
          polygon: [
            { index: l1.index, price: l1.price },
            { index: h1.index, price: h1.price },
            { index: h2.index, price: h2.price },
            { index: l2.index, price: l2.price },
          ],
          highlightRange: { startIndex: Math.min(h1.index, l1.index), endIndex: n - 1 },
        });
      }
    }
  }

  // =========================================================================
  // 11. NEUTRAL / BILATERAL: Symmetrical Triangle (Consolidation Coil)
  // =========================================================================
  if (highs.length >= 2 && lows.length >= 2) {
    const rHighs = highs.slice(-3);
    const rLows = lows.slice(-3);
    if (rHighs.length >= 2 && rLows.length >= 2) {
      const h1 = rHighs[rHighs.length - 2];
      const h2 = rHighs[rHighs.length - 1];
      const l1 = rLows[rLows.length - 2];
      const l2 = rLows[rLows.length - 1];

      // Lower highs and higher lows converging
      if (h2.price < h1.price * 0.988 && l2.price > l1.price * 1.012) {
        const midPoint = (h2.price + l2.price) / 2;
        const triHeight = h1.price - l1.price;
        const isPressingHigh = latestPrice >= midPoint;

        const target = isPressingHigh
          ? Number((h2.price + triHeight * 0.6).toFixed(2))
          : Number((l2.price - triHeight * 0.6).toFixed(2));
        const targetPct = Number((((target - latestPrice) / latestPrice) * 100).toFixed(1));
        const stopLoss = isPressingHigh ? Number((l2.price * 0.985).toFixed(2)) : Number((h2.price * 1.015).toFixed(2));

        const confidence = calibrateConfidence(59, 0.7, 'Near Apex', false);
        const risk = Math.abs(latestPrice - stopLoss) || 0.01;
        const reward = Math.abs(latestPrice - target);
        const rr = Number((reward / risk).toFixed(1));

        candidatePatterns.push({
          id: 'symmetrical-triangle',
          name: 'Symmetrical Triangle (Consolidation Coil)',
          type: 'neutral',
          biasLabel: 'NEUTRAL',
          confidence,
          status: 'Near Apex',
          specificityScore: 82,
          description: `Contracting volatility coil between descending resistance and ascending support. Potential bilateral breakout pending.`,
          targetPrice: target,
          targetPercent: targetPct,
          stopLossPrice: stopLoss,
          riskRewardRatio: rr,
          keyPoints: [
            { index: h1.index, time: h1.time, price: h1.price, label: 'Lower High 1' },
            { index: h2.index, time: h2.time, price: h2.price, label: 'Lower High 2' },
            { index: l1.index, time: l1.time, price: l1.price, label: 'Higher Low 1' },
            { index: l2.index, time: l2.time, price: l2.price, label: 'Higher Low 2' },
          ],
          lines: [
            { x1Index: h1.index, y1Price: h1.price, x2Index: n - 1, y2Price: h2.price, color: '#f59e0b', lineWidth: 2, label: 'Upper Boundary' },
            { x1Index: l1.index, y1Price: l1.price, x2Index: n - 1, y2Price: l2.price, color: '#06b6d4', lineWidth: 2, label: 'Lower Boundary' },
          ],
          polygon: [
            { index: l1.index, price: l1.price },
            { index: h1.index, price: h1.price },
            { index: h2.index, price: h2.price },
            { index: l2.index, price: l2.price },
          ],
          highlightRange: { startIndex: Math.min(h1.index, l1.index), endIndex: n - 1 },
        });
      }
    }
  }

  // =========================================================================
  // 12. DYNAMIC REGRESSION CHANNELS & RANGE (Comprehensive Fallback)
  // Ensures true balance across bull trend, bear trend, and sideways range!
  // =========================================================================
  if (candidatePatterns.length === 0) {
    const rangeCandles = candles.slice(Math.max(0, n - 45));
    const startIdx = n - rangeCandles.length;
    let minLow = Infinity;
    let maxHigh = -Infinity;
    let minIdx = startIdx;
    let maxIdx = startIdx;

    rangeCandles.forEach((c, idx) => {
      const realIdx = startIdx + idx;
      if (c.low < minLow) {
        minLow = c.low;
        minIdx = realIdx;
      }
      if (c.high > maxHigh) {
        maxHigh = c.high;
        maxIdx = realIdx;
      }
    });

    const startC = rangeCandles[0].close;
    const endC = rangeCandles[rangeCandles.length - 1].close;
    const rangePct = (endC - startC) / startC;

    // Linear regression slope
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    const count = rangeCandles.length;
    for (let i = 0; i < count; i++) {
      sumX += i;
      sumY += rangeCandles[i].close;
      sumXY += i * rangeCandles[i].close;
      sumX2 += i * i;
    }
    const slope = (count * sumXY - sumX * sumY) / (count * sumX2 - sumX * sumX);
    const channelHeight = (maxHigh - minLow) * 0.55;

    if (rangePct <= -0.025 || slope < -0.05) {
      // 12A. BEARISH: Descending Trend Channel
      const target = Number((Math.max(latestPrice - channelHeight * 0.7, minLow * 0.95)).toFixed(2));
      const targetPct = Number((((target - latestPrice) / latestPrice) * 100).toFixed(1));
      const stopLoss = Number((maxHigh * 1.015).toFixed(2));
      const confidence = calibrateConfidence(61, 0.7, 'Active', true);

      const risk = Math.abs(latestPrice - stopLoss) || 0.01;
      const reward = Math.abs(latestPrice - target);
      const rr = Number((reward / risk).toFixed(1));

      candidatePatterns.push({
        id: 'descending-channel',
        name: 'Descending Trend Channel (Bearish Trend)',
        type: 'bearish',
        biasLabel: 'BEARISH',
        confidence,
        status: 'Active',
        specificityScore: 60,
        description: `Orderly downward trending regression corridor with lower highs and lower lows. Overhead supply resistance at $${maxHigh.toFixed(2)}.`,
        targetPrice: target,
        targetPercent: targetPct,
        stopLossPrice: stopLoss,
        riskRewardRatio: rr,
        keyPoints: [
          { index: maxIdx, time: candles[maxIdx].time, price: maxHigh, label: 'Trend Resistance' },
          { index: minIdx, time: candles[minIdx].time, price: minLow, label: 'Channel Support' },
        ],
        lines: [
          { x1Index: startIdx, y1Price: maxHigh, x2Index: n - 1, y2Price: maxHigh * 0.96, color: '#f43f5e', lineWidth: 1.5, dash: [5, 4], label: 'Resistance' },
          { x1Index: startIdx, y1Price: minLow + channelHeight * 0.4, x2Index: n - 1, y2Price: minLow, color: '#ef4444', lineWidth: 1.5, dash: [5, 4], label: 'Support Floor' },
        ],
        polygon: [
          { index: startIdx, price: maxHigh },
          { index: n - 1, price: maxHigh * 0.96 },
          { index: n - 1, price: minLow },
          { index: startIdx, price: minLow + channelHeight * 0.4 },
        ],
        highlightRange: { startIndex: startIdx, endIndex: n - 1 },
      });
    } else if (rangePct >= 0.025 || slope > 0.05) {
      // 12B. BULLISH: Ascending Trend Channel
      const target = Number((maxHigh + channelHeight * 0.5).toFixed(2));
      const targetPct = Number((((target - latestPrice) / latestPrice) * 100).toFixed(1));
      const stopLoss = Number((minLow * 0.985).toFixed(2));
      const confidence = calibrateConfidence(62, 0.7, 'Active', true);

      const risk = Math.abs(latestPrice - stopLoss) || 0.01;
      const reward = Math.abs(target - latestPrice);
      const rr = Number((reward / risk).toFixed(1));

      candidatePatterns.push({
        id: 'ascending-channel',
        name: 'Ascending Trend Channel (Bullish Trend)',
        type: 'bullish',
        biasLabel: 'BULLISH',
        confidence,
        status: 'Active',
        specificityScore: 60,
        description: `Upward trending regression channel with solid accumulation support at $${minLow.toFixed(2)} and ascending price target $${target.toFixed(2)}.`,
        targetPrice: target,
        targetPercent: targetPct,
        stopLossPrice: stopLoss,
        riskRewardRatio: rr,
        keyPoints: [
          { index: minIdx, time: candles[minIdx].time, price: minLow, label: 'Trend Support' },
          { index: maxIdx, time: candles[maxIdx].time, price: maxHigh, label: 'Channel Target' },
        ],
        lines: [
          { x1Index: startIdx, y1Price: maxHigh - channelHeight * 0.3, x2Index: n - 1, y2Price: maxHigh * 1.03, color: '#38bdf8', lineWidth: 1.5, dash: [5, 4], label: 'Resistance Target' },
          { x1Index: startIdx, y1Price: minLow, x2Index: n - 1, y2Price: minLow * 1.03, color: '#10b981', lineWidth: 1.5, dash: [5, 4], label: 'Support Floor' },
        ],
        polygon: [
          { index: startIdx, price: minLow },
          { index: startIdx, price: maxHigh - channelHeight * 0.3 },
          { index: n - 1, price: maxHigh * 1.03 },
          { index: n - 1, price: minLow * 1.03 },
        ],
        highlightRange: { startIndex: startIdx, endIndex: n - 1 },
      });
    } else {
      // 12C. NEUTRAL: Horizontal Trading Range (Mean Reversion Box)
      const isNearFloor = latestPrice < (minLow + maxHigh) / 2;
      const target = isNearFloor ? Number(maxHigh.toFixed(2)) : Number(minLow.toFixed(2));
      const targetPct = Number((((target - latestPrice) / latestPrice) * 100).toFixed(1));
      const stopLoss = isNearFloor ? Number((minLow * 0.985).toFixed(2)) : Number((maxHigh * 1.015).toFixed(2));
      const confidence = calibrateConfidence(57, 0.65, 'Active', false);

      const risk = Math.abs(latestPrice - stopLoss) || 0.01;
      const reward = Math.abs(latestPrice - target);
      const rr = Number((reward / risk).toFixed(1));

      candidatePatterns.push({
        id: 'horizontal-range',
        name: 'Horizontal Trading Range (Consolidation Box)',
        type: 'neutral',
        biasLabel: 'NEUTRAL',
        confidence,
        status: 'Active',
        specificityScore: 55,
        description: `Balanced sideways consolidation range between support floor at $${minLow.toFixed(2)} and overhead resistance at $${maxHigh.toFixed(2)}.`,
        targetPrice: target,
        targetPercent: targetPct,
        stopLossPrice: stopLoss,
        riskRewardRatio: rr,
        keyPoints: [
          { index: minIdx, time: candles[minIdx].time, price: minLow, label: 'Range Floor' },
          { index: maxIdx, time: candles[maxIdx].time, price: maxHigh, label: 'Range Ceiling' },
        ],
        lines: [
          { x1Index: startIdx, y1Price: maxHigh, x2Index: n - 1, y2Price: maxHigh, color: '#f59e0b', lineWidth: 1.5, dash: [5, 4], label: 'Ceiling' },
          { x1Index: startIdx, y1Price: minLow, x2Index: n - 1, y2Price: minLow, color: '#06b6d4', lineWidth: 1.5, dash: [5, 4], label: 'Floor' },
        ],
        polygon: [
          { index: startIdx, price: minLow },
          { index: startIdx, price: maxHigh },
          { index: n - 1, price: maxHigh },
          { index: n - 1, price: minLow },
        ],
        highlightRange: { startIndex: startIdx, endIndex: n - 1 },
      });
    }
  }

  // Sort candidate patterns by structural specificity and confidence
  candidatePatterns.sort((a, b) => {
    const scoreA = (a.specificityScore || 50) + a.confidence;
    const scoreB = (b.specificityScore || 50) + b.confidence;
    return scoreB - scoreA;
  });

  return candidatePatterns;
}
