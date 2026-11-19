import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { speakText, playPurePhoneme, getWordAudioUrl, detectLang } from '../lib/core.js';
import { zeroToOneDataByLang } from '../data/zeroToOne.js';

// 语言地图的公用零件。地图只用来看、听、读：没有选项，没有跳转，点哪里读哪里。

// 龟速开关：整页共用。开着时所有点读都放慢。
let slowMode = false;
export const say = (text, rate = 0.85, langCode = null, audioUrl = null) => {
  const clean = String(text || '').replace(/[（(].*?[）)]/g, '').trim();
  const detectedLang = langCode || (detectLang(clean).split('-')[0]);
  const wordAudio = audioUrl || getWordAudioUrl(clean, detectedLang);
  return speakText(clean, slowMode ? 0.6 : rate, 1.0, null, detectedLang, wordAudio);
};

export const SlowToggle = () => {
  const [slow, setSlow] = useState(slowMode);
  return (
    <div className="lg:col-span-2 sticky top-1 z-10 flex justify-end pointer-events-none">
      <div className="pointer-events-auto flex gap-0.5 bg-white/95 backdrop-blur p-0.5 rounded-full border border-slate-300 shadow-sm">
        {[
          [false, '常速'],
          [true, '🐢 龟速']
        ].map(([val, label]) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              slowMode = val;
              setSlow(val);
            }}
            className={`px-3 py-1 rounded-full text-xs font-extrabold ${slow === val ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export const WholeLine = ({ text, audioUrl = null, langCode = null, children, className = '' }) => (
  <button
    type="button"
    onClick={() => say(text, 0.9, langCode, audioUrl)}
    className={`flex items-center gap-1 text-left active:opacity-60 ${className}`}
  >
    <Volume2 className="w-3 h-3 shrink-0 text-blue-500" />
    <span>{children}</span>
  </button>
);

export const Poster = ({ title, note, children, wide = false }) => (
  <section className={`bg-white border border-slate-200 rounded-2xl p-3 ${wide ? 'lg:col-span-2' : ''}`}>
    <h2 className="text-center text-xl font-black tracking-tight text-slate-900">{title}</h2>
    {note && <p className="text-center text-[11px] text-slate-500 mt-0.5 mb-2">{note}</p>}
    {children}
  </section>
);

export const SubTitle = ({ children }) => (
  <div className="text-xs font-black text-slate-700 mt-3 mb-1 flex items-center gap-2">
    <span>{children}</span>
    <span className="flex-1 border-t border-dashed border-slate-300" />
  </div>
);

// ---------- 数据驱动的挂图（英语、西语用） ----------

const TONES = {
  cyan: 'bg-cyan-100',
  yellow: 'bg-yellow-100',
  green: 'bg-emerald-100',
  rose: 'bg-rose-100',
  pink: 'bg-fuchsia-100',
  sky: 'bg-sky-100',
  amber: 'bg-amber-100',
  violet: 'bg-violet-100',
  gray: 'bg-slate-200'
};
const HEAD_TONES = {
  cyan: 'text-cyan-600',
  yellow: 'text-yellow-600',
  green: 'text-emerald-600',
  rose: 'text-rose-600',
  pink: 'text-fuchsia-600',
  sky: 'text-sky-600',
  amber: 'text-amber-600',
  violet: 'text-violet-600',
  gray: 'text-slate-500'
};

// 音标 / 字母发音表：直接用「发音与辨音」里已有的数据
const SoundsBlock = ({ lang }) => {
  const cats = (zeroToOneDataByLang[lang] || {}).phoneticCategories || [];
  return cats.map((cat, ci) => (
    <React.Fragment key={cat.id}>
      <SubTitle>{cat.name.replace(/\s*[(（].*$/, '')}</SubTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 border-t border-l border-dashed border-emerald-200">
        {cat.items.map((it, itemIdx) => {
          const key = it.char.startsWith('/') ? it.char.split(' ')[0] : it.char;
          const phonemeAudio = lang === 'en' ? null : `/audio/phonemes/${lang}/${cat.id}_${itemIdx}.mp3`;
          return (
            <div key={it.char} className="flex items-center gap-1.5 px-1 py-1 border-b border-r border-dashed border-emerald-200">
              <button
                type="button"
                onClick={() => (slowMode ? speakText(it.sound, 0.45, 1.0, null, lang, phonemeAudio) : playPurePhoneme(key, it.sound, lang, null, false, phonemeAudio))}
                className={`shrink-0 min-w-[2.6rem] max-w-[5rem] text-center font-black leading-none active:opacity-60 ${key.length > 5 ? 'text-xs' : 'text-lg'} ${
                  ci % 2 === 0 ? 'text-rose-600' : 'text-slate-900'
                }`}
              >
                {key}
              </button>
              <button type="button" onClick={() => say(it.sample, 0.85, lang)} className="min-w-0 text-left leading-tight active:opacity-60">
                <span className="block text-[10px] text-slate-400 truncate">{it.sub}</span>
                <span className="block text-xs font-bold text-slate-800 truncate">
                  {it.sample} <span className="font-normal text-slate-500">{it.sampleCn}</span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  ));
};

// 表格：cell 可以是 null（空）、字符串（行标签）、[词, 中文]
const TableBlock = ({ tpl, heads, headTones = [], colTones = [], rows, small, lang = 'en' }) => {
  const cols = heads ? heads.length : rows[0].length;
  return (
    <div className="grid gap-y-1 gap-x-0.5 text-center items-start" style={{ gridTemplateColumns: tpl || `repeat(${cols}, 1fr)` }}>
      {heads &&
        heads.map((h, i) => (
          <div key={i} className={`text-[11px] font-black pb-0.5 border-b-2 border-slate-800 ${HEAD_TONES[headTones[i]] || 'text-slate-700'}`}>
            {h}
          </div>
        ))}
      {rows.flatMap((row, ri) =>
        row.map((cell, ci) => {
          const k = `${ri}-${ci}`;
          if (cell == null) return <div key={k} />;
          if (typeof cell === 'string')
            return (
              <div key={k} className="self-center text-[10.5px] font-extrabold text-slate-500 text-left leading-tight">
                {cell}
              </div>
            );
          const [w, cn, tone] = cell;
          return (
            <button key={k} type="button" onClick={() => say(w, 0.9, lang)} className="active:opacity-60 pt-0.5">
              <div
                className={`inline-block px-1 rounded font-black leading-snug ${small ? 'text-[12px]' : 'text-[13px]'} ${
                  TONES[tone || colTones[ci]] || 'bg-slate-100'
                }`}
              >
                {w}
              </div>
              {cn && <div className="text-[10.5px] text-slate-600 leading-tight">{cn}</div>}
            </button>
          );
        })
      )}
    </div>
  );
};

const ROLE_TONE = {
  主语: ['text-rose-600', 'bg-rose-100 text-rose-800'],
  谓语: ['text-emerald-600', 'bg-emerald-100 text-emerald-800'],
  宾语: ['text-amber-600', 'bg-amber-100 text-amber-800'],
  修饰: ['text-cyan-600', 'bg-cyan-100 text-cyan-800'],
  同伴: ['text-sky-600', 'bg-sky-100 text-sky-800'],
  地点: ['text-fuchsia-600', 'bg-fuchsia-100 text-fuchsia-800'],
  时间: ['text-violet-600', 'bg-violet-100 text-violet-800']
};

// 一句话逐行长大。part = [角色, 词]；不在上表里的角色（冠词、介词）画成灰色虚线框
const LadderBlock = ({ lines, foot, lang = 'en', activeId = null }) => (
  <>
    <div className="space-y-2.5">
      {lines.map((line, li) => {
        const ladderId = `map-ladder-${li}`;
        const isCurrentActive = activeId === ladderId;
        const ladderAudioUrl = `/audio/map/${lang}/ladder_${li}.mp3`;
        const fullSentence = line.parts.map((p) => p[1]).join(' ');
        return (
          <div
            key={li}
            id={ladderId}
            className={`rounded-xl p-1.5 transition-all ${
              isCurrentActive ? 'ring-2 ring-blue-500 bg-blue-50/70 shadow-sm' : ''
            }`}
          >
            <div className="flex flex-wrap items-end gap-x-1 gap-y-1">
              {line.parts.map(([role, w], pi) => {
                const tone = ROLE_TONE[role];
                return (
                  <button
                    key={pi}
                    type="button"
                    onClick={() => say(w, 0.9, lang)}
                    className="inline-flex flex-col items-center active:opacity-60"
                  >
                    <span className={`text-[10px] font-extrabold leading-none mb-0.5 ${tone ? tone[0] : 'text-slate-400'}`}>
                      {role}
                    </span>
                    <span
                      className={`px-1 rounded text-[15px] font-black leading-snug ${
                        tone ? tone[1] : 'border border-dashed border-slate-400 text-slate-600'
                      }`}
                    >
                      {w}
                    </span>
                  </button>
                );
              })}
            </div>
            <WholeLine
              text={fullSentence}
              audioUrl={ladderAudioUrl}
              langCode={lang}
              className="text-xs text-slate-700 mt-0.5"
            >
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-800 text-white text-[10px] font-bold mr-1">
                {li + 1}
              </span>
              {line.cn}
            </WholeLine>
          </div>
        );
      })}
    </div>
    {foot && <div className="mt-2.5 pt-2 border-t border-dashed border-slate-300 text-xs text-slate-700 leading-relaxed">{foot}</div>}
  </>
);

const P_TONES = ['bg-emerald-100', 'bg-amber-100', 'bg-indigo-100', 'bg-teal-100', 'bg-rose-100', 'bg-lime-100', 'bg-sky-100', 'bg-orange-100', 'bg-yellow-100', 'bg-violet-100', 'bg-cyan-100', 'bg-pink-100'];

// 用法表：左边色块是小词，右边每行是 用法 / 例句 / 中文。例句按空格切开，逐词可点
const UsageBlock = ({ items, lang = 'en' }) => (
  <div className="lg:columns-2 lg:gap-3">
    {items.map((item, ii) => (
      <div key={item.p} className="flex border-b border-slate-200 break-inside-avoid">
        <button
          type="button"
          onClick={() => say(item.p, 0.9, lang)}
          className={`w-14 shrink-0 flex items-center justify-center text-sm font-black text-slate-900 ${P_TONES[ii % P_TONES.length]}`}
        >
          {item.p}
        </button>
        <div className="flex-1 min-w-0 divide-y divide-slate-100">
          {item.rows.map(([use, sentence, cn], ri) => (
            <div key={use} className="grid grid-cols-[5.2rem_1fr] gap-x-2 px-2 py-1 items-center">
              <span className={`text-[11px] leading-snug ${ri === 0 ? 'font-extrabold text-slate-900' : 'text-slate-500'}`}>{use}</span>
              <span>
                <span className="flex flex-wrap gap-x-1 text-[13px] font-bold text-slate-900 leading-snug">
                  {sentence.split(' ').map((word, wi) => (
                    <button
                      key={wi}
                      type="button"
                      onClick={() => say(word.replace(/[.,¿?¡!]/g, ''), 0.9, lang)}
                      className="rounded active:bg-amber-200 hover:bg-amber-100"
                    >
                      {word}
                    </button>
                  ))}
                </span>
                <WholeLine text={sentence} langCode={lang} className="text-[11px] text-slate-600 leading-snug">
                  {cn}
                </WholeLine>
              </span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const Block = ({ b, lang = 'en', activeId = null }) => {
  if (b.t === 'sub') return <SubTitle>{b.text}</SubTitle>;
  if (b.t === 'note') return <p className="text-xs text-slate-700 leading-relaxed mt-1.5">{b.text}</p>;
  if (b.t === 'sounds') return <SoundsBlock lang={b.lang || lang} />;
  if (b.t === 'table') return <TableBlock {...b} lang={lang} />;
  if (b.t === 'ladder') return <LadderBlock {...b} lang={lang} activeId={activeId} />;
  if (b.t === 'usage') return <UsageBlock {...b} lang={lang} />;
  return null;
};

/** spec.posters：第 1 张放左栏，中间几张叠在右栏，最后一张通栏。 */
export const DataMap = ({ spec, activeId = null, showSlowToggle = false }) => {
  const posters = spec.posters;
  const lang = spec.lang || 'en';
  const render = (p) => (
    <Poster key={p.title} title={p.title} note={p.note} wide={p.wide}>
      {p.blocks.map((b, i) => (
        <Block key={i} b={b} lang={lang} activeId={activeId} />
      ))}
    </Poster>
  );
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
      {showSlowToggle && <SlowToggle />}
      {render(posters[0])}
      <div className="space-y-3">{posters.slice(1, -1).map(render)}</div>
      {render({ ...posters[posters.length - 1], wide: true })}
    </div>
  );
};
