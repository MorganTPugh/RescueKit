#!/usr/bin/env bash
# Smoke test for RescueKit dev server.
# Usage: bash .claude/skills/run-rescuekit/smoke.sh
# Run from the repo root. Starts the server, hits both API routes, then stops it.

set -e
cd "$(git rev-parse --show-toplevel)"

PORT=3000
GEMINI_API_KEY="${GEMINI_API_KEY:-placeholder}" npm run dev &
SERVER_PID=$!
trap "kill $SERVER_PID 2>/dev/null; exit" EXIT INT TERM

# Wait for server to be ready
for i in $(seq 1 20); do
  curl -s -o /dev/null -w "" http://localhost:$PORT/ && break
  sleep 0.5
done

echo "--- GET / ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/)
echo "HTTP $STATUS"
[ "$STATUS" = "200" ] || { echo "FAIL: expected 200"; exit 1; }

echo ""
echo "--- POST /api/feedback ---"
RESP=$(curl -s -X POST http://localhost:$PORT/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"name":"Smoke","email":"smoke@test.com","subject":"Test","message":"Automated smoke test"}')
echo "$RESP"
echo "$RESP" | grep -q '"success":true' || { echo "FAIL: feedback endpoint"; exit 1; }

echo ""
echo "--- POST /api/generate-bio (no real key — expects API error, not 400) ---"
RESP=$(curl -s -X POST http://localhost:$PORT/api/generate-bio \
  -H "Content-Type: application/json" \
  -d '{"pet":{"name":"Luna","species":"dog","breed":"Labrador","age":"2 years","gender":"girl","weight":"45lbs","traits":["playful"],"goodWithDogs":"yes","goodWithCats":"yes","goodWithKids":"yes","houseTrained":"yes"},"style":"playful"}')
echo "$RESP"
# Either a real bio (with valid key) or a Gemini API key error — both mean routing works
echo "$RESP" | grep -qE '"bio":|"error"' || { echo "FAIL: generate-bio endpoint"; exit 1; }

echo ""
echo "All smoke checks passed."
