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
  Play,
  RotateCcw
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
  // 浏览模式：'book' (119页原著逐页复刻) | 'stages' (13阶精选提炼)
  const [viewMode, setViewMode] = useState('book');

  // Book 模式状态
  const [bookPage, setBookPage] = useState(1);
  const [focusedPanelId, setFocusedPanelId] = useState(null);
  const [showAllTranslations, setShowAllTranslations] = useState(true);
  const [bookPracticeId, setBookPracticeId] = useState(null);

  // Stages 模式状态
  const [stageIdx, setStageIdx] = useState(0);
  const [shownCn, setShownCn] = useState({});
  const [stagePracticeKey, setStagePracticeKey] = useState(null);

  const langConfig = LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en;
  const stage = PICTURE_STAGES[stageIdx];

  const currentPageData = RICHARDS_BOOK1_PAGES[bookPage - 1] || RICHARDS_BOOK1_PAGES[0];

  // 键盘左右箭头翻页支持
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 避免输入框内触发
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

  // 重置评测状态
  useEffect(() => {
    setBookPracticeId(null);
    setFocusedPanelId(null);
  }, [bookPage, viewMode]);

  // 连续朗读整页 4 格
  const handlePlayWholePage = () => {
    if (!currentPageData || !currentPageData.panels) return;
    const panelsWithText = currentPageData.panels.filter((p) => p.en && p.en.trim());
    if (panelsWithText.length === 0) return;

    let idx = 0;
    const playNext = () => {
      if (idx >= panelsWithText.length) {
        setFocusedPanelId(null);
        return;
      }
      const p = panelsWithText[idx];
      setFocusedPanelId(p.id);
      speakText(p.en, 0.9, 1.0, () => {
        idx++;
        setTimeout(playNext, 450);
      }, 'en-US');
    };
    playNext();
  };

  return (
    <div className="space-y-4">
      {/* 顶部模式切换栏 */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-2 shadow-2xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-white text-xs font-black tracking-wide">
              STEP 3 · 看图直接学
            </span>
            <span className="text-xs font-black text-slate-900">
              {langConfig.flag} {langConfig.name} · I.A. Richards《看图学英语》
            </span>
          </div>

          {/* 模式切换胶囊 */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('book')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                viewMode === 'book'
                  ? 'bg-white text-amber-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>📖 原著 119 页逐页点读</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
                100% 全量
              </span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('stages')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                viewMode === 'stages'
                  ? 'bg-white text-amber-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>🎯 核心语法 13 阶精选</span>
            </button>
          </div>
        </div>

        {/* 模式说明 */}
        <p className="text-[11.5px] text-slate-500">
          {viewMode === 'book'
            ? '100% 逐字逐画还原原版第一册 119 页（476 个连贯四格小人画框），点击画面或右侧卡片即可点读、慢速听、跟读打分，键盘 ← → 键快速翻页。'
            : '精选提炼的 13 大认知语法阶段（61 个交互场景），采用自绘彩色矢量动画，帮助快速建立主干语感。'}
        </p>
      </div>

      {/* ================= 模式一：📖 原著 119 页全量逐页点读 ================= */}
      {viewMode === 'book' && (
        <div className="space-y-4">
          {/* 翻页与快捷导航控制条 */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 space-y-2.5 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              {/* 翻页按钮组 */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={bookPage <= 1}
                  onClick={() => setBookPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-700 border border-slate-200 text-xs font-bold shadow-2xs transition-all"
                  title="快捷键: ← 左箭头"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>上一页</span>
                </button>

                <div className="px-3 py-1 rounded-lg bg-white border border-amber-200 text-xs font-black text-amber-900 shadow-2xs flex items-center gap-1">
                  <span>第</span>
                  <span className="text-amber-600 text-sm">{bookPage}</span>
                  <span>/ 119 页</span>
                </div>

                <button
                  type="button"
                  disabled={bookPage >= RICHARDS_BOOK1_PAGES.length}
                  onClick={() => setBookPage((p) => Math.min(RICHARDS_BOOK1_PAGES.length, p + 1))}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-700 border border-slate-200 text-xs font-bold shadow-2xs transition-all"
                  title="快捷键: → 右箭头"
                >
                  <span>下一页</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 快速跳转下拉选择 */}
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
                  <option disabled>────────── 逐页选择 ──────────</option>
                  {RICHARDS_BOOK1_PAGES.map((p) => (
                    <option key={p.page} value={p.page}>
                      第 {p.page} 页 · {p.topic}
                    </option>
                  ))}
                </select>

                {/* 连读四格 */}
                <button
                  type="button"
                  onClick={handlePlayWholePage}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-all"
                  title="自动连续朗读本页 4 个画框"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>连读整页</span>
                </button>

                {/* 译文开关 */}
                <button
                  type="button"
                  onClick={() => setShowAllTranslations((prev) => !prev)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold shadow-2xs"
                >
                  {showAllTranslations ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showAllTranslations ? '隐藏全部译文' : '显示全部译文'}</span>
                </button>
              </div>
            </div>

            {/* 快速滑动条与主题标题 */}
            <div className="flex items-center gap-3 pt-1 border-t border-amber-200/60">
              <span className="text-[11px] font-black text-amber-800 shrink-0">
                本页主题：{currentPageData.topic}
              </span>
              <input
                type="range"
                min="1"
                max={RICHARDS_BOOK1_PAGES.length}
                value={bookPage}
                onChange={(e) => setBookPage(Number(e.target.value))}
                className="w-full h-1.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>
          </div>

          {/* 双栏布局：左侧原版插画画板 + 右侧 4 格互动卡片 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* 左侧：原版手绘教材页面画板 (占 5 列) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs space-y-2 sticky top-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800">
                  原版教材插画（第 {bookPage} 页）
                </span>
                <span className="text-[10.5px] text-slate-400">点击画面对应画框可聚焦</span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50 group">
                <img
                  src={currentPageData.img}
                  alt={`English Through Pictures Book 1 - Page ${bookPage}`}
                  className="w-full h-auto block select-none"
                  loading="eager"
                />

                {/* 4 个可点击交互热区层 (TL, TR, BL, BR) */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-auto">
                  {currentPageData.panels.map((p, idx) => {
                    const isFocused = focusedPanelId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setFocusedPanelId(p.id);
                          if (p.en) speakText(p.en, 0.9, 1.0, null, 'en-US');
                        }}
                        className={`relative transition-all flex items-start justify-start p-1.5 focus:outline-hidden ${
                          isFocused
                            ? 'bg-amber-400/25 ring-2 ring-amber-500 ring-inset'
                            : 'hover:bg-blue-400/15'
                        }`}
                        title={`点击点读：${p.en || p.label}`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black shadow-xs ${
                            isFocused
                              ? 'bg-amber-600 text-white scale-110'
                              : 'bg-white/90 text-slate-700 border border-slate-300'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 右侧：4 格点读互动卡片 (占 7 列) */}
            <div className="lg:col-span-7 space-y-2.5">
              {currentPageData.panels.map((panel, idx) => {
                const isFocused = focusedPanelId === panel.id;
                const practicing = bookPracticeId === panel.id;
                const isSaved = isSentenceSaved ? isSentenceSaved(panel.en) : false;

                // 目标语言翻译展示
                let targetText = '';
                if (targetLang === 'ja') targetText = panel.ja;
                else if (targetLang === 'es') targetText = panel.es;

                return (
                  <div
                    key={panel.id}
                    onClick={() => setFocusedPanelId(panel.id)}
                    className={`bg-white border rounded-xl p-3 space-y-2 transition-all shadow-2xs ${
                      isFocused
                        ? 'border-amber-400 ring-2 ring-amber-300/60 bg-amber-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* 卡片头部 */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-500">{panel.label}</span>
                      </div>

                      {/* 收藏按钮 */}
                      {onToggleSaveSentence && panel.en && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSaveSentence({
                              en: panel.en,
                              cn: panel.cn || '《看图学英语》第 ' + bookPage + ' 页短句',
                              skeletonId: bookPage,
                              tag: 'Richards 原著'
                            });
                          }}
                          className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold border transition-all ${
                            isSaved
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : 'bg-white hover:bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          <Star className={`w-3 h-3 inline mr-1 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                          <span>{isSaved ? '已收藏' : '收藏'}</span>
                        </button>
                      )}
                    </div>

                    {/* 英文短句主体 */}
                    <div className="text-base font-black text-slate-900 leading-snug tracking-wide">
                      {panel.en || <span className="text-slate-400 font-normal italic">（插画过渡画框）</span>}
                    </div>

                    {/* 多语言翻译区域 */}
                    {showAllTranslations && (
                      <div className="bg-slate-50/90 rounded-lg p-2 border border-slate-200/60 space-y-1 text-xs">
                        {/* 目标语言翻译 (若为日文或西文) */}
                        {targetText && (
                          <div className="flex items-baseline gap-1.5 text-slate-800 font-medium">
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1 py-0.2 rounded shrink-0">
                              {langConfig.name}
                            </span>
                            <span>{targetText}</span>
                          </div>
                        )}

                        {/* 中文对照 */}
                        {panel.cn && (
                          <div className="flex items-baseline gap-1.5 text-slate-600">
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-1 py-0.2 rounded shrink-0">
                              中文
                            </span>
                            <span>{panel.cn}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 操作按钮栏 */}
                    {panel.en && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {/* 英文原音 */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(panel.en, 0.95, 1.0, null, 'en-US');
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>英文原声</span>
                        </button>

                        {/* 慢速朗读 */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(panel.en, 0.6, 1.0, null, 'en-US');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-colors"
                        >
                          🐢 慢速
                        </button>

                        {/* 目标语言（日文/西文）发音 */}
                        {targetLang !== 'en' && targetText && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(targetText, 0.9, 1.0, null, langConfig.speechLang);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{langConfig.name}读音</span>
                          </button>
                        )}

                        {/* 跟读评测 */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBookPracticeId(practicing ? null : panel.id);
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                            practicing
                              ? 'bg-rose-600 text-white border-rose-600'
                              : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                          }`}
                        >
                          <Mic className="w-3.5 h-3.5" />
                          <span>跟读评测</span>
                        </button>
                      </div>
                    )}

                    {/* 跟读打分评测器 */}
                    {practicing && panel.en && (
                      <div className="pt-2">
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
          </div>
        </div>
      )}

      {/* ================= 模式二：🎯 核心语法 13 阶精选 ================= */}
      {viewMode === 'stages' && (
        <div className="space-y-3.5">
          {/* 阶段选择胶囊栏 */}
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200 overflow-x-auto scrollbar-none max-w-full">
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
              const practicing = stagePracticeKey === key;
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
                      onClick={() => setStagePracticeKey(practicing ? null : key)}
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
