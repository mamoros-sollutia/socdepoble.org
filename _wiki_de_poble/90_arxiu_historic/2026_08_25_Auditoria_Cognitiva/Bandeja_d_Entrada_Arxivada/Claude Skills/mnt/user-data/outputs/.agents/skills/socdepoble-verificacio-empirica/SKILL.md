---
name: socdepoble-verificacio-empirica
lang: en
description: "Discipline for asserting claims about a codebase. Every factual claim must be produced by an executed command, checked against an independent tool, and reported with its counter-example. Use for audits, code review, debugging, and any answer that states what the code does."
triggers_ca: ["auditoria", "revisió de codi", "verificar", "comprovar", "diagnòstic", "què fa este codi"]
triggers_en: ["audit", "code review", "verify", "diagnose", "what does this do", "is this a bug"]
version: 1.0.0
status: canonic
abast: ["global"]
---

# Empirical Verification

## Principle

A claim about code is worth exactly the command that produced it. Reading
plausibly and reporting confidently is the failure mode this skill exists to
prevent — it is indistinguishable from correctness right up until deployment.

## Run it, don't reason about it

The JSX runtime shim in this project was four lines that looked fine:

```js
export const jsx  = React.createElement;
export const jsxs = React.createElement;
```

Reasoning says "delegation, harmless". Executing says otherwise:

```
ESPERAT   key=poble-1  children="La Torre de les Maçanes"
OBTINGUT  key=null     children="poble-1"
```

The third argument of `jsx` is the key; the third argument of `createElement`
is a child. Every keyed list element rendered its own identifier instead of
its content. **Install the real library and run the real call.** One
execution outranks any amount of careful reading.

Likewise: to prove a path guard is broken, create the symlink and write
through it. To prove a class is unstyled, grep every stylesheet for its
selector and report the count. To prove a function is dead, count its
invocations across the whole tree and print the number.

## Check with a different tool than the one that acted

The tool that made a change is not allowed to certify the change. After
removing 45 misplaced JSX comments with a bespoke detector, verify with
`@babel/parser` walking `JSXText` nodes — an independent implementation with
no shared assumptions. Agreement between two unrelated methods is evidence;
agreement of a tool with itself is not.

## Report the counter-example, not the verdict

Weak: *"the theme system has a bug."*

Strong: *"`theme.js:17` calls `document.querySelector('.sdp-root')`.
`.sdp-root` lives inside the shadow root and `document.querySelector` does
not pierce shadow boundaries, so this returns `null` in production. Control
falls through to `document.documentElement`, which is WordPress's `<html>`."*

Every finding carries: file, line, the mechanism, and what the user
experiences as a result. A finding without a mechanism is a guess with
formatting.

## Calibrate, and correct yourself out loud

State confidence honestly and separate tiers:

- **Verified** — a command was run and its output is quoted.
- **Read** — the code was inspected but not executed.
- **Unverifiable here** — the deciding file is absent from the audit surface.

The third tier is not a failure, it is information. When `package.json`,
`vite.config.js` and `.husky/` are missing from a bundle that claims to
contain everything, say so: no auditor can certify build behaviour without
the file that defines the build. Reconstructing what can be reconstructed
(the scripts block was recoverable from the context pack) and naming what
cannot is more useful than a confident guess.

When a later measurement contradicts an earlier claim, correct it in the
next message, explicitly. In this audit the first report said 45 defects in
13 files; the exact detector found 11. Publishing the correction costs one
sentence. Leaving it costs the credibility of every other number.

## Audit your own instruments

An analyser is code and carries the same defects it hunts. Two examples from
building the tools in this repository:

- A comment/string stripper written as chained `.replace()` calls destroyed
  the very file containing the mutation bug, because the `//` inside a
  template literal ate the closing backtick and the template regex then
  swallowed half the file. The culprit escaped detection because the detector
  was written with the same carelessness as the culprit. Fix: single-pass
  lexer.
- A blast-radius budget counted changed lines by index, so deleting one line
  reported 78% of the file rewritten, and refused a healthy change.

Before trusting a number your tool produced, feed it a case with a known
answer.

## Never invent a source

If web access is unavailable, say so rather than attributing techniques to a
community you cannot check. Grounding a recommendation in what this codebase
demonstrably does is stronger evidence than an unverifiable citation — and
honest about its provenance.
