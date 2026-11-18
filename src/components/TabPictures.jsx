import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Mic,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
  Star,
  FileText,
  X
} from 'lucide-react';
import { LANGUAGE_CONFIG, speakText } from '../lib/core.js';
import { PICTURE_STAGES, SceneArt } from '../data/pictures.jsx';
import { RICHARDS_BOOK1_PAGES } from '../data/richardsBook1Data.js';
import { PronunciationEvaluator } from './PronunciationEvaluator.jsx';

const PHASE_STYLE = {
  将要: 'bg-sky-100 text-sky-700 border-sky-200',
  正在: 'bg-amber-100 text-amber-700 border-amber-200',
  完成: 'bg-emerald-100 text-emerald-700 border-emerald-200'
};

const CHAPTER_JUMPS = [
  { page: 1, label: '第 1 课 · 人称代词 (I / You)' },
  { page: 4, label: '第 4 课 · 空间方位 (Here / There)' },
  { page: 8, label: '第 8 课 · 指示代词 (This / That)' },
  { page: 10, label: '第 10 课 · 帽子、桌子与双手' },
  { page: 14, label: '第 14 课 · 时态演进 (Put on / Take off)' },
  { page: 18, label: '第 18 课 · 互动互赠 (Give to him / her)' },
  { page: 22, label: '第 22 课 · 四肢五官与家具 (Arms / Legs / Feet)' },
  { page: 27, label: '第 27 课 · 经典问答 (Questions & Answers)' },
  { page: 35, label: '第 35 课 · 时钟与时间 (What time is it?)' },
  { page: 40, label: '第 40 课 · 面部五官 (Eyes / Nose / Mouth)' },
  { page: 48, label: '第 48 课 · 相对介词 (Between / Over / Under)' },
  { page: 56, label: '第 56 课 · 水、杯子、瓶子与船' },
  { page: 65, label: '第 65 课 · 走动走向与房间 (Door / Window)' },
  { page: 75, label: '第 75 课 · 钱币、风与旅行 (Travel / Train)' },
  { page: 85, label: '第 85 课 · 餐桌与进餐 (Fork / Knife / Plate)' },
  { page: 95, label: '第 95 课 · 温度冷热与烹饪 (Warm / Cold / Soup)' },
  { page: 105, label: '第 105 课 · 生活百态与综合进阶' }
];

