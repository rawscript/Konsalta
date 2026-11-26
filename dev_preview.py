#!/usr/bin/env python3
"""Serve public site files locally without exposing application or admin files."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
import posixpath
from pathlib import Path
from urllib.parse import unquote, urlsplit


SITE_ROOT = Path(__file__).resolve().parent
NOT_FOUND_PAGE = (SITE_ROOT / "404.html").read_bytes()
ERROR_PAGE = (SITE_ROOT / "500.html").read_bytes()


class SitePreviewHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SITE_ROOT), **kwargs)

    def send_head(self):
        request_path = posixpath.normpath(
            "/" + unquote(urlsplit(self.path).path).lstrip("/")
        )
        if (
            request_path == "/admin"
            or request_path.startswith("/admin/")
            or request_path == "/api"
            or request_path.startswith("/api/")
        ):
            self.send_error(404)
            return None
        return super().send_head()

    def send_error(self, code, message=None, explain=None):
        page = NOT_FOUND_PAGE if code == 404 else ERROR_PAGE
        self.log_error("code %d, %s", code, message or "")
        self.send_response(code)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(page)))
        self.send_header("X-Robots-Tag", "noindex, nofollow")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(page)


if __name__ == "__main__":
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "5500"))
    server = ThreadingHTTPServer((host, port), SitePreviewHandler)
    print(f"Serving public Konsalta pages at http://{host}:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
