import React from 'react';
import { say, SlowToggle, WholeLine, Poster, SubTitle, DataMap } from './mapKit.jsx';
import { MAP_EN } from '../data/langMapEn.js';
import { MAP_ES } from '../data/langMapEs.js';
import {
  KANA_TABLES,
  YOON_ROWS,
  toKatakana,
  ROLE_STYLE,
  SENTENCE_PARTS,
  PARTICLES,
  VERB_FORMS,
  VERBS,
  ADJ_GRIDS,
  PRONOUNS,
  KOSOADO,
  QUESTION_WORDS
} from '../data/langMapJa.js';

// 语言地图：五张「挂图」，只用来看、听、读。没有选项，没有跳转，点哪里读哪里。

// 把例句切成「词 + 后面跟着的助词」的小块，方便一块一块点读。
// reading 是用空格分好的假名；块数对得上时，就用假名来读，读音更准。
const splitChunks = (ja, reading) => {
  if (typeof Intl === 'undefined' || !Intl.Segmenter) return [{ text: ja, speak: ja }];
  const chunks = [];
  for (const { segment } of new Intl.Segmenter('ja', { granularity: 'word' }).segment(ja)) {
    const isPunct = /^[。、？！\s]+$/.test(segment);
    const startsNew = !isPunct && /[^\u3041-\u309f]/.test(segment);
    if (startsNew || chunks.length === 0) chunks.push({ text: segment });
    else chunks[chunks.length - 1].text += segment;
  }
  const kana = String(reading || '').replace(/[。、]/g, ' ').split(/\s+/).filter(Boolean);
  return chunks.map((c, i) => ({ text: c.text, speak: kana.length === chunks.length ? kana[i] : c.text.replace(/[。、？！]/g, '') }));
};

// 只给汉字部分标假名：食べる → 食(た)べる
const Ruby = ({ w, r }) => {
  if (!r || r === w) return <>{w}</>;
  let n = 0;
  while (n < w.length && n < r.length && w[w.length - 1 - n] === r[r.length - 1 - n]) n += 1;
  const head = w.slice(0, w.length - n);
  const tail = w.slice(w.length - n);
  if (!head) return <>{w}</>;
  return (
    <>
      <ruby>
        {head}
        <rt className="text-[0.55em] font-semibold text-slate-500">{r.slice(0, r.length - n)}</rt>
      </ruby>
      {tail}
    </>
  );
};

// --- 1. 五十音图 ---
const KanaCell = ({ cell, first }) =>
  cell ? (
    <button
      type="button"
      onClick={() => say(cell.k, 0.8)}
      className="flex items-baseline justify-center gap-1 py-1 border-b border-r border-dashed border-emerald-200 active:bg-emerald-50"
    >
      <span className={`text-2xl font-black leading-none ${first ? 'text-slate-900' : 'text-rose-600'}`}>{cell.k}</span>
      <span className="text-xs font-bold text-slate-400 leading-none">{toKatakana(cell.k)}</span>
      <span className="text-[11px] text-slate-600 leading-none">{cell.r}</span>
    </button>
  ) : (
    <div className="border-b border-r border-dashed border-emerald-200" />
  );

const KanaPoster = () => (
  <Poster title="日语五十音图" note="大字是平假名，小灰字是片假名，读音一样。点一下就读。">
    {KANA_TABLES.map((table, ti) => (
      <React.Fragment key={table.id}>
        {ti > 0 && <SubTitle>浊音 · 半浊音</SubTitle>}
        <div className="grid grid-cols-5 border-t border-l border-dashed border-emerald-200">
          {table.rows.map((r, ri) => r.map((cell, ci) => <KanaCell key={`${ri}-${ci}`} cell={cell} first={ci === 0} />))}
        </div>
      </React.Fragment>
    ))}
    <SubTitle>拗音（两个假名读成一个音）</SubTitle>
    <div className="grid grid-cols-3 border-t border-l border-dashed border-emerald-200">
      {YOON_ROWS.flatMap((r) => [0, 2, 4].map((i) => ({ k: r[i], r: r[i + 1] }))).map((cell, i) => (
        <button
          key={cell.k}
          type="button"
          onClick={() => say(cell.k, 0.8)}
          className="flex items-baseline justify-center gap-1.5 py-1 border-b border-r border-dashed border-emerald-200 active:bg-emerald-50"
        >
          <span className={`text-lg font-black leading-none ${i % 3 === 0 ? 'text-slate-900' : 'text-rose-600'}`}>{cell.k}</span>
          <span className="text-[11px] text-slate-600 leading-none">{cell.r}</span>
        </button>
      ))}
    </div>
  </Poster>
);

