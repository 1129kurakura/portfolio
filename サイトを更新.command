#!/bin/bash
# ============================================================
#  サイトを更新.command
#
#  Finder でダブルクリックすると、変更を GitHub に送って
#  公開サイト（GitHub Pages）を更新します。
#
#  1. 変更されたファイルを表示
#  2. js/ の書き間違いをチェック（間違いがあれば送信しない）
#  3. 更新メモを入力してコミット
#  4. GitHub に送信
#  5. 公開サイトに反映されるまで待って、ブラウザで開く
# ============================================================

BRANCH="main"
DEPLOY_TIMEOUT="${DEPLOY_TIMEOUT:-300}"   # 反映を待つ最大秒数
POLL_INTERVAL="${POLL_INTERVAL:-10}"      # 反映を確認する間隔（秒）

BOLD=$'\033[1m'; DIM=$'\033[2m'; RED=$'\033[31m'; GREEN=$'\033[32m'
YELLOW=$'\033[33m'; CYAN=$'\033[36m'; RESET=$'\033[0m'; CLEAR_LINE=$'\r\033[K'

step() { printf "\n${BOLD}${CYAN}▶ %s${RESET}\n" "$1"; }
ok()   { printf "${GREEN}✔ %s${RESET}\n" "$1"; }
warn() { printf "${YELLOW}⚠ %s${RESET}\n" "$1"; }
fail() { printf "\n${RED}${BOLD}✖ %s${RESET}\n" "$1"; }

finish() {
  printf "\n${DIM}────────────────────────────────${RESET}\n"
  read -r -n 1 -s -p "何かキーを押すとこのウィンドウを閉じます…"
  echo
  exit "${1:-0}"
}

