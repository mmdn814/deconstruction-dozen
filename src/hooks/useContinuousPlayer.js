import { useState, useRef, useEffect, useCallback } from 'react';
import { speakText, stopAllAudio } from '../lib/core.js';

// 智能自适应阶梯留白时间：
// 1. 纯单音 / 假名 (phoneme):   磨耳朵 0.4s (400ms) / 跟读 1.2s (1200ms)
// 2. 词汇 / 短语 (word):       磨耳朵 0.8s (800ms) / 跟读 2.0s (2000ms)
// 3. 完整句子 / 阶梯 (sentence): 磨耳朵 1.2s (1200ms) / 跟读 3.0s (3000ms)
export const getItemType = (item) => {
  if (item?.type) return item.type;
  const text = String(item?.text || '').trim();
  const id = String(item?.id || '');
  if (
    id.includes('kana') ||
    id.includes('phoneme') ||
    id.includes('sound') ||
    text.startsWith('/') ||
    (text.length <= 3 && !text.includes(' ') && !/[.,!?;:。？！]/.test(text))
  ) {
    return 'phoneme';
  }
  if (!text.includes(' ') || (text.split(/\s+/).length <= 2 && !/[.,!?;:。？！]/.test(text))) {
    return 'word';
  }
  return 'sentence';
};

export const getGapMs = (item, currentMode) => {
  if (typeof item?.gapMs === 'number') return item.gapMs;
  const type = getItemType(item);
  if (currentMode === 'shadow') {
    if (type === 'phoneme') return 1200;
    if (type === 'word') return 2000;
    return 3000;
  }
  // listen 磨耳朵模式
  if (type === 'phoneme') return 400;
  if (type === 'word') return 800;
  return 1200;
};

export const useContinuousPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState('listen'); // 'listen' (1.2s) | 'shadow' (3.0s)
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const stateRef = useRef({ isPlaying: false, isPaused: false, mode: 'listen', playlist: [], currentIndex: -1 });

  // 同步 ref 供异步回调即时获取最新值
  useEffect(() => {
    stateRef.current = { isPlaying, isPaused, mode, playlist, currentIndex };
  }, [isPlaying, isPaused, mode, playlist, currentIndex]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (e) {}
      audioRef.current = null;
    }
    stopAllAudio();
  };

  const stop = useCallback(() => {
    clearTimer();
    stopAudio();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentIndex(-1);
    setPlaylist([]);
  }, []);

  const playItemAtIndex = useCallback((list, index) => {
    clearTimer();
    stopAudio();

    if (!list || index < 0 || index >= list.length) {
      stop();
      return;
    }

    const item = list[index];
    setCurrentIndex(index);

    const onAudioEnded = () => {
      const { isPlaying: playing, isPaused: paused, mode: currentMode, playlist: currentList } = stateRef.current;
      if (!playing || paused) return;

      const gapMs = getGapMs(item, currentMode);
      timerRef.current = setTimeout(() => {
        const nextIdx = index + 1;
        if (nextIdx < currentList.length) {
          playItemAtIndex(currentList, nextIdx);
        } else {
          stop();
        }
      }, gapMs);
    };

    if (item.audioUrl) {
      try {
        const audio = new Audio(item.audioUrl);
        audioRef.current = audio;
        audio.onended = () => {
          if (audioRef.current === audio) audioRef.current = null;
          onAudioEnded();
        };
        audio.onerror = () => {
          // 若静态音频加载异常，平滑降级到系统发音
          speakText(item.text, 0.95, 1.0, onAudioEnded, item.speechLang);
        };
        const promise = audio.play();
        if (promise !== undefined) {
          promise.catch(() => {
            speakText(item.text, 0.95, 1.0, onAudioEnded, item.speechLang);
          });
        }
      } catch (e) {
        speakText(item.text, 0.95, 1.0, onAudioEnded, item.speechLang);
      }
    } else {
      speakText(item.text, 0.95, 1.0, onAudioEnded, item.speechLang);
    }
  }, [stop]);

  const start = useCallback((items, startIndex = 0, initialMode = null) => {
    if (!items || items.length === 0) return;
    const validStart = Math.max(0, Math.min(startIndex, items.length - 1));
    if (initialMode) {
      setMode(initialMode);
    }
    setPlaylist(items);
    setIsPlaying(true);
    setIsPaused(false);
    playItemAtIndex(items, validStart);
  }, [playItemAtIndex]);

  const togglePlay = useCallback(() => {
    if (!isPlaying && !isPaused) return;

    if (isPaused) {
      // 恢复播放
      setIsPaused(false);
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      } else {
        // 若在间隙定时器期间暂停，恢复时直接播放当前项或下一项
        const { playlist: list, currentIndex: idx } = stateRef.current;
        if (list[idx]) {
          playItemAtIndex(list, idx);
        }
      }
    } else {
      // 暂停播放
      setIsPaused(true);
      clearTimer();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isPaused, playItemAtIndex]);

  const startOrToggle = useCallback((items, startIndex = 0, targetMode = 'listen') => {
    const { isPlaying: playing, isPaused: paused, mode: currentMode } = stateRef.current;
    if (playing) {
      if (currentMode === targetMode) {
        togglePlay();
      } else {
        setMode(targetMode);
        if (paused) {
          togglePlay();
        }
      }
    } else {
      start(items, startIndex, targetMode);
    }
  }, [start, togglePlay]);

  const next = useCallback(() => {
    const { playlist: list, currentIndex: idx } = stateRef.current;
    if (idx + 1 < list.length) {
      setIsPaused(false);
      playItemAtIndex(list, idx + 1);
    } else {
      stop();
    }
  }, [playItemAtIndex, stop]);

  const prev = useCallback(() => {
    const { playlist: list, currentIndex: idx } = stateRef.current;
    if (idx - 1 >= 0) {
      setIsPaused(false);
      playItemAtIndex(list, idx - 1);
    }
  }, [playItemAtIndex]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'listen' ? 'shadow' : 'listen'));
  }, []);

  // 页面卸载或重置时清理
  useEffect(() => {
    return () => {
      clearTimer();
      stopAudio();
    };
  }, []);

  const currentItem = playlist[currentIndex] || null;
  const currentType = currentItem ? getItemType(currentItem) : null;
  const currentGapMs = currentItem ? getGapMs(currentItem, mode) : (mode === 'shadow' ? 3000 : 1200);

  return {
    isPlaying,
    isPaused,
    mode,
    playlist,
    currentIndex,
    currentItem,
    currentType,
    currentGapMs,
    start,
    startOrToggle,
    stop,
    togglePlay,
    next,
    prev,
    toggleMode
  };
};
