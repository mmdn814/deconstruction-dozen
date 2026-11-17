// 西班牙语「语言地图」。内容为本项目原创。

const S = '主语';
const V = '谓语';
const O = '宾语';
const M = '修饰';
const W = '同伴';
const P = '地点';
const T = '时间';
const ART = '冠词';
const PREP = '介词';

export const MAP_ES = {
  posters: [
    {
      title: '西班牙语发音',
      note: '西语怎么写就怎么读，认全这一页就能读出任何词。大字是字母，点它听单音；点右边听例词。',
      blocks: [
        { t: 'sounds', lang: 'es' },
        { t: 'sub', text: '重音落在哪' },
        {
          t: 'table',
          tpl: '1fr 1fr 1fr',
          colTones: ['cyan', 'green', 'rose'],
          rows: [
            [['casa', '元音 / n / s 结尾：倒数第二'], ['hablar', '其他辅音结尾：最后一个'], ['café', '有重音符号：听符号的']],
            [['joven', 'JO-ven'], ['ciudad', 'ciu-DAD'], ['teléfono', 'te-LÉ-fo-no']]
          ]
        }
      ]
    },
    {
      title: '一分钟看懂西语句子',
      note: '彩色是词，灰色虚线框是冠词和介词这类小词。点词读单个词，点中文读整句。',
      blocks: [
        {
          t: 'ladder',
          lines: [
            { parts: [[S, 'Yo'], [V, 'bebí'], [O, 'cerveza.']], cn: '我喝了啤酒。' },
            { parts: [[S, 'Yo'], [V, 'bebí'], [ART, 'una'], [O, 'cerveza'], [M, 'fría.']], cn: '我喝了一杯冰啤酒。' },
            { parts: [[S, 'Yo'], [V, 'bebí'], [ART, 'una'], [O, 'cerveza'], [M, 'fría'], [PREP, 'con'], [ART, 'un'], [W, 'amigo.']], cn: '我和一个朋友喝了冰啤酒。' },
            {
              parts: [[S, 'Yo'], [V, 'bebí'], [ART, 'una'], [O, 'cerveza'], [M, 'fría'], [PREP, 'con'], [ART, 'un'], [W, 'amigo'], [PREP, 'en'], [ART, 'el'], [P, 'bar.']],
              cn: '我和一个朋友在酒吧喝了冰啤酒。'
            },
            {
              parts: [[S, 'Yo'], [V, 'bebí'], [ART, 'una'], [O, 'cerveza'], [M, 'fría'], [PREP, 'con'], [ART, 'un'], [W, 'amigo'], [PREP, 'en'], [ART, 'el'], [P, 'bar'], [PREP, 'a'], [ART, 'las'], [T, 'ocho.']],
              cn: '我八点和一个朋友在酒吧喝了冰啤酒。'
            }
          ],
          foot: '顺序和英语接近：谁 → 做 → 什么。三个不同点：形容词放在名词后面（cerveza fría）；名词分阴阳性，冠词跟着变（un / una）；动词词尾已经说明了是谁，所以主语 Yo 常常省掉。'
        }
      ]
    },
    {
      title: '一张图看懂西语动词',
      note: '西语动词按「谁做」变词尾。三类规则动词，各看一个就会一大片。',
      blocks: [
        {
          t: 'table',
          tpl: '3.4rem 1fr 1fr 1fr',
          heads: ['现在时', '-ar 说', '-er 吃', '-ir 住'],
          headTones: ['gray', 'cyan', 'green', 'pink'],
          colTones: ['gray', 'cyan', 'green', 'pink'],
          small: true,
          rows: [
            ['原形', ['hablar'], ['comer'], ['vivir']],
            ['我 yo', ['hablo'], ['como'], ['vivo']],
            ['你 tú', ['hablas'], ['comes'], ['vives']],
            ['他 él', ['habla'], ['come'], ['vive']],
            ['我们', ['hablamos'], ['comemos'], ['vivimos']],
            ['你们', ['habláis'], ['coméis'], ['vivís']],
            ['他们', ['hablan'], ['comen'], ['viven']]
          ]
        },
        { t: 'sub', text: '四个最常用的不规则动词（现在时）' },
        {
          t: 'table',
          tpl: '3.4rem repeat(4, 1fr)',
          heads: ['', 'ser 是', 'estar 在', 'tener 有', 'ir 去'],
          headTones: ['gray', 'rose', 'amber', 'sky', 'violet'],
          colTones: ['gray', 'rose', 'amber', 'sky', 'violet'],
          small: true,
          rows: [
            ['我 yo', ['soy'], ['estoy'], ['tengo'], ['voy']],
            ['你 tú', ['eres'], ['estás'], ['tienes'], ['vas']],
            ['他 él', ['es'], ['está'], ['tiene'], ['va']],
            ['我们', ['somos'], ['estamos'], ['tenemos'], ['vamos']],
            ['他们', ['son'], ['están'], ['tienen'], ['van']]
          ]
        },
        { t: 'sub', text: '时态（以 yo 我 为例）' },
        {
          t: 'table',
          tpl: 'repeat(4, 1fr)',
          heads: ['现在', '过去（做了）', '过去（那时常）', '将来'],
          headTones: ['cyan', 'rose', 'amber', 'green'],
          colTones: ['cyan', 'rose', 'amber', 'green'],
          small: true,
          rows: [
            [['hablo', '我说'], ['hablé', '我说了'], ['hablaba', '我那时常说'], ['hablaré', '我将说']],
            [['como', '我吃'], ['comí', '我吃了'], ['comía', '我那时常吃'], ['comeré', '我将吃']],
            [['vivo', '我住'], ['viví', '我住过'], ['vivía', '我那时住'], ['viviré', '我将住']],
            [['voy a comer', '我要去吃（最常用的将来）'], ['he comido', '我已经吃了'], ['estoy comiendo', '我正在吃'], ['no como', '我不吃']]
          ]
        }
      ]
    },
    {
      title: '西语的小零件',
      note: '每句话都会用到的词，数量不多。',
      blocks: [
        { t: 'sub', text: '人称' },
        {
          t: 'table',
          tpl: 'repeat(4, 1fr)',
          colTones: ['rose', 'amber', 'sky', 'violet'],
          rows: [
            [['yo', '我'], ['tú', '你'], ['él', '他'], ['ella', '她']],
            [['usted', '您'], ['nosotros', '我们'], ['vosotros', '你们'], ['ellos', '他们']],
            [['mi', '我的'], ['tu', '你的'], ['su', '他/她的'], ['nuestro', '我们的']]
          ]
        },
        { t: 'sub', text: '名词分阴阳性，冠词跟着变' },
        {
          t: 'table',
          tpl: '2.6rem repeat(4, 1fr)',
          heads: ['', '阳性单数', '阴性单数', '阳性复数', '阴性复数'],
          headTones: ['gray', 'sky', 'pink', 'sky', 'pink'],
          colTones: ['gray', 'sky', 'pink', 'sky', 'pink'],
          small: true,
          rows: [
            ['那个', ['el'], ['la'], ['los'], ['las']],
            ['一个', ['un'], ['una'], ['unos'], ['unas']],
            ['例', ['el libro', '书'], ['la casa', '房子'], ['los libros'], ['las casas']],
            ['形容词', ['rojo', '红的'], ['roja'], ['rojos'], ['rojas']]
          ]
        },
        { t: 'sub', text: '这 / 那 / 那边' },
        {
          t: 'table',
          tpl: '2.6rem repeat(3, 1fr)',
          heads: ['', '近', '中', '远'],
          headTones: ['gray', 'sky', 'pink', 'green'],
          colTones: ['gray', 'sky', 'pink', 'green'],
          small: true,
          rows: [
            ['阳性', ['este', '这个'], ['ese', '那个'], ['aquel', '那边那个']],
            ['阴性', ['esta'], ['esa'], ['aquella']],
            ['地方', ['aquí', '这里'], ['ahí', '那里'], ['allí', '那边']]
          ]
        },
        { t: 'sub', text: '疑问词（都带重音符号）' },
        {
          t: 'table',
          tpl: 'repeat(4, 1fr)',
          colTones: ['sky', 'pink', 'green', 'amber'],
          rows: [
            [['qué', '什么'], ['quién', '谁'], ['dónde', '哪里'], ['cuándo', '什么时候']],
            [['por qué', '为什么'], ['cómo', '怎么'], ['cuál', '哪个'], ['cuánto', '多少']]
          ]
        }
      ]
    },
    {
      title: '介词一览',
      note: '介词放在名词前面，说明地点、时间、方向和关系。每个介词第一行是最常用的意思。点词读单个词，点中文读整句。',
      blocks: [
        {
          t: 'usage',
          items: [
            { p: 'a', rows: [['去往', 'Voy a la escuela.', '我去学校。'], ['几点钟', 'Comemos a las dos.', '我们两点吃饭。'], ['对某人', 'Llamo a mi madre.', '我给妈妈打电话。']] },
            { p: 'de', rows: [['…的', 'El libro de Ana.', '安娜的书。'], ['从…来', 'Soy de China.', '我来自中国。'], ['材料、内容', 'Un vaso de agua.', '一杯水。']] },
            { p: 'en', rows: [['在…里 / 上', 'Estoy en casa.', '我在家。'], ['乘坐', 'Voy en tren.', '我坐火车去。'], ['月份、年份', 'Nací en mayo.', '我五月出生。']] },
            { p: 'con', rows: [['和谁一起', 'Vivo con mi familia.', '我和家人一起住。'], ['带着、用', 'Café con leche.', '加奶的咖啡。']] },
            { p: 'sin', rows: [['没有、不带', 'Agua sin gas.', '不带气的水。']] },
            { p: 'por', rows: [['因为', 'Gracias por tu ayuda.', '谢谢你的帮助。'], ['经过、沿着', 'Paseo por el parque.', '我在公园散步。'], ['时段', 'Trabajo por la mañana.', '我上午工作。']] },
            { p: 'para', rows: [['为了、给', 'Esto es para ti.', '这是给你的。'], ['目的', 'Estudio para aprender.', '我学习是为了学会。']] },
            { p: 'desde / hasta', rows: [['从 / 到', 'Trabajo desde las nueve hasta las cinco.', '我从九点工作到五点。']] },
            { p: 'sobre', rows: [['在…上面', 'El libro está sobre la mesa.', '书在桌子上。'], ['关于', 'Un libro sobre España.', '一本关于西班牙的书。']] },
            { p: 'entre', rows: [['在…之间', 'Está entre el banco y el bar.', '它在银行和酒吧之间。']] },
            { p: 'y / pero / o', rows: [['和', 'Pan y leche.', '面包和牛奶。'], ['但是', 'Es pequeño pero bueno.', '它小但是好。'], ['或者', '¿Té o café?', '茶还是咖啡？']] },
            { p: 'no', rows: [['不（放在动词前）', 'No hablo español.', '我不会说西班牙语。']] }
          ]
        }
      ]
    }
  ]
};
