// 统计每种语言、每个主题舱的词数，写入 src/data/words/index.json，并检查重复和格式。
// 用法：node scripts/build-word-index.mjs
import fs from 'fs';
import path from 'path';

const root = path.resolve('src/data/words');
const index = {};
let problems = 0;

for (const lang of fs.readdirSync(root)) {
  const dir = path.join(root, lang);
  if (!fs.statSync(dir).isDirectory()) continue;
  index[lang] = {};
  const seen = new Map();
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.txt')).sort()) {
    const theme = file.replace(/\.txt$/, '');
    const lines = fs
      .readFileSync(path.join(dir, file), 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'));
    lines.forEach((l, i) => {
      const parts = l.split('|');
      if (parts.length !== 3 || !parts[0] || !parts[2]) {
        console.log(`格式错误 ${lang}/${file} 第 ${i + 1} 条: ${l}`);
        problems++;
      }
      const key = parts[0] + "|" + parts[1];
      if (seen.has(key)) {
        console.log(`重复 ${lang}: ${key} (${seen.get(key)} 与 ${theme})`);
        problems++;
      } else {
        seen.set(key, theme);
      }
    });
    index[lang][theme] = lines.length;
  }
  const total = Object.values(index[lang]).reduce((a, b) => a + b, 0);
  console.log(`${lang}: ${total} 词 / ${Object.keys(index[lang]).length} 个主题舱`);
}

fs.writeFileSync(path.join(root, 'index.json'), JSON.stringify(index, null, 2) + '\n');
console.log(problems ? `发现 ${problems} 个问题` : '没有重复或格式问题');
process.exit(problems ? 1 : 0);
