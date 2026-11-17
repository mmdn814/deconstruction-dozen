// --- LocalStorage Keys & Helpers ---
export const STORAGE_KEYS = {
  NOTEBOOK: 'dd_english_notebook_v1',
  PROGRESS: 'dd_english_progress_v1',
  API_KEY: 'dd_english_custom_apikey_v1',
  API_ENDPOINT: 'dd_custom_api_endpoint_v1',
  API_MODEL: 'dd_custom_api_model_v1',
  API_PROVIDER: 'dd_custom_api_provider_v1',
  LANG: 'dd_target_lang_v1'
};

export const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
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

// --- Standard Oxford 44 IPA Pure Phoneme Audio Map (Local High-Fidelity MP3 Files) ---
export const IPA_AUDIO_MAP = {
  // 12 单元音 (Monophthongs)
  '/iː/': 'iː_isolation.mp3',
  '/ɪ/': 'ɪ_isolation.mp3',
  '/e/': 'e_isolation.mp3',
  '/æ/': 'æ_isolation.mp3',
  '/ɜːr/': 'ɜː_isolation.mp3',
  '/ɜː/': 'ɜː_isolation.mp3',
  '/ə/': 'ə_isolation.mp3',
  '/ʌ/': 'ʌ_isolation.mp3',
  '/ɑː/': 'ɑː_isolation.mp3',
  '/ɔː/': 'ɔː_isolation.mp3',
  '/ɒ/': 'ɒ_isolation.mp3',
  '/uː/': 'uː_isolation.mp3',
  '/ʊ/': 'ʊ_isolation.mp3',

  // 8 双元音 (Diphthongs)
  '/eɪ/': 'eɪ_isolation.mp3',
  '/aɪ/': 'aɪ_isolation.mp3',
  '/ɔɪ/': 'ɔɪ_isolation.mp3',
  '/aʊ/': 'aʊ_isolation.mp3',
  '/əʊ/': 'əʊ_isolation.mp3',
  '/oʊ/': 'əʊ_isolation.mp3',
  '/ɪər/': 'ɪə_isolation.mp3',
  '/ɪə/': 'ɪə_isolation.mp3',
  '/eər/': 'eə_isolation.mp3',
  '/eə/': 'eə_isolation.mp3',
  '/ʊər/': 'ʊə_isolation.mp3',
  '/ʊə/': 'ʊə_isolation.mp3',

  // 16 清浊成对辅音 (Paired Consonants)
  '/p/': 'p_isolation.mp3',
  '/b/': 'b_isolation.mp3',
  '/t/': 't_isolation.mp3',
  '/d/': 'd_isolation.mp3',
  '/k/': 'k_isolation.mp3',
  '/ɡ/': 'g_isolation.mp3',
  '/g/': 'g_isolation.mp3',
  '/f/': 'f_isolation.mp3',
  '/v/': 'v_isolation.mp3',
  '/θ/': 'θ_isolation.mp3',
  '/ð/': 'ð_isolation.mp3',
  '/s/': 's_isolation.mp3',
  '/z/': 'z_isolation.mp3',
  '/ʃ/': 'ʃ_isolation.mp3',
  '/ʒ/': 'ʒ_isolation.mp3',
  '/tʃ/': 'tʃ_isolation.mp3',
  '/dʒ/': 'dʒ_isolation.mp3',

  // 8 鼻音、舌侧音与半元音 (Nasals, Lateral, Approximants)
  '/m/': 'm_isolation.mp3',
  '/n/': 'n_isolation.mp3',
  '/ŋ/': 'ŋ_isolation.mp3',
  '/h/': 'h_isolation.mp3',
  '/l/': 'l_isolation.mp3',
  '/r/': 'r_isolation.mp3',
  '/w/': 'w_isolation.mp3',
  '/j/': 'j_isolation.mp3',

  // Spanish Trill (西语大舌颤音)
  'RR': 'rr_isolation.mp3',
  'RR rr': 'rr_isolation.mp3'
};

const getIpaAudioUrl = (filename) => {
  const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || './';
  return `${base.replace(/\/+$/, '')}/audio/ipa/${filename}`;
};

let activeIpaAudio = null;

// --- Play Pure IPA Phoneme Sound (Priority 1: Local Oxford Isolated Recording -> Priority 2: Native TTS) ---
export const playPurePhoneme = (charKey, fallbackSoundText, lang = 'en-US') => {
  if (typeof window === 'undefined') return;
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (activeIpaAudio) {
      activeIpaAudio.pause();
      activeIpaAudio.currentTime = 0;
    }

    const raw = String(charKey || '').trim();
    // 兼容 '/p/ 清'、'/p/'、'p' 等各种传入格式
    const cleanKey = raw.replace(/\s*[\(（].*$/, '').replace(/\s*(清|浊).*$/, '').trim();
    const slashKey = `/${cleanKey.replace(/^\/+|\/+$/g, '')}/`;
    const audioFile = IPA_AUDIO_MAP[raw] || IPA_AUDIO_MAP[cleanKey] || IPA_AUDIO_MAP[slashKey];

    if (audioFile) {
      const audioUrl = getIpaAudioUrl(audioFile);
      const audio = new Audio(audioUrl);
      activeIpaAudio = audio;
      audio.onerror = () => {
        speakText(fallbackSoundText, 0.85, 1.0, null, lang);
      };
      audio.play().catch(() => {
        speakText(fallbackSoundText, 0.85, 1.0, null, lang);
      });
      return;
    }

    speakText(fallbackSoundText, 0.85, 1.0, null, lang);
  } catch {
    speakText(fallbackSoundText, 0.85, 1.0, null, lang);
  }
};

