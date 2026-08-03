#!/usr/bin/env python3
"""Auditoria estàtica i no destructiva del Brain i el codi de Sóc de Poble.

No necessita paquets externs. No obri el contingut de credencials empaquetades:
només inspecciona noms de membres dins d'arxius ZIP/TAR.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import tarfile
import zipfile
from collections import Counter, defaultdict
from dataclasses import asdict, dataclass
from pathlib import Path, PurePosixPath
from typing import Iterable, Iterator


SEVERITY_ORDER = {"critical": 4, "high": 3, "medium": 2, "low": 1, "info": 0}
TEXT_SUFFIXES = {
    ".css", ".html", ".js", ".jsx", ".json", ".md", ".mjs", ".py",
    ".sh", ".toml", ".ts", ".tsx", ".txt", ".yaml", ".yml",
}
CODE_SUFFIXES = {".js", ".jsx", ".mjs", ".ts", ".tsx"}
ARCHIVE_SUFFIXES = {".zip", ".tar", ".tgz", ".gz"}
WIKILINK_RE = re.compile(r"(?<!!)\[\[([^\]]+)\]\]")
FENCE_RE = re.compile(r"```[\s\S]*?```|~~~[\s\S]*?~~~")
IMPORT_RE = re.compile(
    r"(?:from\s*|import\s*\()\s*[\"']([^\"']+)[\"']|^\s*import\s*[\"']([^\"']+)[\"']",
    re.MULTILINE,
)
ASSET_RE = re.compile(r"[\"'](/assets/[^\"'#?]+)")
SECRET_VALUE_PATTERNS = {
    "google-api-key": re.compile(r"\bAIza[0-9A-Za-z_-]{30,}\b"),
    "openai-key": re.compile(r"\bsk-[A-Za-z0-9_-]{20,}\b"),
    "private-key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "jwt": re.compile(r"\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b"),
}


@dataclass(frozen=True)
class Finding:
    code: str
    severity: str
    category: str
    message: str
    path: str | None = None
    line: int | None = None
    evidence: str | None = None
    remediation: str | None = None


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def rel(path: Path, root: Path) -> str:
    return path.relative_to(root).as_posix()


def safe_text(path: Path, limit: int = 8 * 1024 * 1024) -> str | None:
    try:
        if path.stat().st_size > limit or path.suffix.lower() not in TEXT_SUFFIXES:
            return None
        return path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return None


def parse_frontmatter(text: str) -> tuple[dict[str, object], str, bool]:
    """Parser deliberadament menut: valida claus top-level i llistes YAML simples."""
    match = re.match(r"^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)", text)
    if not match:
        return {}, text, False
    block = match.group(1)
    data: dict[str, object] = {}
    current_list: str | None = None
    for raw in block.splitlines():
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        item = re.match(r"^\s+-\s+(.*?)\s*$", raw)
        if item and current_list:
            value = item.group(1).strip().strip("\"'")
            assert isinstance(data[current_list], list)
            data[current_list].append(value)
            continue
        pair = re.match(r"^([A-Za-z0-9_-]+):\s*(.*?)\s*$", raw)
        if not pair:
            current_list = None
            continue
        key, value = pair.groups()
        if not value:
            data[key] = []
            current_list = key
        elif value.startswith("[") and value.endswith("]"):
            data[key] = [part.strip().strip("\"'") for part in value[1:-1].split(",") if part.strip()]
            current_list = None
        else:
            data[key] = value.strip().strip("\"'")
            current_list = None
    return data, text[match.end():], True


def line_number(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def resolve_relative_import(source: Path, specifier: str) -> Path | None:
    base = source.parent / specifier
    candidates = [
        base,
        Path(f"{base}.js"),
        Path(f"{base}.jsx"),
        Path(f"{base}.mjs"),
        Path(f"{base}.ts"),
        Path(f"{base}.tsx"),
        base / "index.js",
        base / "index.jsx",
        base / "index.mjs",
        base / "index.ts",
        base / "index.tsx",
    ]
    return next((candidate for candidate in candidates if candidate.exists()), None)


def iter_archive_names(path: Path) -> Iterator[str]:
    try:
        if zipfile.is_zipfile(path):
            with zipfile.ZipFile(path) as archive:
                yield from archive.namelist()
            return
        if tarfile.is_tarfile(path):
            with tarfile.open(path, mode="r:*") as archive:
                for member in archive.getmembers():
                    yield member.name
    except (OSError, tarfile.TarError, zipfile.BadZipFile):
        return


def normalise_mirror(text: str) -> str:
    _, body, _ = parse_frontmatter(text)
    body = re.sub(r"\n*---\s*\n\s*\*\*Ancoratge de Seguretat:\*\*\s*\[\[00_INDEX\]\]\s*$", "", body)
    body = re.sub(r"\s+", " ", body).strip()
    return body


class Auditor:
    def __init__(self, root: Path, policy: dict[str, object]):
        self.root = root.resolve()
        self.policy = policy
        self.findings: list[Finding] = []
        self.metrics: dict[str, object] = {}

    def add(self, code: str, severity: str, category: str, message: str, **kwargs: object) -> None:
        self.findings.append(Finding(code, severity, category, message, **kwargs))

    def run(self) -> dict[str, object]:
        if not self.root.is_dir():
            raise ValueError(f"No és un directori: {self.root}")
        self.check_layout()
        self.check_files_and_secrets()
        self.check_package()
        self.check_code()
        self.check_wiki()
        counts = Counter(finding.severity for finding in self.findings)
        self.metrics["findings_by_severity"] = dict(counts)
        return {
            "schema": "socdepoble.brain-audit.v1",
            "root": ".",
            "metrics": self.metrics,
            "findings": [asdict(finding) for finding in sorted(
                self.findings,
                key=lambda item: (-SEVERITY_ORDER[item.severity], item.path or "", item.line or 0, item.code),
            )],
        }

    def check_layout(self) -> None:
        for required in self.policy.get("required_project_files_all", []):
            if not (self.root / str(required)).exists():
                self.add(
                    "layout.required-missing", "high", "layout",
                    f"Falta un fitxer estructural obligatori: {required}", path=str(required),
                    remediation="Restaura'l o deixa de declarar el paquet com a codi font complet.",
                )
        for alternatives in self.policy.get("required_project_files_any", []):
            names = [str(item) for item in alternatives]
            if not any((self.root / name).exists() for name in names):
                self.add(
                    "layout.alternative-set-missing", "high", "layout",
                    f"No existeix cap alternativa requerida: {', '.join(names)}",
                    evidence=" | ".join(names),
                    remediation="Afig una única font canònica i versionada.",
                )
        if not (self.root / "public").is_dir():
            self.add(
                "layout.public-missing", "high", "layout",
                "Falta public/ encara que el codi referencia /assets/.", path="public",
                remediation="Inclou els assets reals o elimina les referències mortes.",
            )

    def check_files_and_secrets(self) -> None:
        sensitive_markers = [str(value).casefold() for value in self.policy.get("sensitive_path_markers", [])]
        junk_names = set(str(value) for value in self.policy.get("junk_names", []))
        generated = set(str(value) for value in self.policy.get("generated_artifacts", []))
        ignored_dirs = set(str(value) for value in self.policy.get("ignored_dirs", []))
        file_count = 0
        total_bytes = 0
        exact: dict[str, list[str]] = defaultdict(list)
        for path in self.root.rglob("*"):
            if not path.is_file():
                continue
            if any(part in ignored_dirs for part in path.relative_to(self.root).parts[:-1]):
                continue
            file_count += 1
            try:
                total_bytes += path.stat().st_size
            except OSError:
                pass
            relative = rel(path, self.root)
            folded = relative.casefold()
            if path.name in junk_names or path.name.startswith(".!" ) and path.name.endswith(".DS_Store"):
                self.add(
                    "hygiene.junk", "low", "hygiene", "Artefacte local que no ha d'entrar al repositori.",
                    path=relative, remediation="Mou-lo a paperera i ignora'l en Git/ZIP.",
                )
            if path.name in generated:
                self.add(
                    "hygiene.generated", "low", "hygiene", "Resultat generat versionat com si fora font.",
                    path=relative, remediation="Regenera'l en CI o fora del vault; no el tractes com autoritat.",
                )
            if "/var/" in f"/{folded}/" and (path.name == "owner.lock" or ".lock.stale-" in path.name):
                self.add(
                    "hygiene.runtime-state", "medium", "hygiene", "Estat efímer de runtime empaquetat amb el codi.",
                    path=relative, remediation="Elimina'l del repositori i afig bot/var/ a .gitignore.",
                )
            def marker_matches(marker: str) -> bool:
                if marker != ".env":
                    return marker in folded
                if path.name.casefold() in {".env.example", ".env.sample", ".env.template"}:
                    return False
                return any(
                    part.casefold() == ".env" or part.casefold().startswith(".env.")
                    for part in path.parts
                )

            direct_sensitive = next((marker for marker in sensitive_markers if marker_matches(marker)), None)
            if direct_sensitive:
                self.add(
                    "security.sensitive-path", "critical", "security",
                    "Ruta compatible amb credencials o claus privades.", path=relative,
                    evidence=f"marker={direct_sensitive}",
                    remediation="Revoca les credencials, elimina el fitxer i purga'l de l'historial.",
                )
            if path.suffix.lower() in ARCHIVE_SUFFIXES or path.name.endswith((".tar.gz", ".tgz")):
                hits = []
                unsafe = []
                for name in iter_archive_names(path):
                    pure = PurePosixPath(name)
                    if pure.is_absolute() or ".." in pure.parts:
                        unsafe.append(name)
                    folded_name = name.casefold()
                    if any(marker in folded_name for marker in sensitive_markers):
                        hits.append(name)
                if unsafe:
                    self.add(
                        "security.archive-traversal", "critical", "security",
                        "L'arxiu conté rutes absolutes o traversal '..'.", path=relative,
                        evidence=f"membres_insegurs={len(unsafe)}",
                        remediation="No l'extragues; elimina'l o reconstrueix-lo amb rutes segures.",
                    )
                if hits:
                    self.add(
                        "security.credentials-in-archive", "critical", "security",
                        "L'arxiu conté membres amb noms de credencial/sessió.", path=relative,
                        evidence=f"membres_sensibles={len(hits)}; noms_omesos=1",
                        remediation="Revoca la sessió, elimina l'arxiu i purga'l de l'historial Git i de còpies compartides.",
                    )
            text = safe_text(path)
            if text is not None and ".obsidian/plugins/" not in relative:
                for label, pattern in SECRET_VALUE_PATTERNS.items():
                    match = pattern.search(text)
                    if match:
                        self.add(
                            "security.secret-value", "critical", "security",
                            "Possible secret incrustat; el valor s'ha omés de l'informe.", path=relative,
                            line=line_number(text, match.start()), evidence=f"pattern={label}",
                            remediation="Revoca'l, elimina'l de la font i usa variables d'entorn/secret manager.",
                        )
            try:
                if path.stat().st_size <= 2 * 1024 * 1024:
                    exact[sha256_file(path)].append(relative)
            except OSError:
                pass
        for paths in exact.values():
            if len(paths) > 1:
                self.add(
                    "hygiene.exact-duplicate", "medium", "hygiene",
                    "Fitxers exactament duplicats.", path=paths[0], evidence=" | ".join(paths),
                    remediation="Conserva una font canònica i genera o enllaça la resta.",
                )
        self.metrics.update({"files": file_count, "bytes": total_bytes})

    def check_package(self) -> None:
        package_path = self.root / "package.json"
        if not package_path.is_file():
            return
        try:
            package = json.loads(package_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as error:
            self.add(
                "package.invalid-json", "critical", "package", "package.json no és JSON vàlid.",
                path="package.json", evidence=type(error).__name__,
            )
            return
        script_target_re = re.compile(r"(?<![-\w])([._A-Za-z0-9/-]+\.(?:cjs|js|json|mjs|py|sh))(?![-\w])")
        for name, command in package.get("scripts", {}).items():
            for target in script_target_re.findall(str(command)):
                if "*" in target:
                    continue
                if not (self.root / target).exists():
                    self.add(
                        "package.script-target-missing", "high", "package",
                        f"L'script npm '{name}' apunta a un fitxer inexistent.", path="package.json",
                        evidence=target,
                        remediation="Restaura el target o elimina l'script fals.",
                    )
        dependencies = {
            **package.get("dependencies", {}),
            **package.get("devDependencies", {}),
        }
        if "workbox-window" in dependencies and not any(
            "workbox-window" in (safe_text(path) or "")
            for path in (self.root / "src").rglob("*") if path.is_file()
        ):
            self.add(
                "package.unused-workbox", "medium", "package",
                "workbox-window està declarat però no s'importa.", path="package.json",
                remediation="Elimina'l amb la PWA/offline o documenta un ús real verificat.",
            )
        if "lucide" in dependencies:
            self.add(
                "package.duplicate-icon-package", "medium", "package",
                "Es declaren lucide i lucide-react; el codi React només necessita lucide-react.",
                path="package.json", remediation="Elimina lucide si no hi ha cap import directe verificat.",
            )

    def check_code(self) -> None:
        source_roots = [self.root / "src", self.root / "bot"]
        code_files = [
            path for source_root in source_roots if source_root.exists()
            for path in source_root.rglob("*") if path.is_file() and path.suffix.lower() in CODE_SUFFIXES
        ]
        missing_imports = 0
        missing_assets: set[str] = set()
        bare_imports: Counter[str] = Counter()
        for path in code_files:
            text = safe_text(path)
            if text is None:
                continue
            relative = rel(path, self.root)
            for match in IMPORT_RE.finditer(text):
                specifier = match.group(1) or match.group(2)
                if specifier.startswith("."):
                    if resolve_relative_import(path, specifier) is None:
                        missing_imports += 1
                        self.add(
                            "code.import-missing", "critical", "code",
                            "Import relatiu no resolt.", path=relative,
                            line=line_number(text, match.start()), evidence=specifier,
                            remediation="Restaura el mòdul o elimina la branca morta.",
                        )
                elif not specifier.startswith(("/", "node:", "virtual:")):
                    package = "/".join(specifier.split("/")[:2]) if specifier.startswith("@") else specifier.split("/")[0]
                    bare_imports[package] += 1
            for match in ASSET_RE.finditer(text):
                asset = match.group(1)
                if not (self.root / "public" / asset.removeprefix("/")).exists():
                    missing_assets.add(asset)
            for match in re.finditer(r"dangerouslySetInnerHTML", text):
                self.add(
                    "security.html-injection-sink", "high", "security",
                    "Punt d'injecció HTML; exigeix dades estructurades o sanitització robusta.",
                    path=relative, line=line_number(text, match.start()),
                    remediation="Elimina dangerouslySetInnerHTML per a dades remotes/usuari; renderitza nodes React.",
                )
            for match in re.finditer(r"\.replace\(/<script[\s\S]{0,160}?<style", text, re.IGNORECASE):
                self.add(
                    "security.regex-sanitizer", "critical", "security",
                    "Un regex que lleva script/style no és un sanititzador HTML.", path=relative,
                    line=line_number(text, match.start()),
                    remediation="No acceptes HTML o usa una allowlist provada a la frontera d'entrada.",
                )
            for marker in self.policy.get("obsolete_markers", []):
                for match in re.finditer(re.escape(str(marker)), text, re.IGNORECASE):
                    self.add(
                        "modernisation.obsolete-marker", "medium", "modernisation",
                        "Marcador del paradigma offline/A10 que necessita decisió de migració.",
                        path=relative, line=line_number(text, match.start()), evidence=str(marker),
                        remediation="Elimina la implementació si no té un cas d'ús vigent; conserva només preferències locals simples.",
                    )
        for asset in sorted(missing_assets):
            self.add(
                "code.asset-missing", "high", "code",
                "Asset referenciat però absent del paquet auditat.", path=asset,
                remediation="Inclou l'asset o substitueix la referència per una URL/asset real.",
            )
        self.metrics.update({
            "code_files": len(code_files),
            "missing_relative_imports": missing_imports,
            "missing_asset_references": len(missing_assets),
            "bare_imports": dict(sorted(bare_imports.items())),
        })

    def check_wiki(self) -> None:
        wiki = self.root / str(self.policy.get("wiki_dir", "_wiki_de_poble"))
        if not wiki.is_dir():
            self.add("wiki.missing", "critical", "wiki", "No existeix el vault de la Wiki.", path=rel(wiki, self.root))
            return
        markdown = [path for path in wiki.rglob("*.md") if ".obsidian" not in path.parts]
        by_stem: dict[str, list[Path]] = defaultdict(list)
        by_name: dict[str, list[Path]] = defaultdict(list)
        by_rel: dict[str, Path] = {}
        all_files = [path for path in wiki.rglob("*") if path.is_file() and ".obsidian" not in path.parts]
        for path in all_files:
            by_stem[path.stem.casefold()].append(path)
            by_name[path.name.casefold()].append(path)
            by_rel[path.relative_to(wiki).as_posix().casefold()] = path
            by_rel[path.relative_to(wiki).with_suffix("").as_posix().casefold()] = path
        active_zones = set(str(value) for value in self.policy.get("active_zones", []))
        allowed_states = set(str(value) for value in self.policy.get("allowed_states", []))
        allowed_types = set(str(value) for value in self.policy.get("allowed_types", []))
        required_frontmatter = [str(value) for value in self.policy.get("required_frontmatter", [])]
        inbound: Counter[Path] = Counter()
        link_count = 0
        broken_count = 0
        active_docs: list[Path] = []
        state_counts: Counter[str] = Counter()
        for path in markdown:
            relative = path.relative_to(wiki)
            text = safe_text(path) or ""
            data, body, has_frontmatter = parse_frontmatter(text)
            if relative.parts and relative.parts[0] in active_zones and "00_AGENTS_I_SKILLS_MIRROR" not in relative.parts:
                active_docs.append(path)
                if not has_frontmatter:
                    self.add(
                        "wiki.frontmatter-missing", "high", "wiki", "Document actiu sense frontmatter.",
                        path=rel(path, self.root), remediation="Afig l'esquema canònic mínim.",
                    )
                for key in required_frontmatter:
                    if not data.get(key):
                        self.add(
                            "wiki.frontmatter-key-missing", "medium", "wiki",
                            f"Falta la clau de frontmatter '{key}'.", path=rel(path, self.root),
                        )
                state = str(data.get("estat", ""))
                doc_type = str(data.get("tipus", ""))
                state_counts[state or "<missing>"] += 1
                if state and state not in allowed_states:
                    self.add(
                        "wiki.state-invalid", "medium", "wiki", "Estat documental fora de l'enum canònic.",
                        path=rel(path, self.root), evidence=state,
                        remediation="Separa estat documental de l'estat d'una sessió/acta.",
                    )
                if doc_type and doc_type not in allowed_types:
                    self.add(
                        "wiki.type-invalid", "medium", "wiki", "Tipus documental fora de l'enum canònic.",
                        path=rel(path, self.root), evidence=doc_type,
                    )
            anchors = text.count("**Ancoratge de Seguretat:** [[00_INDEX]]")
            if anchors > 1:
                self.add(
                    "wiki.anchor-duplicated", "medium", "wiki",
                    f"L'ancoratge automàtic apareix {anchors} vegades.", path=rel(path, self.root),
                    remediation="Normalitza'l a una única aparició o elimina este ritual redundant.",
                )
            searchable = FENCE_RE.sub("", body)
            for match in WIKILINK_RE.finditer(searchable):
                link_count += 1
                raw = match.group(1)
                target = raw.split("|", 1)[0].split("#", 1)[0].strip()
                if not target:
                    continue
                normal = target.replace("\\", "/").removeprefix("./").casefold()
                candidates: list[Path] = []
                if "/" in normal:
                    candidates = [value for key, value in by_rel.items() if key == normal or key.endswith(f"/{normal}")]
                else:
                    candidates = by_name.get(normal, []) or by_stem.get(Path(normal).stem.casefold(), [])
                candidates = list(dict.fromkeys(candidates))
                if len(candidates) == 1:
                    inbound[candidates[0]] += 1
                elif not candidates:
                    broken_count += 1
                    self.add(
                        "wiki.link-broken", "medium", "wiki", "Wikilink sense objectiu resoluble.",
                        path=rel(path, self.root), line=line_number(searchable, match.start()), evidence=target,
                        remediation="Crea un MOC/nota real o substitueix l'enllaç per text/ruta de fitxer.",
                    )
                else:
                    self.add(
                        "wiki.link-ambiguous", "medium", "wiki", "Wikilink amb més d'un objectiu possible.",
                        path=rel(path, self.root), line=line_number(searchable, match.start()),
                        evidence=" | ".join(rel(item, self.root) for item in candidates[:8]),
                    )
            if relative.parts and relative.parts[0] in active_zones:
                for marker in self.policy.get("obsolete_markers", []):
                    for match in re.finditer(re.escape(str(marker)), body, re.IGNORECASE):
                        self.add(
                            "modernisation.doctrine-marker", "medium", "modernisation",
                            "Doctrina activa encara vinculada al paradigma offline/A10.",
                            path=rel(path, self.root), line=line_number(body, match.start()), evidence=str(marker),
                            remediation="Marca-la com a històrica o reescriu-la segons la decisió d'agost 2026.",
                        )
        for stem, paths in by_stem.items():
            md_paths = [path for path in paths if path.suffix.lower() == ".md"]
            if len(md_paths) > 1:
                self.add(
                    "wiki.basename-duplicate", "medium", "wiki", "Nom base duplicat: els wikilinks poden ser ambigus.",
                    path=rel(md_paths[0], self.root), evidence=" | ".join(rel(item, self.root) for item in md_paths),
                )
        for path in active_docs:
            if inbound[path] == 0 and path.name not in {"00_INDEX.md"}:
                self.add(
                    "wiki.orphan", "low", "wiki", "Document actiu sense cap enllaç d'entrada.",
                    path=rel(path, self.root), remediation="Enllaça'l des d'un índex/MOC o arxiva'l.",
                )
        self.check_mirror()
        self.metrics.update({
            "markdown_files": len(markdown),
            "active_markdown_files": len(active_docs),
            "wikilinks": link_count,
            "broken_wikilinks": broken_count,
            "active_orphans": sum(1 for path in active_docs if inbound[path] == 0 and path.name != "00_INDEX.md"),
            "document_states": dict(state_counts),
        })

    def check_mirror(self) -> None:
        mirror = self.root / str(self.policy.get("mirror_dir", ""))
        agents = self.root / ".agents"
        if not mirror.is_dir() or not agents.is_dir():
            return
        mappings: list[tuple[Path, Path]] = []
        for destination in mirror.rglob("*.md"):
            destination_text = destination.read_text(encoding="utf-8", errors="replace")
            metadata, _, _ = parse_frontmatter(destination_text)
            declared_source = metadata.get("source")
            if declared_source:
                source = (self.root / str(declared_source)).resolve()
                try:
                    source.relative_to(agents.resolve())
                except ValueError:
                    self.add(
                        "wiki.mirror-source-invalid", "high", "wiki",
                        "El mirall declara una font fora de .agents.", path=rel(destination, self.root),
                        remediation="Regenera el mirall només des de .agents.",
                    )
                    continue
            elif destination.parent == mirror and destination.name.startswith("SKILL_"):
                skill_name = destination.stem.removeprefix("SKILL_")
                source = agents / "skills" / skill_name / "SKILL.md"
            elif destination.parent == mirror:
                source = agents / destination.name
            else:
                continue
            if source.is_file():
                mappings.append((source, destination))
        drift = 0
        for source, destination in mappings:
            source_text = source.read_text(encoding="utf-8", errors="replace")
            destination_text = destination.read_text(encoding="utf-8", errors="replace")
            metadata, destination_body, _ = parse_frontmatter(destination_text)
            if metadata.get("source_sha256"):
                _, source_body, source_has_frontmatter = parse_frontmatter(source_text)
                if not source_has_frontmatter:
                    source_body = source_text
                source_body = source_body.replace("\r\n", "\n").strip() + "\n"
                source_name = rel(source, self.root)
                warning = (
                    "> [!warning] FITXER GENERAT\n"
                    f"> Font canònica: `{source_name}`. Qualsevol edició manual serà sobreescrita.\n\n"
                )
                divergent = not (
                    metadata.get("source") == source_name
                    and metadata.get("source_sha256") == sha256_file(source)
                    and destination_body == "\n" + warning + source_body
                )
            else:
                divergent = normalise_mirror(source_text) != normalise_mirror(destination_text)
            if divergent:
                drift += 1
                self.add(
                    "wiki.mirror-drift", "high", "wiki",
                    "El mirall manual divergeix de la font .agents.", path=rel(destination, self.root),
                    evidence=f"source={rel(source, self.root)}",
                    remediation="Regenera'l; no edites mai el mirall a mà.",
                )
        self.metrics["legacy_mirror_pairs"] = len(mappings)
        self.metrics["legacy_mirror_drift"] = drift


def markdown_report(result: dict[str, object]) -> str:
    metrics = result["metrics"]
    findings = result["findings"]
    lines = [
        "# Auditoria mecànica del Brain",
        "",
        f"Arrel: `{result['root']}`",
        "",
        "## Mètriques",
        "",
    ]
    for key, value in metrics.items():
        lines.append(f"- `{key}`: `{json.dumps(value, ensure_ascii=False, sort_keys=True)}`")
    lines.extend(["", "## Troballes", ""])
    if not findings:
        lines.append("Cap troballa.")
    for item in findings:
        where = item.get("path") or "projecte"
        if item.get("line"):
            where += f":{item['line']}"
        lines.append(f"### [{item['severity'].upper()}] {item['code']} — `{where}`")
        lines.append("")
        lines.append(str(item["message"]))
        if item.get("evidence"):
            lines.append(f"\nEvidència: `{item['evidence']}`")
        if item.get("remediation"):
            lines.append(f"\nAcció: {item['remediation']}")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def load_policy(path: Path) -> dict[str, object]:
    return json.loads(path.read_text(encoding="utf-8"))


def write_atomic(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    temporary.write_text(text, encoding="utf-8")
    os.replace(temporary, path)


def main(argv: Iterable[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", type=Path, help="Arrel del projecte socdepoble.org")
    parser.add_argument(
        "--policy", type=Path, default=Path(__file__).with_name("brain_policy.json"),
        help="Política JSON (per defecte: brain_policy.json al costat de l'script)",
    )
    parser.add_argument("--json", type=Path, dest="json_path", help="Escriu el resultat JSON")
    parser.add_argument("--markdown", type=Path, dest="markdown_path", help="Escriu l'informe Markdown")
    parser.add_argument(
        "--fail-on", choices=["critical", "high", "medium", "low", "never"], default="high",
        help="Llindar de codi d'eixida 1 (per defecte: high)",
    )
    args = parser.parse_args(list(argv) if argv is not None else None)
    try:
        result = Auditor(args.root, load_policy(args.policy)).run()
    except (OSError, ValueError, json.JSONDecodeError) as error:
        print(f"brain_audit: {error}", file=sys.stderr)
        return 2
    json_text = json.dumps(result, ensure_ascii=False, indent=2, sort_keys=False) + "\n"
    if args.json_path:
        write_atomic(args.json_path, json_text)
    if args.markdown_path:
        write_atomic(args.markdown_path, markdown_report(result))
    if not args.json_path and not args.markdown_path:
        print(json_text, end="")
    if args.fail_on == "never":
        return 0
    threshold = SEVERITY_ORDER[args.fail_on]
    return int(any(SEVERITY_ORDER[item["severity"]] >= threshold for item in result["findings"]))


if __name__ == "__main__":
    raise SystemExit(main())
