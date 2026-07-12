#!/usr/bin/env python3
"""
Backfill embeddings via local sentence-transformers server (384-dim).
Usage: .venv/bin/python scripts/backfill_embeddings.py
"""
import sys, os, json, urllib.request

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

EMBEDDING_SERVER = os.environ.get('EMBEDDING_SERVER_URL', 'http://127.0.0.1:8989')
SUPABASE_URL = os.environ.get('NEXT_PUBLIC_SUPABASE_URL', 'https://patkbglbuftjpunibbnx.supabase.co')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', os.environ.get('SUPABASE_SERVICE_KEY', ''))

# Load .env.local
env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env.local')
if os.path.exists(env_file):
    with open(env_file) as f:
        for line in f:
            if '=' in line and not line.startswith('#') and not line.startswith('//'):
                k, v = line.strip().split('=', 1)
                if k == 'SUPABASE_SERVICE_ROLE_KEY' and not SUPABASE_KEY:
                    SUPABASE_KEY = v

assert SUPABASE_KEY, "Set SUPABASE_SERVICE_ROLE_KEY env var"

def get_embedding(text: str) -> list | None:
    """Call local embedding server."""
    data = json.dumps({"text": text}).encode()
    req = urllib.request.Request(
        f"{EMBEDDING_SERVER}/embed",
        data=data,
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read()).get("embedding")
    except Exception as e:
        print(f"  ⚠️ failed: {e}", file=sys.stderr)
        return None

def fetch_lessons_without_embedding():
    url = f"{SUPABASE_URL}/rest/v1/lessons?select=id,embedding_text&embedding=is.null&embedding_text=not.is.null&order=created_at"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}",
    })
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())

def update_embedding(lesson_id: str, embedding: list):
    url = f"{SUPABASE_URL}/rest/v1/lessons?id=eq.{lesson_id}"
    data = json.dumps({"embedding": embedding}).encode()
    req = urllib.request.Request(url, data=data, method="PATCH", headers={
        "apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json", "Prefer": "return=minimal",
    })
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.status in (200, 204)

if __name__ == "__main__":
    print(f"Local embedding: {EMBEDDING_SERVER}")
    lessons = fetch_lessons_without_embedding()
    print(f"Lessons needing backfill: {len(lessons)}")
    ok = fail = 0
    for i, lesson in enumerate(lessons):
        text = lesson.get("embedding_text", "")
        print(f"  [{i+1}/{len(lessons)}] {lesson['id'][:8]}... ({len(text)} chars)", end=" ")
        emb = get_embedding(text)
        if emb and update_embedding(lesson["id"], emb):
            print("✅"); ok += 1
        else:
            print("❌"); fail += 1
    print(f"\nDone: {ok} ok, {fail} failed")
