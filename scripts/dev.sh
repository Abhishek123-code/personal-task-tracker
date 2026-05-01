#!/usr/bin/env bash
set -euo pipefail

pids=()

cleanup() {
  if [ "${#pids[@]}" -gt 0 ]; then
    kill "${pids[@]}" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

npm --prefix task-service run prisma:generate

npm --prefix task-service run dev &
pids+=("$!")

(
  export TASK_SERVICE_URL="${TASK_SERVICE_URL:-http://localhost:3000}"
  npm --prefix analytics-service run dev
) &
pids+=("$!")

(
  export VITE_TASK_API_URL="${VITE_TASK_API_URL:-http://localhost:3000/task}"
  export VITE_ANALYTICS_API_URL="${VITE_ANALYTICS_API_URL:-http://localhost:3001/analytics}"
  npm --prefix frontend run dev -- --host 0.0.0.0
) &
pids+=("$!")

wait -n "${pids[@]}"