export const TabPictures = ({
  targetLang,
  getReadCount,
  onIncrementReadCount,
  isSentenceSaved,
  onToggleSaveSentence
}) => {
  // 浏览模式：'book' (原著逐页翻页点读) | 'stages' (13阶精选提炼)
  const [viewMode, setViewMode] = useState('book');

  // Book 翻页模式状态
  const [bookPage, setBookPage] = useState(1);
  const [shownCn, setShownCn] = useState({});
  const [practiceKey, setPracticeKey] = useState(null);
  const [showOriginalScan, setShowOriginalScan] = useState(false);

  // Stages 模式状态
  const [stageIdx, setStageIdx] = useState(0);

  const langConfig = LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en;
  const stage = PICTURE_STAGES[stageIdx];
  const currentPageData = RICHARDS_BOOK1_PAGES[bookPage - 1] || RICHARDS_BOOK1_PAGES[0];

  // 键盘左右箭头快速翻页支持
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (viewMode !== 'book') return;
      if (e.key === 'ArrowLeft') {
        setBookPage((prev) => Math.max(1, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setBookPage((prev) => Math.min(RICHARDS_BOOK1_PAGES.length, prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  // 切页或切模式时，重置跟读态与显隐态
  useEffect(() => {
    setPracticeKey(null);
    setShownCn({});
  }, [bookPage, viewMode, targetLang, stageIdx]);

  return (
    <div className="space-y-3.5">
      {/* 顶部标题与模式切换栏 */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border border-amber-200/80 rounded-2xl p-3 space-y-2 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white text-[10.5px] font-extrabold">
              STEP 3 · 看图小人短句
            </span>
            <h2 className="text-sm font-black text-slate-900">
              {langConfig.flag} {langConfig.name} · 看图直接懂，不靠翻译
            </h2>
          </div>

          {/* 模式选择 */}
          <div className="inline-flex items-center p-0.5 bg-white/90 rounded-xl border border-amber-200/80 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('book')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                viewMode === 'book'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>📖 原著 119 页逐页点读</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('stages')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                viewMode === 'stages'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>🎯 语法 13 阶精选</span>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-600">
          {viewMode === 'book'
            ? '内容完全保持原版手绘线稿与原著 119 页短句，一页 4 格。先看图猜意思，再听常速、慢速、跟读评测；中文默认隐藏，点击「看中文」随时查看。'
            : '精选提炼的 13 大认知语法阶段（61 个场景），自绘彩色矢量动图，快速建立核心语感。'}
        </p>

        {/* 翻页控制条 (仅在 Book 翻页模式展示) */}
        {viewMode === 'book' && (
          <div className="bg-white/95 border border-amber-200/80 rounded-xl p-2 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            {/* 上一页 / 页码 / 下一页 */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={bookPage <= 1}
                onClick={() => setBookPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 disabled:opacity-40 disabled:hover:bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold transition-all"
                title="快捷键: ←"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>上一页</span>
              </button>

              <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-black text-slate-800">
                <span>第 </span>
                <span className="text-amber-600 text-sm">{bookPage}</span>
                <span> / 119 课</span>
              </div>

              <button
                type="button"
                disabled={bookPage >= RICHARDS_BOOK1_PAGES.length}
                onClick={() => setBookPage((p) => Math.min(RICHARDS_BOOK1_PAGES.length, p + 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 disabled:opacity-40 disabled:hover:bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold transition-all"
                title="快捷键: →"
              >
                <span>下一页</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 课次章节选择下拉框 */}
            <div className="flex items-center gap-2">
              <select
                value={bookPage}
                onChange={(e) => setBookPage(Number(e.target.value))}
                className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                {CHAPTER_JUMPS.map((ch) => (
                  <option key={ch.page} value={ch.page}>
                    {ch.label}
                  </option>
                ))}
                <option disabled>──────── 全部 119 课 ────────</option>
                {RICHARDS_BOOK1_PAGES.map((p) => (
                  <option key={p.page} value={p.page}>
                    第 {p.page} 课 · {p.topic}
                  </option>
                ))}
              </select>

              {/* 查看原书完整单页 */}
              <button
                type="button"
                onClick={() => setShowOriginalScan(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold transition-colors"
                title="查看本课原版印刷整页"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>原版整页</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= 模式一：📖 原著逐页卡片点读 (功能和原来一致) ================= */}
      {viewMode === 'book' && (
        <div className="space-y-3">
          {/* 本课主题微提示 */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700">
              第 {bookPage} 课 · {currentPageData.topic}
            </span>
            <span className="text-[11px] text-slate-400">支持按键盘 ← → 左右箭头翻页</span>
          </div>

          {/* 4 格画框卡片网格 (采用与原来完全一致的卡片风格) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentPageData.panels.map((panel, idx) => {
              const key = panel.id;
              const cnShown = !!shownCn[key];
              const practicing = practiceKey === key;
              const isSaved = isSentenceSaved ? isSentenceSaved(panel.en) : false;

              let targetText = '';
              if (targetLang === 'ja') targetText = panel.ja;
              else if (targetLang === 'es') targetText = panel.es;

              return (
                <div
                  key={key}
                  className="bg-white border border-slate-200 rounded-xl p-3 space-y-2.5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    {/* 原稿手绘插画图片 */}
                    <div className="relative rounded-lg overflow-hidden border border-slate-100 bg-slate-50/80 flex items-center justify-center p-2 min-h-[170px]">
                      <img
                        src={panel.img}
                        alt={panel.en}
                        className="max-h-44 w-auto object-contain select-none transition-transform hover:scale-102"
                        loading="lazy"
                      />
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-white/90 text-slate-700 border border-slate-200 text-[10.5px] font-black shadow-2xs">
                        {panel.label}
                      </span>

                      {/* 收藏按钮 */}
                      {onToggleSaveSentence && panel.en && (
                        <button
                          type="button"
                          onClick={() =>
                            onToggleSaveSentence({
                              en: panel.en,
                              cn: panel.cn || `《看图学英语》第 ${bookPage} 课`,
                              skeletonId: bookPage,
                              tag: 'Richards 原著'
                            })
                          }
                          className={`absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-bold border transition-all shadow-2xs ${
                            isSaved
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : 'bg-white/90 hover:bg-white text-slate-500 border-slate-200'
                          }`}
                        >
                          <Star className={`w-3 h-3 inline mr-0.5 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                          <span>{isSaved ? '已收藏' : '收藏'}</span>
                        </button>
                      )}
                    </div>

                    {/* 句子主体 (点击可直接朗读，与原来功能一致) */}
                    <button
                      type="button"
                      onClick={() => speakText(panel.en, 0.9, 1.0, null, 'en-US')}
                      className="block w-full text-left group"
                    >
                      <div className="text-base font-black text-slate-900 leading-snug group-hover:text-amber-700 transition-colors">
                        {panel.en || <span className="text-slate-400 font-normal italic">（插画过渡画框）</span>}
                      </div>
                    </button>

                    {/* 目标语言对照 (若为日文或西文) */}
                    {targetLang !== 'en' && targetText && (
                      <div className="text-xs text-indigo-700 font-semibold flex items-baseline gap-1 bg-indigo-50/70 p-1.5 rounded-lg border border-indigo-100">
                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-1 py-0.2 rounded shrink-0">
                          {langConfig.name}
                        </span>
                        <span>{targetText}</span>
                      </div>
                    )}

                    {/* 中文对照 (点击「看中文」显示，默认隐藏，与原来一致) */}
                    <div className="text-xs min-h-[1.25rem] text-slate-600 font-medium">
                      {cnShown && panel.cn ? (
                        <div className="flex items-baseline gap-1.5 text-slate-700 bg-amber-50/60 p-1.5 rounded-lg border border-amber-100">
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1 py-0.2 rounded shrink-0">
                            中文
                          </span>
                          <span>{panel.cn}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* 底部操作按钮栏 (常速、慢速、跟读、看中文) */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => speakText(panel.en, 0.9, 1.0, null, 'en-US')}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>常速</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => speakText(panel.en, 0.55, 1.0, null, 'en-US')}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-colors"
                    >
                      🐢 慢速
                    </button>
                    <button
                      type="button"
                      onClick={() => setPracticeKey(practicing ? null : key)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                        practicing
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>跟读</span>
                    </button>

                    {/* 目标语言发音 (若为日文/西文) */}
                    {targetLang !== 'en' && targetText && (
                      <button
                        type="button"
                        onClick={() => speakText(targetText, 0.9, 1.0, null, langConfig.speechLang)}
                        className="px-2 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors"
                      >
                        <span>{langConfig.name}读音</span>
                      </button>
                    )}

                    {/* 看中文 / 藏中文 */}
                    <button
                      type="button"
                      onClick={() => setShownCn((prev) => ({ ...prev, [key]: !prev[key] }))}
                      className="ml-auto flex items-center gap-1 px-2 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 text-xs font-bold transition-colors"
                    >
                      {cnShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{cnShown ? '藏中文' : '看中文'}</span>
                    </button>
                  </div>

                  {/* 录音跟读评测器 */}
                  {practicing && panel.en && (
                    <div className="pt-2 border-t border-rose-100">
                      <PronunciationEvaluator
                        targetSentence={panel.en}
                        targetLang="en"
                        readCount={getReadCount ? getReadCount(panel.en) : 0}
                        onIncrementCount={onIncrementReadCount}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 底部简捷翻页栏 */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={bookPage <= 1}
              onClick={() => {
                setBookPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 border border-slate-200 text-xs font-bold shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>上一课</span>
            </button>

            <span className="text-xs font-black text-slate-500">
              第 {bookPage} / 119 课
            </span>

            <button
              type="button"
              disabled={bookPage >= RICHARDS_BOOK1_PAGES.length}
              onClick={() => {
                setBookPage((p) => Math.min(RICHARDS_BOOK1_PAGES.length, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 border border-slate-200 text-xs font-bold shadow-2xs"
            >
              <span>下一课</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 原版整页扫描弹窗 */}
      {showOriginalScan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50">
              <span className="text-xs font-black text-slate-800">
                原版教材单页扫描（第 {bookPage} 课）
              </span>
              <button
                type="button"
                onClick={() => setShowOriginalScan(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 overflow-y-auto flex items-center justify-center bg-slate-100">
              <img
                src={currentPageData.img}
                alt={`Richards Page ${bookPage}`}
                className="max-h-[75vh] w-auto rounded-lg shadow-md border border-slate-200 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= 模式二：🎯 语法 13 阶精选 ================= */}
      {viewMode === 'stages' && (
        <div className="space-y-3.5">
          <div className="flex items-center gap-1.5 bg-white/90 p-1 rounded-xl border border-amber-200/80 overflow-x-auto scrollbar-none max-w-full">
            {PICTURE_STAGES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStageIdx(i)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap shrink-0 ${
                  i === stageIdx
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s.title} ({s.scenes.length})
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-600 px-1 font-medium">{stage.hint}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stage.scenes.map((scene, i) => {
              const line = scene[targetLang] || scene.en;
              const speechLang = scene[targetLang] ? langConfig.speechLang : 'en-US';
              const key = `${stage.id}-${i}`;
              const cnShown = !!shownCn[key];
              const practicing = practiceKey === key;
              return (
                <div
                  key={key}
                  className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-2 shadow-2xs hover:border-slate-300 transition-all"
                >
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
                    onClick={() => speakText(line.say, 0.9, 1.0, null, speechLang)}
                    className="block w-full text-left"
                  >
                    <div className="text-base font-black text-slate-900 leading-snug">
                      {line.text}
                    </div>
                    {line.roma && (
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {line.roma}
                      </div>
                    )}
                  </button>

                  <div className="text-xs min-h-[1.25rem] text-slate-600">
                    {cnShown ? scene.cn : ''}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => speakText(line.say, 0.9, 1.0, null, speechLang)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>常速</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => speakText(line.say, 0.55, 1.0, null, speechLang)}
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
                      readCount={getReadCount ? getReadCount(line.say) : 0}
                      onIncrementCount={onIncrementReadCount}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
