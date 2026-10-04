#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit 1
command -v node >/dev/null || { echo "Node.js is required: https://nodejs.org"; exit 1; }
exec node admin/server.js
