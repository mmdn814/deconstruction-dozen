import asyncio
import os
import sys
import json
import re
import argparse
import subprocess
import edge_tts

VOICES = {
    'en': 'en-US-JennyNeural',
    'ja': 'ja-JP-NanamiNeural',
    'es': 'es-MX-DaliaNeural'
}

PROXY = 'http://127.0.0.1:7890'

semaphore = asyncio.Semaphore(6)

async def synthesize_one(text, voice, out_path, lang):
    clean_text = str(text or '').strip()
    clean_text = re.sub(r'\(.*?\)|（.*?）', '', clean_text).strip()
    if not clean_text or clean_text.startswith('（'):
        return

    if os.path.exists(out_path) and os.path.getsize(out_path) > 200:
        return

    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    if lang == 'ja':
        clean_text = re.sub(r'([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF])\s+([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF])', r'\1\2', clean_text)

    for attempt in range(3):
        async with semaphore:
            try:
                communicate = edge_tts.Communicate(clean_text, voice, proxy=PROXY)
                await communicate.save(out_path)
                return
            except Exception as e:
                if attempt == 2:
                    print(f"[FAIL] {out_path} ({text}): {e}")
                await asyncio.sleep(1 + attempt)

async def generate_core_sentences():
    print("Generating Core Sentences & Workplace Audio...")
    p = subprocess.run(['node', '-e', """
const fs = require('fs');
let code = fs.readFileSync('src/data/sentences.js', 'utf8');
code = code.replace(/export const /g, 'const ');
code += '; console.log(JSON.stringify(sentencesByLang));';
eval(code);
"""], capture_output=True, text=True)
    if p.returncode == 0:
        sentences_by_lang = json.loads(p.stdout)
        tasks = []
        for lang, items in sentences_by_lang.items():
            if lang not in VOICES:
                continue
            voice = VOICES[lang]
            for item in items:
                sid = item['id']
                core_text = "".join(item['en']) if lang == 'ja' else " ".join(item['en'])
                workplace_text = item.get('workplace', '')

                core_path = f"public/audio/core/{lang}/core_{sid}.mp3"
                work_path = f"public/audio/core/{lang}/workplace_{sid}.mp3"

                tasks.append(synthesize_one(core_text, voice, core_path, lang))
                if workplace_text:
                    tasks.append(synthesize_one(workplace_text, voice, work_path, lang))

        await asyncio.gather(*tasks)
        print(f"Core Sentences Done! Total: {len(tasks)}")
    else:
        print("Failed to parse sentences.js:", p.stderr)

async def generate_map_audio():
    print("Generating Language Map Ladder Sentences Audio...")
    tasks = []

    en_ladder = [
        "I drank beer.",
        "I drank cold beer.",
        "I drank cold beer with a friend.",
        "I drank cold beer with a friend at the bar.",
        "I drank cold beer with a friend at the bar at 8 pm."
    ]
    for idx, s in enumerate(en_ladder):
        tasks.append(synthesize_one(s, VOICES['en'], f"public/audio/map/en/ladder_{idx}.mp3", 'en'))

    ja_ladder = [
        "私は 飲みました。",
        "私は ビールを 飲みました。",
        "私は 冷たいビールを 飲みました。",
        "私は 友達と 冷たいビールを 飲みました。",
        "私は バーで 友達と 冷たいビールを 飲みました。",
        "私は 8時に バーで 友達と 冷たいビールを 飲みました。",
        "私は 昨日 8時に バーで 友達と 冷たいビールを 飲みました。"
    ]
    for idx, s in enumerate(ja_ladder):
        tasks.append(synthesize_one(s, VOICES['ja'], f"public/audio/map/ja/ladder_{idx}.mp3", 'ja'))

    es_ladder = [
        "Bebí cerveza.",
        "Bebí cerveza fría.",
        "Bebí cerveza fría con un amigo.",
        "Bebí cerveza fría con un amigo en el bar.",
        "Bebí cerveza fría con un amigo en el bar a las 8 pm."
    ]
    for idx, s in enumerate(es_ladder):
        tasks.append(synthesize_one(s, VOICES['es'], f"public/audio/map/es/ladder_{idx}.mp3", 'es'))

    await asyncio.gather(*tasks)
    print(f"Map Ladder Sentences Audio Done! Total: {len(tasks)}")

