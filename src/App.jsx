import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  RefreshCw,
  MessageSquare,
  Volume2,
  Mic,
  Layers,
  Map as MapIcon,
  PersonStanding,
  Sparkles,
  Play,
  Square,
  Bookmark,
  Settings,
  Download,
  Upload,
  Trash2,
  Send,
  Loader2,
  KeyRound,
  X
} from 'lucide-react';

import {
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage,
  LANGUAGE_CONFIG,
  setSpeechLang,
  playPurePhoneme,
  speakText,
  callGemini
} from './lib/core.js';
import { zeroToOneDataByLang } from './data/zeroToOne.js';
import { PronunciationEvaluator } from './components/PronunciationEvaluator.jsx';
import { TabMap } from './components/TabMap.jsx';
import { TabWords } from './components/TabWords.jsx';
import { TabPictures } from './components/TabPictures.jsx';

// --- Word Dictionary for Hover Tooltips ---
const baseWordDict = {
  // English
  the: { ipa: '/ðə/', pos: '冠词', meaning: '这/那（特指双方已知的事物）' },
  apple: { ipa: '/ˈæp.əl/', pos: '名词', meaning: '苹果（句中作核心假人名词）' },
  is: { ipa: '/ɪz/', pos: '系动词', meaning: '是（第三人称单数 be 动词）' },
  red: { ipa: '/red/', pos: '形容词', meaning: '红色的（作表语描述状态）' },
  it: { ipa: '/ɪt/', pos: '代词', meaning: '它（指代前面提过的单数事物）' },
  "john's": { ipa: '/dʒɒnz/', pos: '所有格', meaning: '约翰的（名词+\'s 表示归属）' },
  i: { ipa: '/aɪ/', pos: '代词', meaning: '我（主格代词，作动作发起人）' },
  give: { ipa: '/ɡɪv/', pos: '动词', meaning: '给，递交（核心及物动词）' },
  john: { ipa: '/dʒɒn/', pos: '专有名词', meaning: '约翰（句中作间接宾语/接收者）' },
  we: { ipa: '/wiː/', pos: '代词', meaning: '我们（第一人称复数主格）' },
  him: { ipa: '/hɪm/', pos: '代词', meaning: '他（宾格形式，跟在动词或介词后）' },
  he: { ipa: '/hiː/', pos: '代词', meaning: '他（第三人称单数主格）' },
  gives: { ipa: '/ɡɪvz/', pos: '动词', meaning: '给（三单现形式，词尾加 -s）' },
  to: { ipa: '/tuː/', pos: '介词/不定式', meaning: '向/给（表方向）或连接动词原形' },
  she: { ipa: '/ʃiː/', pos: '代词', meaning: '她（第三人称单数主格）' },
  her: { ipa: '/hɜːr/', pos: '代词', meaning: '她/她的（句中作介词宾语）' },
  must: { ipa: '/mʌst/', pos: '情态动词', meaning: '必须，一定（后接动词原形）' },
  want: { ipa: '/wɒnt/', pos: '动词', meaning: '想要（后常接 to do 不定式）' },
  "i'm": { ipa: '/aɪm/', pos: '缩写', meaning: '我是（I am 的口语缩写）' },
  going: { ipa: '/ˈɡəʊ.ɪŋ/', pos: '动词分词', meaning: '将要（be going to 表计划将来）' },
  tomorrow: { ipa: '/təˈmɒr.əʊ/', pos: '副词', meaning: '明天（时间状语，英文习惯放句尾）' },
  "can't": { ipa: '/kɑːnt/', pos: '情态动词', meaning: '不能，不会（cannot 的否定缩写）' },
  eat: { ipa: '/iːt/', pos: '动词', meaning: '吃（接在情态动词后用原形）' },
  // Japanese
  'リンゴは': { ipa: 'ringo wa', pos: '名词+助词', meaning: '苹果（は 读作 wa，提示全句主题）' },
  '赤いです。': { ipa: 'akai desu', pos: '形容词+敬体', meaning: '是红色的（です 表礼貌肯定）' },
  'それは': { ipa: 'sore wa', pos: '代词+助词', meaning: '那是（は 提示主题）' },
  'ジョンの': { ipa: 'jon no', pos: '名词+助词', meaning: '约翰的（の 相当于中文“的”）' },
  'リンゴです。': { ipa: 'ringo desu', pos: '名词+敬体', meaning: '是苹果' },
  '私は': { ipa: 'watashi wa', pos: '代词+助词', meaning: '我是/我（主题）' },
  'ジョンに': { ipa: 'jon ni', pos: '名词+助词', meaning: '给约翰（に 标记动作接收对象）' },
  'リンゴを': { ipa: 'ringo o', pos: '名词+助词', meaning: '把苹果（を 读作 o，标记直接宾语）' },
  'あげます。': { ipa: 'agemasu', pos: '动词敬体', meaning: '给（日语动词永远放在句尾！）' },
  '私たちは': { ipa: 'watashitachi wa', pos: '代词+助词', meaning: '我们（主题）' },
  '彼に': { ipa: 'kare ni', pos: '代词+助词', meaning: '给他（に 标记接收人）' },
  '彼は': { ipa: 'kare wa', pos: '代词+助词', meaning: '他（主题）' },
  'それを': { ipa: 'sore o', pos: '代词+助词', meaning: '把它（を 标记宾语）' },
  '彼女は': { ipa: 'kanojo wa', pos: '代词+助词', meaning: '她（主题）' },
  'リンゴですか？': { ipa: 'ringo desu ka', pos: '名词+疑问', meaning: '是苹果吗？（句尾 か 相当于问号）' },
  '赤かったですか？': { ipa: 'akakatta desu ka', pos: '过去式疑问', meaning: '曾是红色的吗？（～かった 表过去）' },
  'あげなければなりません。': { ipa: 'agenakereba narimasen', pos: '义务句型', meaning: '必须给（日语中“不给不行”=必须给）' },
  '彼女に': { ipa: 'kanojo ni', pos: '代词+助词', meaning: '给她（に 标记对象）' },
  'あげたいです。': { ipa: 'agetai desu', pos: '愿望形', meaning: '想要给（动词词干+たい 表想要做某事）' },
  '明日': { ipa: 'ashita', pos: '时间名词', meaning: '明天（日语时间词常放在前面）' },
  'あげるつもりです。': { ipa: 'ageru tsumori desu', pos: '打算句型', meaning: '打算给（原形+つもり 表计划打算）' },
  '食べられません。': { ipa: 'taberaremasen', pos: '可能态否定', meaning: '不能吃（られません 表能力或条件不允许）' }
};

