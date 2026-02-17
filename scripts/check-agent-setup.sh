#!/usr/bin/env bash
set -euo pipefail

PASS_COUNT=0
WARN_COUNT=0
FAIL_COUNT=0

pass() {
  printf "  [PASS] %s\n" "$1"
  PASS_COUNT=$((PASS_COUNT + 1))
}

warn() {
  printf "  [WARN] %s\n" "$1"
  WARN_COUNT=$((WARN_COUNT + 1))
}

fail() {
  printf "  [FAIL] %s\n" "$1"
  FAIL_COUNT=$((FAIL_COUNT + 1))
}

printf "\nChecking local agent prerequisites...\n\n"

if command -v git >/dev/null 2>&1; then
  pass "git is installed"
else
  fail "git is not installed"
fi

if command -v gh >/dev/null 2>&1; then
  pass "GitHub CLI (gh) is installed"
else
  fail "GitHub CLI (gh) is not installed"
fi

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  pass "current folder is a git repository"
else
  fail "current folder is not a git repository"
fi

if git remote get-url origin >/dev/null 2>&1; then
  pass "origin remote is configured"
else
  fail "origin remote is missing"
fi

if gh auth status >/dev/null 2>&1; then
  pass "gh is authenticated"
else
  warn "gh is not authenticated (run: gh auth login)"
fi

CURRENT_BRANCH="$(git branch --show-current || true)"
if [ -n "${CURRENT_BRANCH}" ]; then
  pass "current branch: ${CURRENT_BRANCH}"
else
  warn "no branch detected (detached HEAD?)"
fi

if [ -f ".env.local" ]; then
  pass ".env.local exists"
  set -a
  # shellcheck disable=SC1091
  . ".env.local"
  set +a

  DS_MODE="${DESIGN_SYSTEM_MODE:-}"
  if [ -z "${DS_MODE}" ]; then
    warn "DESIGN_SYSTEM_MODE not set in .env.local"
  else
    pass "design system mode: ${DS_MODE}"
    case "${DS_MODE}" in
      package)
        if [ -n "${DESIGN_SYSTEM_PACKAGE_NAME:-}" ]; then
          pass "DESIGN_SYSTEM_PACKAGE_NAME is set"
        else
          warn "DESIGN_SYSTEM_PACKAGE_NAME missing for package mode"
        fi
        ;;
      tokens_api)
        if [ -n "${DESIGN_SYSTEM_TOKENS_URL:-}" ]; then
          pass "DESIGN_SYSTEM_TOKENS_URL is set"
        else
          warn "DESIGN_SYSTEM_TOKENS_URL missing for tokens_api mode"
        fi
        ;;
      *)
        warn "Unsupported DESIGN_SYSTEM_MODE value: ${DS_MODE}"
        ;;
    esac
  fi
else
  warn ".env.local missing (copy from .env.example)"
fi

printf "\nSummary: %d pass, %d warn, %d fail\n" "$PASS_COUNT" "$WARN_COUNT" "$FAIL_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
  printf "Setup is not ready yet. Fix FAIL items first.\n\n"
  exit 1
fi

printf "Setup is ready for Cursor Agent prototype work.\n\n"