async def generate_zerotoone_sentences():
    print("Generating ZeroToOne Minimal Pair Sentences...")
    tasks = []
    p = subprocess.run(['node', '-e', """
const fs = require('fs');
let code = fs.readFileSync('src/data/zeroToOne.js', 'utf8');
code = code.replace(/export const /g, 'const ');
code += '; const out = {}; for (let k of ["en", "ja", "es"]) { out[k] = (zeroToOneDataByLang[k].minimalPairs || []).map(p => p.sentence); }; console.log(JSON.stringify(out));';
eval(code);
"""], capture_output=True, text=True)
    if p.returncode == 0:
        data = json.loads(p.stdout)
        for lang, sentences in data.items():
            voice = VOICES[lang]
            for idx, s in enumerate(sentences):
                tasks.append(synthesize_one(s, voice, f"public/audio/zerotoone/{lang}/pair_{idx}.mp3", lang))
        await asyncio.gather(*tasks)
        print(f"ZeroToOne Sentences Done! Total: {len(tasks)}")

async def generate_stages_audio():
    print("Generating PICTURE_STAGES Audio...")
    with open('src/data/pictures.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find S(...) invocations: S('en', 'ja', 'jaSay', 'roma', 'es', 'cn')
    # e.g. S('I am here.', '...', '...', '...', 'Yo estoy aquí.', '...')
    pattern = r"S\(\s*'(.*?)',\s*'(.*?)',\s*'(.*?)',\s*'(.*?)',\s*'(.*?)',\s*'(.*?)'\s*\)"
    matches = re.findall(pattern, content)
    print(f"Found {len(matches)} scenes in pictures.jsx")

    tasks = []
    for idx, (en, ja, ja_say, roma, es, cn) in enumerate(matches):
        tasks.append(synthesize_one(en, VOICES['en'], f"public/audio/stages/en/scene_{idx}.mp3", 'en'))
        tasks.append(synthesize_one(ja_say or ja, VOICES['ja'], f"public/audio/stages/ja/scene_{idx}.mp3", 'ja'))
        tasks.append(synthesize_one(es, VOICES['es'], f"public/audio/stages/es/scene_{idx}.mp3", 'es'))

    await asyncio.gather(*tasks)
    print(f"Stages Audio Done! Total: {len(tasks)}")

async def generate_richards(start_page=1, end_page=119):
    print(f"Generating Richards Book 1 Audio (Pages {start_page} to {end_page})...")
    with open('src/data/richardsBook1Data.js', 'r', encoding='utf-8') as f:
        text = f.read()

    start = text.find('[')
    end = text.rfind(']') + 1
    pages = json.loads(text[start:end])

    tasks = []
    for page in pages:
        p_num = page['page']
        if p_num < start_page or p_num > end_page:
            continue
        for panel in page['panels']:
            pid = panel['id']
            for lang in ['en', 'ja', 'es']:
                sentence = panel.get(lang, '')
                voice = VOICES[lang]
                out_path = f"public/audio/richards/{lang}/{pid}.mp3"
                tasks.append(synthesize_one(sentence, voice, out_path, lang))

    print(f"Queued {len(tasks)} panels for synthesis...")
    batch_size = 60
    for i in range(0, len(tasks), batch_size):
        chunk = tasks[i:i+batch_size]
        await asyncio.gather(*chunk)
        print(f"Progress: {min(i+batch_size, len(tasks))}/{len(tasks)} files processed")

    print(f"Richards Audio Pages {start_page}..{end_page} Completed!")

async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--core', action='store_true')
    parser.add_argument('--map', action='store_true')
    parser.add_argument('--zerotoone', action='store_true')
    parser.add_argument('--stages', action='store_true')
    parser.add_argument('--richards', action='store_true')
    parser.add_argument('--start-page', type=int, default=1)
    parser.add_argument('--end-page', type=int, default=119)
    parser.add_argument('--all', action='store_true')
    args = parser.parse_args()

    if args.core or args.all:
        await generate_core_sentences()
    if args.map or args.all:
        await generate_map_audio()
    if args.zerotoone or args.all:
        await generate_zerotoone_sentences()
    if args.stages or args.all:
        await generate_stages_audio()
    if args.richards or args.all:
        await generate_richards(args.start_page, args.end_page)

if __name__ == '__main__':
    asyncio.run(main())
