// 把 en-lookup 的结果（macOS 词典的美式发音标注）换算成国际音标，写入 scripts/en-ipa.json。
// 用法：node scripts/en-ipa.mjs <lookup.tsv>
import fs from 'fs';

const MAP = [
  ['T͟H', 'ð'], ['TH', 'θ'], ['CH', 'tʃ'], ['SH', 'ʃ'], ['ZH', 'ʒ'], ['NG', 'ŋ'], ['KH', 'k'],
  ['o͝o', 'ʊ'], ['o͞o', 'uː'], ['oi', 'ɔɪ'], ['ou', 'aʊ'],
  ['ā', 'eɪ'], ['ä', 'ɑː'], ['ē', 'iː'], ['ī', 'aɪ'], ['ō', 'oʊ'], ['ô', 'ɔː'],
  ['ər', null], ['ə', null], ['a', 'æ'], ['e', 'e'], ['i', 'ɪ'],
  ['y', 'j'], ['j', 'dʒ'], ['ɡ', 'g'], ['N', 'n']
];
const VOWEL_KEYS = new Set(['o͝o', 'o͞o', 'oi', 'ou', 'ā', 'ä', 'ē', 'ī', 'ō', 'ô', 'ər', 'ə', 'a', 'e', 'i']);
const WEAK_WORDS = new Set(['the', 'a', 'an', 'of']);

const convert = (resp, word) => {
  // 括号里是可省略的音：弱读的 ə 保留；辅音只在拼写里有这个字母时保留（answer 的 (t) 去掉，twenty 的保留）
  const r = resp
    .split(/[,;]/)[0]
    .replace(/\(h\)w/g, 'w')
    .replace(/\((.*?)\)/g, (_, x) => (x === 'ə' || word.toLowerCase().includes(x.toLowerCase()) ? x : ''))
    .replace(/\s/g, '')
    .normalize('NFC');
  const tokens = [];
  for (let i = 0; i < r.length; ) {
    if (r[i] === 'ˈ' || r[i] === 'ˌ') { tokens.push({ mark: r[i] }); i += 1; continue; }
    const hit = MAP.find(([k]) => r.startsWith(k, i));
    if (hit) { tokens.push({ key: hit[0], ipa: hit[1] }); i += hit[0].length; }
    else { tokens.push({ key: r[i], ipa: r[i].toLowerCase() }); i += 1; }
  }
  const vowels = tokens.filter((t) => VOWEL_KEYS.has(t.key));
  const mono = vowels.length === 1 && !tokens.some((t) => t.mark) && !WEAK_WORDS.has(word.toLowerCase());
  let stressed = false;
  let out = '';
  tokens.forEach((t) => {
    if (t.mark) { stressed = true; out += t.mark; return; }
    const isVowel = VOWEL_KEYS.has(t.key);
    const strong = isVowel && (stressed || mono);
    if (t.key === 'ər') out += strong ? 'ɜːr' : 'ər';
    else if (t.key === 'ə') out += strong ? 'ʌ' : 'ə';
    else out += t.ipa;
    if (isVowel) stressed = false;
  });
  // 词典把美音里弹舌的 t 写成 d，这里按拼写改回 t
  const letters = [...word.toLowerCase().replace(/th/g, '').replace(/tt/g, 't').replace(/dd/g, 'd')].filter((c) => c === 't' || c === 'd');
  const idx = [];
  for (let i = 0; i < out.length; i += 1) {
    if (out[i] === 't' && out[i + 1] === 'ʃ') continue;
    if (out[i] === 'd' && out[i + 1] === 'ʒ') continue;
    if (out[i] === 't' || out[i] === 'd') idx.push(i);
  }
  const chars = [...out];
  if (!letters.includes('d')) idx.forEach((i) => { chars[i] = 't'; });
  else if (letters.length === idx.length) idx.forEach((i, n) => { if (chars[i] === 'd' && letters[n] === 't') chars[i] = 't'; });
  return chars.join('');
};

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const dict = {};
const flagged = [];
for (const line of fs.readFileSync(process.argv[2], 'utf8').split('\n')) {
  if (!line) continue;
  const [w, def] = line.split('\t');
  const first = def.match(/^(.*?) \| ([^|]+) \|/);
  if (!first) { flagged.push(`${w}: 没有发音`); continue; }
  const head = first[1].split(' ')[0].replace(/[0-9.]/g, '');
  const bare = w.replace(/\./g, '');
  const own = def.match(new RegExp(`(?:^|[ (])${esc(bare)}\\.?(?: [^|(]{0,20})? \\| ([^|]+) \\|`));
  if (head.toLowerCase() === bare.toLowerCase()) dict[w] = convert(first[2], bare);
  else if (own) dict[w] = convert(own[1], bare);
  else {
    const base = convert(first[2], head);
    const lw = bare.toLowerCase();
    const lh = head.toLowerCase();
    if (lw === lh + 's' || lw === lh + 'es' || lw === lh.replace(/y$/, 'ies') || lw === lh.replace(/fe?$/, 'ves')) {
      const b = lw.endsWith('ves') && /f$/.test(base) ? base.slice(0, -1) + 'v' : base;
      const last = b.slice(-1);
      dict[w] = b + (/[sz]$|ʃ$|ʒ$/.test(b) ? 'ɪz' : 'ptkfθ'.includes(last) ? 's' : 'z');
      flagged.push(`${w}: 由 ${head} 推出 → ${dict[w]}`);
    } else flagged.push(`${w}: 词条是 ${head}（${first[2].trim()}）`);
  }
}

// 手工补充：词典里查到的是词缀或别的词条的那些词
const MANUAL = JSON.parse(fs.readFileSync('scripts/en-ipa-manual.json', 'utf8'));
Object.assign(dict, MANUAL);

const result = {};
const missing = [];
for (const entry of fs.readFileSync('scripts/en-words.txt', 'utf8').split('\n').filter(Boolean)) {
  const parts = entry.replace(/\(.*?\)/g, '').split(/[\s\-/]+/).map((x) => x.replace(/[.,?!]/g, '')).filter(Boolean);
  const ipa = parts.map((p) => dict[p] || dict[p + '.']);
  if (ipa.every(Boolean)) result[entry] = `/${ipa.join(' ')}/`;
  else missing.push(entry);
}
fs.writeFileSync('scripts/en-ipa.json', JSON.stringify(result, null, 0).replace(/","/g, '",\n"') + '\n');
console.log(`音标 ${Object.keys(result).length} 条；缺 ${missing.length} 条`);
console.log(missing.join(' | '));
console.log('--- 需要留意 ---');
console.log(flagged.filter((f) => !MANUAL[f.split(':')[0]]).join('\n'));