// --- Web Speech TTS Helper with Native Multilingual Voice Detection ---
let cachedVoices = [];
const refreshVoices = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  }
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

export const getBestVoiceForLang = (langCode) => {
  if (!cachedVoices.length) refreshVoices();
  const target = (langCode || currentSpeechLang || 'en-US').toLowerCase();
  const short = target.split('-')[0];

  // 1. 完全匹配（如 ja-JP, es-ES, en-US），优先选择自然/增强发音人
  const exact = cachedVoices.filter((v) => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    return vLang === target;
  });
  if (exact.length) {
    return exact.find((v) => /natural|premium|enhanced/i.test(v.name)) || exact[0];
  }

  // 2. 语言前缀匹配（如 ja, es, en）
  const prefix = cachedVoices.filter((v) => v.lang.toLowerCase().startsWith(short));
  if (prefix.length) {
    return prefix.find((v) => /natural|premium|enhanced/i.test(v.name)) || prefix[0];
  }

  return null;
};

export const speakText = (text, rate = 0.95, pitch = 1.0, onEndCallback = null, langCode = null) => {
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
    const targetLangCode = langCode || currentSpeechLang || 'en-US';
    const bestVoice = getBestVoiceForLang(targetLangCode);

    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    } else {
      utterance.lang = targetLangCode;
    }

    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onend = () => {
      if (onEndCallback) onEndCallback();
    };
    utterance.onerror = () => {
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  } catch {
    if (onEndCallback) onEndCallback();
  }
};

// --- Multi-Provider AI Helper (Supports OpenAI-Compatible Protocols & Google Gemini) ---
export const callAI = async (prompt, systemInstruction = '', responseSchema = null) => {
  const customKey = loadFromStorage(STORAGE_KEYS.API_KEY, '').trim();
  if (!customKey) {
    console.warn('API Key 未配置，跳过请求');
    return null;
  }

  const provider = loadFromStorage(STORAGE_KEYS.API_PROVIDER, 'openai');
  const endpoint = loadFromStorage(STORAGE_KEYS.API_ENDPOINT, 'https://api.openai.com/v1').replace(/\/+$/, '');
  const model = loadFromStorage(STORAGE_KEYS.API_MODEL, provider === 'gemini' ? 'gemini-2.0-flash' : 'gpt-4o-mini');

  const delays = [1000, 2000, 4000];

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      if (provider === 'gemini') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${customKey}`;
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
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
      } else {
        // OpenAI-Compatible Protocol (DeepSeek, OpenAI, Groq, Ollama, SiliconFlow, OneAPI)
        const url = `${endpoint}/chat/completions`;
        const messages = [];
        let sysMsg = systemInstruction || '';
        if (responseSchema) {
          sysMsg += (sysMsg ? '\n\n' : '') +
            '【输出格式规范】你必须且只能返回符合以下 JSON 结构的合法 JSON 字符串，请不要附加任何 markdown 格式以外的多余文字：\n' +
            JSON.stringify(responseSchema);
        }
        if (sysMsg) {
          messages.push({ role: 'system', content: sysMsg });
        }
        messages.push({ role: 'user', content: prompt });

        const body = {
          model,
          messages,
          temperature: 0.3
        };
        if (responseSchema) {
          body.response_format = { type: 'json_object' };
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${customKey}`
          },
          body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content || null;
        return content;
      }
    } catch (err) {
      if (attempt === delays.length) {
        console.error('callAI 请求最终失败:', err);
        return null;
      }
      await new Promise((r) => setTimeout(r, delays[attempt]));
    }
  }
  return null;
};

// 保持向下兼容
export const callGemini = callAI;

// --- Test API Connection Helper ---
export const testApiConnection = async ({ provider, endpoint, model, apiKey }) => {
  if (!apiKey) return { ok: false, error: '请输入 API Key' };
  try {
    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-2.0-flash'}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'ping' }] }] })
      });
      if (!res.ok) {
        const text = await res.text();
        return { ok: false, error: `HTTP ${res.status}: ${text.slice(0, 100)}` };
      }
      return { ok: true };
    } else {
      const cleanEndpoint = (endpoint || 'https://api.openai.com/v1').replace(/\/+$/, '');
      const url = `${cleanEndpoint}/chat/completions`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5
        })
      });
      if (!res.ok) {
        const text = await res.text();
        return { ok: false, error: `HTTP ${res.status}: ${text.slice(0, 100)}` };
      }
      return { ok: true };
    }
  } catch (err) {
    return { ok: false, error: err.message || '网络连接失败' };
  }
};
