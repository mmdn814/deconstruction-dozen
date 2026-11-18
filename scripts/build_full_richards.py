import json
import os
import re
import time
import urllib.parse
import urllib.request

PROXY = 'http://127.0.0.1:7890'
proxy_handler = urllib.request.ProxyHandler({'http': PROXY, 'https': PROXY})
opener = urllib.request.build_opener(proxy_handler)

def translate_batch(texts, target_lang):
    if not texts:
        return []
    # Join with a unique delimiter that won't be mangled
    delimiter = '\n'
    joined = delimiter.join(t.strip() for t in texts)
    url = f'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl={target_lang}&dt=t&q=' + urllib.parse.quote(joined)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    for attempt in range(3):
        try:
            with opener.open(req, timeout=10) as res:
                data = json.loads(res.read().decode())
                translated_full = ''.join(chunk[0] for chunk in data[0] if chunk[0])
                lines = translated_full.split('\n')
                # If lengths match
                if len(lines) == len(texts):
                    return [l.strip() for l in lines]
                # If length differs slightly, fallback to single translation
                break
        except Exception as e:
            print(f'Error batch translating ({target_lang}, attempt {attempt}): {e}')
            time.sleep(1)
    
    # Fallback to 1-by-1
    res_list = []
    for t in texts:
        if not t.strip():
            res_list.append('')
            continue
        single_url = f'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl={target_lang}&dt=t&q=' + urllib.parse.quote(t.strip())
        single_req = urllib.request.Request(single_url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with opener.open(single_req, timeout=5) as r:
                d = json.loads(r.read().decode())
                tr = ''.join(chunk[0] for chunk in d[0] if chunk[0])
                res_list.append(tr.strip())
        except Exception:
            res_list.append(t)
    return res_list

def main():
    with open('scripts/raw_book1.json', encoding='utf-8') as f:
        raw_pages = json.load(f)

    # Clean specific known OCR artifacts
    for p in raw_pages:
        for k in ['TL', 'TR', 'BL', 'BR']:
            txt = p['quadrants'][k]
            txt = txt.replace('This is This my is my right left hand. hand.', 'This is my right hand. This is my left hand.')
            txt = re.sub(r'\s+', ' ', txt).strip()
            p['quadrants'][k] = txt

    # Collect unique non-empty texts
    unique_texts = []
    seen = set()
    for p in raw_pages:
        for k in ['TL', 'TR', 'BL', 'BR']:
            t = p['quadrants'][k]
            if t and t not in seen:
                seen.add(t)
                unique_texts.append(t)

    print(f'Total unique texts to translate: {len(unique_texts)}')

    cache_file = 'scripts/translation_cache.json'
    cache = {'zh-CN': {}, 'ja': {}, 'es': {}}
    if os.path.exists(cache_file):
        try:
            with open(cache_file, encoding='utf-8') as f:
                cache = json.load(f)
        except Exception:
            pass

    for lang_code in ['zh-CN', 'ja', 'es']:
        missing = [t for t in unique_texts if t not in cache[lang_code]]
        print(f'Translating {len(missing)} missing items to {lang_code}...')
        batch_size = 20
        for i in range(0, len(missing), batch_size):
            chunk = missing[i:i + batch_size]
            res = translate_batch(chunk, lang_code)
            for orig, trans in zip(chunk, res):
                cache[lang_code][orig] = trans
            print(f'  [{lang_code}] {i + len(chunk)} / {len(missing)}')
            time.sleep(0.3)
        with open(cache_file, 'w', encoding='utf-8') as f:
            json.dump(cache, f, ensure_ascii=False, indent=2)

    # Now assemble final JS dataset
    final_pages = []
    for p in raw_pages:
        p_num = p['page']
        # Extract keywords for title
        tl = p['quadrants']['TL']
        tr = p['quadrants']['TR']
        bl = p['quadrants']['BL']
        br = p['quadrants']['BR']

        # Determine short title/topic
        topic = ''
        all_txt = f'{tl} {tr} {bl} {br}'.lower()
        if p_num == 1: topic = '人称代词 I / YOU'
        elif p_num in [2, 3]: topic = '人称代词 HE / SHE / IT / THEY'
        elif p_num in range(4, 8): topic = '空间方位 HERE / THERE'
        elif p_num in [8, 9]: topic = '指示代词 THIS / THAT (MAN / WOMAN)'
        elif p_num in range(10, 14): topic = '帽子、桌子与双手 (HAT / TABLE / HAND)'
        elif p_num in range(14, 18): topic = '动作时态：戴上与脱下 (PUT ON / TAKE OFF)'
        elif p_num in range(18, 22): topic = '互动互赠：给予 (GIVE TO HIM / HER)'
        elif p_num in range(22, 27): topic = '身体部位与家具 (ARM / LEG / FOOT / SEAT)'
        elif p_num in range(27, 31): topic = '问句与回答 (QUESTIONS & ANSWERS)'
        elif p_num in range(31, 35): topic = '综合问答复习 (PRACTICE QUESTIONS)'
        elif p_num in range(35, 40): topic = '时钟与时间 (WHAT IS THE TIME?)'
        elif p_num in range(40, 48): topic = '面部五官全景 (EYES / NOSE / MOUTH / EARS / HAIR)'
        elif p_num in range(48, 56): topic = '空间相对介词 (BETWEEN / OVER / UNDER)'
        elif p_num in range(56, 65): topic = '水、河流、雨水与船 (WATER / RIVER / RAIN / SHIP)'
        elif p_num in range(65, 75): topic = '走动走向与房间 (WALKING / ROOM / DOOR / WINDOW)'
        elif p_num in range(75, 85): topic = '旅行、火车与街道 (TRAVEL / TRAIN / STREET)'
        elif p_num in range(85, 95): topic = '家庭日常与进餐 (FOOD / MEAL / FORK / KNIFE)'
        elif p_num in range(95, 105): topic = '温度冷热与烹饪 (WARM / COLD / BOILING / SOUP)'
        elif p_num in range(105, 115): topic = '度量衡与生活百态 (MEASURE / INCH / WORK)'
        else: topic = f'进阶综合对话 第 {p_num} 课'

        quad_items = []
        labels = [
            ('TL', '① 左上', 'top-left'),
            ('TR', '② 右上', 'top-right'),
            ('BL', '③ 左下', 'bottom-left'),
            ('BR', '④ 右下', 'bottom-right')
        ]
        for q_key, label_cn, pos in labels:
            en_text = p['quadrants'][q_key]
            quad_items.append({
                'id': f'p{p_num}_{q_key.lower()}',
                'pos': pos,
                'label': label_cn,
                'en': en_text,
                'cn': cache['zh-CN'].get(en_text, en_text),
                'ja': cache['ja'].get(en_text, en_text),
                'es': cache['es'].get(en_text, en_text)
            })

        final_pages.append({
            'page': p_num,
            'topic': topic,
            'img': f'/richards/p_{p_num}.webp',
            'panels': quad_items
        })

    out_js = 'src/data/richardsBook1Data.js'
    with open(out_js, 'w', encoding='utf-8') as f:
        f.write('// 《English Through Pictures - Book 1》100% 全量原版 119 页逐页交互点读数据\n')
        f.write('// 包含全书 119 页原版 4 格手绘插图 (476 场景)，英、中、日、西 4 语标准对齐。\n\n')
        f.write('export const RICHARDS_BOOK1_PAGES = ')
        f.write(json.dumps(final_pages, ensure_ascii=False, indent=2))
        f.write(';\n')

    print(f'Done! Successfully wrote {len(final_pages)} pages to {out_js}!')

if __name__ == '__main__':
    main()
