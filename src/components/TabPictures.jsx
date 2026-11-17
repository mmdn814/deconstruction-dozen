import React, { useState, useEffect } from 'react';
import { Volume2, Mic, Eye, EyeOff } from 'lucide-react';
import { LANGUAGE_CONFIG, speakText } from '../lib/core.js';
import { PICTURE_STAGES, SceneArt } from '../data/pictures.jsx';
import { PronunciationEvaluator } from './PronunciationEvaluator.jsx';

const PHASE_STYLE = {
  将要: 'bg-sky-100 text-sky-700 border-sky-200',
  正在: 'bg-amber-100 text-amber-700 border-amber-200',
  完成: 'bg-emerald-100 text-emerald-700 border-emerald-200'
};

export const TabPictures = ({ targetLang, getReadCount, onIncrementReadCount }) => {
  const [stageIdx, setStageIdx] = useState(0);
  const [shownCn, setShownCn] = useState({});
  const [practiceKey, setPracticeKey] = useState(null);

  const langConfig = LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en;
  const stage = PICTURE_STAGES[stageIdx];

  useEffect(() => {
    setPracticeKey(null);
    setShownCn({});
  }, [targetLang, stageIdx]);

  return (
    <div className="space-y-3.5">
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border border-amber-200/80 rounded-xl p-3 space-y-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white text-[10.5px] font-extrabold">
            STEP 3 · 看图小人短句
          </span>
          <h2 className="text-sm font-black text-slate-900">
            {langConfig.flag} {langConfig.name} · 看图直接懂，不靠翻译
          </h2>
        </div>
        <p className="text-[11px] text-slate-600">
          先看图猜意思，再听、再跟读。中文默认藏起来，实在猜不出再点「看中文」。
        </p>
        <div className="flex items-center gap-1.5 bg-white/90 p-1 rounded-xl border border-amber-200/80 overflow-x-auto scrollbar-none max-w-full">
          {PICTURE_STAGES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStageIdx(i)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap shrink-0 ${
                i === stageIdx ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {s.title} ({s.scenes.length})
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-600 px-1">{stage.hint}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {stage.scenes.map((scene, i) => {
          const line = scene[targetLang] || scene.en;
          const key = `${stage.id}-${i}`;
          const cnShown = !!shownCn[key];
          const practicing = practiceKey === key;
          return (
            <div key={key} className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-2 shadow-2xs">
              <div className="relative">
                <SceneArt name={scene.art} />
                {scene.phase && (
                  <span
                    className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md border text-[10.5px] font-extrabold ${PHASE_STYLE[scene.phase]}`}
                  >
                    {scene.phase}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => speakText(line.say, 0.9)}
                className="block w-full text-left"
              >
                <div className="text-base font-black text-slate-900 leading-snug">{line.text}</div>
                {line.roma && <div className="text-[11px] text-slate-500 font-mono mt-0.5">{line.roma}</div>}
              </button>

              <div className="text-xs min-h-[1.25rem] text-slate-600">{cnShown ? scene.cn : ''}</div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => speakText(line.say, 0.9)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>常速</span>
                </button>
                <button
                  type="button"
                  onClick={() => speakText(line.say, 0.55)}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold"
                >
                  🐢 慢速
                </button>
                <button
                  type="button"
                  onClick={() => setPracticeKey(practicing ? null : key)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold ${
                    practicing
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>跟读</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShownCn((prev) => ({ ...prev, [key]: !prev[key] }))}
                  className="ml-auto flex items-center gap-1 px-2 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 text-xs font-bold"
                >
                  {cnShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{cnShown ? '藏中文' : '看中文'}</span>
                </button>
              </div>

              {practicing && (
                <PronunciationEvaluator
                  targetSentence={line.say}
                  targetLang={targetLang}
                  readCount={getReadCount(line.say)}
                  onIncrementCount={onIncrementReadCount}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
