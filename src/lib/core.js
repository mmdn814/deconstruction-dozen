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

// --- Standard IPA Pure Phoneme Audio Map (Using Wikimedia Transcoded MP3 Streams for 100% Cross-Platform Audio) ---
export const IPA_AUDIO_URLS = {
  // English 12 Monophthongs (单元音)
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

  // English 16 Paired Consonants (清浊成对辅音 - 纯正母语录音)
  '/p/ 清': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/5/51/Voiceless_bilabial_plosive.ogg/Voiceless_bilabial_plosive.ogg.mp3',
  '/b/ 浊': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/2/2c/Voiced_bilabial_plosive.ogg/Voiced_bilabial_plosive.ogg.mp3',
  '/t/ 清': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/0/02/Voiceless_alveolar_plosive.ogg/Voiceless_alveolar_plosive.ogg.mp3',
  '/d/ 浊': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/0/01/Voiced_alveolar_plosive.ogg/Voiced_alveolar_plosive.ogg.mp3',
  '/k/ 清': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/e/e3/Voiceless_velar_plosive.ogg/Voiceless_velar_plosive.ogg.mp3',
  '/ɡ/ 浊': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/1/12/Voiced_velar_plosive.ogg/Voiced_velar_plosive.ogg.mp3',
  '/f/ 清': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/3/33/Voiceless_labiodental_fricative.ogg/Voiceless_labiodental_fricative.ogg.mp3',
  '/v/ 浊': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/85/Voiced_labiodental_fricative.ogg/Voiced_labiodental_fricative.ogg.mp3',
  '/θ/ 清': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/80/Voiceless_dental_fricative.ogg/Voiceless_dental_fricative.ogg.mp3',
  '/ð/ 浊': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/6/6a/Voiced_dental_fricative.ogg/Voiced_dental_fricative.ogg.mp3',
  '/s/ 清': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/a/ac/Voiceless_alveolar_sibilant.ogg/Voiceless_alveolar_sibilant.ogg.mp3',
  '/z/ 浊': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Voiced_alveolar_sibilant.ogg/Voiced_alveolar_sibilant.ogg.mp3',
  '/ʃ/ 清': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/cc/Voiceless_postalveolar_fricative.ogg/Voiceless_postalveolar_fricative.ogg.mp3',
  '/ʒ/ 浊': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/3/30/Voiced_postalveolar_fricative.ogg/Voiced_postalveolar_fricative.ogg.mp3',
  '/tʃ/ 清': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/a/a9/Voiceless_palato-alveolar_affricate.ogg/Voiceless_palato-alveolar_affricate.ogg.mp3',
  '/dʒ/ 浊': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/0/07/Voiced_palato-alveolar_affricate.ogg/Voiced_palato-alveolar_affricate.ogg.mp3',

  // English 8 Nasals, Lateral & Approximants (鼻音、舌侧音与半元音)
  '/m/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/5/51/Bilabial_nasal.ogg/Bilabial_nasal.ogg.mp3',
  '/n/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/2/29/Alveolar_nasal.ogg/Alveolar_nasal.ogg.mp3',
  '/ŋ/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/3/39/Velar_nasal.ogg/Velar_nasal.ogg.mp3',
  '/h/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/d/da/Voiceless_glottal_fricative.ogg/Voiceless_glottal_fricative.ogg.mp3',
  '/l/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/b/bc/Alveolar_lateral_approximant.ogg/Alveolar_lateral_approximant.ogg.mp3',
  '/r/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/1/1f/Alveolar_approximant.ogg/Alveolar_approximant.ogg.mp3',
  '/w/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f2/Voiced_labio-velar_approximant.ogg/Voiced_labio-velar_approximant.ogg.mp3',
  '/j/': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/e/e8/Palatal_approximant.ogg/Palatal_approximant.ogg.mp3',

  // Spanish Pure Vowels & Trills (西班牙语 5 大元音与大舌颤音)
  'A a': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/5/50/Open_central_unrounded_vowel.ogg/Open_central_unrounded_vowel.ogg.mp3',
  'E e': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/6/6c/Close-mid_front_unrounded_vowel.ogg/Close-mid_front_unrounded_vowel.ogg.mp3',
  'I i': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/9/91/Close_front_unrounded_vowel.ogg/Close_front_unrounded_vowel.ogg.mp3',
  'O o': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/84/Close-mid_back_rounded_vowel.ogg/Close-mid_back_rounded_vowel.ogg.mp3',
  'U u': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/5/5d/Close_back_rounded_vowel.ogg/Close_back_rounded_vowel.ogg.mp3',
  'RR rr': 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/ce/Alveolar_trill.ogg/Alveolar_trill.ogg.mp3'
};

let activeIpaAudio = null;

// --- Play Pure IPA Phoneme Sound (1. Direct High-Fidelity Audio -> 2. Native Speech Synthesis) ---
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

    // 1. Play official IPA audio recording if available
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

    // 2. Fallback to clean TTS pronunciation
    speakText(fallbackSoundText, 0.85);
  } catch {
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
