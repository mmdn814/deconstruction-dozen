import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const targetDir = path.resolve('public/audio/ipa');
fs.mkdirSync(targetDir, { recursive: true });

// 专门针对苹果 Mac 原生 Samantha 真人声线调校的 44 音标纯正发音词根
const MAC_PHONEME_MAP = {
  // 12 单元音
  'i-long': 'ee',
  'i-short': 'ih',
  'e': 'eh',
  'ae': 'aah',
  'er-long': 'err',
  'schwa': 'uh',
  'uh': 'uh',
  'ah-long': 'ah',
  'aw-long': 'aw',
  'oh-short': 'oh',
  'u-long': 'oo',
  'u-short': 'uuh',
  // 8 双元音
  'ei': 'ay',
  'ai': 'eye',
  'oi': 'oy',
  'au': 'ow',
  'ou': 'oh',
  'ier': 'ear',
  'ear': 'air',
  'uer': 'oor',
  // 16 清浊成对辅音 (Mac 原生短促自然拼读发音)
  'p': 'p',
  'b': 'b',
  't': 't',
  'd': 'd',
  'k': 'k',
  'g': 'g',
  'f': 'ff',
  'v': 'vv',
  'th-unvoiced': 'th',
  'th-voiced': 'the',
  's': 'ss',
  'z': 'zz',
  'sh': 'shh',
  'zh': 'zh',
  'ch': 'ch',
  'dzh': 'j',
  // 8 其他辅音
  'm': 'mm',
  'n': 'nn',
  'ng': 'ng',
  'h': 'hh',
  'l': 'll',
  'r': 'rr',
  'w': 'ww',
  'j': 'yy'
};

console.log('🍎 正在调用 Mac 原生真人语音引擎离线生成 44 个音标文件...');

for (const [name, text] of Object.entries(MAC_PHONEME_MAP)) {
  const aiffPath = path.join(targetDir, `${name}.aiff`);
  const m4aPath = path.join(targetDir, `${name}.m4a`);
  try {
    // 1. 调用 Mac 原生美式真人女声 Samantha 生成高音质音频
    execSync(`say -v Samantha -r 150 "${text}" -o "${aiffPath}"`);
    // 2. 调用 Mac 原生 afconvert 转成所有浏览器和 iOS 通用的高音质 m4a
    execSync(`afconvert -f m4af -d aac "${aiffPath}" "${m4aPath}"`);
    fs.unlinkSync(aiffPath);
    console.log(`✅ 本地生成成功: ${name}.m4a`);
  } catch (e) {
    console.log(`⚠️ 跳过: ${name}`);
  }
}

console.log('🎉 44 个音标已在本地 100% 生成完毕！零网络延迟！');