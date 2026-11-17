# Deconstruction Dozen

给完全零基础的人用的语言学习应用：从发音开始，一路学到能对话。目标是听得懂、看得懂、说得出，不是应试。支持英语、日语、西班牙语。

## 学习路径

0. 🗺️ 语言地图：五张挂图看清一门语言的全貌（发音、句子怎么搭、时态、小零件、助词或介词）
1. 🗣️ 发音与辨音：全景发音表、易混音盲听、同音词族
2. 🧱 3000词拼读：第 0 关 36 个核心词砖 + 生活主题舱；每张词卡带拼读过程（日语按拍、英语按音素、西语按音节）
3. 🚶 看图小人短句：27 幅火柴人场景，看图直接懂，不靠翻译
4. 📖 12句拆解：用 12 个句子看清一门语言的语法骨架
5. 🧩 句型替换与拼句
6. 💬 场景实战
7. 📒 金句本

## 词库进度

| 语言 | 内置词数 | 拼读方式 |
|---|---|---|
| 日语 | 3112 | 假名一拍一拍 |
| 英语 | 3011 | 音标一个音素一个音素 |
| 西班牙语 | 3011 | 音节，标出重音 |

词表在 `src/data/words/<语言>/<主题>.txt`，每行 `词|读音|中文`。改完后运行：

```bash
node scripts/build-word-index.mjs
```

它会重新统计各主题舱词数，并检查重复和格式。

英语和西语共用一份对照表 `scripts/wordsrc/<主题>.txt`（每行 `英语|西语|中文`），改完后先运行 `node scripts/split-enes.mjs` 拆成两种语言的词表。英语音标由 `scripts/en-lookup.swift` 查 macOS 自带词典、再由 `scripts/en-ipa.mjs` 换算成国际音标，结果存在 `scripts/en-ipa.json`；只有新增英语词时才需要在 Mac 上重跑。

## 在线预览

推送到 `main` 后由 GitHub Actions 自动构建并发布到 GitHub Pages：<https://mmdn814.github.io/deconstruction-dozen/>

## 开发

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

AI 功能（纠音反馈、换一批句子、AI 解锁更多词）需要在页面右上角「API 设置」里填入自己的 Gemini API Key，Key 只保存在本机浏览器。

## 方法来源

- Tim Ferriss 的 12 句解构法
- Gabriel Wyner《Fluent Forever》的发音先行与最小对立体
- I. A. Richards 的分级看图直接教学法（本项目的图和句子均为原创）
- Michel Thomas 的积木式拼句
