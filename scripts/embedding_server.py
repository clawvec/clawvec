#!/usr/bin/env python3
"""
Local embedding server — sentence-transformers (all-MiniLM-L6-v2, 384-dim)
Replaces OpenAI text-embedding-3-small for zero-cost local inference.

Usage:
  .venv/bin/python scripts/embedding_server.py [--port 8989]

API:
  POST /embed       { "text": "..." }        → { "embedding": [0.1, ...] }
  POST /embed_batch { "texts": ["...", ...]}  → { "embeddings": [[...], ...] }
  GET  /health                                → { "status": "ok", "model": "..." }
"""

import json
import sys
import os
import argparse
from http.server import HTTPServer, BaseHTTPRequestHandler

MODEL_NAME = "all-MiniLM-L6-v2"
DIM = 384
MAX_TEXT_LEN = 8000

_model = None

def get_model():
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        print(f"[embedding-server] Loading {MODEL_NAME}...", file=sys.stderr)
        _model = SentenceTransformer(MODEL_NAME)
        print(f"[embedding-server] Model loaded. Dimension: {DIM}", file=sys.stderr)
    return _model

class EmbeddingHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_len = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_len).decode("utf-8")

        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            self._json(400, {"error": "Invalid JSON"})
            return

        if self.path == "/embed":
            text = data.get("text", "")
            if not text:
                self._json(400, {"error": "Missing 'text' field"})
                return
            try:
                model = get_model()
                embedding = model.encode(
                    text[:MAX_TEXT_LEN],
                    normalize_embeddings=True,
                ).tolist()
                self._json(200, {"embedding": embedding, "dim": DIM})
            except Exception as e:
                self._json(500, {"error": str(e)})

        elif self.path == "/embed_batch":
            texts = data.get("texts", [])
            if not texts or not isinstance(texts, list):
                self._json(400, {"error": "Missing 'texts' array"})
                return
            try:
                model = get_model()
                truncated = [t[:MAX_TEXT_LEN] for t in texts]
                embeddings = model.encode(
                    truncated,
                    normalize_embeddings=True,
                ).tolist()
                self._json(200, {"embeddings": embeddings, "dim": DIM})
            except Exception as e:
                self._json(500, {"error": str(e)})

        else:
            self._json(404, {"error": "Not found"})

    def do_GET(self):
        if self.path == "/health":
            self._json(200, {"status": "ok", "model": MODEL_NAME, "dim": DIM})
        else:
            self._json(404, {"error": "Not found"})

    def _json(self, status, data):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

    def log_message(self, format, *args):
        print(f"[embedding-server] {args[0]}", file=sys.stderr)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Local embedding server")
    parser.add_argument("--port", type=int, default=8989, help="Port to listen on")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Bind address")
    args = parser.parse_args()

    # Preload model at startup
    print(f"[embedding-server] Starting on {args.host}:{args.port}", file=sys.stderr)
    get_model()

    server = HTTPServer((args.host, args.port), EmbeddingHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[embedding-server] Shutting down", file=sys.stderr)
        server.server_close()
