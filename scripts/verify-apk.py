"""Verify that the APK contains the exact current web game and no signing secrets."""
import hashlib
import sys
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parent.parent
apk = Path(sys.argv[1]) if len(sys.argv) > 1 else root / "dist/monks-path-1.0.4.apk"
web_files = ["index.html", "style.css", "premium.css", "expansion.css", "content.js",
             "art.js", "controls.js", "gear.js", "game.js", "premium.js"]
files = [root / name for name in web_files] + sorted((root / "assets").glob("*.png"))
with zipfile.ZipFile(apk) as archive:
    entries = archive.namelist()
    assert all("\\" not in name for name in entries), "Backslash in APK archive path"
    assert not any(".signing" in name or name.endswith((".jks", ".keystore")) for name in entries)
    assert "classes.dex" in entries and "AndroidManifest.xml" in entries
    for source in files:
        entry = "assets/" + source.relative_to(root).as_posix()
        assert hashlib.sha256(archive.read(entry)).digest() == hashlib.sha256(source.read_bytes()).digest(), entry
print(f"PASS: {len(files)} game files match source; DEX/manifest present; no private keys: {apk}")
