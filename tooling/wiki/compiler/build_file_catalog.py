#!/usr/bin/env python3
"""Inventaria fitxers tècnics sense modificar el repositori.

No «cura» orfes, no crea backlinks i no mou ni elimina res. Per defecte usa
només fitxers seguits per Git, conserva identitat per ruta i etiqueta com a
candidats —mai com a brossa— els fitxers sense arestes detectables.

Ús:
  python3 260829_1907_CORE_auditor_orfes_tecnics.py --root /ruta/al/repo
  python3 ... --root /ruta --format markdown --output /tmp/index.md
"""

from __future__ import annotations

import argparse
import hashlib
import json
import mimetypes
import os
import re
import subprocess
import sys
from collections import defaultdict
from pathlib import Path, PurePosixPath


LANGUAGES = {
    ".cjs": "javascript",
    ".css": "css",
    ".html": "html",
    ".js": "javascript",
    ".jsx": "jsx",
    ".json": "json",
    ".mjs": "javascript",
    ".php": "php",
    ".py": "python",
    ".scss": "scss",
    ".sh": "shell",
    ".sql": "sql",
    ".ts": "typescript",
    ".tsx": "tsx",
    ".yaml": "yaml",
    ".yml": "yaml",
}

EXCLUDED_PARTS = {
    ".git",
    ".obsidian",
    ".sdp-reflex",
    ".brain-trash",
    "node_modules",
    "dist",
    "vendor",
    "__pycache__",
}

DENIED_PARTS = {".wwebjs_auth", ".wwebjs_cache", "credentials", "secrets"}
ENTRY_BASENAMES = {
    "index.js", "index.jsx", "index.mjs", "index.ts", "index.tsx",
    "main.js", "main.jsx", "main.mjs", "main.ts", "main.tsx",
    "cli.js", "cli.mjs", "cli.py", "manage.py", "setup.py", "__init__.py",
}

FENCE_RE = re.compile(r"```[\s\S]*?```|~~~[\s\S]*?~~~")
JS_IMPORT_RE = re.compile(
    r"(?:\bfrom\s*|\bimport\s*\(|\brequire\s*\()\s*['\"]([^'\"]+)['\"]"
    r"|^\s*import\s*['\"]([^'\"]+)['\"]",
    re.MULTILINE,
)
PY_IMPORT_RE = re.compile(
    r"^\s*(?:from\s+([A-Za-z0-9_\.]+)\s+import|import\s+([A-Za-z0-9_\.]+))",
    re.MULTILINE,
)
CSS_IMPORT_RE = re.compile(r"@import\s+(?:url\()?['\"]?([^'\"\)\s;]+)")
HTML_REF_RE = re.compile(r"\b(?:src|href)\s*=\s*['\"]([^'\"]+)['\"]", re.IGNORECASE)


