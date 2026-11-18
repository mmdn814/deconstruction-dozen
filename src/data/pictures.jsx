import React from 'react';

// 看图小人短句：根据 I. A. Richards & Christine M. Gibson 经典著作《English Through Pictures - Book 1 & Book 2》
// 的分级直接教学法深度扩充构建（由代词指认、空间介词，到核心动词、时态三连图、时间、大小对比与日常场景）。
// 所有图景均为自绘轻量 SVG，三语（英、日、西、中）严格对齐。

const INK = '#1e293b';
const ACCENT = '#2563eb';
const RED = '#dc2626';
const WOOD = '#b45309';
const EMERALD = '#059669';

const line = { stroke: INK, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };

// 小人：x 为身体中线，头顶约在 y。l / r 是左右手相对肩膀的位置。
const Person = ({ x, y = 38, female = false, l = [-11, 24], r = [11, 24], color = INK, hat = false, sitting = false }) => {
  const s = { ...line, stroke: color };
  const sh = y + 20;
  return (
    <g>
      <circle cx={x} cy={y} r={9} {...s} fill="#fff" />
      {female && <path d={`M${x - 10} ${y + 3} Q${x - 13} ${y - 13} ${x} ${y - 11} Q${x + 13} ${y - 13} ${x + 10} ${y + 3}`} {...s} />}
      <path d={`M${x} ${y + 9} L${x} ${y + 46}`} {...s} />
      {female && <path d={`M${x} ${y + 30} L${x - 12} ${y + 52} L${x + 12} ${y + 52} Z`} {...s} fill="#fff" />}
      {!sitting ? (
        <path d={`M${x} ${y + (female ? 52 : 46)} L${x - 9} ${y + 72} M${x} ${y + (female ? 52 : 46)} L${x + 9} ${y + 72}`} {...s} />
      ) : (
        // 坐姿双腿弯曲
        <path d={`M${x} ${y + (female ? 52 : 46)} L${x + 16} ${y + 52} L${x + 16} ${y + 72}`} {...s} />
      )}
      <path d={`M${x} ${sh} L${x + l[0]} ${sh + l[1]} M${x} ${sh} L${x + r[0]} ${sh + r[1]}`} {...s} />
      {hat && <Hat x={x} y={y - 8} />}
    </g>
  );
};

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

