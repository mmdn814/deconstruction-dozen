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
  '/ər/': 'ɜː_isolation.mp3',
  '/er/': 'ɜː_isolation.mp3',
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

// --- Play Pure IPA Phoneme Sound (Priority 1: Local Oxford Isolated Recording -> Priority 2: Studio Audio) ---
export const playPurePhoneme = (charKey, fallbackSoundText, lang = 'en-US', onEnd = null, fast = false) => {
  if (typeof window === 'undefined') {
    if (onEnd) onEnd();
    return;
  }
  try {
    stopAllAudio();

    const raw = String(charKey || '').trim();
    // 兼容 '/p/ 清'、'/p/'、'p' 等各种传入格式
    const cleanKey = raw.replace(/\s*[\(（].*$/, '').replace(/\s*(清|浊).*$/, '').trim();
    const slashKey = `/${cleanKey.replace(/^\/+|\/+$/g, '')}/`;
    const audioFile = IPA_AUDIO_MAP[raw] || IPA_AUDIO_MAP[cleanKey] || IPA_AUDIO_MAP[slashKey];

    if (audioFile) {
      const audioUrl = getIpaAudioUrl(audioFile);
      const audio = new Audio(audioUrl);
      currentActiveAudio = audio;

      if (fast) {
        audio.playbackRate = 1.35; // 拼读连读模式：适度加速，去除 Oxford 音频文件尾部的冗余死寂空白
      }

      let finished = false;
      const finish = () => {
        if (!finished) {
          finished = true;
          if (currentActiveAudio === audio) currentActiveAudio = null;
          if (onEnd) onEnd();
        }
      };

      // 拼读模式下最大播放上限 380ms，保证音素如齿轮般紧凑衔接，杜绝拖泥带水
      let maxTimer = null;
      if (fast) {
        maxTimer = setTimeout(finish, 380);
      }

      audio.onended = () => {
        if (maxTimer) clearTimeout(maxTimer);
        finish();
      };
      audio.onerror = () => {
        if (maxTimer) clearTimeout(maxTimer);
        finish();
      };

      const playPromise = audio.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(() => {
          if (maxTimer) clearTimeout(maxTimer);
          speakText(fallbackSoundText, fast ? 1.1 : 1.0, 1.0, onEnd, lang);
        });
      }
      return;
    }

    speakText(fallbackSoundText, fast ? 1.1 : 1.0, 1.0, onEnd, lang);
  } catch {
    speakText(fallbackSoundText, fast ? 1.1 : 1.0, 1.0, onEnd, lang);
  }
};

// --- Global Active Audio Player Reference (Prevents Audio Overlap) ---
let currentActiveAudio = null;
let activeUtterance = null; // 防垃圾回收关键引用

export const stopAllAudio = () => {
  if (typeof window === 'undefined') return;
  if (currentActiveAudio) {
    currentActiveAudio.pause();
    currentActiveAudio.currentTime = 0;
    currentActiveAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  activeUtterance = null;
  if (typeof window !== 'undefined') window._dd_active_utterance = null;
};

// --- Web Speech TTS Voice Cache & Multilingual Voice Detection (Offline Backup) ---
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

// 智能语言检测：确保日语句子永不被英文发音人静音，西语句子永不被乱读
export const detectLang = (text, fallbackLang = 'en-US') => {
  const str = String(text || '');
  // 日语假名或中日标点
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(str)) {
    return 'ja-JP';
  }
  // 西班牙特色重音与标点符号
  if (/[áéíóúÁÉÍÓÚñÑ¿¡]/.test(str)) {
    return 'es-ES';
  }
  if (fallbackLang && fallbackLang.toLowerCase().startsWith('ja')) return 'ja-JP';
  if (fallbackLang && fallbackLang.toLowerCase().startsWith('es')) return 'es-ES';
  return fallbackLang || 'en-US';
};

export const getBestVoiceForLang = (langCode) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices() || cachedVoices;
  if (voices.length) cachedVoices = voices;
  if (!cachedVoices.length) return null;

  const target = (langCode || currentSpeechLang || 'en-US').toLowerCase();
  const short = target.split('-')[0];

  // 匹配对应语言大类的所有发音人 (es, ja, en)
  const matches = cachedVoices.filter((v) => {
    const vLang = (v.lang || '').toLowerCase().replace('_', '-');
    return vLang.startsWith(short);
  });
  if (!matches.length) return null;

  // 西班牙语：优先选择发音清晰纯正、通用/美洲标准发音（无含糊或强烈 Ceceo 咬舌），支持 Paulina / Google / Mónica / Helena / Jorge
  if (short === 'es') {
    const preferred =
      matches.find((v) => /paulina/i.test(v.name)) ||
      matches.find((v) => /google.*es/i.test(v.name)) ||
      matches.find((v) => /mónica|monica/i.test(v.name)) ||
      matches.find((v) => /helena|sabina|laura|jorge/i.test(v.name));
    if (preferred) return preferred;
  }

  // 日语：优先选择 Kyoko, Google 日本語, Otoya
  if (short === 'ja') {
    const preferred =
      matches.find((v) => /kyoko/i.test(v.name)) ||
      matches.find((v) => /google.*ja/i.test(v.name)) ||
      matches.find((v) => /otoya|ayumi|haruka|ichiro/i.test(v.name));
    if (preferred) return preferred;
  }

  // 英语：优先选择 Samantha, Google US English, Alex, Victoria, David
  if (short === 'en') {
    const preferred =
      matches.find((v) => /samantha/i.test(v.name)) ||
      matches.find((v) => /google.*en/i.test(v.name)) ||
      matches.find((v) => /alex|victoria|david|jenny/i.test(v.name));
    if (preferred) return preferred;
  }

  // 默认返回带 natural / premium 的，或第一个匹配发音人
  return matches.find((v) => /natural|premium|enhanced/i.test(v.name)) || matches[0];
};

