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

MODE="${DESIGN_SYSTEM_MODE:-tokens_api}"
PACKAGE_MANAGER="${PACKAGE_MANAGER:-npm}"
PACKAGE_NAME="${DESIGN_SYSTEM_PACKAGE_NAME:-}"

run_package_mode() {
  if [ -z "${PACKAGE_NAME}" ]; then
    printf "ERROR: DESIGN_SYSTEM_PACKAGE_NAME is required for package mode.\n"
    exit 1
  fi

  case "${PACKAGE_MANAGER}" in
    npm)
      INSTALL_CMD=(npm install "${PACKAGE_NAME}")
      ;;
    pnpm)
      INSTALL_CMD=(pnpm add "${PACKAGE_NAME}")
      ;;
    yarn)
      INSTALL_CMD=(yarn add "${PACKAGE_NAME}")
      ;;
    *)
      printf "ERROR: Unsupported PACKAGE_MANAGER '%s'. Use npm, pnpm, or yarn.\n" "${PACKAGE_MANAGER}"
      exit 1
      ;;
  esac

  if [ ! -f "${PROJECT_DIR}/package.json" ]; then
    printf "No package.json found at: %s\n" "${PROJECT_DIR}"
    printf "When your app is initialized, run:\n  %s\n" "${INSTALL_CMD[*]}"
    exit 0
  fi

  printf "Installing external design system package in: %s\n" "${PROJECT_DIR}"
  (
    cd "${PROJECT_DIR}"
    "${INSTALL_CMD[@]}"
  )
  printf "Installed package: %s\n" "${PACKAGE_NAME}"
}

run_tokens_mode() {
  DESIGN_SYSTEM_PROJECT_DIR="${PROJECT_DIR}" "${SCRIPT_DIR}/sync-design-tokens.sh"
}

printf "Connecting design system (mode: %s)\n" "${MODE}"
case "${MODE}" in
  package)
    run_package_mode
    ;;
  tokens_api)
    run_tokens_mode
    ;;
  *)
    printf "ERROR: Unsupported DESIGN_SYSTEM_MODE '%s'. Use package or tokens_api.\n" "${MODE}"
    exit 1
    ;;
esac
