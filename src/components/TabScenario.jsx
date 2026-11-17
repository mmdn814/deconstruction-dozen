import React, { useState, useEffect } from 'react';
import { Volume2, Send, Loader2 } from 'lucide-react';
import { LANGUAGE_CONFIG, speakText, callGemini } from '../lib/core.js';
import { personasByLang } from '../data/personas.js';

export const TabScenario = ({ targetLang, isSentenceSaved, onToggleSaveSentence }) => {
  const langConfig = LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en;

  const personas = personasByLang[targetLang] || personasByLang.en;
  const [selectedPersonaId, setSelectedPersonaId] = useState(personas[0].id);
  const activePersona = personas.find((p) => p.id === selectedPersonaId) || personas[0];

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);
  const [autoSpeakAi, setAutoSpeakAi] = useState(true);
  const [showTransMap, setShowTransMap] = useState({});
  const [scaffold, setScaffold] = useState({
    hint: activePersona.scaffoldHint,
    sample: activePersona.sampleReply
  });

  useEffect(() => {
    const first = (personasByLang[targetLang] || personasByLang.en)[0];
    setSelectedPersonaId(first.id);
    setMessages([
      {
        id: 'init-1',
        role: 'ai',
        text: first.opening,
        cn: first.openingCn
      }
    ]);
    setScaffold({
      hint: first.scaffoldHint,
      sample: first.sampleReply
    });
  }, [targetLang]);

  const handleSelectPersona = (p) => {
    setSelectedPersonaId(p.id);
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'ai',
        text: p.opening,
        cn: p.openingCn
      }
    ]);
    setScaffold({
      hint: p.scaffoldHint,
      sample: p.sampleReply
    });
  };

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text || loadingReply) return;

    const userMsgId = `user-${Date.now()}`;
    const newUserMsg = { id: userMsgId, role: 'user', text, coachTip: null, upgraded: null };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputText('');
    setLoadingReply(true);

    const historyText = messages
      .slice(-4)
      .map((m) => `${m.role === 'ai' ? activePersona.name : 'User'}: ${m.text}`)
      .join('\n');

    const prompt = `
      你正在扮演：${activePersona.name} (${activePersona.role})，使用地道自然的${langConfig.name}与用户进行真人对话。
      近期对话记录：
      ${historyText}
      User 刚刚说: "${text}"

      请严格返回 JSON 格式（将对话与教练点评完全分离）：
      1. reply: 你作为 ${activePersona.name} 的自然口语回复（仅包含纯粹地道的${langConfig.name}口语，带真实语气词，绝不夹杂中文或语法说教，1~2句话）。
      2. replyCn: 该回复的自然中文翻译。
      3. coachWhisper: 用中文简短点评用户刚才那句话的语法/语序（30字内）。
      4. nativeUpgrade: 把用户刚才那句话润色成更地道的母语者表达（仅${langConfig.name}句子）。
      5. nextScaffoldHint: 提示用户下一句可以套用12句中的什么结构来接话。
      6. nextSampleReply: 给出一句供用户参考的下一句${langConfig.name}回答示例。
    `;

    const schema = {
      type: 'OBJECT',
      properties: {
        reply: { type: 'STRING' },
        replyCn: { type: 'STRING' },
        coachWhisper: { type: 'STRING' },
        nativeUpgrade: { type: 'STRING' },
        nextScaffoldHint: { type: 'STRING' },
        nextSampleReply: { type: 'STRING' }
      },
      required: ['reply', 'replyCn', 'coachWhisper', 'nativeUpgrade', 'nextScaffoldHint', 'nextSampleReply']
    };

    const res = await callGemini(prompt, `你是地道的${langConfig.name}母语对话伙伴与幕后教练。`, schema);
    if (res) {
      try {
        const parsed = JSON.parse(res);
        setMessages((prev) =>
          prev
            .map((m) =>
              m.id === userMsgId
                ? { ...m, coachTip: parsed.coachWhisper, upgraded: parsed.nativeUpgrade }
                : m
            )
            .concat({
              id: `ai-${Date.now()}`,
              role: 'ai',
              text: parsed.reply,
              cn: parsed.replyCn
            })
        );
        setScaffold({
          hint: parsed.nextScaffoldHint,
          sample: parsed.nextSampleReply
        });
        if (autoSpeakAi) {
          speakText(parsed.reply, 0.96, 1.0, null, langConfig.speechLang);
        }
      } catch (e) {}
    }
    setLoadingReply(false);
  };

  return (
    <div className="space-y-3">
      {/* Top Bar: Persona Switcher & Auto-Speak Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        <div className="flex flex-wrap gap-1.5">
          {personas.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectPersona(p)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedPersonaId === p.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setAutoSpeakAi((v) => !v)}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
            autoSpeakAi
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-white text-slate-500 border-slate-200'
          }`}
        >
          {autoSpeakAi ? '🔊 对方自动开口说: 开启' : '🔇 对方自动开口说: 关闭'}
        </button>
      </div>

      {/* Chat Messages Stream */}
      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 space-y-3 max-h-[380px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs space-y-1.5 shadow-2xs ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs'
                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[10.5px] opacity-75">
                  {msg.role === 'user' ? '你 (You)' : activePersona.name}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => speakText(msg.text, 0.95, 1.0, null, langConfig.speechLang)}
                    className={`p-1 rounded-full ${
                      msg.role === 'user'
                        ? 'hover:bg-blue-500 text-white'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                    }`}
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => speakText(msg.text, 0.62, 1.0, null, langConfig.speechLang)}
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      msg.role === 'user'
                        ? 'bg-blue-700 text-amber-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    🐢 慢速
                  </button>
                  {msg.cn && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowTransMap((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }))
                      }
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                    >
                      {showTransMap[msg.id] ? '隐藏译文' : '看译文'}
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs md:text-sm font-semibold leading-relaxed">{msg.text}</p>

              {msg.cn && showTransMap[msg.id] && (
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  {msg.cn}
                </p>
              )}
            </div>

            {/* Coach Whisper Box Under User Message */}
            {msg.role === 'user' && (msg.coachTip || msg.upgraded) && (
              <div className="mt-1.5 max-w-[85%] bg-amber-50/90 border border-amber-200 rounded-xl px-3 py-2 text-[11px] text-slate-700 space-y-1">
                {msg.coachTip && (
                  <div>
                    <strong className="text-amber-800">💡 教练悄悄话：</strong>
                    {msg.coachTip}
                  </div>
                )}
                {msg.upgraded && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-amber-200/60">
                    <div>
                      <span className="font-bold text-emerald-700">✨ 更地道表达：</span>
                      <span className="font-extrabold text-slate-900">{msg.upgraded}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => speakText(msg.upgraded, 0.95, 1.0, null, langConfig.speechLang)}
                        className="px-1.5 py-0.5 rounded bg-white text-blue-600 border border-blue-200 text-[10px] font-bold"
                      >
                        🔊 朗读
                      </button>
                      <button
                        type="button"
                        onClick={() => speakText(msg.upgraded, 0.62, 1.0, null, langConfig.speechLang)}
                        className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold"
                      >
                        🐢 慢速
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onToggleSaveSentence({
                            en: msg.upgraded,
                            cn: '场景实战地道升级句',
                            skeletonId: 1,
                            tag: '实战好句'
                          })
                        }
                        className="px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200 text-[10px] font-bold"
                      >
                        {isSentenceSaved(msg.upgraded) ? '★ 已收藏' : '☆ 收藏'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dynamic Response Scaffold Hint Bar */}
      <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="text-indigo-950">
          <span className="font-extrabold text-indigo-700">💡 接话灵感：</span>
          <span>{scaffold.hint}</span>
        </div>
        <button
          type="button"
          onClick={() => setInputText(scaffold.sample)}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-[11px] shrink-0"
        >
          ✨ 填入参考句
        </button>
      </div>

      {/* Input Row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={`用${langConfig.name}回复 ${activePersona.name}...`}
          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={loadingReply}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
        >
          {loadingReply ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>发送</span>
        </button>
      </div>
    </div>
  );
};

