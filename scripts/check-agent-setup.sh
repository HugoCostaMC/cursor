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
else
  warn ".env.local missing (copy from .env.example)"
fi

printf "\nSummary: %d pass, %d warn, %d fail\n" "$PASS_COUNT" "$WARN_COUNT" "$FAIL_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
  printf "Setup is not ready yet. Fix FAIL items first.\n\n"
  exit 1
fi

printf "Setup is ready for Cursor Agent prototype work.\n\n"