// --- 2. 句子成分 ---
const STAGES = [
  { ids: ['subj', 'obj', 'verb'], cn: '我喝了啤酒。' },
  { ids: ['subj', 'time', 'obj', 'verb'], cn: '我晚上8点喝了啤酒。' },
  { ids: ['subj', 'time', 'place', 'obj', 'verb'], cn: '我晚上8点在居酒屋喝了啤酒。' },
  { ids: ['subj', 'time', 'place', 'with', 'obj', 'verb'], cn: '我晚上8点在居酒屋和朋友喝了啤酒。' },
  { ids: ['subj', 'time', 'place', 'with', 'mod', 'obj', 'verb'], cn: '我晚上8点在居酒屋和朋友喝了冰啤酒。' }
];

const ROLE_TEXT = {
  主语: 'text-rose-600',
  时间: 'text-violet-600',
  地点: 'text-fuchsia-600',
  同伴: 'text-sky-600',
  修饰: 'text-cyan-600',
  宾语: 'text-amber-600',
  谓语: 'text-emerald-600'
};

const PARTICLE_GLOSS = { は: '谁', に: '几点', で: '在哪', と: '和谁', を: '对象' };

const SentencePoster = () => (
  <Poster title="一分钟看懂日语句子" note="彩色是词，灰色虚线框是「助词」：贴在前一个词后面，标明它的角色。点词读单个词，点中文读整句。">
    <div className="space-y-2.5">
      {STAGES.map((stage, si) => {
        const parts = stage.ids.map((id) => SENTENCE_PARTS.find((p) => p.id === id));
        const text = parts.map((p) => p.w + p.p).join('') + '。';
        return (
          <div key={si}>
            <div className="flex flex-wrap items-end gap-x-1 gap-y-1">
              {parts.map((p) => (
                <React.Fragment key={p.id}>
                  <button type="button" onClick={() => say(p.r, 0.9, 'ja')} className="inline-flex flex-col items-center active:opacity-60">
                    <span className={`text-[10px] font-extrabold leading-none ${ROLE_TEXT[p.role]}`}>{p.role}</span>
                    <span className="text-[9px] font-semibold text-slate-500 leading-none h-2.5 mt-0.5">{p.r !== p.w ? p.r : ''}</span>
                    <span className={`px-1 rounded text-[15px] font-black leading-snug ${ROLE_STYLE[p.role].replace(/border-\S+/, '')}`}>
                      {p.w}
                    </span>
                  </button>
                  {p.p && (
                    <button
                      type="button"
                      onClick={() => say(p.r + p.p, 0.9, 'ja')}
                      className="inline-flex flex-col items-center active:opacity-60"
                    >
                      <span className="text-[10px] font-bold leading-none text-slate-400">助词</span>
                      <span className="text-[9px] leading-none h-2.5 mt-0.5 text-slate-400">{PARTICLE_GLOSS[p.p]}</span>
                      <span className="px-1 rounded border border-dashed border-slate-400 text-[15px] font-black text-slate-600 leading-snug">
                        {p.p}
                      </span>
                    </button>
                  )}
                </React.Fragment>
              ))}
              <span className="text-[15px] font-bold text-slate-500 leading-snug">。</span>
            </div>
            <WholeLine
              text={text}
              audioUrl={`/audio/map/ja/ladder_${si}.mp3`}
              langCode="ja"
              className="text-xs text-slate-700 mt-0.5"
            >
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-800 text-white text-[10px] font-bold mr-1">
                {si + 1}
              </span>
              {stage.cn}
            </WholeLine>
          </div>
        );
      })}
    </div>
    <div className="mt-2.5 pt-2 border-t border-dashed border-slate-300 text-xs text-slate-700 leading-relaxed">
      <strong>动词永远在最后。</strong>
      助词贴在词的后面：<strong>は</strong> 谁　<strong>に</strong> 几点　<strong>で</strong> 在哪　<strong>と</strong> 和谁　<strong>を</strong> 做什么
    </div>
  </Poster>
);

