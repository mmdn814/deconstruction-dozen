// 英语音标拆音素、西班牙语拆音节，用来在词卡上展示「拼读过程」。

// ---------- 英语：把音标拆成一个一个音素 ----------
const IPA_UNITS = ['tʃ', 'dʒ', 'eɪ', 'aɪ', 'ɔɪ', 'aʊ', 'oʊ', 'ɜːr', 'ər', 'iː', 'uː', 'ɑː', 'ɔː', 'ɜː'];
const IPA_VOWEL = /^[aeiouæɑɒɔəɛɜɪʊʌ]/;

/** @returns {{ k: string, hot?: boolean, gap?: boolean }[]} hot 表示重读音节的元音 */
export const splitIpa = (ipa) => {
  const s = String(ipa || '').split(',')[0].replace(/[/[\]()]/g, '').trim();
  if (!s) return [];
  const out = [];
  let stress = false;
  for (let i = 0; i < s.length; ) {
    const c = s[i];
    if (c === 'ˈ') {
      stress = true;
      i += 1;
    } else if (c === 'ˌ' || c === '.' || c === '-') {
      i += 1;
    } else if (c === ' ') {
      out.push({ k: '', gap: true });
      i += 1;
    } else {
      const unit = IPA_UNITS.find((u) => s.startsWith(u, i)) || c;
      const isVowel = IPA_VOWEL.test(unit);
      out.push({ k: unit, hot: isVowel && stress });
      if (isVowel) stress = false;
      i += unit.length;
    }
  }
  return out;
};

// ---------- 西班牙语：按规则拆音节并找出重音 ----------
const ES_STRONG = 'aeoáéóíú';
const ES_VOWELS = 'aeiouáéíóúü';
const ES_ACCENTED = 'áéíóú';
const ES_CLUSTERS = ['bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'tr'];

const esUnits = (word) => {
  const w = word.toLowerCase();
  const units = [];
  for (let i = 0; i < w.length; i += 1) {
    const two = w.slice(i, i + 2);
    const next = w[i + 2] || '';
    if (['ch', 'll', 'rr'].includes(two)) {
      units.push({ t: word.slice(i, i + 2), v: false });
      i += 1;
    } else if (two === 'qu' || (two === 'gu' && 'eiéí'.includes(next))) {
      // qu / gu 里的 u 不发音，算作辅音的一部分
      units.push({ t: word.slice(i, i + 2), v: false });
      i += 1;
    } else if (w[i] === 'y' && (i === w.length - 1 || !ES_VOWELS.includes(w[i + 1]))) {
      units.push({ t: word[i], v: true, weak: true }); // 词尾的 y 读作 i
    } else {
      units.push({ t: word[i], v: ES_VOWELS.includes(w[i]), weak: 'iuü'.includes(w[i]) });
    }
  }
  return units;
};

const syllabifyEsWord = (word) => {
  const units = esUnits(word);
  // 1) 把元音归成一个个音节核：两个强元音之间断开，其余连成双元音
  const groups = []; // { c: 辅音[], v: 元音[] }
  let pendingC = [];
  units.forEach((u) => {
    if (!u.v) {
      pendingC.push(u.t);
      return;
    }
    const last = groups[groups.length - 1];
    const lastV = last && pendingC.length === 0 ? last.vu[last.vu.length - 1] : null;
    const bothStrong = lastV && !lastV.weak && !u.weak;
    if (lastV && !bothStrong) {
      last.vu.push(u);
    } else {
      groups.push({ c: pendingC, vu: [u] });
      pendingC = [];
    }
  });
  if (!groups.length) return { syllables: [word], stress: 0 };
  const tail = pendingC;

  // 2) 把元音之间的辅音分给前后两个音节
  const syl = groups.map((g) => ({ head: [], nucleus: g.vu.map((x) => x.t).join(''), coda: [] }));
  syl[0].head = groups[0].c;
  for (let i = 1; i < groups.length; i += 1) {
    const cs = groups[i].c;
    const lastTwo = cs.slice(-2).join('').toLowerCase();
    let keep; // 留给前一个音节的辅音个数
    if (cs.length <= 1) keep = 0;
    else if (cs.length === 2) keep = ES_CLUSTERS.includes(lastTwo) ? 0 : 1;
    else keep = ES_CLUSTERS.includes(lastTwo) ? cs.length - 2 : cs.length - 1;
    syl[i - 1].coda = cs.slice(0, keep);
    syl[i].head = cs.slice(keep);
  }
  syl[syl.length - 1].coda = [...syl[syl.length - 1].coda, ...tail];
  const syllables = syl.map((x) => x.head.join('') + x.nucleus + x.coda.join(''));

  // 3) 重音：有符号听符号；否则元音 / n / s 结尾落在倒数第二个，其余落在最后一个
  let stress = syllables.findIndex((x) => [...x.toLowerCase()].some((ch) => ES_ACCENTED.includes(ch)));
  if (stress < 0) {
    const end = word.toLowerCase().slice(-1);
    stress = syllables.length === 1 ? 0 : ES_VOWELS.includes(end) || end === 'n' || end === 's' ? syllables.length - 2 : syllables.length - 1;
  }
  return { syllables, stress };
};

/** @returns {{ k: string, hot?: boolean, gap?: boolean }[]} 多个词之间用 gap 隔开 */
export const splitEsSyllables = (text) => {
  const words = String(text || '').replace(/[¿?¡!.,]/g, '').split(/[\s/]+/).filter(Boolean);
  const out = [];
  words.forEach((word, wi) => {
    if (wi > 0) out.push({ k: '', gap: true });
    const { syllables, stress } = syllabifyEsWord(word);
    const mark = syllables.length > 1 || words.length === 1;
    syllables.forEach((k, i) => out.push({ k, hot: mark && i === stress }));
  });
  return out;
};

export const ES_STRONG_VOWELS = ES_STRONG;
