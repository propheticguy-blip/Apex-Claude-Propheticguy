import { EconomicIndicator, Stock, LiveQuote } from '../types/stock';

export interface KokoroVoicePersona {
  id: string;
  name: string;
  gender: 'female' | 'male';
  accent: 'American' | 'British';
  style: string;
  description: string;
  recommendedPitch: number;
  recommendedRate: number;
  lang: string;
  avatarIcon: string;
}

export const KOKORO_VOICES: KokoroVoicePersona[] = [
  {
    id: 'af_heart',
    name: 'Kokoro Heart',
    gender: 'female',
    accent: 'American',
    style: 'Warm & Expressive',
    description: 'Kokoro flagship voice: warm, balanced, and remarkably lifelike.',
    recommendedPitch: 1.05,
    recommendedRate: 1.0,
    lang: 'en-US',
    avatarIcon: '💖',
  },
  {
    id: 'af_bella',
    name: 'Kokoro Bella',
    gender: 'female',
    accent: 'American',
    style: 'Broadcast Financial Anchor',
    description: 'Crisp, articulate, and authoritative Wall Street broadcast anchor.',
    recommendedPitch: 1.0,
    recommendedRate: 1.05,
    lang: 'en-US',
    avatarIcon: '🎙️',
  },
  {
    id: 'af_sarah',
    name: 'Kokoro Sarah',
    gender: 'female',
    accent: 'American',
    style: 'Calm & Analytical',
    description: 'Even-toned macroeconomic researcher; methodical and clear.',
    recommendedPitch: 0.95,
    recommendedRate: 0.98,
    lang: 'en-US',
    avatarIcon: '📊',
  },
  {
    id: 'am_adam',
    name: 'Kokoro Adam',
    gender: 'male',
    accent: 'American',
    style: 'Deep Institutional Commentator',
    description: 'Resonant, trustworthy institutional macro fund manager.',
    recommendedPitch: 0.88,
    recommendedRate: 0.98,
    lang: 'en-US',
    avatarIcon: '🏛️',
  },
  {
    id: 'am_michael',
    name: 'Kokoro Michael',
    gender: 'male',
    accent: 'American',
    style: 'Dynamic Market Strategist',
    description: 'Energetic, fast-paced equity and derivatives strategist.',
    recommendedPitch: 0.96,
    recommendedRate: 1.08,
    lang: 'en-US',
    avatarIcon: '⚡',
  },
  {
    id: 'bf_emma',
    name: 'Kokoro Emma',
    gender: 'female',
    accent: 'British',
    style: 'Global Macro Specialist',
    description: 'Distinguished London foreign exchange and sovereign debt analyst.',
    recommendedPitch: 1.02,
    recommendedRate: 1.0,
    lang: 'en-GB',
    avatarIcon: '🌍',
  },
  {
    id: 'bm_george',
    name: 'Kokoro George',
    gender: 'male',
    accent: 'British',
    style: 'Distinguished Central Banker',
    description: 'Grave, seasoned monetary policy governor tone.',
    recommendedPitch: 0.85,
    recommendedRate: 0.92,
    lang: 'en-GB',
    avatarIcon: '🎩',
  },
];

export interface KokoroVoiceState {
  isSpeaking: boolean;
  isPaused: boolean;
  activeVoiceId: string;
  playbackRate: number;
  currentTitle: string;
  waveformLevels: number[]; // 5-bar animated audio levels for visualization
}

type StateListener = (state: KokoroVoiceState) => void;

class KokoroVoiceEngine {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private currentAudioUrl: string | null = null;
  private currentRequestId = 0;
  private currentAbortController: AbortController | null = null;
  private pendingResolve: (() => void) | null = null;
  private listeners: Set<StateListener> = new Set();
  private waveformInterval: ReturnType<typeof setInterval> | null = null;