const Book = ({ x, y, color = '#7c3aed' }) => (
  <g stroke={color} strokeWidth={3} strokeLinejoin="round">
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

const Chair = ({ x, y = 90 }) => (
  <g stroke={WOOD} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d={`M${x - 12} ${y - 25} L${x - 12} ${y + 36}`} />
    <path d={`M${x - 12} ${y} L${x + 14} ${y} L${x + 14} ${y + 36}`} />
  </g>
);

const Door = ({ x = 180, open = false }) => (
  <g stroke="#475569" strokeWidth={3} fill="#f1f5f9" strokeLinejoin="round">
    <rect x={x - 24} y={32} width={48} height={94} fill="#e2e8f0" />
    {!open ? (
      <>
        <rect x={x - 22} y={34} width={44} height={92} fill="#cbd5e1" />
        <circle cx={x + 14} cy={82} r={3} fill="#0f172a" />
      </>
    ) : (
      <>
        <path d={`M${x - 22} 34 L${x - 6} 44 L${x - 6} 122 L${x - 22} 126 Z`} fill="#94a3b8" />
        <path d={`M${x - 6} 44 L${x + 22} 34 L${x + 22} 126 L${x - 6} 122 Z`} fill="#f8fafc" />
      </>
    )}
  </g>
);

const Box = ({ x, y = 112, w = 40, h = 26 }) => (
  <path
    d={`M${x - w / 2} ${y - h} L${x - w / 2} ${y} L${x + w / 2} ${y} L${x + w / 2} ${y - h}`}
    stroke={WOOD}
    strokeWidth={3.5}
    fill="#fef3c7"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const Clock = ({ x = 120, y = 40, hour = 1, min = 0 }) => (
  <g stroke="#334155" strokeWidth={3} fill="#fff">
    <circle cx={x} cy={y} r={18} />
    <circle cx={x} cy={y} r={2} fill="#334155" />
    <line x1={x} y1={y} x2={x + 8} y2={y - 8} strokeWidth={2.5} strokeLinecap="round" />
    <line x1={x} y1={y} x2={x} y2={y - 12} strokeWidth={2} strokeLinecap="round" />
  </g>
);

const Ground = () => <path d="M10 126 L230 126" stroke="#cbd5e1" strokeWidth={2} strokeLinecap="round" />;

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

const SELF = [3, 6];

const Window = ({ x = 185, y = 35 }) => (
  <g stroke="#0284c7" strokeWidth={2.5} fill="#f0f9ff">
    <rect x={x - 22} y={y} width={44} height={52} rx={2} stroke="#334155" strokeWidth={3} fill="#e0f2fe" />
    <line x1={x} y1={y} x2={x} y2={y + 52} stroke="#334155" strokeWidth={2.5} />
    <line x1={x - 22} y1={y + 26} x2={x + 22} y2={y + 26} stroke="#334155" strokeWidth={2.5} />
    <ellipse cx={x - 8} cy={y + 14} rx={7} ry={4} fill="#fff" stroke="none" />
    <ellipse cx={x + 8} cy={y + 38} rx={6} ry={3} fill="#fff" stroke="none" />
  </g>
);

const FaceBase = ({ focus = null }) => (
  <g>
    <path d="M106 102 L106 126 M134 102 L134 126" stroke={INK} strokeWidth={3} strokeLinecap="round" />
    <path d="M80 126 Q120 120 160 126" stroke={INK} strokeWidth={3} strokeLinecap="round" fill="none" />
    <circle cx={120} cy={66} r={38} stroke={INK} strokeWidth={3} fill="#fff" />
    <path
      d="M82 60 Q80 26 120 24 Q160 26 158 60 Q142 38 120 40 Q98 38 82 60 Z"
      fill="#334155"
      stroke={INK}
      strokeWidth={1.5}
    />
    <path d="M82 60 C76 60 76 74 82 74" stroke={INK} strokeWidth={2.8} fill="#fff" strokeLinecap="round" />
    <path d="M158 60 C164 60 164 74 158 74" stroke={INK} strokeWidth={2.8} fill="#fff" strokeLinecap="round" />
    <path d="M98 56 Q106 53 114 56 M126 56 Q134 53 142 56" stroke={INK} strokeWidth={2.2} strokeLinecap="round" fill="none" />
    <ellipse cx={106} cy={64} rx={3.5} ry={4.5} fill={INK} />
    <ellipse cx={134} cy={64} rx={3.5} ry={4.5} fill={INK} />
    <path d="M120 63 L123 75 L117 76" stroke={INK} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M111 86 Q120 94 129 86" stroke={INK} strokeWidth={2.8} strokeLinecap="round" fill="none" />

    {focus === 'face' && (
      <ellipse cx={120} cy={72} rx={44} ry={44} fill="none" stroke={ACCENT} strokeWidth={2.5} strokeDasharray="4 4" />
    )}
    {focus === 'eyes' && (
      <>
        <circle cx={106} cy={64} r={9} fill="none" stroke={ACCENT} strokeWidth={2.5} />
        <circle cx={134} cy={64} r={9} fill="none" stroke={ACCENT} strokeWidth={2.5} />
      </>
    )}
    {focus === 'nose' && (
      <circle cx={120} cy={72} r={11} fill="none" stroke={ACCENT} strokeWidth={2.5} />
    )}
    {focus === 'mouth' && (
      <ellipse cx={120} cy={88} rx={16} ry={9} fill="none" stroke={ACCENT} strokeWidth={2.5} />
    )}
    {focus === 'ears' && (
      <>
        <circle cx={79} cy={67} r={9} fill="none" stroke={ACCENT} strokeWidth={2.5} />
        <circle cx={161} cy={67} r={9} fill="none" stroke={ACCENT} strokeWidth={2.5} />
      </>
    )}
  </g>
);

// --- 完整的 13 阶 Richards 图景库 ---
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
  thisBook: () => (
    <Frame>
      <Person x={95} r={[22, 14]} />
      <Book x={135} y={72} />
    </Frame>
  ),
  thatDoor: () => (
    <Frame>
      <Person x={65} r={[28, 4]} />
      <Door x={185} />
      <Pointer from={hand(65, 38, [32, 4])} to={[160, 68]} />
    </Frame>
  ),
  theseMen: () => (
    <Frame>
      <Halo x={155} rx={45} />
      <Person x={55} r={[24, 2]} />
      <Person x={135} />
      <Person x={175} />
    </Frame>
  ),
  theseWomen: () => (
    <Frame>
      <Halo x={155} rx={45} />
      <Person x={55} r={[24, 2]} />
      <Person x={135} female />
      <Person x={175} female />
    </Frame>
  ),
  theseHands: () => (
    <Frame>
      <Person x={120} l={[-24, -8]} r={[24, -8]} />
      <circle cx={96} cy={50} r={12} fill="none" stroke={ACCENT} strokeWidth={2} strokeDasharray="3 3" />
      <circle cx={144} cy={50} r={12} fill="none" stroke={ACCENT} strokeWidth={2} strokeDasharray="3 3" />
    </Frame>
  ),
  thoseBooks: () => (
    <Frame>
      <Person x={55} r={[26, 4]} />
      <Table x={175} />
      <Book x={165} y={88} />
      <Book x={185} y={88} color="#2563eb" />
      <Pointer from={hand(55, 38, [30, 4])} to={[150, 84]} />
    </Frame>
  ),
  hatOnHead: () => (
    <Frame>
      <Person x={120} hat r={SELF} />
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
  catUnderTable: () => (
    <Frame>
      <Table x={120} w={90} />
      {/* 简易火柴猫咪 */}
      <ellipse cx={120} cy={114} rx={14} ry={8} fill="#94a3b8" />
      <circle cx={136} cy={108} r={6} fill="#94a3b8" />
      <path d="M133 103 L136 98 L138 103 M137 103 L140 98 L142 103" stroke="#475569" strokeWidth={1.5} />
    </Frame>
  ),
  clockOnWall: () => (
    <Frame>
      <Clock x={120} y={45} />
      <Table x={120} y={106} w={80} />
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
  ),
  doorWill: () => (
    <Frame>
      <Person x={80} r={[26, 8]} />
      <Door x={180} open={false} />
      <Pointer from={[106, 66]} to={[158, 82]} />
    </Frame>
  ),
  doorNow: () => (
    <Frame>
      <Person x={135} r={[22, 12]} />
      <Door x={180} open={true} />
    </Frame>
  ),
  doorDone: () => (
    <Frame>
      <Person x={110} />
      <Door x={180} open={true} />
    </Frame>
  ),
  sitWill: () => (
    <Frame>
      <Person x={70} r={[18, 12]} />
      <Chair x={160} />
      <Pointer from={[88, 70]} to={[145, 88]} />
    </Frame>
  ),
  sitNow: () => (
    <Frame>
      <Person x={135} y={50} sitting={false} l={[8, 18]} />
      <Chair x={160} />
    </Frame>
  ),
  sitDone: () => (
    <Frame>
      <Person x={156} y={54} sitting={true} />
      <Chair x={160} />
    </Frame>
  ),
  clockOne: () => (
    <Frame>
      <Clock x={120} y={60} hour={1} min={0} />
    </Frame>
  ),
  clockTwoThirty: () => (
    <Frame>
      <Clock x={120} y={60} hour={2} min={30} />
    </Frame>
  ),
  bigBoxSmallBox: () => (
    <Frame>
      <Box x={80} y={116} w={60} h={46} />
      <Box x={165} y={116} w={24} h={18} />
    </Frame>
  ),
  longLineShortLine: () => (
    <Frame>
      <line x1={40} y1={50} x2={200} y2={50} stroke={ACCENT} strokeWidth={4} strokeLinecap="round" />
      <line x1={80} y1={90} x2={160} y2={90} stroke={RED} strokeWidth={4} strokeLinecap="round" />
    </Frame>
  ),
  personSleeping: () => (
    <Frame>
      <path d="M40 100 L200 100" stroke={WOOD} strokeWidth={4} />
      {/* 躺着的小人 */}
      <circle cx={70} cy={88} r={9} {...line} fill="#fff" />
      <line x1={79} y1={88} x2={165} y2={88} {...line} />
      <path d="M120 70 Q130 65 140 70 M150 55 Q160 50 170 55" stroke={ACCENT} strokeWidth={2} fill="none" />
    </Frame>
  ),
  sayHello: () => (
    <Frame>
      <Person x={80} r={[24, -10]} />
      <Person x={160} female />
      {/* 气泡 */}
      <path d="M100 38 Q115 20 135 25 Q145 35 130 45 L115 48 Z" fill="#dbeafe" stroke={ACCENT} strokeWidth={2} />
      <text x={112} y={34} fontSize="9" fontWeight="bold" fill={ACCENT}>Hi</text>
    </Frame>
  ),

  // --- 身体与五官 (Body Parts & Face) ---
  faceAll: () => (
    <Frame>
      <FaceBase focus="face" />
    </Frame>
  ),
  eyes: () => (
    <Frame>
      <FaceBase focus="eyes" />
    </Frame>
  ),
  nose: () => (
    <Frame>
      <FaceBase focus="nose" />
    </Frame>
  ),
  mouth: () => (
    <Frame>
      <FaceBase focus="mouth" />
    </Frame>
  ),
  ears: () => (
    <Frame>
      <FaceBase focus="ears" />
    </Frame>
  ),
  armsAndLegs: () => (
    <Frame>
      <Person x={120} y={32} l={[-34, 4]} r={[34, 4]} />
      <ellipse cx={86} cy={54} rx={16} ry={8} fill="none" stroke={ACCENT} strokeWidth={2} strokeDasharray="3 3" />
      <ellipse cx={154} cy={54} rx={16} ry={8} fill="none" stroke={ACCENT} strokeWidth={2} strokeDasharray="3 3" />
      <ellipse cx={111} cy={95} rx={9} ry={18} fill="none" stroke={EMERALD} strokeWidth={2} strokeDasharray="3 3" />
      <ellipse cx={129} cy={95} rx={9} ry={18} fill="none" stroke={EMERALD} strokeWidth={2} strokeDasharray="3 3" />
    </Frame>
  ),
  handsAndFeet: () => (
    <Frame>
      <Person x={120} y={32} l={[-24, -4]} r={[24, 20]} />
      <circle cx={96} cy={50} r={9} fill="none" stroke={ACCENT} strokeWidth={2.5} />
      <circle cx={129} cy={104} r={9} fill="none" stroke={RED} strokeWidth={2.5} />
      <Pointer from={[70, 40]} to={[88, 48]} />
      <Pointer from={[160, 115]} to={[138, 107]} color={RED} />
    </Frame>
  ),

  // --- 容器与进出介词 (Containers & In / Into / Out of) ---
  waterInGlass: () => (
    <Frame>
      <Table x={120} w={90} />
      <path d="M110 70 L113 96 L127 96 L130 70 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M111.5 82 L113 96 L127 96 L128.5 82 Z" fill="#38bdf8" opacity={0.65} />
      <ellipse cx={120} cy={82} rx={8.5} ry={2} fill="#7dd3fc" />
    </Frame>
  ),
  putIntoPocket: () => (
    <Frame>
      <Person x={120} y={38} l={[-12, 22]} r={[8, 12]} />
      <path d="M120 70 Q128 72 132 82 Q126 84 120 80" stroke="#475569" strokeWidth={2} fill="#e2e8f0" />
      <path d="M128 58 L128 72 M125 68 L128 73 L131 68" stroke={ACCENT} strokeWidth={2.2} strokeLinecap="round" />
    </Frame>
  ),
  handInPocket: () => (
    <Frame>
      <Person x={120} y={38} l={[-12, 22]} r={[6, 18]} />
      <path d="M120 70 Q128 72 132 82 Q126 84 120 80" stroke="#475569" strokeWidth={2} fill="#e2e8f0" />
    </Frame>
  ),
  takeOutOfPocket: () => (
    <Frame>
      <Person x={120} y={38} l={[-12, 22]} r={[10, 8]} />
      <path d="M120 70 Q128 72 132 82 Q126 84 120 80" stroke="#475569" strokeWidth={2} fill="#e2e8f0" />
      <path d="M128 72 L128 58 M125 62 L128 57 L131 62" stroke={ACCENT} strokeWidth={2.2} strokeLinecap="round" />
    </Frame>
  ),
  shipInBottle: () => (
    <Frame>
      <Table x={120} w={120} />
      <rect x={82} y={78} width={68} height={18} rx={7} fill="#f0f9ff" stroke="#0284c7" strokeWidth={2.5} />
      <rect x={150} y={82} width={12} height={10} fill="#f0f9ff" stroke="#0284c7" strokeWidth={2} />
      <rect x={160} y={83} width={6} height={8} fill={WOOD} stroke={WOOD} strokeWidth={1} rx={1} />
      <path d="M96 90 L126 90 L122 93 L100 93 Z" fill={WOOD} stroke={WOOD} strokeWidth={1.5} />
      <line x1={110} y1={90} x2={110} y2={82} stroke="#334155" strokeWidth={1.5} />
      <path d="M110 83 L120 88 L110 88 Z" fill="#fff" stroke="#334155" strokeWidth={1} />
    </Frame>
  ),

  // --- 走向与位移 (From / To / Off) ---
  doorToWindow: () => (
    <Frame>
      <Door x={45} open={true} />
      <Window x={195} y={45} />
      <Person x={115} y={40} l={[-16, 20]} r={[18, 16]} />
      <Pointer from={[65, 120]} to={[175, 120]} color={ACCENT} />
    </Frame>
  ),
  atWindow: () => (
    <Frame>
      <Window x={175} y={45} />
      <Person x={135} y={40} r={[24, 6]} />
      <Pointer from={[145, 60]} to={[165, 68]} color={ACCENT} />
    </Frame>
  ),
  offTheTable: () => (
    <Frame>
      <Table x={85} w={75} />
      <ellipse cx={170} cy={124} rx={22} ry={4} fill="#bae6fd" opacity={0.8} />
      <g transform="translate(162, 115) rotate(70)">
        <path d="M-8 -12 L-6 12 L6 12 L8 -12 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth={2.5} strokeLinejoin="round" />
      </g>
      <path d="M115 96 Q145 98 160 116" stroke="#94a3b8" strokeWidth={2} strokeDasharray="3 3" fill="none" />
    </Frame>
  )
};

export const SceneArt = ({ name }) => {
  const Comp = art[name] || art.i;
  return <Comp />;
};

// 格式生成辅助函数
const S = (en, ja, jaSay, roma, es, cn) => ({
  en: { text: en, say: en },
  ja: { text: ja, say: jaSay, roma },
  es: { text: es, say: es },
  cn
});

export const PICTURE_STAGES = [
  {
    id: 'who',
    title: '① 人称代词',
    hint: 'Richards 第一步：先认人（我、你、他、她、我们、他们），蓝色光圈即当前所指对象。',
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
    id: 'here_there',
    title: '② 空间位置 (这里/那里)',
    hint: '把人放进空间：我在“这里”，你在“那里”。直观感受近与远的方位。',
    scenes: [
      { art: 'i', ...S('I am here.', 'わたしは ここに います。', '私はここにいます。', 'watashi wa koko ni imasu', 'Yo estoy aquí.', '我在这里。') },
      { art: 'you', ...S('You are there.', 'あなたは そこに います。', 'あなたはそこにいます。', 'anata wa soko ni imasu', 'Tú estás allí.', '你在那里。') },
      { art: 'he', ...S('He is there.', 'かれは そこに います。', '彼はそこにいます。', 'kare wa soko ni imasu', 'Él está allí.', '他在那里。') },
      { art: 'she', ...S('She is there.', 'かのじょは そこに います。', '彼女はそこにいます。', 'kanojo wa soko ni imasu', 'Ella está allí.', '她在那里。') },
      { art: 'we', ...S('We are here.', 'わたしたちは ここに います。', '私たちはここにいます。', 'watashitachi wa koko ni imasu', 'Nosotros estamos aquí.', '我们在这里。') },
      { art: 'they', ...S('They are there.', 'かれらは そこに います。', '彼らはそこにいます。', 'karera wa soko ni imasu', 'Ellos están allí.', '他们在那儿。') }
    ]
  },
  {
    id: 'this_that',
    title: '③ 这是与那是 (单数指认)',
    hint: '指认身边的单数物品与人（This is... / That is...），不靠母语翻译直接对应物体。',
    scenes: [
      { art: 'thisMan', ...S('This is a man.', 'これは おとこのひと です。', 'これは男の人です。', 'kore wa otoko no hito desu', 'Este es un hombre.', '这是一位男人。') },
      { art: 'thisWoman', ...S('This is a woman.', 'これは おんなのひと です。', 'これは女の人です。', 'kore wa onna no hito desu', 'Esta es una mujer.', '这是一位女人。') },
      { art: 'thisHat', ...S('This is a hat.', 'これは ぼうし です。', 'これは帽子です。', 'kore wa boushi desu', 'Este es un sombrero.', '这是一顶帽子。') },
      { art: 'thatHat', ...S('That is a hat.', 'あれは ぼうし です。', 'あれは帽子です。', 'are wa boushi desu', 'Ese es un sombrero.', '那是顶帽子。') },
      { art: 'thisBook', ...S('This is a book.', 'これは ほん です。', '这是书。', 'kore wa hon desu', 'Este es un libro.', '这是一本书。') },
      { art: 'thatDoor', ...S('That is a door.', 'あれは ドア です。', 'あれはドアです。', 'are wa doa desu', 'Esa es una puerta.', '那是一扇门。') }
    ]
  },
  {
    id: 'these_those',
    title: '④ 这些与那些 (复数世界)',
    hint: '从单数扩展到复数：These are...（这些是）与 Those are...（那些是）。',
    scenes: [
      { art: 'theseMen', ...S('These are men.', 'これらは おとこのひとたち です。', 'これらは男の人たちです。', 'karera wa otoko no hitotachi desu', 'Estos son hombres.', '这些是男人。') },
      { art: 'theseWomen', ...S('These are women.', 'これらは おんなのひとたち です。', 'これらは女の人たちです。', 'korera wa onna no hitotachi desu', 'Estas son mujeres.', '这些是女人。') },
      { art: 'theseHands', ...S('These are hands.', 'これらは て です。', 'これらは手です。', 'korera wa te desu', 'Estas son manos.', '这些是双手。') },
      { art: 'thoseBooks', ...S('Those are books.', 'あれらは ほん です。', 'あれらは本です。', 'arera wa hon desu', 'Esos son libros.', '那些是书。') }
    ]
  },
  {
    id: 'prepositions',
    title: '⑤ 空间与介词 (在..上/里/下)',
    hint: '空间全景介词：On（在面上）、In（在空间里）、Under（在下方）。',
    scenes: [
      { art: 'hatOnHead', ...S('The hat is on his head.', 'ぼうしは あたまの うえに あります。', '帽子は頭の上にあります。', 'boushi wa atama no ue ni arimasu', 'El sombrero está en su cabeza.', '帽子戴在他的头上。') },
      { art: 'hatOnTable', ...S('The hat is on the table.', 'ぼうしは テーブルの うえに あります。', '帽子はテーブルの上にあります。', 'boushi wa teeburu no ue ni arimasu', 'El sombrero está sobre la mesa.', '帽子在桌子上。') },
      { art: 'appleInBox', ...S('The apple is in the box.', 'リンゴは はこの なかに あります。', 'リンゴは箱の中にあります。', 'ringo wa hako no naka ni arimasu', 'La manzana está en la caja.', '苹果在盒子里。') },
      { art: 'catUnderTable', ...S('The cat is under the table.', 'ねこは テーブルの したに います。', '猫はテーブルの下にいます。', 'neko wa teeburu no shita ni imasu', 'El gato está debajo de la mesa.', '猫在桌子底下。') },
      { art: 'clockOnWall', ...S('The clock is on the wall.', 'とけいは かべに あります。', '時計は壁にあります。', 'tokei wa kabe ni arimasu', 'El reloj está en la pared.', '钟挂在墙上。') }
    ]
  },
  {
    id: 'actions',
    title: '⑥ 核心互动动词 (拿/放/给)',
    hint: '英语三大根本及物动词：Take（拿起/带走）、Put（放下/放置）、Give（递给他人）。',
    scenes: [
      { art: 'takeDone', ...S('He takes the hat.', 'かれは ぼうしを とります。', '彼は帽子を取ります。', 'kare wa boushi o torimasu', 'Él toma el sombrero.', '他拿起了帽子。') },
      { art: 'putDone', ...S('She puts the book on the table.', 'かのじょは ほんを テーブルに おきます。', '彼女は本をテーブルに置きます。', 'kanojo wa hon o teeburu ni okimasu', 'Ella pone el libro sobre la mesa.', '她把书放在桌上。') },
      { art: 'giveDone', ...S('He gives the apple to her.', 'かれは リンゴを かのじょに あげます。', '彼はリンゴを彼女にあげます。', 'kare wa ringo o kanojo ni agemasu', 'Él le da la manzana a ella.', '他把苹果递给她。') }
    ]
  },
  {
    id: 'tenses',
    title: '⑦ 时态三连图 (将要/正在/已完成)',
    hint: 'Richards 核心发明：不用讲抽象语法，看三连图秒懂「将要(Going to) ➔ 正在(Doing) ➔ 完成(Done)」。',
    scenes: [
      { art: 'takeWill', phase: '将要', ...S('He is going to take the hat.', 'かれは ぼうしを とるつもりです。', '彼は帽子を取るつもりです。', 'kare wa boushi o toru tsumori desu', 'Él va a tomar el sombrero.', '他打算拿起帽子。') },
      { art: 'takeNow', phase: '正在', ...S('He is taking the hat.', 'かれは ぼうしを とっています。', '彼は帽子を取っています。', 'kare wa boushi o totte imasu', 'Él está tomando el sombrero.', '他正在拿帽子。') },
      { art: 'takeDone', phase: '完成', ...S('He has taken the hat.', 'かれは ぼうしを とりました。', '彼は帽子を取りました。', 'kare wa boushi o torimashita', 'Él ha tomado el sombrero.', '他已经拿起了帽子。') },
      { art: 'doorWill', phase: '将要', ...S('He is going to open the door.', 'かれは ドアを あけるつもりです。', '彼はドアを開けるつもりです。', 'kare wa doa o akeru tsumori desu', 'Él va a abrir la puerta.', '他正要去开门。') },
      { art: 'doorNow', phase: '正在', ...S('He is opening the door.', 'かれは ドアを あけています。', '彼はドアを開けています。', 'kare wa doa o akete imasu', 'Él está abriendo la puerta.', '他正在开门。') },
      { art: 'doorDone', phase: '完成', ...S('He has opened the door.', 'かれは ドアを あけました。', '彼はドアを開けました。', 'kare wa doa o akemashita', 'Él ha abierto la puerta.', '他已经把门打开了。') },
      { art: 'sitWill', phase: '将要', ...S('He is going to sit down.', 'かれは すわるつもりです。', '彼は座るつもりです。', 'kare wa suwaru tsumori desu', 'Él va a sentarse.', '他打算坐下。') },
      { art: 'sitNow', phase: '正在', ...S('He is sitting down.', 'かれは すわろうとしています。', '彼は座ろうとしています。', 'kare wa suwarou to shite imasu', 'Él se está sentando.', '他正在坐下去。') },
      { art: 'sitDone', phase: '完成', ...S('He is sitting on the chair.', 'かれは いすに すわっています。', '彼は椅子に座っています。', 'kare wa isu ni suwatte imasu', 'Él está sentado en la silla.', '他正坐在椅子上。') }
    ]
  },
  {
    id: 'time',
    title: '⑧ 时间与钟表',
    hint: 'Book 2 进阶：时钟指认与日常时间概念。',
    scenes: [
      { art: 'clockOne', ...S('What time is it?', 'いま なんじ ですか？', '今何時ですか？', 'ima nanji desu ka', '¿Qué hora es?', '现在几点了？') },
      { art: 'clockOne', ...S('It is one o\'clock.', 'いちじ です。', '一時です。', 'ichiji desu', 'Es la una en punto.', '现在是一点整。') },
      { art: 'clockTwoThirty', ...S('It is half past two.', 'にじはん です。', '二時半です。', 'niji han desu', 'Son las dos y media.', '现在是两点半。') }
    ]
  },
  {
    id: 'sizes',
    title: '⑨ 尺寸与对比 (大与小/长与短)',
    hint: '通过并排视觉对照学习物理特征形容词。',
    scenes: [
      { art: 'bigBoxSmallBox', ...S('This box is big. That box is small.', 'この はこは おおきいです。あの はこは ちいさいです。', 'この箱は大きいです。あの箱は小さいです。', 'kono hako wa ookii desu. ano hako wa chiisai desu', 'Esta caja es grande. Esa caja es pequeña.', '这个盒子大，那个盒子小。') },
      { art: 'longLineShortLine', ...S('This line is long. That line is short.', 'この せんは ながいですが、あの せんは みじかいです。', 'この線は長いですが、あの線は短いです。', 'kono sen wa nagai desu', 'Esta línea es larga. Esa línea es corta.', '这条线长，那条线短。') }
    ]
  },
  {
    id: 'routines',
    title: '⑩ 日常生活与打招呼',
    hint: '人的一天：睡眠起居与语言交流。',
    scenes: [
      { art: 'personSleeping', ...S('He is sleeping.', 'かれは ねています。', '彼は寝ています。', 'kare wa nete imasu', 'Él está durmiendo.', '他正在睡觉。') },
      { art: 'sayHello', ...S('He says hello to her.', 'かれは かのじょに あいさつします。', '彼は彼女に挨拶します。', 'kare wa kanojo ni aisatsu shimasu', 'Él le dice hola a ella.', '他向她打招呼。') }
    ]
  },
  {
    id: 'body_parts',
    title: '⑪ 身体与五官',
    hint: 'Richards 原书核心：从五官、头部到四肢（Face, Eyes, Nose, Mouth, Arms, Legs, Feet）。',
    scenes: [
      { art: 'faceAll', ...S('This is his face.', 'これは かれの かお です。', 'これは彼の顔です。', 'kore wa kare no kao desu', 'Esta es su cara.', '这是他的脸。') },
      { art: 'eyes', ...S('These are his eyes.', 'これらは かれの め です。', 'これらは彼の目です。', 'korera wa kare no me desu', 'Estos son sus ojos.', '这些是他的眼睛。') },
      { art: 'nose', ...S('This is his nose. It is between his eyes.', 'これは かれの はな です。めの あいだに あります。', 'これは彼の鼻です。目の間にあります。', 'kore wa kare no hana desu. me no aida ni arimasu', 'Esta es su nariz. Está entre sus ojos.', '这是他的鼻子，在两眼之间。') },
      { art: 'mouth', ...S('This is his mouth. It is under his nose.', 'これは かれの くち です。はなの したに あります。', '这是他的嘴巴。鼻の下にあります。', 'kore wa kare no kuchi desu. hana no shita ni arimasu', 'Esta es su boca. Está debajo de su nariz.', '这是他的嘴巴，在鼻子下方。') },
      { art: 'ears', ...S('These are his ears.', 'これらは かれの みみ です。', 'これらは彼の耳です。', 'korera wa kare no mimi desu', 'Estas son sus orejas.', '这些是他的耳朵。') },
      { art: 'armsAndLegs', ...S('These are his arms, and these are his legs.', 'これらは かれの うで で、これらは あし です。', 'これらは彼の腕で、これらは足です。', 'korera wa kare no ude de, korera wa ashi desu', 'Estos son sus brazos, y estas son sus piernas.', '这些是他的手臂，这些是他的腿。') },
      { art: 'handsAndFeet', ...S('This is his hand. That is his foot.', 'これは かれの て です。あれは あし です。', 'これは彼の手です。あれは足です。', 'kore wa kare no te desu. are wa ashi desu', 'Esta es su mano. Ese es su pie.', '这是他的手，那是他的脚。') }
    ]
  },
  {
    id: 'in_into_out',
    title: '⑫ 容器与进出介词',
    hint: '动态进出与空间容纳：In（在里面）、Into（放入/进入）、Out of（拿出来）。',
    scenes: [
      { art: 'waterInGlass', ...S('The water is in the glass.', 'みずは コップの なかに あります。', '水はコップの中にあります。', 'mizu wa koppu no naka ni arimasu', 'El agua está en el vaso.', '水在玻璃杯里。') },
      { art: 'putIntoPocket', phase: '动作中', ...S('He is putting his hand into his pocket.', 'かれは てを ポケットに いれています。', '彼は手をポケットに入れています。', 'kare wa te o poketto ni irete imasu', 'Él está metiendo la mano en el bolsillo.', '他正把手伸进口袋里。') },
      { art: 'handInPocket', phase: '状态', ...S('His hand is in his pocket.', 'かれの ては ポケットの なかに あります。', '彼の手はポケットの中にあります。', 'kare no te wa poketto no naka ni arimasu', 'Su mano está en su bolsillo.', '他的手在口袋里。') },
      { art: 'takeOutOfPocket', phase: '动作中', ...S('He is taking his hand out of his pocket.', 'かれは てを ポケットから だしています。', '彼は手をポケットから出しています。', 'kare wa te o poketto kara dashite imasu', 'Él está sacando la mano de su bolsillo.', '他正把手从口袋里拿出来。') },
      { art: 'shipInBottle', ...S('This ship is in the bottle.', 'この ふねは ビンの なかに あります。', 'この船は瓶の中にあります。', 'kono fune wa bin no naka ni arimasu', 'Este barco está en la botella.', '这艘小船在瓶子里面。') }
    ]
  },
  {
    id: 'motion_from_to',
    title: '⑬ 空间位移与走向',
    hint: '起点与终点：From（从某处）与 To（到某处），空间脱离 Off。',
    scenes: [
      { art: 'doorToWindow', ...S('He is walking from the door to the window.', 'かれは ドアから まどへ あるいています。', '彼はドアから窓へ歩いています。', 'kare wa doa kara mado e aruite imasu', 'Él está caminando desde la puerta hacia la ventana.', '他正从门口走向窗前。') },
      { art: 'atWindow', ...S('He is at the window.', 'かれは まどの ところに います。', '彼は窓の所にいます。', 'kare wa mado no tokoro ni imasu', 'Él está en la ventana.', '他站在窗户旁。') },
      { art: 'offTheTable', ...S('The glass is off the table. It is on the floor.', 'コップは テーブルから おちて、ゆかに あります。', 'コップはテーブルから落ちて、床にあります。', 'koppu wa teeburu kara ochite, yuka ni arimasu', 'El vaso se cayó de la mesa. Está en el suelo.', '玻璃杯离开了桌子，掉在了地板上。') }
    ]
  }
];
