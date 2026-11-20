import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Headphones,
  Mic,
  X,
  ChevronUp,
  ChevronDown,
  Minimize2
} from 'lucide-react';

export const ContinuousPlayerBar = (props) => {
  const player = props.player;
  const isPlaying = player ? player.isPlaying : props.isPlaying;
  const isPaused = player ? player.isPaused : props.isPaused;
  const mode = player ? player.mode : props.mode;
  const onToggleMode = player ? player.toggleMode : props.onToggleMode;
  const onPrev = player ? player.prev : props.onPrev;
  const onTogglePlay = player ? player.togglePlay : props.onTogglePlay;
  const onNext = player ? player.next : props.onNext;
  const onStop = player ? player.stop : props.onStop;
  const currentText = props.currentText || player?.currentItem?.displayText || player?.currentItem?.text;
  const currentCn = props.currentCn || player?.currentItem?.cn;
  const title = props.title;
  const progressText = props.progressText;
  const currentGapMs = props.currentGapMs || player?.currentGapMs;

  // 三态控制：'bar' (默认吸底胶囊条) | 'bubble' (悬浮微型小圆球) | 'drawer' (展开详情看板)
  const [viewState, setViewState] = useState('bar');

  if (!isPlaying && !isPaused) return null;

  // 1. 形态一：极简悬浮小灵球 (44x44px)，完全不遮挡任何文字与按钮
  if (viewState === 'bubble') {
    return (
      <aside
        aria-label="自动连读小悬浮球"
        className="fixed bottom-5 right-4 z-50 animate-in fade-in zoom-in-90 duration-150"
      >
        <button
          type="button"
          onClick={() => setViewState('bar')}
          className="relative w-12 h-12 rounded-full bg-white/95 backdrop-blur-md border border-stone-300 shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 group"
          title="正在后台连读，点击展开控制条"
        >
          {/* 实时状态呼吸点 */}
          <span
            className={`absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
              isPaused ? 'bg-amber-400' : 'bg-emerald-500 animate-pulse'
            }`}
          />
          {mode === 'shadow' ? (
            <Mic className={`w-5 h-5 ${isPaused ? 'text-stone-400' : 'text-purple-600'}`} />
          ) : (
            <Headphones className={`w-5 h-5 ${isPaused ? 'text-stone-400' : 'text-blue-600'}`} />
          )}
        </button>
      </aside>
    );
  }

  // 2. 形态二与形态三：吸底细胶囊条 (bar) 与向上展开详情面板 (drawer)
  return (
    <aside
      aria-label="自动连读控制条"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-5 sm:w-96 z-50 bg-white/95 backdrop-blur-md text-stone-900 border border-stone-200/90 rounded-2xl shadow-xl transition-all duration-200 overflow-hidden"
    >
      {/* 展开抽屉面板（形态三展示详细双语、口型技巧与进度模式） */}
      {viewState === 'drawer' && (
        <div className="p-3.5 border-b border-stone-100 space-y-2.5 animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span className="truncate">{title || '连续朗读'}</span>
            <div className="flex items-center gap-1.5">
              {progressText && (
                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-[10.5px] font-mono text-stone-700 border border-stone-200">
                  {progressText}
                </span>
              )}
              <button
                type="button"
                onClick={() => setViewState('bar')}
                className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                title="收起详情"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-1 bg-stone-50/80 rounded-xl p-2.5 border border-stone-100">
            <div className="text-sm font-black text-stone-900 leading-snug break-words">
              {currentText || '正在播放...'}
            </div>
            {currentCn && <div className="text-xs text-stone-600 break-words">{currentCn}</div>}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={onToggleMode}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                mode === 'shadow'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              {mode === 'shadow' ? (
                <>
                  <Mic className="w-3.5 h-3.5 text-purple-600" />
                  <span>跟读留白模式 {currentGapMs ? `(${(currentGapMs / 1000).toFixed(1)}s)` : ''}</span>
                </>
              ) : (
                <>
                  <Headphones className="w-3.5 h-3.5 text-blue-600" />
                  <span>磨耳朵模式 {currentGapMs ? `(${(currentGapMs / 1000).toFixed(1)}s)` : ''}</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-stone-400">点击切换留白</span>
          </div>
        </div>
      )}

      {/* 核心横向细胶囊主条（形态二：常驻单行，极低高度，无视线干扰） */}
      <div className="flex items-center justify-between gap-1.5 px-3 py-2">
        {/* 左侧：轻度状态点 + 当前短文预览（点击直接展开抽屉） */}
        <div
          onClick={() => setViewState((prev) => (prev === 'drawer' ? 'bar' : 'drawer'))}
          className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
          title="点击展开/收起完整双语释义"
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isPaused ? 'bg-amber-400' : 'bg-emerald-500 animate-pulse'
            }`}
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-extrabold text-stone-900 truncate">
              {currentText || '连读中...'}
            </div>
            {currentCn && <div className="text-[10.5px] text-stone-500 truncate">{currentCn}</div>}
          </div>
          {viewState === 'drawer' ? (
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          )}
        </div>

        {/* 右侧：紧凑控制键组 */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* 模式快捷键 */}
          <button
            type="button"
            onClick={onToggleMode}
            className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
              mode === 'shadow'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}
            title={mode === 'shadow' ? '当前：跟读留白' : '当前：磨耳朵'}
          >
            {mode === 'shadow' ? <Mic className="w-3.5 h-3.5" /> : <Headphones className="w-3.5 h-3.5" />}
          </button>

          {/* 上一个 */}
          <button
            type="button"
            onClick={onPrev}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            title="上一个"
          >
            <SkipBack className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* 播放/暂停大圆键 */}
          <button
            type="button"
            onClick={onTogglePlay}
            className={`p-1.5 rounded-xl font-bold transition-all shadow-xs ${
              isPaused
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            title={isPaused ? '继续播放' : '暂停播放'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
          </button>

          {/* 下一个 */}
          <button
            type="button"
            onClick={onNext}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            title="下一个"
          >
            <SkipForward className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* 收缩为小圆球按键 */}
          <button
            type="button"
            onClick={() => setViewState('bubble')}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors ml-0.5"
            title="收起为悬浮小圆球（完全不挡视线）"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>

          {/* 退出停止 */}
          <button
            type="button"
            onClick={onStop}
            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="退出连续播放"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
