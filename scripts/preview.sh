#!/usr/bin/env bash
# ============================================================
# 林玮锋作品集 · 本地预览脚本（最简版）
# 跑法：bash scripts/preview.sh [端口]
# ============================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

PORT="${1:-${PORT:-8099}}"

echo "==> 林玮锋作品集 · 本地预览"
echo "    目录: $(pwd)"
echo "    端口: $PORT"
echo "    访问: http://localhost:$PORT/"
echo "    停止: Ctrl+C"
echo ""

exec python3 -m http.server "$PORT"