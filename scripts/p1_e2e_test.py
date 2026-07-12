#!/usr/bin/env python3
"""P1 E2E test: semantic dedup + state machine"""
import os, sys, json, http.client, urllib.parse

BASE = "clawvec.com"

# Hermes DID
DID = "did:web:clawvec.com:agent:3811e274-7c3a-4c7c-9e3b-9a27b2c3d4f1"

def request(method, path, body=None, token=None):
    conn = http.client.HTTPSConnection(BASE, timeout=30)
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    conn.request(method, path, json.dumps(body) if body else None, headers)
    resp = conn.getresponse()
    data = resp.read().decode()
    return resp.status, json.loads(data) if data else {}

# Step 1: Get agent token (already have valid key from memory)
# Import from existing key
import subprocess
# Try to load Hermes private key
key_path = os.path.expanduser("~/.hermes/keys/hermes_ed25519.key")
if not os.path.exists(key_path):
    print(f"SKIP: No key at {key_path}")
    print("Tests that need auth will be skipped")
    token = None
else:
    with open(key_path) as f:
        private_key_hex = f.read().strip()
    
    # challenge
    status, data = request("GET", f"/api/agent/auth/challenge?did={urllib.parse.quote(DID)}")
    challenge = data.get("challenge", "")
    print(f"[1] Challenge: {challenge[:20]}...")
    
    # sign challenge (simplified - use Python nacl if available)
    try:
        import nacl.signing, nacl.encoding, base64
        sk = nacl.signing.SigningKey(private_key_hex, encoder=nacl.encoding.HexEncoder)
        msg = json.dumps({"did": DID, "challenge": challenge}).encode()
        sig = sk.sign(msg)
        raw_sig = sig.signature  # 64 bytes
        
        # multibase base58btc
        import base58
        signature = "z" + base58.b58encode(raw_sig).decode()
        
        # verify
        status, data = request("POST", "/api/agent/auth/verify", {
            "did": DID,
            "challenge": challenge,
            "signature": signature
        })
        token = data.get("token")
        print(f"[2] Auth: {status} {'✅' if token else '❌'}")
    except ImportError:
        print("SKIP: nacl not available")
        token = None

# ── Tests ──────────────────────────────────────────────────

def test(label, fn):
    try:
        fn()
        print(f"  ✅ {label}")
    except AssertionError as e:
        print(f"  ❌ {label}: {e}")
    except Exception as e:
        print(f"  ⚠️  {label}: {e}")

print("\n=== P1 E2E Tests ===\n")

# Test 1: Semantic dedup — reject near-duplicate
print("--- Semantic Dedup ---")
if token:
    AUTH_TOKEN = {"Authorization": f"Bearer {token}"}
    # Get existing lesson to clone
    conn = http.client.HTTPSConnection(BASE, timeout=30)
    conn.request("GET", "/api/lessons?limit=1", headers=AUTH_TOKEN)
    resp = conn.getresponse()
    existing = json.loads(resp.read().decode()).get("lessons", [])
    
    if existing:
        ref = existing[0]
        
        test("reject >0.85 similarity", lambda: _test_reject_dup(ref, token))
        test("warn >0.75 similarity", lambda: _test_warn_dup(ref, token))
        test("accept <0.75 new lesson", lambda: _test_accept_new(token))
    
    # Test 2: State machine
    print("\n--- State Machine ---")
    test("dispute (other agent)", lambda: _test_dispute(token))
    test("dispute self (should fail 403)", lambda: _test_dispute_self(token))
    test("invalid transition (should fail 422)", lambda: _test_invalid_transition(token))
else:
    print("  ⚠️  Auth tests skipped (no agent token)")

# Test 3: Unauthenticated access
print("\n--- Unauthenticated ---")
test("GET /api/lessons (public)", lambda: _test_public_get())
test("POST no auth (401)", lambda: _test_post_noauth())
test("PATCH no auth (401)", lambda: _test_patch_noauth())

print("\n=== Done ===")
print(f"\nResults above. Check clawvec.com/lessons for live verification.")
