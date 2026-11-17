export const baseWordDict = {
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
export const sentencesByLang = {
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
      workplace: 'The financial report is ready.',
      workplaceCn: '财务报告已经准备好了。'
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
      workplace: "It is the client's final decision.",
      workplaceCn: '这是客户的最终决定。'
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
      workplace: 'I send HR the updated resume.',
      workplaceCn: '我把更新后的简历发给HR。'
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
      workplace: 'We show them the Q3 data.',
      workplaceCn: '我们向他们展示第三季度的数据。'
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
      workplace: 'She forwards it to the manager.',
      workplaceCn: '她把这个转发给经理。'
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
      workplace: 'He hands it to her.',
      workplaceCn: '他亲手把它交给了她。'
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
      workplace: 'Is the contract ready?',
      workplaceCn: '合同准备好了吗？'
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
      workplace: 'The new features are live.',
      workplaceCn: '新功能已经上线启用了。'
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
      workplace: 'I must submit it to him today.',
      workplaceCn: '我今天必须把它提交给他。'
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
      workplace: 'I want to present it to her.',
      workplaceCn: '我想向她做方案汇报展示。'
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
      workplace: "I'm going to pitch it to them tomorrow.",
      workplaceCn: '我打算明天向他们推介提案。'
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
      workplace: "I can't accept this offer.",
      workplaceCn: '我无法接受这份录取意向/报价。'
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
      workplace: '財務報告書は 準備できています。',
      workplaceCn: '财务报告已经准备好了。'
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
      workplace: 'それは クライアントの 最終決定です。',
      workplaceCn: '那是客户的最终决定。'
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
      workplace: '私は 人事に 履歴書を 送ります。',
      workplaceCn: '我向人事发送简历。'
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
      workplace: '私たちは 彼らに データを 見せます。',
      workplaceCn: '我们向他们展示数据。'
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
      workplace: '彼女は それを マネージャーに 転送します。',
      workplaceCn: '她把那个转发给经理。'
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
      workplace: '彼は それを 彼女に 渡します。',
      workplaceCn: '他把那个交给她。'
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
      workplace: '契約書は 準備できていますか？',
      workplaceCn: '合同准备好了吗？'
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
      workplace: '昨日の会議は 有意義でしたか？',
      workplaceCn: '昨天的会议有收获吗？'
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
      workplace: '今日 それを 彼に 提出しなければなりません。',
      workplaceCn: '今天必须把它提交给他。'
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
      workplace: '私は 彼女に それを 提案したいです。',
      workplaceCn: '我想向她做方案汇报。'
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
      workplace: '明日 彼らに それを プレゼンするつもりです。',
      workplaceCn: '我打算明天向他们推介提案。'
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
      workplace: '私は このオファーを 受け入れられません。',
      workplaceCn: '我无法接受这份录取意向/报价。'
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
      workplace: 'El informe financiero está listo.',
      workplaceCn: '财务报告已经准备好了。'
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
      workplace: 'Es la decisión final del cliente.',
      workplaceCn: '这是客户的最终决定。'
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
      workplace: 'Le envío el currículum actualizado a RRHH.',
      workplaceCn: '我把更新后的简历发给HR。'
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
      workplace: 'Les mostramos los datos del tercer trimestre.',
      workplaceCn: '我们向他们展示第三季度的数据。'
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
      workplace: 'Se lo reenvía al gerente.',
      workplaceCn: '她把它转发给经理。'
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
      workplace: 'Él se lo entrega a ella.',
      workplaceCn: '他亲手把它交给了她。'
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
      workplace: '¿Está listo el contrato?',
      workplaceCn: '合同准备好了吗？'
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
      workplace: 'Las nuevas funciones están activas.',
      workplaceCn: '新功能已经上线启用了。'
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
      workplace: 'Debo entregárselo hoy.',
      workplaceCn: '我今天必须提交给它/他。'
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
      workplace: 'Quiero presentárselo a ella.',
      workplaceCn: '我想向她做汇报展示。'
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
      workplace: 'Voy a enviárselo mañana.',
      workplaceCn: '我打算明天发送给他们。'
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
      workplace: 'No puedo aceptar esta oferta.',
      workplaceCn: '我无法接受这份录取意向/报价。'
    }
  ]
};

// --- Scenario Examples Pool for TabSubstitution (3 Batches of 5 Sentences per Category) ---
export const scenarioBatchesBySkeleton = {
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
export const buildLegoBlocksForSentence = (targetLang, skeletonId) => {
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