// --- 12 Core Sentences by Language ---
const sentencesByLang = {
  en: [
    {
      id: 1,
      en: ['The', 'apple', 'is', 'red.'],
      lit: ['这', '苹果', '是', '红色的'],
      nat: ['苹果', '是', '红色的。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: null },
        { enIdx: 1, litIdx: 1, natIdx: 0 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: "中文常省略系动词'是'（苹果红了），英文必须有 be 动词作为句子主心骨。",
      workplace: 'The financial report is ready.'
    },
    {
      id: 2,
      en: ['It', 'is', "John's", 'apple.'],
      lit: ['它', '是', '约翰的', '苹果'],
      nat: ['那是', '约翰的', '苹果。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 0 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: "名词所有格 ('s)，中文常省略'的'，英文需严格标明归属。",
      workplace: "It is the client's final decision."
    },
    {
      id: 3,
      en: ['I', 'give', 'John', 'the', 'apple.'],
      lit: ['我', '给', '约翰', '这', '苹果'],
      nat: ['我', '把', '苹果', '给', '约翰。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 3 },
        { enIdx: 2, litIdx: 2, natIdx: 4 },
        { enIdx: 3, litIdx: 3, natIdx: 1 },
        { enIdx: 4, litIdx: 4, natIdx: 2 }
      ],
      trap: "双宾语语序 (give sb sth)，中文习惯先说'把苹果'，英文直接先放接收人再放物。",
      workplace: 'I send HR the updated resume.'
    },
    {
      id: 4,
      en: ['We', 'give', 'him', 'the', 'apple.'],
      lit: ['我们', '给', '他', '这', '苹果'],
      nat: ['我们', '把', '苹果', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 3 },
        { enIdx: 2, litIdx: 2, natIdx: 4 },
        { enIdx: 3, litIdx: 3, natIdx: 1 },
        { enIdx: 4, litIdx: 4, natIdx: 2 }
      ],
      trap: "代词宾格 (him) 变化，中文主宾格都是'他'，英文处于宾语位置必须变形。",
      workplace: 'We show them the Q3 data.'
    },
    {
      id: 5,
      en: ['He', 'gives', 'it', 'to', 'John.'],
      lit: ['他', '给', '它', '向', '约翰'],
      nat: ['他', '把它', '给', '约翰。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 2 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 },
        { enIdx: 4, litIdx: 4, natIdx: 3 }
      ],
      trap: '第三人称单数动词加 -s，以及当物是代词 it 时，必须用 give it to sb 结构。',
      workplace: 'She forwards it to the manager.'
    },
    {
      id: 6,
      en: ['She', 'gives', 'it', 'to', 'him.'],
      lit: ['她', '给', '它', '向', '他'],
      nat: ['她', '把它', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 2 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 },
        { enIdx: 4, litIdx: 4, natIdx: 3 }
      ],
      trap: '性别代词区分 (She/him)，口语中极易混淆 he 和 she 的发音与指代。',
      workplace: 'He hands it to her.'
    },
    {
      id: 7,
      en: ['Is', 'the', 'apple', 'red?'],
      lit: ['是', '这', '苹果', '红色的？'],
      nat: ['苹果', '是', '红色的', '吗？'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 1 },
        { enIdx: 0, litIdx: 0, natIdx: 3 },
        { enIdx: 1, litIdx: 1, natIdx: null },
        { enIdx: 2, litIdx: 2, natIdx: 0 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: '疑问句语序倒装，中文只需句尾加“吗”，英文必须把系动词/助动词提到句首。',
      workplace: 'Is the contract ready?'
    },
    {
      id: 8,
      en: ['The', 'apples', 'are', 'red.'],
      lit: ['这些', '苹果(复)', '是(复)', '红色的'],
      nat: ['这些苹果', '是', '红色的。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 0 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: '名词复数与主谓一致 (apples -> are)，中文无此变形联动。',
      workplace: 'The new features are live.'
    },
    {
      id: 9,
      en: ['I', 'must', 'give', 'it', 'to', 'him.'],
      lit: ['我', '必须', '给', '它', '向', '他'],
      nat: ['我', '必须', '把它', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 3 },
        { enIdx: 3, litIdx: 3, natIdx: 2 },
        { enIdx: 4, litIdx: 4, natIdx: 3 },
        { enIdx: 5, litIdx: 5, natIdx: 4 }
      ],
      trap: '情态动词 (must) 后接动词原形，不随人称变化。',
      workplace: 'I must submit it to him today.'
    },
    {
      id: 10,
      en: ['I', 'want', 'to', 'give', 'it', 'to', 'her.'],
      lit: ['我', '想要', '去', '给', '它', '向', '她'],
      nat: ['我', '想要', '把它', '给', '她。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: null },
        { enIdx: 3, litIdx: 3, natIdx: 3 },
        { enIdx: 4, litIdx: 4, natIdx: 2 },
        { enIdx: 5, litIdx: 5, natIdx: 3 },
        { enIdx: 6, litIdx: 6, natIdx: 4 }
      ],
      trap: '动词不定式 (to do)，英文两个动词不能直接连用，中间必须用 to 连接。',
      workplace: 'I want to present it to her.'
    },
    {
      id: 11,
      en: ["I'm", 'going', 'to', 'give', 'it', 'to', 'him', 'tomorrow.'],
      lit: ['我是', '将要', '去', '给', '它', '向', '他', '明天'],
      nat: ['我', '明天', '打算', '把它', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 2 },
        { enIdx: 2, litIdx: 2, natIdx: 2 },
        { enIdx: 3, litIdx: 3, natIdx: 4 },
        { enIdx: 4, litIdx: 4, natIdx: 3 },
        { enIdx: 5, litIdx: 5, natIdx: 4 },
        { enIdx: 6, litIdx: 6, natIdx: 5 },
        { enIdx: 7, litIdx: 7, natIdx: 1 }
      ],
      trap: '将来时结构 (be going to) 及时间状语 (tomorrow) 习惯后置，与中文语序相反！',
      workplace: "I'm going to pitch it to them tomorrow."
    },
    {
      id: 12,
      en: ['I', "can't", 'eat', 'the', 'apple.'],
      lit: ['我', '不能', '吃', '这', '苹果'],
      nat: ['我', '不能', '吃', '这个', '苹果。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 2 },
        { enIdx: 3, litIdx: 3, natIdx: 3 },
        { enIdx: 4, litIdx: 4, natIdx: 4 }
      ],
      trap: '否定结构，否定词 not 必须依附在情态动词或助动词上。',
      workplace: "I can't accept this offer."
    }
  ],
  ja: [
    {
      id: 1,
      en: ['リンゴは', '赤いです。'],
      lit: ['苹果(主题)', '红色的-是'],
      nat: ['苹果', '是', '红色的。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 1, litIdx: 1, natIdx: 2 }
      ],
      trap: '日语靠助词「は (读wa)」标记主题，礼貌肯定词「です」永远放在句尾。',
      workplace: '財務報告書は 準備できています。'
    },
    {
      id: 2,
      en: ['それは', 'ジョンの', 'リンゴです。'],
      lit: ['那是', '约翰的', '苹果-是'],
      nat: ['那是', '约翰的', '苹果。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 2 }
      ],
      trap: '助词「の」完全对应中文的“的”，连接两个名词表归属。',
      workplace: 'それは クライアントの 最終決定です。'
    },
    {
      id: 3,
      en: ['私は', 'ジョンに', 'リンゴを', 'あげます。'],
      lit: ['我是', '向约翰', '把苹果', '给'],
      nat: ['我', '把', '苹果', '给', '约翰。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 4 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 2 },
        { enIdx: 3, litIdx: 3, natIdx: 3 }
      ],
      trap: '日语核心铁律 SOV：动词「あげます(给)」必须放句尾！用「に」标接收人，「を」标物品。',
      workplace: '私は 人事に 履歴書を 送ります。'
    },
    {
      id: 4,
      en: ['私たちは', '彼に', 'リンゴを', 'あげます。'],
      lit: ['我们是', '向他', '把苹果', '给'],
      nat: ['我们', '把', '苹果', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 4 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 2 },
        { enIdx: 3, litIdx: 3, natIdx: 3 }
      ],
      trap: '日语代词本身不变格，全靠后面的助词（彼に = 给他，彼は = 他是）决定语法角色。',
      workplace: '私たちは 彼らに データを 見せます。'
    },
    {
      id: 5,
      en: ['彼は', 'それを', 'ジョンに', 'あげます。'],
      lit: ['他是', '把它', '向约翰', '给'],
      nat: ['他', '把它', '给', '约翰。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 3 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: '只要助词「を」和「に」跟着正确的词，中间的“把它”和“向约翰”调换顺序意思完全不变！',
      workplace: '彼女は それを マネージャーに 転送します。'
    },
    {
      id: 6,
      en: ['彼女は', 'それを', '彼に', 'あげます。'],
      lit: ['她是', '把它', '向他', '给'],
      nat: ['她', '把它', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 3 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: '日语没有三单现动词变化，不管主语是我、你、他，动词都是「あげます」。',
      workplace: '彼は それを 彼女に 渡します。'
    },
    {
      id: 7,
      en: ['それは', 'リンゴですか？'],
      lit: ['那是', '是苹果吗？'],
      nat: ['那是', '苹果', '吗？'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 1, litIdx: 1, natIdx: 2 }
      ],
      trap: '日语变疑问句极其简单：不需要像英语那样倒装语序，直接在句尾加「か (ka)」即可！',
      workplace: '契約書は 準備できていますか？'
    },
    {
      id: 8,
      en: ['リンゴは', '赤かったですか？'],
      lit: ['苹果是', '曾是红色的吗？'],
      nat: ['苹果', '之前是', '红色的吗？'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 1, litIdx: 1, natIdx: 2 }
      ],
      trap: '日语连形容词都有过去时变位：赤い (现在红) → 赤かった (过去红)。',
      workplace: '昨日の会議は 有意義でしたか？'
    },
    {
      id: 9,
      en: ['私は', 'それを', '彼に', 'あげなければなりません。'],
      lit: ['我是', '把它', '向他', '不给不行(必须给)'],
      nat: ['我', '必须', '把它', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 2 },
        { enIdx: 2, litIdx: 2, natIdx: 4 },
        { enIdx: 3, litIdx: 3, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 3 }
      ],
      trap: '日语没有独立的 must 单词，而是把句尾动词变成双重否定「～なければなりません（不做不行）」。',
      workplace: '今日 それを 彼に 提出しなければなりません。'
    },
    {
      id: 10,
      en: ['私は', '彼女に', 'それを', 'あげたいです。'],
      lit: ['我是', '向她', '把它', '想要给'],
      nat: ['我', '想要', '把它', '给', '她。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 4 },
        { enIdx: 2, litIdx: 2, natIdx: 2 },
        { enIdx: 3, litIdx: 3, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 3 }
      ],
      trap: '表达“想要做某事”无需加额外动词，直接把句尾动词词尾变成「～たいです (tai desu)」。',
      workplace: '私は 彼女に それを 提案したいです。'
    },
    {
      id: 11,
      en: ['私は', '明日', '彼に', 'それを', 'あげるつもりです。'],
      lit: ['我是', '明天', '向他', '把它', '打算给'],
      nat: ['我', '明天', '打算', '把它', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 5 },
        { enIdx: 3, litIdx: 3, natIdx: 3 },
        { enIdx: 4, litIdx: 4, natIdx: 2 },
        { enIdx: 4, litIdx: 4, natIdx: 4 }
      ],
      trap: '日语时间词「明日」和中文一样放前面；“打算做”是在动词原形后加「つもりです」。',
      workplace: '明日 彼らに それを プレゼンするつもりです。'
    },
    {
      id: 12,
      en: ['私は', 'そのリンゴを', '食べられません。'],
      lit: ['我是', '把那个苹果', '不能吃'],
      nat: ['我', '不能', '吃', '那个苹果。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 3 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 2 }
      ],
      trap: '日语的“不能做”全部浓缩在句尾动词的可能态否定形「～られません」里。',
      workplace: '私は このオファーを 受け入れられません。'
    }
  ],
  es: [
    {
      id: 1,
      en: ['La', 'manzana', 'es', 'roja.'],
      lit: ['这(阴)', '苹果(阴)', '是', '红色的(阴)'],
      nat: ['苹果', '是', '红色的。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: null },
        { enIdx: 1, litIdx: 1, natIdx: 0 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: '西语名词分阴阳性：manzana 是阴性名词，因此定冠词必须用 La，形容词也必须配合变为以 -a 结尾的 roja。',
      workplace: 'El informe financiero está listo.'
    },
    {
      id: 2,
      en: ['Es', 'la', 'manzana', 'de', 'Juan.'],
      lit: ['是', '这', '苹果', '的', '胡安'],
      nat: ['那是', '约翰的', '苹果。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: null },
        { enIdx: 2, litIdx: 2, natIdx: 2 },
        { enIdx: 3, litIdx: 3, natIdx: 1 },
        { enIdx: 4, litIdx: 4, natIdx: 1 }
      ],
      trap: "西语没有英语的 's 所有格，必须用「de + 人名」后置修饰（字面语序：苹果 的 胡安），且主语 it 常省略。",
      workplace: 'Es la decisión final del cliente.'
    },
    {
      id: 3,
      en: ['Le', 'doy', 'la', 'manzana', 'a', 'Juan.'],
      lit: ['给他', '我给', '这', '苹果', '向', '胡安'],
      nat: ['我', '把', '苹果', '给', '约翰。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 3 },
        { enIdx: 1, litIdx: 1, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 3 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 },
        { enIdx: 4, litIdx: 4, natIdx: 3 },
        { enIdx: 5, litIdx: 5, natIdx: 4 }
      ],
      trap: '西语宾语代词前置与冗余：即使后面有 a Juan，动词 doy 前通常也要先放间接宾语代词 Le。',
      workplace: 'Le envío el currículum actualizado a RRHH.'
    },
    {
      id: 4,
      en: ['Le', 'damos', 'la', 'manzana.'],
      lit: ['给他', '我们给', '这', '苹果'],
      nat: ['我们', '把', '苹果', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 4 },
        { enIdx: 1, litIdx: 1, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 3 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: '动词变位自带人称：damos 词尾 -mos 已经表明主语是“我们”，所以主语 nosotros 直接省略，代词 Le 放在动词前。',
      workplace: 'Les mostramos los datos del tercer trimestre.'
    },
    {
      id: 5,
      en: ['Se', 'la', 'da', 'a', 'Juan.'],
      lit: ['给他', '把它(阴)', '他给', '向', '胡安'],
      nat: ['他', '把它', '给', '约翰。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 2 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 0 },
        { enIdx: 2, litIdx: 2, natIdx: 2 },
        { enIdx: 3, litIdx: 3, natIdx: 2 },
        { enIdx: 4, litIdx: 4, natIdx: 3 }
      ],
      trap: '双代词前置与音变：当间接代词 le 遇到直接代词 la（指代阴性苹果）时，为避免绕口，le 必须变成 Se！',
      workplace: 'Se lo reenvía al gerente.'
    },
    {
      id: 6,
      en: ['Ella', 'se', 'la', 'da.'],
      lit: ['她', '给他', '把它(阴)', '给'],
      nat: ['她', '把它', '给', '他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 3 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: '西语把“给他 (se)”和“把它 (la)”全部打包放在变位动词 da 的前面！',
      workplace: 'Él se lo entrega a ella.'
    },
    {
      id: 7,
      en: ['¿Es', 'roja', 'la', 'manzana?'],
      lit: ['¿是', '红色的', '这', '苹果？'],
      nat: ['苹果', '是', '红色的', '吗？'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 1 },
        { enIdx: 0, litIdx: 0, natIdx: 3 },
        { enIdx: 1, litIdx: 1, natIdx: 2 },
        { enIdx: 2, litIdx: 2, natIdx: null },
        { enIdx: 3, litIdx: 3, natIdx: 0 }
      ],
      trap: '西语疑问句首尾必须加倒问号 ¿ 和正问号 ?，且常把谓语 Es roja 提到主语前面。',
      workplace: '¿Está listo el contrato?'
    },
    {
      id: 8,
      en: ['Las', 'manzanas', 'son', 'rojas.'],
      lit: ['这些(阴复)', '苹果(复)', '是(复)', '红色的(阴复)'],
      nat: ['这些苹果', '是', '红色的。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 0 },
        { enIdx: 2, litIdx: 2, natIdx: 1 },
        { enIdx: 3, litIdx: 3, natIdx: 2 }
      ],
      trap: '西语四重联动变形：一旦名词变复数，冠词(Las)、名词(manzanas)、系动词(son)、形容词(rojas)全部要变复数！',
      workplace: 'Las nuevas funciones están activas.'
    },
    {
      id: 9,
      en: ['Debo', 'dársela.'],
      lit: ['我必须', '给-他-它(合体)'],
      nat: ['我', '必须', '把它', '给他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 0, litIdx: 0, natIdx: 1 },
        { enIdx: 1, litIdx: 1, natIdx: 2 },
        { enIdx: 1, litIdx: 1, natIdx: 3 }
      ],
      trap: 'Tim Ferriss 最推崇的西语测试点：当出现动词原形 dar 时，代词 se 和 la 可以直接粘在动词原形词尾合成一个词 dársela！',
      workplace: 'Debo entregárselo hoy.'
    },
    {
      id: 10,
      en: ['Quiero', 'dársela', 'a', 'ella.'],
      lit: ['我想要', '给-她-它', '向', '她'],
      nat: ['我', '想要', '把它', '给', '她。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 0, litIdx: 0, natIdx: 1 },
        { enIdx: 1, litIdx: 1, natIdx: 2 },
        { enIdx: 1, litIdx: 1, natIdx: 3 },
        { enIdx: 2, litIdx: 2, natIdx: 3 },
        { enIdx: 3, litIdx: 3, natIdx: 4 }
      ],
      trap: 'Quiero (我想要) 后直接跟动词原形，ไม่ต้อง加 to；为明确性别可加 a ella (向她)。',
      workplace: 'Quiero presentárselo a ella.'
    },
    {
      id: 11,
      en: ['Voy', 'a', 'dársela', 'mañana.'],
      lit: ['我去', '向', '给-他-它', '明天'],
      nat: ['我', '明天', '打算', '把它', '给他。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 0 },
        { enIdx: 0, litIdx: 0, natIdx: 2 },
        { enIdx: 1, litIdx: 1, natIdx: 2 },
        { enIdx: 2, litIdx: 2, natIdx: 3 },
        { enIdx: 2, litIdx: 2, natIdx: 4 },
        { enIdx: 3, litIdx: 3, natIdx: 1 }
      ],
      trap: '西语将来计划结构「ir a + 动词原形」(Voy a...)，结构与英语 be going to 完全对应！',
      workplace: 'Voy a enviárselo mañana.'
    },
    {
      id: 12,
      en: ['No', 'puedo', 'comer', 'la', 'manzana.'],
      lit: ['不', '我能', '吃', '这', '苹果'],
      nat: ['我', '不能', '吃', '这个', '苹果。'],
      mapping: [
        { enIdx: 0, litIdx: 0, natIdx: 1 },
        { enIdx: 1, litIdx: 1, natIdx: 0 },
        { enIdx: 1, litIdx: 1, natIdx: 1 },
        { enIdx: 2, litIdx: 2, natIdx: 2 },
        { enIdx: 3, litIdx: 3, natIdx: 3 },
        { enIdx: 4, litIdx: 4, natIdx: 4 }
      ],
      trap: '西语否定极简：永远直接把 No 放在变位动词（puedo）正前方即可。',
      workplace: 'No puedo aceptar esta oferta.'
    }
  ]
};

// --- Scenario Examples Pool for TabSubstitution (3 Batches of 5 Sentences per Category) ---
const scenarioBatchesBySkeleton = {
  default: {
    work: [
      [
        '我打算明天把修改后的方案发给客户。',
        '我准备下周向团队展示这个新产品。',
        '我明天得把这份财务报告交给经理。',
        '我打算今天下午把合同发给她。',
        '我们不能接受这个报价。'
      ],
      [
        '这份预算报告已经准备好了。',
        '那是客户的最终决定。',
        '我必须今天就把它提交给总监。',
        '你准备好签这份合同了吗？',
        '我想要把最新数据展示给他们看。'
      ],
      [
        '她把会议纪要转发给了老板。',
        '这些新功能今天已经上线了。',
        '我明天打算跟他们汇报这个项目。',
        '我把更新后的简历发给了人事部。',
        '因为预算不够，我们不能批准这个计划。'
      ]
    ],
    daily: [
      [
        '我打算明天把这本书还给他。',
        '我想把这张照片发给我妈妈。',
        '这个周末我打算去买台新手机。',
        '我今天吃不下这个苹果了。',
        '那是约翰的新车吗？'
      ],
      [
        '她把钥匙递给了我。',
        '我们把礼物送给了他。',
        '我必须在今晚之前把消息告诉她。',
        '这杯咖啡太烫了，我喝不了。',
        '我想要明天去拜访他。'
      ],
      [
        '这些草莓非常新鲜。',
        '那是她的雨伞。',
        '你今天打算把包裹寄给他吗？',
        '我把刚买的蛋糕分给了朋友们。',
        '我实在想不起他的名字了。'
      ]
    ],
    living: [
      [
        '我打算明天把房租转给房东。',
        '快递员把包裹交给了我。',
        '我今天必须去超市买点水。',
        '洗手间在哪里？',
        '这间公寓的钥匙在桌子上。'
      ],
      [
        '我想请邻居帮个忙。',
        '因为太贵了，我不能租这套房子。',
        '我明天打算去区役所办手续。',
        '店员把热好的便当递给了我。',
        '这袋垃圾必须明天早上扔。'
      ],
      [
        '你能把菜单递给我吗？',
        '这件衣服太小了，我穿不下。',
        '我得把备用钥匙交给室友。',
        '晚饭已经做好了。',
        '我打算周末把房间打扫干净。'
      ]
    ],
    travel: [
      [
        '我把护照递给了海关人员。',
        '请问去机场的电车站在哪里？',
        '我打算明天上午去参观那座博物馆。',
        '我想买两张去东京的新干线车票。',
        '这家酒店的早餐是免费的吗？'
      ],
      [
        '我必须把房卡还给前台。',
        '服务员把账单拿给了我们。',
        '因为航班延误，我今天赶不上末班车了。',
        '那是我们的行李箱。',
        '我想要把这张明信片寄给她。'
      ],
      [
        '这些纪念品太贵了。',
        '你能把去车站的路指给我看吗？',
        '我打算明天退房后把行李寄存在这里。',
        '他把登机牌递给了检票员。',
        '我吃不了辛辣的食物。'
      ]
    ]
  }
};

// --- Lego Block Builder Generator (Creates Clickable Word Tiles for Zero-Basis Users) ---
const buildLegoBlocksForSentence = (targetLang, skeletonId) => {
  const list = sentencesByLang[targetLang] || sentencesByLang.en;
  const skel = list.find((s) => s.id === skeletonId) || list[0];

  const extraPoolByLang = {
    en: [
      { word: 'the', hint: '这/那' },
      { word: 'contract', hint: '合同' },
      { word: 'report', hint: '报告' },
      { word: 'client', hint: '客户' },
      { word: 'manager', hint: '经理' },
      { word: 'send', hint: '发送' },
      { word: 'show', hint: '展示' },
      { word: 'ready', hint: '准备好的' },
      { word: 'today', hint: '今天' },
      { word: 'tomorrow', hint: '明天' }
    ],
    ja: [
      { word: '契約書を', hint: '把合同' },
      { word: '報告書は', hint: '报告(主题)' },
      { word: 'クライアントに', hint: '向客户' },
      { word: '部長に', hint: '向部长' },
      { word: '送ります。', hint: '发送' },
      { word: '見せます。', hint: '展示' },
      { word: '今日', hint: '今天' },
      { word: '明日', hint: '明天' },
      { word: '準備できています。', hint: '已准备好' }
    ],
    es: [
      { word: 'el', hint: '这(阳)' },
      { word: 'contrato', hint: '合同' },
      { word: 'informe', hint: '报告' },
      { word: 'al', hint: '向那' },
      { word: 'cliente', hint: '客户' },
      { word: 'gerente', hint: '经理' },
      { word: 'enviar', hint: '发送' },
      { word: 'listo', hint: '准备好的' },
      { word: 'hoy', hint: '今天' },
      { word: 'mañana', hint: '明天' }
    ]
  };

  const baseBlocks = skel.en.map((w, idx) => ({
    id: `base-${idx}-${w}`,
    word: w.replace(/[.。?？!！]/g, ''),
    hint: skel.lit[idx] || '核心词'
  }));

  const extras = (extraPoolByLang[targetLang] || extraPoolByLang.en).map((item, idx) => ({
    id: `extra-${idx}-${item.word}`,
    word: item.word,
    hint: item.hint
  }));

  return {
    recommendedOrder: skel.en.join(' '),
    blocks: [...baseBlocks, ...extras]
  };
};

// --- Harmonious Line Color Palette ---
const HARMONIOUS_LINE_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#6366f1'  // Indigo
];

// --- Word With Hover Tooltip & Individual Pronunciation ---
const WordWithTooltip = ({
  word,
  color = '#2563eb',
  isHighlighted = false,
  onMouseEnter,
  onMouseLeave,
  customMeta = null
}) => {
  const [hovered, setHovered] = useState(false);
  const cleanKey = String(word || '')
    .toLowerCase()
    .replace(/[.,?!¿¡"]/g, '')
    .trim();

  const meta =
    customMeta ||
    baseWordDict[word] ||
    baseWordDict[cleanKey] || {
      ipa: `/${cleanKey}/`,
      pos: '核心词块',
      meaning: '点击喇叭可单独听该词常速/慢速发音'
    };

  return (
    <span
      className="relative inline-block select-none"
      onMouseEnter={() => {
        setHovered(true);
        if (onMouseEnter) onMouseEnter();
      }}
      onMouseLeave={() => {
        setHovered(false);
        if (onMouseLeave) onMouseLeave();
      }}
    >
      <span
        onClick={(e) => {
          e.stopPropagation();
          speakText(word, 0.95);
        }}
        style={
          isHighlighted
            ? {
                backgroundColor: `${color}18`,
                borderColor: color,
                color: '#0f172a'
              }
            : undefined
        }
        className={`cursor-pointer px-1.5 py-0.5 rounded-md font-extrabold text-sm md:text-[15px] transition-all border ${
          isHighlighted
            ? 'shadow-2xs scale-105'
            : 'border-transparent text-slate-900 hover:bg-slate-100 hover:border-slate-300'
        }`}
      >
        {word}
      </span>

      {hovered && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-52 p-2.5 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 text-left pointer-events-auto"
        >
          <div className="flex items-center justify-between gap-1 border-b border-slate-700/80 pb-1.5 mb-1.5">
            <div>
              <div className="text-xs font-extrabold text-white">{word}</div>
              <div className="text-[10px] font-mono text-amber-300">{meta.ipa}</div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(word, 0.95);
                }}
                className="px-1.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-[10px] font-bold flex items-center gap-0.5"
              >
                <Volume2 className="w-2.5 h-2.5" />
                <span>发音</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(word, 0.6);
                }}
                className="px-1.5 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-[10px] font-bold"
              >
                🐢
              </button>
            </div>
          </div>
          <div className="text-[10.5px] leading-snug text-slate-200">
            <span className="inline-block px-1 py-0.2 bg-slate-800 text-blue-300 rounded text-[9.5px] font-bold mr-1">
              {meta.pos}
            </span>
            <span>{meta.meaning}</span>
          </div>
        </div>
      )}
    </span>
  );
};

