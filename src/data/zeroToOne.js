// --- Tab 1 Data: Comprehensive Sound & Ear Training Hub (Decoder + Minimal Pairs + Sound Clusters + 36 Core Lego Words) ---
export const zeroToOneDataByLang = {
  en: {
    subtitle: "44音素全景音标表 + Minimal Pairs 易混辨音 + 同音词族串串烧",
    alphabetTitle: "🗺️ 英语 44 国际音标与自然拼读全景体系 (第一行听单音 · 第三行听例词)",
    phoneticCategories: [
      {
        id: 'vowels_mono',
        name: '① 单元音 (12个: 长短对比)',
        desc: '口型保持固定不变的元音，点击第一行【🔊单音】听纯粹音素，点击第三行听例词与慢速：',
        items: [
          { char: '/iː/', sound: 'ee', sub: 'ee / ea', tip: '长音“衣”，嘴角微笑拉开', sample: 'sheep', sampleCn: '绵羊' },
          { char: '/ɪ/', sound: 'ih', sub: 'i / y', tip: '短促放松，介于衣和诶之间', sample: 'ship', sampleCn: '轮船' },
          { char: '/e/', sound: 'eh', sub: 'e / ea', tip: '一指宽小开口发“诶”', sample: 'bed', sampleCn: '床' },
          { char: '/æ/', sound: 'aah', sub: 'a (梅花音)', tip: '两指宽大开口，下巴压低', sample: 'apple', sampleCn: '苹果' },
          { char: '/ɜːr/', sound: 'er', sub: 'ir / ur / er', tip: '舌尖微卷的“儿”长音', sample: 'bird', sampleCn: '小鸟' },
          { char: '/ə/', sound: 'uh', sub: 'a / o / e (弱读)', tip: '最核心央元音，完全放松轻哼', sample: 'about', sampleCn: '关于' },
          { char: '/ʌ/', sound: 'uh', sub: 'u / o', tip: '短促有力的“阿”', sample: 'cup', sampleCn: '杯子' },
          { char: '/ɑː/', sound: 'ah', sub: 'ar / a', tip: '口腔打开深沉发“啊”', sample: 'car', sampleCn: '汽车' },
          { char: '/ɔː/', sound: 'aw', sub: 'or / aw / al', tip: '双唇拢圆发长音“奥”', sample: 'door', sampleCn: '门' },
          { char: '/ɒ/', sound: 'oh', sub: 'o / a', tip: '短促圆唇“奥/阿”', sample: 'hot', sampleCn: '热的' },
          { char: '/uː/', sound: 'oo', sub: 'oo / u / ew', tip: '双唇嘟圆发长音“乌”', sample: 'food', sampleCn: '食物' },
          { char: '/ʊ/', sound: 'uuh', sub: 'oo / u', tip: '短促放松的“乌”', sample: 'book', sampleCn: '书' }
        ]
      },
      {
        id: 'vowels_diph',
        name: '② 双元音 (8个: 滑动饱满)',
        desc: '由第一个元音平滑过渡到第二个元音，点击第一行【🔊单音】听纯粹双元音滑动，点击第三行听例词：',
        items: [
          { char: '/eɪ/', sound: 'A', sub: 'a_e / ai / ay', tip: '由 e 滑向 ɪ (字母A本音)', sample: 'take', sampleCn: '拿/带走' },
          { char: '/aɪ/', sound: 'I', sub: 'i_e / igh / y', tip: '由 a 滑向 ɪ (字母I本音)', sample: 'time', sampleCn: '时间' },
          { char: '/ɔɪ/', sound: 'oy', sub: 'oi / oy', tip: '由奥滑向衣', sample: 'boy', sampleCn: '男孩' },
          { char: '/aʊ/', sound: 'ow', sub: 'ou / ow', tip: '由阿滑向乌', sample: 'now', sampleCn: '现在' },
          { char: '/əʊ/', sound: 'O', sub: 'o_e / oa / ow', tip: '由央元音滑向乌 (字母O本音)', sample: 'go', sampleCn: '去' },
          { char: '/ɪər/', sound: 'ear', sub: 'ear / eer', tip: '由衣滑向儿化央元音', sample: 'here', sampleCn: '这里' },
          { char: '/eər/', sound: 'air', sub: 'air / are', tip: '由诶滑向儿化央元音', sample: 'where', sampleCn: '哪里' },
          { char: '/ʊər/', sound: 'oor', sub: 'ure / our', tip: '由乌滑向儿化央元音', sample: 'sure', sampleCn: '确定的' }
        ]
      },
      {
        id: 'consonants_paired',
        name: '③ 清浊成对辅音 (16个: 口型相同，声带震动不同)',
        desc: '每对清浊辅音口型100%一样！点击【🔊纯单音】对比：左边清音只有纯粹气流摩擦/爆破（绝无元音尾巴），右边浊音叠加声带共鸣震动：',
        items: [
          { char: '/p/ 清', sound: 'p', sub: 'p', tip: '双唇爆破送气(无声带震动)', sample: 'pay', sampleCn: '支付' },
          { char: '/b/ 浊', sound: 'b', sub: 'b', tip: '双唇爆破震动声带', sample: 'buy', sampleCn: '买' },
          { char: '/t/ 清', sound: 't', sub: 't', tip: '舌尖抵上齿龈爆破送气', sample: 'tea', sampleCn: '茶' },
          { char: '/d/ 浊', sound: 'd', sub: 'd', tip: '舌尖抵上齿龈震声带', sample: 'day', sampleCn: '日子/天' },
          { char: '/k/ 清', sound: 'k', sub: 'k / c / ck', tip: '舌根软腭爆破送气', sample: 'key', sampleCn: '钥匙' },
          { char: '/ɡ/ 浊', sound: 'g', sub: 'g', tip: '舌根软腭震声带', sample: 'give', sampleCn: '给' },
          { char: '/f/ 清', sound: 'fff', sub: 'f / ph', tip: '上齿轻咬下唇纯吹气', sample: 'free', sampleCn: '免费的' },
          { char: '/v/ 浊', sound: 'vvv', sub: 'v', tip: '上齿咬下唇吹气+震声带', sample: 'very', sampleCn: '非常' },
          { char: '/θ/ 清', sound: 'th', sub: 'th (清)', tip: '舌尖轻放上下齿间纯吹气', sample: 'think', sampleCn: '思考' },
          { char: '/ð/ 浊', sound: 'the', sub: 'th (浊)', tip: '舌尖轻放上下齿间震声带', sample: 'this', sampleCn: '这个' },
          { char: '/s/ 清', sound: 'sss', sub: 's / c', tip: '舌尖平舌摩擦纯吹气', sample: 'see', sampleCn: '看见' },
          { char: '/z/ 浊', sound: 'zzz', sub: 'z / s', tip: '舌尖平舌摩擦+震声带', sample: 'zoo', sampleCn: '动物园' },
          { char: '/ʃ/ 清', sound: 'shh', sub: 'sh / -tion', tip: '双唇微翘送气摩擦(“嘘”)', sample: 'she', sampleCn: '她' },
          { char: '/ʒ/ 浊', sound: 'zh', sub: 's / ge', tip: '双唇微翘摩擦+震声带', sample: 'decision', sampleCn: '决定' },
          { char: '/tʃ/ 清', sound: 'ch', sub: 'ch / tch', tip: '短促破擦送气清音', sample: 'cheap', sampleCn: '便宜的' },
          { char: '/dʒ/ 浊', sound: 'j', sub: 'j / g / dge', tip: '短促破擦震动声带浊音', sample: 'job', sampleCn: '工作' }
        ]
      },
      {
        id: 'consonants_other',
        name: '④ 鼻音、舌侧音与半元音 (8个)',
        desc: '决定英语连贯度与地道尾音的关键辅音：',
        items: [
          { char: '/m/', sound: 'mmm', sub: 'm', tip: '双唇紧闭鼻腔共鸣', sample: 'money', sampleCn: '钱' },
          { char: '/n/', sound: 'nnn', sub: 'n / kn', tip: '舌尖抵上齿龈鼻音', sample: 'need', sampleCn: '需要' },
          { char: '/ŋ/', sound: 'ing', sub: 'ng / nk', tip: '舌根抵软腭后鼻音', sample: 'thing', sampleCn: '事物' },
          { char: '/h/', sound: 'huh', sub: 'h / wh', tip: '气流顺畅通过声门', sample: 'help', sampleCn: '帮助' },
          { char: '/l/', sound: 'luh', sub: 'l / ll', tip: '词首清晰，词尾舌尖顶上齿龈', sample: 'feel', sampleCn: '感觉' },
          { char: '/r/', sound: 'ruh', sub: 'r / wr', tip: '舌尖向上卷起不碰上颚', sample: 'red', sampleCn: '红色的' },
          { char: '/w/', sound: 'wuh', sub: 'w / wh', tip: '双唇嘟圆快速滑开', sample: 'want', sampleCn: '想要' },
          { char: '/j/', sound: 'yuh', sub: 'y', tip: '舌面抬高快速发“耶”', sample: 'yes', sampleCn: '是的' }
        ]
      }
    ],
    soundClusters: [
      {
        title: "🎯 1. 双元音 /aɪ/ (-ight) 同韵拼读簇",
        rule: "gh 在此组合中永远静音不发音，掌握第1个即可顺读整串高频词！",
        words: [
          { w: "light", pron: "/laɪt/", cn: "光 / 轻的" },
          { w: "right", pron: "/raɪt/", cn: "正确的 / 右边" },
          { w: "night", pron: "/naɪt/", cn: "夜晚" },
          { w: "flight", pron: "/flaɪt/", cn: "航班" },
          { w: "bright", pron: "/braɪt/", cn: "明亮的" }
        ]
      },
      {
        title: "🎯 2. 长元音 /iː/ (-ea- / -ee-) 微笑长音簇",
        rule: "嘴角向两边微笑拉伸，声音饱满持久：",
        words: [
          { w: "eat", pron: "/iːt/", cn: "吃" },
          { w: "team", pron: "/tiːm/", cn: "团队" },
          { w: "seat", pron: "/siːt/", cn: "座位" },
          { w: "leave", pron: "/liːv/", cn: "离开" },
          { w: "cheap", pron: "/tʃiːp/", cn: "便宜的" }
        ]
      },
      {
        title: "🎯 3. 梅花音 /æ/ (-at / -ap / -an) 大开口家族",
        rule: "上下齿张开两指宽，下巴用力向下压，发出的声音洪亮扎实：",
        words: [
          { w: "apple", pron: "/ˈæp.əl/", cn: "苹果" },
          { w: "plan", pron: "/plæn/", cn: "计划" },
          { w: "cash", pron: "/kæʃ/", cn: "现金" },
          { w: "map", pron: "/mæp/", cn: "地图" },
          { w: "back", pron: "/bæk/", cn: "返回 / 后面" }
        ]
      },
      {
        title: "🎯 4. 双元音 /eɪ/ (a_e / -ay) 滑动家族",
        rule: "由 /e/ 平滑滑向 /ɪ/，口型由半开明显收小：",
        words: [
          { w: "take", pron: "/teɪk/", cn: "拿 / 乘坐" },
          { w: "make", pron: "/meɪk/", cn: "制作" },
          { w: "late", pron: "/leɪt/", cn: "迟到的" },
          { w: "pay", pron: "/peɪ/", cn: "支付" },
          { w: "wait", pron: "/weɪt/", cn: "等待" }
        ]
      },
      {
        title: "🎯 5. 卷舌长音 /ɜːr/ (-ir / -ur / -or) 家族",
        rule: "舌尖微微向上卷起，千万不要碰到上齿龈：",
        words: [
          { w: "work", pron: "/wɜːrk/", cn: "工作" },
          { w: "first", pron: "/fɜːrst/", cn: "第一" },
          { w: "turn", pron: "/tɜːrn/", cn: "转弯 / 轮流" },
          { w: "learn", pron: "/lɜːrn/", cn: "学习" },
          { w: "early", pron: "/ˈɜːr.li/", cn: "早的" }
        ]
      },
      {
        title: "🎯 6. 咬舌音 /θ/ & /ð/ (th-) 破冰家族",
        rule: "舌尖必须轻放在上下门牙之间吹气（清音）或震动声带（浊音）：",
        words: [
          { w: "think", pron: "/θɪŋk/", cn: "思考 (清)" },
          { w: "thank", pron: "/θæŋk/", cn: "感谢 (清)" },
          { w: "three", pron: "/θriː/", cn: "三 (清)" },
          { w: "this", pron: "/ðɪs/", cn: "这个 (浊)" },
          { w: "them", pron: "/ðem/", cn: "他们 (浊)" }
        ]
      },
      {
        title: "🎯 7. 后鼻音 /ŋ/ (-ing / -nk) 共鸣家族",
        rule: "舌根抬起抵住软腭，让气流从鼻腔出来：",
        words: [
          { w: "thing", pron: "/θɪŋ/", cn: "事物 / 东西" },
          { w: "bring", pron: "/brɪŋ/", cn: "带来" },
          { w: "meeting", pron: "/ˈmiː.tɪŋ/", cn: "会议" },
          { w: "bank", pron: "/bæŋk/", cn: "银行" },
          { w: "drink", pron: "/drɪŋk/", cn: "喝 / 饮料" }
        ]
      },
      {
        title: "🎯 8. 商务高频后缀 -tion 家族 (/ʃən/)",
        rule: "看到 -tion 结尾，重音100%落在它前面的那个元音上，节奏感极强：",
        words: [
          { w: "station", pron: "/ˈsteɪ.ʃən/", cn: "车站" },
          { w: "option", pron: "/ˈɒp.ʃən/", cn: "选项" },
          { w: "action", pron: "/ˈæk.ʃən/", cn: "行动" },
          { w: "decision", pron: "/dɪˈsɪʒ.ən/", cn: "决定" },
          { w: "information", pron: "/ˌɪn.fəˈmeɪ.ʃən/", cn: "信息" }
        ]
      }
    ],
    rules: [
      { title: "重音决定一切 (Stress)", desc: "英语是重音计时语言，重读音节清晰饱满，非重读音节常弱化为含糊的央元音 /ə/ (如 about, today)。" },
      { title: "辅音尾音轻触即止", desc: "词尾的 p / t / k / d 不要像中文加“特/克”元音，舌尖或双唇轻触憋住即可 (Stop consonant)。" },
      { title: "辅音+元音自然连读", desc: "前词辅音结尾 + 后词元音开头会直接拼在一起读，如 give_it → gi-vit。" },
      { title: "咬舌音 θ / ð 破冰", desc: "遇到 th (think, the, this)，舌尖必须微微伸出上下齿之间吹气，绝不能读成 s 或 z。" }
    ],
    minimalPairs: [
      {
        tag: "1. 长短元音 /iː/ vs /ɪ/",
        w1: "sheep",
        ipa1: "/ʃiːp/ (绵羊-微笑长音)",
        w2: "ship",
        ipa2: "/ʃɪp/ (轮船-短促放松)",
        tip: "不只差在长短，/ɪ/ 的口型更放松且偏像“衣”和“诶”之间。",
        sentence: "The sheep is on the big ship.",
        sentenceCn: "那只绵羊在大轮船上。"
      },
      {
        tag: "2. 咬舌清音 /θ/ vs 平舌 /s/",
        w1: "think",
        ipa1: "/θɪŋk/ (思考-舌尖轻咬)",
        w2: "sink",
        ipa2: "/sɪŋk/ (下沉-牙齿闭合)",
        tip: "把舌尖放在上下门牙中间吹气，就能瞬间告别中式口音。",
        sentence: "I think the ship will sink.",
        sentenceCn: "我认为这艘船会下沉。"
      },
      {
        tag: "3. 开口度大小 /æ/ vs /e/",
        w1: "bad",
        ipa1: "/bæd/ (坏的-两指大开口)",
        w2: "bed",
        ipa2: "/bed/ (床-一指小开口)",
        tip: "发 /æ/ 时下巴要用力往下拉，嘴角向两边裂开。",
        sentence: "This old bed is not bad.",
        sentenceCn: "这张旧床还不错（不算坏）。"
      },
      {
        tag: "4. 唇齿摩擦 /v/ vs 双唇 /w/",
        w1: "vest",
        ipa1: "/vest/ (背心-上齿咬下唇)",
        w2: "west",
        ipa2: "/west/ (西方-双唇嘟圆)",
        tip: "发 v 时上排门牙必须轻触下嘴唇震动声带。",
        sentence: "He wore a new vest in the west.",
        sentenceCn: "他在西部穿着一件新背心。"
      },
      {
        tag: "5. 清浊尾音 /v/ vs /f/",
        w1: "leave",
        ipa1: "/liːv/ (离开-元音略长)",
        w2: "leaf",
        ipa2: "/liːf/ (树叶-元音略短)",
        tip: "浊辅音结尾会让前面的元音听起来更饱满悠长。",
        sentence: "Don't leave the green leaf here.",
        sentenceCn: "别把那片绿叶留在这里。"
      },
      {
        tag: "6. 圆唇长短音 /uː/ vs /ʊ/",
        w1: "pool",
        ipa1: "/puːl/ (泳池-嘟唇长音)",
        w2: "pull",
        ipa2: "/pʊl/ (拉-短促放松)",
        tip: "发 /uː/ 双唇用力拢圆前突；发 /ʊ/ 双唇放松短促。",
        sentence: "Don't pull him into the pool.",
        sentenceCn: "别把他拉进泳池里。"
      },
      {
        tag: "7. 舌侧音 /l/ vs 卷舌音 /r/",
        w1: "light",
        ipa1: "/laɪt/ (光-舌尖顶上齿龈)",
        w2: "right",
        ipa2: "/raɪt/ (右边-舌尖悬空微卷)",
        tip: "发 l 时舌尖必须扎实顶住上牙堂；发 r 时舌尖绝不碰上颚。",
        sentence: "Turn on the light on your right.",
        sentenceCn: "打开你右手边的灯。"
      },
      {
        tag: "8. 卷舌 /ɜːr/ vs 圆唇 /ɔː/",
        w1: "work",
        ipa1: "/wɜːrk/ (工作-舌尖卷起)",
        w2: "walk",
        ipa2: "/wɔːk/ (散步-口腔圆唇打开)",
        tip: "work 靠卷舌发“沃克”；walk 不卷舌且元音是“奥”。",
        sentence: "I always walk to work today.",
        sentenceCn: "我今天总是走路去上班。"
      },
      {
        tag: "9. 前鼻音 /n/ vs 后鼻音 /ŋ/",
        w1: "thin",
        ipa1: "/θɪn/ (薄的-舌尖抵齿龈)",
        w2: "thing",
        ipa2: "/θɪŋ/ (东西-舌根抵软腭)",
        tip: "发 /n/ 收尾时舌尖在前面；发 /ŋ/ 时舌尖放平、舌根后缩。",
        sentence: "This thin book is a good thing.",
        sentenceCn: "这本薄薄的书是个好东西。"
      },
      {
        tag: "10. 咬舌浊音 /ð/ vs 爆破 /d/",
        w1: "they",
        ipa1: "/ðeɪ/ (他们-轻咬舌尖震动)",
        w2: "day",
        ipa2: "/deɪ/ (日子-舌尖弹开)",
        tip: "读 they / the / this 时舌尖轻轻伸出齿间，不要偷懒读成 day。",
        sentence: "They work hard every day.",
        sentenceCn: "他们每天都努力工作。"
      }
    ],
    legoWords: {
      verbs: [
        { w: "give", pron: "/ɡɪv/", cn: "给 / 递交", sampleId: 3 },
        { w: "want", pron: "/wɒnt/", cn: "想要", sampleId: 10 },
        { w: "need", pron: "/niːd/", cn: "需要", sampleId: 10 },
        { w: "have", pron: "/hæv/", cn: "有 / 拿", sampleId: 3 },
        { w: "go", pron: "/ɡəʊ/", cn: "去 / 前往", sampleId: 11 },
        { w: "take", pron: "/teɪk/", cn: "带走 / 乘坐", sampleId: 3 },
        { w: "buy", pron: "/baɪ/", cn: "买 / 购买", sampleId: 12 },
        { w: "eat", pron: "/iːt/", cn: "吃 / 用餐", sampleId: 12 },
        { w: "send", pron: "/send/", cn: "发送 / 寄", sampleId: 5 },
        { w: "show", pron: "/ʃəʊ/", cn: "展示 / 给…看", sampleId: 4 },
        { w: "know", pron: "/nəʊ/", cn: "知道 / 了解", sampleId: 12 },
        { w: "help", pron: "/help/", cn: "帮助 / 协助", sampleId: 9 }
      ],
      nouns: [
        { w: "money", pron: "/ˈmʌn.i/", cn: "钱 / 现金", sampleId: 5 },
        { w: "water", pron: "/ˈwɔː.tər/", cn: "水", sampleId: 3 },
        { w: "ticket", pron: "/ˈtɪk.ɪt/", cn: "票 / 机票", sampleId: 4 },
        { w: "hotel", pron: "/həʊˈtel/", cn: "酒店", sampleId: 1 },
        { w: "phone", pron: "/fəʊn/", cn: "手机 / 电话", sampleId: 2 },
        { w: "report", pron: "/rɪˈpɔːt/", cn: "报告 / 文件", sampleId: 1 },
        { w: "time", pron: "/taɪm/", cn: "时间", sampleId: 1 },
        { w: "client", pron: "/ˈklaɪ.ənt/", cn: "客户", sampleId: 2 },
        { w: "station", pron: "/ˈsteɪ.ʃən/", cn: "车站", sampleId: 7 },
        { w: "bathroom", pron: "/ˈbɑːθ.ruːm/", cn: "洗手间", sampleId: 7 },
        { w: "today", pron: "/təˈdeɪ/", cn: "今天", sampleId: 9 },
        { w: "tomorrow", pron: "/təˈmɒr.əʊ/", cn: "明天", sampleId: 11 }
      ],
      modifiers: [
        { w: "good", pron: "/ɡʊd/", cn: "好的", sampleId: 1 },
        { w: "ready", pron: "/ˈred.i/", cn: "准备好的", sampleId: 1 },
        { w: "expensive", pron: "/ɪkˈspen.sɪv/", cn: "昂贵的", sampleId: 8 },
        { w: "cheap", pron: "/tʃiːp/", cn: "便宜的", sampleId: 8 },
        { w: "urgent", pron: "/ˈɜː.dʒənt/", cn: "紧急的", sampleId: 7 },
        { w: "free", pron: "/friː/", cn: "免费的 / 空闲的", sampleId: 7 },
        { w: "very", pron: "/ˈver.i/", cn: "非常 / 很", sampleId: 1 },
        { w: "now", pron: "/naʊ/", cn: "现在", sampleId: 9 },
        { w: "here", pron: "/hɪər/", cn: "这里", sampleId: 1 },
        { w: "where", pron: "/weər/", cn: "在哪里", sampleId: 7 },
        { w: "because", pron: "/bɪˈkɒz/", cn: "因为", sampleId: 12 },
        { w: "but", pron: "/bʌt/", cn: "但是", sampleId: 12 }
      ]
    }
  },
  ja: {
    subtitle: "完整五十音全景图 (清音/浊音/拗音) + 易混长短/促音对决 + 同音词族",
    alphabetTitle: "🗺️ 日语完整五十音全景体系表 (第一行听假名单音 · 第三行听例词)",
    phoneticCategories: [
      {
        id: 'seion',
        name: '① 清音全表 (46个基础假名: 5元音 × 10行)',
        desc: '日语的根基！每一行都是由「辅音声母 + a / i / u / e / o 五个元音」拼成，第一行听单音，第三行听例词：',
        isGrid5: true,
        items: [
          // あ行
          { char: 'あ / ア', sound: 'あ', sub: 'a', tip: '源于汉字“安”，口型自然打开', sample: 'あさ', sampleCn: '早晨' },
          { char: 'い / イ', sound: 'い', sub: 'i', tip: '源于汉字“以”，嘴角微展', sample: 'いま', sampleCn: '现在' },
          { char: 'う / ウ', sound: 'う', sub: 'u', tip: '源于汉字“宇”，双唇放平不撅嘴', sample: 'うみ', sampleCn: '大海' },
          { char: 'え / エ', sound: 'え', sub: 'e', tip: '源于汉字“衣”，发清脆的“诶”', sample: 'えき', sampleCn: '车站' },
          { char: 'お / オ', sound: 'お', sub: 'o', tip: '源于汉字“於”，圆唇固定发“哦”', sample: 'おかね', sampleCn: '钱' },
          // か行
          { char: 'か / カ', sound: 'か', sub: 'ka', tip: '源于汉字“加”，清脆发 ka', sample: 'かさ', sampleCn: '雨伞' },
          { char: 'き / キ', sound: 'き', sub: 'ki', tip: '源于“幾”，形状像钥匙 Key', sample: 'きっぷ', sampleCn: '车票' },
          { char: 'く / ク', sound: 'く', sub: 'ku', tip: '源于“久”，形状像小于号 <', sample: 'くるま', sampleCn: '汽车' },
          { char: 'け / ケ', sound: 'け', sub: 'ke', tip: '源于汉字“計/介”', sample: 'けさ', sampleCn: '今早' },
          { char: 'こ / コ', sound: 'こ', sub: 'ko', tip: '源于汉字“己”，上下两横', sample: 'これ', sampleCn: '这个' },
          // さ行
          { char: 'さ / サ', sound: 'さ', sub: 'sa', tip: '源于汉字“左/散”', sample: 'さかな', sampleCn: '鱼' },
          { char: 'し / シ', sound: 'し', sub: 'shi', tip: '源于“之”，读如中文“吸”', sample: 'しりょう', sampleCn: '资料' },
          { char: 'す / ス', sound: 'す', sub: 'su', tip: '源于“寸/須”，读音接近 si/su', sample: 'すし', sampleCn: '寿司' },
          { char: 'せ / セ', sound: 'せ', sub: 'se', tip: '源于汉字“世”', sample: 'せかい', sampleCn: '世界' },
          { char: 'そ / ソ', sound: 'そ', sub: 'so', tip: '源于汉字“曽”', sample: 'それ', sampleCn: '那个' },
          // た行
          { char: 'た / タ', sound: 'た', sub: 'ta', tip: '源于汉字“太/多”', sample: 'たかい', sampleCn: '贵的/高的' },
          { char: 'ち / チ', sound: 'ち', sub: 'chi', tip: '源于“知/千”，读如中文“七”', sample: 'ちかい', sampleCn: '近的' },
          { char: 'つ / ツ', sound: 'つ', sub: 'tsu', tip: '源于“川”，读如“次/呲”', sample: 'つくえ', sampleCn: '书桌' },
          { char: 'て / テ', sound: 'て', sub: 'te', tip: '源于汉字“天”', sample: 'てがみ', sampleCn: '信件' },
          { char: 'と / ト', sound: 'と', sub: 'to', tip: '源于汉字“止”', sample: 'とけい', sampleCn: '钟表' },
          // な行
          { char: 'な / ナ', sound: 'な', sub: 'na', tip: '源于汉字“奈”', sample: 'なつ', sampleCn: '夏天' },
          { char: 'に / ニ', sound: 'に', sub: 'ni', tip: '源于汉字“仁/二”', sample: 'にく', sampleCn: '肉' },
          { char: 'ぬ / ヌ', sound: 'ぬ', sub: 'nu', tip: '源于汉字“奴”', sample: 'いぬ', sampleCn: '狗' },
          { char: 'ね / ネ', sound: 'ね', sub: 'ne', tip: '源于汉字“祢”', sample: 'ねこ', sampleCn: '猫' },
          { char: 'の / ノ', sound: 'の', sub: 'no', tip: '源于“乃”，表所属“的”', sample: 'のみもの', sampleCn: '饮料' },
          // は行
          { char: 'は / ハ', sound: 'は', sub: 'ha (助词wa)', tip: '源于“波/八”，作助词读 wa', sample: 'はな', sampleCn: '花' },
          { char: 'ひ / ヒ', sound: 'ひ', sub: 'hi', tip: '源于汉字“比”', sample: 'ひと', sampleCn: '人' },
          { char: 'ふ / フ', sound: 'ふ', sub: 'fu (hu)', tip: '源于“不”，双唇微吹气不咬唇', sample: 'ふゆ', sampleCn: '冬天' },
          { char: 'へ / ヘ', sound: 'へ', sub: 'he (助词e)', tip: '源于“部”，作方向助词读 e', sample: 'へや', sampleCn: '房间' },
          { char: 'ほ / ホ', sound: 'ほ', sub: 'ho', tip: '源于汉字“保”', sample: 'ホテル', sampleCn: '酒店' },
          // ま行
          { char: 'ま / マ', sound: 'ま', sub: 'ma', tip: '源于汉字“末/万”', sample: 'まち', sampleCn: '街道/城镇' },
          { char: 'み / ミ', sound: 'み', sub: 'mi', tip: '源于汉字“美/三”', sample: 'みず', sampleCn: '水' },
          { char: 'む / ム', sound: 'む', sub: 'mu', tip: '源于汉字“武/牟”', sample: 'むりょう', sampleCn: '免费' },
          { char: 'め / メ', sound: 'め', sub: 'me', tip: '源于汉字“女”', sample: 'めがね', sampleCn: '眼镜' },
          { char: 'も / モ', sound: 'も', sub: 'mo', tip: '源于汉字“毛”，表“也”', sample: 'もの', sampleCn: '东西/物品' },
          // や行
          { char: 'や / ヤ', sound: 'や', sub: 'ya', tip: '源于汉字“也”', sample: 'やすい', sampleCn: '便宜的' },
          { char: '（い）', sound: 'い', sub: '(i)', tip: 'や行空位，直接复用 い', sample: 'いま', sampleCn: '现在' },
          { char: 'ゆ / ユ', sound: 'ゆ', sub: 'yu', tip: '源于汉字“由”', sample: 'ゆき', sampleCn: '雪' },
          { char: '（え）', sound: 'え', sub: '(e)', tip: 'や行空位，直接复用 え', sample: 'えき', sampleCn: '车站' },
          { char: 'よ / ヨ', sound: 'よ', sub: 'yo', tip: '源于汉字“与”', sample: 'よる', sampleCn: '夜晚' },
          // ら行
          { char: 'ら / ラ', sound: 'ら', sub: 'ra (la)', tip: '源于“良”，不卷舌读如 la', sample: 'らいねん', sampleCn: '明年' },
          { char: 'り / リ', sound: 'り', sub: 'ri (li)', tip: '源于“利”，读如中文“里”', sample: 'りんご', sampleCn: '苹果' },
          { char: 'る / ル', sound: 'る', sub: 'ru (lu)', tip: '源于“留”，常作动词原形词尾', sample: 'ルール', sampleCn: '规则' },
          { char: 'れ / レ', sound: 'れ', sub: 're (le)', tip: '源于汉字“礼”', sample: 'れきし', sampleCn: '历史' },
          { char: 'ろ / ロ', sound: 'ろ', sub: 'ro (lo)', tip: '源于汉字“呂”', sample: 'ろく', sampleCn: '六 (6)' },
          // わ行 + ん
          { char: 'わ / ワ', sound: 'わ', sub: 'wa', tip: '源于汉字“和”', sample: 'わたし', sampleCn: '我' },
          { char: 'を / ヲ', sound: 'を', sub: 'o (wo)', tip: '仅作宾语助词，读音同 お(o)', sample: 'みずを', sampleCn: '把水(宾语)' },
          { char: 'ん / ン', sound: 'ん', sub: 'n (拨音)', tip: '独立占满一拍的鼻音共鸣', sample: 'にほん', sampleCn: '日本' }
        ]
      },
      {
        id: 'dakuon',
        name: '② 浊音与半浊音全表 (25个: 右上角加两点 ゛ 或小圆圈 ゜)',
        desc: '只需记住规律：か(k)→が(g)、さ(s)→ざ(z)、た(t)→だ(d)、は(h)→ば(b) / ぱ(p)！',
        isGrid5: true,
        items: [
          // が行
          { char: 'が / ガ', sound: 'が', sub: 'ga', tip: 'か 浊化 k→g', sample: 'がっこう', sampleCn: '学校' },
          { char: 'ぎ / ギ', sound: 'ぎ', sub: 'gi', tip: 'き 浊化 ki→gi', sample: 'かぎ', sampleCn: '钥匙' },
          { char: 'ぐ / グ', sound: 'ぐ', sub: 'gu', tip: 'く 浊化 ku→gu', sample: 'すぐ', sampleCn: '马上/立刻' },
          { char: 'げ / ゲ', sound: 'げ', sub: 'ge', tip: 'け 浊化 ke→ge', sample: 'げんき', sampleCn: '健康/精神' },
          { char: 'ご / ゴ', sound: 'ご', sub: 'go', tip: 'こ 浊化 ko→go', sample: 'ごはん', sampleCn: '米饭/饭' },
          // ざ行
          { char: 'ざ / ザ', sound: 'ざ', sub: 'za', tip: 'さ 浊化 s→z', sample: 'ざっし', sampleCn: '杂志' },
          { char: 'じ / ジ', sound: 'じ', sub: 'ji', tip: 'し 浊化读如“机”', sample: 'じかん', sampleCn: '时间' },
          { char: 'ず / ズ', sound: 'ず', sub: 'zu', tip: 'す 浊化读如“资”', sample: 'みず', sampleCn: '水' },
          { char: 'ぜ / ゼ', sound: 'ぜ', sub: 'ze', tip: 'せ 浊化 se→ze', sample: 'ぜんぶ', sampleCn: '全部' },
          { char: 'ぞ / ゾ', sound: 'ぞ', sub: 'zo', tip: 'そ 浊化 so→zo', sample: 'かぞく', sampleCn: '家人/家族' },
          // だ行
          { char: 'だ / ダ', sound: 'だ', sub: 'da', tip: 'た 浊化 t→d', sample: 'だいじょうぶ', sampleCn: '没问题' },
          { char: 'ぢ / ヂ', sound: 'ぢ', sub: 'ji (di)', tip: '同 じ 发音完全相同', sample: 'ちぢむ', sampleCn: '缩小/缩短' },
          { char: 'づ / ヅ', sound: 'づ', sub: 'zu (du)', tip: '同 ず 发音完全相同', sample: 'つづく', sampleCn: '继续/待续' },
          { char: 'で / デ', sound: 'で', sub: 'de', tip: 'て 浊化 te→de', sample: 'でんしゃ', sampleCn: '电车' },
          { char: 'ど / ド', sound: 'ど', sub: 'do', tip: 'と 浊化 to→do', sample: 'どこ', sampleCn: '哪里' },
          // ば行
          { char: 'ば / バ', sound: 'ば', sub: 'ba', tip: 'は 浊化 h→b', sample: 'ばんごはん', sampleCn: '晚饭' },
          { char: 'び / ビ', sound: 'び', sub: 'bi', tip: 'ひ 浊化 hi→bi', sample: 'びょういん', sampleCn: '医院' },
          { char: 'ぶ / ブ', sound: 'ぶ', sub: 'bu', tip: 'ふ 浊化 fu→bu', sample: 'ぶんか', sampleCn: '文化' },
          { char: 'べ / ベ', sound: 'べ', sub: 'be', tip: 'へ 浊化 he→be', sample: 'べんり', sampleCn: '方便/便利' },
          { char: 'ぼ / ボ', sound: 'ぼ', sub: 'bo', tip: 'ほ 浊化 ho→bo', sample: 'ぼく', sampleCn: '我(男性自称)' },
          // ぱ行
          { char: 'ぱ / パ', sound: 'ぱ', sub: 'pa', tip: '加小圆圈半浊音 p', sample: 'パン', sampleCn: '面包' },
          { char: 'ぴ / ピ', sound: 'ぴ', sub: 'pi', tip: '半浊音 pi', sample: 'ぴかぴか', sampleCn: '闪闪发亮' },
          { char: 'ぷ / プ', sound: 'ぷ', sub: 'pu', tip: '半浊音 pu', sample: 'プレゼント', sampleCn: '礼物' },
          { char: 'ぺ / ペ', sound: 'ぺ', sub: 'pe', tip: '半浊音 pe', sample: 'ペン', sampleCn: '钢笔/笔' },
          { char: 'ぽ / ポ', sound: 'ぽ', sub: 'po', tip: '半浊音 po', sample: 'ポスト', sampleCn: '邮筒/信箱' }
        ]
      },
      {
        id: 'youon',
        name: '③ 拗音与特殊节拍符号 (い段假名 + 小号 ゃ/ゅ/ょ 拼成1拍)',
        desc: '右下角跟小号 ゃ/ゅ/ょ 时，两个假名快速连拼成 1 拍！加上促音「っ」与长音「ー」即构成完整日语发音：',
        items: [
          { char: 'きゃ / きゅ / きょ', sound: 'きゃ、きゅ、きょ', sub: 'kya / kyu / kyo', tip: 'き + 小号やゆよ连拼', sample: 'きょう', sampleCn: '今天' },
          { char: 'しゃ / しゅ / しょ', sound: 'しゃ、しゅ、しょ', sub: 'sha / shu / sho', tip: 'し + 小号やゆよ连拼', sample: 'しゃしん', sampleCn: '照片' },
          { char: 'ちゃ / ちゅ / ちょ', sound: 'ちゃ、ちゅ、ちょ', sub: 'cha / chu / cho', tip: 'ち + 小号やゆよ连拼', sample: 'おちゃ', sampleCn: '茶' },
          { char: 'にゃ / にゅ / にょ', sound: 'にゃ、にゅ、にょ', sub: 'nya / nyu / nyo', tip: 'に + 小号やゆよ连拼', sample: 'ぎゅうにゅう', sampleCn: '牛奶' },
          { char: 'ひゃ / ひゅ / ひょ', sound: 'ひゃ、ひゅ、ひょ', sub: 'hya / hyu / hyo', tip: 'ひ + 小号やゆよ连拼', sample: 'ひゃく', sampleCn: '一百 (100)' },
          { char: 'みゃ / みゅ / みょ', sound: 'みゃ、みゅ、みょ', sub: 'mya / myu / myo', tip: 'み + 小号やゆよ连拼', sample: 'みょうじ', sampleCn: '姓氏' },
          { char: 'りゃ / りゅ / りょ', sound: 'りゃ、りゅ、りょ', sub: 'rya / ryu / ryo', tip: 'り + 小号やゆよ连拼', sample: 'りょこう', sampleCn: '旅行' },
          { char: 'ぎゃ / ぎゅ / ぎょ', sound: 'ぎゃ、ぎゅ、ぎょ', sub: 'gya / gyu / gyo', tip: 'ぎ + 小号やゆよ连拼', sample: 'ぎんこう', sampleCn: '银行' },
          { char: 'じゃ / じゅ / じょ', sound: 'じゃ、じゅ、じょ', sub: 'ja / ju / jo', tip: 'じ + 小号やゆよ连拼', sample: 'じゅんび', sampleCn: '准备' },
          { char: 'びゃ / ぴゃ行', sound: 'びょう、ぴゃく', sub: 'bya / pya', tip: 'び/ぴ + 小号やゆよ连拼', sample: 'びょういん', sampleCn: '医院' },
          { char: 'っ (促音)', sound: 'きって', sub: '憋气停顿 1 拍', tip: '停顿一拍后再爆破下一音', sample: 'きって', sampleCn: '邮票' },
          { char: 'ー (长音)', sound: 'コーヒー', sub: '拖长元音 1 拍', tip: '把前一个元音拉长一倍', sample: 'コーヒー', sampleCn: '咖啡' }
        ]
      }
    ],
    soundClusters: [
      {
        title: "🎯 1. 中国人外挂：汉字音读「こう (kou)」同音家族",
        rule: "中文里读 gong / jiao / gao / kong 的汉字，在日语里几乎全读「こう (kou)」！顺读一串秒记5个核心词：",
        words: [
          { w: "こうえん (公園)", pron: "kou-en", cn: "公园" },
          { w: "こうつう (交通)", pron: "kou-tsuu", cn: "交通" },
          { w: "こうこう (高校)", pron: "kou-kou", cn: "高中" },
          { w: "くうこう (空港)", pron: "kuu-kou", cn: "机场" },
          { w: "せいこう (成功)", pron: "sei-kou", cn: "成功" }
        ]
      },
      {
        title: "🎯 2. 汉字音读「かん (kan)」拨音家族",
        rule: "中文带 -an 韵母的汉字（感、馆、间、简、韩），日语里常对应「かん (kan)」，注意拨音 ん 占满一拍：",
        words: [
          { w: "じかん (時間)", pron: "ji-kan", cn: "时间" },
          { w: "かんたん (簡単)", pron: "kan-tan", cn: "简单" },
          { w: "としょかん (図書館)", pron: "to-sho-kan", cn: "图书馆" },
          { w: "しんかんせん (新幹線)", pron: "shin-kan-sen", cn: "新干线" },
          { w: "かんこく (韓国)", pron: "kan-ko-ku", cn: "韩国" }
        ]
      },
      {
        title: "🎯 3. 英语者外挂：片假名「～ル (-ru)」尾音家族",
        rule: "英语以 -l / -r / -le 结尾的词，日语片假名全部变成「ル (ru)」！大声读出来就能瞬间听懂对应英文：",
        words: [
          { w: "ホテル", pron: "ho-te-ru", cn: "Hotel (酒店)" },
          { w: "ビール", pron: "bii-ru", cn: "Beer (啤酒)" },
          { w: "ルール", pron: "ruu-ru", cn: "Rule (规则)" },
          { w: "テーブル", pron: "tee-bu-ru", cn: "Table (桌子)" },
          { w: "メール", pron: "mee-ru", cn: "Mail (邮件)" }
        ]
      },
      {
        title: "🎯 4. 促音「っ」停顿爆破家族",
        rule: "遇到小号「っ」必须屏住呼吸停顿整整 1 拍，再爆破出后面的辅音：",
        words: [
          { w: "きっぷ (切符)", pron: "kip-pu", cn: "车票" },
          { w: "きって (切手)", pron: "kit-te", cn: "邮票" },
          { w: "ざっし (雑誌)", pron: "zas-shi", cn: "杂志" },
          { w: "がっこう (学校)", pron: "gak-kou", cn: "学校" },
          { w: "いっぷん (一分)", pron: "ip-pun", cn: "一分钟" }
        ]
      },
      {
        title: "🎯 5. 拗音「しゃ / ちょう / りょ」连拼家族",
        rule: "大假名 + 小号 ゃ/ゅ/ょ 必须快速捏成 1 拍读出，绝不能拆成两拍：",
        words: [
          { w: "でんしゃ (電車)", pron: "den-sha", cn: "电车" },
          { w: "しゃしん (写真)", pron: "sha-shin", cn: "照片" },
          { w: "かいしゃ (会社)", pron: "kai-sha", cn: "公司" },
          { w: "りょこう (旅行)", pron: "ryo-kou", cn: "旅行" },
          { w: "しりょう (資料)", pron: "shi-ryou", cn: "资料" }
        ]
      },
      {
        title: "🎯 6. 浊音与半浊音「が / ざ / だ / ば / ぱ」家族",
        rule: "右上角加两点震动声带，加小圈双唇爆破发 p：",
        words: [
          { w: "かぎ (鍵)", pron: "ka-gi", cn: "钥匙" },
          { w: "みず (水)", pron: "mi-zu", cn: "水" },
          { w: "でんわ (電話)", pron: "den-wa", cn: "电话" },
          { w: "かばん (鞄)", pron: "ka-ban", cn: "包 / 公文包" },
          { w: "パン", pron: "pan", cn: "面包" }
        ]
      },
      {
        title: "🎯 7. 礼貌体动词「～ます (-masu)」动作家族",
        rule: "日本生活最核心的礼貌动作词尾全部以「ます (masu)」收尾，一串读通：",
        words: [
          { w: "いきます", pron: "i-ki-ma-su", cn: "去 (行く)" },
          { w: "みます", pron: "mi-ma-su", cn: "看 (見る)" },
          { w: "たべます", pron: "ta-be-ma-su", cn: "吃 (食べる)" },
          { w: "のみます", pron: "no-mi-ma-su", cn: "喝 (飲む)" },
          { w: "かいます", pron: "ka-i-ma-su", cn: "买 (買う)" }
        ]
      },
      {
        title: "🎯 8. い形容词「～い (-i)」高频状态家族",
        rule: "日语形容词天然以「い」结尾，可直接修饰名词或加 です 结句：",
        words: [
          { w: "たかい (高い)", pron: "ta-ka-i", cn: "贵的 / 高的" },
          { w: "やすい (安い)", pron: "ya-su-i", cn: "便宜的" },
          { w: "おいしい", pron: "o-i-shi-i", cn: "好吃的" },
          { w: "あたらしい (新しい)", pron: "a-ta-ra-shi-i", cn: "新的" },
          { w: "いそがしい (忙しい)", pron: "i-so-ga-shi-i", cn: "忙碌的" }
        ]
      }
    ],
    rules: [
      { title: "5个元音走天下 (a i u e o)", desc: "日语所有假名都建立在 あ(a) い(i) う(u) え(e) お(o) 之上，口型小而固定，绝不滑动。" },
      { title: "节拍等时制 (Mora)", desc: "每个假名占完全相同的 1 拍！长音「ー」、促音「っ(停顿一拍)」、拨音「ん」都必须严格占满 1 拍。" },
      { title: "助词「は / を」特殊读音", desc: "「は」作主题助词时读 wa (不读 ha)；「を」作宾语助词时直接读 o。" },
      { title: "动词永远稳坐句尾", desc: "无论句子多长，核心动作（买、去、给、吃）永远放在整句话的最后一个词！" }
    ],
    minimalPairs: [
      {
        tag: "1. 短音 vs 长音 (差一拍辈分全变)",
        w1: "おばさん",
        ipa1: "obasan (阿姨 - 4拍)",
        w2: "おばあさん",
        ipa2: "obaasan (奶奶 - 5拍)",
        tip: "把「あ」多拖长一拍，辈分直接涨一代！日语长音绝不能偷工减料。",
        sentence: "あそこに おばさんと おばあさんが います。",
        sentenceCn: "那里有一位阿姨和一位老奶奶。"
      },
      {
        tag: "2. 无促音 vs 促音「っ」停顿",
        w1: "きて",
        ipa1: "kite (请来 - 连贯2拍)",
        w2: "きって",
        ipa2: "kitte (邮票 - 中间憋气停1拍)",
        tip: "看到小号「っ」时，嘴巴提前做好下一个辅音口型并屏住呼吸停顿一拍。",
        sentence: "ここへ きて、きってを ください。",
        sentenceCn: "请来这里，把邮票给我。"
      },
      {
        tag: "3. 清音 vs 浊音 (两点゛之差)",
        w1: "かき",
        ipa1: "kaki (柿子 - 清脆不震声带)",
        w2: "かぎ",
        ipa2: "kagi (钥匙 - 鼻音浊化)",
        tip: "右上角带两点「゛」即为浊音，声带需明显震动。",
        sentence: "かぎと かきは テーブルの うえです。",
        sentenceCn: "钥匙和柿子在桌子上。"
      },
      {
        tag: "4. 普通音 vs 拨音「ん」",
        w1: "かご",
        ipa1: "kago (篮子 - 2拍)",
        w2: "かんご",
        ipa2: "kango (护理 - 3拍)",
        tip: "拨音「ん」也要独占完整的一拍鼻音节拍。",
        sentence: "かごの なかに かんごの ほんが あります。",
        sentenceCn: "篮子里面有护理的书。"
      },
      {
        tag: "5. 片假名短音 vs 长音「ー」",
        w1: "ビル",
        ipa1: "biru (大楼 - 2拍)",
        w2: "ビール",
        ipa2: "biiru (啤酒 - 3拍)",
        tip: "在日本点啤酒千万要把「ー」拖长一拍，否则服务员会以为你在说大楼！",
        sentence: "この ビルで つめたい ビールを のみます。",
        sentenceCn: "在这栋大楼里喝冰镇啤酒。"
      },
      {
        tag: "6. 叔叔 vs 爷爷 (い段长音对比)",
        w1: "おじさん",
        ipa1: "ojisan (叔叔 - 4拍)",
        w2: "おじいさん",
        ipa2: "ojiisan (爷爷 - 5拍)",
        tip: "い段假名后面跟「い」表示把 i 的音拉长一倍。",
        sentence: "おじさんと おじいさんは げんきです。",
        sentenceCn: "叔叔和爷爷身体都很好。"
      },
      {
        tag: "7. 这里 vs 高中 (お段长音对比)",
        w1: "ここ",
        ipa1: "koko (这里 - 2拍)",
        w2: "こうこう",
        ipa2: "koukou (高中 - 4拍)",
        tip: "お段假名后接「う」时，不读 u，而是把前面的 o 拉长一拍！",
        sentence: "ここは わたしの こうこうです。",
        sentenceCn: "这里是我的高中。"
      },
      {
        tag: "8. 坡道 vs 作家 (さか vs さっか)",
        w1: "さか",
        ipa1: "saka (坡道 - 2拍)",
        w2: "さっか",
        ipa2: "sakka (作家 - 3拍停顿)",
        tip: "さっか 中间有明显的一拍停顿憋气感。",
        sentence: "あの さかに ゆうめいな さっかが います。",
        sentenceCn: "那个坡道上有一位著名的作家。"
      },
      {
        tag: "9. 词首清浊音 (天气 vs 电器)",
        w1: "てんき",
        ipa1: "tenki (天气 - 清音 t)",
        w2: "でんき",
        ipa2: "denki (电/电灯 - 浊音 d)",
        tip: "日语词首清音 t 不送气，而浊音 d 声带从起音就强烈震动。",
        sentence: "きょうは いい てんきですから、でんきを けします。",
        sentenceCn: "今天天气很好，所以把电灯关掉。"
      },
      {
        tag: "10. 拗音 vs 直音 (医院 vs 美容院)",
        w1: "びょういん",
        ipa1: "byouin (医院 - 小ょ拗音连拼)",
        w2: "びよういん",
        ipa2: "biyouin (美容院 - 大よ独立成拍)",
        tip: "小号「ょ」和前面的 び 合拼为 byo；大号「よ」则单独读 bi-yo-u-in！去日本千万别走错门！",
        sentence: "びょういんの となりに びよういんが あります。",
        sentenceCn: "医院的旁边有一家美容院。"
      }
    ],
    legoWords: {
      verbs: [
        { w: "あげます", pron: "agemasu", cn: "给", sampleId: 3 },
        { w: "いきます", pron: "ikimasu", cn: "去", sampleId: 11 },
        { w: "たべます", pron: "tabemasu", cn: "吃", sampleId: 12 },
        { w: "かいます", pron: "kaimasu", cn: "买", sampleId: 10 },
        { w: "みます", pron: "mimasu", cn: "看", sampleId: 4 },
        { w: "おくります", pron: "okurimasu", cn: "发送 / 寄", sampleId: 5 },
        { w: "わかります", pron: "wakarimasu", cn: "明白 / 懂", sampleId: 12 },
        { w: "します", pron: "shimasu", cn: "做 / 办", sampleId: 9 },
        { w: "あります", pron: "arimasu", cn: "有 (物品)", sampleId: 1 },
        { w: "ください", pron: "kudasai", cn: "请给我…", sampleId: 3 },
        { w: "てつだいます", pron: "tetsudaimasu", cn: "帮忙", sampleId: 10 },
        { w: "のみます", pron: "nomimasu", cn: "喝", sampleId: 12 }
      ],
      nouns: [
        { w: "わたし", pron: "watashi", cn: "我", sampleId: 3 },
        { w: "これ", pron: "kore", cn: "这个", sampleId: 1 },
        { w: "みず", pron: "mizu", cn: "水", sampleId: 3 },
        { w: "おかね", pron: "okane", cn: "钱", sampleId: 5 },
        { w: "えき", pron: "eki", cn: "车站", sampleId: 7 },
        { w: "ホテル", pron: "hoteru", cn: "酒店", sampleId: 2 },
        { w: "トイレ", pron: "toire", cn: "洗手间", sampleId: 7 },
        { w: "スマホ", pron: "sumaho", cn: "手机", sampleId: 2 },
        { w: "しりょう", pron: "shiryou", cn: "资料 / 报告", sampleId: 1 },
        { w: "きょう", pron: "kyou", cn: "今天", sampleId: 9 },
        { w: "あした", pron: "ashita", cn: "明天", sampleId: 11 },
        { w: "いま", pron: "ima", cn: "现在", sampleId: 1 }
      ],
      modifiers: [
        { w: "いい", pron: "ii", cn: "好的", sampleId: 1 },
        { w: "たかい", pron: "takai", cn: "贵的 / 高的", sampleId: 8 },
        { w: "やすい", pron: "yasui", cn: "便宜的", sampleId: 8 },
        { w: "おいしい", pron: "oishii", cn: "好吃的", sampleId: 1 },
        { w: "だいじょうぶ", pron: "daijoubu", cn: "没问题 / 行的", sampleId: 7 },
        { w: "むりょう", pron: "muryou", cn: "免费的", sampleId: 7 },
        { w: "とても", pron: "totemo", cn: "非常 / 很", sampleId: 1 },
        { w: "どこ", pron: "doko", cn: "哪里", sampleId: 7 },
        { w: "いくら", pron: "ikura", cn: "多少钱", sampleId: 7 },
        { w: "は (助词)", pron: "wa", cn: "主题标记 (…是)", sampleId: 1 },
        { w: "を (助词)", pron: "o", cn: "把… (宾语标记)", sampleId: 3 },
        { w: "に (助词)", pron: "ni", cn: "向/给… (对象标记)", sampleId: 3 }
      ]
    }
  },
  es: {
    subtitle: "27字母+特殊拼读全景表 + 颤音/重音对比 + 同尾词族串烧",
    alphabetTitle: "🗺️ 西班牙语完整发音体系全表 (第一行听字母单音 · 第三行听例词)",
    phoneticCategories: [
      {
        id: 'es_vowels',
        name: '① 5 大恒定元音 + 二合元音 (占西语拼读 50% 功力)',
        desc: '西语元音永远不変音、不弱化！点击第一行【🔊单音】听纯粹元音，点击第三行听例词：',
        isGrid5: true,
        items: [
          { char: 'A a', sound: 'a', sub: '/a/ (阿)', tip: '口型张大固定发“阿”', sample: 'agua', sampleCn: '水' },
          { char: 'E e', sound: 'e', sub: '/e/ (诶)', tip: '嘴角微展发清脆“诶”', sample: 'eso', sampleCn: '那个' },
          { char: 'I i', sound: 'i', sub: '/i/ (衣)', tip: '永远发微笑“衣”', sample: 'isla', sampleCn: '岛屿' },
          { char: 'O o', sound: 'o', sub: '/o/ (哦)', tip: '圆唇固定发“哦”', sample: 'hola', sampleCn: '你好' },
          { char: 'U u', sound: 'u', sub: '/u/ (乌)', tip: '圆唇发“乌” (qu/gu中静音)', sample: 'uno', sampleCn: '一 (1)' },
          { char: 'ia / ie', sound: 'ia, ie', sub: '呀 / 耶', tip: 'i 快速滑向 a/e', sample: 'quiero', sampleCn: '我想要' },
          { char: 'io / iu', sound: 'io, iu', sub: '哟 / 优', tip: 'i 快速滑向 o/u', sample: 'precio', sampleCn: '价格' },
          { char: 'ua / ue', sound: 'ua, ue', sub: '哇 / 威', tip: 'u 快速滑向 a/e', sample: 'bueno', sampleCn: '好的' },
          { char: 'ai / ei', sound: 'ai, ei', sub: '爱 / 欸', tip: 'a/e 滑向 i', sample: 'aire', sampleCn: '空气' },
          { char: 'au / eu', sound: 'au, eu', sub: '奥 / 欧', tip: 'a/e 滑向 u', sample: 'auto', sampleCn: '汽车' }
        ]
      },
      {
        id: 'es_special',
        name: '② 12 个必背特殊辅音与双字母变音规则 (西语拼读灵魂)',
        desc: '西语里唯一跟英语拼音习惯不同的就是这 12 组！记住它们就能 100% 盲读所有西语词：',
        items: [
          { char: 'H h', sound: 'ola', sub: '永远静音!', tip: '在任何位置都像空气一样不发音', sample: 'hotel', sampleCn: '酒店' },
          { char: 'J j', sound: 'ja, je', sub: '/x/ (喝)', tip: '永远发中文“喝/哈”的擦喉音', sample: 'Juan', sampleCn: '胡安(人名)' },
          { char: 'Ñ ñ', sound: 'nya', sub: '/ɲ/ (涅)', tip: '舌面贴硬腭，发“尼亚/涅”', sample: 'mañana', sampleCn: '明天/上午' },
          { char: 'LL ll', sound: 'ya', sub: '/ʝ/ (耶)', tip: '不读 l，读如英语 yes 的 y', sample: 'ella', sampleCn: '她' },
          { char: 'RR rr', sound: 'rra, rro', sub: '/r/ 大舌颤音', tip: '双写 rr 或词首 r 需连续弹舌', sample: 'perro', sampleCn: '狗' },
          { char: 'R r (单)', sound: 'ra, ro', sub: '/ɾ/ 单颤音', tip: '舌尖快速轻弹上齿龈一下', sample: 'pero', sampleCn: '但是' },
          { char: 'C + a/o/u', sound: 'ka, ko, ku', sub: '/k/ (咔)', tip: '后接 a/o/u 时发清音 k', sample: 'casa', sampleCn: '房子/家' },
          { char: 'C + e/i', sound: 'ce, ci', sub: '/θ/ 或 /s/', tip: '后接 e/i 时发咬舌音或 s', sample: 'cena', sampleCn: '晚餐' },
          { char: 'G + a/o/u', sound: 'ga, go, gu', sub: '/ɡ/ (嘎)', tip: '后接 a/o/u 时发浊音 g', sample: 'gato', sampleCn: '猫' },
          { char: 'G + e/i', sound: 'ge, gi', sub: '/x/ (喝)', tip: '后接 e/i 时与 J 一样发喉音“喝”', sample: 'gente', sampleCn: '人们' },
          { char: 'QU + e/i', sound: 'ke, ki', sub: 'ke / ki', tip: '中间的 u 静音，直接读 ke / ki', sample: 'queso', sampleCn: '奶酪' },
          { char: 'GU + e/i', sound: 'gue, gui', sub: 'ge / gi', tip: '中间的 u 静音，读浊音 ge / gi', sample: 'guía', sampleCn: '导游/指南' }
        ]
      },
      {
        id: 'es_regular',
        name: '③ 常规辅音全表 (与英语/汉语拼音直觉基本一致)',
        desc: '注意 B 与 V 在西语中发音完全相同，且 P / T / K 不送气（更像中文的 b / d / g）：',
        items: [
          { char: 'B b / V v', sound: 'ba, be', sub: '/b/ 同音', tip: '西语 b 和 v 发音完全一样', sample: 'vino', sampleCn: '葡萄酒' },
          { char: 'CH ch', sound: 'cha, che', sub: '/tʃ/ (切)', tip: '与英语 ch (chat) 发音相同', sample: 'chico', sampleCn: '男孩/小伙' },
          { char: 'D d', sound: 'da, de', sub: '/d/ 或 /ð/', tip: '词首读 d，元音间轻咬舌', sample: 'donde', sampleCn: '哪里' },
          { char: 'F f', sound: 'fa, fe', sub: '/f/ (夫)', tip: '上齿轻触下唇吹气', sample: 'foto', sampleCn: '照片' },
          { char: 'L l', sound: 'la, le', sub: '/l/ (勒)', tip: '舌尖清晰顶住上齿龈', sample: 'listo', sampleCn: '准备好的' },
          { char: 'M m / N n', sound: 'ma, na', sub: '/m/ /n/', tip: '双唇鼻音与舌尖鼻音', sample: 'mano', sampleCn: '手' },
          { char: 'P p', sound: 'pa, po', sub: '/p/ 不送气', tip: '双唇不送气清音（接近中文“巴”）', sample: 'papa', sampleCn: '土豆' },
          { char: 'S s', sound: 'sa, si', sub: '/s/ (丝)', tip: '清脆的平舌音 s', sample: 'sí', sampleCn: '是的' },
          { char: 'T t', sound: 'ta, to', sub: '/t/ 不送气', tip: '舌尖不送气清音（接近中文“搭”）', sample: 'todo', sampleCn: '全部/一切' },
          { char: 'Z z', sound: 'za, zo', sub: '/θ/ 或 /s/', tip: '西班牙读咬舌清音，拉美读 s', sample: 'zapato', sampleCn: '鞋子' }
        ]
      }
    ],
    soundClusters: [
      {
        title: "🎯 1. 英语秒变西语：「-ción」同音家族 (100%对应英文 -tion)",
        rule: "把你认识的英文 -tion 词尾换成西语 -ción，重音直接砸在最后一个音节，瞬间白捡几百个西语词：",
        words: [
          { w: "estación", pron: "es-ta-CIÓN", cn: "station (车站)" },
          { w: "habitación", pron: "a-bi-ta-CIÓN", cn: "客房 / 房间" },
          { w: "información", pron: "in-for-ma-CIÓN", cn: "information (信息)" },
          { w: "reservación", pron: "re-ser-va-CIÓN", cn: "reservation (预订)" },
          { w: "situación", pron: "si-tua-CIÓN", cn: "situation (情况)" }
        ]
      },
      {
        title: "🎯 2. 静音 H 家族 (看到 H 当作透明空气)",
        rule: "西语的 H 永远 100% 不发音，直接读 H 后面的元音：",
        words: [
          { w: "hola", pron: "O-la", cn: "你好" },
          { w: "hotel", pron: "o-TEL", cn: "酒店" },
          { w: "hoy", pron: "oj", cn: "今天" },
          { w: "hora", pron: "O-ra", cn: "小时 / 时间" },
          { w: "hacer", pron: "a-SER", cn: "做 (动词)" }
        ]
      },
      {
        title: "🎯 3. 喉音 J 与 G(e/i) 擦喉家族 (/x/)",
        rule: "字母 j 以及 ge/gi 组合，全部发清脆的中文“喝/哈”喉音：",
        words: [
          { w: "jefe", pron: "HE-fe", cn: "老板 / 主管" },
          { w: "jueves", pron: "HWE-bes", cn: "星期四" },
          { w: "trabajo", pron: "tra-BA-ho", cn: "工作" },
          { w: "gente", pron: "HEN-te", cn: "人们" },
          { w: "gerente", pron: "he-REN-te", cn: "经理" }
        ]
      },
      {
        title: "🎯 4. 特色鼻音 Ñ 与双写 LL 家族",
        rule: "ñ 读“涅(ni)”，ll 读如英语 yes 的 y 音：",
        words: [
          { w: "mañana", pron: "ma-NYA-na", cn: "明天 / 上午" },
          { w: "baño", pron: "BA-nyo", cn: "洗手间" },
          { w: "español", pron: "es-pa-NYOL", cn: "西班牙语" },
          { w: "calle", pron: "KA-ye", cn: "街道" },
          { w: "pollo", pron: "PO-yo", cn: "鸡肉" }
        ]
      },
      {
        title: "🎯 5. 静音 U 组合「QU / GU + e, i」家族",
        rule: "que / qui 中的 u 永远不发音，直接读 ke / ki：",
        words: [
          { w: "quiero", pron: "KYE-ro", cn: "我想要" },
          { w: "queso", pron: "KE-so", cn: "奶酪" },
          { w: "aquí", pron: "a-KI", cn: "这里" },
          { w: "paquete", pron: "pa-KE-te", cn: "包裹" },
          { w: "guía", pron: "GI-a", cn: "导游 / 指南" }
        ]
      },
      {
        title: "🎯 6. 动词原形三兄弟：「-ar / -er / -ir」尾音簇",
        rule: "西语所有动词原形都以这三个字母组合结尾，词尾单 r 舌尖轻弹一下：",
        words: [
          { w: "comprar", pron: "kom-PRAR", cn: "买" },
          { w: "hablar", pron: "a-BLAR", cn: "说话" },
          { w: "comer", pron: "ko-MER", cn: "吃" },
          { w: "beber", pron: "be-BER", cn: "喝" },
          { w: "vivir", pron: "bi-BIR", cn: "居住 / 生活" }
        ]
      },
      {
        title: "🎯 7. 阴阳性变色龙：「-o (阳) / -a (阴)」高频词簇",
        rule: "张嘴连读感受词尾元音的切换：",
        words: [
          { w: "rojo / roja", pron: "RO-ho / RO-ha", cn: "红色的" },
          { w: "listo / lista", pron: "LIS-to / LIS-ta", cn: "准备好的" },
          { w: "caro / cara", pron: "KA-ro / KA-ra", cn: "昂贵的" },
          { w: "barato / barata", pron: "ba-RA-to", cn: "便宜的" },
          { w: "bueno / buena", pron: "BWE-no", cn: "好的" }
        ]
      },
      {
        title: "🎯 8. 商务高频后缀「-dad」家族 (对应英文 -ty)",
        rule: "英文以 -ty 结尾的名词 (city, university)，在西语中直接变成 -dad（阴性名词）：",
        words: [
          { w: "ciudad", pron: "syu-DAD", cn: "city (城市)" },
          { w: "universidad", pron: "u-ni-ber-si-DAD", cn: "university (大学)" },
          { w: "calidad", pron: "ka-li-DAD", cn: "quality (质量)" },
          { w: "oportunidad", pron: "o-por-tu-ni-DAD", cn: "opportunity (机会)" },
          { w: "verdad", pron: "ber-DAD", cn: "truth (真相/真的)" }
        ]
      }
    ],
    rules: [
      { title: "100% 见词能读 (5元音恒定)", desc: "西语 a / e / i / o / u 永远只发唯一固定的音（阿、诶、衣、哦、乌），没有任何模糊音！" },
      { title: "不发音的 H 与喉音 J", desc: "字母 h 永远静音不发音 (Hola → ola)；字母 j 发类似中文“喝”的清脆喉音 (Juan → huan)。" },
      { title: "特色音 ñ 与双写 ll", desc: "ñ 发“涅 (ni)”音 (mañana)；ll 发类似英语 y (yes) 的音 (ella → e-ya)。" },
      { title: "名词阴阳性一眼看词尾", desc: "以 -o 结尾的名词 95% 是阳性 (配 el)；以 -a 结尾的名词 95% 是阴性 (配 la)。" }
    ],
    minimalPairs: [
      {
        tag: "1. 单颤音 r vs 大舌多颤音 rr",
        w1: "pero",
        ipa1: "/ˈpe.ɾo/ (但是 - 舌尖轻弹一下)",
        w2: "perro",
        ipa2: "/ˈpe.ro/ (狗 - 舌尖连续颤动)",
        tip: "发单 r 时像美式英语 water 中间的快速弹舌；rr 则需要气流吹动舌尖连颤。",
        sentence: "El perro es grande, pero muy bueno.",
        sentenceCn: "这只狗很大，但是非常乖。"
      },
      {
        tag: "2. 重音符号改变词义与时态",
        w1: "hablo",
        ipa1: "/ˈa.βlo/ (我说话 - 重音在前)",
        w2: "habló",
        ipa2: "/a.ˈβlo/ (他曾说话 - 重音在尾)",
        tip: "带重音符号「´」的音节必须用力重读，否则连人称和时态都会变！",
        sentence: "Yo hablo hoy porque él habló ayer.",
        sentenceCn: "我今天发言，因为他昨天发言过了。"
      },
      {
        tag: "3. 鼻音 n vs 腭化鼻音 ñ",
        w1: "una",
        ipa1: "/ˈu.na/ (一个 - 普通n)",
        w2: "uña",
        ipa2: "/ˈu.ɲa/ (指甲 - 带y音的ñ)",
        tip: "发 ñ 时舌面贴住硬腭，相当于把 n 和 y 捏在一起发。",
        sentence: "Tengo una uña rota.",
        sentenceCn: "我有一片指甲断了。"
      },
      {
        tag: "4. 喉音 j vs 浊音 g",
        w1: "jefe",
        ipa1: "/ˈxe.fe/ (老板 - 强烈擦喉音)",
        w2: "gato",
        ipa2: "/ˈɡa.to/ (猫 - 浊音g)",
        tip: "西语的 j 和 ge/gi 都要在喉咙深处摩擦出气。",
        sentence: "Mi jefe tiene un gato blanco.",
        sentenceCn: "我的老板养了一只白猫。"
      },
      {
        tag: "5. 阳性 -o vs 阴性 -a",
        w1: "rojo",
        ipa1: "/ˈro.xo/ (红色的-修饰阳性)",
        w2: "roja",
        ipa2: "/ˈro.xa/ (红色的-修饰阴性)",
        tip: "形容词词尾必须像变色龙一样跟着它修饰的名词变 -o 或 -a。",
        sentence: "El coche es rojo y la manzana es roja.",
        sentenceCn: "汽车是红色的，而苹果也是红色的。"
      },
      {
        tag: "6. 昂贵的 vs 汽车 (caro vs carro)",
        w1: "caro",
        ipa1: "/ˈka.ɾo/ (昂贵的 - 单颤r)",
        w2: "carro",
        ipa2: "/ˈka.ro/ (汽车 - 多颤rr)",
        tip: "买车时一定要分清 caro（贵）和 carro（车）！",
        sentence: "Este carro nuevo es muy caro.",
        sentenceCn: "这辆新车非常昂贵。"
      },
      {
        tag: "7. 土豆 vs 爸爸 (重音与冠词)",
        w1: "papa",
        ipa1: "/ˈpa.pa/ (土豆 - 重音在首)",
        w2: "papá",
        ipa2: "/pa.ˈpa/ (爸爸 - 重音在尾)",
        tip: "少重读最后一个音节，爸爸 (papá) 就会变成土豆 (papa)！",
        sentence: "Mi papá quiere comer una papa.",
        sentenceCn: "我爸爸想吃一个土豆。"
      },
      {
        tag: "8. 双写 ll vs 舌侧音 l",
        w1: "pollo",
        ipa1: "/ˈpo.ʝo/ (鸡肉 - 读如po-yo)",
        w2: "polo",
        ipa2: "/ˈpo.lo/ (马球衫 - 读如po-lo)",
        tip: "点炸鸡 (pollo) 时千万不能读成 l，而是发 y 的音。",
        sentence: "Comemos pollo con camisa de polo.",
        sentenceCn: "我们穿着 Polo 衫吃鸡肉。"
      },
      {
        tag: "9. 不送气清音 p vs 浊音 b",
        w1: "peso",
        ipa1: "/ˈpe.so/ (比索/重量 - 清音p)",
        w2: "beso",
        ipa2: "/ˈbe.so/ (亲吻 - 浊音b)",
        tip: "西语的 p 不送气，靠声带是否震动与 b 区分。",
        sentence: "Te doy un beso y un peso.",
        sentenceCn: "我给你一个吻和一比索。"
      },
      {
        tag: "10. 猴子 vs 蝴蝶结 (mono vs moño)",
        w1: "mono",
        ipa1: "/ˈmo.no/ (猴子/可爱的 - n)",
        w2: "moño",
        ipa2: "/ˈmo.ɲo/ (发髻/蝴蝶结 - ñ)",
        tip: "再次强化 n 与 ñ 的对比，舌面抬起贴硬腭。",
        sentence: "El mono pequeño lleva un moño rojo.",
        sentenceCn: "那只小猴子戴着一个红蝴蝶结。"
      }
    ],
    legoWords: {
      verbs: [
        { w: "doy", pron: "/doj/", cn: "我给 (dar)", sampleId: 3 },
        { w: "quiero", pron: "/ˈkje.ɾo/", cn: "我想要", sampleId: 10 },
        { w: "necesito", pron: "/ne.θeˈsi.to/", cn: "我需要", sampleId: 9 },
        { w: "tengo", pron: "/ˈteŋ.ɡo/", cn: "我有", sampleId: 3 },
        { w: "voy", pron: "/boj/", cn: "我去 / 我将要", sampleId: 11 },
        { w: "puedo", pron: "/ˈpwe.ðo/", cn: "我能 / 可以", sampleId: 12 },
        { w: "debo", pron: "/ˈde.βo/", cn: "我必须", sampleId: 9 },
        { w: "comprar", pron: "/komˈpɾaɾ/", cn: "买 (原形)", sampleId: 10 },
        { w: "comer", pron: "/koˈmeɾ/", cn: "吃 (原形)", sampleId: 12 },
        { w: "enviar", pron: "/emˈbjaɾ/", cn: "发送 (原形)", sampleId: 11 },
        { w: "saber", pron: "/saˈβeɾ/", cn: "知道 (原形)", sampleId: 12 },
        { w: "ayudar", pron: "/a.ʝuˈðaɾ/", cn: "帮助 (原形)", sampleId: 10 }
      ],
      nouns: [
        { w: "el dinero", pron: "/diˈne.ɾo/", cn: "钱 (阳)", sampleId: 5 },
        { w: "el agua", pron: "/ˈa.ɣwa/", cn: "水", sampleId: 3 },
        { w: "el billete", pron: "/biˈʎe.te/", cn: "票 / 车票 (阳)", sampleId: 4 },
        { w: "el hotel", pron: "/oˈtel/", cn: "酒店 (阳)", sampleId: 1 },
        { w: "el baño", pron: "/ˈba.ɲo/", cn: "洗手间 (阳)", sampleId: 7 },
        { w: "el informe", pron: "/inˈfoɾ.me/", cn: "报告 (阳)", sampleId: 1 },
        { w: "el cliente", pron: "/ˈkljen.te/", cn: "客户 (阳)", sampleId: 2 },
        { w: "la estación", pron: "/es.taˈθjon/", cn: "车站 (阴)", sampleId: 7 },
        { w: "la cuenta", pron: "/ˈkwen.ta/", cn: "账单 (阴)", sampleId: 3 },
        { w: "la ayuda", pron: "/aˈʝu.ða/", cn: "帮助 (阴)", sampleId: 10 },
        { w: "hoy", pron: "/oj/", cn: "今天", sampleId: 9 },
        { w: "mañana", pron: "/maˈɲa.na/", cn: "明天", sampleId: 11 }
      ],
      modifiers: [
        { w: "bueno/a", pron: "/ˈbwe.no/", cn: "好的", sampleId: 1 },
        { w: "listo/a", pron: "/ˈlis.to/", cn: "准备好的", sampleId: 1 },
        { w: "caro/a", pron: "/ˈka.ɾo/", cn: "昂贵的", sampleId: 8 },
        { w: "barato/a", pron: "/baˈɾa.to/", cn: "便宜的", sampleId: 8 },
        { w: "gratis", pron: "/ˈɡɾa.tis/", cn: "免费的", sampleId: 7 },
        { w: "urgente", pron: "/uɾˈxen.te/", cn: "紧急的", sampleId: 1 },
        { w: "muy", pron: "/muj/", cn: "非常 / 很", sampleId: 1 },
        { w: "ahora", pron: "/aˈo.ɾa/", cn: "现在", sampleId: 9 },
        { w: "aquí", pron: "/aˈki/", cn: "这里", sampleId: 1 },
        { w: "¿dónde?", pron: "/ˈdon.de/", cn: "在哪里？", sampleId: 7 },
        { w: "porque", pron: "/ˈpoɾ.ke/", cn: "因为", sampleId: 12 },
        { w: "pero", pron: "/ˈpe.ɾo/", cn: "但是", sampleId: 12 }
      ]
    }
  }
};
