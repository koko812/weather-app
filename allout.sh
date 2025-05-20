#!/usr/bin/env bash
# concat_src_and_md.sh

# 出力先ファイル
OUT="all_files_concatenated.txt"

# 1) ツリーを表示（node_modules を除外）
tree -I node_modules > "$OUT"
echo -e "\n" >> "$OUT"

# 2) ルートディレクトリの .md ファイルを追加
find . -maxdepth 1 -type f -name "*.md" | sort | while read -r file; do
  echo "===== $file =====" >> "$OUT"
  cat "$file" >> "$OUT"
  echo -e "\n" >> "$OUT"
done

# 3) src 配下の .js / .jsx ファイルを追加
find ./src -type f \( -name "*.js" -o -name "*.jsx" \) | sort | while read -r file; do
  echo "===== $file =====" >> "$OUT"
  cat "$file" >> "$OUT"
  echo -e "\n" >> "$OUT"
done

echo "✅ \"$OUT\" に出力しました。"