// --- 3-Layer Sentence Visualizer with Harmonious Colored SVG Lines ---
const MiniSentenceVisualizer = ({ en, lit, nat, mapping }) => {
  const containerRef = useRef(null);
  const enRefs = useRef([]);
  const litRefs = useRef([]);
  const natRefs = useRef([]);
  const [lines, setLines] = useState([]);
  const [hoveredEnIdx, setHoveredEnIdx] = useState(null);

  const computeLines = () => {
    if (!containerRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const newLines = [];

    mapping.forEach((m) => {
      const color = HARMONIOUS_LINE_COLORS[m.enIdx % HARMONIOUS_LINE_COLORS.length];
      const enEl = enRefs.current[m.enIdx];
      const litEl = litRefs.current[m.litIdx];

      if (enEl && litEl) {
        const r1 = enEl.getBoundingClientRect();
        const r2 = litEl.getBoundingClientRect();
        newLines.push({
          enIdx: m.enIdx,
          color,
          x1: r1.left + r1.width / 2 - cRect.left,
          y1: r1.bottom - cRect.top - 1,
          x2: r2.left + r2.width / 2 - cRect.left,
          y2: r2.top - cRect.top + 1
        });
      }

      if (m.natIdx !== null && m.natIdx !== undefined) {
        const natEl = natRefs.current[m.natIdx];
        if (litEl && natEl) {
          const r2 = litEl.getBoundingClientRect();
          const r3 = natEl.getBoundingClientRect();
          newLines.push({
            enIdx: m.enIdx,
            color,
            x1: r2.left + r2.width / 2 - cRect.left,
            y1: r2.bottom - cRect.top - 1,
            x2: r3.left + r3.width / 2 - cRect.left,
            y2: r3.top - cRect.top + 1
          });
        }
      }
    });

    setLines(newLines);
  };

  useEffect(() => {
    const timer = setTimeout(computeLines, 60);
    window.addEventListener('resize', computeLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', computeLines);
    };
  }, [en, lit, nat, mapping]);

  return (
    <div ref={containerRef} className="relative py-1 select-none">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {lines.map((line, idx) => {
          const isHighlighted = hoveredEnIdx === line.enIdx;
          const isDimmed = hoveredEnIdx !== null && hoveredEnIdx !== line.enIdx;
          const midY = (line.y1 + line.y2) / 2;
          const d = `M ${line.x1} ${line.y1} C ${line.x1} ${midY}, ${line.x2} ${midY}, ${line.x2} ${line.y2}`;
          return (
            <path
              key={idx}
              d={d}
              fill="none"
              stroke={line.color}
              strokeWidth={isHighlighted ? 2.8 : 1.75}
              strokeOpacity={isDimmed ? 0.2 : isHighlighted ? 1 : 0.72}
              className="transition-all duration-150"
            />
          );
        })}
      </svg>

      {/* Row 1: Target Language Words */}
      <div className="relative z-10 flex flex-wrap items-center gap-x-2 gap-y-1 mb-3.5">
        {en.map((word, idx) => {
          const color = HARMONIOUS_LINE_COLORS[idx % HARMONIOUS_LINE_COLORS.length];
          return (
            <div key={idx} ref={(el) => (enRefs.current[idx] = el)}>
              <WordWithTooltip
                word={word}
                color={color}
                isHighlighted={hoveredEnIdx === idx}
                onMouseEnter={() => setHoveredEnIdx(idx)}
                onMouseLeave={() => setHoveredEnIdx(null)}
              />
            </div>
          );
        })}
      </div>

      {/* Row 2: Literal Word-for-Word Translation */}
      <div className="relative z-10 flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-3.5 pl-0.5">
        {lit.map((word, idx) => {
          const mapped = mapping.find((m) => m.litIdx === idx);
          const enIdx = mapped ? mapped.enIdx : idx;
          const color = HARMONIOUS_LINE_COLORS[enIdx % HARMONIOUS_LINE_COLORS.length];
          const isHighlighted = hoveredEnIdx === enIdx;
          return (
            <span
              key={idx}
              ref={(el) => (litRefs.current[idx] = el)}
              style={isHighlighted ? { color, fontWeight: 700 } : undefined}
              className="text-[11px] text-slate-400 px-1 rounded transition-colors"
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Row 3: Natural Chinese Expression */}
      <div className="relative z-10 flex flex-wrap items-center gap-x-2 gap-y-1 pl-0.5">
        {nat.map((word, idx) => {
          const mappedList = mapping.filter((m) => m.natIdx === idx);
          const isHighlighted = mappedList.some((m) => m.enIdx === hoveredEnIdx);
          const primaryColor =
            mappedList.length > 0
              ? HARMONIOUS_LINE_COLORS[mappedList[0].enIdx % HARMONIOUS_LINE_COLORS.length]
              : '#0f172a';
          return (
            <span
              key={idx}
              ref={(el) => (natRefs.current[idx] = el)}
              style={isHighlighted ? { color: primaryColor } : undefined}
              className={`text-xs font-bold px-1 rounded transition-colors ${
                isHighlighted ? 'underline decoration-2' : 'text-slate-700'
              }`}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// --- TAB 1: Comprehensive Sound & Ear Training Hub (Decoder + Minimal Pairs + Sound Clusters) ---
const TabZeroToOne = ({
  targetLang,
  getReadCount,
  onIncrementReadCount,
  onJumpToPracticeWithSkeleton
}) => {
  const [subStage, setSubStage] = useState('decoder'); // 'decoder' | 'pairs' | 'clusters'
  const [activePhoneticCatIdx, setActivePhoneticCatIdx] = useState(0);

  // Minimal Pairs Interactive States
  const [earQuiz, setEarQuiz] = useState(null);
  const [activePairPractice, setActivePairPractice] = useState(null); // { idx, mode: 'words' | 'sentence' }

  // Sound Clusters Interactive States
  const [clusterQuiz, setClusterQuiz] = useState(null); // { clusterIdx, targetWordIdx, wordStr, guessedIdx }
  const [activeClusterPracticeIdx, setActiveClusterPracticeIdx] = useState(null);

  const langConfig = LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en;
  const data = zeroToOneDataByLang[targetLang] || zeroToOneDataByLang.en;
  const phoneticCategories = data.phoneticCategories || [];
  const activePhoneticCat = phoneticCategories[activePhoneticCatIdx] || phoneticCategories[0];

  useEffect(() => {
    setEarQuiz(null);
    setActivePairPractice(null);
    setClusterQuiz(null);
    setActiveClusterPracticeIdx(null);
    setActivePhoneticCatIdx(0);
  }, [targetLang, subStage]);

  const cleanSpeakWord = (raw) =>
    String(raw || '')
      .split('(')[0]
      .split('/')[0]
      .trim();

  const startEarQuiz = (pair, idx) => {
    const side = Math.random() < 0.5 ? 1 : 2;
    const rawWord = cleanSpeakWord(side === 1 ? pair.w1 : pair.w2);
    setEarQuiz({ pairIdx: idx, targetSide: side, word: rawWord, guessed: null });
    speakText(rawWord, 0.92);
  };

  const handleGuessEarQuiz = (side) => {
    if (!earQuiz) return;
    setEarQuiz((prev) => ({ ...prev, guessed: side }));
  };

  const startClusterQuiz = (cluster, clusterIdx) => {
    const randIdx = Math.floor(Math.random() * cluster.words.length);
    const chosen = cleanSpeakWord(cluster.words[randIdx].w);
    setClusterQuiz({
      clusterIdx,
      targetWordIdx: randIdx,
      wordStr: chosen,
      guessedIdx: null
    });
    speakText(chosen, 0.92);
  };

  const playClusterChain = (wordsList) => {
    let idx = 0;
    const playNext = () => {
      if (idx >= wordsList.length) return;
      const clean = cleanSpeakWord(wordsList[idx].w);
      idx += 1;
      speakText(clean, 0.94, 1.0, () => {
        setTimeout(playNext, 420);
      });
    };
    playNext();
  };

  return (
    <div className="space-y-3.5">
      {/* Top Banner + 3 Sub-Stages Switcher */}
      <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-emerald-50 border border-blue-200/80 rounded-xl p-3 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10.5px] font-extrabold">
              STEP 1 · 发音与辨音训练营
            </span>
            <h2 className="text-sm font-black text-slate-900">
              {langConfig.flag} {langConfig.name} · {data.subtitle}
            </h2>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            先认全所有基础音素与拼读铁律，再通过「10组易混音+同句绕口实战」与「8大同音词族串烧」，边听边录彻底调校耳朵和舌头！
          </p>
        </div>

        {/* 3 Sub-stage Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/90 p-1 rounded-xl border border-blue-200/80 shrink-0">
          {[
            { id: 'decoder', label: '① 全景发音表与密码' },
            { id: 'pairs', label: `② 易混相似音对决 (${data.minimalPairs.length}组)` },
            { id: 'clusters', label: `③ 同音词族串串烧 (${data.soundClusters.length}族)` }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubStage(tab.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                subStage === tab.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-stage 1: Complete Phonetic System Chart + 4 Reading Rules */}
      {subStage === 'decoder' && (
        <div className="space-y-3">
          {/* Interactive Complete Phonetic System Matrix */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-extrabold text-slate-800">{data.alphabetTitle}</h3>
                {activePhoneticCat && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{activePhoneticCat.desc}</p>
                )}
              </div>

              {/* Category Switcher Tabs for Full Phonetic System */}
              {phoneticCategories.length > 1 && (
                <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs shrink-0">
                  {phoneticCategories.map((cat, idx) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActivePhoneticCatIdx(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        activePhoneticCatIdx === idx
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {activePhoneticCat && (
              <div
                className={`grid gap-2.5 ${
                  activePhoneticCat.isGrid5
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
                    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}
              >
                {activePhoneticCat.items.map((c, idx) => {
                  const primaryChar = c.char.split('/')[0].replace(/（.*?）|\(.*?\)/g, '').trim();
                  const singleSoundText = c.sound || primaryChar;
                  return (
                    <div
                      key={idx}
                      onClick={() => playPurePhoneme(c.char, singleSoundText)}
                      className="bg-white hover:bg-blue-50/50 border border-slate-200/90 hover:border-blue-400 rounded-xl p-2.5 cursor-pointer transition-all shadow-2xs flex flex-col justify-between gap-1.5"
                    >
                      {/* Row 1: Phonetic Symbol / Kana + Pure Phoneme Single Sound Button + Spelling Rule Badge */}
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-sm font-black text-slate-900 leading-none">
                            {c.char}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playPurePhoneme(c.char, singleSoundText);
                            }}
                            className="px-1.5 py-0.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold flex items-center gap-0.5 shrink-0 transition-colors shadow-2xs"
                            title={`播放 ${c.char} 的纯粹音标单音`}
                          >
                            <Volume2 className="w-2.5 h-2.5" />
                            <span>纯单音</span>
                          </button>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded shrink-0">
                          {c.sub}
                        </span>
                      </div>

                      {/* Row 2: Mouth / Pronunciation Tip */}
                      <p className="text-[10.5px] text-slate-500 leading-snug">{c.tip}</p>

                      {/* Row 3: Sample Word + Chinese Meaning + Slow Button */}
                      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(c.sample || singleSoundText, 0.92);
                          }}
                          className="font-bold text-slate-800 hover:text-blue-600 flex items-center gap-1 text-left min-w-0 truncate"
                          title="点击朗读下方示例单词"
                        >
                          <Volume2 className="w-3 h-3 text-blue-600 shrink-0" />
                          <span className="truncate">
                            例: {c.sample}
                            {c.sampleCn && (
                              <span className="text-slate-500 font-normal ml-1">
                                ({c.sampleCn})
                              </span>
                            )}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(c.sample || singleSoundText, 0.6);
                          }}
                          className="px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10px] font-bold shrink-0"
                          title="0.6x 慢速读示例词"
                        >
                          🐢
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4 Golden Reading Rules */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <h3 className="text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>一页纸拼读密码 (4条铁律开口能读)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {data.rules.map((r, i) => (
                <div key={i} className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{r.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-5">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-stage 2: 10 Minimal Pairs + Same-Sentence Contrast + Ear Quiz + Recording & Playback */}
      {subStage === 'pairs' && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
          <div>
            <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-rose-500" />
              <span>
                Gabriel Wyner 最小对立体耳训与同句跟读 ({data.minimalPairs.length} 组高频易混音全收录)
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              每组均配有<strong>【👂 盲听测耳力】</strong>、<strong>【🎤 双词对比跟读】</strong>以及把两个易混词放进同一句话的<strong>【🔥 同句实战绕口跟读】</strong>（支持回放你自己的录音 + AI 评判）！
            </p>
          </div>

          <div className="space-y-2.5">
            {data.minimalPairs.map((pair, idx) => {
              const isQuizActive = earQuiz && earQuiz.pairIdx === idx;
              const isPracticingWords =
                activePairPractice && activePairPractice.idx === idx && activePairPractice.mode === 'words';
              const isPracticingSentence =
                activePairPractice && activePairPractice.idx === idx && activePairPractice.mode === 'sentence';

              const cleanW1 = cleanSpeakWord(pair.w1);
              const cleanW2 = cleanSpeakWord(pair.w2);
              const bothWordsTarget = `${cleanW1}, ${cleanW2}`;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200/90 p-3 hover:border-blue-300 transition-all shadow-2xs space-y-2"
                >
                  {/* Row 1: Tag + Word A & Word B + Action Buttons */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60 self-start lg:self-center shrink-0">
                      {pair.tag}
                    </span>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Word A */}
                      <div className="flex items-center justify-between bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 rounded-lg px-2.5 py-1.5 transition-colors">
                        <button
                          type="button"
                          onClick={() => speakText(cleanW1, 0.95)}
                          className="text-left flex-1"
                        >
                          <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                            <Volume2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>A: {pair.w1}</span>
                          </div>
                          <div className="text-[10.5px] text-slate-500 font-mono">{pair.ipa1}</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => speakText(cleanW1, 0.6)}
                          className="px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10px] font-bold shrink-0 ml-1"
                        >
                          🐢 慢速
                        </button>
                      </div>

                      {/* Word B */}
                      <div className="flex items-center justify-between bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 rounded-lg px-2.5 py-1.5 transition-colors">
                        <button
                          type="button"
                          onClick={() => speakText(cleanW2, 0.95)}
                          className="text-left flex-1"
                        >
                          <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                            <Volume2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>B: {pair.w2}</span>
                          </div>
                          <div className="text-[10.5px] text-slate-500 font-mono">{pair.ipa2}</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => speakText(cleanW2, 0.6)}
                          className="px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10px] font-bold shrink-0 ml-1"
                        >
                          🐢 慢速
                        </button>
                      </div>
                    </div>

                    {/* Action Triggers: Blind Ear Quiz & Word Pair Follow-Read */}
                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEarQuiz(pair, idx)}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold transition-colors"
                      >
                        👂 盲听测耳力
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActivePairPractice((prev) =>
                            prev && prev.idx === idx && prev.mode === 'words'
                              ? null
                              : { idx, mode: 'words' }
                          )
                        }
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                          isPracticingWords
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                        }`}
                      >
                        🎤 跟读这两词
                      </button>
                    </div>
                  </div>

                  {/* Row 2: Same-Sentence Contrast Box (Contains Both Confusing Words!) */}
                  {pair.sentence && (
                    <div className="bg-slate-50/90 border border-slate-200/80 rounded-lg px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center flex-wrap gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[10px]">
                            🔥 同句对比实战
                          </span>
                          <span className="text-xs font-extrabold text-slate-900">{pair.sentence}</span>
                          <span className="text-[11px] text-slate-500">（{pair.sentenceCn}）</span>
                        </div>
                        <p className="text-[10.5px] text-slate-500">
                          🎯 <strong>发音要领：</strong>
                          {pair.tip}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => speakText(pair.sentence, 0.94)}
                          className="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-600 border border-slate-200 text-[11px] font-bold flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>读整句</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => speakText(pair.sentence, 0.6)}
                          className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold"
                        >
                          🐢 慢速
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setActivePairPractice((prev) =>
                              prev && prev.idx === idx && prev.mode === 'sentence'
                                ? null
                                : { idx, mode: 'sentence' }
                            )
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                            isPracticingSentence
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          🎤 跟读对比句
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Interactive Blind Ear Quiz Box */}
                  {isQuizActive && (
                    <div className="p-2.5 rounded-lg bg-indigo-50/90 border border-indigo-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => speakText(earQuiz.word, 0.92)}
                          className="bg-indigo-600 text-white px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>再听一遍谜题音</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => speakText(earQuiz.word, 0.6)}
                          className="bg-amber-500 text-white px-2 py-1 rounded-lg font-bold text-[11px]"
                        >
                          🐢 慢速听谜题
                        </button>
                        <span className="text-indigo-950 font-semibold">刚刚系统读的是哪一个？</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleGuessEarQuiz(1)}
                          className={`px-2.5 py-1 rounded-lg font-bold border text-[11px] ${
                            earQuiz.guessed === 1
                              ? earQuiz.targetSide === 1
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-rose-600 text-white border-rose-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          猜 A ({pair.w1})
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGuessEarQuiz(2)}
                          className={`px-2.5 py-1 rounded-lg font-bold border text-[11px] ${
                            earQuiz.guessed === 2
                              ? earQuiz.targetSide === 2
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-rose-600 text-white border-rose-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          猜 B ({pair.w2})
                        </button>
                        {earQuiz.guessed !== null && (
                          <span
                            className={`font-extrabold text-[11px] ${
                              earQuiz.guessed === earQuiz.targetSide ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {earQuiz.guessed === earQuiz.targetSide
                              ? '🎉 耳力超准！'
                              : `💡 其实是 ${earQuiz.targetSide === 1 ? 'A' : 'B'}，再点慢速对比听听！`}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Recording & AI Pronunciation Evaluation Drawer for Either Word Pair or Full Contrast Sentence */}
                  {(isPracticingWords || isPracticingSentence) && (
                    <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-blue-900">
                          🎙️ 当前跟读测评目标：
                          <span className="ml-1 px-2 py-0.5 rounded bg-white border border-blue-200 text-blue-700 font-mono">
                            {isPracticingWords ? bothWordsTarget : pair.sentence}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setActivePairPractice(null)}
                          className="text-[11px] text-slate-400 hover:text-slate-600"
                        >
                          收起测评 ✕
                        </button>
                      </div>
                      <PronunciationEvaluator
                        targetSentence={isPracticingWords ? bothWordsTarget : pair.sentence}
                        targetLang={targetLang}
                        readCount={getReadCount(isPracticingWords ? bothWordsTarget : pair.sentence)}
                        onIncrementCount={onIncrementReadCount}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-stage 3: 8 Sound Clusters / Word Families + Ear Quiz + Chain Follow-Read */}
      {subStage === 'clusters' && (
        <div className="space-y-3">
          {data.soundClusters.map((cluster, idx) => {
            const isClusterQuizActive = clusterQuiz && clusterQuiz.clusterIdx === idx;
            const isClusterPracticing = activeClusterPracticeIdx === idx;
            const chainTargetText = cluster.words.map((w) => cleanSpeakWord(w.w)).join(', ');

            return (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-800">{cluster.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{cluster.rule}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => playClusterChain(cluster.words)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>🔊 连读整串词族</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => startClusterQuiz(cluster, idx)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] px-2.5 py-1.5 rounded-lg"
                    >
                      👂 盲听测耳力
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveClusterPracticeIdx((prev) => (prev === idx ? null : idx))
                      }
                      className={`font-bold text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors ${
                        isClusterPracticing
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      🎤 整串跟读测评
                    </button>
                  </div>
                </div>

                {/* 5 Words in the Cluster */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {cluster.words.map((item, wIdx) => {
                    const cleanSpeak = cleanSpeakWord(item.w);
                    return (
                      <div
                        key={wIdx}
                        onClick={() => speakText(cleanSpeak, 0.95)}
                        className="bg-white hover:bg-blue-50/70 border border-slate-200/90 hover:border-blue-400 rounded-xl p-2.5 cursor-pointer transition-all shadow-2xs flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs font-extrabold text-slate-900">{item.w}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(cleanSpeak, 0.6);
                            }}
                            className="px-1.5 py-0.2 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10px] font-bold shrink-0"
                          >
                            🐢
                          </button>
                        </div>
                        <div className="text-[10.5px] font-mono text-amber-700 mt-1">{item.pron}</div>
                        <div className="text-[11px] font-bold text-slate-700 mt-0.5">{item.cn}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Cluster Blind Ear Quiz Box */}
                {isClusterQuizActive && (
                  <div className="p-2.5 rounded-xl bg-indigo-50/90 border border-indigo-200 space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => speakText(clusterQuiz.wordStr, 0.92)}
                          className="bg-indigo-600 text-white px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>重播谜题词</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => speakText(clusterQuiz.wordStr, 0.6)}
                          className="bg-amber-500 text-white px-2 py-1 rounded-lg font-bold text-[11px]"
                        >
                          🐢 慢速听
                        </button>
                        <span className="font-bold text-indigo-950">
                          请盲听：刚才读的是本组 5 个词中的哪一个？
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setClusterQuiz(null)}
                        className="text-[11px] text-slate-400 hover:text-slate-600"
                      >
                        关闭测验 ✕
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {cluster.words.map((wItem, wIdx) => {
                        const isPicked = clusterQuiz.guessedIdx === wIdx;
                        const isCorrect = clusterQuiz.targetWordIdx === wIdx;
                        return (
                          <button
                            key={wIdx}
                            type="button"
                            onClick={() =>
                              setClusterQuiz((prev) => ({ ...prev, guessedIdx: wIdx }))
                            }
                            className={`px-2.5 py-1 rounded-lg font-bold border text-[11px] transition-all ${
                              isPicked
                                ? isCorrect
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-rose-600 text-white border-rose-600'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            {wItem.w}
                          </button>
                        );
                      })}
                      {clusterQuiz.guessedIdx !== null && (
                        <span
                          className={`font-extrabold text-[11px] ml-1 ${
                            clusterQuiz.guessedIdx === clusterQuiz.targetWordIdx
                              ? 'text-emerald-700'
                              : 'text-rose-600'
                          }`}
                        >
                          {clusterQuiz.guessedIdx === clusterQuiz.targetWordIdx
                            ? '🎉 完全正确！同音家族辨音通关！'
                            : `💡 正确答案是「${cluster.words[clusterQuiz.targetWordIdx].w}」，再点重播听听看！`}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Cluster Chain Recording & Evaluation Drawer */}
                {isClusterPracticing && (
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-emerald-950">
                        🎙️ 整串词族连读测评：
                        <span className="ml-1 px-2 py-0.5 rounded bg-white border border-emerald-200 text-emerald-800 font-mono">
                          {chainTargetText}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveClusterPracticeIdx(null)}
                        className="text-[11px] text-slate-400 hover:text-slate-600"
                      >
                        收起测评 ✕
                      </button>
                    </div>
                    <PronunciationEvaluator
                      targetSentence={chainTargetText}
                      targetLang={targetLang}
                      readCount={getReadCount(chainTargetText)}
                      onIncrementCount={onIncrementReadCount}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- TAB 2: 12 Sentences Deconstruction (2-Column Grid with Trap & Workplace Below Each Sentence) ---
const TabDeconstruction = ({ targetLang, isSentenceSaved, onToggleSaveSentence }) => {
  const sentences = sentencesByLang[targetLang] || sentencesByLang.en;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
      {sentences.map((item) => {
        const fullCoreSentence = item.en.join(' ');
        const workplaceWords = item.workplace.split(' ');
        const saved = isSentenceSaved(item.workplace);

        return (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200/90 hover:border-blue-300 transition-all p-3.5 flex flex-col justify-between space-y-2.5 shadow-2xs"
          >
            {/* Top Area: Number Badge + 3-Layer Colored Line Visualizer + Normal/Slow Audio */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-600 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {item.id}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10.5px] font-semibold text-slate-400">
                    悬停单词看释义 · 点击单词或喇叭发音
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => speakText(fullCoreSentence, 0.95)}
                      className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                      title="常速整句朗读"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => speakText(fullCoreSentence, 0.62)}
                      className="px-1.5 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10.5px] font-bold transition-colors"
                      title="0.65x 慢速朗读"
                    >
                      🐢 慢速
                    </button>
                  </div>
                </div>

                <MiniSentenceVisualizer
                  en={item.en}
                  lit={item.lit}
                  nat={item.nat}
                  mapping={item.mapping}
                />
              </div>
            </div>

            {/* Bottom Area: Trap & Workplace Example Directly Below Sentence */}
            <div className="pt-2.5 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/70 font-bold text-[10.5px] shrink-0 mt-0.5">
                  陷阱
                </span>
                <p className="text-slate-600 leading-relaxed text-[11.5px]">{item.trap}</p>
              </div>

              <div className="flex items-center justify-between gap-2 bg-slate-50/80 rounded-lg px-2 py-1.5 border border-slate-200/60">
                <div className="flex items-center flex-wrap gap-1 min-w-0">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/70 font-bold text-[10.5px] shrink-0 mr-1">
                    职场
                  </span>
                  <button
                    type="button"
                    onClick={() => speakText(item.workplace, 0.95)}
                    className="text-emerald-600 hover:text-emerald-700 p-0.5 shrink-0"
                    title="朗读职场例句"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  {workplaceWords.map((w, idx) => (
                    <WordWithTooltip key={idx} word={w} />
                  ))}
                  <button
                    type="button"
                    onClick={() => speakText(item.workplace, 0.62)}
                    className="px-1.5 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10px] font-bold ml-1 shrink-0"
                  >
                    🐢 慢速
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onToggleSaveSentence({
                      en: item.workplace,
                      cn: `对应第 ${item.id} 句职场高频表达`,
                      skeletonId: item.id,
                      tag: '职场例句'
                    })
                  }
                  className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold border shrink-0 transition-all ${
                    saved
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-white hover:bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {saved ? '★ 已收藏' : '☆ 收藏'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- TAB 3: Sentence Substitution, Zero-Basis Lego Builder & AI Pronunciation Diagnosis ---
const TabSubstitution = ({
  targetLang,
  initialSkeletonId = 11,
  getReadCount,
  onIncrementReadCount,
  isSentenceSaved,
  onToggleSaveSentence
}) => {
  const sentences = sentencesByLang[targetLang] || sentencesByLang.en;
  const langConfig = LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en;

  const [selectedSkeletonId, setSelectedSkeletonId] = useState(initialSkeletonId || 11);
  const [scenarioCat, setScenarioCat] = useState('work'); // 'work' | 'daily' | 'living' | 'travel'
  const [batchIdx, setBatchIdx] = useState(0);
  const [aiCustomBatch, setAiCustomBatch] = useState(null);
  const [loadingBatch, setLoadingBatch] = useState(false);

  const [selectedExampleIdx, setSelectedExampleIdx] = useState(0); // 0..4 or 'custom'
  const [customChineseInput, setCustomChineseInput] = useState('');

  const [inputMode, setInputMode] = useState('lego'); // 'lego' | 'type'
  const [userTranslation, setUserTranslation] = useState('');
  const [selectedLegoTiles, setSelectedLegoTiles] = useState([]);

  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  useEffect(() => {
    if (initialSkeletonId) {
      setSelectedSkeletonId(initialSkeletonId);
    }
  }, [initialSkeletonId]);

  const currentSkeleton =
    sentences.find((s) => s.id === selectedSkeletonId) || sentences[0];

  const batchesForCat =
    scenarioBatchesBySkeleton.default[scenarioCat] ||
    scenarioBatchesBySkeleton.default.work;
  const currentExamplesList =
    aiCustomBatch || batchesForCat[batchIdx % batchesForCat.length];

  const activeChineseTarget =
    selectedExampleIdx === 'custom'
      ? customChineseInput.trim() || '我打算明天把修改后的方案发给客户。'
      : currentExamplesList[selectedExampleIdx] || currentExamplesList[0];

  const legoData = buildLegoBlocksForSentence(targetLang, selectedSkeletonId);

  useEffect(() => {
    setSelectedLegoTiles([]);
    setUserTranslation('');
    setDiagnosisResult(null);
  }, [selectedSkeletonId, targetLang]);

  const handleCycleBatch = () => {
    setAiCustomBatch(null);
    setBatchIdx((prev) => (prev + 1) % batchesForCat.length);
    setSelectedExampleIdx(0);
  };

  const handleGenerateAiExamples = async () => {
    setLoadingBatch(true);
    const catNames = { work: '职场工作', daily: '日常沟通', living: '海外生活', travel: '旅游出行' };
    const prompt = `
      当前练习语法骨架：第 ${currentSkeleton.id} 句 "${currentSkeleton.en.join(' ')}" (${currentSkeleton.nat.join('')})
      应用场景：${catNames[scenarioCat]}
      请生成 5 个适合套用该语法骨架进行翻译练习的地道中文短句。
    `;
    const schema = {
      type: 'OBJECT',
      properties: {
        sentences: { type: 'ARRAY', items: { type: 'STRING' } }
      },
      required: ['sentences']
    };
    const res = await callGemini(prompt, '你是专业的语言教学设计师。', schema);
    if (res) {
      try {
        const parsed = JSON.parse(res);
        if (Array.isArray(parsed.sentences) && parsed.sentences.length >= 5) {
          setAiCustomBatch(parsed.sentences.slice(0, 5));
          setSelectedExampleIdx(0);
        }
      } catch (e) {}
    }
    setLoadingBatch(false);
  };

  const handleAddLegoTile = (block) => {
    speakText(block.word, 0.95);
    const next = [...selectedLegoTiles, block];
    setSelectedLegoTiles(next);
    setUserTranslation(next.map((b) => b.word).join(' '));
  };

  const handleRemoveLegoTile = (idx) => {
    const next = selectedLegoTiles.filter((_, i) => i !== idx);
    setSelectedLegoTiles(next);
    setUserTranslation(next.map((b) => b.word).join(' '));
  };

  const handleFillRecommendedOrder = () => {
    setUserTranslation(legoData.recommendedOrder);
    speakText(legoData.recommendedOrder, 0.95);
  };

  // Ensure words array and full sentence stay 100% synced
  const getSyncedSentenceData = (sentenceStr) => {
    const clean = String(sentenceStr || '').trim();
    const words = clean ? clean.split(/\s+/) : [];
    return { fullSentence: clean, words };
  };

  const handleRunDiagnosis = async () => {
    const attempt = userTranslation.trim() || legoData.recommendedOrder;
    setLoadingDiagnosis(true);

    const prompt = `
      目标学习语言: ${langConfig.name} (${langConfig.code})
      所选第 ${currentSkeleton.id} 句核心语法骨架: "${currentSkeleton.en.join(' ')}"
      目标中文句: "${activeChineseTarget}"
      用户的${langConfig.name}尝试: "${attempt}"

      请严格输出 JSON 格式诊断：
      1. feedback: 用中文点评用户的句子是否正确套用了骨架，指出语序或语法亮点与修正建议。
      2. standardSentence: 套用当前骨架最标准、完整的${langConfig.name}句子（绝不能漏掉冠词或助词）。
      3. alternatives: 提供 2 个母语者高频同义替换句，每项包含：
         - sentence: 完整的${langConfig.name}替换句（必须包含完整冠词/助词）
         - register: 适用语境标签（如“商务正式”或“日常地道口语”）
         - grammarCompare: 详细讲解该替换句与基础骨架句的对比（例如为什么用了某个短语、冠词或助词如何变化）。
    `;

    const schema = {
      type: 'OBJECT',
      properties: {
        feedback: { type: 'STRING' },
        standardSentence: { type: 'STRING' },
        alternatives: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              sentence: { type: 'STRING' },
              register: { type: 'STRING' },
              grammarCompare: { type: 'STRING' }
            },
            required: ['sentence', 'register', 'grammarCompare']
          }
        }
      },
      required: ['feedback', 'standardSentence', 'alternatives']
    };

    const res = await callGemini(prompt, `你是精通${langConfig.name}的母语级语法教练。`, schema);
    if (res) {
      try {
        const parsed = JSON.parse(res);
        setDiagnosisResult(parsed);
      } catch (e) {}
    } else {
      setDiagnosisResult({
        feedback: `很好地套用了第 ${currentSkeleton.id} 句的骨架结构！注意保持动词变位和语序的连贯性。`,
        standardSentence: currentSkeleton.workplace,
        alternatives: [
          {
            sentence: currentSkeleton.en.join(' '),
            register: '核心骨架原句',
            grammarCompare: `严格遵循第 ${currentSkeleton.id} 句的底层语序：${currentSkeleton.trap}`
          }
        ]
      });
    }
    setLoadingDiagnosis(false);
  };

  return (
    <div className="space-y-3.5">
      {/* Step 1: Select Core Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-800">
            1. 选择要套用的黄金句型骨架 (Skeleton)
          </h3>
          <span className="text-[11px] text-blue-600 font-semibold">
            当前骨架: #{currentSkeleton.id} {currentSkeleton.en.join(' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
          {sentences.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedSkeletonId(s.id)}
              className={`text-left px-2.5 py-1.5 rounded-lg border text-xs transition-all truncate ${
                selectedSkeletonId === s.id
                  ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
              }`}
            >
              <span className="opacity-75 mr-1">{s.id}.</span>
              <span>{s.en.join(' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Select Scenario & 5 Target Chinese Sentences + Custom Radio Option */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-extrabold text-slate-800">
            2. 选择应用场景与目标中文句 (Scenario)
          </h3>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCycleBatch}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>换一批 ({(batchIdx % batchesForCat.length) + 1}/{batchesForCat.length})</span>
            </button>
            <button
              type="button"
              onClick={handleGenerateAiExamples}
              disabled={loadingBatch}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold disabled:opacity-50"
            >
              {loadingBatch ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              <span>✨ AI新句</span>
            </button>
          </div>
        </div>

        {/* 4 Category Tabs */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: 'work', label: '工作' },
            { id: 'daily', label: '日常' },
            { id: 'living', label: '生活' },
            { id: 'travel', label: '旅游' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setScenarioCat(cat.id);
                setAiCustomBatch(null);
                setSelectedExampleIdx(0);
              }}
              className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                scenarioCat === cat.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 5 Preset Radio Options + 6th Custom Option */}
        <div className="space-y-1.5">
          {currentExamplesList.map((sentenceText, idx) => {
            const isSelected = selectedExampleIdx === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedExampleIdx(idx)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border cursor-pointer text-xs transition-all ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-bold'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-blue-600' : 'border-slate-400'
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                </span>
                <span>{sentenceText}</span>
              </div>
            );
          })}

          {/* 6th Option: Custom Target Sentence */}
          <div
            onClick={() => setSelectedExampleIdx('custom')}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border cursor-pointer text-xs transition-all ${
              selectedExampleIdx === 'custom'
                ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-bold'
                : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                selectedExampleIdx === 'custom' ? 'border-blue-600' : 'border-slate-400'
              }`}
            >
              {selectedExampleIdx === 'custom' && <span className="w-2 h-2 rounded-full bg-blue-600" />}
            </span>
            <span>✍️ 自定义中文目标句（点击此处输入你想表达的句子）</span>
          </div>
        </div>

        {/* Conditional Display: Only show input box when 'custom' is selected */}
        {selectedExampleIdx === 'custom' ? (
          <input
            type="text"
            value={customChineseInput}
            onChange={(e) => setCustomChineseInput(e.target.value)}
            placeholder="请输入你想翻译练习的中文句子..."
            autoFocus
            className="w-full px-3 py-2 rounded-lg border-2 border-blue-500 text-xs focus:outline-none bg-white"
          />
        ) : (
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
            <span>
              🎯 当前选中目标句：<strong className="text-slate-800">{activeChineseTarget}</strong>
            </span>
            <span className="text-blue-600 font-semibold">请直接前往下方第 3 步拼句或输入 ↓</span>
          </div>
        )}
      </div>

      {/* Step 3: Zero-Basis Lego Builder Mode OR Free Typing Mode */}
      <div className="bg-white rounded-xl border-l-4 border-l-blue-600 border border-slate-200 p-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-extrabold text-slate-800">
            3. 你的{langConfig.name}模块替换 (Your Translation)
          </h3>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setInputMode('lego')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                inputMode === 'lego'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🧩 零基础积木拼句
            </button>
            <button
              type="button"
              onClick={() => setInputMode('type')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                inputMode === 'type'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⌨️ 自由打字输入
            </button>
          </div>
        </div>

        {inputMode === 'lego' ? (
          <div className="space-y-2.5">
            {/* Assembled Sentence Tray */}
            <div className="min-h-[46px] p-2 rounded-xl bg-slate-50 border border-dashed border-slate-300 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedLegoTiles.length === 0 ? (
                  <span className="text-xs text-slate-400">
                    👇 请按语序点击下方词块积木组装句子（点击词块会自动朗读发音）...
                  </span>
                ) : (
                  selectedLegoTiles.map((tile, idx) => (
                    <button
                      key={`${tile.id}-${idx}`}
                      type="button"
                      onClick={() => handleRemoveLegoTile(idx)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center gap-1 shadow-2xs hover:bg-rose-600 transition-colors"
                      title="点击移除该词块"
                    >
                      <span>{tile.word}</span>
                      <X className="w-3 h-3 opacity-80" />
                    </button>
                  ))
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleFillRecommendedOrder}
                  className="px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold"
                >
                  💡 看骨架答案语序
                </button>
                {selectedLegoTiles.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLegoTiles([]);
                      setUserTranslation('');
                    }}
                    className="px-2 py-1 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold"
                  >
                    清空
                  </button>
                )}
              </div>
            </div>

            {/* Available Word Blocks */}
            <div className="flex flex-wrap gap-1.5">
              {legoData.blocks.map((block) => (
                <button
                  key={block.id}
                  type="button"
                  onClick={() => handleAddLegoTile(block)}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 transition-all shadow-2xs text-left"
                >
                  <div className="text-xs font-extrabold text-slate-900">{block.word}</div>
                  <div className="text-[10px] text-slate-400">{block.hint}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <textarea
            rows={2}
            value={userTranslation}
            onChange={(e) => setUserTranslation(e.target.value)}
            placeholder={`套用骨架 "${currentSkeleton.en.join(' ')}" 将上方中文翻译为${langConfig.name}...`}
            className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
          />
        )}
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleRunDiagnosis}
        disabled={loadingDiagnosis}
        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-60 transition-all"
      >
        {loadingDiagnosis ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>AI 正在诊断句型与生成母语替换句...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>AI 句型诊断替换与纠音</span>
          </>
        )}
      </button>

      {/* AI Diagnosis & Native Alternatives Result */}
      {diagnosisResult && (
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-3.5">
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-lg p-2.5 text-xs text-slate-700 leading-relaxed">
            <strong className="text-blue-700">🎯 AI 骨架诊断：</strong>
            {diagnosisResult.feedback}
          </div>

          {/* Standard Skeleton Match Sentence */}
          {(() => {
            const syncedStd = getSyncedSentenceData(diagnosisResult.standardSentence);
            const saved = isSentenceSaved(syncedStd.fullSentence);
            return (
              <div className="border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-emerald-700">
                    ✅ 标准骨架造句 (Standard Skeleton Match)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onToggleSaveSentence({
                        en: syncedStd.fullSentence,
                        cn: activeChineseTarget,
                        skeletonId: currentSkeleton.id,
                        tag: '标准骨架句'
                      })
                    }
                    className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                      saved
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {saved ? '★ 已收藏金句' : '☆ 收藏到金句本'}
                  </button>
                </div>

                <div className="flex items-center flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => speakText(syncedStd.fullSentence, 0.95)}
                    className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  {syncedStd.words.map((w, idx) => (
                    <WordWithTooltip key={idx} word={w} />
                  ))}
                  <button
                    type="button"
                    onClick={() => speakText(syncedStd.fullSentence, 0.62)}
                    className="px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10.5px] font-bold"
                  >
                    🐢 慢速
                  </button>
                </div>

                <PronunciationEvaluator
                  targetSentence={syncedStd.fullSentence}
                  targetLang={targetLang}
                  readCount={getReadCount(syncedStd.fullSentence)}
                  onIncrementCount={onIncrementReadCount}
                />
              </div>
            );
          })()}

          {/* Native Alternatives with Grammar & Register Comparison */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold text-slate-800">
              🌟 母语者高频同义替换句 (Native Alternatives & 语法对比)
            </h4>

            {(diagnosisResult.alternatives || []).map((alt, idx) => {
              const syncedAlt = getSyncedSentenceData(alt.sentence);
              const saved = isSentenceSaved(syncedAlt.fullSentence);
              return (
                <div
                  key={idx}
                  className="border border-slate-200/90 rounded-xl p-3 space-y-2 bg-slate-50/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => speakText(syncedAlt.fullSentence, 0.95)}
                        className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      {syncedAlt.words.map((w, wIdx) => (
                        <WordWithTooltip key={wIdx} word={w} />
                      ))}
                      <button
                        type="button"
                        onClick={() => speakText(syncedAlt.fullSentence, 0.62)}
                        className="px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10.5px] font-bold"
                      >
                        🐢 慢速
                      </button>
                      {alt.register && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10.5px] font-bold">
                          {alt.register}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onToggleSaveSentence({
                          en: syncedAlt.fullSentence,
                          cn: activeChineseTarget,
                          skeletonId: currentSkeleton.id,
                          tag: alt.register || '母语替换句'
                        })
                      }
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        saved
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {saved ? '★ 已收藏' : '☆ 收藏'}
                    </button>
                  </div>

                  {alt.grammarCompare && (
                    <div className="bg-amber-50/70 border border-amber-200/70 rounded-lg p-2 text-[11px] text-slate-700 leading-relaxed">
                      💡 <strong>语法与例句对比解析：</strong>
                      {alt.grammarCompare}
                    </div>
                  )}

                  <PronunciationEvaluator
                    targetSentence={syncedAlt.fullSentence}
                    targetLang={targetLang}
                    readCount={getReadCount(syncedAlt.fullSentence)}
                    onIncrementCount={onIncrementReadCount}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// --- TAB 4: Natural Human-Like Roleplay Scenario (Separated Chat & Coach Whisper) ---
const TabScenario = ({ targetLang, isSentenceSaved, onToggleSaveSentence }) => {
  const langConfig = LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en;

  const personasByLang = {
    en: [
      {
        id: 'alex',
        name: '💼 商务议价 (Alex)',
        role: '北美科技公司采购总监',
        opening: "Hey there! Glad we could hop on a quick call. Look, I went through your proposal—the features look solid, honestly. Is the final contract ready for us to review today?",
        openingCn: '嗨！很高兴能快速通个话。我看过你们的方案了，功能确实很扎实。今天的最终合同准备好给我们审阅了吗？',
        scaffoldHint: "可套用第 1 句 (The contract is ready) 或第 11 句 (I'm going to send it to you tomorrow)",
        sampleReply: "Yes, the contract is ready. I'm going to send it to you this afternoon."
      },
      {
        id: 'mia',
        name: '☕ 咖啡厅偶遇 (Mia)',
        role: '热情健谈的纽约设计师朋友',
        opening: "Oh, hey! Grab a seat! I didn't expect to run into you here. Wait, what's that book in your hand? Is it John's new novel?",
        openingCn: '噢，嗨！快坐！真没想到在这儿碰见你。等等，你手里拿的那本书是什么？是约翰的新小说吗？',
        scaffoldHint: "可套用第 2 句 (It is John's...) 或第 10 句 (I want to give it to her)",
        sampleReply: "Yes, it is John's book! I want to give it to him tomorrow."
      }
    ],
    ja: [
      {
        id: 'sato',
        name: '💼 东京商务会议 (佐藤部长)',
        role: '温和严谨的日本合作方部长',
        opening: 'お疲れ様です！先日はご提案ありがとうございました。ところで、新しい契約書はもう準備できていますか？',
        openingCn: '辛苦了！感谢前几天的提案。话说回来，新的合同已经准备好了吗？',
        scaffoldHint: '可套用第 1 句 (はい、準備できています) 或第 11 句 (明日送るつもりです)',
        sampleReply: 'はい、準備できています。明日それを佐藤さんに送るつもりです。'
      },
      {
        id: 'ken',
        name: '🍙 日本便利店与问路 (店员健太)',
        role: '热心的东京便利店店员',
        opening: 'いらっしゃいませ！お弁当は温めますか？あと、レジ袋はご利用ですか？',
        openingCn: '欢迎光临！便当需要加热吗？另外需要塑料袋吗？',
        scaffoldHint: '可套用第 10 句 (温めたいです) 或礼貌回应 (はい、お願いします)',
        sampleReply: 'はい、お願いします。このリンゴも買いたいです。'
      }
    ],
    es: [
      {
        id: 'carlos',
        name: '💼 马德里商务洽谈 (Carlos)',
        role: '直爽热情的西班牙项目总监',
        opening: '¡Hola! Qué bueno hablar contigo. Oye, revisé los datos del proyecto. ¿Está listo el contrato final para hoy?',
        openingCn: '你好！很高兴和你沟通。嘿，我看了项目数据。今天的最终合同准备好了吗？',
        scaffoldHint: '可套用第 1 句 (Sí, el contrato está listo) 或第 11 句 (Voy a enviárselo mañana)',
        sampleReply: 'Sí, el contrato está listo. Voy a enviárselo mañana.'
      }
    ]
  };

  const personas = personasByLang[targetLang] || personasByLang.en;
  const [selectedPersonaId, setSelectedPersonaId] = useState(personas[0].id);
  const activePersona = personas.find((p) => p.id === selectedPersonaId) || personas[0];

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);
  const [autoSpeakAi, setAutoSpeakAi] = useState(true);
  const [showTransMap, setShowTransMap] = useState({});
  const [scaffold, setScaffold] = useState({
    hint: activePersona.scaffoldHint,
    sample: activePersona.sampleReply
  });

  useEffect(() => {
    const first = (personasByLang[targetLang] || personasByLang.en)[0];
    setSelectedPersonaId(first.id);
    setMessages([
      {
        id: 'init-1',
        role: 'ai',
        text: first.opening,
        cn: first.openingCn
      }
    ]);
    setScaffold({
      hint: first.scaffoldHint,
      sample: first.sampleReply
    });
  }, [targetLang]);

  const handleSelectPersona = (p) => {
    setSelectedPersonaId(p.id);
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'ai',
        text: p.opening,
        cn: p.openingCn
      }
    ]);
    setScaffold({
      hint: p.scaffoldHint,
      sample: p.sampleReply
    });
  };

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text || loadingReply) return;

    const userMsgId = `user-${Date.now()}`;
    const newUserMsg = { id: userMsgId, role: 'user', text, coachTip: null, upgraded: null };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputText('');
    setLoadingReply(true);

    const historyText = messages
      .slice(-4)
      .map((m) => `${m.role === 'ai' ? activePersona.name : 'User'}: ${m.text}`)
      .join('\n');

    const prompt = `
      你正在扮演：${activePersona.name} (${activePersona.role})，使用地道自然的${langConfig.name}与用户进行真人对话。
      近期对话记录：
      ${historyText}
      User 刚刚说: "${text}"

      请严格返回 JSON 格式（将对话与教练点评完全分离）：
      1. reply: 你作为 ${activePersona.name} 的自然口语回复（仅包含纯粹地道的${langConfig.name}口语，带真实语气词，绝不夹杂中文或语法说教，1~2句话）。
      2. replyCn: 该回复的自然中文翻译。
      3. coachWhisper: 用中文简短点评用户刚才那句话的语法/语序（30字内）。
      4. nativeUpgrade: 把用户刚才那句话润色成更地道的母语者表达（仅${langConfig.name}句子）。
      5. nextScaffoldHint: 提示用户下一句可以套用12句中的什么结构来接话。
      6. nextSampleReply: 给出一句供用户参考的下一句${langConfig.name}回答示例。
    `;

    const schema = {
      type: 'OBJECT',
      properties: {
        reply: { type: 'STRING' },
        replyCn: { type: 'STRING' },
        coachWhisper: { type: 'STRING' },
        nativeUpgrade: { type: 'STRING' },
        nextScaffoldHint: { type: 'STRING' },
        nextSampleReply: { type: 'STRING' }
      },
      required: ['reply', 'replyCn', 'coachWhisper', 'nativeUpgrade', 'nextScaffoldHint', 'nextSampleReply']
    };

    const res = await callGemini(prompt, `你是地道的${langConfig.name}母语对话伙伴与幕后教练。`, schema);
    if (res) {
      try {
        const parsed = JSON.parse(res);
        setMessages((prev) =>
          prev
            .map((m) =>
              m.id === userMsgId
                ? { ...m, coachTip: parsed.coachWhisper, upgraded: parsed.nativeUpgrade }
                : m
            )
            .concat({
              id: `ai-${Date.now()}`,
              role: 'ai',
              text: parsed.reply,
              cn: parsed.replyCn
            })
        );
        setScaffold({
          hint: parsed.nextScaffoldHint,
          sample: parsed.nextSampleReply
        });
        if (autoSpeakAi) {
          speakText(parsed.reply, 0.96);
        }
      } catch (e) {}
    }
    setLoadingReply(false);
  };

  return (
    <div className="space-y-3">
      {/* Top Bar: Persona Switcher & Auto-Speak Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        <div className="flex flex-wrap gap-1.5">
          {personas.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectPersona(p)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedPersonaId === p.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setAutoSpeakAi((v) => !v)}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
            autoSpeakAi
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-white text-slate-500 border-slate-200'
          }`}
        >
          {autoSpeakAi ? '🔊 对方自动开口说: 开启' : '🔇 对方自动开口说: 关闭'}
        </button>
      </div>

      {/* Chat Messages Stream */}
      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 space-y-3 max-h-[380px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs space-y-1.5 shadow-2xs ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs'
                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[10.5px] opacity-75">
                  {msg.role === 'user' ? '你 (You)' : activePersona.name}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => speakText(msg.text, 0.95)}
                    className={`p-1 rounded-full ${
                      msg.role === 'user'
                        ? 'hover:bg-blue-500 text-white'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                    }`}
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => speakText(msg.text, 0.62)}
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      msg.role === 'user'
                        ? 'bg-blue-700 text-amber-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    🐢 慢速
                  </button>
                  {msg.cn && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowTransMap((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }))
                      }
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                    >
                      {showTransMap[msg.id] ? '隐藏译文' : '看译文'}
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs md:text-sm font-semibold leading-relaxed">{msg.text}</p>

              {msg.cn && showTransMap[msg.id] && (
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  {msg.cn}
                </p>
              )}
            </div>

            {/* Coach Whisper Box Under User Message */}
            {msg.role === 'user' && (msg.coachTip || msg.upgraded) && (
              <div className="mt-1.5 max-w-[85%] bg-amber-50/90 border border-amber-200 rounded-xl px-3 py-2 text-[11px] text-slate-700 space-y-1">
                {msg.coachTip && (
                  <div>
                    <strong className="text-amber-800">💡 教练悄悄话：</strong>
                    {msg.coachTip}
                  </div>
                )}
                {msg.upgraded && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-amber-200/60">
                    <div>
                      <span className="font-bold text-emerald-700">✨ 更地道表达：</span>
                      <span className="font-extrabold text-slate-900">{msg.upgraded}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => speakText(msg.upgraded, 0.95)}
                        className="px-1.5 py-0.5 rounded bg-white text-blue-600 border border-blue-200 text-[10px] font-bold"
                      >
                        🔊 朗读
                      </button>
                      <button
                        type="button"
                        onClick={() => speakText(msg.upgraded, 0.62)}
                        className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold"
                      >
                        🐢 慢速
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onToggleSaveSentence({
                            en: msg.upgraded,
                            cn: '场景实战地道升级句',
                            skeletonId: 1,
                            tag: '实战好句'
                          })
                        }
                        className="px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200 text-[10px] font-bold"
                      >
                        {isSentenceSaved(msg.upgraded) ? '★ 已收藏' : '☆ 收藏'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dynamic Response Scaffold Hint Bar */}
      <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="text-indigo-950">
          <span className="font-extrabold text-indigo-700">💡 接话灵感：</span>
          <span>{scaffold.hint}</span>
        </div>
        <button
          type="button"
          onClick={() => setInputText(scaffold.sample)}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-[11px] shrink-0"
        >
          ✨ 填入参考句
        </button>
      </div>

      {/* Input Row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={`用${langConfig.name}回复 ${activePersona.name}...`}
          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={loadingReply}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
        >
          {loadingReply ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>发送</span>
        </button>
      </div>
    </div>
  );
};

// --- TAB 5: Personal Golden Sentence Notebook (LocalStorage Persistence + Commute Loop Player) ---
const TabNotebook = ({
  notebook,
  onRemoveSentence,
  onImportNotebook,
  getReadCount,
  onIncrementReadCount,
  targetLang
}) => {
  const [isLoopPlaying, setIsLoopPlaying] = useState(false);
  const [currentLoopIdx, setCurrentLoopIdx] = useState(0);
  const loopActiveRef = useRef(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      loopActiveRef.current = false;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startCommuteLoop = () => {
    if (notebook.length === 0) return;
    loopActiveRef.current = true;
    setIsLoopPlaying(true);
    let idx = 0;

    const playNext = () => {
      if (!loopActiveRef.current || notebook.length === 0) return;
      const item = notebook[idx % notebook.length];
      setCurrentLoopIdx(idx % notebook.length);
      idx += 1;
      speakText(item.en, 0.92, 1.0, () => {
        if (loopActiveRef.current) {
          setTimeout(playNext, 900);
        }
      });
    };

    playNext();
  };

  const stopCommuteLoop = () => {
    loopActiveRef.current = false;
    setIsLoopPlaying(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notebook, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'deconstruction_dozen_notebook.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          onImportNotebook(parsed);
        }
      } catch (err) {}
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-3.5">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800">
            📒 我的肌肉记忆金句本 (浏览器本地自动存档)
          </h3>
          <p className="text-[11px] text-slate-500">
            所有收藏的句子与 20 遍跟读进度均保存在当前浏览器 `localStorage` 中，支持一键导出 JSON 备份。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {notebook.length > 0 && (
            <button
              type="button"
              onClick={isLoopPlaying ? stopCommuteLoop : startCommuteLoop}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                isLoopPlaying
                  ? 'bg-rose-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoopPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isLoopPlaying ? '停止通勤连播' : '🎧 通勤循环连播'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportJson}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出备份</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>导入恢复</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>
      </div>

      {notebook.length === 0 ? (
        <div className="text-center py-10 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 space-y-1">
          <Bookmark className="w-7 h-7 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-600">金句本还是空的</p>
          <p className="text-[11px] text-slate-400">
            在【12句拆解】、【句型替换】或【场景实战】中点击「☆ 收藏」，即可将好句收入此处反复跟读！
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notebook.map((item, idx) => (
            <div
              key={item.en}
              className={`rounded-xl border p-3 space-y-2 transition-all ${
                isLoopPlaying && currentLoopIdx === idx
                  ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                      {item.tag || `骨架 #${item.skeletonId || 1}`}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">{item.en}</span>
                    <button
                      type="button"
                      onClick={() => speakText(item.en, 0.95)}
                      className="p-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => speakText(item.en, 0.62)}
                      className="px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10px] font-bold"
                    >
                      🐢 慢速
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">{item.cn}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveSentence(item.en)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                  title="移除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <PronunciationEvaluator
                targetSentence={item.en}
                targetLang={targetLang}
                readCount={getReadCount(item.en)}
                onIncrementCount={onIncrementReadCount}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [targetLang, setTargetLang] = useState(() => loadFromStorage(STORAGE_KEYS.LANG, 'en'));
  const [activeTab, setActiveTab] = useState('map');
  const [jumpSkeletonId, setJumpSkeletonId] = useState(11);

  const [notebook, setNotebook] = useState(() => loadFromStorage(STORAGE_KEYS.NOTEBOOK, []));
  const [readCounts, setReadCounts] = useState(() => loadFromStorage(STORAGE_KEYS.PROGRESS, {}));

  const [showApiModal, setShowApiModal] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => loadFromStorage(STORAGE_KEYS.API_KEY, ''));

  useEffect(() => {
    setSpeechLang((LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en).speechLang);
    saveToStorage(STORAGE_KEYS.LANG, targetLang);
  }, [targetLang]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NOTEBOOK, notebook);
  }, [notebook]);

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

  const isSentenceSaved = (enStr) => notebook.some((item) => item.en === enStr);

  const handleToggleSaveSentence = (sentenceObj) => {
    setNotebook((prev) => {
      const exists = prev.some((item) => item.en === sentenceObj.en);
      if (exists) {
        return prev.filter((item) => item.en !== sentenceObj.en);
      }
      return [{ ...sentenceObj, savedAt: Date.now() }, ...prev];
    });
  };

  const handleRemoveSentence = (enStr) => {
    setNotebook((prev) => prev.filter((item) => item.en !== enStr));
  };

  const handleJumpToPracticeWithSkeleton = (skeletonId) => {
    setJumpSkeletonId(skeletonId || 11);
    setActiveTab('substitution');
  };

  const tabs = [
    { id: 'map', label: '0. 🗺️ 语言地图', icon: MapIcon },
    { id: 'zero', label: '1. 🗣️ 发音与辨音', icon: Volume2 },
    { id: 'words', label: '2. 🧱 3000词拼读', icon: Layers },
    { id: 'pictures', label: '3. 🚶 看图小人短句', icon: PersonStanding },
    { id: 'deconstruction', label: '4. 📖 12句拆解', icon: BookOpen },
    { id: 'substitution', label: '5. 🧩 句型替换与拼句', icon: RefreshCw },
    { id: 'scenario', label: '6. 💬 场景实战', icon: MessageSquare },
    { id: 'notebook', label: `7. 📒 金句本 (${notebook.length})`, icon: Bookmark }
  ];

  const totalMastered = Object.values(readCounts).filter((c) => c >= 20).length;
  const langConfig = LANGUAGE_CONFIG[targetLang] || LANGUAGE_CONFIG.en;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-2 md:p-3">
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
              className="lg:hidden px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>API</span>
            </button>
          </div>

          {/* Navigation Tabs + Settings */}
          <div className="flex flex-wrap items-center gap-1.5">
            <nav className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              {tabs.map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={() => setShowApiModal(true)}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200/80"
              title="配置自定义 Gemini API Key (BYOK)"
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>API设置</span>
            </button>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="bg-white rounded-2xl shadow-2xs border border-slate-200 p-2.5 md:p-4">
          {activeTab === 'zero' && (
            <TabZeroToOne
              targetLang={targetLang}
              getReadCount={getReadCount}
              onIncrementReadCount={handleIncrementReadCount}
              onJumpToPracticeWithSkeleton={handleJumpToPracticeWithSkeleton}
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
              isSentenceSaved={isSentenceSaved}
              onToggleSaveSentence={handleToggleSaveSentence}
            />
          )}
          {activeTab === 'substitution' && (
            <TabSubstitution
              targetLang={targetLang}
              initialSkeletonId={jumpSkeletonId}
              getReadCount={getReadCount}
              onIncrementReadCount={handleIncrementReadCount}
              isSentenceSaved={isSentenceSaved}
              onToggleSaveSentence={handleToggleSaveSentence}
            />
          )}
          {activeTab === 'scenario' && (
            <TabScenario
              targetLang={targetLang}
              isSentenceSaved={isSentenceSaved}
              onToggleSaveSentence={handleToggleSaveSentence}
            />
          )}
          {activeTab === 'notebook' && (
            <TabNotebook
              notebook={notebook}
              onRemoveSentence={handleRemoveSentence}
              onImportNotebook={(list) => setNotebook(list)}
              getReadCount={getReadCount}
              onIncrementReadCount={handleIncrementReadCount}
              targetLang={targetLang}
            />
          )}
        </main>
      </div>

      {/* BYOK API Key Modal */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 space-y-3 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>开源版 API Key 本地设置 (BYOK)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowApiModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              在当前预览环境中无需填写即可直接使用。若您将本项目开源部署到 GitHub Pages，可在此填入您自己的 Google Gemini API Key（仅保存在您当前浏览器的 `localStorage` 中，绝不上传至任何第三方服务器）。
            </p>
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="AIzaSy... (留空则使用默认环境 Key)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  saveToStorage(STORAGE_KEYS.API_KEY, customApiKey.trim());
                  setShowApiModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                保存并生效
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}