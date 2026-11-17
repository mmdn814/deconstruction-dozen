import React, { useState, useEffect, useMemo } from 'react';
import { Check, ChevronLeft, ChevronRight, Loader2, Sparkles, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { LANGUAGE_CONFIG, speakText, playPurePhoneme, stopAllAudio, callGemini, loadFromStorage, saveToStorage, STORAGE_KEYS } from '../lib/core.js';
import { zeroToOneDataByLang } from '../data/zeroToOne.js';
import { WORD_THEMES, CORE_THEME_ID, parseWordFile } from '../data/wordThemes.js';
import { splitMora, moraSpeakUnits } from '../lib/kana.js';
import { splitIpa, splitEsSyllables } from '../lib/spell.js';
import wordIndex from '../data/words/index.json';

// 每个主题舱是一个独立的小文件，点开才加载，首页不受 3000 词拖累
const wordFiles = import.meta.glob('../data/words/*/*.txt', { query: '?raw', import: 'default' });

// 英语音标 → 「发音与辨音」里的单音发音
const EN_SOUNDS = Object.fromEntries(
  (zeroToOneDataByLang.en.phoneticCategories || []).flatMap((c) => c.items.map((it) => [it.char.split(' ')[0], it.sound]))
);

const READ_KEY = 'dd_words_read_v1';
const EXTRA_KEY = 'dd_words_extra_v1';
const PAGE_SIZE = 12;

const wordId = (item) => (item.r && item.r !== item.w ? `${item.w}|${item.r}` : item.w);
const cleanWord = (w) => String(w || '').split('(')[0].split('（')[0].trim();

export const TabWords = ({ targetLang }) => {
  const langConfig = LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en;
  const counts = wordIndex[targetLang] || {};
  const builtInTotal = Object.values(counts).reduce((a, b) => a + b, 0);

  const [themeId, setThemeId] = useState(CORE_THEME_ID);
  const [showAllThemes, setShowAllThemes] = useState(false);
  const [page, setPage] = useState(0);
  const [loaded, setLoaded] = useState({}); // `${lang}/${theme}` -> words
  const [readMap, setReadMap] = useState(() => loadFromStorage(READ_KEY, {}));
  const [extraMap, setExtraMap] = useState(() => loadFromStorage(EXTRA_KEY, {}));
  const [aiState, setAiState] = useState({ loading: false, error: '' });

  useEffect(() => saveToStorage(READ_KEY, readMap), [readMap]);
  useEffect(() => saveToStorage(EXTRA_KEY, extraMap), [extraMap]);

  useEffect(() => {
    setThemeId(CORE_THEME_ID);
    setPage(0);
  }, [targetLang]);

  useEffect(() => {
    setPage(0);
    setAiState({ loading: false, error: '' });
    if (themeId === CORE_THEME_ID) return;
    const key = `${targetLang}/${themeId}`;
    const loader = wordFiles[`../data/words/${targetLang}/${themeId}.txt`];
    if (!loader || loaded[key]) return;
    let alive = true;
    loader().then((raw) => {
      if (alive) setLoaded((prev) => ({ ...prev, [key]: parseWordFile(raw) }));
    });
    return () => {
      alive = false;
    };
  }, [targetLang, themeId]);

  const coreWords = useMemo(() => {
    const lego = (zeroToOneDataByLang[targetLang] || zeroToOneDataByLang.en).legoWords || {};
    return [...(lego.verbs || []), ...(lego.nouns || []), ...(lego.modifiers || [])].map((x) => ({
      w: x.w,
      r: x.pron,
      cn: x.cn
    }));
  }, [targetLang]);

  const readOfLang = readMap[targetLang] || {};
  const extras = (extraMap[targetLang] || {})[themeId] || [];
  const isCore = themeId === CORE_THEME_ID;
  const hasFile = !!wordFiles[`../data/words/${targetLang}/${themeId}.txt`];
  const builtIn = isCore ? coreWords : loaded[`${targetLang}/${themeId}`];
  const loadingTheme = !isCore && hasFile && !builtIn;
  const words = [...(builtIn || []), ...extras];
  const pageCount = Math.max(1, Math.ceil(words.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageWords = words.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const totalRead = Object.keys(readOfLang).length;
  const themeRead = words.filter((x) => readOfLang[wordId(x)]).length;
  const theme = WORD_THEMES.find((t) => t.id === themeId);

  const markRead = (item) => {
    if (!readOfLang[wordId(item)]) {
      setReadMap((prev) => ({ ...prev, [targetLang]: { ...(prev[targetLang] || {}), [wordId(item)]: 1 } }));
    }
  };

  const themeName = (t) => (targetLang !== 'ja' && t.alt) || t.name;

  const handleCard = (item) => {
    speakText(cleanWord(item.w), 0.85, 1.0, null, langConfig.speechLang);
    markRead(item);
  };

  // 拼读过程：日语拆成一拍一拍，英语拆成一个个音素，西语拆成音节。
  // 每个单位：k 显示的字，r 下面的小字，note 不能单独发音的说明，hot 重读，step 逐个朗读时怎么读
  const unitsOf = (item) => {
    if (targetLang === 'ja') {
      const fromReading = splitMora(item.r);
      const mora = fromReading.length ? fromReading : splitMora(cleanWord(item.w));
      const steps = moraSpeakUnits(mora);
      let si = 0;
      return mora.map((m) => {
        const step = m.note === '拉长' ? null : steps[si++] || null;
        return { k: m.k, r: m.note || m.r, note: m.note, step };
      });
    }
    if (targetLang === 'en') {
      return splitIpa(item.r).map((u) => {
        if (u.gap) return u;
        const normalizedKey = u.k === 'oʊ' ? 'əʊ' : u.k === 'g' ? 'ɡ' : u.k;
        const key = `/${normalizedKey}/`;
        const soundTip = EN_SOUNDS[key] || EN_SOUNDS[`/${u.k}/`] || u.k;
        return {
          ...u,
          r: soundTip !== u.k ? soundTip : '',
          step: { phoneme: [key, soundTip] }
        };
      });
    }
    if (targetLang === 'es') {
      return splitEsSyllables(cleanWord(item.w)).map((u) => (u.gap ? u : { ...u, step: { text: u.k } }));
    }
    return [];
  };

  const playStep = (step, onEnd) => {
    if (!step) return onEnd && onEnd();
    if (step.pause) return setTimeout(() => onEnd && onEnd(), 280);
    if (step.phoneme) {
      playPurePhoneme(step.phoneme[0], step.phoneme[1], langConfig.speechLang, () => {
        setTimeout(() => onEnd && onEnd(), 100);
      });
      return;
    }
    return speakText(step.text, 0.78, 1.0, () => {
      setTimeout(() => onEnd && onEnd(), 120);
    }, langConfig.speechLang);
  };

  // 拼读：一个单位一个单位慢慢读，最后连起来读整个词
  const spellOut = (item, units) => {
    stopAllAudio();
    const steps = units.map((u) => u.step).filter(Boolean);
    let i = 0;
    const next = () => {
      if (i >= steps.length) {
        setTimeout(() => {
          speakText(cleanWord(item.w), 0.85, 1.0, null, langConfig.speechLang);
        }, 250);
        markRead(item);
        return;
      }
      const cur = steps[i];
      i += 1;
      playStep(cur, next);
    };
    next();
  };

  const unlockMore = async () => {
    if (!loadFromStorage(STORAGE_KEYS.API_KEY, '')) {
      setAiState({ loading: false, error: '需要先在右上角「API 设置」里填入 Gemini Key，才能用 AI 解锁更多词。' });
      return;
    }
    setAiState({ loading: true, error: '' });
    const known = words.map((x) => x.w).join('、');
    const topic = isCore ? '最核心的日常高频词' : themeName(theme);
    const readingHint =
      targetLang === 'ja' ? '平假名读音' : targetLang === 'en' ? '国际音标（带斜杠）' : '按音节划分并标出重音的读法';
    const prompt = `请给零基础中文学习者再列出 12 个${langConfig.name}高频实用词，主题是「${topic}」。不要与这些已有的词重复：${known}。每个词给出 w（${langConfig.name}原词）、r（${readingHint}）、cn（简短中文意思）。`;
    const schema = {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { w: { type: 'STRING' }, r: { type: 'STRING' }, cn: { type: 'STRING' } },
        required: ['w', 'r', 'cn']
      }
    };
    const res = await callGemini(prompt, `你是精通${langConfig.name}的词汇教学设计师。`, schema);
    let list = [];
    try {
      list = JSON.parse(res || '[]');
    } catch {
      list = [];
    }
    const have = new Set(words.map((x) => x.w));
    const fresh = (Array.isArray(list) ? list : []).filter((x) => x && x.w && !have.has(x.w)).slice(0, 12);
    if (!fresh.length) {
      setAiState({ loading: false, error: 'AI 没有返回新词，请检查 API Key 或稍后再试。' });
      return;
    }
    setExtraMap((prev) => {
      const ofLang = prev[targetLang] || {};
      return { ...prev, [targetLang]: { ...ofLang, [themeId]: [...(ofLang[themeId] || []), ...fresh] } };
    });
    setAiState({ loading: false, error: '' });
    setPage(Math.floor(words.length / PAGE_SIZE));
  };

  const themeChip = (id, label, count) => {
    const active = themeId === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => setThemeId(id)}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all text-left ${
          active
            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
            : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
        }`}
      >
        {label}
        <span className={`ml-1 font-mono text-[10.5px] ${active ? 'text-emerald-100' : 'text-slate-400'}`}>
          {count}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-3.5">
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200/80 rounded-xl p-3 space-y-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10.5px] font-extrabold">
            STEP 2 · 3000词拼读靶场
          </span>
          <h2 className="text-sm font-black text-slate-900">
            {langConfig.flag} {langConfig.name} · 只求读出声，不用背
          </h2>
          <span className="ml-auto text-xs font-bold text-slate-600">
            已拼读 <strong className="text-emerald-600">{totalRead}</strong>
            {builtInTotal > 0 && <> / {builtInTotal + coreWords.length}</>}
          </span>
        </div>
        <p className="text-[11px] text-slate-600">
          点卡片听整个词；下面一排小格是拼读过程，红色是重读，点「▶ 拼读」会一格一格读完再连起来。先过第 0 关的 36 个核心词砖，再按生活主题一舱一舱扫过去。
        </p>
        {builtInTotal === 0 && (
          <p className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
            {langConfig.name}的 3000 词库还在制作中，目前可以练第 0 关，其余主题可用 AI 解锁。
          </p>
        )}
      </div>

      {/* Theme Cabin Selector Header & Expandable Grid */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-2.5 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-900 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>当前主题舱:</span>
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
              {isCore ? '⭐ 第0关 核心词砖' : `${theme.emoji} ${themeName(theme)}`} ({words.length}词)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAllThemes((prev) => !prev)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <span>{showAllThemes ? '收起主题舱列表' : `切换主题舱 (${WORD_THEMES.length + 1}个)`}</span>
            {showAllThemes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showAllThemes && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 animate-in fade-in duration-150">
            {themeChip(CORE_THEME_ID, '⭐ 第0关 核心词砖', coreWords.length)}
            {WORD_THEMES.filter((t) => builtInTotal === 0 || counts[t.id]).map((t) =>
              themeChip(t.id, `${t.emoji} ${themeName(t)}`, counts[t.id] || 0)
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="text-sm font-black text-slate-900">
          {isCore ? '⭐ 第0关 核心词砖' : `${theme.emoji} ${themeName(theme)}`}
          <span className="ml-2 text-xs font-bold text-slate-500">
            本舱已拼读 {themeRead}/{words.length}
          </span>
        </div>
        {pageCount > 1 && (
          <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage(safePage - 1)}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
              aria-label="上一关"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              第 {safePage + 1} / {pageCount} 小关
            </span>
            <button
              type="button"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage(safePage + 1)}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
              aria-label="下一关"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {loadingTheme ? (
        <div className="flex items-center gap-2 text-sm text-slate-500 p-6 justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>正在打开这个主题舱…</span>
        </div>
      ) : words.length === 0 ? (
        <div className="text-sm text-slate-500 text-center p-6 border border-dashed border-slate-300 rounded-xl">
          这个主题舱还没有内置词，可以用下面的按钮让 AI 先生成一批。
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {pageWords.map((item) => {
            const done = !!readOfLang[wordId(item)];
            const mora = unitsOf(item);
            return (
              <div
                key={wordId(item)}
                className={`relative rounded-xl border p-2.5 transition-all ${
                  done ? 'bg-emerald-50/70 border-emerald-200' : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
              >
                <button type="button" onClick={() => handleCard(item)} className="block w-full text-left active:opacity-60">
                  {done && (
                    <span className="absolute top-1.5 right-1.5 flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-600">
                      <Check className="w-3 h-3" />
                      已拼读
                    </span>
                  )}
                  <div className="text-lg font-black text-slate-900 leading-tight pr-12 break-words">{item.w}</div>
                  {item.r && <div className="text-xs text-blue-700 font-semibold mt-0.5 break-words">{item.r}</div>}
                  <div className="text-xs text-slate-600 mt-0.5">{item.cn}</div>
                </button>
                {mora.length > 0 && (
                  <div className="flex flex-wrap items-stretch gap-0.5 mt-1.5 pt-1.5 border-t border-dashed border-slate-200">
                    {mora.map((m, mi) =>
                      m.gap ? (
                        <span key={mi} className="w-1.5" />
                      ) : (
                        <button
                          key={mi}
                          type="button"
                          disabled={!m.step || !!m.note}
                          onClick={() => playStep(m.step)}
                          className={`min-w-[1.5rem] px-1 rounded text-center leading-none py-0.5 ${
                            m.note
                              ? 'bg-amber-100 text-amber-800'
                              : m.hot
                                ? 'bg-rose-100 text-rose-700 active:bg-rose-200'
                                : 'bg-slate-100 text-slate-800 active:bg-blue-200'
                          }`}
                        >
                          <span className="block text-[13px] font-black">{m.k}</span>
                          {m.r && <span className="block text-[9.5px] font-mono mt-0.5">{m.r}</span>}
                        </button>
                      )
                    )}
                    <button
                      type="button"
                      onClick={() => spellOut(item, mora)}
                      className="ml-auto self-center px-1.5 py-1 rounded-md bg-blue-600 text-white text-[10.5px] font-extrabold active:bg-blue-800"
                    >
                      ▶ 拼读
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-col items-center gap-1.5 pt-1">
        <button
          type="button"
          onClick={unlockMore}
          disabled={aiState.loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-xs font-extrabold"
        >
          {aiState.loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>AI 解锁本主题更多词 (+12)</span>
        </button>
        {extras.length > 0 && <span className="text-[11px] text-slate-500">本舱已用 AI 加了 {extras.length} 个词，保存在本机</span>}
        {aiState.error && <span className="text-[11px] font-bold text-rose-600 text-center">{aiState.error}</span>}
      </div>
    </div>
  );
};