// --- 3. 时态 ---
const FORM_HEAD = ['text-cyan-600', 'text-yellow-600', 'text-emerald-600', 'text-rose-600', 'text-fuchsia-600'];
const FORM_BG = ['bg-cyan-100', 'bg-yellow-100', 'bg-emerald-100', 'bg-rose-100', 'bg-fuchsia-100'];

const verbCn = (verb, i) => {
  if (i === 2 && verb.cn === '去') return '去了(人在那)';
  if (i === 2 && verb.cn === '来') return '已经来了';
  return [verb.cn, verb.cn, `正在${verb.cn}`, `${verb.cn}了`, `不${verb.cn}`][i];
};

const TensePoster = () => (
  <Poster title="一张图看懂日语时态" note="横着看：同一个动词怎么变。礼貌形意思不变，只是说得客气。">
    <div className="grid gap-y-1 text-center" style={{ gridTemplateColumns: '1fr 1.1fr 1.4fr 1fr 1.1fr' }}>
      {VERB_FORMS.map((f, i) => (
        <div key={f.id} className={`text-xs font-black pb-1 border-b-2 border-slate-800 ${FORM_HEAD[i]}`}>
          {f.name.replace(' / 状态', '')}
        </div>
      ))}
      {VERBS.map((verb) =>
        verb.forms.map((f, i) => (
          <button key={f.w} type="button" onClick={() => say(f.w)} className="active:opacity-60 pt-1">
            <div className={`inline-block px-0.5 rounded text-[12px] font-black leading-snug whitespace-nowrap ${FORM_BG[i]}`}>
              <Ruby w={f.w} r={f.r} />
            </div>
            <div className="text-[10.5px] text-slate-600 leading-tight">{verbCn(verb, i)}</div>
          </button>
        ))
      )}
    </div>

    <SubTitle>形容词、名词也是同样四种</SubTitle>
    <div className="grid gap-y-1 text-center" style={{ gridTemplateColumns: '0.8fr 1.1fr 1fr 1.45fr' }}>
      {['现在', '否定', '过去', '过去否定'].map((h, i) => (
        <div key={h} className={`text-[11px] font-black ${['text-cyan-600', 'text-fuchsia-600', 'text-rose-600', 'text-slate-500'][i]}`}>
          {h}
        </div>
      ))}
      {ADJ_GRIDS.map((g) =>
        g.cells.map((c, i) => (
          <button key={c[0]} type="button" onClick={() => say(c[0])} className="active:opacity-60 pt-1">
            <div
              className={`inline-block px-0.5 rounded text-[11.5px] font-black leading-snug whitespace-nowrap ${
                ['bg-cyan-100', 'bg-fuchsia-100', 'bg-rose-100', 'bg-slate-200'][i]
              }`}
            >
              <Ruby w={c[0]} r={c[1]} />
            </div>
            <div className="text-[10.5px] text-slate-600 leading-tight">{c[2]}</div>
          </button>
        ))
      )}
    </div>
  </Poster>
);

// --- 4. 语法体系：人称、こそあど、疑问词 ---
const Word = ({ w, r, cn, tone }) => (
  <button type="button" onClick={() => say(r && r !== w ? r.split(' / ')[0] : w)} className="flex items-baseline gap-1.5 text-left active:opacity-60">
    <span className={`px-1 rounded text-sm font-black text-slate-900 ${tone}`}>
      <Ruby w={w} r={r ? r.split(' / ')[0] : ''} />
    </span>
    <span className="text-[11px] text-slate-600">{cn}</span>
  </button>
);

const TONES = ['bg-sky-100', 'bg-fuchsia-100', 'bg-emerald-100', 'bg-amber-100'];