  public state: KokoroVoiceState = {
    isSpeaking: false,
    isPaused: false,
    activeVoiceId: (() => {
      try {
        const saved = localStorage.getItem('apexflipper_voice_id');
        if (saved && KOKORO_VOICES.some((v) => v.id === saved)) return saved;
      } catch {}
      return 'af_heart';
    })(),
    playbackRate: (() => {
      try {
        const saved = localStorage.getItem('apexflipper_voice_rate');
        if (saved) {
          const val = parseFloat(saved);
          if (!isNaN(val) && val >= 0.5 && val <= 2.0) return val;
        }
      } catch {}
      return 1.0;
    })(),
    currentTitle: '',
    waveformLevels: [15, 20, 15, 25, 18],
  };

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Warm up voices list
      window.speechSynthesis.onvoiceschanged = () => {
        // Cached in browser
      };
    }
  }

  public getActivePersona(): KokoroVoicePersona {
    return (
      KOKORO_VOICES.find((v) => v.id === this.state.activeVoiceId) || KOKORO_VOICES[0]
    );
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const copy = { ...this.state };
    this.listeners.forEach((fn) => fn(copy));
  }

  public setVoice(voiceId: string) {
    this.state.activeVoiceId = voiceId;
    try {
      localStorage.setItem('apexflipper_voice_id', voiceId);
    } catch {}
    this.notify();
  }

  public setRate(rate: number) {
    const clamped = Math.max(0.5, Math.min(2.0, rate));
    this.state.playbackRate = clamped;
    try {
      localStorage.setItem('apexflipper_voice_rate', String(clamped));
    } catch {}
    if (this.currentAudioElement) {
      this.currentAudioElement.playbackRate = clamped;
    }
    if (this.currentUtterance && this.state.isSpeaking) {
      this.currentUtterance.rate = this.state.playbackRate;
    }
    this.notify();
  }

  /**
   * Preview a voice persona with a short lifelike financial market greeting
   */
  public previewVoice(voiceId?: string) {
    const targetId = voiceId || this.state.activeVoiceId;
    const persona = KOKORO_VOICES.find((v) => v.id === targetId) || KOKORO_VOICES[0];
    const previewText = `Hello, I'm ${persona.name}. I'll narrate market movements, chart trends, and earnings updates for you.`;
    
    // Temporarily switch to this voice for preview if different
    const previousVoiceId = this.state.activeVoiceId;
    this.state.activeVoiceId = targetId;
    this.speak(previewText, `Preview: ${persona.name}`);
    
    // If not permanent switch, could revert or keep as active. We set it as active choice so user hears what they picked.
    this.setVoice(targetId);
  }

  private startWaveformAnimation() {
    this.stopWaveformAnimation();
    this.waveformInterval = setInterval(() => {
      if (!this.state.isSpeaking || this.state.isPaused) {
        this.state.waveformLevels = [10, 12, 10, 15, 12];
      } else {
        // Natural pulsing dynamic audio amplitude levels
        this.state.waveformLevels = [
          Math.floor(25 + Math.random() * 65),
          Math.floor(35 + Math.random() * 60),
          Math.floor(45 + Math.random() * 55),
          Math.floor(30 + Math.random() * 70),
          Math.floor(20 + Math.random() * 60),
        ];
      }
      this.notify();
    }, 120);
  }

  private stopWaveformAnimation() {
    if (this.waveformInterval) {
      clearInterval(this.waveformInterval);
      this.waveformInterval = null;
    }
    this.state.waveformLevels = [10, 12, 10, 15, 12];
  }

  /**
   * Expand financial jargon, acronyms, and symbols for natural Kokoro prosody
   */
  public cleanTextForSpeech(raw: string): string {
    return raw
      .replace(/\bYoY\b/g, 'year over year')
      .replace(/\bMoM\b/g, 'month over month')
      .replace(/\bQoQ\b/g, 'quarter over quarter')
      .replace(/\bbps\b/g, 'basis points')
      .replace(/\bFOMC\b/g, 'Federal Open Market Committee')
      .replace(/\bCPI\b/g, 'Consumer Price Index')
      .replace(/\bPPI\b/g, 'Producer Price Index')
      .replace(/\bPCE\b/g, 'Personal Consumption Expenditures')
      .replace(/\bGDP\b/g, 'Gross Domestic Product')
      .replace(/\bPMI\b/g, 'Purchasing Managers Index')
      .replace(/\bECB\b/g, 'European Central Bank')
      .replace(/\bBoJ\b/g, 'Bank of Japan')
      .replace(/\bFed\b/g, 'Federal Reserve')
      .replace(/\bSPR\b/g, 'Strategic Petroleum Reserve')
      .replace(/\bOAS\b/g, 'Option-Adjusted Spread')
      .replace(/\bSOFR\b/g, 'Secured Overnight Financing Rate')
      .replace(/\bTGA\b/g, 'Treasury General Account')
      .replace(/\bRRP\b/g, 'Reverse Repo Facility')
      .replace(/\bJOLTS\b/g, 'Jolts')
      .replace(/\bNFIB\b/g, 'National Federation of Independent Business')
      .replace(/\bOECD\b/g, 'O E C D')
      .replace(/\bBDI\b/g, 'Baltic Dry Index')
      .replace(/\bEU\b/g, 'European Union')
      .replace(/\bUK\b/g, 'United Kingdom')
      .replace(/\bUS\b/g, 'United States')
      .replace(/\$([0-9]+(?:\.[0-9]+)?)\s*T\b/g, '$1 trillion dollars')
      .replace(/\$([0-9]+(?:\.[0-9]+)?)\s*B\b/g, '$1 billion dollars')
      .replace(/\$([0-9]+(?:\.[0-9]+)?)\s*M\b/g, '$1 million dollars')
      .replace(/\$([0-9]+(?:\.[0-9]+)?)/g, '$1 dollars')
      .replace(/%([0-9]+)/g, '$1 percent')
      .replace(/([0-9]+(?:\.[0-9]+)?)\s*%/g, '$1 percent')
      .replace(/·/g, ', ')
      .replace(/—/g, ', ')
      .replace(/–/g, ', ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Compose a fluid broadcast script for an economic indicator
   */
  public generateIndicatorScript(indicator: EconomicIndicator): string {
    const trendWord =
      indicator.trend === 'up'
        ? 'trending upward'
        : indicator.trend === 'down'
        ? 'moving downward'
        : 'holding steady';

    const impactWord =
      indicator.impact === 'positive'
        ? 'constructive for macroeconomic expansion'
        : indicator.impact === 'negative'
        ? 'a headwind for risk sentiment'
        : 'broadly neutral for financial conditions';

    let script = `${indicator.name}. `;
    script += `Current reading is ${indicator.currentValue} ${indicator.unit}, for ${indicator.latestPeriod}. `;
    script += `The trend is ${trendWord}, which is ${impactWord}. `;

    if (indicator.priorValue) {
      script += `Prior reading was ${indicator.priorValue}. `;
    }
    if (indicator.consensusEstimate) {
      script += `Market consensus was ${indicator.consensusEstimate}. `;
    }
    if (indicator.significance) {
      script += `Market impact: ${indicator.significance} `;
    }

    if (indicator.assetClassImpact) {
      if (indicator.assetClassImpact.equities) {
        script += `For equities: ${indicator.assetClassImpact.equities} `;
      }
      if (indicator.assetClassImpact.bonds) {
        script += `For fixed income: ${indicator.assetClassImpact.bonds} `;
      }
      if (indicator.assetClassImpact.currencies) {
        script += `For currencies: ${indicator.assetClassImpact.currencies} `;
      }
    }

    return this.cleanTextForSpeech(script);
  }

  /**
   * Compose a fluid broadcast script for a stock and its live chart
   */
  public generateStockScript(stock: Stock, liveQuote?: LiveQuote | null, corporateEvents?: any): string {
    let script = `${stock.name}, ticker symbol ${stock.symbol}, listed on the ${stock.exchange}. `;

    if (liveQuote) {
      const dir =
        liveQuote.change > 0.005
          ? `up ${liveQuote.change.toFixed(2)} dollars, or positive ${liveQuote.changePercent.toFixed(2)} percent`
          : liveQuote.change < -0.005
          ? `down ${Math.abs(liveQuote.change).toFixed(2)} dollars, or negative ${Math.abs(liveQuote.changePercent).toFixed(2)} percent`
          : `unchanged`;

      script += `Currently trading at ${liveQuote.price.toFixed(2)} dollars, ${dir}. `;
      if (liveQuote.dayHigh && liveQuote.dayLow) {
        script += `Intraday high is ${liveQuote.dayHigh.toFixed(2)}, and low is ${liveQuote.dayLow.toFixed(2)}. `;
      }
    } else if (stock.approxPrice) {
      script += `Indicative reference price is ${stock.approxPrice.toFixed(2)} dollars. `;
    }

    script += `Market capitalization is ${stock.marketCap}. Sector: ${stock.sector}, Industry: ${stock.industry}. `;

    if (stock.peRatio) {
      script += `Price to earnings ratio stands at ${stock.peRatio}. `;
    }

    // Corporate Dividend Narration
    const divYield = corporateEvents?.dividendYield || stock.dividendYield;
    if (divYield && divYield !== 'N/A' && divYield !== '-' && divYield !== 'None' && divYield !== '0.00%') {
      const payout = corporateEvents?.quarterlyDividend || corporateEvents?.annualDividend || stock.dividendRate;
      script += `Dividend yield is ${divYield}${payout ? `, paying ${payout} per share` : ''}. `;
      if (corporateEvents?.nextExDate) {
        script += `Next ex-dividend date is ${corporateEvents.nextExDate}. `;
      }
    }

    // Corporate Earnings Narration
    const nextEarnings = corporateEvents?.nextEarningsDate || stock.nextEarningsDate;
    if (nextEarnings) {
      const eps = corporateEvents?.nextEarningsEPS;
      const timing = corporateEvents?.nextEarningsTime === 'AMC' ? 'after market close' : corporateEvents?.nextEarningsTime === 'BMO' ? 'before market open' : '';
      script += `Next earnings report is scheduled for ${nextEarnings}${timing ? ` ${timing}` : ''}${eps ? `, with consensus EPS forecast of ${eps}` : ''}. `;
    }

    if (stock.description || stock.summary) {
      script += `${stock.description || stock.summary} `;
    }

    return this.cleanTextForSpeech(script);
  }

  /**
   * Pick best system voice matching the selected Kokoro persona
   */
  private selectMatchingSystemVoice(persona: KokoroVoicePersona): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Filter by language target
    const targetLang = persona.lang.toLowerCase();
    const langVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(targetLang.slice(0, 2)));

    // Look for natural / neural / female / male matches
    const isFemale = persona.gender === 'female';
    const preferredNames = isFemale
      ? ['natural', 'samantha', 'karen', 'victoria', 'serena', 'zira', 'female', 'google us english', 'moira', 'fiona']
      : ['natural', 'daniel', 'alex', 'david', 'george', 'male', 'google uk english male', 'oliver', 'rishi'];

    for (const name of preferredNames) {
      const match = langVoices.find((v) => v.name.toLowerCase().includes(name));
      if (match) return match;
    }

    // Secondary fallback
    if (langVoices.length > 0) return langVoices[0];
    return voices[0] || null;
  }

  /**
   * Resilient fallback to browser SpeechSynthesis if offline or server TTS is unavailable
   */
  private fallbackToSystemTts(cleanedText: string, persona: KokoroVoicePersona): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        this.stop();
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      this.currentUtterance = utterance;

      const matchedVoice = this.selectMatchingSystemVoice(persona);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.rate = persona.recommendedRate * this.state.playbackRate;
      utterance.pitch = persona.recommendedPitch;
      utterance.lang = persona.lang;

      utterance.onend = () => {
        this.stop();
        resolve();
      };

      utterance.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('Speech synthesis event:', e.error);
        }
        this.stop();
        resolve();
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('Failed to speak via system fallback:', err);
        this.stop();
        resolve();
      }
    });
  }

  /**
   * Speak arbitrary text with selected Kokoro AI Voice Persona
   * Uses real Gemini neural text-to-speech audio via /api/tts, with fallback to browser TTS.
   */
  /**
   * Speak arbitrary text with selected Kokoro AI Voice Persona
   * Uses real Gemini neural text-to-speech audio via /api/tts, with fallback to browser TTS.
   */
  public async speak(text: string, title = 'Audio Narration'): Promise<void> {
    this.stop();

    if (typeof window === 'undefined') return;

    const persona = this.getActivePersona();
    const cleaned = this.cleanTextForSpeech(text);
    const thisRequestId = ++this.currentRequestId;

    this.state.isSpeaking = true;
    this.state.isPaused = false;
    this.state.currentTitle = title;
    this.notify();
    this.startWaveformAnimation();

    this.currentAbortController = new AbortController();

    // 1. Primary: Use real Neural AI Voice synthesized from backend
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleaned,
          voiceId: this.state.activeVoiceId,
        }),
        signal: this.currentAbortController.signal,
      });

      if (this.currentRequestId !== thisRequestId) {
        return; // Stale request was superseded
      }

      if (response.ok) {
        const data = await response.json();
        if (data.audioBase64) {
          if (this.currentRequestId !== thisRequestId) return;

          return new Promise<void>((resolve) => {
            this.pendingResolve = resolve;

            try {
              // Convert base64 to binary Blob URL for seamless browser playback
              const binaryString = atob(data.audioBase64);
              const len = binaryString.length;
              const bytes = new Uint8Array(len);
              for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
              const url = URL.createObjectURL(blob);
              this.currentAudioUrl = url;

              const audio = new Audio(url);
              this.currentAudioElement = audio;
              audio.playbackRate = this.state.playbackRate;

              audio.onended = () => {
                if (this.currentRequestId === thisRequestId) {
                  this.stop();
                  resolve();
                }
              };

              audio.onerror = (e) => {
                console.warn('Neural audio playback error, falling back to system TTS:', e);
                if (this.currentRequestId === thisRequestId) {
                  this.cleanupAudio();
                  this.fallbackToSystemTts(cleaned, persona).then(resolve);
                }
              };

              audio.play().then(() => {
                // Audio playing cleanly
              }).catch((err) => {
                console.warn('Audio play error, falling back to system TTS:', err);
                if (this.currentRequestId === thisRequestId) {
                  this.cleanupAudio();
                  this.fallbackToSystemTts(cleaned, persona).then(resolve);
                }
              });
            } catch (err) {
              console.warn('Failed to decode neural audio blob, using fallback:', err);
              if (this.currentRequestId === thisRequestId) {
                this.cleanupAudio();
                this.fallbackToSystemTts(cleaned, persona).then(resolve);
              }
            }
          });
        }
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return; // Expected cancellation
      }
      console.warn('Neural TTS request failed, using system fallback:', err);
    }

    if (this.currentRequestId !== thisRequestId) return;

    // 2. Secondary: System SpeechSynthesis fallback
    return this.fallbackToSystemTts(cleaned, persona);
  }

  private cleanupAudio() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.src = '';
      this.currentAudioElement = null;
    }
    if (this.currentAudioUrl) {
      try {
        URL.revokeObjectURL(this.currentAudioUrl);
      } catch {}
      this.currentAudioUrl = null;
    }
  }

  public speakIndicator(indicator: EconomicIndicator): Promise<void> {
    const script = this.generateIndicatorScript(indicator);
    return this.speak(script, indicator.shortName || indicator.name);
  }

  public speakStock(stock: Stock, liveQuote?: LiveQuote | null, corporateEvents?: any): Promise<void> {
    const script = this.generateStockScript(stock, liveQuote, corporateEvents);
    return this.speak(script, `${stock.symbol} · ${stock.name}`);
  }

  public pause() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.state.isPaused = true;
      this.notify();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        this.state.isPaused = true;
        this.notify();
      }
    }
  }

  public resume() {
    if (this.currentAudioElement) {
      this.currentAudioElement.play().catch(console.error);
      this.state.isPaused = false;
      this.notify();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        this.state.isPaused = false;
        this.notify();
      }
    }
  }

  public stop() {
    this.currentRequestId++;
    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.cleanupAudio();

    if (this.pendingResolve) {
      const res = this.pendingResolve;
      this.pendingResolve = null;
      res();
    }

    this.state.isSpeaking = false;
    this.state.isPaused = false;
    this.state.currentTitle = '';
    this.stopWaveformAnimation();
    this.notify();
  }
}

// Global Singleton Instance
export const kokoroVoice = new KokoroVoiceEngine();
