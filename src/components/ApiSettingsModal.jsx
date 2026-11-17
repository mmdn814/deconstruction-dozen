import React, { useState, useEffect } from 'react';
import { KeyRound, X, Check, Loader2, Server, Sparkles, HelpCircle } from 'lucide-react';
import { STORAGE_KEYS, loadFromStorage, saveToStorage, testApiConnection } from '../lib/core.js';

const PRESETS = [
  {
    name: 'DeepSeek 官方',
    provider: 'openai',
    endpoint: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    tip: '性价比极高，推荐中文纠音与场景对话'
  },
  {
    name: 'OpenAI 官方',
    provider: 'openai',
    endpoint: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    tip: '响应迅速，适合标准英语教学'
  },
  {
    name: 'Google Gemini',
    provider: 'gemini',
    endpoint: 'https://generativelanguage.googleapis.com',
    model: 'gemini-2.0-flash',
    tip: 'Google 原生免费/低成本模型'
  },
  {
    name: 'SiliconFlow 硅基流动',
    provider: 'openai',
    endpoint: 'https://api.siliconflow.cn/v1',
    model: 'deepseek-ai/DeepSeek-V3',
    tip: '国内直连极速稳定'
  },
  {
    name: 'Ollama (本地离线)',
    provider: 'openai',
    endpoint: 'http://localhost:11434/v1',
    model: 'llama3:8b',
    tip: '本地部署，无需网络'
  }
];

export const ApiSettingsModal = ({
  isOpen,
  onClose,
  customApiKey,
  setCustomApiKey
}) => {
  const [provider, setProvider] = useState(() => loadFromStorage(STORAGE_KEYS.API_PROVIDER, 'openai'));
  const [endpoint, setEndpoint] = useState(() => loadFromStorage(STORAGE_KEYS.API_ENDPOINT, 'https://api.openai.com/v1'));
  const [model, setModel] = useState(() => loadFromStorage(STORAGE_KEYS.API_MODEL, 'gpt-4o-mini'));
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setProvider(loadFromStorage(STORAGE_KEYS.API_PROVIDER, 'openai'));
      setEndpoint(loadFromStorage(STORAGE_KEYS.API_ENDPOINT, 'https://api.openai.com/v1'));
      setModel(loadFromStorage(STORAGE_KEYS.API_MODEL, 'gpt-4o-mini'));
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApplyPreset = (p) => {
    setProvider(p.provider);
    setEndpoint(p.endpoint);
    setModel(p.model);
    setTestResult(null);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testApiConnection({
      provider,
      endpoint,
      model,
      apiKey: customApiKey.trim()
    });
    setTesting(false);
    setTestResult(res);
  };

  const handleSave = () => {
    saveToStorage(STORAGE_KEYS.API_KEY, customApiKey.trim());
    saveToStorage(STORAGE_KEYS.API_PROVIDER, provider);
    saveToStorage(STORAGE_KEYS.API_ENDPOINT, endpoint.trim());
    saveToStorage(STORAGE_KEYS.API_MODEL, model.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 md:p-5 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                AI 大模型设置 (支持通用 OpenAI 协议 & Gemini)
              </h3>
              <p className="text-[11px] text-slate-500">
                Key 仅存储于当前浏览器本地，直接与大模型服务商通信
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>一键切换常用服务商配置：</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => {
              const active = provider === p.provider && endpoint === p.endpoint && model === p.model;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className={`px-2 py-1 rounded-lg text-[10.5px] font-bold transition-all border ${
                    active
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                  title={p.tip}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Form */}
        <div className="space-y-3 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
          {/* Provider Selection */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setProvider('openai')}
              className={`p-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                provider === 'openai'
                  ? 'bg-white text-blue-600 border-blue-500 shadow-2xs'
                  : 'bg-transparent text-slate-600 border-slate-200 hover:bg-white/50'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>OpenAI 兼容协议</span>
            </button>
            <button
              type="button"
              onClick={() => setProvider('gemini')}
              className={`p-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                provider === 'gemini'
                  ? 'bg-white text-blue-600 border-blue-500 shadow-2xs'
                  : 'bg-transparent text-slate-600 border-slate-200 hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Gemini 官方</span>
            </button>
          </div>

          {/* Endpoint (for OpenAI) */}
          {provider === 'openai' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span>API 接口地址 (Base URL)</span>
                <span className="text-[10px] text-slate-400 font-normal">需以 /v1 结尾</span>
              </div>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="https://api.openai.com/v1 或 https://api.deepseek.com/v1"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Model Name */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span>模型名称 (Model)</span>
              <span className="text-[10px] text-slate-400 font-normal">支持直接手动输入任意模型</span>
            </div>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={provider === 'gemini' ? 'gemini-2.0-flash' : 'gpt-4o-mini 或 deepseek-chat'}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* API Key */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span>API Key</span>
              <span className="text-[10px] text-emerald-600 font-normal flex items-center gap-0.5">
                <Check className="w-3 h-3" /> 本地安全存储
              </span>
            </div>
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="sk-... 或 AIzaSy..."
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`p-2 rounded-lg text-xs flex items-center gap-1.5 ${
              testResult.ok
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {testResult.ok ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>连接成功！大模型接口通信正常，已可开始对话。</span>
              </>
            ) : (
              <>
                <X className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="truncate">连接失败: {testResult.error}</span>
              </>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            disabled={testing || !customApiKey.trim()}
            onClick={handleTest}
            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 transition-colors"
          >
            {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Server className="w-3.5 h-3.5 text-slate-500" />}
            <span>测试连接</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition-colors"
            >
              保存并生效
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
