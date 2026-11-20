import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  RefreshCw,
  MessageSquare,
  Volume2,
  Layers,
  Map as MapIcon,
  PersonStanding,
  Bookmark,
  Settings,
  KeyRound
} from 'lucide-react';

import {
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage,
  LANGUAGE_CONFIG,
  setSpeechLang
} from './lib/core.js';

import { TabMap } from './components/TabMap.jsx';
import { TabZeroToOne } from './components/TabZeroToOne.jsx';
import { TabWords } from './components/TabWords.jsx';
import { TabPictures } from './components/TabPictures.jsx';
import { TabDeconstruction } from './components/TabDeconstruction.jsx';
import { TabSubstitution } from './components/TabSubstitution.jsx';
import { TabScenario } from './components/TabScenario.jsx';
import { ApiSettingsModal } from './components/ApiSettingsModal.jsx';

// --- Main App Component ---
export default function App() {
  const [targetLang, setTargetLang] = useState(() => loadFromStorage(STORAGE_KEYS.LANG, 'en'));
  const [activeTab, setActiveTab] = useState('map');

  const [readCounts, setReadCounts] = useState(() => loadFromStorage(STORAGE_KEYS.PROGRESS, {}));

  const [showApiModal, setShowApiModal] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => loadFromStorage(STORAGE_KEYS.API_KEY, ''));

  useEffect(() => {
    setSpeechLang((LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en).speechLang);
    saveToStorage(STORAGE_KEYS.LANG, targetLang);
  }, [targetLang]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROGRESS, readCounts);
  }, [readCounts]);

  const getReadCount = (sentence) => readCounts[sentence] || 0;

  const handleIncrementReadCount = (sentence) => {
    if (!sentence) return;
    setReadCounts((prev) => ({
      ...prev,
      [sentence]: (prev[sentence] || 0) + 1
    }));
  };

  const tabs = [
    { id: 'map', label: '0. 🗺️ 语言地图', icon: MapIcon },
    { id: 'zero', label: '1. 🗣️ 发音与辨音', icon: Volume2 },
    { id: 'words', label: '2. 🧱 3000词拼读', icon: Layers },
    { id: 'pictures', label: '3. 🚶 看图小人短句', icon: PersonStanding },
    { id: 'deconstruction', label: '4. 📖 12句拆解', icon: BookOpen },
    { id: 'substitution', label: '5. 🧩 句型替换与拼句', icon: RefreshCw },
    { id: 'scenario', label: '6. 💬 场景实战', icon: MessageSquare }
  ];

  const totalMastered = Object.values(readCounts).filter((c) => c >= 20).length;
  const langConfig = LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en;

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-stone-800 font-sans p-2 md:p-3 pb-24">
      <div className="max-w-7xl mx-auto space-y-2.5">
        {/* Compact Header */}
        <header className="bg-white rounded-2xl shadow-2xs border border-slate-200/90 px-3.5 py-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-900">
                  Deconstruction Dozen{' '}
                  <span className="text-blue-600">{langConfig.title}</span>
                </h1>
                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  {Object.values(LANGUAGE_CONFIG).map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setTargetLang(l.code)}
                      className={`px-2 py-0.5 rounded-md text-xs font-bold transition-all ${
                        targetLang === l.code
                          ? 'bg-white text-blue-600 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {l.flag} {l.name}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tim Ferriss 12句解构法 · {langConfig.name}从零破冰与肌肉记忆引擎 (已通关20遍句子:{' '}
                <strong className="text-emerald-600">{totalMastered}</strong>)
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowApiModal(true)}
              className="lg:hidden px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-bold flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>API</span>
            </button>
          </div>

          {/* Navigation Tabs + Settings */}
          <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-hidden">
            <nav className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/80 overflow-x-auto max-w-full scrollbar-none">
              {tabs.map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
                      active
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-stone-600 hover:bg-white/80 hover:text-stone-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={() => setShowApiModal(true)}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-200/80"
              title="配置自定义 API Key (BYOK)"
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>API设置</span>
            </button>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="bg-white rounded-2xl shadow-xs border border-stone-200/90 p-2.5 md:p-4">
          {activeTab === 'zero' && (
            <TabZeroToOne
              targetLang={targetLang}
              getReadCount={getReadCount}
              onIncrementReadCount={handleIncrementReadCount}
            />
          )}
          {activeTab === 'map' && <TabMap targetLang={targetLang} />}
          {activeTab === 'words' && <TabWords targetLang={targetLang} />}
          {activeTab === 'pictures' && (
            <TabPictures
              targetLang={targetLang}
              getReadCount={getReadCount}
              onIncrementReadCount={handleIncrementReadCount}
            />
          )}
          {activeTab === 'deconstruction' && (
            <TabDeconstruction
              targetLang={targetLang}
            />
          )}
          {activeTab === 'substitution' && (
            <TabSubstitution
              targetLang={targetLang}
              getReadCount={getReadCount}
              onIncrementReadCount={handleIncrementReadCount}
            />
          )}
          {activeTab === 'scenario' && (
            <TabScenario
              targetLang={targetLang}
            />
          )}
        </main>
      </div>

      {/* BYOK API Key Modal */}
      <ApiSettingsModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        customApiKey={customApiKey}
        setCustomApiKey={setCustomApiKey}
      />
    </div>
  );
}
