import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  RefreshCw,
  MessageSquare,
  Volume2,
  Mic,
  CheckCircle2,
  Sparkles,
  Play,
  Square,
  Bookmark,
  Settings,
  Download,
  Upload,
  Trash2,
  Send,
  Loader2,
  HelpCircle,
  Eye,
  EyeOff,
  Award,
  KeyRound,
  X
} from 'lucide-react';

// --- LocalStorage Keys & Helpers ---
const STORAGE_KEYS = {
  NOTEBOOK: 'dd_english_notebook_v1',
  PROGRESS: 'dd_english_progress_v1',
  API_KEY: 'dd_english_custom_apikey_v1',
  LANG: 'dd_target_lang_v1'
};

const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};

// --- Language Configurations ---
const LANGUAGE_CONFIG = {
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

// --- Standard IPA Pure Phoneme Audio Map (Using MP3 Transcoded Streams for 100% macOS / iOS / Chrome Compatibility) ---
const IPA_AUDIO_URLS = {
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
const synthesizePureConsonant = (charKey) => {
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
const playPurePhoneme = (charKey, fallbackSoundText) => {
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
const speakText = (text, rate = 0.95, pitch = 1.0, onEndCallback = null) => {
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
const callGemini = async (prompt, systemInstruction = '', responseSchema = null) => {
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

// --- Tab 1 Data: Comprehensive Sound & Ear Training Hub (Decoder + Minimal Pairs + Sound Clusters + 36 Core Lego Words) ---
const zeroToOneDataByLang = {
  en: {
    subtitle: "44音素全景音标表 + Minimal Pairs 易混辨音 + 同音词族串串烧",
    alphabetTitle: "🗺️ 英语 44 国际音标与自然拼读全景体系 (第一行听单音 · 第三行听例词)",
    phoneticCategories: [
      {
        id: 'vowels_mono',
        name: '① 单元音 (12个: 长短对比)',
        desc: '口型保持固定不变的元音，点击第一行【🔊单音】听纯粹音素，点击第三行听例词与慢速：',
        items: [
          { char: '/iː/', sound: 'ee', sub: 'ee / ea', tip: '长音“衣”，嘴角微笑拉开', sample: 'sheep', sampleCn: '绵羊' },
          { char: '/ɪ/', sound: 'ih', sub: 'i / y', tip: '短促放松，介于衣和诶之间', sample: 'ship', sampleCn: '轮船' },
          { char: '/e/', sound: 'eh', sub: 'e / ea', tip: '一指宽小开口发“诶”', sample: 'bed', sampleCn: '床' },
          { char: '/æ/', sound: 'aah', sub: 'a (梅花音)', tip: '两指宽大开口，下巴压低', sample: 'apple', sampleCn: '苹果' },
          { char: '/ɜːr/', sound: 'er', sub: 'ir / ur / er', tip: '舌尖微卷的“儿”长音', sample: 'bird', sampleCn: '小鸟' },
          { char: '/ə/', sound: 'uh', sub: 'a / o / e (弱读)', tip: '最核心央元音，完全放松轻哼', sample: 'about', sampleCn: '关于' },
          { char: '/ʌ/', sound: 'uh', sub: 'u / o', tip: '短促有力的“阿”', sample: 'cup', sampleCn: '杯子' },
          { char: '/ɑː/', sound: 'ah', sub: 'ar / a', tip: '口腔打开深沉发“啊”', sample: 'car', sampleCn: '汽车' },
          { char: '/ɔː/', sound: 'aw', sub: 'or / aw / al', tip: '双唇拢圆发长音“奥”', sample: 'door', sampleCn: '门' },
          { char: '/ɒ/', sound: 'oh', sub: 'o / a', tip: '短促圆唇“奥/阿”', sample: 'hot', sampleCn: '热的' },
          { char: '/uː/', sound: 'oo', sub: 'oo / u / ew', tip: '双唇嘟圆发长音“乌”', sample: 'food', sampleCn: '食物' },
          { char: '/ʊ/', sound: 'uuh', sub: 'oo / u', tip: '短促放松的“乌”', sample: 'book', sampleCn: '书' }
        ]
      },
      {
        id: 'vowels_diph',
        name: '② 双元音 (8个: 滑动饱满)',
        desc: '由第一个元音平滑过渡到第二个元音，点击第一行【🔊单音】听纯粹双元音滑动，点击第三行听例词：',
        items: [
          { char: '/eɪ/', sound: 'A', sub: 'a_e / ai / ay', tip: '由 e 滑向 ɪ (字母A本音)', sample: 'take', sampleCn: '拿/带走' },
          { char: '/aɪ/', sound: 'I', sub: 'i_e / igh / y', tip: '由 a 滑向 ɪ (字母I本音)', sample: 'time', sampleCn: '时间' },
          { char: '/ɔɪ/', sound: 'oy', sub: 'oi / oy', tip: '由奥滑向衣', sample: 'boy', sampleCn: '男孩' },
          { char: '/aʊ/', sound: 'ow', sub: 'ou / ow', tip: '由阿滑向乌', sample: 'now', sampleCn: '现在' },
          { char: '/əʊ/', sound: 'O', sub: 'o_e / oa / ow', tip: '由央元音滑向乌 (字母O本音)', sample: 'go', sampleCn: '去' },
          { char: '/ɪər/', sound: 'ear', sub: 'ear / eer', tip: '由衣滑向儿化央元音', sample: 'here', sampleCn: '这里' },
          { char: '/eər/', sound: 'air', sub: 'air / are', tip: '由诶滑向儿化央元音', sample: 'where', sampleCn: '哪里' },
          { char: '/ʊər/', sound: 'oor', sub: 'ure / our', tip: '由乌滑向儿化央元音', sample: 'sure', sampleCn: '确定的' }
        ]
      },
      {
        id: 'consonants_paired',
        name: '③ 清浊成对辅音 (16个: 口型相同，声带震动不同)',
        desc: '每对清浊辅音口型100%一样！点击【🔊纯单音】对比：左边清音只有纯粹气流摩擦/爆破（绝无元音尾巴），右边浊音叠加声带共鸣震动：',
        items: [
          { char: '/p/ 清', sound: 'p', sub: 'p', tip: '双唇爆破送气(无声带震动)', sample: 'pay', sampleCn: '支付' },
          { char: '/b/ 浊', sound: 'b', sub: 'b', tip: '双唇爆破震动声带', sample: 'buy', sampleCn: '买' },
          { char: '/t/ 清', sound: 't', sub: 't', tip: '舌尖抵上齿龈爆破送气', sample: 'tea', sampleCn: '茶' },
          { char: '/d/ 浊', sound: 'd', sub: 'd', tip: '舌尖抵上齿龈震声带', sample: 'day', sampleCn: '日子/天' },
          { char: '/k/ 清', sound: 'k', sub: 'k / c / ck', tip: '舌根软腭爆破送气', sample: 'key', sampleCn: '钥匙' },
          { char: '/ɡ/ 浊', sound: 'g', sub: 'g', tip: '舌根软腭震声带', sample: 'give', sampleCn: '给' },
          { char: '/f/ 清', sound: 'fff', sub: 'f / ph', tip: '上齿轻咬下唇纯吹气', sample: 'free', sampleCn: '免费的' },
          { char: '/v/ 浊', sound: 'vvv', sub: 'v', tip: '上齿咬下唇吹气+震声带', sample: 'very', sampleCn: '非常' },
          { char: '/θ/ 清', sound: 'th', sub: 'th (清)', tip: '舌尖轻放上下齿间纯吹气', sample: 'think', sampleCn: '思考' },
          { char: '/ð/ 浊', sound: 'the', sub: 'th (浊)', tip: '舌尖轻放上下齿间震声带', sample: 'this', sampleCn: '这个' },
          { char: '/s/ 清', sound: 'sss', sub: 's / c', tip: '舌尖平舌摩擦纯吹气', sample: 'see', sampleCn: '看见' },
          { char: '/z/ 浊', sound: 'zzz', sub: 'z / s', tip: '舌尖平舌摩擦+震声带', sample: 'zoo', sampleCn: '动物园' },
          { char: '/ʃ/ 清', sound: 'shh', sub: 'sh / -tion', tip: '双唇微翘送气摩擦(“嘘”)', sample: 'she', sampleCn: '她' },
          { char: '/ʒ/ 浊', sound: 'zh', sub: 's / ge', tip: '双唇微翘摩擦+震声带', sample: 'decision', sampleCn: '决定' },
          { char: '/tʃ/ 清', sound: 'ch', sub: 'ch / tch', tip: '短促破擦送气清音', sample: 'cheap', sampleCn: '便宜的' },
          { char: '/dʒ/ 浊', sound: 'j', sub: 'j / g / dge', tip: '短促破擦震动声带浊音', sample: 'job', sampleCn: '工作' }
        ]
      },
      {
        id: 'consonants_other',
        name: '④ 鼻音、舌侧音与半元音 (8个)',
        desc: '决定英语连贯度与地道尾音的关键辅音：',
        items: [
          { char: '/m/', sound: 'mmm', sub: 'm', tip: '双唇紧闭鼻腔共鸣', sample: 'money', sampleCn: '钱' },
          { char: '/n/', sound: 'nnn', sub: 'n / kn', tip: '舌尖抵上齿龈鼻音', sample: 'need', sampleCn: '需要' },
          { char: '/ŋ/', sound: 'ing', sub: 'ng / nk', tip: '舌根抵软腭后鼻音', sample: 'thing', sampleCn: '事物' },
          { char: '/h/', sound: 'huh', sub: 'h / wh', tip: '气流顺畅通过声门', sample: 'help', sampleCn: '帮助' },
          { char: '/l/', sound: 'luh', sub: 'l / ll', tip: '词首清晰，词尾舌尖顶上齿龈', sample: 'feel', sampleCn: '感觉' },
          { char: '/r/', sound: 'ruh', sub: 'r / wr', tip: '舌尖向上卷起不碰上颚', sample: 'red', sampleCn: '红色的' },
          { char: '/w/', sound: 'wuh', sub: 'w / wh', tip: '双唇嘟圆快速滑开', sample: 'want', sampleCn: '想要' },
          { char: '/j/', sound: 'yuh', sub: 'y', tip: '舌面抬高快速发“耶”', sample: 'yes', sampleCn: '是的' }
        ]
      }
    ],
    soundClusters: [
      {
        title: "🎯 1. 双元音 /aɪ/ (-ight) 同韵拼读簇",
        rule: "gh 在此组合中永远静音不发音，掌握第1个即可顺读整串高频词！",
        words: [
          { w: "light", pron: "/laɪt/", cn: "光 / 轻的" },
          { w: "right", pron: "/raɪt/", cn: "正确的 / 右边" },
          { w: "night", pron: "/naɪt/", cn: "夜晚" },
          { w: "flight", pron: "/flaɪt/", cn: "航班" },
          { w: "bright", pron: "/braɪt/", cn: "明亮的" }
        ]
      },
      {
        title: "🎯 2. 长元音 /iː/ (-ea- / -ee-) 微笑长音簇",
        rule: "嘴角向两边微笑拉伸，声音饱满持久：",
        words: [
          { w: "eat", pron: "/iːt/", cn: "吃" },
          { w: "team", pron: "/tiːm/", cn: "团队" },
          { w: "seat", pron: "/siːt/", cn: "座位" },
          { w: "leave", pron: "/liːv/", cn: "离开" },
          { w: "cheap", pron: "/tʃiːp/", cn: "便宜的" }
        ]
      },
      {
        title: "🎯 3. 梅花音 /æ/ (-at / -ap / -an) 大开口家族",
        rule: "上下齿张开两指宽，下巴用力向下压，发出的声音洪亮扎实：",
        words: [
          { w: "apple", pron: "/ˈæp.əl/", cn: "苹果" },
          { w: "plan", pron: "/plæn/", cn: "计划" },
          { w: "cash", pron: "/kæʃ/", cn: "现金" },
          { w: "map", pron: "/mæp/", cn: "地图" },
          { w: "back", pron: "/bæk/", cn: "返回 / 后面" }
        ]
      },
      {
        title: "🎯 4. 双元音 /eɪ/ (a_e / -ay) 滑动家族",
        rule: "由 /e/ 平滑滑向 /ɪ/，口型由半开明显收小：",
        words: [
          { w: "take", pron: "/teɪk/", cn: "拿 / 乘坐" },
          { w: "make", pron: "/meɪk/", cn: "制作" },
          { w: "late", pron: "/leɪt/", cn: "迟到的" },
          { w: "pay", pron: "/peɪ/", cn: "支付" },
          { w: "wait", pron: "/weɪt/", cn: "等待" }
        ]
      },
      {
        title: "🎯 5. 卷舌长音 /ɜːr/ (-ir / -ur / -or) 家族",
        rule: "舌尖微微向上卷起，千万不要碰到上齿龈：",
        words: [
          { w: "work", pron: "/wɜːrk/", cn: "工作" },
          { w: "first", pron: "/fɜːrst/", cn: "第一" },
          { w: "turn", pron: "/tɜːrn/", cn: "转弯 / 轮流" },
          { w: "learn", pron: "/lɜːrn/", cn: "学习" },
          { w: "early", pron: "/ˈɜːr.li/", cn: "早的" }
        ]
      },
      {
        title: "🎯 6. 咬舌音 /θ/ & /ð/ (th-) 破冰家族",
        rule: "舌尖必须轻放在上下门牙之间吹气（清音）或震动声带（浊音）：",
        words: [
          { w: "think", pron: "/θɪŋk/", cn: "思考 (清)" },
          { w: "thank", pron: "/θæŋk/", cn: "感谢 (清)" },
          { w: "three", pron: "/θriː/", cn: "三 (清)" },
          { w: "this", pron: "/ðɪs/", cn: "这个 (浊)" },
          { w: "them", pron: "/ðem/", cn: "他们 (浊)" }
        ]
      },
      {
        title: "🎯 7. 后鼻音 /ŋ/ (-ing / -nk) 共鸣家族",
        rule: "舌根抬起抵住软腭，让气流从鼻腔出来：",
        words: [
          { w: "thing", pron: "/θɪŋ/", cn: "事物 / 东西" },
          { w: "bring", pron: "/brɪŋ/", cn: "带来" },
          { w: "meeting", pron: "/ˈmiː.tɪŋ/", cn: "会议" },
          { w: "bank", pron: "/bæŋk/", cn: "银行" },
          { w: "drink", pron: "/drɪŋk/", cn: "喝 / 饮料" }
        ]
      },
      {
        title: "🎯 8. 商务高频后缀 -tion 家族 (/ʃən/)",
        rule: "看到 -tion 结尾，重音100%落在它前面的那个元音上，节奏感极强：",
        words: [
          { w: "station", pron: "/ˈsteɪ.ʃən/", cn: "车站" },
          { w: "option", pron: "/ˈɒp.ʃən/", cn: "选项" },
          { w: "action", pron: "/ˈæk.ʃən/", cn: "行动" },
          { w: "decision", pron: "/dɪˈsɪʒ.ən/", cn: "决定" },
          { w: "information", pron: "/ˌɪn.fəˈmeɪ.ʃən/", cn: "信息" }
        ]
      }
    ],
    rules: [
      { title: "重音决定一切 (Stress)", desc: "英语是重音计时语言，重读音节清晰饱满，非重读音节常弱化为含糊的央元音 /ə/ (如 about, today)。" },
      { title: "辅音尾音轻触即止", desc: "词尾的 p / t / k / d 不要像中文加“特/克”元音，舌尖或双唇轻触憋住即可 (Stop consonant)。" },
      { title: "辅音+元音自然连读", desc: "前词辅音结尾 + 后词元音开头会直接拼在一起读，如 give_it → gi-vit。" },
      { title: "咬舌音 θ / ð 破冰", desc: "遇到 th (think, the, this)，舌尖必须微微伸出上下齿之间吹气，绝不能读成 s 或 z。" }
    ],
    minimalPairs: [
      {
        tag: "1. 长短元音 /iː/ vs /ɪ/",
        w1: "sheep",
        ipa1: "/ʃiːp/ (绵羊-微笑长音)",
        w2: "ship",
        ipa2: "/ʃɪp/ (轮船-短促放松)",
        tip: "不只差在长短，/ɪ/ 的口型更放松且偏像“衣”和“诶”之间。",
        sentence: "The sheep is on the big ship.",
        sentenceCn: "那只绵羊在大轮船上。"
      },
      {
        tag: "2. 咬舌清音 /θ/ vs 平舌 /s/",
        w1: "think",
        ipa1: "/θɪŋk/ (思考-舌尖轻咬)",
        w2: "sink",
        ipa2: "/sɪŋk/ (下沉-牙齿闭合)",
        tip: "把舌尖放在上下门牙中间吹气，就能瞬间告别中式口音。",
        sentence: "I think the ship will sink.",
        sentenceCn: "我认为这艘船会下沉。"
      },
      {
        tag: "3. 开口度大小 /æ/ vs /e/",
        w1: "bad",
        ipa1: "/bæd/ (坏的-两指大开口)",
        w2: "bed",
        ipa2: "/bed/ (床-一指小开口)",
        tip: "发 /æ/ 时下巴要用力往下拉，嘴角向两边裂开。",
        sentence: "This old bed is not bad.",
        sentenceCn: "这张旧床还不错（不算坏）。"
      },
      {
        tag: "4. 唇齿摩擦 /v/ vs 双唇 /w/",
        w1: "vest",
        ipa1: "/vest/ (背心-上齿咬下唇)",
        w2: "west",
        ipa2: "/west/ (西方-双唇嘟圆)",
        tip: "发 v 时上排门牙必须轻触下嘴唇震动声带。",
        sentence: "He wore a new vest in the west.",
        sentenceCn: "他在西部穿着一件新背心。"
      },
      {
        tag: "5. 清浊尾音 /v/ vs /f/",
        w1: "leave",
        ipa1: "/liːv/ (离开-元音略长)",
        w2: "leaf",
        ipa2: "/liːf/ (树叶-元音略短)",
        tip: "浊辅音结尾会让前面的元音听起来更饱满悠长。",
        sentence: "Don't leave the green leaf here.",
        sentenceCn: "别把那片绿叶留在这里。"
      },
      {
        tag: "6. 圆唇长短音 /uː/ vs /ʊ/",
        w1: "pool",
        ipa1: "/puːl/ (泳池-嘟唇长音)",
        w2: "pull",
        ipa2: "/pʊl/ (拉-短促放松)",
        tip: "发 /uː/ 双唇用力拢圆前突；发 /ʊ/ 双唇放松短促。",
        sentence: "Don't pull him into the pool.",
        sentenceCn: "别把他拉进泳池里。"
      },
      {
        tag: "7. 舌侧音 /l/ vs 卷舌音 /r/",
        w1: "light",
        ipa1: "/laɪt/ (光-舌尖顶上齿龈)",
        w2: "right",
        ipa2: "/raɪt/ (右边-舌尖悬空微卷)",
        tip: "发 l 时舌尖必须扎实顶住上牙堂；发 r 时舌尖绝不碰上颚。",
        sentence: "Turn on the light on your right.",
        sentenceCn: "打开你右手边的灯。"
      },
      {
        tag: "8. 卷舌 /ɜːr/ vs 圆唇 /ɔː/",
        w1: "work",
        ipa1: "/wɜːrk/ (工作-舌尖卷起)",
        w2: "walk",
        ipa2: "/wɔːk/ (散步-口腔圆唇打开)",
        tip: "work 靠卷舌发“沃克”；walk 不卷舌且元音是“奥”。",
        sentence: "I always walk to work today.",
        sentenceCn: "我今天总是走路去上班。"
      },
      {
        tag: "9. 前鼻音 /n/ vs 后鼻音 /ŋ/",
        w1: "thin",
        ipa1: "/θɪn/ (薄的-舌尖抵齿龈)",
        w2: "thing",
        ipa2: "/θɪŋ/ (东西-舌根抵软腭)",
        tip: "发 /n/ 收尾时舌尖在前面；发 /ŋ/ 时舌尖放平、舌根后缩。",
        sentence: "This thin book is a good thing.",
        sentenceCn: "这本薄薄的书是个好东西。"
      },
      {
        tag: "10. 咬舌浊音 /ð/ vs 爆破 /d/",
        w1: "they",
        ipa1: "/ðeɪ/ (他们-轻咬舌尖震动)",
        w2: "day",
        ipa2: "/deɪ/ (日子-舌尖弹开)",
        tip: "读 they / the / this 时舌尖轻轻伸出齿间，不要偷懒读成 day。",
        sentence: "They work hard every day.",
        sentenceCn: "他们每天都努力工作。"
      }
    ],
    legoWords: {
      verbs: [
        { w: "give", pron: "/ɡɪv/", cn: "给 / 递交", sampleId: 3 },
        { w: "want", pron: "/wɒnt/", cn: "想要", sampleId: 10 },
        { w: "need", pron: "/niːd/", cn: "需要", sampleId: 10 },
        { w: "have", pron: "/hæv/", cn: "有 / 拿", sampleId: 3 },
        { w: "go", pron: "/ɡəʊ/", cn: "去 / 前往", sampleId: 11 },
        { w: "take", pron: "/teɪk/", cn: "带走 / 乘坐", sampleId: 3 },
        { w: "buy", pron: "/baɪ/", cn: "买 / 购买", sampleId: 12 },
        { w: "eat", pron: "/iːt/", cn: "吃 / 用餐", sampleId: 12 },
        { w: "send", pron: "/send/", cn: "发送 / 寄", sampleId: 5 },
        { w: "show", pron: "/ʃəʊ/", cn: "展示 / 给…看", sampleId: 4 },
        { w: "know", pron: "/nəʊ/", cn: "知道 / 了解", sampleId: 12 },
        { w: "help", pron: "/help/", cn: "帮助 / 协助", sampleId: 9 }
      ],
      nouns: [
        { w: "money", pron: "/ˈmʌn.i/", cn: "钱 / 现金", sampleId: 5 },
        { w: "water", pron: "/ˈwɔː.tər/", cn: "水", sampleId: 3 },
        { w: "ticket", pron: "/ˈtɪk.ɪt/", cn: "票 / 机票", sampleId: 4 },
        { w: "hotel", pron: "/həʊˈtel/", cn: "酒店", sampleId: 1 },
        { w: "phone", pron: "/fəʊn/", cn: "手机 / 电话", sampleId: 2 },
        { w: "report", pron: "/rɪˈpɔːt/", cn: "报告 / 文件", sampleId: 1 },
        { w: "time", pron: "/taɪm/", cn: "时间", sampleId: 1 },
        { w: "client", pron: "/ˈklaɪ.ənt/", cn: "客户", sampleId: 2 },
        { w: "station", pron: "/ˈsteɪ.ʃən/", cn: "车站", sampleId: 7 },
        { w: "bathroom", pron: "/ˈbɑːθ.ruːm/", cn: "洗手间", sampleId: 7 },
        { w: "today", pron: "/təˈdeɪ/", cn: "今天", sampleId: 9 },
        { w: "tomorrow", pron: "/təˈmɒr.əʊ/", cn: "明天", sampleId: 11 }
      ],
      modifiers: [
        { w: "good", pron: "/ɡʊd/", cn: "好的", sampleId: 1 },
        { w: "ready", pron: "/ˈred.i/", cn: "准备好的", sampleId: 1 },
        { w: "expensive", pron: "/ɪkˈspen.sɪv/", cn: "昂贵的", sampleId: 8 },
        { w: "cheap", pron: "/tʃiːp/", cn: "便宜的", sampleId: 8 },
        { w: "urgent", pron: "/ˈɜː.dʒənt/", cn: "紧急的", sampleId: 7 },
        { w: "free", pron: "/friː/", cn: "免费的 / 空闲的", sampleId: 7 },
        { w: "very", pron: "/ˈver.i/", cn: "非常 / 很", sampleId: 1 },
        { w: "now", pron: "/naʊ/", cn: "现在", sampleId: 9 },
        { w: "here", pron: "/hɪər/", cn: "这里", sampleId: 1 },
        { w: "where", pron: "/weər/", cn: "在哪里", sampleId: 7 },
        { w: "because", pron: "/bɪˈkɒz/", cn: "因为", sampleId: 12 },
        { w: "but", pron: "/bʌt/", cn: "但是", sampleId: 12 }
      ]
    }
  },
  ja: {
    subtitle: "完整五十音全景图 (清音/浊音/拗音) + 易混长短/促音对决 + 同音词族",
    alphabetTitle: "🗺️ 日语完整五十音全景体系表 (第一行听假名单音 · 第三行听例词)",
    phoneticCategories: [
      {
        id: 'seion',
        name: '① 清音全表 (46个基础假名: 5元音 × 10行)',
        desc: '日语的根基！每一行都是由「辅音声母 + a / i / u / e / o 五个元音」拼成，第一行听单音，第三行听例词：',
        isGrid5: true,
        items: [
          // あ行
          { char: 'あ / ア', sound: 'あ', sub: 'a', tip: '源于汉字“安”，口型自然打开', sample: 'あさ', sampleCn: '早晨' },
          { char: 'い / イ', sound: 'い', sub: 'i', tip: '源于汉字“以”，嘴角微展', sample: 'いま', sampleCn: '现在' },
          { char: 'う / ウ', sound: 'う', sub: 'u', tip: '源于汉字“宇”，双唇放平不撅嘴', sample: 'うみ', sampleCn: '大海' },
          { char: 'え / エ', sound: 'え', sub: 'e', tip: '源于汉字“衣”，发清脆的“诶”', sample: 'えき', sampleCn: '车站' },
          { char: 'お / オ', sound: 'お', sub: 'o', tip: '源于汉字“於”，圆唇固定发“哦”', sample: 'おかね', sampleCn: '钱' },
          // か行
          { char: 'か / カ', sound: 'か', sub: 'ka', tip: '源于汉字“加”，清脆发 ka', sample: 'かさ', sampleCn: '雨伞' },
          { char: 'き / キ', sound: 'き', sub: 'ki', tip: '源于“幾”，形状像钥匙 Key', sample: 'きっぷ', sampleCn: '车票' },
          { char: 'く / ク', sound: 'く', sub: 'ku', tip: '源于“久”，形状像小于号 <', sample: 'くるま', sampleCn: '汽车' },
          { char: 'け / ケ', sound: 'け', sub: 'ke', tip: '源于汉字“計/介”', sample: 'けさ', sampleCn: '今早' },
          { char: 'こ / コ', sound: 'こ', sub: 'ko', tip: '源于汉字“己”，上下两横', sample: 'これ', sampleCn: '这个' },
          // さ行
          { char: 'さ / サ', sound: 'さ', sub: 'sa', tip: '源于汉字“左/散”', sample: 'さかな', sampleCn: '鱼' },
          { char: 'し / シ', sound: 'し', sub: 'shi', tip: '源于“之”，读如中文“吸”', sample: 'しりょう', sampleCn: '资料' },
          { char: 'す / ス', sound: 'す', sub: 'su', tip: '源于“寸/須”，读音接近 si/su', sample: 'すし', sampleCn: '寿司' },
          { char: 'せ / セ', sound: 'せ', sub: 'se', tip: '源于汉字“世”', sample: 'せかい', sampleCn: '世界' },
          { char: 'そ / ソ', sound: 'そ', sub: 'so', tip: '源于汉字“曽”', sample: 'それ', sampleCn: '那个' },
          // た行
          { char: 'た / タ', sound: 'た', sub: 'ta', tip: '源于汉字“太/多”', sample: 'たかい', sampleCn: '贵的/高的' },
          { char: 'ち / チ', sound: 'ち', sub: 'chi', tip: '源于“知/千”，读如中文“七”', sample: 'ちかい', sampleCn: '近的' },
          { char: 'つ / ツ', sound: 'つ', sub: 'tsu', tip: '源于“川”，读如“次/呲”', sample: 'つくえ', sampleCn: '书桌' },
          { char: 'て / テ', sound: 'て', sub: 'te', tip: '源于汉字“天”', sample: 'てがみ', sampleCn: '信件' },
          { char: 'と / ト', sound: 'と', sub: 'to', tip: '源于汉字“止”', sample: 'とけい', sampleCn: '钟表' },
          // な行
          { char: 'な / ナ', sound: 'な', sub: 'na', tip: '源于汉字“奈”', sample: 'なつ', sampleCn: '夏天' },
          { char: 'に / ニ', sound: 'に', sub: 'ni', tip: '源于汉字“仁/二”', sample: 'にく', sampleCn: '肉' },
          { char: 'ぬ / ヌ', sound: 'ぬ', sub: 'nu', tip: '源于汉字“奴”', sample: 'いぬ', sampleCn: '狗' },
          { char: 'ね / ネ', sound: 'ね', sub: 'ne', tip: '源于汉字“祢”', sample: 'ねこ', sampleCn: '猫' },
          { char: 'の / ノ', sound: 'の', sub: 'no', tip: '源于“乃”，表所属“的”', sample: 'のみもの', sampleCn: '饮料' },
          // は行
          { char: 'は / ハ', sound: 'は', sub: 'ha (助词wa)', tip: '源于“波/八”，作助词读 wa', sample: 'はな', sampleCn: '花' },
          { char: 'ひ / ヒ', sound: 'ひ', sub: 'hi', tip: '源于汉字“比”', sample: 'ひと', sampleCn: '人' },
          { char: 'ふ / フ', sound: 'ふ', sub: 'fu (hu)', tip: '源于“不”，双唇微吹气不咬唇', sample: 'ふゆ', sampleCn: '冬天' },
          { char: 'へ / ヘ', sound: 'へ', sub: 'he (助词e)', tip: '源于“部”，作方向助词读 e', sample: 'へや', sampleCn: '房间' },
          { char: 'ほ / ホ', sound: 'ほ', sub: 'ho', tip: '源于汉字“保”', sample: 'ホテル', sampleCn: '酒店' },
          // ま行
          { char: 'ま / マ', sound: 'ま', sub: 'ma', tip: '源于汉字“末/万”', sample: 'まち', sampleCn: '街道/城镇' },
          { char: 'み / ミ', sound: 'み', sub: 'mi', tip: '源于汉字“美/三”', sample: 'みず', sampleCn: '水' },
          { char: 'む / ム', sound: 'む', sub: 'mu', tip: '源于汉字“武/牟”', sample: 'むりょう', sampleCn: '免费' },
          { char: 'め / メ', sound: 'め', sub: 'me', tip: '源于汉字“女”', sample: 'めがね', sampleCn: '眼镜' },
          { char: 'も / モ', sound: 'も', sub: 'mo', tip: '源于汉字“毛”，表“也”', sample: 'もの', sampleCn: '东西/物品' },
          // や行
          { char: 'や / ヤ', sound: 'や', sub: 'ya', tip: '源于汉字“也”', sample: 'やすい', sampleCn: '便宜的' },
          { char: '（い）', sound: 'い', sub: '(i)', tip: 'や行空位，直接复用 い', sample: 'いま', sampleCn: '现在' },
          { char: 'ゆ / ユ', sound: 'ゆ', sub: 'yu', tip: '源于汉字“由”', sample: 'ゆき', sampleCn: '雪' },
          { char: '（え）', sound: 'え', sub: '(e)', tip: 'や行空位，直接复用 え', sample: 'えき', sampleCn: '车站' },
          { char: 'よ / ヨ', sound: 'よ', sub: 'yo', tip: '源于汉字“与”', sample: 'よる', sampleCn: '夜晚' },
          // ら行
          { char: 'ら / ラ', sound: 'ら', sub: 'ra (la)', tip: '源于“良”，不卷舌读如 la', sample: 'らいねん', sampleCn: '明年' },
          { char: 'り / リ', sound: 'り', sub: 'ri (li)', tip: '源于“利”，读如中文“里”', sample: 'りんご', sampleCn: '苹果' },
          { char: 'る / ル', sound: 'る', sub: 'ru (lu)', tip: '源于“留”，常作动词原形词尾', sample: 'ルール', sampleCn: '规则' },
          { char: 'れ / レ', sound: 'れ', sub: 're (le)', tip: '源于汉字“礼”', sample: 'れきし', sampleCn: '历史' },
          { char: 'ろ / ロ', sound: 'ろ', sub: 'ro (lo)', tip: '源于汉字“呂”', sample: 'ろく', sampleCn: '六 (6)' },
          // わ行 + ん
          { char: 'わ / ワ', sound: 'わ', sub: 'wa', tip: '源于汉字“和”', sample: 'わたし', sampleCn: '我' },
          { char: 'を / ヲ', sound: 'を', sub: 'o (wo)', tip: '仅作宾语助词，读音同 お(o)', sample: 'みずを', sampleCn: '把水(宾语)' },
          { char: 'ん / ン', sound: 'ん', sub: 'n (拨音)', tip: '独立占满一拍的鼻音共鸣', sample: 'にほん', sampleCn: '日本' }
        ]
      },
      {
        id: 'dakuon',
        name: '② 浊音与半浊音全表 (25个: 右上角加两点 ゛ 或小圆圈 ゜)',
        desc: '只需记住规律：か(k)→が(g)、さ(s)→ざ(z)、た(t)→だ(d)、は(h)→ば(b) / ぱ(p)！',
        isGrid5: true,
        items: [
          // が行
          { char: 'が / ガ', sound: 'が', sub: 'ga', tip: 'か 浊化 k→g', sample: 'がっこう', sampleCn: '学校' },
          { char: 'ぎ / ギ', sound: 'ぎ', sub: 'gi', tip: 'き 浊化 ki→gi', sample: 'かぎ', sampleCn: '钥匙' },
          { char: 'ぐ / グ', sound: 'ぐ', sub: 'gu', tip: 'く 浊化 ku→gu', sample: 'すぐ', sampleCn: '马上/立刻' },
          { char: 'げ / ゲ', sound: 'げ', sub: 'ge', tip: 'け 浊化 ke→ge', sample: 'げんき', sampleCn: '健康/精神' },
          { char: 'ご / ゴ', sound: 'ご', sub: 'go', tip: 'こ 浊化 ko→go', sample: 'ごはん', sampleCn: '米饭/饭' },
          // ざ行
          { char: 'ざ / ザ', sound: 'ざ', sub: 'za', tip: 'さ 浊化 s→z', sample: 'ざっし', sampleCn: '杂志' },
          { char: 'じ / ジ', sound: 'じ', sub: 'ji', tip: 'し 浊化读如“机”', sample: 'じかん', sampleCn: '时间' },
          { char: 'ず / ズ', sound: 'ず', sub: 'zu', tip: 'す 浊化读如“资”', sample: 'みず', sampleCn: '水' },
          { char: 'ぜ / ゼ', sound: 'ぜ', sub: 'ze', tip: 'せ 浊化 se→ze', sample: 'ぜんぶ', sampleCn: '全部' },
          { char: 'ぞ / ゾ', sound: 'ぞ', sub: 'zo', tip: 'そ 浊化 so→zo', sample: 'かぞく', sampleCn: '家人/家族' },
          // だ行
          { char: 'だ / ダ', sound: 'だ', sub: 'da', tip: 'た 浊化 t→d', sample: 'だいじょうぶ', sampleCn: '没问题' },
          { char: 'ぢ / ヂ', sound: 'ぢ', sub: 'ji (di)', tip: '同 じ 发音完全相同', sample: 'ちぢむ', sampleCn: '缩小/缩短' },
          { char: 'づ / ヅ', sound: 'づ', sub: 'zu (du)', tip: '同 ず 发音完全相同', sample: 'つづく', sampleCn: '继续/待续' },
          { char: 'で / デ', sound: 'で', sub: 'de', tip: 'て 浊化 te→de', sample: 'でんしゃ', sampleCn: '电车' },
          { char: 'ど / ド', sound: 'ど', sub: 'do', tip: 'と 浊化 to→do', sample: 'どこ', sampleCn: '哪里' },
          // ば行
          { char: 'ば / バ', sound: 'ば', sub: 'ba', tip: 'は 浊化 h→b', sample: 'ばんごはん', sampleCn: '晚饭' },
          { char: 'び / ビ', sound: 'び', sub: 'bi', tip: 'ひ 浊化 hi→bi', sample: 'びょういん', sampleCn: '医院' },
          { char: 'ぶ / ブ', sound: 'ぶ', sub: 'bu', tip: 'ふ 浊化 fu→bu', sample: 'ぶんか', sampleCn: '文化' },
          { char: 'べ / ベ', sound: 'べ', sub: 'be', tip: 'へ 浊化 he→be', sample: 'べんり', sampleCn: '方便/便利' },
          { char: 'ぼ / ボ', sound: 'ぼ', sub: 'bo', tip: 'ほ 浊化 ho→bo', sample: 'ぼく', sampleCn: '我(男性自称)' },
          // ぱ行
          { char: 'ぱ / パ', sound: 'ぱ', sub: 'pa', tip: '加小圆圈半浊音 p', sample: 'パン', sampleCn: '面包' },
          { char: 'ぴ / ピ', sound: 'ぴ', sub: 'pi', tip: '半浊音 pi', sample: 'ぴかぴか', sampleCn: '闪闪发亮' },
          { char: 'ぷ / プ', sound: 'ぷ', sub: 'pu', tip: '半浊音 pu', sample: 'プレゼント', sampleCn: '礼物' },
          { char: 'ぺ / ペ', sound: 'ぺ', sub: 'pe', tip: '半浊音 pe', sample: 'ペン', sampleCn: '钢笔/笔' },
          { char: 'ぽ / ポ', sound: 'ぽ', sub: 'po', tip: '半浊音 po', sample: 'ポスト', sampleCn: '邮筒/信箱' }
        ]
      },
      {
        id: 'youon',
        name: '③ 拗音与特殊节拍符号 (い段假名 + 小号 ゃ/ゅ/ょ 拼成1拍)',
        desc: '右下角跟小号 ゃ/ゅ/ょ 时，两个假名快速连拼成 1 拍！加上促音「っ」与长音「ー」即构成完整日语发音：',
        items: [
          { char: 'きゃ / きゅ / きょ', sound: 'きゃ、きゅ、きょ', sub: 'kya / kyu / kyo', tip: 'き + 小号やゆよ连拼', sample: 'きょう', sampleCn: '今天' },
          { char: 'しゃ / しゅ / しょ', sound: 'しゃ、しゅ、しょ', sub: 'sha / shu / sho', tip: 'し + 小号やゆよ连拼', sample: 'しゃしん', sampleCn: '照片' },
          { char: 'ちゃ / ちゅ / ちょ', sound: 'ちゃ、ちゅ、ちょ', sub: 'cha / chu / cho', tip: 'ち + 小号やゆよ连拼', sample: 'おちゃ', sampleCn: '茶' },
          { char: 'にゃ / にゅ / にょ', sound: 'にゃ、にゅ、にょ', sub: 'nya / nyu / nyo', tip: 'に + 小号やゆよ连拼', sample: 'ぎゅうにゅう', sampleCn: '牛奶' },
          { char: 'ひゃ / ひゅ / ひょ', sound: 'ひゃ、ひゅ、ひょ', sub: 'hya / hyu / hyo', tip: 'ひ + 小号やゆよ连拼', sample: 'ひゃく', sampleCn: '一百 (100)' },
          { char: 'みゃ / みゅ / みょ', sound: 'みゃ、みゅ、みょ', sub: 'mya / myu / myo', tip: 'み + 小号やゆよ连拼', sample: 'みょうじ', sampleCn: '姓氏' },
          { char: 'りゃ / りゅ / りょ', sound: 'りゃ、りゅ、りょ', sub: 'rya / ryu / ryo', tip: 'り + 小号やゆよ连拼', sample: 'りょこう', sampleCn: '旅行' },
          { char: 'ぎゃ / ぎゅ / ぎょ', sound: 'ぎゃ、ぎゅ、ぎょ', sub: 'gya / gyu / gyo', tip: 'ぎ + 小号やゆよ连拼', sample: 'ぎんこう', sampleCn: '银行' },
          { char: 'じゃ / じゅ / じょ', sound: 'じゃ、じゅ、じょ', sub: 'ja / ju / jo', tip: 'じ + 小号やゆよ连拼', sample: 'じゅんび', sampleCn: '准备' },
          { char: 'びゃ / ぴゃ行', sound: 'びょう、ぴゃく', sub: 'bya / pya', tip: 'び/ぴ + 小号やゆよ连拼', sample: 'びょういん', sampleCn: '医院' },
          { char: 'っ (促音)', sound: 'きって', sub: '憋气停顿 1 拍', tip: '停顿一拍后再爆破下一音', sample: 'きって', sampleCn: '邮票' },
          { char: 'ー (长音)', sound: 'コーヒー', sub: '拖长元音 1 拍', tip: '把前一个元音拉长一倍', sample: 'コーヒー', sampleCn: '咖啡' }
        ]
      }
    ],
    soundClusters: [
      {
        title: "🎯 1. 中国人外挂：汉字音读「こう (kou)」同音家族",
        rule: "中文里读 gong / jiao / gao / kong 的汉字，在日语里几乎全读「こう (kou)」！顺读一串秒记5个核心词：",
        words: [
          { w: "こうえん (公園)", pron: "kou-en", cn: "公园" },
          { w: "こうつう (交通)", pron: "kou-tsuu", cn: "交通" },
          { w: "こうこう (高校)", pron: "kou-kou", cn: "高中" },
          { w: "くうこう (空港)", pron: "kuu-kou", cn: "机场" },
          { w: "せいこう (成功)", pron: "sei-kou", cn: "成功" }
        ]
      },
      {
        title: "🎯 2. 汉字音读「かん (kan)」拨音家族",
        rule: "中文带 -an 韵母的汉字（感、馆、间、简、韩），日语里常对应「かん (kan)」，注意拨音 ん 占满一拍：",
        words: [
          { w: "じかん (時間)", pron: "ji-kan", cn: "时间" },
          { w: "かんたん (簡単)", pron: "kan-tan", cn: "简单" },
          { w: "としょかん (図書館)", pron: "to-sho-kan", cn: "图书馆" },
          { w: "しんかんせん (新幹線)", pron: "shin-kan-sen", cn: "新干线" },
          { w: "かんこく (韓国)", pron: "kan-ko-ku", cn: "韩国" }
        ]
      },
      {
        title: "🎯 3. 英语者外挂：片假名「～ル (-ru)」尾音家族",
        rule: "英语以 -l / -r / -le 结尾的词，日语片假名全部变成「ル (ru)」！大声读出来就能瞬间听懂对应英文：",
        words: [
          { w: "ホテル", pron: "ho-te-ru", cn: "Hotel (酒店)" },
          { w: "ビール", pron: "bii-ru", cn: "Beer (啤酒)" },
          { w: "ルール", pron: "ruu-ru", cn: "Rule (规则)" },
          { w: "テーブル", pron: "tee-bu-ru", cn: "Table (桌子)" },
          { w: "メール", pron: "mee-ru", cn: "Mail (邮件)" }
        ]
      },
      {
        title: "🎯 4. 促音「っ」停顿爆破家族",
        rule: "遇到小号「っ」必须屏住呼吸停顿整整 1 拍，再爆破出后面的辅音：",
        words: [
          { w: "きっぷ (切符)", pron: "kip-pu", cn: "车票" },
          { w: "きって (切手)", pron: "kit-te", cn: "邮票" },
          { w: "ざっし (雑誌)", pron: "zas-shi", cn: "杂志" },
          { w: "がっこう (学校)", pron: "gak-kou", cn: "学校" },
          { w: "いっぷん (一分)", pron: "ip-pun", cn: "一分钟" }
        ]
      },
      {
        title: "🎯 5. 拗音「しゃ / ちょう / りょ」连拼家族",
        rule: "大假名 + 小号 ゃ/ゅ/ょ 必须快速捏成 1 拍读出，绝不能拆成两拍：",
        words: [
          { w: "でんしゃ (電車)", pron: "den-sha", cn: "电车" },
          { w: "しゃしん (写真)", pron: "sha-shin", cn: "照片" },
          { w: "かいしゃ (会社)", pron: "kai-sha", cn: "公司" },
          { w: "りょこう (旅行)", pron: "ryo-kou", cn: "旅行" },
          { w: "しりょう (資料)", pron: "shi-ryou", cn: "资料" }
        ]
      },
      {
        title: "🎯 6. 浊音与半浊音「が / ざ / だ / ば / ぱ」家族",
        rule: "右上角加两点震动声带，加小圈双唇爆破发 p：",
        words: [
          { w: "かぎ (鍵)", pron: "ka-gi", cn: "钥匙" },
          { w: "みず (水)", pron: "mi-zu", cn: "水" },
          { w: "でんわ (電話)", pron: "den-wa", cn: "电话" },
          { w: "かばん (鞄)", pron: "ka-ban", cn: "包 / 公文包" },
          { w: "パン", pron: "pan", cn: "面包" }
        ]
      },
      {
        title: "🎯 7. 礼貌体动词「～ます (-masu)」动作家族",
        rule: "日本生活最核心的礼貌动作词尾全部以「ます (masu)」收尾，一串读通：",
        words: [
          { w: "いきます", pron: "i-ki-ma-su", cn: "去 (行く)" },
          { w: "みます", pron: "mi-ma-su", cn: "看 (見る)" },
          { w: "たべます", pron: "ta-be-ma-su", cn: "吃 (食べる)" },
          { w: "のみます", pron: "no-mi-ma-su", cn: "喝 (飲む)" },
          { w: "かいます", pron: "ka-i-ma-su", cn: "买 (買う)" }
        ]
      },
      {
        title: "🎯 8. い形容词「～い (-i)」高频状态家族",
        rule: "日语形容词天然以「い」结尾，可直接修饰名词或加 です 结句：",
        words: [
          { w: "たかい (高い)", pron: "ta-ka-i", cn: "贵的 / 高的" },
          { w: "やすい (安い)", pron: "ya-su-i", cn: "便宜的" },
          { w: "おいしい", pron: "o-i-shi-i", cn: "好吃的" },
          { w: "あたらしい (新しい)", pron: "a-ta-ra-shi-i", cn: "新的" },
          { w: "いそがしい (忙しい)", pron: "i-so-ga-shi-i", cn: "忙碌的" }
        ]
      }
    ],
    rules: [
      { title: "5个元音走天下 (a i u e o)", desc: "日语所有假名都建立在 あ(a) い(i) う(u) え(e) お(o) 之上，口型小而固定，绝不滑动。" },
      { title: "节拍等时制 (Mora)", desc: "每个假名占完全相同的 1 拍！长音「ー」、促音「っ(停顿一拍)」、拨音「ん」都必须严格占满 1 拍。" },
      { title: "助词「は / を」特殊读音", desc: "「は」作主题助词时读 wa (不读 ha)；「を」作宾语助词时直接读 o。" },
      { title: "动词永远稳坐句尾", desc: "无论句子多长，核心动作（买、去、给、吃）永远放在整句话的最后一个词！" }
    ],
    minimalPairs: [
      {
        tag: "1. 短音 vs 长音 (差一拍辈分全变)",
        w1: "おばさん",
        ipa1: "obasan (阿姨 - 4拍)",
        w2: "おばあさん",
        ipa2: "obaasan (奶奶 - 5拍)",
        tip: "把「あ」多拖长一拍，辈分直接涨一代！日语长音绝不能偷工减料。",
        sentence: "あそこに おばさんと おばあさんが います。",
        sentenceCn: "那里有一位阿姨和一位老奶奶。"
      },
      {
        tag: "2. 无促音 vs 促音「っ」停顿",
        w1: "きて",
        ipa1: "kite (请来 - 连贯2拍)",
        w2: "きって",
        ipa2: "kitte (邮票 - 中间憋气停1拍)",
        tip: "看到小号「っ」时，嘴巴提前做好下一个辅音口型并屏住呼吸停顿一拍。",
        sentence: "ここへ きて、きってを ください。",
        sentenceCn: "请来这里，把邮票给我。"
      },
      {
        tag: "3. 清音 vs 浊音 (两点゛之差)",
        w1: "かき",
        ipa1: "kaki (柿子 - 清脆不震声带)",
        w2: "かぎ",
        ipa2: "kagi (钥匙 - 鼻音浊化)",
        tip: "右上角带两点「゛」即为浊音，声带需明显震动。",
        sentence: "かぎと かきは テーブルの うえです。",
        sentenceCn: "钥匙和柿子在桌子上。"
      },
      {
        tag: "4. 普通音 vs 拨音「ん」",
        w1: "かご",
        ipa1: "kago (篮子 - 2拍)",
        w2: "かんご",
        ipa2: "kango (护理 - 3拍)",
        tip: "拨音「ん」也要独占完整的一拍鼻音节拍。",
        sentence: "かごの なかに かんごの ほんが あります。",
        sentenceCn: "篮子里面有护理的书。"
      },
      {
        tag: "5. 片假名短音 vs 长音「ー」",
        w1: "ビル",
        ipa1: "biru (大楼 - 2拍)",
        w2: "ビール",
        ipa2: "biiru (啤酒 - 3拍)",
        tip: "在日本点啤酒千万要把「ー」拖长一拍，否则服务员会以为你在说大楼！",
        sentence: "この ビルで つめたい ビールを のみます。",
        sentenceCn: "在这栋大楼里喝冰镇啤酒。"
      },
      {
        tag: "6. 叔叔 vs 爷爷 (い段长音对比)",
        w1: "おじさん",
        ipa1: "ojisan (叔叔 - 4拍)",
        w2: "おじいさん",
        ipa2: "ojiisan (爷爷 - 5拍)",
        tip: "い段假名后面跟「い」表示把 i 的音拉长一倍。",
        sentence: "おじさんと おじいさんは げんきです。",
        sentenceCn: "叔叔和爷爷身体都很好。"
      },
      {
        tag: "7. 这里 vs 高中 (お段长音对比)",
        w1: "ここ",
        ipa1: "koko (这里 - 2拍)",
        w2: "こうこう",
        ipa2: "koukou (高中 - 4拍)",
        tip: "お段假名后接「う」时，不读 u，而是把前面的 o 拉长一拍！",
        sentence: "ここは わたしの こうこうです。",
        sentenceCn: "这里是我的高中。"
      },
      {
        tag: "8. 坡道 vs 作家 (さか vs さっか)",
        w1: "さか",
        ipa1: "saka (坡道 - 2拍)",
        w2: "さっか",
        ipa2: "sakka (作家 - 3拍停顿)",
        tip: "さっか 中间有明显的一拍停顿憋气感。",
        sentence: "あの さかに ゆうめいな さっかが います。",
        sentenceCn: "那个坡道上有一位著名的作家。"
      },
      {
        tag: "9. 词首清浊音 (天气 vs 电器)",
        w1: "てんき",
        ipa1: "tenki (天气 - 清音 t)",
        w2: "でんき",
        ipa2: "denki (电/电灯 - 浊音 d)",
        tip: "日语词首清音 t 不送气，而浊音 d 声带从起音就强烈震动。",
        sentence: "きょうは いい てんきですから、でんきを けします。",
        sentenceCn: "今天天气很好，所以把电灯关掉。"
      },
      {
        tag: "10. 拗音 vs 直音 (医院 vs 美容院)",
        w1: "びょういん",
        ipa1: "byouin (医院 - 小ょ拗音连拼)",
        w2: "びよういん",
        ipa2: "biyouin (美容院 - 大よ独立成拍)",
        tip: "小号「ょ」和前面的 び 合拼为 byo；大号「よ」则单独读 bi-yo-u-in！去日本千万别走错门！",
        sentence: "びょういんの となりに びよういんが あります。",
        sentenceCn: "医院的旁边有一家美容院。"
      }
    ],
    legoWords: {
      verbs: [
        { w: "あげます", pron: "agemasu", cn: "给", sampleId: 3 },
        { w: "いきます", pron: "ikimasu", cn: "去", sampleId: 11 },
        { w: "たべます", pron: "tabemasu", cn: "吃", sampleId: 12 },
        { w: "かいます", pron: "kaimasu", cn: "买", sampleId: 10 },
        { w: "みます", pron: "mimasu", cn: "看", sampleId: 4 },
        { w: "おくります", pron: "okurimasu", cn: "发送 / 寄", sampleId: 5 },
        { w: "わかります", pron: "wakarimasu", cn: "明白 / 懂", sampleId: 12 },
        { w: "します", pron: "shimasu", cn: "做 / 办", sampleId: 9 },
        { w: "あります", pron: "arimasu", cn: "有 (物品)", sampleId: 1 },
        { w: "ください", pron: "kudasai", cn: "请给我…", sampleId: 3 },
        { w: "てつだいます", pron: "tetsudaimasu", cn: "帮忙", sampleId: 10 },
        { w: "のみます", pron: "nomimasu", cn: "喝", sampleId: 12 }
      ],
      nouns: [
        { w: "わたし", pron: "watashi", cn: "我", sampleId: 3 },
        { w: "これ", pron: "kore", cn: "这个", sampleId: 1 },
        { w: "みず", pron: "mizu", cn: "水", sampleId: 3 },
        { w: "おかね", pron: "okane", cn: "钱", sampleId: 5 },
        { w: "えき", pron: "eki", cn: "车站", sampleId: 7 },
        { w: "ホテル", pron: "hoteru", cn: "酒店", sampleId: 2 },
        { w: "トイレ", pron: "toire", cn: "洗手间", sampleId: 7 },
        { w: "スマホ", pron: "sumaho", cn: "手机", sampleId: 2 },
        { w: "しりょう", pron: "shiryou", cn: "资料 / 报告", sampleId: 1 },
        { w: "きょう", pron: "kyou", cn: "今天", sampleId: 9 },
        { w: "あした", pron: "ashita", cn: "明天", sampleId: 11 },
        { w: "いま", pron: "ima", cn: "现在", sampleId: 1 }
      ],
      modifiers: [
        { w: "いい", pron: "ii", cn: "好的", sampleId: 1 },
        { w: "たかい", pron: "takai", cn: "贵的 / 高的", sampleId: 8 },
        { w: "やすい", pron: "yasui", cn: "便宜的", sampleId: 8 },
        { w: "おいしい", pron: "oishii", cn: "好吃的", sampleId: 1 },
        { w: "だいじょうぶ", pron: "daijoubu", cn: "没问题 / 行的", sampleId: 7 },
        { w: "むりょう", pron: "muryou", cn: "免费的", sampleId: 7 },
        { w: "とても", pron: "totemo", cn: "非常 / 很", sampleId: 1 },
        { w: "どこ", pron: "doko", cn: "哪里", sampleId: 7 },
        { w: "いくら", pron: "ikura", cn: "多少钱", sampleId: 7 },
        { w: "は (助词)", pron: "wa", cn: "主题标记 (…是)", sampleId: 1 },
        { w: "を (助词)", pron: "o", cn: "把… (宾语标记)", sampleId: 3 },
        { w: "に (助词)", pron: "ni", cn: "向/给… (对象标记)", sampleId: 3 }
      ]
    }
  },
  es: {
    subtitle: "27字母+特殊拼读全景表 + 颤音/重音对比 + 同尾词族串烧",
    alphabetTitle: "🗺️ 西班牙语完整发音体系全表 (第一行听字母单音 · 第三行听例词)",
    phoneticCategories: [
      {
        id: 'es_vowels',
        name: '① 5 大恒定元音 + 二合元音 (占西语拼读 50% 功力)',
        desc: '西语元音永远不変音、不弱化！点击第一行【🔊单音】听纯粹元音，点击第三行听例词：',
        isGrid5: true,
        items: [
          { char: 'A a', sound: 'a', sub: '/a/ (阿)', tip: '口型张大固定发“阿”', sample: 'agua', sampleCn: '水' },
          { char: 'E e', sound: 'e', sub: '/e/ (诶)', tip: '嘴角微展发清脆“诶”', sample: 'eso', sampleCn: '那个' },
          { char: 'I i', sound: 'i', sub: '/i/ (衣)', tip: '永远发微笑“衣”', sample: 'isla', sampleCn: '岛屿' },
          { char: 'O o', sound: 'o', sub: '/o/ (哦)', tip: '圆唇固定发“哦”', sample: 'hola', sampleCn: '你好' },
          { char: 'U u', sound: 'u', sub: '/u/ (乌)', tip: '圆唇发“乌” (qu/gu中静音)', sample: 'uno', sampleCn: '一 (1)' },
          { char: 'ia / ie', sound: 'ia, ie', sub: '呀 / 耶', tip: 'i 快速滑向 a/e', sample: 'quiero', sampleCn: '我想要' },
          { char: 'io / iu', sound: 'io, iu', sub: '哟 / 优', tip: 'i 快速滑向 o/u', sample: 'precio', sampleCn: '价格' },
          { char: 'ua / ue', sound: 'ua, ue', sub: '哇 / 威', tip: 'u 快速滑向 a/e', sample: 'bueno', sampleCn: '好的' },
          { char: 'ai / ei', sound: 'ai, ei', sub: '爱 / 欸', tip: 'a/e 滑向 i', sample: 'aire', sampleCn: '空气' },
          { char: 'au / eu', sound: 'au, eu', sub: '奥 / 欧', tip: 'a/e 滑向 u', sample: 'auto', sampleCn: '汽车' }
        ]
      },
      {
        id: 'es_special',
        name: '② 12 个必背特殊辅音与双字母变音规则 (西语拼读灵魂)',
        desc: '西语里唯一跟英语拼音习惯不同的就是这 12 组！记住它们就能 100% 盲读所有西语词：',
        items: [
          { char: 'H h', sound: 'ola', sub: '永远静音!', tip: '在任何位置都像空气一样不发音', sample: 'hotel', sampleCn: '酒店' },
          { char: 'J j', sound: 'ja, je', sub: '/x/ (喝)', tip: '永远发中文“喝/哈”的擦喉音', sample: 'Juan', sampleCn: '胡安(人名)' },
          { char: 'Ñ ñ', sound: 'nya', sub: '/ɲ/ (涅)', tip: '舌面贴硬腭，发“尼亚/涅”', sample: 'mañana', sampleCn: '明天/上午' },
          { char: 'LL ll', sound: 'ya', sub: '/ʝ/ (耶)', tip: '不读 l，读如英语 yes 的 y', sample: 'ella', sampleCn: '她' },
          { char: 'RR rr', sound: 'rra, rro', sub: '/r/ 大舌颤音', tip: '双写 rr 或词首 r 需连续弹舌', sample: 'perro', sampleCn: '狗' },
          { char: 'R r (单)', sound: 'ra, ro', sub: '/ɾ/ 单颤音', tip: '舌尖快速轻弹上齿龈一下', sample: 'pero', sampleCn: '但是' },
          { char: 'C + a/o/u', sound: 'ka, ko, ku', sub: '/k/ (咔)', tip: '后接 a/o/u 时发清音 k', sample: 'casa', sampleCn: '房子/家' },
          { char: 'C + e/i', sound: 'ce, ci', sub: '/θ/ 或 /s/', tip: '后接 e/i 时发咬舌音或 s', sample: 'cena', sampleCn: '晚餐' },
          { char: 'G + a/o/u', sound: 'ga, go, gu', sub: '/ɡ/ (嘎)', tip: '后接 a/o/u 时发浊音 g', sample: 'gato', sampleCn: '猫' },
          { char: 'G + e/i', sound: 'ge, gi', sub: '/x/ (喝)', tip: '后接 e/i 时与 J 一样发喉音“喝”', sample: 'gente', sampleCn: '人们' },
          { char: 'QU + e/i', sound: 'ke, ki', sub: 'ke / ki', tip: '中间的 u 静音，直接读 ke / ki', sample: 'queso', sampleCn: '奶酪' },
          { char: 'GU + e/i', sound: 'gue, gui', sub: 'ge / gi', tip: '中间的 u 静音，读浊音 ge / gi', sample: 'guía', sampleCn: '导游/指南' }
        ]
      },
      {
        id: 'es_regular',
        name: '③ 常规辅音全表 (与英语/汉语拼音直觉基本一致)',
        desc: '注意 B 与 V 在西语中发音完全相同，且 P / T / K 不送气（更像中文的 b / d / g）：',
        items: [
          { char: 'B b / V v', sound: 'ba, be', sub: '/b/ 同音', tip: '西语 b 和 v 发音完全一样', sample: 'vino', sampleCn: '葡萄酒' },
          { char: 'CH ch', sound: 'cha, che', sub: '/tʃ/ (切)', tip: '与英语 ch (chat) 发音相同', sample: 'chico', sampleCn: '男孩/小伙' },
          { char: 'D d', sound: 'da, de', sub: '/d/ 或 /ð/', tip: '词首读 d，元音间轻咬舌', sample: 'donde', sampleCn: '哪里' },
          { char: 'F f', sound: 'fa, fe', sub: '/f/ (夫)', tip: '上齿轻触下唇吹气', sample: 'foto', sampleCn: '照片' },
          { char: 'L l', sound: 'la, le', sub: '/l/ (勒)', tip: '舌尖清晰顶住上齿龈', sample: 'listo', sampleCn: '准备好的' },
          { char: 'M m / N n', sound: 'ma, na', sub: '/m/ /n/', tip: '双唇鼻音与舌尖鼻音', sample: 'mano', sampleCn: '手' },
          { char: 'P p', sound: 'pa, po', sub: '/p/ 不送气', tip: '双唇不送气清音（接近中文“巴”）', sample: 'papa', sampleCn: '土豆' },
          { char: 'S s', sound: 'sa, si', sub: '/s/ (丝)', tip: '清脆的平舌音 s', sample: 'sí', sampleCn: '是的' },
          { char: 'T t', sound: 'ta, to', sub: '/t/ 不送气', tip: '舌尖不送气清音（接近中文“搭”）', sample: 'todo', sampleCn: '全部/一切' },
          { char: 'Z z', sound: 'za, zo', sub: '/θ/ 或 /s/', tip: '西班牙读咬舌清音，拉美读 s', sample: 'zapato', sampleCn: '鞋子' }
        ]
      }
    ],
    soundClusters: [
      {
        title: "🎯 1. 英语秒变西语：「-ción」同音家族 (100%对应英文 -tion)",
        rule: "把你认识的英文 -tion 词尾换成西语 -ción，重音直接砸在最后一个音节，瞬间白捡几百个西语词：",
        words: [
          { w: "estación", pron: "es-ta-CIÓN", cn: "station (车站)" },
          { w: "habitación", pron: "a-bi-ta-CIÓN", cn: "客房 / 房间" },
          { w: "información", pron: "in-for-ma-CIÓN", cn: "information (信息)" },
          { w: "reservación", pron: "re-ser-va-CIÓN", cn: "reservation (预订)" },
          { w: "situación", pron: "si-tua-CIÓN", cn: "situation (情况)" }
        ]
      },
      {
        title: "🎯 2. 静音 H 家族 (看到 H 当作透明空气)",
        rule: "西语的 H 永远 100% 不发音，直接读 H 后面的元音：",
        words: [
          { w: "hola", pron: "O-la", cn: "你好" },
          { w: "hotel", pron: "o-TEL", cn: "酒店" },
          { w: "hoy", pron: "oj", cn: "今天" },
          { w: "hora", pron: "O-ra", cn: "小时 / 时间" },
          { w: "hacer", pron: "a-SER", cn: "做 (动词)" }
        ]
      },
      {
        title: "🎯 3. 喉音 J 与 G(e/i) 擦喉家族 (/x/)",
        rule: "字母 j 以及 ge/gi 组合，全部发清脆的中文“喝/哈”喉音：",
        words: [
          { w: "jefe", pron: "HE-fe", cn: "老板 / 主管" },
          { w: "jueves", pron: "HWE-bes", cn: "星期四" },
          { w: "trabajo", pron: "tra-BA-ho", cn: "工作" },
          { w: "gente", pron: "HEN-te", cn: "人们" },
          { w: "gerente", pron: "he-REN-te", cn: "经理" }
        ]
      },
      {
        title: "🎯 4. 特色鼻音 Ñ 与双写 LL 家族",
        rule: "ñ 读“涅(ni)”，ll 读如英语 yes 的 y 音：",
        words: [
          { w: "mañana", pron: "ma-NYA-na", cn: "明天 / 上午" },
          { w: "baño", pron: "BA-nyo", cn: "洗手间" },
          { w: "español", pron: "es-pa-NYOL", cn: "西班牙语" },
          { w: "calle", pron: "KA-ye", cn: "街道" },
          { w: "pollo", pron: "PO-yo", cn: "鸡肉" }
        ]
      },
      {
        title: "🎯 5. 静音 U 组合「QU / GU + e, i」家族",
        rule: "que / qui 中的 u 永远不发音，直接读 ke / ki：",
        words: [
          { w: "quiero", pron: "KYE-ro", cn: "我想要" },
          { w: "queso", pron: "KE-so", cn: "奶酪" },
          { w: "aquí", pron: "a-KI", cn: "这里" },
          { w: "paquete", pron: "pa-KE-te", cn: "包裹" },
          { w: "guía", pron: "GI-a", cn: "导游 / 指南" }
        ]
      },
      {
        title: "🎯 6. 动词原形三兄弟：「-ar / -er / -ir」尾音簇",
        rule: "西语所有动词原形都以这三个字母组合结尾，词尾单 r 舌尖轻弹一下：",
        words: [
          { w: "comprar", pron: "kom-PRAR", cn: "买" },
          { w: "hablar", pron: "a-BLAR", cn: "说话" },
          { w: "comer", pron: "ko-MER", cn: "吃" },
          { w: "beber", pron: "be-BER", cn: "喝" },
          { w: "vivir", pron: "bi-BIR", cn: "居住 / 生活" }
        ]
      },
      {
        title: "🎯 7. 阴阳性变色龙：「-o (阳) / -a (阴)」高频词簇",
        rule: "张嘴连读感受词尾元音的切换：",
        words: [
          { w: "rojo / roja", pron: "RO-ho / RO-ha", cn: "红色的" },
          { w: "listo / lista", pron: "LIS-to / LIS-ta", cn: "准备好的" },
          { w: "caro / cara", pron: "KA-ro / KA-ra", cn: "昂贵的" },
          { w: "barato / barata", pron: "ba-RA-to", cn: "便宜的" },
          { w: "bueno / buena", pron: "BWE-no", cn: "好的" }
        ]
      },
      {
        title: "🎯 8. 商务高频后缀「-dad」家族 (对应英文 -ty)",
        rule: "英文以 -ty 结尾的名词 (city, university)，在西语中直接变成 -dad（阴性名词）：",
        words: [
          { w: "ciudad", pron: "syu-DAD", cn: "city (城市)" },
          { w: "universidad", pron: "u-ni-ber-si-DAD", cn: "university (大学)" },
          { w: "calidad", pron: "ka-li-DAD", cn: "quality (质量)" },
          { w: "oportunidad", pron: "o-por-tu-ni-DAD", cn: "opportunity (机会)" },
          { w: "verdad", pron: "ber-DAD", cn: "truth (真相/真的)" }
        ]
      }
    ],
    rules: [
      { title: "100% 见词能读 (5元音恒定)", desc: "西语 a / e / i / o / u 永远只发唯一固定的音（阿、诶、衣、哦、乌），没有任何模糊音！" },
      { title: "不发音的 H 与喉音 J", desc: "字母 h 永远静音不发音 (Hola → ola)；字母 j 发类似中文“喝”的清脆喉音 (Juan → huan)。" },
      { title: "特色音 ñ 与双写 ll", desc: "ñ 发“涅 (ni)”音 (mañana)；ll 发类似英语 y (yes) 的音 (ella → e-ya)。" },
      { title: "名词阴阳性一眼看词尾", desc: "以 -o 结尾的名词 95% 是阳性 (配 el)；以 -a 结尾的名词 95% 是阴性 (配 la)。" }
    ],
    minimalPairs: [
      {
        tag: "1. 单颤音 r vs 大舌多颤音 rr",
        w1: "pero",
        ipa1: "/ˈpe.ɾo/ (但是 - 舌尖轻弹一下)",
        w2: "perro",
        ipa2: "/ˈpe.ro/ (狗 - 舌尖连续颤动)",
        tip: "发单 r 时像美式英语 water 中间的快速弹舌；rr 则需要气流吹动舌尖连颤。",
        sentence: "El perro es grande, pero muy bueno.",
        sentenceCn: "这只狗很大，但是非常乖。"
      },
      {
        tag: "2. 重音符号改变词义与时态",
        w1: "hablo",
        ipa1: "/ˈa.βlo/ (我说话 - 重音在前)",
        w2: "habló",
        ipa2: "/a.ˈβlo/ (他曾说话 - 重音在尾)",
        tip: "带重音符号「´」的音节必须用力重读，否则连人称和时态都会变！",
        sentence: "Yo hablo hoy porque él habló ayer.",
        sentenceCn: "我今天发言，因为他昨天发言过了。"
      },
      {
        tag: "3. 鼻音 n vs 腭化鼻音 ñ",
        w1: "una",
        ipa1: "/ˈu.na/ (一个 - 普通n)",
        w2: "uña",
        ipa2: "/ˈu.ɲa/ (指甲 - 带y音的ñ)",
        tip: "发 ñ 时舌面贴住硬腭，相当于把 n 和 y 捏在一起发。",
        sentence: "Tengo una uña rota.",
        sentenceCn: "我有一片指甲断了。"
      },
      {
        tag: "4. 喉音 j vs 浊音 g",
        w1: "jefe",
        ipa1: "/ˈxe.fe/ (老板 - 强烈擦喉音)",
        w2: "gato",
        ipa2: "/ˈɡa.to/ (猫 - 浊音g)",
        tip: "西语的 j 和 ge/gi 都要在喉咙深处摩擦出气。",
        sentence: "Mi jefe tiene un gato blanco.",
        sentenceCn: "我的老板养了一只白猫。"
      },
      {
        tag: "5. 阳性 -o vs 阴性 -a",
        w1: "rojo",
        ipa1: "/ˈro.xo/ (红色的-修饰阳性)",
        w2: "roja",
        ipa2: "/ˈro.xa/ (红色的-修饰阴性)",
        tip: "形容词词尾必须像变色龙一样跟着它修饰的名词变 -o 或 -a。",
        sentence: "El coche es rojo y la manzana es roja.",
        sentenceCn: "汽车是红色的，而苹果也是红色的。"
      },
      {
        tag: "6. 昂贵的 vs 汽车 (caro vs carro)",
        w1: "caro",
        ipa1: "/ˈka.ɾo/ (昂贵的 - 单颤r)",
        w2: "carro",
        ipa2: "/ˈka.ro/ (汽车 - 多颤rr)",
        tip: "买车时一定要分清 caro（贵）和 carro（车）！",
        sentence: "Este carro nuevo es muy caro.",
        sentenceCn: "这辆新车非常昂贵。"
      },
      {
        tag: "7. 土豆 vs 爸爸 (重音与冠词)",
        w1: "papa",
        ipa1: "/ˈpa.pa/ (土豆 - 重音在首)",
        w2: "papá",
        ipa2: "/pa.ˈpa/ (爸爸 - 重音在尾)",
        tip: "少重读最后一个音节，爸爸 (papá) 就会变成土豆 (papa)！",
        sentence: "Mi papá quiere comer una papa.",
        sentenceCn: "我爸爸想吃一个土豆。"
      },
      {
        tag: "8. 双写 ll vs 舌侧音 l",
        w1: "pollo",
        ipa1: "/ˈpo.ʝo/ (鸡肉 - 读如po-yo)",
        w2: "polo",
        ipa2: "/ˈpo.lo/ (马球衫 - 读如po-lo)",
        tip: "点炸鸡 (pollo) 时千万不能读成 l，而是发 y 的音。",
        sentence: "Comemos pollo con camisa de polo.",
        sentenceCn: "我们穿着 Polo 衫吃鸡肉。"
      },
      {
        tag: "9. 不送气清音 p vs 浊音 b",
        w1: "peso",
        ipa1: "/ˈpe.so/ (比索/重量 - 清音p)",
        w2: "beso",
        ipa2: "/ˈbe.so/ (亲吻 - 浊音b)",
        tip: "西语的 p 不送气，靠声带是否震动与 b 区分。",
        sentence: "Te doy un beso y un peso.",
        sentenceCn: "我给你一个吻和一比索。"
      },
      {
        tag: "10. 猴子 vs 蝴蝶结 (mono vs moño)",
        w1: "mono",
        ipa1: "/ˈmo.no/ (猴子/可爱的 - n)",
        w2: "moño",
        ipa2: "/ˈmo.ɲo/ (发髻/蝴蝶结 - ñ)",
        tip: "再次强化 n 与 ñ 的对比，舌面抬起贴硬腭。",
        sentence: "El mono pequeño lleva un moño rojo.",
        sentenceCn: "那只小猴子戴着一个红蝴蝶结。"
      }
    ],
    legoWords: {
      verbs: [
        { w: "doy", pron: "/doj/", cn: "我给 (dar)", sampleId: 3 },
        { w: "quiero", pron: "/ˈkje.ɾo/", cn: "我想要", sampleId: 10 },
        { w: "necesito", pron: "/ne.θeˈsi.to/", cn: "我需要", sampleId: 9 },
        { w: "tengo", pron: "/ˈteŋ.ɡo/", cn: "我有", sampleId: 3 },
        { w: "voy", pron: "/boj/", cn: "我去 / 我将要", sampleId: 11 },
        { w: "puedo", pron: "/ˈpwe.ðo/", cn: "我能 / 可以", sampleId: 12 },
        { w: "debo", pron: "/ˈde.βo/", cn: "我必须", sampleId: 9 },
        { w: "comprar", pron: "/komˈpɾaɾ/", cn: "买 (原形)", sampleId: 10 },
        { w: "comer", pron: "/koˈmeɾ/", cn: "吃 (原形)", sampleId: 12 },
        { w: "enviar", pron: "/emˈbjaɾ/", cn: "发送 (原形)", sampleId: 11 },
        { w: "saber", pron: "/saˈβeɾ/", cn: "知道 (原形)", sampleId: 12 },
        { w: "ayudar", pron: "/a.ʝuˈðaɾ/", cn: "帮助 (原形)", sampleId: 10 }
      ],
      nouns: [
        { w: "el dinero", pron: "/diˈne.ɾo/", cn: "钱 (阳)", sampleId: 5 },
        { w: "el agua", pron: "/ˈa.ɣwa/", cn: "水", sampleId: 3 },
        { w: "el billete", pron: "/biˈʎe.te/", cn: "票 / 车票 (阳)", sampleId: 4 },
        { w: "el hotel", pron: "/oˈtel/", cn: "酒店 (阳)", sampleId: 1 },
        { w: "el baño", pron: "/ˈba.ɲo/", cn: "洗手间 (阳)", sampleId: 7 },
        { w: "el informe", pron: "/inˈfoɾ.me/", cn: "报告 (阳)", sampleId: 1 },
        { w: "el cliente", pron: "/ˈkljen.te/", cn: "客户 (阳)", sampleId: 2 },
        { w: "la estación", pron: "/es.taˈθjon/", cn: "车站 (阴)", sampleId: 7 },
        { w: "la cuenta", pron: "/ˈkwen.ta/", cn: "账单 (阴)", sampleId: 3 },
        { w: "la ayuda", pron: "/aˈʝu.ða/", cn: "帮助 (阴)", sampleId: 10 },
        { w: "hoy", pron: "/oj/", cn: "今天", sampleId: 9 },
        { w: "mañana", pron: "/maˈɲa.na/", cn: "明天", sampleId: 11 }
      ],
      modifiers: [
        { w: "bueno/a", pron: "/ˈbwe.no/", cn: "好的", sampleId: 1 },
        { w: "listo/a", pron: "/ˈlis.to/", cn: "准备好的", sampleId: 1 },
        { w: "caro/a", pron: "/ˈka.ɾo/", cn: "昂贵的", sampleId: 8 },
        { w: "barato/a", pron: "/baˈɾa.to/", cn: "便宜的", sampleId: 8 },
        { w: "gratis", pron: "/ˈɡɾa.tis/", cn: "免费的", sampleId: 7 },
        { w: "urgente", pron: "/uɾˈxen.te/", cn: "紧急的", sampleId: 1 },
        { w: "muy", pron: "/muj/", cn: "非常 / 很", sampleId: 1 },
        { w: "ahora", pron: "/aˈo.ɾa/", cn: "现在", sampleId: 9 },
        { w: "aquí", pron: "/aˈki/", cn: "这里", sampleId: 1 },
        { w: "¿dónde?", pron: "/ˈdon.de/", cn: "在哪里？", sampleId: 7 },
        { w: "porque", pron: "/ˈpoɾ.ke/", cn: "因为", sampleId: 12 },
        { w: "pero", pron: "/ˈpe.ɾo/", cn: "但是", sampleId: 12 }
      ]
    }
  }
};

// --- Word Dictionary for Hover Tooltips ---
const baseWordDict = {
  // English
  the: { ipa: '/ðə/', pos: '冠词', meaning: '这/那（特指双方已知的事物）' },
  apple: { ipa: '/ˈæp.əl/', pos: '名词', meaning: '苹果（句中作核心假人名词）' },
  is: { ipa: '/ɪz/', pos: '系动词', meaning: '是（第三人称单数 be 动词）' },
  red: { ipa: '/red/', pos: '形容词', meaning: '红色的（作表语描述状态）' },
  it: { ipa: '/ɪt/', pos: '代词', meaning: '它（指代前面提过的单数事物）' },
  "john's": { ipa: '/dʒɒnz/', pos: '所有格', meaning: '约翰的（名词+\'s 表示归属）' },
  i: { ipa: '/aɪ/', pos: '代词', meaning: '我（主格代词，作动作发起人）' },
  give: { ipa: '/ɡɪv/', pos: '动词', meaning: '给，递交（核心及物动词）' },
  john: { ipa: '/dʒɒn/', pos: '专有名词', meaning: '约翰（句中作间接宾语/接收者）' },
  we: { ipa: '/wiː/', pos: '代词', meaning: '我们（第一人称复数主格）' },
  him: { ipa: '/hɪm/', pos: '代词', meaning: '他（宾格形式，跟在动词或介词后）' },
  he: { ipa: '/hiː/', pos: '代词', meaning: '他（第三人称单数主格）' },
  gives: { ipa: '/ɡɪvz/', pos: '动词', meaning: '给（三单现形式，词尾加 -s）' },
  to: { ipa: '/tuː/', pos: '介词/不定式', meaning: '向/给（表方向）或连接动词原形' },
  she: { ipa: '/ʃiː/', pos: '代词', meaning: '她（第三人称单数主格）' },
  her: { ipa: '/hɜːr/', pos: '代词', meaning: '她/她的（句中作介词宾语）' },
  must: { ipa: '/mʌst/', pos: '情态动词', meaning: '必须，一定（后接动词原形）' },
  want: { ipa: '/wɒnt/', pos: '动词', meaning: '想要（后常接 to do 不定式）' },
  "i'm": { ipa: '/aɪm/', pos: '缩写', meaning: '我是（I am 的口语缩写）' },
  going: { ipa: '/ˈɡəʊ.ɪŋ/', pos: '动词分词', meaning: '将要（be going to 表计划将来）' },
  tomorrow: { ipa: '/təˈmɒr.əʊ/', pos: '副词', meaning: '明天（时间状语，英文习惯放句尾）' },
  "can't": { ipa: '/kɑːnt/', pos: '情态动词', meaning: '不能，不会（cannot 的否定缩写）' },
  eat: { ipa: '/iːt/', pos: '动词', meaning: '吃（接在情态动词后用原形）' },
  // Japanese
  'リンゴは': { ipa: 'ringo wa', pos: '名词+助词', meaning: '苹果（は 读作 wa，提示全句主题）' },
  '赤いです。': { ipa: 'akai desu', pos: '形容词+敬体', meaning: '是红色的（です 表礼貌肯定）' },
  'それは': { ipa: 'sore wa', pos: '代词+助词', meaning: '那是（は 提示主题）' },
  'ジョンの': { ipa: 'jon no', pos: '名词+助词', meaning: '约翰的（の 相当于中文“的”）' },
  'リンゴです。': { ipa: 'ringo desu', pos: '名词+敬体', meaning: '是苹果' },
  '私は': { ipa: 'watashi wa', pos: '代词+助词', meaning: '我是/我（主题）' },
  'ジョンに': { ipa: 'jon ni', pos: '名词+助词', meaning: '给约翰（に 标记动作接收对象）' },
  'リンゴを': { ipa: 'ringo o', pos: '名词+助词', meaning: '把苹果（を 读作 o，标记直接宾语）' },
  'あげます。': { ipa: 'agemasu', pos: '动词敬体', meaning: '给（日语动词永远放在句尾！）' },
  '私たちは': { ipa: 'watashitachi wa', pos: '代词+助词', meaning: '我们（主题）' },
  '彼に': { ipa: 'kare ni', pos: '代词+助词', meaning: '给他（に 标记接收人）' },
  '彼は': { ipa: 'kare wa', pos: '代词+助词', meaning: '他（主题）' },
  'それを': { ipa: 'sore o', pos: '代词+助词', meaning: '把它（を 标记宾语）' },
  '彼女は': { ipa: 'kanojo wa', pos: '代词+助词', meaning: '她（主题）' },
  'リンゴですか？': { ipa: 'ringo desu ka', pos: '名词+疑问', meaning: '是苹果吗？（句尾 か 相当于问号）' },
  '赤かったですか？': { ipa: 'akakatta desu ka', pos: '过去式疑问', meaning: '曾是红色的吗？（～かった 表过去）' },
  'あげなければなりません。': { ipa: 'agenakereba narimasen', pos: '义务句型', meaning: '必须给（日语中“不给不行”=必须给）' },
  '彼女に': { ipa: 'kanojo ni', pos: '代词+助词', meaning: '给她（に 标记对象）' },
  'あげたいです。': { ipa: 'agetai desu', pos: '愿望形', meaning: '想要给（动词词干+たい 表想要做某事）' },
  '明日': { ipa: 'ashita', pos: '时间名词', meaning: '明天（日语时间词常放在前面）' },
  'あげるつもりです。': { ipa: 'ageru tsumori desu', pos: '打算句型', meaning: '打算给（原形+つもり 表计划打算）' },
  '食べられません。': { ipa: 'taberaremasen', pos: '可能态否定', meaning: '不能吃（られません 表能力或条件不允许）' }
};

// --- 12 Core Sentences by Language ---
const sentencesByLang = {
  en: [
    {
      id: 1,
      en: ['The', 'apple', 'is', 'red.'],
      lit: ['这', '苹果', '是', '红色的'],
      nat: ['苹果', '是', '红色的。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: null },
        { enIdx: 1, litIdx: 1, natIdx: 0 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: "中文常省略系动词'是'（苹果红了），英文必须有 be 动词作为句子主心骨。",
      workplace: 'The financial report is ready.'
    },
    {
      id: 2,
      en: ['It', 'is', "John's", 'apple.'],
      lit: ['它', '是', '约翰的', '苹果'],
      nat: ['那是', '约翰的', '苹果。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 0 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: "名词所有格 ('s)，中文常省略'的'，英文需严格标明归属。",
      workplace: "It is the client's final decision."
    },
    {
      id: 3,
      en: ['I', 'give', 'John', 'the', 'apple.'],
      lit: ['我', '给', '约翰', '这', '苹果'],
      nat: ['我', '把', '苹果', '给', '约翰。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 3 },
        { enIdx: 2, litIdx: 2, natIdx: 4 },
        { enIdx: 3, litIdx: 3, natIdx: 1 },
        { enIdx: 4, litIdx: 4, natIdx: 2 }
      ],
      trap: "双宾语语序 (give sb sth)，中文习惯先说'把苹果'，英文直接先放接收人再放物。",
      workplace: 'I send HR the updated resume.'
    },
    {
      id: 4,
      en: ['We', 'give', 'him', 'the', 'apple.'],
      lit: ['我们', '给', '他', '这', '苹果'],
      nat: ['我们', '把', '苹果', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 3 },
        { enIdx: 2, litIdx: 2, natIdx: 4 },
        { enIdx: 3, litIdx: 3, natIdx: 1 },
        { enIdx: 4, litIdx: 4, natIdx: 2 }
      ],
      trap: "代词宾格 (him) 变化，中文主宾格都是'他'，英文处于宾语位置必须变形。",
      workplace: 'We show them the Q3 data.'
    },
    {
      id: 5,
      en: ['He', 'gives', 'it', 'to', 'John.'],
      lit: ['他', '给', '它', '向', '约翰'],
      nat: ['他', '把它', '给', '约翰。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 2 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 },
        { enIdx: 4, litIdx: 4, natIdx: 3 }
      ],
      trap: '第三人称单数动词加 -s，以及当物是代词 it 时，必须用 give it to sb 结构。',
      workplace: 'She forwards it to the manager.'
    },
    {
      id: 6,
      en: ['She', 'gives', 'it', 'to', 'him.'],
      lit: ['她', '给', '它', '向', '他'],
      nat: ['她', '把它', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 2 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 },
        { enIdx: 4, litIdx: 4, natIdx: 3 }
      ],
      trap: '性别代词区分 (She/him)，口语中极易混淆 he 和 she 的发音与指代。',
      workplace: 'He hands it to her.'
    },
    {
      id: 7,
      en: ['Is', 'the', 'apple', 'red?'],
      lit: ['是', '这', '苹果', '红色的？'],
      nat: ['苹果', '是', '红色的', '吗？'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 1 },
        { enIdx: 0, litIdx: 0, natIdx: 3 },
        { enIdx: 1, litIdx: 1, natIdx: null },
        { enIdx: 2, litIdx: 2, natIdx: 0 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: '疑问句语序倒装，中文只需句尾加“吗”，英文必须把系动词/助动词提到句首。',
      workplace: 'Is the contract ready?'
    },
    {
      id: 8,
      en: ['The', 'apples', 'are', 'red.'],
      lit: ['这些', '苹果(复)', '是(复)', '红色的'],
      nat: ['这些苹果', '是', '红色的。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 0 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: '名词复数与主谓一致 (apples -> are)，中文无此变形联动。',
      workplace: 'The new features are live.'
    },
    {
      id: 9,
      en: ['I', 'must', 'give', 'it', 'to', 'him.'],
      lit: ['我', '必须', '给', '它', '向', '他'],
      nat: ['我', '必须', '把它', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 3 },
        { enIdx: 3, litIdx: 3, natIdx: 2 },
        { enIdx: 4, litIdx: 4, natIdx: 3 },
        { enIdx: 5, litIdx: 5, natIdx: 4 }
      ],
      trap: '情态动词 (must) 后接动词原形，不随人称变化。',
      workplace: 'I must submit it to him today.'
    },
    {
      id: 10,
      en: ['I', 'want', 'to', 'give', 'it', 'to', 'her.'],
      lit: ['我', '想要', '去', '给', '它', '向', '她'],
      nat: ['我', '想要', '把它', '给', '她。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: null },
        { enIdx: 3, litIdx: 3, natIdx: 3 },
        { enIdx: 4, litIdx: 4, natIdx: 2 },
        { enIdx: 5, litIdx: 5, natIdx: 3 },
        { enIdx: 6, litIdx: 6, natIdx: 4 }
      ],
      trap: '动词不定式 (to do)，英文两个动词不能直接连用，中间必须用 to 连接。',
      workplace: 'I want to present it to her.'
    },
    {
      id: 11,
      en: ["I'm", 'going', 'to', 'give', 'it', 'to', 'him', 'tomorrow.'],
      lit: ['我是', '将要', '去', '给', '它', '向', '他', '明天'],
      nat: ['我', '明天', '打算', '把它', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 2 },
        { enIdx: 2, litIdx: 2, natIdx: 2 },
        { enIdx: 3, litIdx: 3, natIdx: 4 },
        { enIdx: 4, litIdx: 4, natIdx: 3 },
        { enIdx: 5, litIdx: 5, natIdx: 4 },
        { enIdx: 6, litIdx: 6, natIdx: 5 },
        { enIdx: 7, litIdx: 7, natIdx: 1 }
      ],
      trap: '将来时结构 (be going to) 及时间状语 (tomorrow) 习惯后置，与中文语序相反！',
      workplace: "I'm going to pitch it to them tomorrow."
    },
    {
      id: 12,
      en: ['I', "can't", 'eat', 'the', 'apple.'],
      lit: ['我', '不能', '吃', '这', '苹果'],
      nat: ['我', '不能', '吃', '这个', '苹果。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 2 },
        { enIdx: 3, litIdx: 3, natIdx: 3 },
        { enIdx: 4, litIdx: 4, natIdx: 4 }
      ],
      trap: '否定结构，否定词 not 必须依附在情态动词或助动词上。',
      workplace: "I can't accept this offer."
    }
  ],
  ja: [
    {
      id: 1,
      en: ['リンゴは', '赤いです。'],
      lit: ['苹果(主题)', '红色的-是'],
      nat: ['苹果', '是', '红色的。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 1, litIdx: 1, natIdx: 2 }
      ],
      trap: '日语靠助词「は (读wa)」标记主题，礼貌肯定词「です」永远放在句尾。',
      workplace: '財務報告書は 準備できています。'
    },
    {
      id: 2,
      en: ['それは', 'ジョンの', 'リンゴです。'],
      lit: ['那是', '约翰的', '苹果-是'],
      nat: ['那是', '约翰的', '苹果。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 2 }
      ],
      trap: '助词「の」完全对应中文的“的”，连接两个名词表归属。',
      workplace: 'それは クライアントの 最終決定です。'
    },
    {
      id: 3,
      en: ['私は', 'ジョンに', 'リンゴを', 'あげます。'],
      lit: ['我是', '向约翰', '把苹果', '给'],
      nat: ['我', '把', '苹果', '给', '约翰。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 4 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 2 },
        { enIdx: 3, litIdx: 3, natIdx: 3 }
      ],
      trap: '日语核心铁律 SOV：动词「あげます(给)」必须放句尾！用「に」标接收人，「を」标物品。',
      workplace: '私は 人事に 履歴書を 送ります。'
    },
    {
      id: 4,
      en: ['私たちは', '彼に', 'リンゴを', 'あげます。'],
      lit: ['我们是', '向他', '把苹果', '给'],
      nat: ['我们', '把', '苹果', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 4 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 2 },
        { enIdx: 3, litIdx: 3, natIdx: 3 }
      ],
      trap: '日语代词本身不变格，全靠后面的助词（彼に = 给他，彼は = 他是）决定语法角色。',
      workplace: '私たちは 彼らに データを 見せます。'
    },
    {
      id: 5,
      en: ['彼は', 'それを', 'ジョンに', 'あげます。'],
      lit: ['他是', '把它', '向约翰', '给'],
      nat: ['他', '把它', '给', '约翰。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 3 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: '只要助词「を」和「に」跟着正确的词，中间的“把它”和“向约翰”调换顺序意思完全不变！',
      workplace: '彼女は それを マネージャーに 転送します。'
    },
    {
      id: 6,
      en: ['彼女は', 'それを', '彼に', 'あげます。'],
      lit: ['她是', '把它', '向他', '给'],
      nat: ['她', '把它', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 3 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: '日语没有三单现动词变化，不管主语是我、你、他，动词都是「あげます」。',
      workplace: '彼は それを 彼女に 渡します。'
    },
    {
      id: 7,
      en: ['それは', 'リンゴですか？'],
      lit: ['那是', '是苹果吗？'],
      nat: ['那是', '苹果', '吗？'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 1, litIdx: 1, natIdx: 2 }
      ],
      trap: '日语变疑问句极其简单：不需要像英语那样倒装语序，直接在句尾加「か (ka)」即可！',
      workplace: '契約書は 準備できていますか？'
    },
    {
      id: 8,
      en: ['リンゴは', '赤かったですか？'],
      lit: ['苹果是', '曾是红色的吗？'],
      nat: ['苹果', '之前是', '红色的吗？'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 1, litIdx: 1, natIdx: 2 }
      ],
      trap: '日语连形容词都有过去时变位：赤い (现在红) → 赤かった (过去红)。',
      workplace: '昨日の会議は 有意義でしたか？'
    },
    {
      id: 9,
      en: ['私は', 'それを', '彼に', 'あげなければなりません。'],
      lit: ['我是', '把它', '向他', '不给不行(必须给)'],
      nat: ['我', '必须', '把它', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 2 },
        { enIdx: 2, litIdx: 2, natIdx: 4 },
        { enIdx: 3, litIdx: 3, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 3 }
      ],
      trap: '日语没有独立的 must 单词，而是把句尾动词变成双重否定「～なければなりません（不做不行）」。',
      workplace: '今日 それを 彼に 提出しなければなりません。'
    },
    {
      id: 10,
      en: ['私は', '彼女に', 'それを', 'あげたいです。'],
      lit: ['我是', '向她', '把它', '想要给'],
      nat: ['我', '想要', '把它', '给', '她。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 4 },
        { enIdx: 2, litIdx: 2, natIdx: 2 },
        { enIdx: 3, litIdx: 3, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 3 }
      ],
      trap: '表达“想要做某事”无需加额外动词，直接把句尾动词词尾变成「～たいです (tai desu)」。',
      workplace: '私は 彼女に それを 提案したいです。'
    },
    {
      id: 11,
      en: ['私は', '明日', '彼に', 'それを', 'あげるつもりです。'],
      lit: ['我是', '明天', '向他', '把它', '打算给'],
      nat: ['我', '明天', '打算', '把它', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 5 },
        { enIdx: 3, litIdx: 3, natIdx: 3 },
        { enIdx: 4, litIdx: 4, natIdx: 2 },
        { enIdx: 4, litIdx: 4, natIdx: 4 }
      ],
      trap: '日语时间词「明日」和中文一样放前面；“打算做”是在动词原形后加「つもりです」。',
      workplace: '明日 彼らに それを プレゼンするつもりです。'
    },
    {
      id: 12,
      en: ['私は', 'そのリンゴを', '食べられません。'],
      lit: ['我是', '把那个苹果', '不能吃'],
      nat: ['我', '不能', '吃', '那个苹果。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 3 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 2 }
      ],
      trap: '日语的“不能做”全部浓缩在句尾动词的可能态否定形「～られません」里。',
      workplace: '私は このオファーを 受け入れられません。'
    }
  ],
  es: [
    {
      id: 1,
      en: ['La', 'manzana', 'es', 'roja.'],
      lit: ['这(阴)', '苹果(阴)', '是', '红色的(阴)'],
      nat: ['苹果', '是', '红色的。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: null },
        { enIdx: 1, litIdx: 1, natIdx: 0 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: '西语名词分阴阳性：manzana 是阴性名词，因此定冠词必须用 La，形容词也必须配合变为以 -a 结尾的 roja。',
      workplace: 'El informe financiero está listo.'
    },
    {
      id: 2,
      en: ['Es', 'la', 'manzana', 'de', 'Juan.'],
      lit: ['是', '这', '苹果', '的', '胡安'],
      nat: ['那是', '约翰的', '苹果。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: null },
        { enIdx: 2, litIdx: 2, natIdx: 2 },
        { enIdx: 3, litIdx: 3, natIdx: 1 },
        { enIdx: 4, litIdx: 4, natIdx: 1 }
      ],
      trap: "西语没有英语的 's 所有格，必须用「de + 人名」后置修饰（字面语序：苹果 的 胡安），且主语 it 常省略。",
      workplace: 'Es la decisión final del cliente.'
    },
    {
      id: 3,
      en: ['Le', 'doy', 'la', 'manzana', 'a', 'Juan.'],
      lit: ['给他', '我给', '这', '苹果', '向', '胡安'],
      nat: ['我', '把', '苹果', '给', '约翰。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 3 },
        { enIdx: 1, litIdx: 1, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 3 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 },
        { enIdx: 4, litIdx: 4, natIdx: 3 },
        { enIdx: 5, litIdx: 5, natIdx: 4 }
      ],
      trap: '西语宾语代词前置与冗余：即使后面有 a Juan，动词 doy 前通常也要先放间接宾语代词 Le。',
      workplace: 'Le envío el currículum actualizado a RRHH.'
    },
    {
      id: 4,
      en: ['Le', 'damos', 'la', 'manzana.'],
      lit: ['给他', '我们给', '这', '苹果'],
      nat: ['我们', '把', '苹果', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 4 },
        { enIdx: 1, litIdx: 1, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 3 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: '动词变位自带人称：damos 词尾 -mos 已经表明主语是“我们”，所以主语 nosotros 直接省略，代词 Le 放在动词前。',
      workplace: 'Les mostramos los datos del tercer trimestre.'
    },
    {
      id: 5,
      en: ['Se', 'la', 'da', 'a', 'Juan.'],
      lit: ['给他', '把它(阴)', '他给', '向', '胡安'],
      nat: ['他', '把它', '给', '约翰。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 2 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 0 },
        { enIdx: 2, litIdx: 2, natIdx: 2 },
        { enIdx: 3, litIdx: 3, natIdx: 2 },
        { enIdx: 4, litIdx: 4, natIdx: 3 }
      ],
      trap: '双代词前置与音变：当间接代词 le 遇到直接代词 la（指代阴性苹果）时，为避免绕口，le 必须变成 Se！',
      workplace: 'Se lo reenvía al gerente.'
    },
    {
      id: 6,
      en: ['Ella', 'se', 'la', 'da.'],
      lit: ['她', '给他', '把它(阴)', '给'],
      nat: ['她', '把它', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 3 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: '西语把“给他 (se)”和“把它 (la)”全部打包放在变位动词 da 的前面！',
      workplace: 'Él se lo entrega a ella.'
    },
    {
      id: 7,
      en: ['¿Es', 'roja', 'la', 'manzana?'],
      lit: ['¿是', '红色的', '这', '苹果？'],
      nat: ['苹果', '是', '红色的', '吗？'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 1 },
        { enIdx: 0, litIdx: 0, natIdx: 3 },
        { enIdx: 1, litIdx: 1, natIdx: 2 },
        { enIdx: 2, litIdx: 2, natIdx: null },
        { enIdx: 3, litIdx: 3, natIdx: 0 }
      ],
      trap: '西语疑问句首尾必须加倒问号 ¿ 和正问号 ?，且常把谓语 Es roja 提到主语前面。',
      workplace: '¿Está listo el contrato?'
    },
    {
      id: 8,
      en: ['Las', 'manzanas', 'son', 'rojas.'],
      lit: ['这些(阴复)', '苹果(复)', '是(复)', '红色的(阴复)'],
      nat: ['这些苹果', '是', '红色的。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 0 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: '西语四重联动变形：一旦名词变复数，冠词(Las)、名词(manzanas)、系动词(son)、形容词(rojas)全部要变复数！',
      workplace: 'Las nuevas funciones están activas.'
    },
    {
      id: 9,
      en: ['Debo', 'dársela.'],
      lit: ['我必须', '给-他-它(合体)'],
      nat: ['我', '必须', '把它', '给他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 0, litIdx: 0, natIdx: 1 },
        { enIdx: 1, litIdx: 1, natIdx: 2 },
        { enIdx: 1, litIdx: 1, natIdx: 3 }
      ],
      trap: 'Tim Ferriss 最推崇的西语测试点：当出现动词原形 dar 时，代词 se 和 la 可以直接粘在动词原形词尾合成一个词 dársela！',
      workplace: 'Debo entregárselo hoy.'
    },
    {
      id: 10,
      en: ['Quiero', 'dársela', 'a', 'ella.'],
      lit: ['我想要', '给-她-它', '向', '她'],
      nat: ['我', '想要', '把它', '给', '她。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 0, litIdx: 0, natIdx: 1 },
        { enIdx: 1, litIdx: 1, natIdx: 2 },
        { enIdx: 1, litIdx: 1, natIdx: 3 },
        { enIdx: 2, litIdx: 2, natIdx: 3 },
        { enIdx: 3, litIdx: 3, natIdx: 4 }
      ],
      trap: 'Quiero (我想要) 后直接跟动词原形，ไม่ต้อง加 to；为明确性别可加 a ella (向她)。',
      workplace: 'Quiero presentárselo a ella.'
    },
    {
      id: 11,
      en: ['Voy', 'a', 'dársela', 'mañana.'],
      lit: ['我去', '向', '给-他-它', '明天'],
      nat: ['我', '明天', '打算', '把它', '给他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 0, litIdx: 0, natIdx: 2 },
        { enIdx: 1, litIdx: 1, natIdx: 2 },
        { enIdx: 2, litIdx: 2, natIdx: 3 },
        { enIdx: 2, litIdx: 2, natIdx: 4 },
        { enIdx: 3, litIdx: 3, natIdx: 1 }
      ],
      trap: '西语将来计划结构「ir a + 动词原形」(Voy a...)，结构与英语 be going to 完全对应！',
      workplace: 'Voy a enviárselo mañana.'
    },
    {
      id: 12,
      en: ['No', 'puedo', 'comer', 'la', 'manzana.'],
      lit: ['不', '我能', '吃', '这', '苹果'],
      nat: ['我', '不能', '吃', '这个', '苹果。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 1 },
        { enIdx: 1, litIdx: 1, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 2 },
        { enIdx: 3, litIdx: 3, natIdx: 3 },
        { enIdx: 4, litIdx: 4, natIdx: 4 }
      ],
      trap: '西语否定极简：永远直接把 No 放在变位动词（puedo）正前方即可。',
      workplace: 'No puedo aceptar esta oferta.'
    }
  ]
};

// --- Scenario Examples Pool for TabSubstitution (3 Batches of 5 Sentences per Category) ---
const scenarioBatchesBySkeleton = {
  default: {
    work: [
      [
        '我打算明天把修改后的方案发给客户。',
        '我准备下周向团队展示这个新产品。',
        '我明天得把这份财务报告交给经理。',
        '我打算今天下午把合同发给她。',
        '我们不能接受这个报价。'
      ],
      [
        '这份预算报告已经准备好了。',
        '那是客户的最终决定。',
        '我必须今天就把它提交给总监。',
        '你准备好签这份合同了吗？',
        '我想要把最新数据展示给他们看。'
      ],
      [
        '她把会议纪要转发给了老板。',
        '这些新功能今天已经上线了。',
        '我明天打算跟他们汇报这个项目。',
        '我把更新后的简历发给了人事部。',
        '因为预算不够，我们不能批准这个计划。'
      ]
    ],
    daily: [
      [
        '我打算明天把这本书还给他。',
        '我想把这张照片发给我妈妈。',
        '这个周末我打算去买台新手机。',
        '我今天吃不下这个苹果了。',
        '那是约翰的新车吗？'
      ],
      [
        '她把钥匙递给了我。',
        '我们把礼物送给了他。',
        '我必须在今晚之前把消息告诉她。',
        '这杯咖啡太烫了，我喝不了。',
        '我想要明天去拜访他。'
      ],
      [
        '这些草莓非常新鲜。',
        '那是她的雨伞。',
        '你今天打算把包裹寄给他吗？',
        '我把刚买的蛋糕分给了朋友们。',
        '我实在想不起他的名字了。'
      ]
    ],
    living: [
      [
        '我打算明天把房租转给房东。',
        '快递员把包裹交给了我。',
        '我今天必须去超市买点水。',
        '洗手间在哪里？',
        '这间公寓的钥匙在桌子上。'
      ],
      [
        '我想请邻居帮个忙。',
        '因为太贵了，我不能租这套房子。',
        '我明天打算去区役所办手续。',
        '店员把热好的便当递给了我。',
        '这袋垃圾必须明天早上扔。'
      ],
      [
        '你能把菜单递给我吗？',
        '这件衣服太小了，我穿不下。',
        '我得把备用钥匙交给室友。',
        '晚饭已经做好了。',
        '我打算周末把房间打扫干净。'
      ]
    ],
    travel: [
      [
        '我把护照递给了海关人员。',
        '请问去机场的电车站在哪里？',
        '我打算明天上午去参观那座博物馆。',
        '我想买两张去东京的新干线车票。',
        '这家酒店的早餐是免费的吗？'
      ],
      [
        '我必须把房卡还给前台。',
        '服务员把账单拿给了我们。',
        '因为航班延误，我今天赶不上末班车了。',
        '那是我们的行李箱。',
        '我想要把这张明信片寄给她。'
      ],
      [
        '这些纪念品太贵了。',
        '你能把去车站的路指给我看吗？',
        '我打算明天退房后把行李寄存在这里。',
        '他把登机牌递给了检票员。',
        '我吃不了辛辣的食物。'
      ]
    ]
  }
};

// --- Lego Block Builder Generator (Creates Clickable Word Tiles for Zero-Basis Users) ---
const buildLegoBlocksForSentence = (targetLang, skeletonId) => {
  const list = sentencesByLang[targetLang] || sentencesByLang.en;
  const skel = list.find((s) => s.id === skeletonId) || list[0];

  const extraPoolByLang = {
    en: [
      { word: 'the', hint: '这/那' },
      { word: 'contract', hint: '合同' },
      { word: 'report', hint: '报告' },
      { word: 'client', hint: '客户' },
      { word: 'manager', hint: '经理' },
      { word: 'send', hint: '发送' },
      { word: 'show', hint: '展示' },
      { word: 'ready', hint: '准备好的' },
      { word: 'today', hint: '今天' },
      { word: 'tomorrow', hint: '明天' }
    ],
    ja: [
      { word: '契約書を', hint: '把合同' },
      { word: '報告書は', hint: '报告(主题)' },
      { word: 'クライアントに', hint: '向客户' },
      { word: '部長に', hint: '向部长' },
      { word: '送ります。', hint: '发送' },
      { word: '見せます。', hint: '展示' },
      { word: '今日', hint: '今天' },
      { word: '明日', hint: '明天' },
      { word: '準備できています。', hint: '已准备好' }
    ],
    es: [
      { word: 'el', hint: '这(阳)' },
      { word: 'contrato', hint: '合同' },
      { word: 'informe', hint: '报告' },
      { word: 'al', hint: '向那' },
      { word: 'cliente', hint: '客户' },
      { word: 'gerente', hint: '经理' },
      { word: 'enviar', hint: '发送' },
      { word: 'listo', hint: '准备好的' },
      { word: 'hoy', hint: '今天' },
      { word: 'mañana', hint: '明天' }
    ]
  };

  const baseBlocks = skel.en.map((w, idx) => ({
    id: `base-${idx}-${w}`,
    word: w.replace(/[.。?？!！]/g, ''),
    hint: skel.lit[idx] || '核心词'
  }));

  const extras = (extraPoolByLang[targetLang] || extraPoolByLang.en).map((item, idx) => ({
    id: `extra-${idx}-${item.word}`,
    word: item.word,
    hint: item.hint
  }));

  return {
    recommendedOrder: skel.en.join(' '),
    blocks: [...baseBlocks, ...extras]
  };
};

// --- Harmonious Line Color Palette ---
const HARMONIOUS_LINE_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#6366f1'  // Indigo
];

// --- Word With Hover Tooltip & Individual Pronunciation ---
const WordWithTooltip = ({
  word,
  color = '#2563eb',
  isHighlighted = false,
  onMouseEnter,
  onMouseLeave,
  customMeta = null
}) => {
  const [hovered, setHovered] = useState(false);
  const cleanKey = String(word || '')
    .toLowerCase()
    .replace(/[.,?!¿¡"]/g, '')
    .trim();

  const meta =
    customMeta ||
    baseWordDict[word] ||
    baseWordDict[cleanKey] || {
      ipa: `/${cleanKey}/`,
      pos: '核心词块',
      meaning: '点击喇叭可单独听该词常速/慢速发音'
    };

  return (
    <span
      className="relative inline-block select-none"
      onMouseEnter={() => {
        setHovered(true);
        if (onMouseEnter) onMouseEnter();
      }}
      onMouseLeave={() => {
        setHovered(false);
        if (onMouseLeave) onMouseLeave();
      }}
    >
      <span
        onClick={(e) => {
          e.stopPropagation();
          speakText(word, 0.95);
        }}
        style={
          isHighlighted
            ? {
                backgroundColor: `${color}18`,
                borderColor: color,
                color: '#0f172a'
              }
            : undefined
        }
        className={`cursor-pointer px-1.5 py-0.5 rounded-md font-extrabold text-sm md:text-[15px] transition-all border ${
          isHighlighted
            ? 'shadow-2xs scale-105'
            : 'border-transparent text-slate-900 hover:bg-slate-100 hover:border-slate-300'
        }`}
      >
        {word}
      </span>

      {hovered && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-52 p-2.5 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 text-left pointer-events-auto"
        >
          <div className="flex items-center justify-between gap-1 border-b border-slate-700/80 pb-1.5 mb-1.5">
            <div>
              <div className="text-xs font-extrabold text-white">{word}</div>
              <div className="text-[10px] font-mono text-amber-300">{meta.ipa}</div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(word, 0.95);
                }}
                className="px-1.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-[10px] font-bold flex items-center gap-0.5"
              >
                <Volume2 className="w-2.5 h-2.5" />
                <span>发音</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(word, 0.6);
                }}
                className="px-1.5 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-[10px] font-bold"
              >
                🐢
              </button>
            </div>
          </div>
          <div className="text-[10.5px] leading-snug text-slate-200">
            <span className="inline-block px-1 py-0.2 bg-slate-800 text-blue-300 rounded text-[9.5px] font-bold mr-1">
              {meta.pos}
            </span>
            <span>{meta.meaning}</span>
          </div>
        </div>
      )}
    </span>
  );
};

// --- 3-Layer Sentence Visualizer with Harmonious Colored SVG Lines ---
const MiniSentenceVisualizer = ({ en, lit, nat, mapping }) => {
  const containerRef = useRef(null);
  const enRefs = useRef([]);
  const litRefs = useRef([]);
  const natRefs = useRef([]);
  const [lines, setLines] = useState([]);
  const [hoveredEnIdx, setHoveredEnIdx] = useState(null);

  const computeLines = () => {
    if (!containerRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const newLines = [];

    mapping.forEach((m) => {
      const color = HARMONIOUS_LINE_COLORS[m.enIdx % HARMONIOUS_LINE_COLORS.length];
      const enEl = enRefs.current[m.enIdx];
      const litEl = litRefs.current[m.litIdx];

      if (enEl && litEl) {
        const r1 = enEl.getBoundingClientRect();
        const r2 = litEl.getBoundingClientRect();
        newLines.push({
          enIdx: m.enIdx,
          color,
          x1: r1.left + r1.width / 2 - cRect.left,
          y1: r1.bottom - cRect.top - 1,
          x2: r2.left + r2.width / 2 - cRect.left,
          y2: r2.top - cRect.top + 1
        });
      }

      if (m.natIdx !== null && m.natIdx !== undefined) {
        const natEl = natRefs.current[m.natIdx];
        if (litEl && natEl) {
          const r2 = litEl.getBoundingClientRect();
          const r3 = natEl.getBoundingClientRect();
          newLines.push({
            enIdx: m.enIdx,
            color,
            x1: r2.left + r2.width / 2 - cRect.left,
            y1: r2.bottom - cRect.top - 1,
            x2: r3.left + r3.width / 2 - cRect.left,
            y2: r3.top - cRect.top + 1
          });
        }
      }
    });

    setLines(newLines);
  };

  useEffect(() => {
    const timer = setTimeout(computeLines, 60);
    window.addEventListener('resize', computeLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', computeLines);
    };
  }, [en, lit, nat, mapping]);

  return (
    <div ref={containerRef} className="relative py-1 select-none">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {lines.map((line, idx) => {
          const isHighlighted = hoveredEnIdx === line.enIdx;
          const isDimmed = hoveredEnIdx !== null && hoveredEnIdx !== line.enIdx;
          const midY = (line.y1 + line.y2) / 2;
          const d = `M ${line.x1} ${line.y1} C ${line.x1} ${midY}, ${line.x2} ${midY}, ${line.x2} ${line.y2}`;
          return (
            <path
              key={idx}
              d={d}
              fill="none"
              stroke={line.color}
              strokeWidth={isHighlighted ? 2.8 : 1.75}
              strokeOpacity={isDimmed ? 0.2 : isHighlighted ? 1 : 0.72}
              className="transition-all duration-150"
            />
          );
        })}
      </svg>

      {/* Row 1: Target Language Words */}
      <div className="relative z-10 flex flex-wrap items-center gap-x-2 gap-y-1 mb-3.5">
        {en.map((word, idx) => {
          const color = HARMONIOUS_LINE_COLORS[idx % HARMONIOUS_LINE_COLORS.length];
          return (
            <div key={idx} ref={(el) => (enRefs.current[idx] = el)}>
              <WordWithTooltip
                word={word}
                color={color}
                isHighlighted={hoveredEnIdx === idx}
                onMouseEnter={() => setHoveredEnIdx(idx)}
                onMouseLeave={() => setHoveredEnIdx(null)}
              />
            </div>
          );
        })}
      </div>

      {/* Row 2: Literal Word-for-Word Translation */}
      <div className="relative z-10 flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-3.5 pl-0.5">
        {lit.map((word, idx) => {
          const mapped = mapping.find((m) => m.litIdx === idx);
          const enIdx = mapped ? mapped.enIdx : idx;
          const color = HARMONIOUS_LINE_COLORS[enIdx % HARMONIOUS_LINE_COLORS.length];
          const isHighlighted = hoveredEnIdx === enIdx;
          return (
            <span
              key={idx}
              ref={(el) => (litRefs.current[idx] = el)}
              style={isHighlighted ? { color, fontWeight: 700 } : undefined}
              className="text-[11px] text-slate-400 px-1 rounded transition-colors"
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Row 3: Natural Chinese Expression */}
      <div className="relative z-10 flex flex-wrap items-center gap-x-2 gap-y-1 pl-0.5">
        {nat.map((word, idx) => {
          const mappedList = mapping.filter((m) => m.natIdx === idx);
          const isHighlighted = mappedList.some((m) => m.enIdx === hoveredEnIdx);
          const primaryColor =
            mappedList.length > 0
              ? HARMONIOUS_LINE_COLORS[mappedList[0].enIdx % HARMONIOUS_LINE_COLORS.length]
              : '#0f172a';
          return (
            <span
              key={idx}
              ref={(el) => (natRefs.current[idx] = el)}
              style={isHighlighted ? { color: primaryColor } : undefined}
              className={`text-xs font-bold px-1 rounded transition-colors ${
                isHighlighted ? 'underline decoration-2' : 'text-slate-700'
              }`}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// --- Pronunciation Evaluator with Real Audio Recording & Playback + 20x Muscle Memory Counter ---
const PronunciationEvaluator = ({
  targetSentence,
  targetLang = 'en',
  readCount = 0,
  onIncrementCount
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    setRecognizedText('');
    setAiFeedback('');
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  }, [targetSentence, targetLang]);

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
  };

  const startRecording = async () => {
    setRecognizedText('');
    setAiFeedback('');
    setIsRecording(true);

    // 1. Start MediaRecorder for real voice playback
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setAudioUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
          });
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
    } catch (e) {
      // Microphone stream optional if speech recognition still works
    }

    // 2. Start SpeechRecognition for AI pronunciation feedback
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setTimeout(() => {
        stopRecording();
        setAiFeedback('当前浏览器不支持语音识别文字，但您仍可点击右侧【听我的录音】对比原声并打卡！');
      }, 2800);
      return;
    }

    const recognition = new SpeechRec();
    recognitionRef.current = recognition;
    recognition.lang = (LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en).speechLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      setRecognizedText(transcript);
      stopRecording();

      if (onIncrementCount) {
        onIncrementCount(targetSentence);
      }

      setLoadingFeedback(true);
      const prompt = `
        用户正在跟读当前目标句（请严格且仅以此句作为唯一对比标准，绝不要虚构该句中没有的单词）：
        目标句: "${targetSentence}"
        语音识别出用户读的是: "${transcript}"
        请用中文给出 45 字以内的简短、温和纠音建议（指出哪个词漏读或发音偏差，以及连读/重音小贴士）。
      `;
      const feedback = await callGemini(prompt, '你是温和专业的口语纠音教练。');
      setAiFeedback(
        feedback || '发音很清晰！建议继续保持节奏，多对比自己的录音与标准范读。'
      );
      setLoadingFeedback(false);
    };

    recognition.onerror = () => {
      stopRecording();
      setAiFeedback('未检测到清晰语音，请靠近麦克风再试一次，或直接点击 +1 打卡。');
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    try {
      recognition.start();
    } catch (e) {
      stopRecording();
    }
  };

  const togglePlayUserAudio = () => {
    if (!audioUrl) return;
    if (isPlayingUserAudio && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      setIsPlayingUserAudio(false);
      return;
    }
    const audio = new Audio(audioUrl);
    audioPlayerRef.current = audio;
    setIsPlayingUserAudio(true);
    audio.onended = () => setIsPlayingUserAudio(false);
    audio.onerror = () => setIsPlayingUserAudio(false);
    audio.play();
  };

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
            isRecording
              ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90'
          }`}
        >
          <Mic className={`w-3.5 h-3.5 ${isRecording ? 'text-white' : 'text-rose-500'}`} />
          <span>{isRecording ? '正在录音 (点击停止)...' : '🎤 录音测评'}</span>
        </button>

        {audioUrl && (
          <button
            type="button"
            onClick={togglePlayUserAudio}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
          >
            {isPlayingUserAudio ? (
              <>
                <Square className="w-3 h-3 fill-current" />
                <span>停止回放</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>▶️ 听我的录音</span>
              </>
            )}
          </button>
        )}

        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg text-xs">
          <Award className={`w-3.5 h-3.5 ${readCount >= 20 ? 'text-amber-500' : 'text-slate-400'}`} />
          <span className="text-slate-600 font-medium">肌肉记忆跟读:</span>
          <span className={`font-extrabold ${readCount >= 20 ? 'text-emerald-600' : 'text-blue-600'}`}>
            {readCount}/20
          </span>
          <button
            type="button"
            onClick={() => onIncrementCount && onIncrementCount(targetSentence)}
            className="ml-1 px-1.5 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10.5px] font-bold transition-colors"
          >
            +1 打卡
          </button>
        </div>
      </div>

      {(recognizedText || loadingFeedback || aiFeedback) && (
        <div className="bg-slate-50/90 border border-slate-200/80 rounded-lg p-2 text-xs space-y-1">
          {recognizedText && (
            <div className="text-slate-600">
              <span>识别结果: </span>
              <span className="font-mono font-semibold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                {recognizedText}
              </span>
            </div>
          )}
          {loadingFeedback ? (
            <div className="flex items-center gap-1.5 text-blue-600">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>AI 正在分析您的发音细节...</span>
            </div>
          ) : (
            aiFeedback && (
              <div className="text-slate-700 leading-relaxed">
                <strong className="text-blue-600">AI 纠音: </strong>
                {aiFeedback}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

// --- TAB 1: Comprehensive Sound & Ear Training Hub (Decoder + Minimal Pairs + Sound Clusters) ---
const TabZeroToOne = ({
  targetLang,
  getReadCount,
  onIncrementReadCount,
  onJumpToPracticeWithSkeleton
}) => {
  const [subStage, setSubStage] = useState('decoder'); // 'decoder' | 'pairs' | 'clusters'
  const [activePhoneticCatIdx, setActivePhoneticCatIdx] = useState(0);

  // Minimal Pairs Interactive States
  const [earQuiz, setEarQuiz] = useState(null);
  const [activePairPractice, setActivePairPractice] = useState(null); // { idx, mode: 'words' | 'sentence' }

  // Sound Clusters Interactive States
  const [clusterQuiz, setClusterQuiz] = useState(null); // { clusterIdx, targetWordIdx, wordStr, guessedIdx }
  const [activeClusterPracticeIdx, setActiveClusterPracticeIdx] = useState(null);

  const langConfig = LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en;
  const data = zeroToOneDataByLang[targetLang] || zeroToOneDataByLang.en;
  const phoneticCategories = data.phoneticCategories || [];
  const activePhoneticCat = phoneticCategories[activePhoneticCatIdx] || phoneticCategories[0];

  useEffect(() => {
    setEarQuiz(null);
    setActivePairPractice(null);
    setClusterQuiz(null);
    setActiveClusterPracticeIdx(null);
    setActivePhoneticCatIdx(0);
  }, [targetLang, subStage]);

  const cleanSpeakWord = (raw) =>
    String(raw || '')
      .split('(')[0]
      .split('/')[0]
      .trim();

  const startEarQuiz = (pair, idx) => {
    const side = Math.random() < 0.5 ? 1 : 2;
    const rawWord = cleanSpeakWord(side === 1 ? pair.w1 : pair.w2);
    setEarQuiz({ pairIdx: idx, targetSide: side, word: rawWord, guessed: null });
    speakText(rawWord, 0.92);
  };

  const handleGuessEarQuiz = (side) => {
    if (!earQuiz) return;
    setEarQuiz((prev) => ({ ...prev, guessed: side }));
  };

  const startClusterQuiz = (cluster, clusterIdx) => {
    const randIdx = Math.floor(Math.random() * cluster.words.length);
    const chosen = cleanSpeakWord(cluster.words[randIdx].w);
    setClusterQuiz({
      clusterIdx,
      targetWordIdx: randIdx,
      wordStr: chosen,
      guessedIdx: null
    });
    speakText(chosen, 0.92);
  };

  const playClusterChain = (wordsList) => {
    let idx = 0;
    const playNext = () => {
      if (idx >= wordsList.length) return;
      const clean = cleanSpeakWord(wordsList[idx].w);
      idx += 1;
      speakText(clean, 0.94, 1.0, () => {
        setTimeout(playNext, 420);
      });
    };
    playNext();
  };

  return (
    <div className="space-y-3.5">
      {/* Top Banner + 3 Sub-Stages Switcher */}
      <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-emerald-50 border border-blue-200/80 rounded-xl p-3 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10.5px] font-extrabold">
              STEP 1 · 发音与辨音训练营
            </span>
            <h2 className="text-sm font-black text-slate-900">
              {langConfig.flag} {langConfig.name} · {data.subtitle}
            </h2>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            先认全所有基础音素与拼读铁律，再通过「10组易混音+同句绕口实战」与「8大同音词族串烧」，边听边录彻底调校耳朵和舌头！
          </p>
        </div>

        {/* 3 Sub-stage Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/90 p-1 rounded-xl border border-blue-200/80 shrink-0">
          {[
            { id: 'decoder', label: '① 全景发音表与密码' },
            { id: 'pairs', label: `② 易混相似音对决 (${data.minimalPairs.length}组)` },
            { id: 'clusters', label: `③ 同音词族串串烧 (${data.soundClusters.length}族)` }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubStage(tab.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                subStage === tab.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-stage 1: Complete Phonetic System Chart + 4 Reading Rules */}
      {subStage === 'decoder' && (
        <div className="space-y-3">
          {/* Interactive Complete Phonetic System Matrix */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-extrabold text-slate-800">{data.alphabetTitle}</h3>
                {activePhoneticCat && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{activePhoneticCat.desc}</p>
                )}
              </div>

              {/* Category Switcher Tabs for Full Phonetic System */}
              {phoneticCategories.length > 1 && (
                <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs shrink-0">
                  {phoneticCategories.map((cat, idx) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActivePhoneticCatIdx(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        activePhoneticCatIdx === idx
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {activePhoneticCat && (
              <div
                className={`grid gap-2.5 ${
                  activePhoneticCat.isGrid5
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
                    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}
              >
                {activePhoneticCat.items.map((c, idx) => {
                  const primaryChar = c.char.split('/')[0].replace(/（.*?）|\(.*?\)/g, '').trim();
                  const singleSoundText = c.sound || primaryChar;
                  return (
                    <div
                      key={idx}
                      onClick={() => playPurePhoneme(c.char, singleSoundText)}
                      className="bg-white hover:bg-blue-50/50 border border-slate-200/90 hover:border-blue-400 rounded-xl p-2.5 cursor-pointer transition-all shadow-2xs flex flex-col justify-between gap-1.5"
                    >
                      {/* Row 1: Phonetic Symbol / Kana + Pure Phoneme Single Sound Button + Spelling Rule Badge */}
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-sm font-black text-slate-900 leading-none">
                            {c.char}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playPurePhoneme(c.char, singleSoundText);
                            }}
                            className="px-1.5 py-0.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold flex items-center gap-0.5 shrink-0 transition-colors shadow-2xs"
                            title={`播放 ${c.char} 的纯粹音标单音`}
                          >
                            <Volume2 className="w-2.5 h-2.5" />
                            <span>纯单音</span>
                          </button>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded shrink-0">
                          {c.sub}
                        </span>
                      </div>

                      {/* Row 2: Mouth / Pronunciation Tip */}
                      <p className="text-[10.5px] text-slate-500 leading-snug">{c.tip}</p>

                      {/* Row 3: Sample Word + Chinese Meaning + Slow Button */}
                      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(c.sample || singleSoundText, 0.92);
                          }}
                          className="font-bold text-slate-800 hover:text-blue-600 flex items-center gap-1 text-left min-w-0 truncate"
                          title="点击朗读下方示例单词"
                        >
                          <Volume2 className="w-3 h-3 text-blue-600 shrink-0" />
                          <span className="truncate">
                            例: {c.sample}
                            {c.sampleCn && (
                              <span className="text-slate-500 font-normal ml-1">
                                ({c.sampleCn})
                              </span>
                            )}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(c.sample || singleSoundText, 0.6);
                          }}
                          className="px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10px] font-bold shrink-0"
                          title="0.6x 慢速读示例词"
                        >
                          🐢
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4 Golden Reading Rules */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <h3 className="text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>一页纸拼读密码 (4条铁律开口能读)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {data.rules.map((r, i) => (
                <div key={i} className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{r.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-5">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-stage 2: 10 Minimal Pairs + Same-Sentence Contrast + Ear Quiz + Recording & Playback */}
      {subStage === 'pairs' && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
          <div>
            <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-rose-500" />
              <span>
                Gabriel Wyner 最小对立体耳训与同句跟读 ({data.minimalPairs.length} 组高频易混音全收录)
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              每组均配有<strong>【👂 盲听测耳力】</strong>、<strong>【🎤 双词对比跟读】</strong>以及把两个易混词放进同一句话的<strong>【🔥 同句实战绕口跟读】</strong>（支持回放你自己的录音 + AI 评判）！
            </p>
          </div>

          <div className="space-y-2.5">
            {data.minimalPairs.map((pair, idx) => {
              const isQuizActive = earQuiz && earQuiz.pairIdx === idx;
              const isPracticingWords =
                activePairPractice && activePairPractice.idx === idx && activePairPractice.mode === 'words';
              const isPracticingSentence =
                activePairPractice && activePairPractice.idx === idx && activePairPractice.mode === 'sentence';

              const cleanW1 = cleanSpeakWord(pair.w1);
              const cleanW2 = cleanSpeakWord(pair.w2);
              const bothWordsTarget = `${cleanW1}, ${cleanW2}`;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200/90 p-3 hover:border-blue-300 transition-all shadow-2xs space-y-2"
                >
                  {/* Row 1: Tag + Word A & Word B + Action Buttons */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60 self-start lg:self-center shrink-0">
                      {pair.tag}
                    </span>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Word A */}
                      <div className="flex items-center justify-between bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 rounded-lg px-2.5 py-1.5 transition-colors">
                        <button
                          type="button"
                          onClick={() => speakText(cleanW1, 0.95)}
                          className="text-left flex-1"
                        >
                          <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                            <Volume2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>A: {pair.w1}</span>
                          </div>
                          <div className="text-[10.5px] text-slate-500 font-mono">{pair.ipa1}</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => speakText(cleanW1, 0.6)}
                          className="px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10px] font-bold shrink-0 ml-1"
                        >
                          🐢 慢速
                        </button>
                      </div>

                      {/* Word B */}
                      <div className="flex items-center justify-between bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 rounded-lg px-2.5 py-1.5 transition-colors">
                        <button
                          type="button"
                          onClick={() => speakText(cleanW2, 0.95)}
                          className="text-left flex-1"
                        >
                          <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                            <Volume2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>B: {pair.w2}</span>
                          </div>
                          <div className="text-[10.5px] text-slate-500 font-mono">{pair.ipa2}</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => speakText(cleanW2, 0.6)}
                          className="px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10px] font-bold shrink-0 ml-1"
                        >
                          🐢 慢速
                        </button>
                      </div>
                    </div>

                    {/* Action Triggers: Blind Ear Quiz & Word Pair Follow-Read */}
                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEarQuiz(pair, idx)}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold transition-colors"
                      >
                        👂 盲听测耳力
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActivePairPractice((prev) =>
                            prev && prev.idx === idx && prev.mode === 'words'
                              ? null
                              : { idx, mode: 'words' }
                          )
                        }
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                          isPracticingWords
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                        }`}
                      >
                        🎤 跟读这两词
                      </button>
                    </div>
                  </div>

                  {/* Row 2: Same-Sentence Contrast Box (Contains Both Confusing Words!) */}
                  {pair.sentence && (
                    <div className="bg-slate-50/90 border border-slate-200/80 rounded-lg px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center flex-wrap gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[10px]">
                            🔥 同句对比实战
                          </span>
                          <span className="text-xs font-extrabold text-slate-900">{pair.sentence}</span>
                          <span className="text-[11px] text-slate-500">（{pair.sentenceCn}）</span>
                        </div>
                        <p className="text-[10.5px] text-slate-500">
                          🎯 <strong>发音要领：</strong>
                          {pair.tip}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => speakText(pair.sentence, 0.94)}
                          className="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-600 border border-slate-200 text-[11px] font-bold flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>读整句</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => speakText(pair.sentence, 0.6)}
                          className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold"
                        >
                          🐢 慢速
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setActivePairPractice((prev) =>
                              prev && prev.idx === idx && prev.mode === 'sentence'
                                ? null
                                : { idx, mode: 'sentence' }
                            )
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                            isPracticingSentence
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          🎤 跟读对比句
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Interactive Blind Ear Quiz Box */}
                  {isQuizActive && (
                    <div className="p-2.5 rounded-lg bg-indigo-50/90 border border-indigo-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => speakText(earQuiz.word, 0.92)}
                          className="bg-indigo-600 text-white px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>再听一遍谜题音</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => speakText(earQuiz.word, 0.6)}
                          className="bg-amber-500 text-white px-2 py-1 rounded-lg font-bold text-[11px]"
                        >
                          🐢 慢速听谜题
                        </button>
                        <span className="text-indigo-950 font-semibold">刚刚系统读的是哪一个？</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleGuessEarQuiz(1)}
                          className={`px-2.5 py-1 rounded-lg font-bold border text-[11px] ${
                            earQuiz.guessed === 1
                              ? earQuiz.targetSide === 1
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-rose-600 text-white border-rose-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          猜 A ({pair.w1})
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGuessEarQuiz(2)}
                          className={`px-2.5 py-1 rounded-lg font-bold border text-[11px] ${
                            earQuiz.guessed === 2
                              ? earQuiz.targetSide === 2
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-rose-600 text-white border-rose-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          猜 B ({pair.w2})
                        </button>
                        {earQuiz.guessed !== null && (
                          <span
                            className={`font-extrabold text-[11px] ${
                              earQuiz.guessed === earQuiz.targetSide ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {earQuiz.guessed === earQuiz.targetSide
                              ? '🎉 耳力超准！'
                              : `💡 其实是 ${earQuiz.targetSide === 1 ? 'A' : 'B'}，再点慢速对比听听！`}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Recording & AI Pronunciation Evaluation Drawer for Either Word Pair or Full Contrast Sentence */}
                  {(isPracticingWords || isPracticingSentence) && (
                    <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-blue-900">
                          🎙️ 当前跟读测评目标：
                          <span className="ml-1 px-2 py-0.5 rounded bg-white border border-blue-200 text-blue-700 font-mono">
                            {isPracticingWords ? bothWordsTarget : pair.sentence}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setActivePairPractice(null)}
                          className="text-[11px] text-slate-400 hover:text-slate-600"
                        >
                          收起测评 ✕
                        </button>
                      </div>
                      <PronunciationEvaluator
                        targetSentence={isPracticingWords ? bothWordsTarget : pair.sentence}
                        targetLang={targetLang}
                        readCount={getReadCount(isPracticingWords ? bothWordsTarget : pair.sentence)}
                        onIncrementCount={onIncrementReadCount}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-stage 3: 8 Sound Clusters / Word Families + Ear Quiz + Chain Follow-Read */}
      {subStage === 'clusters' && (
        <div className="space-y-3">
          {data.soundClusters.map((cluster, idx) => {
            const isClusterQuizActive = clusterQuiz && clusterQuiz.clusterIdx === idx;
            const isClusterPracticing = activeClusterPracticeIdx === idx;
            const chainTargetText = cluster.words.map((w) => cleanSpeakWord(w.w)).join(', ');

            return (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-800">{cluster.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{cluster.rule}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => playClusterChain(cluster.words)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>🔊 连读整串词族</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => startClusterQuiz(cluster, idx)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] px-2.5 py-1.5 rounded-lg"
                    >
                      👂 盲听测耳力
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveClusterPracticeIdx((prev) => (prev === idx ? null : idx))
                      }
                      className={`font-bold text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors ${
                        isClusterPracticing
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      🎤 整串跟读测评
                    </button>
                  </div>
                </div>

                {/* 5 Words in the Cluster */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {cluster.words.map((item, wIdx) => {
                    const cleanSpeak = cleanSpeakWord(item.w);
                    return (
                      <div
                        key={wIdx}
                        onClick={() => speakText(cleanSpeak, 0.95)}
                        className="bg-white hover:bg-blue-50/70 border border-slate-200/90 hover:border-blue-400 rounded-xl p-2.5 cursor-pointer transition-all shadow-2xs flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs font-extrabold text-slate-900">{item.w}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(cleanSpeak, 0.6);
                            }}
                            className="px-1.5 py-0.2 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10px] font-bold shrink-0"
                          >
                            🐢
                          </button>
                        </div>
                        <div className="text-[10.5px] font-mono text-amber-700 mt-1">{item.pron}</div>
                        <div className="text-[11px] font-bold text-slate-700 mt-0.5">{item.cn}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Cluster Blind Ear Quiz Box */}
                {isClusterQuizActive && (
                  <div className="p-2.5 rounded-xl bg-indigo-50/90 border border-indigo-200 space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => speakText(clusterQuiz.wordStr, 0.92)}
                          className="bg-indigo-600 text-white px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>重播谜题词</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => speakText(clusterQuiz.wordStr, 0.6)}
                          className="bg-amber-500 text-white px-2 py-1 rounded-lg font-bold text-[11px]"
                        >
                          🐢 慢速听
                        </button>
                        <span className="font-bold text-indigo-950">
                          请盲听：刚才读的是本组 5 个词中的哪一个？
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setClusterQuiz(null)}
                        className="text-[11px] text-slate-400 hover:text-slate-600"
                      >
                        关闭测验 ✕
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {cluster.words.map((wItem, wIdx) => {
                        const isPicked = clusterQuiz.guessedIdx === wIdx;
                        const isCorrect = clusterQuiz.targetWordIdx === wIdx;
                        return (
                          <button
                            key={wIdx}
                            type="button"
                            onClick={() =>
                              setClusterQuiz((prev) => ({ ...prev, guessedIdx: wIdx }))
                            }
                            className={`px-2.5 py-1 rounded-lg font-bold border text-[11px] transition-all ${
                              isPicked
                                ? isCorrect
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-rose-600 text-white border-rose-600'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            {wItem.w}
                          </button>
                        );
                      })}
                      {clusterQuiz.guessedIdx !== null && (
                        <span
                          className={`font-extrabold text-[11px] ml-1 ${
                            clusterQuiz.guessedIdx === clusterQuiz.targetWordIdx
                              ? 'text-emerald-700'
                              : 'text-rose-600'
                          }`}
                        >
                          {clusterQuiz.guessedIdx === clusterQuiz.targetWordIdx
                            ? '🎉 完全正确！同音家族辨音通关！'
                            : `💡 正确答案是「${cluster.words[clusterQuiz.targetWordIdx].w}」，再点重播听听看！`}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Cluster Chain Recording & Evaluation Drawer */}
                {isClusterPracticing && (
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-emerald-950">
                        🎙️ 整串词族连读测评：
                        <span className="ml-1 px-2 py-0.5 rounded bg-white border border-emerald-200 text-emerald-800 font-mono">
                          {chainTargetText}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveClusterPracticeIdx(null)}
                        className="text-[11px] text-slate-400 hover:text-slate-600"
                      >
                        收起测评 ✕
                      </button>
                    </div>
                    <PronunciationEvaluator
                      targetSentence={chainTargetText}
                      targetLang={targetLang}
                      readCount={getReadCount(chainTargetText)}
                      onIncrementCount={onIncrementReadCount}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- TAB 2: 12 Sentences Deconstruction (2-Column Grid with Trap & Workplace Below Each Sentence) ---
const TabDeconstruction = ({ targetLang, isSentenceSaved, onToggleSaveSentence }) => {
  const sentences = sentencesByLang[targetLang] || sentencesByLang.en;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
      {sentences.map((item) => {
        const fullCoreSentence = item.en.join(' ');
        const workplaceWords = item.workplace.split(' ');
        const saved = isSentenceSaved(item.workplace);

        return (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200/90 hover:border-blue-300 transition-all p-3.5 flex flex-col justify-between space-y-2.5 shadow-2xs"
          >
            {/* Top Area: Number Badge + 3-Layer Colored Line Visualizer + Normal/Slow Audio */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-600 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {item.id}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10.5px] font-semibold text-slate-400">
                    悬停单词看释义 · 点击单词或喇叭发音
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => speakText(fullCoreSentence, 0.95)}
                      className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                      title="常速整句朗读"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => speakText(fullCoreSentence, 0.62)}
                      className="px-1.5 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10.5px] font-bold transition-colors"
                      title="0.65x 慢速朗读"
                    >
                      🐢 慢速
                    </button>
                  </div>
                </div>

                <MiniSentenceVisualizer
                  en={item.en}
                  lit={item.lit}
                  nat={item.nat}
                  mapping={item.mapping}
                />
              </div>
            </div>

            {/* Bottom Area: Trap & Workplace Example Directly Below Sentence */}
            <div className="pt-2.5 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/70 font-bold text-[10.5px] shrink-0 mt-0.5">
                  陷阱
                </span>
                <p className="text-slate-600 leading-relaxed text-[11.5px]">{item.trap}</p>
              </div>

              <div className="flex items-center justify-between gap-2 bg-slate-50/80 rounded-lg px-2 py-1.5 border border-slate-200/60">
                <div className="flex items-center flex-wrap gap-1 min-w-0">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/70 font-bold text-[10.5px] shrink-0 mr-1">
                    职场
                  </span>
                  <button
                    type="button"
                    onClick={() => speakText(item.workplace, 0.95)}
                    className="text-emerald-600 hover:text-emerald-700 p-0.5 shrink-0"
                    title="朗读职场例句"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  {workplaceWords.map((w, idx) => (
                    <WordWithTooltip key={idx} word={w} />
                  ))}
                  <button
                    type="button"
                    onClick={() => speakText(item.workplace, 0.62)}
                    className="px-1.5 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10px] font-bold ml-1 shrink-0"
                  >
                    🐢 慢速
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onToggleSaveSentence({
                      en: item.workplace,
                      cn: `对应第 ${item.id} 句职场高频表达`,
                      skeletonId: item.id,
                      tag: '职场例句'
                    })
                  }
                  className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold border shrink-0 transition-all ${
                    saved
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-white hover:bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {saved ? '★ 已收藏' : '☆ 收藏'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- TAB 3: Sentence Substitution, Zero-Basis Lego Builder & AI Pronunciation Diagnosis ---
const TabSubstitution = ({
  targetLang,
  initialSkeletonId = 11,
  getReadCount,
  onIncrementReadCount,
  isSentenceSaved,
  onToggleSaveSentence
}) => {
  const sentences = sentencesByLang[targetLang] || sentencesByLang.en;
  const langConfig = LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en;

  const [selectedSkeletonId, setSelectedSkeletonId] = useState(initialSkeletonId || 11);
  const [scenarioCat, setScenarioCat] = useState('work'); // 'work' | 'daily' | 'living' | 'travel'
  const [batchIdx, setBatchIdx] = useState(0);
  const [aiCustomBatch, setAiCustomBatch] = useState(null);
  const [loadingBatch, setLoadingBatch] = useState(false);

  const [selectedExampleIdx, setSelectedExampleIdx] = useState(0); // 0..4 or 'custom'
  const [customChineseInput, setCustomChineseInput] = useState('');

  const [inputMode, setInputMode] = useState('lego'); // 'lego' | 'type'
  const [userTranslation, setUserTranslation] = useState('');
  const [selectedLegoTiles, setSelectedLegoTiles] = useState([]);

  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  useEffect(() => {
    if (initialSkeletonId) {
      setSelectedSkeletonId(initialSkeletonId);
    }
  }, [initialSkeletonId]);

  const currentSkeleton =
    sentences.find((s) => s.id === selectedSkeletonId) || sentences[0];

  const batchesForCat =
    scenarioBatchesBySkeleton.default[scenarioCat] ||
    scenarioBatchesBySkeleton.default.work;
  const currentExamplesList =
    aiCustomBatch || batchesForCat[batchIdx % batchesForCat.length];

  const activeChineseTarget =
    selectedExampleIdx === 'custom'
      ? customChineseInput.trim() || '我打算明天把修改后的方案发给客户。'
      : currentExamplesList[selectedExampleIdx] || currentExamplesList[0];

  const legoData = buildLegoBlocksForSentence(targetLang, selectedSkeletonId);

  useEffect(() => {
    setSelectedLegoTiles([]);
    setUserTranslation('');
    setDiagnosisResult(null);
  }, [selectedSkeletonId, targetLang]);

  const handleCycleBatch = () => {
    setAiCustomBatch(null);
    setBatchIdx((prev) => (prev + 1) % batchesForCat.length);
    setSelectedExampleIdx(0);
  };

  const handleGenerateAiExamples = async () => {
    setLoadingBatch(true);
    const catNames = { work: '职场工作', daily: '日常沟通', living: '海外生活', travel: '旅游出行' };
    const prompt = `
      当前练习语法骨架：第 ${currentSkeleton.id} 句 "${currentSkeleton.en.join(' ')}" (${currentSkeleton.nat.join('')})
      应用场景：${catNames[scenarioCat]}
      请生成 5 个适合套用该语法骨架进行翻译练习的地道中文短句。
    `;
    const schema = {
      type: 'OBJECT',
      properties: {
        sentences: { type: 'ARRAY', items: { type: 'STRING' } }
      },
      required: ['sentences']
    };
    const res = await callGemini(prompt, '你是专业的语言教学设计师。', schema);
    if (res) {
      try {
        const parsed = JSON.parse(res);
        if (Array.isArray(parsed.sentences) && parsed.sentences.length >= 5) {
          setAiCustomBatch(parsed.sentences.slice(0, 5));
          setSelectedExampleIdx(0);
        }
      } catch (e) {}
    }
    setLoadingBatch(false);
  };

  const handleAddLegoTile = (block) => {
    speakText(block.word, 0.95);
    const next = [...selectedLegoTiles, block];
    setSelectedLegoTiles(next);
    setUserTranslation(next.map((b) => b.word).join(' '));
  };

  const handleRemoveLegoTile = (idx) => {
    const next = selectedLegoTiles.filter((_, i) => i !== idx);
    setSelectedLegoTiles(next);
    setUserTranslation(next.map((b) => b.word).join(' '));
  };

  const handleFillRecommendedOrder = () => {
    setUserTranslation(legoData.recommendedOrder);
    speakText(legoData.recommendedOrder, 0.95);
  };

  // Ensure words array and full sentence stay 100% synced
  const getSyncedSentenceData = (sentenceStr) => {
    const clean = String(sentenceStr || '').trim();
    const words = clean ? clean.split(/\s+/) : [];
    return { fullSentence: clean, words };
  };

  const handleRunDiagnosis = async () => {
    const attempt = userTranslation.trim() || legoData.recommendedOrder;
    setLoadingDiagnosis(true);

    const prompt = `
      目标学习语言: ${langConfig.name} (${langConfig.code})
      所选第 ${currentSkeleton.id} 句核心语法骨架: "${currentSkeleton.en.join(' ')}"
      目标中文句: "${activeChineseTarget}"
      用户的${langConfig.name}尝试: "${attempt}"

      请严格输出 JSON 格式诊断：
      1. feedback: 用中文点评用户的句子是否正确套用了骨架，指出语序或语法亮点与修正建议。
      2. standardSentence: 套用当前骨架最标准、完整的${langConfig.name}句子（绝不能漏掉冠词或助词）。
      3. alternatives: 提供 2 个母语者高频同义替换句，每项包含：
         - sentence: 完整的${langConfig.name}替换句（必须包含完整冠词/助词）
         - register: 适用语境标签（如“商务正式”或“日常地道口语”）
         - grammarCompare: 详细讲解该替换句与基础骨架句的对比（例如为什么用了某个短语、冠词或助词如何变化）。
    `;

    const schema = {
      type: 'OBJECT',
      properties: {
        feedback: { type: 'STRING' },
        standardSentence: { type: 'STRING' },
        alternatives: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              sentence: { type: 'STRING' },
              register: { type: 'STRING' },
              grammarCompare: { type: 'STRING' }
            },
            required: ['sentence', 'register', 'grammarCompare']
          }
        }
      },
      required: ['feedback', 'standardSentence', 'alternatives']
    };

    const res = await callGemini(prompt, `你是精通${langConfig.name}的母语级语法教练。`, schema);
    if (res) {
      try {
        const parsed = JSON.parse(res);
        setDiagnosisResult(parsed);
      } catch (e) {}
    } else {
      setDiagnosisResult({
        feedback: `很好地套用了第 ${currentSkeleton.id} 句的骨架结构！注意保持动词变位和语序的连贯性。`,
        standardSentence: currentSkeleton.workplace,
        alternatives: [
          {
            sentence: currentSkeleton.en.join(' '),
            register: '核心骨架原句',
            grammarCompare: `严格遵循第 ${currentSkeleton.id} 句的底层语序：${currentSkeleton.trap}`
          }
        ]
      });
    }
    setLoadingDiagnosis(false);
  };

  return (
    <div className="space-y-3.5">
      {/* Step 1: Select Core Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-800">
            1. 选择要套用的黄金句型骨架 (Skeleton)
          </h3>
          <span className="text-[11px] text-blue-600 font-semibold">
            当前骨架: #{currentSkeleton.id} {currentSkeleton.en.join(' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
          {sentences.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedSkeletonId(s.id)}
              className={`text-left px-2.5 py-1.5 rounded-lg border text-xs transition-all truncate ${
                selectedSkeletonId === s.id
                  ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
              }`}
            >
              <span className="opacity-75 mr-1">{s.id}.</span>
              <span>{s.en.join(' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Select Scenario & 5 Target Chinese Sentences + Custom Radio Option */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-extrabold text-slate-800">
            2. 选择应用场景与目标中文句 (Scenario)
          </h3>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCycleBatch}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>换一批 ({(batchIdx % batchesForCat.length) + 1}/{batchesForCat.length})</span>
            </button>
            <button
              type="button"
              onClick={handleGenerateAiExamples}
              disabled={loadingBatch}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold disabled:opacity-50"
            >
              {loadingBatch ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              <span>✨ AI新句</span>
            </button>
          </div>
        </div>

        {/* 4 Category Tabs */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: 'work', label: '工作' },
            { id: 'daily', label: '日常' },
            { id: 'living', label: '生活' },
            { id: 'travel', label: '旅游' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setScenarioCat(cat.id);
                setAiCustomBatch(null);
                setSelectedExampleIdx(0);
              }}
              className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                scenarioCat === cat.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 5 Preset Radio Options + 6th Custom Option */}
        <div className="space-y-1.5">
          {currentExamplesList.map((sentenceText, idx) => {
            const isSelected = selectedExampleIdx === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedExampleIdx(idx)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border cursor-pointer text-xs transition-all ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-bold'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-blue-600' : 'border-slate-400'
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                </span>
                <span>{sentenceText}</span>
              </div>
            );
          })}

          {/* 6th Option: Custom Target Sentence */}
          <div
            onClick={() => setSelectedExampleIdx('custom')}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border cursor-pointer text-xs transition-all ${
              selectedExampleIdx === 'custom'
                ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-bold'
                : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                selectedExampleIdx === 'custom' ? 'border-blue-600' : 'border-slate-400'
              }`}
            >
              {selectedExampleIdx === 'custom' && <span className="w-2 h-2 rounded-full bg-blue-600" />}
            </span>
            <span>✍️ 自定义中文目标句（点击此处输入你想表达的句子）</span>
          </div>
        </div>

        {/* Conditional Display: Only show input box when 'custom' is selected */}
        {selectedExampleIdx === 'custom' ? (
          <input
            type="text"
            value={customChineseInput}
            onChange={(e) => setCustomChineseInput(e.target.value)}
            placeholder="请输入你想翻译练习的中文句子..."
            autoFocus
            className="w-full px-3 py-2 rounded-lg border-2 border-blue-500 text-xs focus:outline-none bg-white"
          />
        ) : (
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
            <span>
              🎯 当前选中目标句：<strong className="text-slate-800">{activeChineseTarget}</strong>
            </span>
            <span className="text-blue-600 font-semibold">请直接前往下方第 3 步拼句或输入 ↓</span>
          </div>
        )}
      </div>

      {/* Step 3: Zero-Basis Lego Builder Mode OR Free Typing Mode */}
      <div className="bg-white rounded-xl border-l-4 border-l-blue-600 border border-slate-200 p-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-extrabold text-slate-800">
            3. 你的{langConfig.name}模块替换 (Your Translation)
          </h3>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setInputMode('lego')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                inputMode === 'lego'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🧩 零基础积木拼句
            </button>
            <button
              type="button"
              onClick={() => setInputMode('type')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                inputMode === 'type'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⌨️ 自由打字输入
            </button>
          </div>
        </div>

        {inputMode === 'lego' ? (
          <div className="space-y-2.5">
            {/* Assembled Sentence Tray */}
            <div className="min-h-[46px] p-2 rounded-xl bg-slate-50 border border-dashed border-slate-300 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedLegoTiles.length === 0 ? (
                  <span className="text-xs text-slate-400">
                    👇 请按语序点击下方词块积木组装句子（点击词块会自动朗读发音）...
                  </span>
                ) : (
                  selectedLegoTiles.map((tile, idx) => (
                    <button
                      key={`${tile.id}-${idx}`}
                      type="button"
                      onClick={() => handleRemoveLegoTile(idx)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center gap-1 shadow-2xs hover:bg-rose-600 transition-colors"
                      title="点击移除该词块"
                    >
                      <span>{tile.word}</span>
                      <X className="w-3 h-3 opacity-80" />
                    </button>
                  ))
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleFillRecommendedOrder}
                  className="px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold"
                >
                  💡 看骨架答案语序
                </button>
                {selectedLegoTiles.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLegoTiles([]);
                      setUserTranslation('');
                    }}
                    className="px-2 py-1 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold"
                  >
                    清空
                  </button>
                )}
              </div>
            </div>

            {/* Available Word Blocks */}
            <div className="flex flex-wrap gap-1.5">
              {legoData.blocks.map((block) => (
                <button
                  key={block.id}
                  type="button"
                  onClick={() => handleAddLegoTile(block)}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 transition-all shadow-2xs text-left"
                >
                  <div className="text-xs font-extrabold text-slate-900">{block.word}</div>
                  <div className="text-[10px] text-slate-400">{block.hint}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <textarea
            rows={2}
            value={userTranslation}
            onChange={(e) => setUserTranslation(e.target.value)}
            placeholder={`套用骨架 "${currentSkeleton.en.join(' ')}" 将上方中文翻译为${langConfig.name}...`}
            className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
          />
        )}
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleRunDiagnosis}
        disabled={loadingDiagnosis}
        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-60 transition-all"
      >
        {loadingDiagnosis ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>AI 正在诊断句型与生成母语替换句...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>AI 句型诊断替换与纠音</span>
          </>
        )}
      </button>

      {/* AI Diagnosis & Native Alternatives Result */}
      {diagnosisResult && (
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-3.5">
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-lg p-2.5 text-xs text-slate-700 leading-relaxed">
            <strong className="text-blue-700">🎯 AI 骨架诊断：</strong>
            {diagnosisResult.feedback}
          </div>

          {/* Standard Skeleton Match Sentence */}
          {(() => {
            const syncedStd = getSyncedSentenceData(diagnosisResult.standardSentence);
            const saved = isSentenceSaved(syncedStd.fullSentence);
            return (
              <div className="border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-emerald-700">
                    ✅ 标准骨架造句 (Standard Skeleton Match)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onToggleSaveSentence({
                        en: syncedStd.fullSentence,
                        cn: activeChineseTarget,
                        skeletonId: currentSkeleton.id,
                        tag: '标准骨架句'
                      })
                    }
                    className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                      saved
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {saved ? '★ 已收藏金句' : '☆ 收藏到金句本'}
                  </button>
                </div>

                <div className="flex items-center flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => speakText(syncedStd.fullSentence, 0.95)}
                    className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  {syncedStd.words.map((w, idx) => (
                    <WordWithTooltip key={idx} word={w} />
                  ))}
                  <button
                    type="button"
                    onClick={() => speakText(syncedStd.fullSentence, 0.62)}
                    className="px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10.5px] font-bold"
                  >
                    🐢 慢速
                  </button>
                </div>

                <PronunciationEvaluator
                  targetSentence={syncedStd.fullSentence}
                  targetLang={targetLang}
                  readCount={getReadCount(syncedStd.fullSentence)}
                  onIncrementCount={onIncrementReadCount}
                />
              </div>
            );
          })()}

          {/* Native Alternatives with Grammar & Register Comparison */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold text-slate-800">
              🌟 母语者高频同义替换句 (Native Alternatives & 语法对比)
            </h4>

            {(diagnosisResult.alternatives || []).map((alt, idx) => {
              const syncedAlt = getSyncedSentenceData(alt.sentence);
              const saved = isSentenceSaved(syncedAlt.fullSentence);
              return (
                <div
                  key={idx}
                  className="border border-slate-200/90 rounded-xl p-3 space-y-2 bg-slate-50/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => speakText(syncedAlt.fullSentence, 0.95)}
                        className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      {syncedAlt.words.map((w, wIdx) => (
                        <WordWithTooltip key={wIdx} word={w} />
                      ))}
                      <button
                        type="button"
                        onClick={() => speakText(syncedAlt.fullSentence, 0.62)}
                        className="px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10.5px] font-bold"
                      >
                        🐢 慢速
                      </button>
                      {alt.register && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10.5px] font-bold">
                          {alt.register}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onToggleSaveSentence({
                          en: syncedAlt.fullSentence,
                          cn: activeChineseTarget,
                          skeletonId: currentSkeleton.id,
                          tag: alt.register || '母语替换句'
                        })
                      }
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        saved
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {saved ? '★ 已收藏' : '☆ 收藏'}
                    </button>
                  </div>

                  {alt.grammarCompare && (
                    <div className="bg-amber-50/70 border border-amber-200/70 rounded-lg p-2 text-[11px] text-slate-700 leading-relaxed">
                      💡 <strong>语法与例句对比解析：</strong>
                      {alt.grammarCompare}
                    </div>
                  )}

                  <PronunciationEvaluator
                    targetSentence={syncedAlt.fullSentence}
                    targetLang={targetLang}
                    readCount={getReadCount(syncedAlt.fullSentence)}
                    onIncrementCount={onIncrementReadCount}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// --- TAB 4: Natural Human-Like Roleplay Scenario (Separated Chat & Coach Whisper) ---
const TabScenario = ({ targetLang, isSentenceSaved, onToggleSaveSentence }) => {
  const langConfig = LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en;

  const personasByLang = {
    en: [
      {
        id: 'alex',
        name: '💼 商务议价 (Alex)',
        role: '北美科技公司采购总监',
        opening: "Hey there! Glad we could hop on a quick call. Look, I went through your proposal—the features look solid, honestly. Is the final contract ready for us to review today?",
        openingCn: '嗨！很高兴能快速通个话。我看过你们的方案了，功能确实很扎实。今天的最终合同准备好给我们审阅了吗？',
        scaffoldHint: "可套用第 1 句 (The contract is ready) 或第 11 句 (I'm going to send it to you tomorrow)",
        sampleReply: "Yes, the contract is ready. I'm going to send it to you this afternoon."
      },
      {
        id: 'mia',
        name: '☕ 咖啡厅偶遇 (Mia)',
        role: '热情健谈的纽约设计师朋友',
        opening: "Oh, hey! Grab a seat! I didn't expect to run into you here. Wait, what's that book in your hand? Is it John's new novel?",
        openingCn: '噢，嗨！快坐！真没想到在这儿碰见你。等等，你手里拿的那本书是什么？是约翰的新小说吗？',
        scaffoldHint: "可套用第 2 句 (It is John's...) 或第 10 句 (I want to give it to her)",
        sampleReply: "Yes, it is John's book! I want to give it to him tomorrow."
      }
    ],
    ja: [
      {
        id: 'sato',
        name: '💼 东京商务会议 (佐藤部长)',
        role: '温和严谨的日本合作方部长',
        opening: 'お疲れ様です！先日はご提案ありがとうございました。ところで、新しい契約書はもう準備できていますか？',
        openingCn: '辛苦了！感谢前几天的提案。话说回来，新的合同已经准备好了吗？',
        scaffoldHint: '可套用第 1 句 (はい、準備できています) 或第 11 句 (明日送るつもりです)',
        sampleReply: 'はい、準備できています。明日それを佐藤さんに送るつもりです。'
      },
      {
        id: 'ken',
        name: '🍙 日本便利店与问路 (店员健太)',
        role: '热心的东京便利店店员',
        opening: 'いらっしゃいませ！お弁当は温めますか？あと、レジ袋はご利用ですか？',
        openingCn: '欢迎光临！便当需要加热吗？另外需要塑料袋吗？',
        scaffoldHint: '可套用第 10 句 (温めたいです) 或礼貌回应 (はい、お願いします)',
        sampleReply: 'はい、お願いします。このリンゴも買いたいです。'
      }
    ],
    es: [
      {
        id: 'carlos',
        name: '💼 马德里商务洽谈 (Carlos)',
        role: '直爽热情的西班牙项目总监',
        opening: '¡Hola! Qué bueno hablar contigo. Oye, revisé los datos del proyecto. ¿Está listo el contrato final para hoy?',
        openingCn: '你好！很高兴和你沟通。嘿，我看了项目数据。今天的最终合同准备好了吗？',
        scaffoldHint: '可套用第 1 句 (Sí, el contrato está listo) 或第 11 句 (Voy a enviárselo mañana)',
        sampleReply: 'Sí, el contrato está listo. Voy a enviárselo mañana.'
      }
    ]
  };

  const personas = personasByLang[targetLang] || personasByLang.en;
  const [selectedPersonaId, setSelectedPersonaId] = useState(personas[0].id);
  const activePersona = personas.find((p) => p.id === selectedPersonaId) || personas[0];

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);
  const [autoSpeakAi, setAutoSpeakAi] = useState(true);
  const [showTransMap, setShowTransMap] = useState({});
  const [scaffold, setScaffold] = useState({
    hint: activePersona.scaffoldHint,
    sample: activePersona.sampleReply
  });

  useEffect(() => {
    const first = (personasByLang[targetLang] || personasByLang.en)[0];
    setSelectedPersonaId(first.id);
    setMessages([
      {
        id: 'init-1',
        role: 'ai',
        text: first.opening,
        cn: first.openingCn
      }
    ]);
    setScaffold({
      hint: first.scaffoldHint,
      sample: first.sampleReply
    });
  }, [targetLang]);

  const handleSelectPersona = (p) => {
    setSelectedPersonaId(p.id);
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'ai',
        text: p.opening,
        cn: p.openingCn
      }
    ]);
    setScaffold({
      hint: p.scaffoldHint,
      sample: p.sampleReply
    });
  };

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text || loadingReply) return;

    const userMsgId = `user-${Date.now()}`;
    const newUserMsg = { id: userMsgId, role: 'user', text, coachTip: null, upgraded: null };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputText('');
    setLoadingReply(true);

    const historyText = messages
      .slice(-4)
      .map((m) => `${m.role === 'ai' ? activePersona.name : 'User'}: ${m.text}`)
      .join('\n');

    const prompt = `
      你正在扮演：${activePersona.name} (${activePersona.role})，使用地道自然的${langConfig.name}与用户进行真人对话。
      近期对话记录：
      ${historyText}
      User 刚刚说: "${text}"

      请严格返回 JSON 格式（将对话与教练点评完全分离）：
      1. reply: 你作为 ${activePersona.name} 的自然口语回复（仅包含纯粹地道的${langConfig.name}口语，带真实语气词，绝不夹杂中文或语法说教，1~2句话）。
      2. replyCn: 该回复的自然中文翻译。
      3. coachWhisper: 用中文简短点评用户刚才那句话的语法/语序（30字内）。
      4. nativeUpgrade: 把用户刚才那句话润色成更地道的母语者表达（仅${langConfig.name}句子）。
      5. nextScaffoldHint: 提示用户下一句可以套用12句中的什么结构来接话。
      6. nextSampleReply: 给出一句供用户参考的下一句${langConfig.name}回答示例。
    `;

    const schema = {
      type: 'OBJECT',
      properties: {
        reply: { type: 'STRING' },
        replyCn: { type: 'STRING' },
        coachWhisper: { type: 'STRING' },
        nativeUpgrade: { type: 'STRING' },
        nextScaffoldHint: { type: 'STRING' },
        nextSampleReply: { type: 'STRING' }
      },
      required: ['reply', 'replyCn', 'coachWhisper', 'nativeUpgrade', 'nextScaffoldHint', 'nextSampleReply']
    };

    const res = await callGemini(prompt, `你是地道的${langConfig.name}母语对话伙伴与幕后教练。`, schema);
    if (res) {
      try {
        const parsed = JSON.parse(res);
        setMessages((prev) =>
          prev
            .map((m) =>
              m.id === userMsgId
                ? { ...m, coachTip: parsed.coachWhisper, upgraded: parsed.nativeUpgrade }
                : m
            )
            .concat({
              id: `ai-${Date.now()}`,
              role: 'ai',
              text: parsed.reply,
              cn: parsed.replyCn
            })
        );
        setScaffold({
          hint: parsed.nextScaffoldHint,
          sample: parsed.nextSampleReply
        });
        if (autoSpeakAi) {
          speakText(parsed.reply, 0.96);
        }
      } catch (e) {}
    }
    setLoadingReply(false);
  };

  return (
    <div className="space-y-3">
      {/* Top Bar: Persona Switcher & Auto-Speak Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        <div className="flex flex-wrap gap-1.5">
          {personas.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectPersona(p)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedPersonaId === p.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setAutoSpeakAi((v) => !v)}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
            autoSpeakAi
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-white text-slate-500 border-slate-200'
          }`}
        >
          {autoSpeakAi ? '🔊 对方自动开口说: 开启' : '🔇 对方自动开口说: 关闭'}
        </button>
      </div>

      {/* Chat Messages Stream */}
      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 space-y-3 max-h-[380px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs space-y-1.5 shadow-2xs ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs'
                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[10.5px] opacity-75">
                  {msg.role === 'user' ? '你 (You)' : activePersona.name}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => speakText(msg.text, 0.95)}
                    className={`p-1 rounded-full ${
                      msg.role === 'user'
                        ? 'hover:bg-blue-500 text-white'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                    }`}
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => speakText(msg.text, 0.62)}
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      msg.role === 'user'
                        ? 'bg-blue-700 text-amber-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    🐢 慢速
                  </button>
                  {msg.cn && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowTransMap((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }))
                      }
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                    >
                      {showTransMap[msg.id] ? '隐藏译文' : '看译文'}
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs md:text-sm font-semibold leading-relaxed">{msg.text}</p>

              {msg.cn && showTransMap[msg.id] && (
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  {msg.cn}
                </p>
              )}
            </div>

            {/* Coach Whisper Box Under User Message */}
            {msg.role === 'user' && (msg.coachTip || msg.upgraded) && (
              <div className="mt-1.5 max-w-[85%] bg-amber-50/90 border border-amber-200 rounded-xl px-3 py-2 text-[11px] text-slate-700 space-y-1">
                {msg.coachTip && (
                  <div>
                    <strong className="text-amber-800">💡 教练悄悄话：</strong>
                    {msg.coachTip}
                  </div>
                )}
                {msg.upgraded && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-amber-200/60">
                    <div>
                      <span className="font-bold text-emerald-700">✨ 更地道表达：</span>
                      <span className="font-extrabold text-slate-900">{msg.upgraded}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => speakText(msg.upgraded, 0.95)}
                        className="px-1.5 py-0.5 rounded bg-white text-blue-600 border border-blue-200 text-[10px] font-bold"
                      >
                        🔊 朗读
                      </button>
                      <button
                        type="button"
                        onClick={() => speakText(msg.upgraded, 0.62)}
                        className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold"
                      >
                        🐢 慢速
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onToggleSaveSentence({
                            en: msg.upgraded,
                            cn: '场景实战地道升级句',
                            skeletonId: 1,
                            tag: '实战好句'
                          })
                        }
                        className="px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200 text-[10px] font-bold"
                      >
                        {isSentenceSaved(msg.upgraded) ? '★ 已收藏' : '☆ 收藏'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dynamic Response Scaffold Hint Bar */}
      <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="text-indigo-950">
          <span className="font-extrabold text-indigo-700">💡 接话灵感：</span>
          <span>{scaffold.hint}</span>
        </div>
        <button
          type="button"
          onClick={() => setInputText(scaffold.sample)}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-[11px] shrink-0"
        >
          ✨ 填入参考句
        </button>
      </div>

      {/* Input Row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={`用${langConfig.name}回复 ${activePersona.name}...`}
          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={loadingReply}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
        >
          {loadingReply ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>发送</span>
        </button>
      </div>
    </div>
  );
};

// --- TAB 5: Personal Golden Sentence Notebook (LocalStorage Persistence + Commute Loop Player) ---
const TabNotebook = ({
  notebook,
  onRemoveSentence,
  onImportNotebook,
  getReadCount,
  onIncrementReadCount,
  targetLang
}) => {
  const [isLoopPlaying, setIsLoopPlaying] = useState(false);
  const [currentLoopIdx, setCurrentLoopIdx] = useState(0);
  const loopActiveRef = useRef(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      loopActiveRef.current = false;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startCommuteLoop = () => {
    if (notebook.length === 0) return;
    loopActiveRef.current = true;
    setIsLoopPlaying(true);
    let idx = 0;

    const playNext = () => {
      if (!loopActiveRef.current || notebook.length === 0) return;
      const item = notebook[idx % notebook.length];
      setCurrentLoopIdx(idx % notebook.length);
      idx += 1;
      speakText(item.en, 0.92, 1.0, () => {
        if (loopActiveRef.current) {
          setTimeout(playNext, 900);
        }
      });
    };

    playNext();
  };

  const stopCommuteLoop = () => {
    loopActiveRef.current = false;
    setIsLoopPlaying(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notebook, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'deconstruction_dozen_notebook.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          onImportNotebook(parsed);
        }
      } catch (err) {}
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-3.5">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800">
            📒 我的肌肉记忆金句本 (浏览器本地自动存档)
          </h3>
          <p className="text-[11px] text-slate-500">
            所有收藏的句子与 20 遍跟读进度均保存在当前浏览器 `localStorage` 中，支持一键导出 JSON 备份。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {notebook.length > 0 && (
            <button
              type="button"
              onClick={isLoopPlaying ? stopCommuteLoop : startCommuteLoop}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                isLoopPlaying
                  ? 'bg-rose-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoopPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isLoopPlaying ? '停止通勤连播' : '🎧 通勤循环连播'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportJson}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出备份</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>导入恢复</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>
      </div>

      {notebook.length === 0 ? (
        <div className="text-center py-10 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 space-y-1">
          <Bookmark className="w-7 h-7 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-600">金句本还是空的</p>
          <p className="text-[11px] text-slate-400">
            在【12句拆解】、【句型替换】或【场景实战】中点击「☆ 收藏」，即可将好句收入此处反复跟读！
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notebook.map((item, idx) => (
            <div
              key={item.en}
              className={`rounded-xl border p-3 space-y-2 transition-all ${
                isLoopPlaying && currentLoopIdx === idx
                  ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                      {item.tag || `骨架 #${item.skeletonId || 1}`}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">{item.en}</span>
                    <button
                      type="button"
                      onClick={() => speakText(item.en, 0.95)}
                      className="p-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => speakText(item.en, 0.62)}
                      className="px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10px] font-bold"
                    >
                      🐢 慢速
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">{item.cn}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveSentence(item.en)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                  title="移除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <PronunciationEvaluator
                targetSentence={item.en}
                targetLang={targetLang}
                readCount={getReadCount(item.en)}
                onIncrementCount={onIncrementReadCount}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [targetLang, setTargetLang] = useState(() => loadFromStorage(STORAGE_KEYS.LANG, 'en'));
  const [activeTab, setActiveTab] = useState('zero');
  const [jumpSkeletonId, setJumpSkeletonId] = useState(11);

  const [notebook, setNotebook] = useState(() => loadFromStorage(STORAGE_KEYS.NOTEBOOK, []));
  const [readCounts, setReadCounts] = useState(() => loadFromStorage(STORAGE_KEYS.PROGRESS, {}));

  const [showApiModal, setShowApiModal] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => loadFromStorage(STORAGE_KEYS.API_KEY, ''));

  useEffect(() => {
    currentSpeechLang = (LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en).speechLang;
    saveToStorage(STORAGE_KEYS.LANG, targetLang);
  }, [targetLang]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NOTEBOOK, notebook);
  }, [notebook]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROGRESS, readCounts);
  }, [readCounts]);

  const getReadCount = (sentence) => readCounts[sentence] || 0;

  const handleIncrementReadCount = (sentence) => {
    if (!sentence) return;
    setReadCounts((prev) => ({
      ...prev,
      [sentence]: (prev[sentence] || 0) + 1
    }));
  };

  const isSentenceSaved = (enStr) => notebook.some((item) => item.en === enStr);

  const handleToggleSaveSentence = (sentenceObj) => {
    setNotebook((prev) => {
      const exists = prev.some((item) => item.en === sentenceObj.en);
      if (exists) {
        return prev.filter((item) => item.en !== sentenceObj.en);
      }
      return [{ ...sentenceObj, savedAt: Date.now() }, ...prev];
    });
  };

  const handleRemoveSentence = (enStr) => {
    setNotebook((prev) => prev.filter((item) => item.en !== enStr));
  };

  const handleJumpToPracticeWithSkeleton = (skeletonId) => {
    setJumpSkeletonId(skeletonId || 11);
    setActiveTab('substitution');
  };

  const tabs = [
    { id: 'zero', label: '1. 🗣️ 发音与辨音', icon: Volume2 },
    { id: 'deconstruction', label: '2. 📖 12句拆解', icon: BookOpen },
    { id: 'substitution', label: '3. 🧩 句型替换与拼句', icon: RefreshCw },
    { id: 'scenario', label: '4. 💬 场景实战', icon: MessageSquare },
    { id: 'notebook', label: `5. 📒 金句本 (${notebook.length})`, icon: Bookmark }
  ];

  const totalMastered = Object.values(readCounts).filter((c) => c >= 20).length;
  const langConfig = LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-2 md:p-3">
      <div className="max-w-7xl mx-auto space-y-2.5">
        {/* Compact Header */}
        <header className="bg-white rounded-2xl shadow-2xs border border-slate-200/90 px-3.5 py-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-900">
                  Deconstruction Dozen{' '}
                  <span className="text-blue-600">{langConfig.title}</span>
                </h1>
                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  {Object.values(LANGUAGE_CONFIG).map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setTargetLang(l.code)}
                      className={`px-2 py-0.5 rounded-md text-xs font-bold transition-all ${
                        targetLang === l.code
                          ? 'bg-white text-blue-600 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {l.flag} {l.name}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tim Ferriss 12句解构法 · {langConfig.name}从零破冰与肌肉记忆引擎 (已通关20遍句子:{' '}
                <strong className="text-emerald-600">{totalMastered}</strong>)
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowApiModal(true)}
              className="lg:hidden px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>API</span>
            </button>
          </div>

          {/* Navigation Tabs + Settings */}
          <div className="flex flex-wrap items-center gap-1.5">
            <nav className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              {tabs.map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={() => setShowApiModal(true)}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200/80"
              title="配置自定义 Gemini API Key (BYOK)"
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>API设置</span>
            </button>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="bg-white rounded-2xl shadow-2xs border border-slate-200 p-2.5 md:p-4">
          {activeTab === 'zero' && (
            <TabZeroToOne
              targetLang={targetLang}
              getReadCount={getReadCount}
              onIncrementReadCount={handleIncrementReadCount}
              onJumpToPracticeWithSkeleton={handleJumpToPracticeWithSkeleton}
            />
          )}
          {activeTab === 'deconstruction' && (
            <TabDeconstruction
              targetLang={targetLang}
              isSentenceSaved={isSentenceSaved}
              onToggleSaveSentence={handleToggleSaveSentence}
            />
          )}
          {activeTab === 'substitution' && (
            <TabSubstitution
              targetLang={targetLang}
              initialSkeletonId={jumpSkeletonId}
              getReadCount={getReadCount}
              onIncrementReadCount={handleIncrementReadCount}
              isSentenceSaved={isSentenceSaved}
              onToggleSaveSentence={handleToggleSaveSentence}
            />
          )}
          {activeTab === 'scenario' && (
            <TabScenario
              targetLang={targetLang}
              isSentenceSaved={isSentenceSaved}
              onToggleSaveSentence={handleToggleSaveSentence}
            />
          )}
          {activeTab === 'notebook' && (
            <TabNotebook
              notebook={notebook}
              onRemoveSentence={handleRemoveSentence}
              onImportNotebook={(list) => setNotebook(list)}
              getReadCount={getReadCount}
              onIncrementReadCount={handleIncrementReadCount}
              targetLang={targetLang}
            />
          )}
        </main>
      </div>

      {/* BYOK API Key Modal */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 space-y-3 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>开源版 API Key 本地设置 (BYOK)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowApiModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              在当前预览环境中无需填写即可直接使用。若您将本项目开源部署到 GitHub Pages，可在此填入您自己的 Google Gemini API Key（仅保存在您当前浏览器的 `localStorage` 中，绝不上传至任何第三方服务器）。
            </p>
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="AIzaSy... (留空则使用默认环境 Key)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  saveToStorage(STORAGE_KEYS.API_KEY, customApiKey.trim());
                  setShowApiModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                保存并生效
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}