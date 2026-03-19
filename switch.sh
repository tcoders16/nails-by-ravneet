#!/bin/bash
# ─────────────────────────────────────────────────────────────────
#  Nail Studio — Client Switch Tool
#  Usage: ./switch.sh
#  Switches all site content between Tisha and Ravneet configs,
#  then pushes to the correct GitHub remote.
# ─────────────────────────────────────────────────────────────────

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
CURRENT_FILE="$DIR/.current-client"

# ── Colours ──────────────────────────────────────────────────────
BOLD='\033[1m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# ── Read current client ───────────────────────────────────────────
CURRENT=$(cat "$CURRENT_FILE" 2>/dev/null || echo "unknown")

# ── Header ────────────────────────────────────────────────────────
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

# ── Resolve target client ──────────────────────────────────────────
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

# ── Confirm switch if changing ────────────────────────────────────
if [ "$TARGET" != "$CURRENT" ] && [ "$CHOICE" != "3" ]; then
  echo ""
  echo -e "  Switching: ${CYAN}${CURRENT}${NC} → ${MAGENTA}${TARGET}${NC}"
  echo ""
  read -rp "  Confirm? (y/n) → " CONFIRM
  [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]] && { echo "  Cancelled."; exit 0; }
fi

# ─────────────────────────────────────────────────────────────────
#  APPLY CLIENT CONFIG
# ─────────────────────────────────────────────────────────────────
if [ "$TARGET" != "$CURRENT" ]; then
  echo ""
  echo -e "${BOLD}  Applying ${MAGENTA}${TARGET}${NC}${BOLD} config...${NC}"

  # macOS-safe sed in-place
  SED() { sed -i '' "$@"; }

  # All source files to patch
  FILES=(
    src/app/layout.tsx
    src/components/layout/Navbar.tsx
    src/components/layout/Footer.tsx
    src/components/sections/Hero.tsx
    src/components/sections/About.tsx
    src/components/sections/BookingCTA.tsx
    src/components/sections/ConsultationTeaser.tsx
    src/data/testimonials.ts
    src/app/admin/page.tsx
    src/app/book/page.tsx
    src/app/contact/page.tsx
    src/app/shop/page.tsx
    src/app/shop/success/page.tsx
    src/app/call/\[roomId\]/page.tsx
    src/app/api/admin/route.ts
    src/app/api/appointments/route.ts
    src/app/api/availability/route.ts
    src/app/api/checkout/route.ts
    src/app/api/booking/route.ts
    src/lib/email.ts
  )

  if [ "$TARGET" = "tisha" ]; then
    FROM_NAME="Ravneet"; TO_NAME="Tisha"
    FROM_SLUG="ravneet"; TO_SLUG="tisha"
  else
    FROM_NAME="Tisha";   TO_NAME="Ravneet"
    FROM_SLUG="tisha";   TO_SLUG="ravneet"
  fi

  for FILE in "${FILES[@]}"; do
    FULL="$DIR/$FILE"
    [ ! -f "$FULL" ] && continue

    # Order matters: most-specific patterns first
    SED "s/Nails by ${FROM_NAME}/Nails by ${TO_NAME}/g"          "$FULL"
    SED "s/nailsby${FROM_SLUG}/nailsby${TO_SLUG}/g"               "$FULL"
    SED "s/nails-by-${FROM_SLUG}/nails-by-${TO_SLUG}/g"          "$FULL"
    SED "s/nails${FROM_SLUG}-/nails${TO_SLUG}-/g"                 "$FULL"
    SED "s/${FROM_SLUG}123/${TO_SLUG}123/g"                        "$FULL"
    # Standalone name — careful word-boundary via \b doesn't exist in macOS sed,
    # so we use common surrounding chars:
    SED "s/\b${FROM_NAME}\b/${TO_NAME}/g"                          "$FULL" 2>/dev/null || \
    SED "s/ ${FROM_NAME} / ${TO_NAME} /g;s/>${FROM_NAME}</>${TO_NAME}</g;s/\"${FROM_NAME}\"/\"${TO_NAME}\"/g;s/(${FROM_NAME})/(${TO_NAME})/g;s/!${FROM_NAME}/!${TO_NAME}/g;s/${FROM_NAME}\./${TO_NAME}./g;s/${FROM_NAME},/${TO_NAME},/g;s/${FROM_NAME}'\''/${TO_NAME}'\'''/g" "$FULL"
  done

  # ── Copy logo component ──────────────────────────────────────────
  cp "$DIR/clients/${TARGET}/logo.tsx" "$DIR/src/components/layout/ClientLogo.tsx"
  # Update the "Current client" comment in ClientLogo.tsx
  SED "s|// Current client: .*|// Current client: ${TARGET}|" "$DIR/src/components/layout/ClientLogo.tsx"
  echo -e "  ${GREEN}✓${NC} Logo switched to ${TARGET}"

  # ── Copy favicon ─────────────────────────────────────────────────
  cp "$DIR/clients/${TARGET}/favicon.svg" "$DIR/public/favicon.svg"
  echo -e "  ${GREEN}✓${NC} Favicon switched to ${TARGET}"

  # ── Save current client ───────────────────────────────────────────
  echo "$TARGET" > "$CURRENT_FILE"
  echo -e "  ${GREEN}✓${NC} All text replacements applied"
fi

# ─────────────────────────────────────────────────────────────────
#  GIT — Ensure both remotes exist
# ─────────────────────────────────────────────────────────────────
ensure_remote() {
  local NAME=$1 URL=$2
  if git -C "$DIR" remote get-url "$NAME" &>/dev/null; then
    # Remote exists — update URL in case it changed
    git -C "$DIR" remote set-url "$NAME" "$URL"
  else
    git -C "$DIR" remote add "$NAME" "$URL"
    echo -e "  ${GREEN}✓${NC} Added remote: ${NAME}"
  fi
}

ensure_remote "tisha"   "https://github.com/tcoders16/nails-by-tisha.git"
ensure_remote "ravneet" "https://github.com/tcoders16/nails-by-ravneet.git"

# ─────────────────────────────────────────────────────────────────
#  ASK TO PUSH
# ─────────────────────────────────────────────────────────────────
echo ""
echo -e "  ${BOLD}Ready to push to ${MAGENTA}nails-by-${TARGET}${NC}${BOLD} on GitHub.${NC}"
echo ""
read -rp "  Push now? (y/n) → " DO_PUSH

if [[ "$DO_PUSH" = "y" || "$DO_PUSH" = "Y" ]]; then
  echo ""
  echo -e "  Committing changes..."

  cd "$DIR"
  git add -A

  # Only commit if there are staged changes
  if git diff --cached --quiet; then
    echo -e "  ${YELLOW}Nothing new to commit — already up to date.${NC}"
  else
    COMMIT_MSG="chore: configure for ${TARGET} client

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
    git commit -m "$COMMIT_MSG"
    echo -e "  ${GREEN}✓${NC} Committed"
  fi

  echo ""
  echo -e "  Pushing to ${MAGENTA}${TARGET}${NC} remote..."
  git push "$TARGET" main --force-with-lease 2>/dev/null || git push "$TARGET" main --force
  echo ""
  echo -e "  ${GREEN}${BOLD}✓ Done! Live on nails-by-${TARGET}.${NC}"
else
  echo ""
  echo -e "  ${YELLOW}Skipped push. Changes applied locally only.${NC}"
fi

echo ""
