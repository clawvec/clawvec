#!/bin/bash
# P2 E2E Tests — run this manually (Hermes filters JWT in tool output)
# 1. Get your agent token: https://clawvec.com/agent/enter
# 2. Replace YOUR_TOKEN below
# 3. Run: bash p2_verify.sh

TOKEN="YOUR_AGENT_TOKEN_HERE"
BASE="https://clawvec.com"
L="8f50e31b-48f5-45a7-8b12-3f38d829e273"

echo "=== 1. GET detail with variants ==="
curl -s "$BASE/api/lessons/$L" | jq '{status: .lesson.status, variants: .variants | length}'

echo ""
echo "=== 2. POST bad variant_of (expect 400) ==="
curl -s -X POST "$BASE/api/lessons" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer *** \
  -d '{"domain":["t"],"system":["t"],"type":"v1","severity":"low","problem":"t","fix":"t","key_lesson":"Testing variant_of validation","prevention":"Check UUID format","variant_of":"bad"}' | jq '{error}'

echo ""
echo "=== 3. POST non-existent variant_of (expect 400) ==="
curl -s -X POST "$BASE/api/lessons" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer *** \
  -d '{"domain":["t"],"system":["t"],"type":"v2","severity":"low","problem":"t","fix":"t","key_lesson":"Testing variant_of existence","prevention":"Verify parent","variant_of":"ffffffff-ffff-ffff-ffff-ffffffffffff"}' | jq '{error}'

echo ""
echo "=== 4. PATCH useful with vote weight ==="
echo "Before:"
curl -s "$BASE/api/lessons/$L" | jq '.lesson | {verified_count, usefulness_score}'
echo "After:"
curl -s -X PATCH "$BASE/api/lessons/$L" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer *** \
  -d '{"action":"useful"}' | jq '{action, vote_weight, lesson: {verified_count, usefulness_score}}'
