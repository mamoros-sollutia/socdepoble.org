# Skills universals per al Consell

Paquet preparat per copiar a `.agents/skills/`.

```text
.agents/skills/
├── trust-boundary-firewall/
│   └── SKILL.md
├── bounded-action-loop/
│   └── SKILL.md
├── evidence-calibrated-research/
│   └── SKILL.md
├── context-state-curator/
│   └── SKILL.md
└── verified-change-gate/
    └── SKILL.md
```

Instal·lació manual des de l'arrel del projecte:

```bash
cp -R soc-de-poble-skills/.agents/skills/* .agents/skills/
```

Cada skill és deliberadament independent del model. No concedeix permisos, no
substitueix el sandbox, l'autenticació o les proves, i no demana revelar
raonaments interns.

Relació entre skills:

- `trust-boundary-firewall` governa l'entrada de fonts i els fluxos dada→acció;
  `evidence-calibrated-research` comprova les afirmacions obtingudes.
- `bounded-action-loop` governa cada efecte; `verified-change-gate` governa el
  criteri final d'acceptació.
- `context-state-curator` conserva procedència i estat, però no amplia fonts,
  permisos ni persistència.

Validació executada: 5/5 passen `quick_validate.py` i una bateria independent
de casos positius, *near-miss* i adversarials.
