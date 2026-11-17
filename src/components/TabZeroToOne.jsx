import React, { useState, useEffect } from 'react';
import { Volume2, Mic, Play } from 'lucide-react';
import { LANGUAGE_CONFIG, playPurePhoneme, speakText } from '../lib/core.js';
import { zeroToOneDataByLang } from '../data/zeroToOne.js';
import { PronunciationEvaluator } from './PronunciationEvaluator.jsx';

// --- TAB 1: Comprehensive Sound & Ear Training Hub (Decoder + Minimal Pairs + Sound Clusters) ---
export const TabZeroToOne = ({
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
        <div className="flex items-center gap-1.5 bg-white/90 p-1 rounded-xl border border-blue-200/80 shrink-0 overflow-x-auto scrollbar-none max-w-full">
          {[
            { id: 'decoder', label: '① 全景发音表与密码' },
            { id: 'pairs', label: `② 易混相似音对决 (${data.minimalPairs.length}组)` },
            { id: 'clusters', label: `③ 同音词族串串烧 (${data.soundClusters.length}族)` }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubStage(tab.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap shrink-0 ${
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
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs shrink-0 overflow-x-auto scrollbar-none max-w-full">
                  {phoneticCategories.map((cat, idx) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActivePhoneticCatIdx(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
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

