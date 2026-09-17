#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

MAX_CODE_LINES=${MAX_CODE_LINES:-250}
WARN_CODE_LINES=${WARN_CODE_LINES:-220}
MAX_DATA_LINES=${MAX_DATA_LINES:-500}
WARN_DATA_LINES=${WARN_DATA_LINES:-450}
TARGET_DIR="src"

echo "[1/4] Checking modularity constraints (code: ${MAX_CODE_LINES} lines, data/i18n: ${MAX_DATA_LINES} lines)..."

violations=0
warnings=0
total_files=0

while IFS= read -r file; do
  total_files=$((total_files + 1))
  line_count=$(wc -l < "$file")

  if [[ "$file" =~ /(data|i18n)/ ]]; then
    max_lines=$MAX_DATA_LINES
    warn_lines=$WARN_DATA_LINES
    type_label="data/i18n"
  else
    max_lines=$MAX_CODE_LINES
    warn_lines=$WARN_CODE_LINES
    type_label="code"
  fi

  if [ "$line_count" -gt "$max_lines" ]; then
    echo "ERROR: Monolith limit exceeded in $file ($line_count > $max_lines lines for $type_label)" >&2
    violations=$((violations + 1))
  elif [ "$line_count" -ge "$warn_lines" ]; then
    echo "WARN: Near threshold in $file ($line_count lines, limit: $max_lines for $type_label)"
    warnings=$((warnings + 1))
  fi
done < <(find "$TARGET_DIR" -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) ! -name "*.gitkeep")

if [ "$violations" -gt 0 ]; then
  echo "FAIL: $violations file(s) exceed maximum line limits." >&2
  exit 1
fi

if [ "$warnings" -gt 0 ]; then
  echo "INFO: $warnings file(s) near limit threshold."
fi

echo "OK: $total_files files validated."

echo "[2/4] Checking directory structure..."
if [ ! -d "src/modules" ]; then
  echo "ERROR: Missing required directory 'src/modules'" >&2
  exit 1
fi
echo "OK: Architecture structure confirmed."

echo "[3/4] Running production build..."
npm run build

echo "[4/4] Validating build artifacts in dist/..."
if [ ! -f "dist/index.html" ]; then
  echo "ERROR: Missing dist/index.html artifact." >&2
  exit 1
fi

if [ ! -f "dist/_redirects" ]; then
  echo "ERROR: Missing dist/_redirects artifact for SPA routing." >&2
  exit 1
fi

echo "OK: Required artifacts present."
echo "SUCCESS: Build and verification completed (status 0)."
