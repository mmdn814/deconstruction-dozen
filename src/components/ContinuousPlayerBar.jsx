import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Square,
  Headphones,
  Mic,
  X,
  Volume2
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

  if (!isPlaying && !isPaused) return null;

  return (
    <aside
      aria-label="自动连读控制条"
      className="fixed bottom-4 right-4 z-50 max-w-sm sm:max-w-md w-[calc(100%-2rem)] sm:w-96 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl shadow-2xl p-3.5 space-y-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      {/* 顶部行：标题、当前位置进度与退出按钮 */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              isPaused
                ? 'bg-amber-400'
                : 'bg-emerald-400 animate-pulse'
            }`}
          />
          <span className="text-xs font-bold text-slate-200 truncate">
            {title || '连续朗读模式'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {progressText && (
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10.5px] font-mono text-amber-300 border border-slate-700">
              {progressText}
            </span>
          )}
          <button
            type="button"
            onClick={onStop}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="退出连续朗读"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 中部行：当前朗读句子与中文 */}
      <div className="space-y-0.5 px-0.5">
        <div className="text-sm font-extrabold text-white leading-snug line-clamp-2">
          {currentText || '正在缓冲下一句...'}
        </div>
        {currentCn && (
          <div className="text-xs text-slate-400 truncate">
            {currentCn}
          </div>
        )}
      </div>

      {/* 底部行：模式切换 pill + 播放控制按键 */}
      <div className="flex items-center justify-between gap-2 pt-1">
        {/* 模式切换 (自适应阶梯留白：音标 0.4s/1.2s · 单词 0.8s/2.0s · 句子 1.2s/3.0s) */}
        <button
          type="button"
          onClick={onToggleMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold border transition-all ${
            mode === 'shadow'
              ? 'bg-purple-900/60 text-purple-200 border-purple-600/80 hover:bg-purple-900'
              : 'bg-blue-900/60 text-blue-200 border-blue-600/80 hover:bg-blue-900'
          }`}
          title="点击切换连续朗读模式（自适应阶梯留白：音标 0.4s/1.2s · 单词 0.8s/2s · 句子 1.2s/3s）"
        >
          {mode === 'shadow' ? (
            <>
              <Mic className="w-3 h-3 text-purple-300" />
              <span>🗣️ 跟读留白 {currentGapMs ? `(${(currentGapMs / 1000).toFixed(1)}s)` : ''}</span>
            </>
          ) : (
            <>
              <Headphones className="w-3 h-3 text-blue-300" />
              <span>🎧 磨耳朵 {currentGapMs ? `(${(currentGapMs / 1000).toFixed(1)}s)` : ''}</span>
            </>
          )}
        </button>

        {/* 控制按键组：上一句、暂停/继续、下一句、停止 */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onPrev}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="上一句"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-md ${
              isPaused
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
            title={isPaused ? '继续播放' : '暂停播放'}
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>继续</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>暂停</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onNext}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="下一句"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          <button
            type="button"
            onClick={onStop}
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 transition-colors ml-0.5"
            title="停止"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </div>
    </aside>
  );
};
