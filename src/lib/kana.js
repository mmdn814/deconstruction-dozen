// 把假名读音拆成一拍一拍，并给每拍配上罗马音，用来展示「拼读过程」。

const BASE = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', を: 'o', ん: 'n',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  ゔ: 'vu'
};

const SMALL = { ゃ: 'ya', ゅ: 'yu', ょ: 'yo', ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o' };

const toHira = (c) => {
  const code = c.charCodeAt(0);
  return code >= 0x30a1 && code <= 0x30f6 ? String.fromCharCode(code - 0x60) : c;
};

// 「き + ゃ」→ kya，「し + ゃ」→ sha，「ふ + ぁ」→ fa
const combine = (base, small) => {
  const b = BASE[base];
  const s = SMALL[small];
  if (!b || !s) return '';
  if (s.length === 2) {
    // ゃ ゅ ょ
    if (b === 'shi' || b === 'chi' || b === 'ji') return b.slice(0, -1) + s.slice(1);
    return b.slice(0, -1) + s;
  }
  if (b === 'u') return 'w' + s;
  return b.slice(0, -1) + s;
};

/**
 * @returns {{ k: string, r: string, note?: string }[]} 每一拍：k 是原样的假名，r 是罗马音
 * 读音里有假名以外的字符时返回空数组（不展示拼读）。
 */
export const splitMora = (reading) => {
  const chars = [...String(reading || '').replace(/[\s。、・〜~]/g, '')];
  if (!chars.length) return [];
  const out = [];
  for (let i = 0; i < chars.length; i += 1) {
    const c = chars[i];
    const h = toHira(c);
    if (c === 'ー') {
      out.push({ k: c, r: '—', note: '拉长' });
    } else if (h === 'っ') {
      out.push({ k: c, r: '·', note: '停一拍' });
    } else if (SMALL[h]) {
      // 落单的小假名（前面没有可合并的假名）
      out.push({ k: c, r: SMALL[h] });
    } else if (BASE[h]) {
      const next = chars[i + 1] ? toHira(chars[i + 1]) : '';
      if (SMALL[next]) {
        out.push({ k: c + chars[i + 1], r: combine(h, next) });
        i += 1;
      } else {
        out.push({ k: c, r: BASE[h] });
      }
    } else {
      return [];
    }
  }
  // 促音：把后一拍的辅音写在停顿上，更直观（きって → ki · t-te）
  return out;
};

/** 逐拍朗读时用的发音单位：长音并进前一拍，促音变成一次停顿。 */
export const moraSpeakUnits = (mora) => {
  const units = [];
  mora.forEach((m) => {
    if (m.note === '拉长' && units.length) units[units.length - 1].text += 'ー';
    else if (m.note === '停一拍') units.push({ pause: true });
    else units.push({ text: m.k });
  });
  return units;
};
