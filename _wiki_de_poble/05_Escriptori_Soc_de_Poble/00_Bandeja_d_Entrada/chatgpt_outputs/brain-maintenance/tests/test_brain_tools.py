from __future__ import annotations

import importlib.util
import json
import sys
import tarfile
import tempfile
import unittest
from io import BytesIO
from pathlib import Path


TOOLS = Path(__file__).resolve().parents[1]


def load(name: str):
    spec = importlib.util.spec_from_file_location(name, TOOLS / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    assert spec.loader
    spec.loader.exec_module(module)
    return module


audit = load("brain_audit")
distill = load("brain_distill")
mirror = load("sync_agent_mirror")


class BrainToolsTest(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)

    def tearDown(self):
        self.temporary.cleanup()

    def test_audit_reports_secret_archive_without_secret_value(self):
        archive = self.root / "auth.tar.gz"
        with tarfile.open(archive, "w:gz") as handle:
            payload = b"DO_NOT_PRINT_THIS_SECRET"
            info = tarfile.TarInfo("bot/.iaia_auth/creds.json")
            info.size = len(payload)
            handle.addfile(info, BytesIO(payload))
        result = audit.Auditor(self.root, {
            "required_project_files_all": [],
            "required_project_files_any": [],
            "sensitive_path_markers": [".iaia_auth", "creds.json"],
            "wiki_dir": "missing",
        }).run()
        encoded = json.dumps(result)
        self.assertIn("security.credentials-in-archive", encoded)
        self.assertNotIn("DO_NOT_PRINT_THIS_SECRET", encoded)

    def test_env_example_is_not_a_credential_path(self):
        example = self.root / ".env.example"
        example.write_text("API_KEY=replace-me\n", encoding="utf-8")
        policy = {
            "required_project_files_all": [],
            "required_project_files_any": [],
            "sensitive_path_markers": [".env"],
            "wiki_dir": "missing",
        }
        result = audit.Auditor(self.root, policy).run()
        self.assertNotIn("security.sensitive-path", json.dumps(result))
        example.rename(self.root / ".env.local")
        result = audit.Auditor(self.root, policy).run()
        self.assertIn("security.sensitive-path", json.dumps(result))

    def test_distill_is_dry_run_then_recoverable(self):
        junk = self.root / ".DS_Store"
        junk.write_bytes(b"x")
        note = self.root / "note.md"
        note.write_text(f"# Nota\n\n{distill.ANCHOR}\n\n{distill.ANCHOR}\n", encoding="utf-8")
        document = distill.plan(self.root)
        before = {path.name: path.read_bytes() for path in (junk, note)}
        self.assertEqual(distill.apply_plan(self.root, document, False, ".brain-trash"), 0)
        self.assertEqual(junk.read_bytes(), before[junk.name])
        self.assertEqual(note.read_bytes(), before[note.name])
        self.assertEqual(distill.apply_plan(self.root, document, True, ".brain-trash"), 0)
        self.assertFalse(junk.exists())
        self.assertEqual(note.read_text(encoding="utf-8").count(distill.ANCHOR), 1)
        self.assertEqual(len(list((self.root / ".brain-trash").rglob(".DS_Store"))), 1)
        backups = list((self.root / ".brain-trash").rglob("backups/note.md"))
        self.assertEqual(len(backups), 1)
        self.assertEqual(backups[0].read_bytes(), before[note.name])

    def test_distill_flags_direct_credentials_as_manual(self):
        credential = self.root / "bot" / ".iaia_auth" / "creds.json"
        credential.parent.mkdir(parents=True)
        credential.write_text("{}\n", encoding="utf-8")
        (self.root / ".env.example").write_text("TOKEN=replace-me\n", encoding="utf-8")
        (self.root / ".env.local").write_text("TOKEN=secret\n", encoding="utf-8")
        document = distill.plan(self.root)
        manual_sources = {item["source"] for item in document["operations"] if item["kind"] == "manual"}
        self.assertIn("bot/.iaia_auth/creds.json", manual_sources)
        self.assertIn(".env.local", manual_sources)
        self.assertNotIn(".env.example", manual_sources)

    def test_partial_failure_leaves_backup_and_incremental_receipt(self):
        note = self.root / "invalid.md"
        note.write_bytes(b"# Nota\xff\n\n" + distill.ANCHOR.encode() + b"\n" + distill.ANCHOR.encode())
        document = distill.plan(self.root)
        with self.assertRaises(UnicodeDecodeError):
            distill.apply_plan(self.root, document, True, ".brain-trash")
        receipt_path = next((self.root / ".brain-trash").rglob("receipt.json"))
        receipt = json.loads(receipt_path.read_text(encoding="utf-8"))
        self.assertEqual(receipt["status"], "partial_failure")
        backup = next((self.root / ".brain-trash").rglob("backups/invalid.md"))
        self.assertEqual(backup.read_bytes(), note.read_bytes())

    def test_mirror_check_and_write(self):
        source = self.root / ".agents" / "skills" / "demo" / "SKILL.md"
        source.parent.mkdir(parents=True)
        source.write_text("---\nname: demo\n---\n\n# Demo\n", encoding="utf-8")
        args = type("Args", (), {
            "root": self.root,
            "source": ".agents",
            "mirror": "_wiki_de_poble/mirror",
            "write": True,
            "prune": False,
            "trash": ".brain-trash",
        })()
        self.assertEqual(mirror.run(args), 0)
        destination = self.root / "_wiki_de_poble" / "mirror" / "SKILL_demo.md"
        self.assertIn("source_sha256:", destination.read_text(encoding="utf-8"))
        self.assertEqual(destination.read_text(encoding="utf-8").count("\n---\n"), 1)
        args.write = False
        self.assertEqual(mirror.run(args), 0)
        auditor = audit.Auditor(self.root, {"mirror_dir": "_wiki_de_poble/mirror"})
        auditor.check_mirror()
        self.assertFalse([finding for finding in auditor.findings if finding.code == "wiki.mirror-drift"])
        destination.write_text(destination.read_text(encoding="utf-8").replace("# Demo", "# Alterat"), encoding="utf-8")
        auditor = audit.Auditor(self.root, {"mirror_dir": "_wiki_de_poble/mirror"})
        auditor.check_mirror()
        self.assertTrue([finding for finding in auditor.findings if finding.code == "wiki.mirror-drift"])

    def test_mirror_cannot_overlap_source(self):
        source = self.root / ".agents" / "AGENTS.md"
        source.parent.mkdir(parents=True)
        source.write_text("# Agents\n", encoding="utf-8")
        with self.assertRaises(ValueError):
            mirror.source_mapping(self.root, ".agents", ".agents")

    def test_legacy_move_does_not_conflict_with_anchor_normalisation(self):
        source = self.root / "_wiki_de_poble" / "90_arxiu_historic" / "260701_ACTA.md"
        source.parent.mkdir(parents=True)
        source.write_text(f"# Acta\n\n{distill.ANCHOR}\n\n{distill.ANCHOR}\n", encoding="utf-8")
        document = distill.plan(self.root)
        source_operations = [item for item in document["operations"] if item["source"].endswith("260701_ACTA.md")]
        self.assertEqual([item["kind"] for item in source_operations], ["move"])
        self.assertTrue(source_operations[0]["normalize_anchor"])
        self.assertEqual(distill.apply_plan(self.root, document, True, ".brain-trash"), 0)
        destination = (
            self.root / "_wiki_de_poble" / "04_ARXIU_Documents_Historics"
            / "2026_07" / "legacy_pre_canonical" / "260701_ACTA.md"
        )
        self.assertTrue(destination.is_file())
        self.assertEqual(destination.read_text(encoding="utf-8").count(distill.ANCHOR), 1)

    def test_sensitive_legacy_file_is_manual_only(self):
        legacy = self.root / "_wiki_de_poble" / "90_arxiu_historic"
        legacy.mkdir(parents=True)
        sensitive = legacy / "session-secret.md"
        sensitive.write_text("no llegir\n", encoding="utf-8")
        junk = legacy / ".DS_Store"
        junk.write_bytes(b"x")
        document = distill.plan(self.root)
        sensitive_ops = [item["kind"] for item in document["operations"] if item["source"].endswith("session-secret.md")]
        junk_ops = [item["kind"] for item in document["operations"] if item["source"].endswith(".DS_Store")]
        self.assertEqual(sensitive_ops, ["manual"])
        self.assertEqual(junk_ops, ["trash"])


if __name__ == "__main__":
    unittest.main()
