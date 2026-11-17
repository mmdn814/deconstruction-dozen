// --- LocalStorage Keys & Helpers ---
export const STORAGE_KEYS = {
  NOTEBOOK: 'dd_english_notebook_v1',
  PROGRESS: 'dd_english_progress_v1',
  API_KEY: 'dd_english_custom_apikey_v1',
  LANG: 'dd_target_lang_v1'
};

export const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};

// --- Language Configurations ---
export const LANGUAGE_CONFIG = {
  en: {
    code: 'en',
    speechLang: 'en-US',
    name: '英语',
    flag: '🇺🇸',
    title: 'English'
  },
  ja: {
    code: 'ja',
    speechLang: 'ja-JP',
    name: '日语',
    flag: '🇯🇵',
    title: '日本語'
  },
  es: {
    code: 'es',
    speechLang: 'es-ES',
    name: '西班牙语',
    flag: '🇪🇸',
    title: 'Español'
  }
};

let currentSpeechLang = 'en-US';
export const setSpeechLang = (lang) => {
  currentSpeechLang = lang;
};

// --- Standard IPA Pure Phoneme Audio Map (Using MP3 Transcoded Streams for 100% macOS / iOS / Chrome Compatibility) ---
export const IPA_AUDIO_URLS = {
  // English 12 Monophthongs (Pure Vowels - MP3 format for Mac compatibility)
  '/iː/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/9/91/Close_front_unrounded_vowel.ogg/Close_front_unrounded_vowel.ogg.mp3',
  '/ɪ/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/4/4c/Near-close_near-front_unrounded_vowel.ogg/Near-close_near-front_unrounded_vowel.ogg.mp3',
  '/e/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/6/6c/Close-mid_front_unrounded_vowel.ogg/Close-mid_front_unrounded_vowel.ogg.mp3',
  '/æ/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c9/Near-open_front_unrounded_vowel.ogg/Near-open_front_unrounded_vowel.ogg.mp3',
  '/ɜːr/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/a/a6/Open-mid_central_unrounded_vowel.ogg/Open-mid_central_unrounded_vowel.ogg.mp3',
  '/ə/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/d/d9/Mid-central_vowel.ogg/Mid-central_vowel.ogg.mp3',
  '/ʌ/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/9/92/Open-mid_back_unrounded_vowel.ogg/Open-mid_back_unrounded_vowel.ogg.mp3',
  '/ɑː/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/e/e5/Open_back_unrounded_vowel.ogg/Open_back_unrounded_vowel.ogg.mp3',
  '/ɔː/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/0/02/Open-mid_back_rounded_vowel.ogg/Open-mid_back_rounded_vowel.ogg.mp3',
  '/ɒ/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/3/31/Open_back_rounded_vowel.ogg/Open_back_rounded_vowel.ogg.mp3',
  '/uː/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/5/5d/Close_back_rounded_vowel.ogg/Close_back_rounded_vowel.ogg.mp3',
  '/ʊ/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/d/d5/Near-close_near-back_rounded_vowel.ogg/Near-close_near-back_rounded_vowel.ogg.mp3',

  // Spanish Pure Vowels & Trills (MP3 format)
  'A a': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/5/50/Open_central_unrounded_vowel.ogg/Open_central_unrounded_vowel.ogg.mp3',
  'E e': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/6/6c/Close-mid_front_unrounded_vowel.ogg/Close-mid_front_unrounded_vowel.ogg.mp3',
  'I i': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/9/91/Close_front_unrounded_vowel.ogg/Close_front_unrounded_vowel.ogg.mp3',
  'O o': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/84/Close-mid_back_rounded_vowel.ogg/Close-mid_back_rounded_vowel.ogg.mp3',
  'U u': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/5/5d/Close_back_rounded_vowel.ogg/Close_back_rounded_vowel.ogg.mp3',
  'RR rr': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/ce/Alveolar_trill.ogg/Alveolar_trill.ogg.mp3'
};

let activeIpaAudio = null;
let sharedAudioCtx = null;

