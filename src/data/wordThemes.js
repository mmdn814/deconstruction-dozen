// 3000 词主题舱。三种语言共用同一套主题；词表在 src/data/words/<语言>/<id>.txt
// 每行格式：词|读音|中文（读音与词相同时留空）
export const CORE_THEME_ID = 'core';

export const WORD_THEMES = [
  { id: 'greet', emoji: '👋', name: '寒暄与常用短语' },
  { id: 'func', emoji: '🧩', name: '核心功能词' },
  { id: 'numbers', emoji: '🔢', name: '数字金额与量词' },
  { id: 'time', emoji: '🕒', name: '时间日期与频率' },
  { id: 'people', emoji: '👨‍👩‍👧', name: '人与家庭称呼' },
  { id: 'body', emoji: '🧍', name: '身体与感受' },
  { id: 'verbs1', emoji: '🏃', name: '高频动作① 日常起居' },
  { id: 'verbs2', emoji: '🔄', name: '高频动作② 移动与变化' },
  { id: 'verbs3', emoji: '💭', name: '高频动作③ 思考与交流' },
  { id: 'adj', emoji: '🎨', name: '形容与感受' },
  { id: 'adv', emoji: '🔗', name: '副词与连接表达' },
  { id: 'food', emoji: '🍙', name: '食物与饮料' },
  { id: 'konbini', emoji: '🏮', name: '便利店与居酒屋餐饮', alt: '餐厅咖啡与点餐' },
  { id: 'shopping', emoji: '🛍️', name: '购物与金钱' },
  { id: 'transit', emoji: '🚆', name: '电车新干线与问路', alt: '交通出行与问路' },
  { id: 'places', emoji: '🏙️', name: '城市与场所' },
  { id: 'home', emoji: '🏠', name: '租房与家居' },
  { id: 'daily', emoji: '🧴', name: '日用品与药妆', alt: '日用品与洗护' },
  { id: 'clothes', emoji: '👕', name: '衣服与颜色' },
  { id: 'health', emoji: '🏥', name: '看病与药' },
  { id: 'work', emoji: '💼', name: '职场办公' },
  { id: 'school', emoji: '📚', name: '学习与语言' },
  { id: 'tech', emoji: '📱', name: '手机电脑网络' },
  { id: 'nature', emoji: '🌤️', name: '天气自然动植物' },
  { id: 'leisure', emoji: '🎒', name: '兴趣旅行娱乐' },
  { id: 'society', emoji: '🏛️', name: '社会新闻与手续' },
  { id: 'katakana', emoji: '🔤', name: '片假名外来语' }
];

export const parseWordFile = (raw) =>
  String(raw || '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const [w, r, cn] = l.split('|');
      return { w, r: r || '', cn: cn || '' };
    });
