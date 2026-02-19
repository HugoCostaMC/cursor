#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
PROJECT_DIR="${DESIGN_SYSTEM_PROJECT_DIR:-${REPO_ROOT}/projects/ai-playground-onboarding}"

if [ -f "${REPO_ROOT}/.env.local" ]; then
  set -a
  # shellcheck disable=SC1091
  . "${REPO_ROOT}/.env.local"
  set +a
fi

if [ -f "${PROJECT_DIR}/.env.local" ]; then
  set -a
  # shellcheck disable=SC1091
  . "${PROJECT_DIR}/.env.local"
  set +a
fi

TOKENS_URL="${DESIGN_SYSTEM_TOKENS_URL:-}"
OUTPUT_FILE="${DESIGN_SYSTEM_TOKEN_OUTPUT:-${PROJECT_DIR}/design-system/tokens.json}"
AUTH_HEADER="${DESIGN_SYSTEM_AUTH_HEADER:-Authorization}"
AUTH_SCHEME="${DESIGN_SYSTEM_AUTH_SCHEME:-Bearer}"
API_TOKEN="${DESIGN_SYSTEM_API_TOKEN:-}"

if [[ "${OUTPUT_FILE}" != /* ]]; then
  OUTPUT_FILE="${REPO_ROOT}/${OUTPUT_FILE}"
fi

if [ -z "${TOKENS_URL}" ]; then
  printf "ERROR: DESIGN_SYSTEM_TOKENS_URL is required for tokens_api mode.\n"
  printf "Set it in .env.local and run again.\n"
  exit 1
fi

TMP_FILE="$(mktemp)"
cleanup() {
  rm -f "${TMP_FILE}"
}
trap cleanup EXIT

CURL_HEADERS=("-H" "Accept: application/json")
if [ -n "${API_TOKEN}" ]; then
  if [ -n "${AUTH_SCHEME}" ]; then
    AUTH_VALUE="${AUTH_SCHEME} ${API_TOKEN}"
  else
    AUTH_VALUE="${API_TOKEN}"
  fi
  CURL_HEADERS+=("-H" "${AUTH_HEADER}: ${AUTH_VALUE}")
fi

printf "Downloading design tokens from: %s\n" "${TOKENS_URL}"
if ! curl -fsSL "${CURL_HEADERS[@]}" "${TOKENS_URL}" -o "${TMP_FILE}"; then
  printf "ERROR: Failed to download design tokens.\n"
  exit 1
fi

if ! python3 -m json.tool "${TMP_FILE}" >/dev/null 2>&1; then
  printf "ERROR: Token response is not valid JSON.\n"
  exit 1
fi

mkdir -p "$(dirname "${OUTPUT_FILE}")"
cp "${TMP_FILE}" "${OUTPUT_FILE}"
printf "Design tokens synced to: %s\n" "${OUTPUT_FILE}"