// --- Acoustic Phonetics Synthesizer for Pure Isolated Consonants (Zero "uh" vowel pollution, 100% offline & Mac-native) ---
export const synthesizePureConsonant = (charKey) => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return false;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  const ctx = sharedAudioCtx;
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  // Paired & Single Consonants Acoustic Profiles (Formant Filter + Voicing Fundamental)
  const profiles = {
    '/p/ 清': { type: 'plosive', voiced: false, freq: 850, q: 1.4, burstDur: 0.045, aspDur: 0.09 },
    '/b/ 浊': { type: 'plosive', voiced: true, freq: 850, q: 1.4, burstDur: 0.04, voiceFreq: 120 },
    '/t/ 清': { type: 'plosive', voiced: false, freq: 3600, q: 2.0, burstDur: 0.035, aspDur: 0.095 },
    '/d/ 浊': { type: 'plosive', voiced: true, freq: 3400, q: 2.0, burstDur: 0.035, voiceFreq: 125 },
    '/k/ 清': { type: 'plosive', voiced: false, freq: 1850, q: 2.2, burstDur: 0.045, aspDur: 0.095 },
    '/ɡ/ 浊': { type: 'plosive', voiced: true, freq: 1750, q: 2.2, burstDur: 0.04, voiceFreq: 118 },
    '/f/ 清': { type: 'fricative', voiced: false, freq: 2400, q: 0.8, dur: 0.42, gain: 0.28 },
    '/v/ 浊': { type: 'fricative', voiced: true, freq: 2200, q: 0.9, dur: 0.42, gain: 0.25, voiceFreq: 125 },
    '/θ/ 清': { type: 'fricative', voiced: false, freq: 4800, q: 0.7, dur: 0.42, gain: 0.22 },
    '/ð/ 浊': { type: 'fricative', voiced: true, freq: 4200, q: 0.9, dur: 0.42, gain: 0.22, voiceFreq: 125 },
    '/s/ 清': { type: 'fricative', voiced: false, freq: 6500, q: 3.2, dur: 0.44, gain: 0.35 },
    '/z/ 浊': { type: 'fricative', voiced: true, freq: 6200, q: 3.2, dur: 0.44, gain: 0.32, voiceFreq: 128 },
    '/ʃ/ 清': { type: 'fricative', voiced: false, freq: 3100, q: 2.4, dur: 0.44, gain: 0.35 },
    '/ʒ/ 浊': { type: 'fricative', voiced: true, freq: 2950, q: 2.4, dur: 0.44, gain: 0.32, voiceFreq: 125 },
    '/tʃ/ 清': { type: 'affricate', voiced: false, freq: 3200, q: 2.5, dur: 0.26, gain: 0.4 },
    '/dʒ/ 浊': { type: 'affricate', voiced: true, freq: 3000, q: 2.5, dur: 0.26, gain: 0.36, voiceFreq: 125 },
    '/h/': { type: 'fricative', voiced: false, freq: 1450, q: 1.1, dur: 0.36, gain: 0.26 }
  };

  const p = profiles[charKey];
  if (!p) return false;

  const now = ctx.currentTime;
  const totalDur = p.dur || 0.22;

  // Create white noise buffer for airflow / turbulence
  const bufferSize = Math.floor(ctx.sampleRate * (totalDur + 0.1));
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(p.freq, now);
  filter.Q.setValueAtTime(p.q, now);

  const noiseGain = ctx.createGain();

  if (p.type === 'plosive') {
    // Crisp burst + aspiration (for voiceless) without any vowel tail
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(p.voiced ? 0.32 : 0.52, now + 0.006);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + p.burstDur + (p.aspDur || 0.03));
  } else if (p.type === 'affricate') {
    // Stop release into sibilant friction (/tʃ/, /dʒ/)
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(p.gain, now + 0.012);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + totalDur);
  } else {
    // Continuous fricative airflow (/f/, /v/, /s/, /z/, /θ/, /ð/, /ʃ/, /ʒ/)
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(p.gain, now + 0.04);
    noiseGain.gain.setValueAtTime(p.gain, now + totalDur - 0.06);
    noiseGain.gain.linearRampToValueAtTime(0.001, now + totalDur);
  }

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + totalDur + 0.05);

  // Add Vocal Cord Vibration (Voicing Bar) ONLY for Voiced Consonants!
  if (p.voiced) {
    const osc = ctx.createOscillator();
    const oscFilter = ctx.createBiquadFilter();
    const oscGain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(p.voiceFreq || 125, now);
    osc.frequency.linearRampToValueAtTime((p.voiceFreq || 125) * 0.92, now + totalDur);

    oscFilter.type = 'lowpass';
    oscFilter.frequency.setValueAtTime(p.type === 'plosive' ? 420 : 680, now);

    if (p.type === 'plosive') {
      // Pre-voicing + short vocal bar release
      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.28, now + 0.01);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
    } else {
      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.24, now + 0.035);
      oscGain.gain.setValueAtTime(0.24, now + totalDur - 0.05);
      oscGain.gain.linearRampToValueAtTime(0.001, now + totalDur);
    }

    osc.connect(oscFilter);
    oscFilter.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + totalDur + 0.05);
  }

  return true;
};