// 本地离线合成核心（彻底解决 Chrome/Safari 连续 cancel() 导致的死锁静音与 GC 回收 bug）
const speakViaLocalSpeechSynthesis = (cleanText, rate = 0.95, pitch = 1.0, onEndCallback = null, langCode = null) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEndCallback) onEndCallback();
    return;
  }

  const targetLangCode = detectLang(cleanText, langCode || currentSpeechLang);
  const bestVoice = getBestVoiceForLang(targetLangCode);

  const doSpeak = () => {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      activeUtterance = utterance;
      if (typeof window !== 'undefined') window._dd_active_utterance = utterance;

      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      } else {
        utterance.lang = targetLangCode;
      }

      utterance.rate = Math.max(0.4, Math.min(rate, 1.5));
      utterance.pitch = Math.max(0.5, Math.min(pitch, 1.5));

      let done = false;
      const finish = () => {
        if (!done) {
          done = true;
          activeUtterance = null;
          if (typeof window !== 'undefined' && window._dd_active_utterance === utterance) {
            window._dd_active_utterance = null;
          }
          if (onEndCallback) onEndCallback();
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEndCallback) onEndCallback();
    }
  };

  // Chromium 关键修复：如果当前正在播放，cancel 之后必须给浏览器音频管线 25ms 恢复时间，杜绝静音吃字
  if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
    window.speechSynthesis.cancel();
    setTimeout(doSpeak, 25);
  } else {
    doSpeak();
  }
};

// --- Instant 0-Latency High-Fidelity Speech Engine ---
export const speakText = (text, rate = 1.0, pitch = 1.0, onEndCallback = null, langCode = null, audioUrl = null) => {
  if (typeof window === 'undefined') {
    if (onEndCallback) onEndCallback();
    return;
  }

  // 停止正在播放的 HTML5 独立音频
  if (currentActiveAudio) {
    try {
      currentActiveAudio.pause();
      currentActiveAudio.currentTime = 0;
    } catch (e) {}
    currentActiveAudio = null;
  }

  let cleanText = String(text || '').replace(/\(.*?\)|（.*?）/g, '').trim();
  if (!cleanText && !audioUrl) {
    if (onEndCallback) onEndCallback();
    return;
  }

  const targetLang = detectLang(cleanText, langCode || currentSpeechLang);

  // 日语连贯朗读优化：剔除假名之间因展示需要添加的空格，还原原生流畅语流
  if (targetLang === 'ja-JP' && cleanText) {
    cleanText = cleanText.replace(/([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF])\s+([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF])/g, '$1$2');
  }

  // 西班牙语标准语速微调
  let finalRate = rate;
  if (targetLang === 'es-ES' && rate === 1.0) {
    finalRate = 0.92;
  }

  // 若传入预生成的高清神经网络主播音频，优先使用 HTML5 Audio 极速原声秒播（真实主播原声，iOS 兼容最佳）
  if (audioUrl) {
    const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || './';
    const normalizedUrl = audioUrl.startsWith('http') || audioUrl.startsWith('/')
      ? audioUrl
      : `${base.replace(/\/+$/, '')}/${audioUrl.replace(/^\/+/, '')}`;

    const audio = new Audio(normalizedUrl);
    currentActiveAudio = audio;

    if (rate && rate !== 1.0) {
      audio.playbackRate = Math.max(0.4, Math.min(rate, 2.0));
    }

    let hasFallback = false;
    const fallbackToTTS = () => {
      if (hasFallback) return;
      hasFallback = true;
      if (currentActiveAudio === audio) currentActiveAudio = null;
      speakViaLocalSpeechSynthesis(cleanText, finalRate, pitch, onEndCallback, targetLang);
    };

    audio.onended = () => {
      if (currentActiveAudio === audio) currentActiveAudio = null;
      if (onEndCallback) onEndCallback();
    };

    audio.onerror = () => {
      fallbackToTTS();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        fallbackToTTS();
      });
    }
    return;
  }

  // 毫秒级极速直出 (0ms 延迟，直接调用设备原生绑定的母语发音人，杜绝任何外部网络卡顿)
  speakViaLocalSpeechSynthesis(cleanText, finalRate, pitch, onEndCallback, targetLang);
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
