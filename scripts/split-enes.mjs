// 把 scripts/wordsrc/<主题>.txt（英语|西语|中文）拆成两种语言各自的词表。
// 英语音标来自 scripts/en-ipa.json（由 scripts/en-ipa.swift 生成）；西语的拼读在运行时按规则计算，不需要读音列。
// 用法：node scripts/split-enes.mjs
import fs from 'fs';
import path from 'path';

const src = path.resolve('scripts/wordsrc');
const ipaFile = path.resolve('scripts/en-ipa.json');
const ipa = fs.existsSync(ipaFile) ? JSON.parse(fs.readFileSync(ipaFile, 'utf8')) : {};
const out = { en: {}, es: {} };
const seen = { en: new Map(), es: new Map() };
const dropped = { en: [], es: [] };
const missingIpa = [];

for (const file of fs.readdirSync(src).filter((f) => f.endsWith('.txt')).sort()) {
  const theme = file.replace(/\.txt$/, '');
  out.en[theme] = [];
  out.es[theme] = [];
  for (const line of fs.readFileSync(path.join(src, file), 'utf8').split('\n')) {
    if (!line.trim()) continue;
    const [en, es, cn] = line.split('|').map((x) => x.trim());
    if (!en || !es || !cn) throw new Error(`格式错误 ${file}: ${line}`);
    if (seen.en.has(en)) dropped.en.push(`${en} (${seen.en.get(en)} / ${theme})`);
    else {
      seen.en.set(en, theme);
      if (!ipa[en]) missingIpa.push(en);
      out.en[theme].push(`${en}|${ipa[en] || ''}|${cn}`);
    }
    if (seen.es.has(es)) dropped.es.push(`${es} (${seen.es.get(es)} / ${theme})`);
    else {
      seen.es.set(es, theme);
      out.es[theme].push(`${es}||${cn}`);
    }
  }
}

for (const lang of ['en', 'es']) {
  const dir = path.resolve('src/data/words', lang);
  fs.mkdirSync(dir, { recursive: true });
  for (const [theme, lines] of Object.entries(out[lang])) fs.writeFileSync(path.join(dir, `${theme}.txt`), lines.join('\n') + '\n');
  console.log(`${lang}: ${seen[lang].size} 词；重复被去掉 ${dropped[lang].length} 个${dropped[lang].length ? '：' + dropped[lang].join('、') : ''}`);
}
fs.writeFileSync(path.resolve('scripts/en-words.txt'), [...seen.en.keys()].join('\n') + '\n');
console.log(`英语缺音标：${missingIpa.length} 个`);
