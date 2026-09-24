#!/usr/bin/env bash
# ============================================================
# 林玮锋作品集 · 新电脑一键初始化脚本
# ------------------------------------------------------------
# 适用：换到新电脑 / 重装系统 / 新 clone 仓库后想立刻跑起来
# 作用：检查环境 → 配置 git → 装依赖 → 启动本地预览
# 跑法：bash scripts/bootstrap.sh
# ============================================================
set -e

# 颜色输出（仅在交互式终端生效）
if [ -t 1 ]; then
  BOLD="\033[1m"; GREEN="\033[32m"; YELLOW="\033[33m"; RED="\033[31m"; RESET="\033[0m"
else
  BOLD=""; GREEN=""; YELLOW=""; RED=""; RESET=""
fi

# 切到项目根目录（无论脚本从哪里被调用）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

echo "${BOLD}==> 林玮锋作品集 · 一键初始化${RESET}"
echo "    项目目录: $(pwd)"
echo ""

# ---------- 1. 环境检查 ----------
echo "${BOLD}[1/5] 检查环境${RESET}"
MISSING=()

if ! command -v git >/dev/null 2>&1; then
  MISSING+=("git    → xcode-select --install  或 brew install git")
fi

# 优先用 managed Python，路径硬编码；若不存在用系统 python3
PYTHON_BIN=""
for cand in \
  "/Users/shmilinweifeng/.workbuddy/binaries/python/versions/3.13.12/bin/python3" \
  "/usr/bin/python3" \
  "$(command -v python3 2>/dev/null)"
do
  if [ -x "$cand" ]; then
    PYTHON_BIN="$cand"
    break
  fi
done
if [ -z "$PYTHON_BIN" ]; then
  MISSING+=("python3 → brew install python@3.13")
fi

if [ ${#MISSING[@]} -gt 0 ]; then
  echo "${RED}× 缺少必要依赖：${RESET}"
  for item in "${MISSING[@]}"; do echo "  - $item"; done
  exit 1
fi
echo "${GREEN}✓ git:    $(git --version)${RESET}"
echo "${GREEN}✓ python: $($PYTHON_BIN --version)${RESET}"
echo ""

# ---------- 2. Git 配置 ----------
echo "${BOLD}[2/5] 配置 Git 身份${RESET}"
GIT_NAME="$(git config --global user.name 2>/dev/null || true)"
GIT_EMAIL="$(git config --global user.email 2>/dev/null || true)"

if [ -z "$GIT_NAME" ]; then
  git config --global user.name "niumodelinlin"
  echo "${GREEN}✓ 已设置 user.name = niumodelinlin${RESET}"
else
  echo "    user.name = $GIT_NAME (已配置，跳过)"
fi

if [ -z "$GIT_EMAIL" ]; then
  echo "${YELLOW}! user.email 未配置${RESET}"
  echo "  提交时 GitHub 需要它来关联你的账号"
  echo "  请执行：git config --global user.email \"你的 GitHub 邮箱\""
  echo ""
else
  echo "    user.email = $GIT_EMAIL (已配置)"
fi
echo ""

# ---------- 3. 仓库状态 ----------
echo "${BOLD}[3/5] 检查仓库状态${RESET}"
if [ -d .git ]; then
  BRANCH="$(git branch --show-current)"
  echo "${GREEN}✓ 当前分支: $BRANCH${RESET}"
  echo "    最近提交:"
  git log --oneline -3 | sed 's/^/      /'
else
  echo "${YELLOW}! 当前目录不是 Git 仓库${RESET}"
  echo "  如果你刚 clone，仓库根目录应该有 .git 文件夹"
  echo "  当前目录: $(pwd)"
fi
echo ""

# ---------- 4. Python venv + 依赖 ----------
echo "${BOLD}[4/5] 创建 Python 虚拟环境 + 装包${RESET}"
VENV_DIR=".venv"
if [ ! -d "$VENV_DIR" ]; then
  echo "    创建 $VENV_DIR ..."
  "$PYTHON_BIN" -m venv "$VENV_DIR"
fi
# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

echo "    升级 pip ..."
pip install --upgrade pip --quiet

echo "    装依赖（playwright / pillow / numpy / mozjpeg）..."
pip install --quiet playwright pillow numpy mozjpeg-lossless-optimization

# Chromium 浏览器（已装就跳过）
if [ ! -d "$HOME/.cache/ms-playwright/chromium-"* ] 2>/dev/null; then
  echo "    装 Chromium 浏览器（首次需要）..."
  playwright install chromium
else
  echo "    Chromium 已装"
fi
echo "${GREEN}✓ Python 环境就绪${RESET}"
echo ""

# ---------- 5. 启动本地预览 ----------
echo "${BOLD}[5/5] 启动本地预览${RESET}"
PORT="${PORT:-8099}"
echo "    端口: $PORT"
echo "    访问: ${GREEN}http://localhost:$PORT/${RESET}"
echo ""
echo "${YELLOW}提示：${RESET}"
echo "  - 浏览器自动打开需要权限，请手动复制链接"
echo "  - 停止预览: Ctrl+C"
echo "  - 以后再启动预览，直接跑: ${BOLD}bash scripts/preview.sh${RESET}"
echo ""
echo "${BOLD}---------------------------------------------${RESET}"
echo "下一步: 用编辑器打开 index.html 或 pages/*.html 开始改"
echo "改完提交: git add -A && git commit -m '描述' && git push origin main"
echo "${BOLD}---------------------------------------------${RESET}"
echo ""

# 后台启动预览
exec python3 -m http.server "$PORT"