# ---------- GitHub のリポジトリ情報と公開URLを求める ----------
resolve_repo() {
  local remote
  remote=$(git remote get-url origin 2>/dev/null) || return 1
  remote=${remote%.git}
  REPO=${remote##*/}
  OWNER=${remote%/*}
  OWNER=${OWNER##*[/:]}

  if [ -f CNAME ]; then
    SITE_URL="https://$(tr -d '[:space:]' < CNAME)/"
  elif [ "$REPO" = "${OWNER}.github.io" ]; then
    SITE_URL="https://${OWNER}.github.io/"
  else
    SITE_URL="https://${OWNER}.github.io/${REPO}/"
  fi
  ACTIONS_URL="https://github.com/${OWNER}/${REPO}/actions"
}

# ---------- 変更ファイルを日本語ラベル付きで表示 ----------
show_changes() {
  git -c core.quotepath=false status --porcelain | while IFS= read -r line; do
    local code=${line:0:2} path=${line:3} label
    case "$code" in
      '??') label="追加" ;;
      *D*)  label="削除" ;;
      R*)   label="名前変更" ;;
      A*)   label="追加" ;;
      *)    label="変更" ;;
    esac
    printf "   [%s] %s\n" "$label" "$path"
  done
}

# ---------- js/ の文法チェック ----------
check_syntax() {
  if ! command -v node >/dev/null 2>&1; then
    warn "Node.js が見つからないため、チェックを省略します"
    return 0
  fi
  local file output has_error=0
  for file in js/*.js; do
    if ! output=$(node --check "$file" 2>&1); then
      fail "$file に書き間違いがあります"
      printf "%s\n" "$output" | head -8
      has_error=1
    fi
  done
  return "$has_error"
}

# ---------- GitHub に送信（拒否されたら取り込んで再送） ----------
push_changes() {
  local log
  log=$(mktemp)
  if git push origin "$BRANCH" >"$log" 2>&1; then
    rm -f "$log"
    return 0
  fi

  if grep -qiE "rejected|fetch first|non-fast-forward" "$log"; then
    warn "GitHub 側に新しい変更があったので、取り込んでから送り直します"
    if git pull --rebase --autostash -q origin "$BRANCH" 2>>"$log" \
      && git push origin "$BRANCH" >>"$log" 2>&1; then
      rm -f "$log"
      return 0
    fi
    git rebase --abort >/dev/null 2>&1
    fail "送信に失敗しました（変更が衝突しています）"
    echo "   コミットは手元に残っています。内容を確認してください。"
  elif grep -qiE "authentication|could not read username|permission|403" "$log"; then
    fail "GitHub の認証に失敗しました"
    echo "   ターミナルで gh auth login を実行してログインし直してください。"
  else
    fail "送信に失敗しました"
  fi
  printf "${DIM}%s${RESET}\n" "$(cat "$log")"
  rm -f "$log"
  return 1
}

# ---------- 公開サイトのファイルが手元と一致するか ----------
is_deployed() {
  local file url stamp
  stamp=$(date +%s)
  while IFS= read -r file; do
    [ -f "$file" ] || continue
    url="${SITE_URL}${file// /%20}?nocache=${stamp}"
    curl -fsSL --max-time 20 "$url" 2>/dev/null | cmp -s - "$file" || return 1
  done <<< "$DEPLOY_FILES"
  return 0
}

wait_for_deploy() {
  local before=$1 elapsed=0

  # 今回送ったファイルのうち、サイトで配信されるものを確認対象にする
  DEPLOY_FILES=$(git -c core.quotepath=false diff --name-only --diff-filter=AMR "$before" HEAD 2>/dev/null \
    | grep -E '\.(html|css|js|json|svg|png|jpe?g|webp|avif|gif)$' \
    | LC_ALL=C grep -v '[^ -~]' | head -8)
  [ -z "$DEPLOY_FILES" ] && DEPLOY_FILES="index.html"

  while [ "$elapsed" -le "$DEPLOY_TIMEOUT" ]; do
    if is_deployed; then
      printf "%s" "$CLEAR_LINE"
      ok "公開サイトに反映されました（約 ${elapsed} 秒）"
      echo "   $SITE_URL"
      echo "   ${DIM}古い表示のままなら Cmd + Shift + R で再読み込みしてください${RESET}"
      open "$SITE_URL"
      return 0
    fi
    printf "%s   確認中… %d 秒経過" "$CLEAR_LINE" "$elapsed"
    sleep "$POLL_INTERVAL"
    elapsed=$((elapsed + POLL_INTERVAL))
  done

  printf "%s" "$CLEAR_LINE"
  warn "$((DEPLOY_TIMEOUT / 60)) 分待っても反映を確認できませんでした"
  echo "   送信は完了しています。少し時間をおいて開いてみてください。"
  echo "   進み具合： $ACTIONS_URL"
  return 1
}

# ============================================================
#  ここから実行
# ============================================================
cd "$(dirname "$0")" || { fail "フォルダに移動できませんでした"; finish 1; }

printf "${BOLD}KURA' サイト更新${RESET}\n${DIM}%s${RESET}\n" "$(pwd)"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  fail "このフォルダは Git リポジトリではありません"
  finish 1
fi
resolve_repo

# 1. 変更の確認 -------------------------------------------------
step "変更を確認しています"
git fetch -q origin "$BRANCH" 2>/dev/null
changes=$(git status --porcelain)
unpushed=$(git log "origin/$BRANCH..HEAD" --oneline 2>/dev/null)

if [ -z "$changes" ] && [ -z "$unpushed" ]; then
  ok "変更はありません。公開サイトは最新です。"
  echo "   $SITE_URL"
  finish 0
fi

[ -n "$changes" ] && show_changes
[ -n "$unpushed" ] && echo "   ＋ まだ送信していないコミット $(printf '%s\n' "$unpushed" | wc -l | tr -d ' ') 件"

# 2. 書き間違いチェック -----------------------------------------
step "書き間違いがないかチェックしています"
if ! check_syntax; then
  echo
  warn "修正して保存してから、もう一度ダブルクリックしてください"
  warn "公開サイトは変更していません"
  finish 1
fi
ok "問題ありません"

# 3. コミット ---------------------------------------------------
if [ -n "$changes" ]; then
  step "更新内容のメモを入力して Enter"
  default_msg="サイトを更新 $(date '+%Y-%m-%d %H:%M')"
  printf "${DIM}   空のまま Enter →「%s」${RESET}\n" "$default_msg"
  read -r -p "   > " msg
  msg=${msg:-$default_msg}

  # 「feat:」などの種類が付いていなければ chore: を付ける
  type_pattern='^[a-z]+(\([^)]*\))?!?: '
  [[ $msg =~ $type_pattern ]] || msg="chore: $msg"

  git add -A
  if ! git commit -q -m "$msg"; then
    fail "コミットに失敗しました"
    finish 1
  fi
  ok "コミットしました：$msg"
fi

# 4. 送信 -------------------------------------------------------
step "GitHub に送信しています"
before=$(git rev-parse "origin/$BRANCH" 2>/dev/null)
push_changes || finish 1
ok "送信しました"

# 5. 反映の確認 -------------------------------------------------
step "公開サイトへの反映を待っています（通常 1〜2 分）"
wait_for_deploy "$before"
finish $?
