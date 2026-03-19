#!/bin/bash
# ─────────────────────────────────────────────────────────────────
#  Nail Studio — Client Switch Tool
#  Usage: ./switch.sh
#  Swaps the client config, logo, and favicon, then pushes to the
#  correct GitHub remote. No manual find-and-replace needed.
# ─────────────────────────────────────────────────────────────────

set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
CURRENT_FILE="$DIR/.current-client"

BOLD='\033[1m'; RED='\033[0;31m'; GREEN='\033[0;32m'
YELLOW='\033[1;33m'; CYAN='\033[0;36m'; MAGENTA='\033[0;35m'; NC='\033[0m'

CURRENT=$(cat "$CURRENT_FILE" 2>/dev/null || echo "unknown")

echo ""
echo -e "${BOLD}╔══════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║   💅  Nail Studio — Client Switch Tool   ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════╝${NC}"
echo ""
echo -e "  Active client : ${CYAN}${BOLD}${CURRENT}${NC}"
echo ""
echo "  Choose an option:"
echo ""
echo "   1)  Switch to  Tisha    → push to nails-by-tisha"
echo "   2)  Switch to  Ravneet  → push to nails-by-ravneet"
echo "   3)  Push current client without switching"
echo "   4)  Exit"
echo ""
read -rp "  → " CHOICE

case "$CHOICE" in
  1) TARGET="tisha"   ;;
  2) TARGET="ravneet" ;;
  3) TARGET="$CURRENT" ;;
  4) echo "  Bye! 👋"; exit 0 ;;
  *) echo -e "${RED}  Invalid choice.${NC}"; exit 1 ;;
esac

if [ "$TARGET" = "unknown" ]; then
  echo -e "${RED}  No current client set. Please choose 1 or 2.${NC}"
  exit 1
fi

# ── Confirm switch ────────────────────────────────────────────────
if [ "$TARGET" != "$CURRENT" ]; then
  echo ""
  echo -e "  Switching: ${CYAN}${CURRENT}${NC} → ${MAGENTA}${TARGET}${NC}"
  echo ""
  read -rp "  Confirm? (y/n) → " CONFIRM
  [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]] && { echo "  Cancelled."; exit 0; }

  echo ""
  echo -e "${BOLD}  Applying ${MAGENTA}${TARGET}${NC}${BOLD} config...${NC}"

  # ── Copy config (single source of truth — all components read this)
  cp "$DIR/clients/${TARGET}/config.ts" "$DIR/src/config/client.ts"
  echo -e "  ${GREEN}✓${NC} client.ts → ${TARGET}"

  # ── Copy logo component
  cp "$DIR/clients/${TARGET}/logo.tsx" "$DIR/src/components/layout/ClientLogo.tsx"
  echo -e "  ${GREEN}✓${NC} ClientLogo.tsx → ${TARGET}"

  # ── Copy favicon
  cp "$DIR/clients/${TARGET}/favicon.svg" "$DIR/public/favicon.svg"
  echo -e "  ${GREEN}✓${NC} favicon.svg → ${TARGET}"

  # ── Save current client
  echo "$TARGET" > "$CURRENT_FILE"
  echo -e "  ${GREEN}✓${NC} .current-client → ${TARGET}"
fi

# ── Ensure both remotes exist ─────────────────────────────────────
ensure_remote() {
  local NAME=$1 URL=$2
  if git -C "$DIR" remote get-url "$NAME" &>/dev/null; then
    git -C "$DIR" remote set-url "$NAME" "$URL"
  else
    git -C "$DIR" remote add "$NAME" "$URL"
    echo -e "  ${GREEN}✓${NC} Added remote: ${NAME}"
  fi
}
ensure_remote "tisha"   "https://github.com/tcoders16/nails-by-tisha.git"
ensure_remote "ravneet" "https://github.com/tcoders16/nails-by-ravneet.git"

# ── Push ──────────────────────────────────────────────────────────
echo ""
echo -e "  ${BOLD}Ready to push to ${MAGENTA}nails-by-${TARGET}${NC}${BOLD} on GitHub.${NC}"
echo ""
read -rp "  Push now? (y/n) → " DO_PUSH

if [[ "$DO_PUSH" = "y" || "$DO_PUSH" = "Y" ]]; then
  cd "$DIR"
  git add -A

  if git diff --cached --quiet; then
    echo -e "  ${YELLOW}Nothing new to commit — already up to date.${NC}"
  else
    git commit -m "$(printf "chore: configure for %s client\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>" "$TARGET")"
    echo -e "  ${GREEN}✓${NC} Committed"
  fi

  echo ""
  echo -e "  Pushing to ${MAGENTA}${TARGET}${NC} remote..."
  git push "$TARGET" main --force-with-lease 2>/dev/null || git push "$TARGET" main --force
  echo ""
  echo -e "  ${GREEN}${BOLD}✓ Done! Deployed to nails-by-${TARGET}.${NC}"
else
  echo -e "\n  ${YELLOW}Skipped push. Config applied locally only.${NC}"
fi
echo ""
