// 英语「语言地图」。内容为本项目原创。

const S = '主语';
const V = '谓语';
const O = '宾语';
const M = '修饰';
const W = '同伴';
const P = '地点';
const T = '时间';
const ART = '冠词';
const PREP = '介词';

export const MAP_EN = {
  posters: [
    {
      title: '英语 44 个音',
      note: '英语拼写和读音对不上，所以要认音标。红色黑色的大字是音标，点它听单音；点右边听例词。',
      blocks: [{ t: 'sounds', lang: 'en' }]
    },
    {
      title: '一分钟看懂英语句子',
      note: '彩色是词，灰色虚线框是冠词和介词这类小词。点词读单个词，点中文读整句。',
      blocks: [
        {
          t: 'ladder',
          lines: [
            { parts: [[S, 'I'], [V, 'drank'], [O, 'beer.']], cn: '我喝了啤酒。' },
            { parts: [[S, 'I'], [V, 'drank'], [M, 'cold'], [O, 'beer.']], cn: '我喝了冰啤酒。' },
            { parts: [[S, 'I'], [V, 'drank'], [M, 'cold'], [O, 'beer'], [PREP, 'with'], [ART, 'a'], [W, 'friend.']], cn: '我和朋友喝了冰啤酒。' },
            {
              parts: [[S, 'I'], [V, 'drank'], [M, 'cold'], [O, 'beer'], [PREP, 'with'], [ART, 'a'], [W, 'friend'], [PREP, 'at'], [ART, 'the'], [P, 'bar.']],
              cn: '我和朋友在酒吧喝了冰啤酒。'
            },
            {
              parts: [[S, 'I'], [V, 'drank'], [M, 'cold'], [O, 'beer'], [PREP, 'with'], [ART, 'a'], [W, 'friend'], [PREP, 'at'], [ART, 'the'], [P, 'bar'], [PREP, 'at'], [T, '8 pm.']],
              cn: '我晚上8点和朋友在酒吧喝了冰啤酒。'
            }
          ],
          foot: '顺序固定：谁 → 做 → 什么 → 和谁 → 在哪 → 什么时候。英语没有助词，靠词的位置和介词（with / at）说明角色；动词紧跟在主语后面。'
        }
      ]
    },
    {
      title: '一张图看懂英语时态',
      note: '横着看：同一个动词的五种样子。前四个规则，后四个不规则，要单独记。',
      blocks: [
        {
          t: 'table',
          tpl: '1fr 1fr 1.25fr 1fr 1.1fr',
          heads: ['原形', '他/她做', '正在做', '过去', '完成'],
          headTones: ['cyan', 'yellow', 'green', 'rose', 'pink'],
          colTones: ['cyan', 'yellow', 'green', 'rose', 'pink'],
          small: true,
          rows: [
            [['work', '工作'], ['works'], ['working'], ['worked'], ['worked']],
            [['play', '玩'], ['plays'], ['playing'], ['played'], ['played']],
            [['want', '想要'], ['wants'], ['wanting'], ['wanted'], ['wanted']],
            [['study', '学习'], ['studies'], ['studying'], ['studied'], ['studied']],
            [['go', '去'], ['goes'], ['going'], ['went'], ['gone']],
            [['eat', '吃'], ['eats'], ['eating'], ['ate'], ['eaten']],
            [['see', '看见'], ['sees'], ['seeing'], ['saw'], ['seen']],
            [['have', '有'], ['has'], ['having'], ['had'], ['had']]
          ]
        },
        { t: 'sub', text: '九种常用时态（以 eat 为例）' },
        {
          t: 'table',
          tpl: '2.4rem 1fr 1.25fr 1.15fr',
          heads: ['', '一般', '进行（正在）', '完成（已经）'],
          headTones: ['gray', 'cyan', 'green', 'pink'],
          colTones: ['gray', 'cyan', 'green', 'pink'],
          small: true,
          rows: [
            ['过去', ['I ate', '我吃了'], ['I was eating', '我当时在吃'], ['I had eaten', '我那时已吃过']],
            ['现在', ['I eat', '我吃（习惯）'], ['I am eating', '我正在吃'], ['I have eaten', '我已经吃了']],
            ['将来', ['I will eat', '我要吃'], ['I will be eating', '我到时在吃'], ['I will have eaten', '我到时已吃完']]
          ]
        },
        { t: 'sub', text: '否定和疑问：请 do 来帮忙' },
        {
          t: 'table',
          tpl: '2.4rem 1fr 1.2fr 1.2fr',
          heads: ['', '肯定', '否定', '疑问'],
          headTones: ['gray', 'cyan', 'pink', 'amber'],
          colTones: ['gray', 'cyan', 'pink', 'amber'],
          small: true,
          rows: [
            ['现在', ['I eat.', '我吃'], ["I don't eat.", '我不吃'], ['Do you eat?', '你吃吗'], ],
            ['他/她', ['He eats.', '他吃'], ["He doesn't eat.", '他不吃'], ['Does he eat?', '他吃吗']],
            ['过去', ['I ate.', '我吃了'], ["I didn't eat.", '我没吃'], ['Did you eat?', '你吃了吗']]
          ]
        }
      ]
    },
    {
      title: '英语的小零件',
      note: '每句话都会用到的词，数量不多。',
      blocks: [
        { t: 'sub', text: '人称（四种样子）' },
        {
          t: 'table',
          tpl: '2.4rem repeat(4, 1fr)',
          heads: ['', '做主语', '做宾语', '…的', '…的东西'],
          headTones: ['gray', 'rose', 'amber', 'sky', 'violet'],
          colTones: ['gray', 'rose', 'amber', 'sky', 'violet'],
          small: true,
          rows: [
            ['我', ['I'], ['me'], ['my'], ['mine']],
            ['你', ['you'], ['you'], ['your'], ['yours']],
            ['他', ['he'], ['him'], ['his'], ['his']],
            ['她', ['she'], ['her'], ['her'], ['hers']],
            ['它', ['it'], ['it'], ['its'], null],
            ['我们', ['we'], ['us'], ['our'], ['ours']],
            ['他们', ['they'], ['them'], ['their'], ['theirs']]
          ]
        },
        { t: 'sub', text: 'be 动词（是 / 在）' },
        {
          t: 'table',
          tpl: '2.4rem repeat(3, 1fr)',
          heads: ['', 'I', 'he / she / it', 'you / we / they'],
          headTones: ['gray', 'rose', 'sky', 'green'],
          colTones: ['gray', 'rose', 'sky', 'green'],
          small: true,
          rows: [
            ['现在', ['am'], ['is'], ['are']],
            ['过去', ['was'], ['was'], ['were']]
          ]
        },
        { t: 'sub', text: '这 / 那，冠词' },
        {
          t: 'table',
          tpl: 'repeat(4, 1fr)',
          colTones: ['sky', 'pink', 'green', 'amber'],
          rows: [
            [['this', '这个'], ['that', '那个'], ['these', '这些'], ['those', '那些']],
            [['a', '一个（辅音前）'], ['an', '一个（元音前）'], ['the', '那个特定的'], ['here / there', '这里 / 那里']]
          ]
        },
        { t: 'sub', text: '疑问词' },
        {
          t: 'table',
          tpl: 'repeat(4, 1fr)',
          colTones: ['sky', 'pink', 'green', 'amber'],
          rows: [
            [['what', '什么'], ['who', '谁'], ['where', '哪里'], ['when', '什么时候']],
            [['why', '为什么'], ['how', '怎么'], ['which', '哪个'], ['whose', '谁的']],
            [['how much', '多少钱'], ['how many', '多少个'], ['how long', '多久'], ['how often', '多常']]
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
            { p: 'in', rows: [['在…里面', 'The apple is in the box.', '苹果在盒子里。'], ['月份、年份', 'I was born in May.', '我五月出生。'], ['城市、国家', 'She lives in Tokyo.', '她住在东京。']] },
            { p: 'on', rows: [['在…上面', 'The book is on the table.', '书在桌子上。'], ['星期、日期', 'See you on Monday.', '周一见。']] },
            { p: 'at', rows: [['在某个点', 'I am at the station.', '我在车站。'], ['几点钟', 'We eat at seven.', '我们七点吃饭。']] },
            { p: 'to', rows: [['去往', 'I go to school.', '我去学校。'], ['给谁', 'Give it to me.', '把它给我。']] },
            { p: 'from', rows: [['从…来', 'I am from China.', '我来自中国。'], ['从…开始', 'I work from nine to five.', '我从九点工作到五点。']] },
            { p: 'with', rows: [['和谁一起', 'I live with my family.', '我和家人一起住。'], ['用什么', 'Write with a pen.', '用笔写。']] },
            { p: 'for', rows: [['为了、给', 'This is for you.', '这是给你的。'], ['持续多久', 'I waited for an hour.', '我等了一个小时。']] },
            { p: 'of', rows: [['…的', 'A cup of tea.', '一杯茶。'], ['其中的', 'One of my friends.', '我的朋友之一。']] },
            { p: 'by', rows: [['乘坐、通过', 'I go by bus.', '我坐公交车去。'], ['在…之前', 'Finish it by Friday.', '周五之前完成。']] },
            { p: 'about', rows: [['关于', 'Tell me about it.', '跟我说说这件事。'], ['大约', 'It takes about an hour.', '大约要一个小时。']] },
            { p: 'before / after', rows: [['之前 / 之后', 'Wash your hands before lunch.', '午饭前洗手。'], ['之后', 'Call me after work.', '下班后给我打电话。']] },
            { p: 'and / but / or', rows: [['和', 'Bread and milk.', '面包和牛奶。'], ['但是', 'It is small but good.', '它小但是好。'], ['或者', 'Tea or coffee?', '茶还是咖啡？']] }
          ]
        }
      ]
    }
  ]
};
