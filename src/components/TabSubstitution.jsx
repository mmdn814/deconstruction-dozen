import React, { useState, useEffect } from 'react';
import { RefreshCw, Volume2, Sparkles, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { LANGUAGE_CONFIG, speakText, callGemini } from '../lib/core.js';
import { sentencesByLang, scenarioBatchesBySkeleton, buildLegoBlocksForSentence } from '../data/sentences.js';
import { WordWithTooltip } from './SentenceVisualizer.jsx';
import { PronunciationEvaluator } from './PronunciationEvaluator.jsx';

// --- TAB 3: Sentence Substitution, Zero-Basis Lego Builder & AI Pronunciation Diagnosis ---
export const TabSubstitution = ({
  targetLang,
  initialSkeletonId = 11,
  getReadCount,
  onIncrementReadCount,
  isSentenceSaved,
  onToggleSaveSentence
}) => {
  const sentences = sentencesByLang[targetLang] || sentencesByLang.en;
  const langConfig = LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en;

  const [selectedSkeletonId, setSelectedSkeletonId] = useState(initialSkeletonId || 11);
  const [showSkeletonList, setShowSkeletonList] = useState(false);
  const [scenarioCat, setScenarioCat] = useState('work'); // 'work' | 'daily' | 'living' | 'travel'
  const [batchIdx, setBatchIdx] = useState(0);
  const [aiCustomBatch, setAiCustomBatch] = useState(null);
  const [loadingBatch, setLoadingBatch] = useState(false);

  const [selectedExampleIdx, setSelectedExampleIdx] = useState(0); // 0..4 or 'custom'
  const [customChineseInput, setCustomChineseInput] = useState('');

  const [inputMode, setInputMode] = useState('lego'); // 'lego' | 'type'
  const [userTranslation, setUserTranslation] = useState('');
  const [selectedLegoTiles, setSelectedLegoTiles] = useState([]);

  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  useEffect(() => {
    if (initialSkeletonId) {
      setSelectedSkeletonId(initialSkeletonId);
    }
  }, [initialSkeletonId]);

  const currentSkeleton =
    sentences.find((s) => s.id === selectedSkeletonId) || sentences[0];

  const batchesForCat =
    scenarioBatchesBySkeleton.default[scenarioCat] ||
    scenarioBatchesBySkeleton.default.work;
  const currentExamplesList =
    aiCustomBatch || batchesForCat[batchIdx % batchesForCat.length];

  const activeChineseTarget =
    selectedExampleIdx === 'custom'
      ? customChineseInput.trim() || '我打算明天把修改后的方案发给客户。'
      : currentExamplesList[selectedExampleIdx] || currentExamplesList[0];

  const legoData = buildLegoBlocksForSentence(targetLang, selectedSkeletonId);

  useEffect(() => {
    setSelectedLegoTiles([]);
    setUserTranslation('');
    setDiagnosisResult(null);
  }, [selectedSkeletonId, targetLang]);

  const handleCycleBatch = () => {
    setAiCustomBatch(null);
    setBatchIdx((prev) => (prev + 1) % batchesForCat.length);
    setSelectedExampleIdx(0);
  };

  const handleGenerateAiExamples = async () => {
    setLoadingBatch(true);
    const catNames = { work: '职场工作', daily: '日常沟通', living: '海外生活', travel: '旅游出行' };
    const prompt = `
      当前练习语法骨架：第 ${currentSkeleton.id} 句 "${currentSkeleton.en.join(' ')}" (${currentSkeleton.nat.join('')})
      应用场景：${catNames[scenarioCat]}
      请生成 5 个适合套用该语法骨架进行翻译练习的地道中文短句。
    `;
    const schema = {
      type: 'OBJECT',
      properties: {
        sentences: { type: 'ARRAY', items: { type: 'STRING' } }
      },
      required: ['sentences']
    };
    const res = await callGemini(prompt, '你是专业的语言教学设计师。', schema);
    if (res) {
      try {
        const parsed = JSON.parse(res);
        if (Array.isArray(parsed.sentences) && parsed.sentences.length >= 5) {
          setAiCustomBatch(parsed.sentences.slice(0, 5));
          setSelectedExampleIdx(0);
        }
      } catch (e) {}
    }
    setLoadingBatch(false);
  };

  const handleAddLegoTile = (block) => {
    speakText(block.word, 0.95);
    const next = [...selectedLegoTiles, block];
    setSelectedLegoTiles(next);
    setUserTranslation(next.map((b) => b.word).join(' '));
  };

  const handleRemoveLegoTile = (idx) => {
    const next = selectedLegoTiles.filter((_, i) => i !== idx);
    setSelectedLegoTiles(next);
    setUserTranslation(next.map((b) => b.word).join(' '));
  };

  const handleFillRecommendedOrder = () => {
    setUserTranslation(legoData.recommendedOrder);
    speakText(legoData.recommendedOrder, 0.95);
  };

  // Ensure words array and full sentence stay 100% synced
  const getSyncedSentenceData = (sentenceStr) => {
    const clean = String(sentenceStr || '').trim();
    const words = clean ? clean.split(/\s+/) : [];
    return { fullSentence: clean, words };
  };

  const handleRunDiagnosis = async () => {
    const attempt = userTranslation.trim() || legoData.recommendedOrder;
    setLoadingDiagnosis(true);

    const prompt = `
      目标学习语言: ${langConfig.name} (${langConfig.code})
      所选第 ${currentSkeleton.id} 句核心语法骨架: "${currentSkeleton.en.join(' ')}"
      目标中文句: "${activeChineseTarget}"
      用户的${langConfig.name}尝试: "${attempt}"

      请严格输出 JSON 格式诊断：
      1. feedback: 用中文点评用户的句子是否正确套用了骨架，指出语序或语法亮点与修正建议。
      2. standardSentence: 套用当前骨架最标准、完整的${langConfig.name}句子（绝不能漏掉冠词或助词）。
      3. alternatives: 提供 2 个母语者高频同义替换句，每项包含：
         - sentence: 完整的${langConfig.name}替换句（必须包含完整冠词/助词）
         - register: 适用语境标签（如“商务正式”或“日常地道口语”）
         - grammarCompare: 详细讲解该替换句与基础骨架句的对比（例如为什么用了某个短语、冠词或助词如何变化）。
    `;

    const schema = {
      type: 'OBJECT',
      properties: {
        feedback: { type: 'STRING' },
        standardSentence: { type: 'STRING' },
        alternatives: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              sentence: { type: 'STRING' },
              register: { type: 'STRING' },
              grammarCompare: { type: 'STRING' }
            },
            required: ['sentence', 'register', 'grammarCompare']
          }
        }
      },
      required: ['feedback', 'standardSentence', 'alternatives']
    };

    const res = await callGemini(prompt, `你是精通${langConfig.name}的母语级语法教练。`, schema);
    if (res) {
      try {
        const parsed = JSON.parse(res);
        setDiagnosisResult(parsed);
      } catch (e) {}
    } else {
      setDiagnosisResult({
        feedback: `很好地套用了第 ${currentSkeleton.id} 句的骨架结构！注意保持动词变位和语序的连贯性。`,
        standardSentence: currentSkeleton.workplace,
        alternatives: [
          {
            sentence: currentSkeleton.en.join(' '),
            register: '核心骨架原句',
            grammarCompare: `严格遵循第 ${currentSkeleton.id} 句的底层语序：${currentSkeleton.trap}`
          }
        ]
      });
    }
    setLoadingDiagnosis(false);
  };

  return (
    <div className="space-y-3.5">
      {/* Step 1: Select Core Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="text-xs font-extrabold text-slate-800 shrink-0">
              1. 句型骨架:
            </h3>
            <span className="text-xs text-blue-600 font-bold px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 truncate">
              #{currentSkeleton.id} {currentSkeleton.en.join(' ')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowSkeletonList((prev) => !prev)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <span>{showSkeletonList ? '收起句型列表' : '切换骨架 (12句)'}</span>
            {showSkeletonList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showSkeletonList && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 pt-2 border-t border-slate-100 animate-in fade-in duration-150">
            {sentences.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSelectedSkeletonId(s.id);
                  setShowSkeletonList(false);
                }}
                className={`text-left px-2.5 py-1.5 rounded-lg border text-xs transition-all truncate ${
                  selectedSkeletonId === s.id
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                }`}
              >
                <span className="opacity-75 mr-1">{s.id}.</span>
                <span>{s.en.join(' ')}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Step 2: Select Scenario & 5 Target Chinese Sentences + Custom Radio Option */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-extrabold text-slate-800">
            2. 选择应用场景与目标中文句 (Scenario)
          </h3>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCycleBatch}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>换一批 ({(batchIdx % batchesForCat.length) + 1}/{batchesForCat.length})</span>
            </button>
            <button
              type="button"
              onClick={handleGenerateAiExamples}
              disabled={loadingBatch}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold disabled:opacity-50"
            >
              {loadingBatch ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              <span>✨ AI新句</span>
            </button>
          </div>
        </div>

        {/* 4 Category Tabs */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: 'work', label: '工作' },
            { id: 'daily', label: '日常' },
            { id: 'living', label: '生活' },
            { id: 'travel', label: '旅游' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setScenarioCat(cat.id);
                setAiCustomBatch(null);
                setSelectedExampleIdx(0);
              }}
              className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                scenarioCat === cat.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 5 Preset Radio Options + 6th Custom Option */}
        <div className="space-y-1.5">
          {currentExamplesList.map((sentenceText, idx) => {
            const isSelected = selectedExampleIdx === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedExampleIdx(idx)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border cursor-pointer text-xs transition-all ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-bold'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-blue-600' : 'border-slate-400'
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                </span>
                <span>{sentenceText}</span>
              </div>
            );
          })}

          {/* 6th Option: Custom Target Sentence */}
          <div
            onClick={() => setSelectedExampleIdx('custom')}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border cursor-pointer text-xs transition-all ${
              selectedExampleIdx === 'custom'
                ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-bold'
                : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                selectedExampleIdx === 'custom' ? 'border-blue-600' : 'border-slate-400'
              }`}
            >
              {selectedExampleIdx === 'custom' && <span className="w-2 h-2 rounded-full bg-blue-600" />}
            </span>
            <span>✍️ 自定义中文目标句（点击此处输入你想表达的句子）</span>
          </div>
        </div>

        {/* Conditional Display: Only show input box when 'custom' is selected */}
        {selectedExampleIdx === 'custom' ? (
          <input
            type="text"
            value={customChineseInput}
            onChange={(e) => setCustomChineseInput(e.target.value)}
            placeholder="请输入你想翻译练习的中文句子..."
            autoFocus
            className="w-full px-3 py-2 rounded-lg border-2 border-blue-500 text-xs focus:outline-none bg-white"
          />
        ) : (
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
            <span>
              🎯 当前选中目标句：<strong className="text-slate-800">{activeChineseTarget}</strong>
            </span>
            <span className="text-blue-600 font-semibold">请直接前往下方第 3 步拼句或输入 ↓</span>
          </div>
        )}
      </div>

      {/* Step 3: Zero-Basis Lego Builder Mode OR Free Typing Mode */}
      <div className="bg-white rounded-xl border-l-4 border-l-blue-600 border border-slate-200 p-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-extrabold text-slate-800">
            3. 你的{langConfig.name}模块替换 (Your Translation)
          </h3>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setInputMode('lego')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                inputMode === 'lego'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🧩 零基础积木拼句
            </button>
            <button
              type="button"
              onClick={() => setInputMode('type')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                inputMode === 'type'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⌨️ 自由打字输入
            </button>
          </div>
        </div>

        {inputMode === 'lego' ? (
          <div className="space-y-2.5">
            {/* Assembled Sentence Tray */}
            <div className="min-h-[46px] p-2 rounded-xl bg-slate-50 border border-dashed border-slate-300 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedLegoTiles.length === 0 ? (
                  <span className="text-xs text-slate-400">
                    👇 请按语序点击下方词块积木组装句子（点击词块会自动朗读发音）...
                  </span>
                ) : (
                  selectedLegoTiles.map((tile, idx) => (
                    <button
                      key={`${tile.id}-${idx}`}
                      type="button"
                      onClick={() => handleRemoveLegoTile(idx)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center gap-1 shadow-2xs hover:bg-rose-600 transition-colors"
                      title="点击移除该词块"
                    >
                      <span>{tile.word}</span>
                      <X className="w-3 h-3 opacity-80" />
                    </button>
                  ))
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleFillRecommendedOrder}
                  className="px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold"
                >
                  💡 看骨架答案语序
                </button>
                {selectedLegoTiles.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLegoTiles([]);
                      setUserTranslation('');
                    }}
                    className="px-2 py-1 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold"
                  >
                    清空
                  </button>
                )}
              </div>
            </div>

            {/* Available Word Blocks */}
            <div className="flex flex-wrap gap-1.5">
              {legoData.blocks.map((block) => (
                <button
                  key={block.id}
                  type="button"
                  onClick={() => handleAddLegoTile(block)}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 transition-all shadow-2xs text-left"
                >
                  <div className="text-xs font-extrabold text-slate-900">{block.word}</div>
                  <div className="text-[10px] text-slate-400">{block.hint}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <textarea
            rows={2}
            value={userTranslation}
            onChange={(e) => setUserTranslation(e.target.value)}
            placeholder={`套用骨架 "${currentSkeleton.en.join(' ')}" 将上方中文翻译为${langConfig.name}...`}
            className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
          />
        )}
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleRunDiagnosis}
        disabled={loadingDiagnosis}
        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-60 transition-all"
      >
        {loadingDiagnosis ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>AI 正在诊断句型与生成母语替换句...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>AI 句型诊断替换与纠音</span>
          </>
        )}
      </button>

      {/* AI Diagnosis & Native Alternatives Result */}
      {diagnosisResult && (
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-3.5">
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-lg p-2.5 text-xs text-slate-700 leading-relaxed">
            <strong className="text-blue-700">🎯 AI 骨架诊断：</strong>
            {diagnosisResult.feedback}
          </div>

          {/* Standard Skeleton Match Sentence */}
          {(() => {
            const syncedStd = getSyncedSentenceData(diagnosisResult.standardSentence);
            const saved = isSentenceSaved(syncedStd.fullSentence);
            return (
              <div className="border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-emerald-700">
                    ✅ 标准骨架造句 (Standard Skeleton Match)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onToggleSaveSentence({
                        en: syncedStd.fullSentence,
                        cn: activeChineseTarget,
                        skeletonId: currentSkeleton.id,
                        tag: '标准骨架句'
                      })
                    }
                    className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                      saved
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {saved ? '★ 已收藏金句' : '☆ 收藏到金句本'}
                  </button>
                </div>

                <div className="flex items-center flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => speakText(syncedStd.fullSentence, 0.95)}
                    className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  {syncedStd.words.map((w, idx) => (
                    <WordWithTooltip key={idx} word={w} />
                  ))}
                  <button
                    type="button"
                    onClick={() => speakText(syncedStd.fullSentence, 0.62)}
                    className="px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10.5px] font-bold"
                  >
                    🐢 慢速
                  </button>
                </div>

                <PronunciationEvaluator
                  targetSentence={syncedStd.fullSentence}
                  targetLang={targetLang}
                  readCount={getReadCount(syncedStd.fullSentence)}
                  onIncrementCount={onIncrementReadCount}
                />
              </div>
            );
          })()}

          {/* Native Alternatives with Grammar & Register Comparison */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold text-slate-800">
              🌟 母语者高频同义替换句 (Native Alternatives & 语法对比)
            </h4>

            {(diagnosisResult.alternatives || []).map((alt, idx) => {
              const syncedAlt = getSyncedSentenceData(alt.sentence);
              const saved = isSentenceSaved(syncedAlt.fullSentence);
              return (
                <div
                  key={idx}
                  className="border border-slate-200/90 rounded-xl p-3 space-y-2 bg-slate-50/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => speakText(syncedAlt.fullSentence, 0.95)}
                        className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      {syncedAlt.words.map((w, wIdx) => (
                        <WordWithTooltip key={wIdx} word={w} />
                      ))}
                      <button
                        type="button"
                        onClick={() => speakText(syncedAlt.fullSentence, 0.62)}
                        className="px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10.5px] font-bold"
                      >
                        🐢 慢速
                      </button>
                      {alt.register && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10.5px] font-bold">
                          {alt.register}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onToggleSaveSentence({
                          en: syncedAlt.fullSentence,
                          cn: activeChineseTarget,
                          skeletonId: currentSkeleton.id,
                          tag: alt.register || '母语替换句'
                        })
                      }
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        saved
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {saved ? '★ 已收藏' : '☆ 收藏'}
                    </button>
                  </div>

                  {alt.grammarCompare && (
                    <div className="bg-amber-50/70 border border-amber-200/70 rounded-lg p-2 text-[11px] text-slate-700 leading-relaxed">
                      💡 <strong>语法与例句对比解析：</strong>
                      {alt.grammarCompare}
                    </div>
                  )}

                  <PronunciationEvaluator
                    targetSentence={syncedAlt.fullSentence}
                    targetLang={targetLang}
                    readCount={getReadCount(syncedAlt.fullSentence)}
                    onIncrementCount={onIncrementReadCount}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