def git(root: Path, *args: str, check: bool = True) -> bytes:
    result = subprocess.run(
        ["git", "-C", str(root), *args],
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if check and result.returncode != 0:
        raise RuntimeError(result.stderr.decode("utf-8", errors="replace").strip())
    return result.stdout


def normalise_git_path(raw: str) -> str | None:
    path = PurePosixPath(raw)
    if path.is_absolute() or ".." in path.parts or not path.parts:
        return None
    return path.as_posix()


def index_blobs(root: Path) -> dict[str, str]:
    result: dict[str, str] = {}
    for record in git(root, "ls-files", "-s", "-z").split(b"\0"):
        if not record:
            continue
        head, sep, raw_path = record.partition(b"\t")
        if not sep:
            continue
        fields = head.decode("ascii", errors="replace").split()
        path = normalise_git_path(raw_path.decode("utf-8", errors="surrogateescape"))
        if path and len(fields) >= 3 and fields[2] == "0":
            result[path] = fields[1]
    return result


def source_paths(root: Path, include_untracked: bool) -> tuple[list[str], dict[str, str]]:
    blobs = index_blobs(root)
    paths = set(blobs)
    if include_untracked:
        for raw in git(root, "ls-files", "--others", "--exclude-standard", "-z").split(b"\0"):
            if not raw:
                continue
            path = normalise_git_path(raw.decode("utf-8", errors="surrogateescape"))
            if path:
                paths.add(path)
    return sorted(paths), blobs


def excluded(path: str) -> bool:
    parts = PurePosixPath(path).parts
    return any(part in EXCLUDED_PARTS or part.startswith("90_") for part in parts)


def denied(path: str) -> bool:
    parts = PurePosixPath(path).parts
    name = parts[-1].casefold()
    return (
        any(part.casefold() in DENIED_PARTS for part in parts)
        or name == ".env"
        or name.startswith(".env.")
    )


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def safe_text(path: Path, limit: int = 8 * 1024 * 1024) -> str | None:
    try:
        if path.stat().st_size > limit:
            return None
        return path.read_text(encoding="utf-8", errors="strict")
    except (OSError, UnicodeError):
        return None


def extract_specifiers(language: str, text: str) -> list[str]:
    refs: list[str] = []
    if language in {"javascript", "jsx", "typescript", "tsx"}:
        refs.extend(next(value for value in match if value) for match in JS_IMPORT_RE.findall(text))
    elif language == "python":
        refs.extend(next(value for value in match if value) for match in PY_IMPORT_RE.findall(text))
    elif language in {"css", "scss"}:
        refs.extend(CSS_IMPORT_RE.findall(text))
    elif language in {"html", "php"}:
        refs.extend(HTML_REF_RE.findall(text))
    return sorted(set(refs))


def resolve_relative(source: str, specifier: str, known: set[str]) -> str | None:
    specifier = specifier.split("?", 1)[0].split("#", 1)[0].strip()
    if not specifier or specifier.startswith(("http://", "https://", "data:", "node:")):
        return None
    if specifier.startswith("/"):
        base = PurePosixPath(specifier.removeprefix("/"))
    elif specifier.startswith("."):
        base = PurePosixPath(source).parent / specifier
    else:
        return None
    parts: list[str] = []
    for part in base.parts:
        if part in {"", "."}:
            continue
        if part == "..":
            if not parts:
                return None
            parts.pop()
        else:
            parts.append(part)
    normal = PurePosixPath(*parts).as_posix()
    candidates = [normal]
    if not PurePosixPath(normal).suffix:
        candidates.extend(f"{normal}{suffix}" for suffix in LANGUAGES)
        candidates.extend(f"{normal}/index{suffix}" for suffix in LANGUAGES)
    return next((candidate for candidate in candidates if candidate in known), None)


def kind_for(path: str, language: str) -> str:
    parts = PurePosixPath(path).parts
    if "tests" in parts or any(part.startswith("test") for part in parts):
        return "test"
    if path.startswith("tooling/") or path.startswith("scripts/"):
        return "tooling"
    if language in {"json", "yaml"} or "config" in PurePosixPath(path).name.casefold():
        return "config"
    if language in {"css", "scss"}:
        return "style"
    if language in {"html", "php"}:
        return "markup"
    if language == "sql":
        return "schema"
    return "source"


def documented_by(root: Path, technical_paths: list[str], all_paths: list[str]) -> dict[str, list[str]]:
    docs: list[tuple[str, str]] = []
    for rel in all_paths:
        if not rel.endswith(".md") or excluded(rel) or denied(rel):
            continue
        full = root / rel
        if full.is_symlink():
            continue
        text = safe_text(full)
        if text is not None:
            docs.append((rel, FENCE_RE.sub("", text)))
    result: dict[str, list[str]] = defaultdict(list)
    for technical in technical_paths:
        basename = PurePosixPath(technical).name
        quoted = re.compile(rf"`[^`\n]*{re.escape(basename)}[^`\n]*`")
        for doc_path, text in docs:
            if technical in text or quoted.search(text):
                result[technical].append(doc_path)
    return {key: sorted(value) for key, value in result.items()}


def audit(root: Path, include_untracked: bool) -> dict[str, object]:
    root = root.resolve()
    if not (root / ".git").exists():
        raise ValueError(f"No és una arrel Git: {root}")

    all_paths, blobs = source_paths(root, include_untracked)
    denied_count = 0
    skipped_symlinks = 0
    technical: list[str] = []
    texts: dict[str, str] = {}
    specifiers: dict[str, list[str]] = {}

    for rel in all_paths:
        suffix = PurePosixPath(rel).suffix.casefold()
        if excluded(rel) or suffix not in LANGUAGES:
            continue
        if denied(rel):
            denied_count += 1
            continue
        full = root / rel
        if full.is_symlink():
            skipped_symlinks += 1
            continue
        if not full.is_file():
            continue
        technical.append(rel)
        text = safe_text(full)
        if text is not None:
            texts[rel] = text
            specifiers[rel] = extract_specifiers(LANGUAGES[suffix], text)

    known = set(technical)
    imports: dict[str, list[str]] = {}
    imported_by: dict[str, list[str]] = defaultdict(list)
    unresolved: dict[str, list[str]] = {}
    for source, refs in specifiers.items():
        resolved: list[str] = []
        missing: list[str] = []
        for ref in refs:
            target = resolve_relative(source, ref, known)
            if target:
                resolved.append(target)
                imported_by[target].append(source)
            elif ref.startswith((".", "/")):
                missing.append(ref)
        imports[source] = sorted(set(resolved))
        if missing:
            unresolved[source] = sorted(set(missing))

    doc_edges = documented_by(root, technical, all_paths)
    package_text = safe_text(root / "package.json") or ""
    entries: list[dict[str, object]] = []
    candidates: list[str] = []

    for rel in technical:
        full = root / rel
        suffix = PurePosixPath(rel).suffix.casefold()
        language = LANGUAGES[suffix]
        roots: list[str] = []
        if PurePosixPath(rel).name in ENTRY_BASENAMES:
            roots.append("conventional-entrypoint")
        if rel in package_text:
            roots.append("package-script-or-manifest")
        if rel.startswith(("public/", "wordpress-plugin/")):
            roots.append("published-or-integration-asset")
        inbound = sorted(set(imported_by.get(rel, [])))
        docs = doc_edges.get(rel, [])
        if not inbound and not docs and not roots:
            candidates.append(rel)
        stat = full.stat()
        entries.append({
            "path": rel,
            "kind": kind_for(rel, language),
            "language": language,
            "mime": mimetypes.guess_type(rel)[0] or "application/octet-stream",
            "bytes": stat.st_size,
            "sha256": sha256(full),
            "git_index_blob": blobs.get(rel),
            "tracked": rel in blobs,
            "imports": imports.get(rel, []),
            "imported_by": inbound,
            "documented_by": docs,
            "root_reasons": roots,
            "sensitivity": "public" if rel.startswith("public/") else "internal",
            "rag_policy": "chunk" if rel in texts else "metadata-only",
        })

    head = git(root, "rev-parse", "HEAD", check=False).decode("ascii", errors="replace").strip() or None
    dirty = bool(git(root, "status", "--porcelain", check=False).strip())
    return {
        "schema": "sdp.technical-catalog.v1",
        "root": ".",
        "source_commit": head,
        "worktree_dirty": dirty,
        "include_untracked": include_untracked,
        "summary": {
            "technical_files": len(entries),
            "candidate_unreferenced": len(candidates),
            "unresolved_relative_references": sum(len(value) for value in unresolved.values()),
            "denied_sensitive_paths": denied_count,
            "skipped_symlinks": skipped_symlinks,
        },
        "limitations": [
            "Un candidat no referenciat no és brossa ni autoritza moure'l o eliminar-lo.",
            "Imports dinàmics, aliases, plugins, reflexió i cridadors externs poden no resoldre's.",
            "El graf Markdown canònic s'ha d'auditar amb autoneteja_wiki/parse.mjs, no amb este script.",
        ],
        "unresolved_relative_references": unresolved,
        "candidate_unreferenced": sorted(candidates),
        "entries": sorted(entries, key=lambda item: str(item["path"])),
    }


def markdown(result: dict[str, object]) -> str:
    summary = result["summary"]
    assert isinstance(summary, dict)
    lines = [
        "# Índex tècnic generat",
        "",
        "> Informe read-only. Un candidat no referenciat no és brossa.",
        "",
        f"- Commit font: `{result.get('source_commit') or 'N/A'}`",
        f"- Worktree brut: `{result.get('worktree_dirty')}`",
        f"- Fitxers tècnics: `{summary['technical_files']}`",
        f"- Candidats sense arestes detectades: `{summary['candidate_unreferenced']}`",
        f"- Referències relatives no resoltes: `{summary['unresolved_relative_references']}`",
        f"- Rutes sensibles denegades: `{summary['denied_sensitive_paths']}`",
        "",
        "## Candidats a revisió humana",
        "",
    ]
    candidates = result["candidate_unreferenced"]
    assert isinstance(candidates, list)
    lines.extend(f"- `{path}`" for path in candidates)
    if not candidates:
        lines.append("Cap.")
    lines.extend(["", "## Catàleg", "", "| Ruta | Tipus | Llenguatge | Bytes | Entrants | Docs |", "|---|---|---:|---:|---:|---:|"])
    entries = result["entries"]
    assert isinstance(entries, list)
    for item in entries:
        assert isinstance(item, dict)
        lines.append(
            f"| `{item['path']}` | {item['kind']} | {item['language']} | {item['bytes']} | "
            f"{len(item['imported_by'])} | {len(item['documented_by'])} |"
        )
    return "\n".join(lines).rstrip() + "\n"


def atomic_write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    temporary.write_text(content, encoding="utf-8")
    os.replace(temporary, path)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, required=True, help="Arrel Git del projecte")
    parser.add_argument("--include-untracked", action="store_true", help="Inclou untracked no ignorats")
    parser.add_argument("--format", choices=["json", "markdown"], default="json")
    parser.add_argument("--output", type=Path, help="Escriu atòmicament; per defecte usa stdout")
    args = parser.parse_args()
    try:
        result = audit(args.root, args.include_untracked)
        rendered = markdown(result) if args.format == "markdown" else json.dumps(
            result, ensure_ascii=False, indent=2
        ) + "\n"
        if args.output:
            atomic_write(args.output, rendered)
        else:
            sys.stdout.write(rendered)
        return 0
    except (OSError, RuntimeError, ValueError) as error:
        print(f"auditor_orfes_tecnics: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())

