#!/usr/bin/env python3
"""Planificador i aplicador conservador per a la higiene mecànica del Brain.

No decideix doctrina. Genera un pla JSON amb hashes i, només amb `apply
--apply`, executa operacions verificades. Cap fitxer es destrueix: la brutícia
va a `.brain-trash` i l'arxiu històric vell es mou a l'arxiu canònic.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import sys
import tarfile
import zipfile
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath


ANCHOR = "**Ancoratge de Seguretat:** [[00_INDEX]]"
SENSITIVE_MARKERS = (
    ".iaia_auth", "creds.json", "pre-key-", "session-", "sender-key-",
    "app-state-sync-key-", "private_key", "id_rsa", ".env",
)
SAFE_ENV_NAMES = {".env.example", ".env.sample", ".env.template"}


def utc_stamp() -> str:
    return datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def inside(root: Path, relative: str) -> Path:
    root = root.resolve()
    if Path(relative).is_absolute():
        raise ValueError(f"El pla conté una ruta absoluta: {relative}")
    raw_candidate = root / relative
    cursor = root
    for part in Path(relative).parts:
        cursor /= part
        if cursor.is_symlink():
            raise ValueError(f"El pla travessa un symlink: {relative}")
    candidate = raw_candidate.resolve()
    try:
        candidate.relative_to(root)
    except ValueError as error:
        raise ValueError(f"El pla escapa de l'arrel: {relative}") from error
    return candidate


def rel(path: Path, root: Path) -> str:
    return path.relative_to(root).as_posix()


def archive_member_names(path: Path):
    try:
        if zipfile.is_zipfile(path):
            with zipfile.ZipFile(path) as archive:
                yield from archive.namelist()
        elif tarfile.is_tarfile(path):
            with tarfile.open(path, "r:*") as archive:
                for member in archive.getmembers():
                    yield member.name
    except (OSError, tarfile.TarError, zipfile.BadZipFile):
        return


def sensitive_name(name: str) -> bool:
    folded = name.replace("\\", "/").casefold()
    if any(marker != ".env" and marker in folded for marker in SENSITIVE_MARKERS):
        return True
    parts = PurePosixPath(folded).parts
    return any(
        (part == ".env" or part.startswith(".env.")) and part not in SAFE_ENV_NAMES
        for part in parts
    )


def sensitive_archive(path: Path) -> tuple[bool, int]:
    hits = 0
    unsafe = False
    for name in archive_member_names(path):
        pure = PurePosixPath(name)
        if pure.is_absolute() or ".." in pure.parts:
            unsafe = True
        hits += int(sensitive_name(name))
    return unsafe, hits


def action(kind: str, source: Path, root: Path, reason: str, destination: str | None = None) -> dict[str, object]:
    item: dict[str, object] = {
        "kind": kind,
        "source": rel(source, root),
        "sha256": sha256(source),
        "reason": reason,
    }
    if destination:
        item["destination"] = destination
    return item


def plan(root: Path) -> dict[str, object]:
    operations: list[dict[str, object]] = []
    legacy = root / "_wiki_de_poble" / "90_arxiu_historic"
    for path in sorted(root.rglob("*")):
        if (
            not path.is_file()
            or ".brain-trash" in path.parts
            or ".brain-reports" in path.parts
            or path.is_symlink()
        ):
            continue
        if legacy in path.parents:
            continue
        relative = rel(path, root)
        folded_relative = relative.casefold()
        if path.name == ".DS_Store" or (path.name.startswith(".!") and path.name.endswith(".DS_Store")):
            operations.append(action("trash", path, root, "artefacte local de Finder"))
            continue
        if path.name == "audit_result.json":
            operations.append(action("trash", path, root, "informe generat, no font canònica"))
            continue
        if relative.endswith(".obsidian/workspace.json"):
            operations.append(action("trash", path, root, "estat local de la interfície Obsidian"))
            continue
        if "/var/" in f"/{relative}/" and (path.name == "owner.lock" or ".lock.stale-" in path.name):
            operations.append(action("trash", path, root, "estat efímer del runtime"))
            continue
        if sensitive_name(folded_relative):
            operations.append(action(
                "manual", path, root,
                "ruta compatible amb credencial; revocar i purgar, no arxivar automàticament",
            ))
            continue
        lower = path.name.casefold()
        if lower.endswith((".zip", ".tar", ".tar.gz", ".tgz", ".gz")):
            unsafe, hits = sensitive_archive(path)
            if unsafe or hits:
                operations.append(action(
                    "manual", path, root,
                    f"arxiu sensible: membres_credencial={hits}, rutes_insegures={int(unsafe)}; revocar i purgar historial",
                ))
                continue
        if path.suffix.lower() == ".md":
            text = path.read_text(encoding="utf-8", errors="replace")
            if text.count(ANCHOR) > 1 and legacy not in path.parents:
                operations.append(action("normalize_anchor", path, root, "ancoratge automàtic duplicat"))

    if legacy.is_dir():
        for source in sorted(legacy.rglob("*")):
            if not source.is_file() or source.is_symlink():
                continue
            relative = rel(source, root)
            if sensitive_name(relative):
                operations.append(action(
                    "manual", source, root,
                    "ruta compatible amb credencial; revocar i purgar, no arxivar automàticament",
                ))
                continue
            if source.name == ".DS_Store" or (source.name.startswith(".!") and source.name.endswith(".DS_Store")):
                operations.append(action("trash", source, root, "artefacte local de Finder"))
                continue
            if source.name == "audit_result.json":
                operations.append(action("trash", source, root, "informe generat, no font canònica"))
                continue
            lower = source.name.casefold()
            if lower.endswith((".zip", ".tar", ".tar.gz", ".tgz", ".gz")):
                unsafe, hits = sensitive_archive(source)
                if unsafe or hits:
                    operations.append(action(
                        "manual", source, root,
                        f"arxiu sensible: membres_credencial={hits}, rutes_insegures={int(unsafe)}; revocar i purgar historial",
                    ))
                    continue
            name_match = re.match(r"^(\d{2})(\d{2})(\d{2})", source.name)
            bucket = f"20{name_match.group(1)}_{name_match.group(2)}" if name_match else "sense_data"
            destination = (
                Path("_wiki_de_poble/04_ARXIU_Documents_Historics")
                / bucket / "legacy_pre_canonical" / source.relative_to(legacy)
            ).as_posix()
            item = action("move", source, root, "fusionar el segon arxiu històric", destination)
            if source.suffix.lower() == ".md":
                text = source.read_text(encoding="utf-8", errors="replace")
                if text.count(ANCHOR) > 1:
                    item["normalize_anchor"] = True
            operations.append(item)

    seen_sources: set[str] = set()
    for item in operations:
        source_name = str(item["source"])
        if source_name in seen_sources:
            raise ValueError(f"Més d'una operació per a la mateixa font: {source_name}")
        seen_sources.add(source_name)

    rank = {"manual": 0, "move": 1, "normalize_anchor": 2, "trash": 3}
    operations.sort(key=lambda item: (rank[str(item["kind"])], str(item["source"])))
    return {
        "schema": "socdepoble.brain-distill-plan.v1",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "root_name": root.name,
        "operations": operations,
    }


def normalise_anchor(text: str) -> str:
    lines = [line for line in text.splitlines() if ANCHOR not in line]
    body = "\n".join(lines).rstrip()
    return f"{body}\n\n---\n\n{ANCHOR}\n"


def atomic_text(path: Path, text: str) -> None:
    temporary = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    temporary.write_text(text, encoding="utf-8")
    os.replace(temporary, path)


def validate_operation(root: Path, item: dict[str, object]) -> Path:
    source = inside(root, str(item["source"]))
    if source.is_symlink() or not source.is_file():
        raise ValueError(f"Font absent o symlink: {item['source']}")
    if sha256(source) != item.get("sha256"):
        raise ValueError(f"Hash canviat des del pla: {item['source']}")
    if item["kind"] == "move":
        destination = inside(root, str(item["destination"]))
        if destination.exists():
            raise ValueError(f"La destinació ja existeix: {item['destination']}")
    return source


def apply_plan(root: Path, document: dict[str, object], apply: bool, trash_name: str) -> int:
    root = root.resolve()
    if document.get("schema") != "socdepoble.brain-distill-plan.v1":
        raise ValueError("Esquema de pla desconegut")
    operations = list(document.get("operations", []))
    executable = [item for item in operations if item.get("kind") != "manual"]
    for item in executable:
        validate_operation(root, item)
    for item in operations:
        prefix = "SKIP" if item.get("kind") == "manual" else ("APPLY" if apply else "WOULD")
        destination = f" -> {item['destination']}" if item.get("destination") else ""
        print(f"{prefix:5} {item['kind']:16} {item['source']}{destination}")
    if not apply:
        print("Dry-run: no s'ha modificat res. Afig --apply per executar.")
        return 0

    trash_root = inside(root, trash_name) / utc_stamp()
    trash_root.mkdir(parents=True, exist_ok=False)
    receipt_path = trash_root / "receipt.json"
    receipt: dict[str, object] = {
        "schema": "socdepoble.brain-distill-receipt.v1",
        "status": "in_progress",
        "plan_created_at": document.get("created_at"),
        "started_at": datetime.now(timezone.utc).isoformat(),
        "manual_skipped": [item for item in operations if item.get("kind") == "manual"],
        "current_operation": None,
        "completed": [],
    }
    write_json(receipt_path, receipt)

    def backup(source: Path, item: dict[str, object]) -> Path:
        destination = trash_root / "backups" / str(item["source"])
        destination.parent.mkdir(parents=True, exist_ok=True)
        if destination.exists():
            raise FileExistsError(destination)
        shutil.copy2(source, destination)
        return destination

    try:
        for item in executable:
            receipt["current_operation"] = item
            write_json(receipt_path, receipt)
            source = inside(root, str(item["source"]))
            kind = item["kind"]
            applied: dict[str, object] = dict(item)
            if kind == "trash":
                destination = trash_root / "removed" / str(item["source"])
                destination.parent.mkdir(parents=True, exist_ok=True)
                if destination.exists():
                    raise FileExistsError(destination)
                shutil.move(str(source), str(destination))
                applied["applied_destination"] = rel(destination, root)
            elif kind == "move":
                destination = inside(root, str(item["destination"]))
                destination.parent.mkdir(parents=True, exist_ok=True)
                if item.get("normalize_anchor"):
                    original = backup(source, item)
                    applied["backup"] = rel(original, root)
                    atomic_text(source, normalise_anchor(source.read_text(encoding="utf-8")))
                shutil.move(str(source), str(destination))
            elif kind == "normalize_anchor":
                original = backup(source, item)
                applied["backup"] = rel(original, root)
                atomic_text(source, normalise_anchor(source.read_text(encoding="utf-8")))
            else:
                raise ValueError(f"Operació no admesa: {kind}")
            completed = receipt["completed"]
            assert isinstance(completed, list)
            completed.append(applied)
            receipt["current_operation"] = None
            write_json(receipt_path, receipt)
    except Exception as error:
        receipt["status"] = "partial_failure"
        receipt["error_type"] = type(error).__name__
        receipt["finished_at"] = datetime.now(timezone.utc).isoformat()
        write_json(receipt_path, receipt)
        raise

    receipt["status"] = "complete"
    receipt["finished_at"] = datetime.now(timezone.utc).isoformat()
    write_json(receipt_path, receipt)
    print(f"Aplicades {len(receipt['completed'])} operacions. Rebut: {rel(receipt_path, root)}")
    return 0


def write_json(path: Path, value: dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(temporary, path)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)
    planner = subparsers.add_parser("plan", help="Genera un pla sense modificar")
    planner.add_argument("root", type=Path)
    planner.add_argument("--output", type=Path, required=True)
    applier = subparsers.add_parser("apply", help="Valida o aplica un pla")
    applier.add_argument("root", type=Path)
    applier.add_argument("plan", type=Path)
    applier.add_argument("--apply", action="store_true", help="Confirma l'aplicació")
    applier.add_argument("--trash", default=".brain-trash", help="Paperera relativa")
    args = parser.parse_args()
    try:
        root = args.root.resolve()
        if not root.is_dir():
            raise ValueError(f"No és un directori: {root}")
        if args.command == "plan":
            document = plan(root)
            write_json(args.output, document)
            counts: dict[str, int] = {}
            for item in document["operations"]:
                counts[str(item["kind"])] = counts.get(str(item["kind"]), 0) + 1
            print(json.dumps(counts, ensure_ascii=False, sort_keys=True))
            return 0
        document = json.loads(args.plan.read_text(encoding="utf-8"))
        return apply_plan(root, document, args.apply, args.trash)
    except (KeyError, OSError, UnicodeError, ValueError, json.JSONDecodeError) as error:
        print(f"brain_distill: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
