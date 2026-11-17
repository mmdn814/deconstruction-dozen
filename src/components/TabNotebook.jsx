import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Square, Bookmark, Download, Upload, Trash2 } from 'lucide-react';
import { LANGUAGE_CONFIG, speakText } from '../lib/core.js';
import { PronunciationEvaluator } from './PronunciationEvaluator.jsx';

// --- TAB 5: Personal Golden Sentence Notebook (LocalStorage Persistence + Commute Loop Player) ---
export const TabNotebook = ({
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
      }, langConfig.speechLang);
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
                      onClick={() => speakText(item.en, 0.95, 1.0, null, langConfig.speechLang)}
                      className="p-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => speakText(item.en, 0.62, 1.0, null, langConfig.speechLang)}
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

