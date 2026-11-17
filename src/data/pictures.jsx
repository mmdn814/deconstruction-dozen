import React from 'react';

// 看图小人短句：原创火柴人场景，教法参考 I. A. Richards 的分级直接教学法
// （先人称，再指认，再位置，最后用「将要 / 正在 / 完成」三连图教时态）。
// 图和句子均为本项目原创，未使用原书内容。

const INK = '#1e293b';
const ACCENT = '#2563eb';
const RED = '#dc2626';
const WOOD = '#b45309';

const line = { stroke: INK, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };

// 小人：x 为身体中线，头顶约在 y。l / r 是左右手相对肩膀的位置。
const Person = ({ x, y = 38, female = false, l = [-11, 24], r = [11, 24], color = INK, hat = false }) => {
  const s = { ...line, stroke: color };
  const sh = y + 20;
  return (
    <g>
      <circle cx={x} cy={y} r={9} {...s} fill="#fff" />
      {female && <path d={`M${x - 10} ${y + 3} Q${x - 13} ${y - 13} ${x} ${y - 11} Q${x + 13} ${y - 13} ${x + 10} ${y + 3}`} {...s} />}
      <path d={`M${x} ${y + 9} L${x} ${y + 46}`} {...s} />
      {female && <path d={`M${x} ${y + 30} L${x - 12} ${y + 52} L${x + 12} ${y + 52} Z`} {...s} fill="#fff" />}
      <path d={`M${x} ${y + (female ? 52 : 46)} L${x - 9} ${y + 72} M${x} ${y + (female ? 52 : 46)} L${x + 9} ${y + 72}`} {...s} />
      <path d={`M${x} ${sh} L${x + l[0]} ${sh + l[1]} M${x} ${sh} L${x + r[0]} ${sh + r[1]}`} {...s} />
      {hat && <Hat x={x} y={y - 8} />}
    </g>
  );
};

// 手的绝对坐标，方便把物品放进手里
const hand = (x, y, off) => [x + off[0], y + 20 + off[1]];

const Hat = ({ x, y, color = ACCENT }) => (
  <g stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d={`M${x - 8} ${y} Q${x - 8} ${y - 13} ${x} ${y - 13} Q${x + 8} ${y - 13} ${x + 8} ${y} Z`} fill="#dbeafe" />
    <path d={`M${x - 14} ${y} L${x + 14} ${y}`} fill="none" />
  </g>
);

const Apple = ({ x, y }) => (
  <g>
    <circle cx={x} cy={y} r={7} fill="#fecaca" stroke={RED} strokeWidth={3} />
    <path d={`M${x} ${y - 7} q3 -6 6 -5`} stroke="#15803d" strokeWidth={2.5} fill="none" strokeLinecap="round" />
  </g>
);

const Book = ({ x, y }) => (
  <g stroke="#7c3aed" strokeWidth={3} strokeLinejoin="round">
    <rect x={x - 11} y={y - 7} width={22} height={14} rx={2} fill="#ede9fe" />
    <path d={`M${x} ${y - 7} L${x} ${y + 7}`} />
  </g>
);

const Table = ({ x, y = 96, w = 70 }) => (
  <g stroke={WOOD} strokeWidth={3.5} strokeLinecap="round">
    <path d={`M${x - w / 2} ${y} L${x + w / 2} ${y}`} />
    <path d={`M${x - w / 2 + 7} ${y} L${x - w / 2 + 7} ${y + 30} M${x + w / 2 - 7} ${y} L${x + w / 2 - 7} ${y + 30}`} />
  </g>
);

