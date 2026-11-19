import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, ChevronDown, ChevronUp, ChevronsUpDown, Headphones, Mic, Pause } from 'lucide-react';
import { LANGUAGE_CONFIG, speakText } from '../lib/core.js';
import { sentencesByLang } from '../data/sentences.js';
import { MiniSentenceVisualizer, WordWithTooltip } from './SentenceVisualizer.jsx';
import { useContinuousPlayer } from '../hooks/useContinuousPlayer.js';
import { ContinuousPlayerBar } from './ContinuousPlayerBar.jsx';

// --- TAB 2: 12 Sentences Deconstruction (2-Column Grid with Expandable Trap & Workplace) ---
export const TabDeconstruction = ({ targetLang, isSentenceSaved, onToggleSaveSentence }) => {
  const sentences = sentencesByLang[targetLang] || sentencesByLang.en;
  const langConfig = LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en;
  const [expandedMap, setExpandedMap] = useState({});
  const [allExpanded, setAllExpanded] = useState(true);

  const player = useContinuousPlayer();

  const playlist = useMemo(() => {
    return sentences.map((s) => {
      const fullText = targetLang === 'ja' ? s.en.join('') : s.en.join(' ');
      return {
        id: s.id,
        text: fullText,
        cn: s.cn,
        audioUrl: `/audio/core/${targetLang}/core_${s.id}.mp3`,
        speechLang: langConfig.speechLang,
        title: `核心句 #${s.id} · ${s.cn}`
      };
    });
  }, [sentences, targetLang, langConfig.speechLang]);

  useEffect(() => {
    if (player.isPlaying && player.currentItem) {
      const el = document.getElementById(`sentence-${player.currentItem.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [player.currentItem, player.isPlaying]);

  useEffect(() => {
    player.stop();
  }, [targetLang]);

  const handleToggleAutoPlay = () => {
    if (player.isPlaying) {
      player.togglePlay();
      return;
    }
    player.start(playlist, 0);
  };

  const toggleExpand = (id) => {
    setExpandedMap((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? !allExpanded : !prev[id]
    }));
  };

  const toggleAll = () => {
    const next = !allExpanded;
    setAllExpanded(next);
    const updated = {};
    sentences.forEach((s) => {
      updated[s.id] = next;
    });
    setExpandedMap(updated);
  };

  return (
    <div className="space-y-3">
      {/* Top Controller Bar */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-[11px] font-bold text-slate-500 shrink-0 mr-1">快速跳转:</span>
          {sentences.map((s) => (
            <a
              key={s.id}
              href={`#sentence-${s.id}`}
              className="px-2 py-0.5 rounded-md bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-bold border border-slate-200 shrink-0 transition-colors shadow-2xs"
            >
              #{s.id}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto flex-wrap">
          {/* 两个直接连读按钮：磨耳朵 (1.2s) vs 跟读留白 (3.0s) */}
          <button
            type="button"
            onClick={() => player.startOrToggle(playlist, 0, 'listen')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shadow-2xs ${
              player.isPlaying && player.mode === 'listen'
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
            }`}
            title="自动顺序朗读 12 句：单句停顿 1.2 秒"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>
              {player.isPlaying && player.mode === 'listen'
                ? (player.isPaused ? '▶ 继续磨耳朵' : '⏸ 暂停磨耳朵')
                : '🎧 磨耳朵连读'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => player.startOrToggle(playlist, 0, 'shadow')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shadow-2xs ${
              player.isPlaying && player.mode === 'shadow'
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
            }`}
            title="自动顺序朗读 12 句：单句停顿 3.0 秒留足跟读时间"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>
              {player.isPlaying && player.mode === 'shadow'
                ? (player.isPaused ? '▶ 继续跟读' : '⏸ 暂停跟读')
                : '🗣️ 跟读留白连读'}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleAll}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1 transition-colors shadow-2xs"
          >
            <ChevronsUpDown className="w-3.5 h-3.5 text-blue-600" />
            <span>{allExpanded ? '收起所有解析' : '展开所有解析'}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Sentence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {sentences.map((item) => {
          const fullCoreSentence = targetLang === 'ja' ? item.en.join('') : item.en.join(' ');
          const workplaceWords = item.workplace.split(' ');
          const saved = isSentenceSaved(item.workplace);
          const isExpanded = expandedMap[item.id] !== undefined ? expandedMap[item.id] : allExpanded;
          const coreAudioUrl = `/audio/core/${targetLang}/core_${item.id}.mp3`;
          const workplaceAudioUrl = `/audio/core/${targetLang}/workplace_${item.id}.mp3`;
          const isCurrentActive = player.isPlaying && player.currentItem?.id === item.id;

          return (
            <div
              key={item.id}
              id={`sentence-${item.id}`}
              className={`rounded-xl border transition-all p-3.5 flex flex-col justify-between space-y-2.5 shadow-2xs ${
                isCurrentActive
                  ? 'bg-blue-50/20 border-blue-500 ring-2 ring-blue-400/90 shadow-md'
                  : 'bg-white border-slate-200/90 hover:border-blue-300'
              }`}
            >
              {/* Top Area: Number Badge + 3-Layer Colored Line Visualizer + Normal/Slow Audio */}
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-600 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {item.id}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10.5px] font-semibold text-slate-400 truncate">
                      悬停单词看释义 · 点击发音
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => speakText(fullCoreSentence, 0.95, 1.0, null, langConfig.speechLang, coreAudioUrl)}
                        className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                        title="常速整句朗读"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => speakText(fullCoreSentence, 0.62, 1.0, null, langConfig.speechLang, coreAudioUrl)}
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
                    targetLang={targetLang}
                  />
                </div>
              </div>

              {/* Bottom Area: Toggleable Trap & Workplace Example */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                  >
                    <span>{isExpanded ? '收起避坑与职场演进' : '查看避坑雷区与职场演进'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
                    <div className="flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/70 font-bold text-[10.5px] shrink-0 mt-0.5">
                        陷阱
                      </span>
                      <p className="text-slate-600 leading-relaxed text-[11.5px]">{item.trap}</p>
                    </div>

                    <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-200/60 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center flex-wrap gap-1 min-w-0">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/70 font-bold text-[10.5px] shrink-0 mr-1">
                            职场
                          </span>
                          <button
                            type="button"
                            onClick={() => speakText(item.workplace, 0.95, 1.0, null, langConfig.speechLang, workplaceAudioUrl)}
                            className="text-emerald-600 hover:text-emerald-700 p-0.5 shrink-0"
                            title="朗读职场例句"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          {workplaceWords.map((w, idx) => (
                            <WordWithTooltip key={idx} word={w} targetLang={targetLang} />
                          ))}
                          <button
                            type="button"
                            onClick={() => speakText(item.workplace, 0.62, 1.0, null, langConfig.speechLang, workplaceAudioUrl)}
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
                              cn: item.workplaceCn || `对应第 ${item.id} 句职场高频表达`,
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

                      {item.workplaceCn && (
                        <div className="text-xs text-slate-600 flex items-center gap-2 border-t border-slate-200/60 pt-1.5 mt-1">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded shrink-0">
                            释义
                          </span>
                          <span className="text-slate-700 font-medium">{item.workplaceCn}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部悬浮连续播放控制条 */}
      <ContinuousPlayerBar
        isPlaying={player.isPlaying}
        isPaused={player.isPaused}
        mode={player.mode}
        onToggleMode={player.toggleMode}
        title={player.currentItem?.title || '12 句核心拆解'}
        progressText={`${player.currentIndex + 1} / ${playlist.length}`}
        currentText={player.currentItem?.text}
        currentCn={player.currentItem?.cn}
        onPrev={player.prev}
        onTogglePlay={player.togglePlay}
        onNext={player.next}
        onStop={player.stop}
      />
    </div>
  );
};
