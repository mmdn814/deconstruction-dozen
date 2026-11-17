import React, { useState } from 'react';
import { Volume2, ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { LANGUAGE_CONFIG, speakText } from '../lib/core.js';
import { sentencesByLang } from '../data/sentences.js';
import { MiniSentenceVisualizer, WordWithTooltip } from './SentenceVisualizer.jsx';

// --- TAB 2: 12 Sentences Deconstruction (2-Column Grid with Expandable Trap & Workplace) ---
export const TabDeconstruction = ({ targetLang, isSentenceSaved, onToggleSaveSentence }) => {
  const sentences = sentencesByLang[targetLang] || sentencesByLang.en;
  const langConfig = LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en;
  const [expandedMap, setExpandedMap] = useState({});
  const [allExpanded, setAllExpanded] = useState(true);

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

        <button
          type="button"
          onClick={toggleAll}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1 shrink-0 self-end sm:self-auto transition-colors shadow-2xs"
        >
          <ChevronsUpDown className="w-3.5 h-3.5 text-blue-600" />
          <span>{allExpanded ? '收起所有解析' : '展开所有解析'}</span>
        </button>
      </div>

      {/* 2-Column Sentence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {sentences.map((item) => {
          const fullCoreSentence = targetLang === 'ja' ? item.en.join('') : item.en.join(' ');
          const workplaceWords = item.workplace.split(' ');
          const saved = isSentenceSaved(item.workplace);
          const isExpanded = expandedMap[item.id] !== undefined ? expandedMap[item.id] : allExpanded;

          return (
            <div
              key={item.id}
              id={`sentence-${item.id}`}
              className="bg-white rounded-xl border border-slate-200/90 hover:border-blue-300 transition-all p-3.5 flex flex-col justify-between space-y-2.5 shadow-2xs"
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
                        onClick={() => speakText(fullCoreSentence, 0.95, 1.0, null, langConfig.speechLang)}
                        className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                        title="常速整句朗读"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => speakText(fullCoreSentence, 0.62, 1.0, null, langConfig.speechLang)}
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
                            onClick={() => speakText(item.workplace, 0.95, 1.0, null, langConfig.speechLang)}
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
                            onClick={() => speakText(item.workplace, 0.62, 1.0, null, langConfig.speechLang)}
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
                        <div className="text-[11.5px] text-slate-600 pl-6 flex items-baseline gap-1.5 border-t border-slate-200/50 pt-1">
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-200/70 px-1 py-0.2 rounded shrink-0">译</span>
                          <span className="text-slate-600">{item.workplaceCn}</span>
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
    </div>
  );
};