const SystemPoster = () => (
  <Poster title="日语的小零件" note="每句话都会用到的词，数量不多。">
    <SubTitle>人称</SubTitle>
    <div className="grid grid-cols-3 gap-x-2">
      {PRONOUNS.map((g) => (
        <div key={g.title} className="space-y-1">
          <div className="text-[10.5px] font-extrabold text-slate-400">{g.title}</div>
          {g.items.map((it, i) => (
            <Word key={it.w} w={it.w} r={it.r} cn={it.cn.replace(/（.*）/, '')} tone={TONES[i % 4]} />
          ))}
        </div>
      ))}
    </div>

    <SubTitle>こ · そ · あ · ど（这 / 那 / 那边 / 哪）</SubTitle>
    <div className="grid gap-y-1 text-center" style={{ gridTemplateColumns: '2.6rem repeat(4, 1fr)' }}>
      <div />
      {['近我', '近你', '都远', '疑问'].map((h) => (
        <div key={h} className="text-[10.5px] font-extrabold text-slate-400">
          {h}
        </div>
      ))}
      {KOSOADO.rows.map((r) => (
        <React.Fragment key={r.name}>
          <div className="text-[10.5px] font-extrabold text-slate-400 self-center text-left">{r.name}</div>
          {r.cells.map((c, i) => (
            <button key={c.w} type="button" onClick={() => say(c.w)} className="active:opacity-60">
              <span className={`px-1 rounded text-sm font-black text-slate-900 ${TONES[i]}`}>{c.w}</span>
              <div className="text-[10.5px] text-slate-600 leading-tight">{c.cn}</div>
            </button>
          ))}
        </React.Fragment>
      ))}
    </div>

    <SubTitle>疑问词</SubTitle>
    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
      {QUESTION_WORDS.map((q, i) => (
        <Word key={q.w} w={q.w} r={q.r} cn={`问${q.cn.replace(/（.*）/, '')}`} tone={TONES[i % 4]} />
      ))}
    </div>
  </Poster>
);

// --- 5. 助词 ---
const P_TONES = [
  'bg-emerald-100',
  'bg-amber-100',
  'bg-indigo-100',
  'bg-teal-100',
  'bg-rose-100',
  'bg-lime-100',
  'bg-sky-100',
  'bg-orange-100',
  'bg-yellow-100',
  'bg-violet-100',
  'bg-cyan-100',
  'bg-pink-100'
];

const ParticlePoster = () => (
  <Poster title="助词一览" note="每个助词第一行是最常用的意思。点词读单个词，点下面的中文读整句。" wide>
    <div className="lg:columns-2 lg:gap-3">
      {PARTICLES.map((item, pi) => {
        const rows = [[item.core, item.main], ...item.more];
        return (
          <div key={item.p} className="flex border-b border-slate-200 break-inside-avoid">
            <button
              type="button"
              onClick={() => say(item.p, 0.8)}
              className={`w-11 shrink-0 flex items-center justify-center text-lg font-black text-slate-900 ${P_TONES[pi % P_TONES.length]}`}
            >
              {item.p}
            </button>
            <div className="flex-1 min-w-0 divide-y divide-slate-100">
              {rows.map(([use, e], ri) => (
                <div key={use} className="grid grid-cols-[5.6rem_1fr] gap-x-2 px-2 py-1 items-center">
                  <span className={`text-[11px] leading-snug ${ri === 0 ? 'font-extrabold text-slate-900' : 'text-slate-500'}`}>{use}</span>
                  <span>
                    <span className="flex flex-wrap text-[13px] font-bold text-slate-900 leading-snug">
                      {splitChunks(e.ja, e.r).map((c, ci) => (
                        <button
                          key={ci}
                          type="button"
                          onClick={() => say(c.speak)}
                          className="rounded px-0.5 -mx-0.5 active:bg-amber-200 hover:bg-amber-100"
                        >
                          {c.text}
                        </button>
                      ))}
                    </span>
                    <WholeLine text={e.ja} className="text-[11px] text-slate-600 leading-snug">
                      {e.cn}
                    </WholeLine>
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </Poster>
);

export const TabMap = ({ targetLang }) => {
  if (targetLang === 'en') return <DataMap spec={MAP_EN} />;
  if (targetLang === 'es') return <DataMap spec={MAP_ES} />;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
      <SlowToggle />
      <KanaPoster />
      <div className="space-y-3">
        <SentencePoster />
        <TensePoster />
        <SystemPoster />
      </div>
      <ParticlePoster />
    </div>
  );
};
