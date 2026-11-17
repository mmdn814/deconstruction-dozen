import React, { useState, useEffect, useRef } from 'react';
import { Mic, Play, Square, Award, Loader2 } from 'lucide-react';
import { LANGUAGE_CONFIG, callGemini } from '../lib/core.js';

// --- Pronunciation Evaluator with Real Audio Recording & Playback + 20x Muscle Memory Counter ---
export const PronunciationEvaluator = ({
  targetSentence,
  targetLang = 'en',
  readCount = 0,
  onIncrementCount
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    setRecognizedText('');
    setAiFeedback('');
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  }, [targetSentence, targetLang]);

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
  };

  const startRecording = async () => {
    setRecognizedText('');
    setAiFeedback('');
    setIsRecording(true);

    // 1. Start MediaRecorder for real voice playback
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setAudioUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
          });
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
    } catch (e) {
      // Microphone stream optional if speech recognition still works
    }

    // 2. Start SpeechRecognition for AI pronunciation feedback
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setTimeout(() => {
        stopRecording();
        setAiFeedback('当前浏览器不支持语音识别文字，但您仍可点击右侧【听我的录音】对比原声并打卡！');
      }, 2800);
      return;
    }

    const recognition = new SpeechRec();
    recognitionRef.current = recognition;
    recognition.lang = (LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en).speechLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      setRecognizedText(transcript);
      stopRecording();

      if (onIncrementCount) {
        onIncrementCount(targetSentence);
      }

      setLoadingFeedback(true);
      const prompt = `
        用户正在跟读当前目标句（请严格且仅以此句作为唯一对比标准，绝不要虚构该句中没有的单词）：
        目标句: "${targetSentence}"
        语音识别出用户读的是: "${transcript}"
        请用中文给出 45 字以内的简短、温和纠音建议（指出哪个词漏读或发音偏差，以及连读/重音小贴士）。
      `;
      const feedback = await callGemini(prompt, '你是温和专业的口语纠音教练。');
      setAiFeedback(
        feedback || '发音很清晰！建议继续保持节奏，多对比自己的录音与标准范读。'
      );
      setLoadingFeedback(false);
    };

    recognition.onerror = () => {
      stopRecording();
      setAiFeedback('未检测到清晰语音，请靠近麦克风再试一次，或直接点击 +1 打卡。');
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    try {
      recognition.start();
    } catch (e) {
      stopRecording();
    }
  };

  const togglePlayUserAudio = () => {
    if (!audioUrl) return;
    if (isPlayingUserAudio && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      setIsPlayingUserAudio(false);
      return;
    }
    const audio = new Audio(audioUrl);
    audioPlayerRef.current = audio;
    setIsPlayingUserAudio(true);
    audio.onended = () => setIsPlayingUserAudio(false);
    audio.onerror = () => setIsPlayingUserAudio(false);
    audio.play();
  };

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
            isRecording
              ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90'
          }`}
        >
          <Mic className={`w-3.5 h-3.5 ${isRecording ? 'text-white' : 'text-rose-500'}`} />
          <span>{isRecording ? '正在录音 (点击停止)...' : '🎤 录音测评'}</span>
        </button>

        {audioUrl && (
          <button
            type="button"
            onClick={togglePlayUserAudio}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
          >
            {isPlayingUserAudio ? (
              <>
                <Square className="w-3 h-3 fill-current" />
                <span>停止回放</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>▶️ 听我的录音</span>
              </>
            )}
          </button>
        )}

        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg text-xs">
          <Award className={`w-3.5 h-3.5 ${readCount >= 20 ? 'text-amber-500' : 'text-slate-400'}`} />
          <span className="text-slate-600 font-medium">肌肉记忆跟读:</span>
          <span className={`font-extrabold ${readCount >= 20 ? 'text-emerald-600' : 'text-blue-600'}`}>
            {readCount}/20
          </span>
          <button
            type="button"
            onClick={() => onIncrementCount && onIncrementCount(targetSentence)}
            className="ml-1 px-1.5 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10.5px] font-bold transition-colors"
          >
            +1 打卡
          </button>
        </div>
      </div>

      {(recognizedText || loadingFeedback || aiFeedback) && (
        <div className="bg-slate-50/90 border border-slate-200/80 rounded-lg p-2 text-xs space-y-1">
          {recognizedText && (
            <div className="text-slate-600">
              <span>识别结果: </span>
              <span className="font-mono font-semibold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                {recognizedText}
              </span>
            </div>
          )}
          {loadingFeedback ? (
            <div className="flex items-center gap-1.5 text-blue-600">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>AI 正在分析您的发音细节...</span>
            </div>
          ) : (
            aiFeedback && (
              <div className="text-slate-700 leading-relaxed">
                <strong className="text-blue-600">AI 纠音: </strong>
                {aiFeedback}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