// --- Play Pure IPA Phoneme Sound (1. Pure Acoustic Consonant Engine -> 2. Mac-Compatible MP3 IPA -> 3. Clean TTS) ---
export const playPurePhoneme = (charKey, fallbackSoundText) => {
  if (typeof window === 'undefined') return;
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (activeIpaAudio) {
      activeIpaAudio.pause();
      activeIpaAudio.currentTime = 0;
    }

    // 1. If it's a paired voiceless/voiced consonant, use our zero-vowel acoustic phoneme synthesizer
    if (synthesizePureConsonant(charKey)) {
      return;
    }

    // 2. Check Mac-compatible MP3 official IPA vowel/trill recording
    const ipaUrl = IPA_AUDIO_URLS[charKey];
    if (ipaUrl) {
      const audio = new Audio(ipaUrl);
      activeIpaAudio = audio;
      audio.onerror = () => {
        speakText(fallbackSoundText, 0.85);
      };
      audio.play().catch(() => {
        speakText(fallbackSoundText, 0.85);
      });
      return;
    }

    // 3. Fallback for Diphthongs, Nasals, Approximants & Japanese Kana
    speakText(fallbackSoundText, 0.85);
  } catch (e) {
    speakText(fallbackSoundText, 0.85);
  }
};

// --- Web Speech TTS Helper ---
export const speakText = (text, rate = 0.95, pitch = 1.0, onEndCallback = null) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEndCallback) onEndCallback();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const cleanText = String(text || '').replace(/\(.*?\)/g, '').trim();
    if (!cleanText) {
      if (onEndCallback) onEndCallback();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentSpeechLang;
    utterance.rate = rate;
    utterance.pitch = pitch;

    const voices = window.speechSynthesis.getVoices();
    const langPrefix = currentSpeechLang.split('-')[0].toLowerCase();
    const matchedVoice =
      voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(langPrefix) &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri') || v.name.includes('Kyoko') || v.name.includes('Monica'))
      ) || voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      if (onEndCallback) onEndCallback();
    };
    utterance.onerror = () => {
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    if (onEndCallback) onEndCallback();
  }
};

// --- Gemini API Helper (Supports Environment Key or User LocalStorage Key) ---
export const callGemini = async (prompt, systemInstruction = '', responseSchema = null) => {
  const customKey = loadFromStorage(STORAGE_KEYS.API_KEY, '');
  const apiKey = customKey || '';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
    generationConfig: responseSchema
      ? {
          responseMimeType: 'application/json',
          responseSchema
        }
      : undefined
  };

  const delays = [1000, 2000, 4000];
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (err) {
      if (attempt === delays.length) return null;
      await new Promise((r) => setTimeout(r, delays[attempt]));
    }
  }
  return null;
};
