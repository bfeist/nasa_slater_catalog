#!/usr/bin/env bash
# Start the production stack.
# Run from the app root on the production host.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Pull is best-effort: GHCR creds may have expired since the last CI deploy.
# If the image is already present locally, `up -d` will use it.
docker compose -f compose.prod.yml --env-file .env.prod --env-file .env.deploy pull || \
  echo "WARN: docker pull failed (likely expired GHCR creds) — using local image."
docker compose -f compose.prod.yml --env-file .env.prod --env-file .env.deploy up -d
sudo systemctl reload nginx || true
