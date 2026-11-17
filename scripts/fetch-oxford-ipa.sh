#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/public/audio/ipa"
mkdir -p "$DIR"

PROXY="http://127.0.0.1:7890"

# List of all 44 standard Oxford IPA isolation files
FILES=(
  "iː_isolation.mp3"
  "ɪ_isolation.mp3"
  "e_isolation.mp3"
  "æ_isolation.mp3"
  "ɜː_isolation.mp3"
  "ə_isolation.mp3"
  "ʌ_isolation.mp3"
  "ɑː_isolation.mp3"
  "ɔː_isolation.mp3"
  "ɒ_isolation.mp3"
  "uː_isolation.mp3"
  "ʊ_isolation.mp3"
  "eɪ_isolation.mp3"
  "aɪ_isolation.mp3"
  "ɔɪ_isolation.mp3"
  "aʊ_isolation.mp3"
  "əʊ_isolation.mp3"
  "ɪə_isolation.mp3"
  "eə_isolation.mp3"
  "ʊə_isolation.mp3"
  "p_isolation.mp3"
  "b_isolation.mp3"
  "t_isolation.mp3"
  "d_isolation.mp3"
  "k_isolation.mp3"
  "g_isolation.mp3"
  "f_isolation.mp3"
  "v_isolation.mp3"
  "θ_isolation.mp3"
  "ð_isolation.mp3"
  "s_isolation.mp3"
  "z_isolation.mp3"
  "ʃ_isolation.mp3"
  "ʒ_isolation.mp3"
  "tʃ_isolation.mp3"
  "dʒ_isolation.mp3"
  "m_isolation.mp3"
  "n_isolation.mp3"
  "ŋ_isolation.mp3"
  "h_isolation.mp3"
  "l_isolation.mp3"
  "r_isolation.mp3"
  "w_isolation.mp3"
  "j_isolation.mp3"
)

echo "Starting download of 44 Oxford IPA isolated phoneme MP3s..."

for file in "${FILES[@]}"; do
  # URL encode utf8 filename for curl
  ENCODED=$(python3 -c "import urllib.parse, sys; print(urllib.parse.quote(sys.argv[1]))" "$file")
  URL="https://cdn.jsdelivr.net/gh/xiaozhah/phoneme_audio@main/audio/${ENCODED}"
  TARGET="${DIR}/${file}"
  if [ ! -f "$TARGET" ] || [ ! -s "$TARGET" ]; then
    echo "Downloading ${file}..."
    curl -s -x "$PROXY" "$URL" -o "$TARGET" || curl -s "$URL" -o "$TARGET"
  else
    echo "Exists: ${file}"
  fi
done

echo "All 44 Oxford IPA phoneme MP3s downloaded successfully!"