const Box = ({ x, y = 112 }) => (
  <path
    d={`M${x - 20} ${y - 26} L${x - 20} ${y} L${x + 20} ${y} L${x + 20} ${y - 26}`}
    stroke={WOOD}
    strokeWidth={3.5}
    fill="#fef3c7"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const Ground = () => <path d="M10 126 L230 126" stroke="#cbd5e1" strokeWidth={2} strokeLinecap="round" />;

// 虚线箭头：表示「指着」或「将要移动到」
const Pointer = ({ from, to, color = ACCENT }) => {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 7;
  const p = (da) => `${x2 - h * Math.cos(a + da)} ${y2 - h * Math.sin(a + da)}`;
  return (
    <g stroke={color} strokeWidth={2.2} strokeLinecap="round" fill="none">
      <path d={`M${x1} ${y1} L${x2} ${y2}`} strokeDasharray="4 5" />
      <path d={`M${p(0.5)} L${x2} ${y2} L${p(-0.5)}`} />
    </g>
  );
};

// 高亮圈：这一格在说谁
const Halo = ({ x, y = 68, rx = 22, ry = 50 }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#dbeafe" opacity={0.55} />
);

const Frame = ({ children }) => (
  <svg viewBox="0 0 240 140" className="w-full h-auto" role="img">
    <rect x={1} y={1} width={238} height={138} rx={12} fill="#f8fafc" stroke="#e2e8f0" />
    <Ground />
    {children}
  </svg>
);

const SELF = [3, 6]; // 手指向自己胸口

// --- 27 幅场景 ---
const art = {
  i: () => (
    <Frame>
      <Halo x={120} />
      <Person x={120} r={SELF} />
    </Frame>
  ),
  you: () => (
    <Frame>
      <Halo x={165} />
      <Person x={75} r={[26, 2]} />
      <Person x={165} />
      <Pointer from={hand(75, 38, [30, 2])} to={[150, 58]} />
    </Frame>
  ),
  he: () => (
    <Frame>
      <Halo x={195} />
      <Person x={45} r={[24, 0]} />
      <Person x={85} />
      <Person x={195} />
      <Pointer from={hand(45, 38, [28, 0])} to={[178, 50]} />
    </Frame>
  ),
  she: () => (
    <Frame>
      <Halo x={195} />
      <Person x={45} r={[24, 0]} />
      <Person x={85} />
      <Person x={195} female />
      <Pointer from={hand(45, 38, [28, 0])} to={[178, 50]} />
    </Frame>
  ),
  we: () => (
    <Frame>
      <Halo x={110} rx={48} />
      <Person x={92} r={SELF} />
      <Person x={128} female l={[-3, 6]} />
    </Frame>
  ),
  they: () => (
    <Frame>
      <Halo x={178} rx={42} />
      <Person x={45} r={[24, 0]} />
      <Person x={160} />
      <Person x={196} female />
      <Pointer from={hand(45, 38, [28, 0])} to={[140, 54]} />
    </Frame>
  ),
  thisHat: () => (
    <Frame>
      <Person x={95} r={[22, 20]} />
      <Table x={140} />
      <Hat x={130} y={94} />
    </Frame>
  ),
  thatHat: () => (
    <Frame>
      <Person x={45} r={[24, 6]} />
      <Table x={190} w={60} />
      <Hat x={190} y={94} />
      <Pointer from={hand(45, 38, [28, 7])} to={[172, 84]} />
    </Frame>
  ),
  thisMan: () => (
    <Frame>
      <Halo x={140} />
      <Person x={95} r={[24, 4]} />
      <Person x={140} />
    </Frame>
  ),
  thisWoman: () => (
    <Frame>
      <Halo x={140} />
      <Person x={95} r={[24, 4]} />
      <Person x={140} female />
    </Frame>
  ),
  myHat: () => (
    <Frame>
      <Person x={120} l={SELF.map((v, i) => (i ? v : -v))} r={[20, 10]} />
      <Hat x={146} y={66} />
    </Frame>
  ),
  hisHat: () => (
    <Frame>
      <Person x={45} r={[24, 0]} />
      <Person x={185} r={[18, 10]} />
      <Hat x={209} y={66} />
      <Pointer from={hand(45, 38, [28, 0])} to={[190, 60]} />
    </Frame>
  ),
  iHere: () => (
    <Frame>
      <Person x={80} r={[8, 30]} />
      <Pointer from={[96, 96]} to={[86, 122]} />
      <circle cx={80} cy={126} r={12} fill="none" stroke={ACCENT} strokeWidth={2.5} />
      <Person x={195} y={52} color="#94a3b8" />
    </Frame>
  ),
  heThere: () => (
    <Frame>
      <Person x={50} r={[24, 2]} />
      <Person x={195} />
      <circle cx={195} cy={126} r={12} fill="none" stroke={ACCENT} strokeWidth={2.5} />
      <Pointer from={hand(50, 38, [28, 2])} to={[178, 60]} />
    </Frame>
  ),
  hatOnTable: () => (
    <Frame>
      <Table x={120} w={90} />
      <Hat x={120} y={94} />
    </Frame>
  ),
  appleInBox: () => (
    <Frame>
      <Box x={120} />
      <Apple x={120} y={103} />
    </Frame>
  ),
  hatOnHead: () => (
    <Frame>
      <Person x={120} hat r={SELF} />
    </Frame>
  ),
  bookInHand: () => (
    <Frame>
      <Person x={115} r={[22, 4]} />
      <Book x={140} y={56} />
    </Frame>
  ),
  takeWill: () => (
    <Frame>
      <Person x={80} r={[16, 14]} />
      <Table x={160} />
      <Hat x={160} y={94} />
      <Pointer from={hand(80, 38, [20, 16])} to={[146, 86]} />
    </Frame>
  ),
  takeNow: () => (
    <Frame>
      <Person x={120} r={[32, 20]} />
      <Table x={160} />
      <Hat x={154} y={80} />
      <path d="M154 86 L154 92" stroke={ACCENT} strokeWidth={2} strokeDasharray="2 3" />
    </Frame>
  ),
  takeDone: () => (
    <Frame>
      <Person x={95} r={[18, 12]} />
      <Hat x={115} y={68} />
      <Table x={175} />
    </Frame>
  ),
  putWill: () => (
    <Frame>
      <Person x={80} female r={[18, 8]} />
      <Book x={100} y={62} />
      <Table x={170} />
      <Pointer from={[112, 66]} to={[160, 88]} />
    </Frame>
  ),
  putNow: () => (
    <Frame>
      <Person x={122} female r={[32, 16]} />
      <Book x={158} y={76} />
      <Table x={170} />
      <path d="M158 85 L158 93" stroke="#7c3aed" strokeWidth={2} strokeDasharray="2 3" />
    </Frame>
  ),
  putDone: () => (
    <Frame>
      <Person x={95} female />
      <Table x={170} />
      <Book x={170} y={87} />
    </Frame>
  ),
  giveWill: () => (
    <Frame>
      <Person x={80} r={[16, 10]} />
      <Apple x={99} y={66} />
      <Person x={165} female />
      <Pointer from={[110, 66]} to={[148, 66]} />
    </Frame>
  ),
  giveNow: () => (
    <Frame>
      <Person x={90} r={[28, 6]} />
      <Apple x={122} y={62} />
      <Person x={155} female l={[-26, 8]} />
    </Frame>
  ),
  giveDone: () => (
    <Frame>
      <Person x={85} />
      <Person x={160} female l={[-18, 10]} />
      <Apple x={140} y={66} />
    </Frame>
  )
};

// 每句：text 显示用（日语为分词假名），say 朗读用，roma 罗马音，cn 中文（默认隐藏）
const S = (en, ja, jaSay, roma, es, cn) => ({
  en: { text: en, say: en },
  ja: { text: ja, say: jaSay, roma },
  es: { text: es, say: es },
  cn
});

export const PICTURE_STAGES = [
  {
    id: 'who',
    title: '① 谁',
    hint: '先认人：我、你、他、她、我们、他们。蓝色光圈里的就是这一格说的人。',
    scenes: [
      { art: 'i', ...S('I.', 'わたし。', '私。', 'watashi', 'Yo.', '我。') },
      { art: 'you', ...S('You.', 'あなた。', 'あなた。', 'anata', 'Tú.', '你。') },
      { art: 'he', ...S('He.', 'かれ。', '彼。', 'kare', 'Él.', '他。') },
      { art: 'she', ...S('She.', 'かのじょ。', '彼女。', 'kanojo', 'Ella.', '她。') },
      { art: 'we', ...S('We.', 'わたしたち。', '私たち。', 'watashitachi', 'Nosotros.', '我们。') },
      { art: 'they', ...S('They.', 'かれら。', '彼ら。', 'karera', 'Ellos.', '他们。') }
    ]
  },
  {
    id: 'what',
    title: '② 这是什么',
    hint: '手碰得到的是「这」，要伸手指过去的是「那」。再加上「我的 / 他的」。',
    scenes: [
      { art: 'thisHat', ...S('This is a hat.', 'これは ぼうしです。', 'これは帽子です。', 'kore wa bōshi desu', 'Esto es un sombrero.', '这是帽子。') },
      { art: 'thatHat', ...S('That is a hat.', 'あれは ぼうしです。', 'あれは帽子です。', 'are wa bōshi desu', 'Aquello es un sombrero.', '那是帽子。') },
      { art: 'thisMan', ...S('This is a man.', 'これは おとこの ひとです。', 'これは男の人です。', 'kore wa otoko no hito desu', 'Este es un hombre.', '这是一个男人。') },
      { art: 'thisWoman', ...S('This is a woman.', 'これは おんなの ひとです。', 'これは女の人です。', 'kore wa onna no hito desu', 'Esta es una mujer.', '这是一个女人。') },
      { art: 'myHat', ...S('This is my hat.', 'これは わたしの ぼうしです。', 'これは私の帽子です。', 'kore wa watashi no bōshi desu', 'Este es mi sombrero.', '这是我的帽子。') },
      { art: 'hisHat', ...S('That is his hat.', 'あれは かれの ぼうしです。', 'あれは彼の帽子です。', 'are wa kare no bōshi desu', 'Aquel es su sombrero.', '那是他的帽子。') }
    ]
  },
  {
    id: 'where',
    title: '③ 在哪里',
    hint: '这里、那里，在…上面、在…里面。看东西和桌子、盒子、手的关系。',
    scenes: [
      { art: 'iHere', ...S('I am here.', 'わたしは ここに います。', '私はここにいます。', 'watashi wa koko ni imasu', 'Yo estoy aquí.', '我在这里。') },
      { art: 'heThere', ...S('He is there.', 'かれは あそこに います。', '彼はあそこにいます。', 'kare wa asoko ni imasu', 'Él está allí.', '他在那里。') },
      { art: 'hatOnTable', ...S('The hat is on the table.', 'ぼうしは テーブルの うえに あります。', '帽子はテーブルの上にあります。', 'bōshi wa tēburu no ue ni arimasu', 'El sombrero está sobre la mesa.', '帽子在桌子上。') },
      { art: 'appleInBox', ...S('The apple is in the box.', 'りんごは はこの なかに あります。', 'りんごは箱の中にあります。', 'ringo wa hako no naka ni arimasu', 'La manzana está en la caja.', '苹果在盒子里。') },
      { art: 'hatOnHead', ...S('My hat is on my head.', 'ぼうしは わたしの あたまの うえに あります。', '帽子は私の頭の上にあります。', 'bōshi wa watashi no atama no ue ni arimasu', 'Mi sombrero está en mi cabeza.', '我的帽子在我头上。') },
      { art: 'bookInHand', ...S('The book is in my hand.', 'ほんは わたしの てに あります。', '本は私の手にあります。', 'hon wa watashi no te ni arimasu', 'El libro está en mi mano.', '书在我手里。') }
    ]
  },
  {
    id: 'action',
    title: '④ 动作三连图',
    hint: '同一个动作画三格：将要做、正在做、做完了。不讲语法，看图里手和东西的位置变化。',
    scenes: [
      { art: 'takeWill', phase: '将要', ...S('I will take the hat off the table.', 'わたしは ぼうしを とります。', '私は帽子を取ります。', 'watashi wa bōshi o torimasu', 'Voy a tomar el sombrero de la mesa.', '我要把帽子从桌上拿起来。') },
      { art: 'takeNow', phase: '正在', ...S('I am taking the hat off the table.', 'わたしは ぼうしを とって います。', '私は帽子を取っています。', 'watashi wa bōshi o totte imasu', 'Estoy tomando el sombrero de la mesa.', '我正在把帽子从桌上拿起来。') },
      { art: 'takeDone', phase: '完成', ...S('I took the hat off the table.', 'わたしは ぼうしを とりました。', '私は帽子を取りました。', 'watashi wa bōshi o torimashita', 'Tomé el sombrero de la mesa.', '我把帽子从桌上拿起来了。') },
      { art: 'putWill', phase: '将要', ...S('She will put the book on the table.', 'かのじょは ほんを テーブルに おきます。', '彼女は本をテーブルに置きます。', 'kanojo wa hon o tēburu ni okimasu', 'Ella va a poner el libro en la mesa.', '她要把书放到桌子上。') },
      { art: 'putNow', phase: '正在', ...S('She is putting the book on the table.', 'かのじょは ほんを テーブルに おいて います。', '彼女は本をテーブルに置いています。', 'kanojo wa hon o tēburu ni oite imasu', 'Ella está poniendo el libro en la mesa.', '她正在把书放到桌子上。') },
      { art: 'putDone', phase: '完成', ...S('She put the book on the table.', 'かのじょは ほんを テーブルに おきました。', '彼女は本をテーブルに置きました。', 'kanojo wa hon o tēburu ni okimashita', 'Ella puso el libro en la mesa.', '她把书放到桌子上了。') },
      { art: 'giveWill', phase: '将要', ...S('He will give the apple to her.', 'かれは かのじょに りんごを あげます。', '彼は彼女にりんごをあげます。', 'kare wa kanojo ni ringo o agemasu', 'Él va a darle la manzana a ella.', '他要把苹果给她。') },
      { art: 'giveNow', phase: '正在', ...S('He is giving the apple to her.', 'かれは かのじょに りんごを あげて います。', '彼は彼女にりんごをあげています。', 'kare wa kanojo ni ringo o agete imasu', 'Él le está dando la manzana a ella.', '他正在把苹果给她。') },
      { art: 'giveDone', phase: '完成', ...S('He gave the apple to her.', 'かれは かのじょに りんごを あげました。', '彼は彼女にりんごをあげました。', 'kare wa kanojo ni ringo o agemashita', 'Él le dio la manzana a ella.', '他把苹果给她了。') }
    ]
  }
];

export const SceneArt = ({ name }) => {
  const Draw = art[name];
  return Draw ? <Draw /> : null;
};
