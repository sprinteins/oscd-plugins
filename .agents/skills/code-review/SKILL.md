---
name: code-review
description: "Review branch or work-in-progress changes since a fixed point on separate Standards and Spec axes, including relevant committed and worktree changes."
---

Two-axis review since a resolved fixed point, including relevant staged, unstaged, and new work:

- **Standards**: does the code conform to this repo's documented coding standards?
- **Spec**: does the code faithfully implement the originating issue / spec?

Use independent fresh-context reviewers when useful, permitted, and supported; otherwise perform **explicitly labelled sequential self-review** on both axes. Do not imply independence or parallel execution when unavailable or disproportionate. [AGENTS.md](../../../AGENTS.md) owns authorization and tool fallbacks.

Read the configured [issue tracker](../../../doc/agents/issue-tracker.md) when the spec is a ticket. Review is read-only; fixes or posting comments need separate user scope/authorization.

## Process

### 1. Pin the fixed point

Use the user-supplied fixed point (commit SHA, branch, tag, or merge-base). If absent, propose the appropriate local ref and confirm it; do not silently assume `origin/main` or fetch just for review. Record the actual current branch, resolved base SHA, and merge-base SHA. Invalid refs stop the review.

Capture scope once:

- `git rev-parse --verify <fixed-point>^{commit}` and `git merge-base <fixed-point> HEAD`.
- `git --no-pager log <fixed-point>..HEAD --oneline` for context (first-parent listing may explain merges, not exclude their net effects).
- `git --no-pager diff <fixed-point>...HEAD -- <relevant-paths>` for committed changes.
- `git --no-pager diff --cached -- <relevant-paths>` and `git --no-pager diff -- <relevant-paths>` for staged/unstaged changes.
- `git ls-files --others --exclude-standard` for new files: read only relevant files explicitly; ordinary diff omits them.

Declare relevant path/hunk scope and unrelated dirty exclusions using the task baseline. If the base includes unrelated branch work, narrow transparently; don't silently discard it or claim to review it. Inspect the cumulative resulting state as needed. An empty committed diff is **not** an empty review if relevant worktree/new files exist. Report no changes only when all scoped layers are empty.

### 2. Identify the spec source

Look for the originating spec, in this order:

1. Issue references in the commit messages (`#123`, `Closes #45`, GitLab `!67`, etc.), fetched via the workflow in the tracker doc.
2. A path the user passed as an argument.
3. The user's agreed behavior in the conversation or a requested retained spec under the repository documentation policy.
4. If nothing is found, ask for the spec. Report **Spec: not assessed — no spec available**, never a pass, if none is supplied.

### 3. Identify the standards sources

Search the repo for every file that documents how code should be written. When `CODING_STANDARDS.md` or `CONTRIBUTING.md` exists, it must be on the list.

Start with AGENTS task routing and relevant scoped/package instructions, constitution/standards if present, glossary-map entries, and ADRs. Report sources actually loaded and missing sources; absence of optional standards does not abort review. Standards apply during implementation too. Consult [review-guidance.md](review-guidance.md) for architectural critique and evidence-based reporting extracted from the retired prompts.

On top of whatever the repo documents, the Standards axis always carries the **smell baseline** below: a fixed set of Fowler code smells (_Refactoring_, ch.3) that applies even when a repo documents nothing. Two rules bind it:

- **The repo overrides.** A documented repo standard always wins; where it endorses something the baseline would flag, suppress the smell.
- **Always a judgement call.** Each smell is a labelled heuristic ("possible Feature Envy"), never a hard violation. Like any standard here, skip anything tooling already enforces.

Each smell reads *what it is* → *how to fix*; match it against the diff:

- **Mysterious Name**: a function, variable, or type whose name doesn't reveal what it does or holds. → rename it; if no honest name comes, the design's murky.
- **Duplicated Code**: the same logic shape appears in more than one hunk or file in the change. → extract the shared shape, call it from both.
- **Feature Envy**: a method that reaches into another object's data more than its own. → move the method onto the data it envies.
- **Data Clumps**: the same few fields or params keep travelling together (a type wanting to be born). → bundle them into one type, pass that.
- **Primitive Obsession**: a primitive or string standing in for a domain concept that deserves its own type. → give the concept its own small type.
- **Repeated Switches**: the same `switch`/`if`-cascade on the same type recurs across the change. → replace with polymorphism, or one map both sites share.
- **Shotgun Surgery**: one logical change forces scattered edits across many files in the diff. → gather what changes together into one module.
- **Divergent Change**: one file or module is edited for several unrelated reasons. → split so each module changes for one reason.
- **Speculative Generality**: abstraction, parameters, or hooks added for needs the spec doesn't have. → delete it; inline back until a real need shows.
- **Message Chains**: long `a.b().c().d()` navigation the caller shouldn't depend on. → hide the walk behind one method on the first object.
- **Middle Man**: a class or function that mostly just delegates onward. → cut it, call the real target direct.
- **Refused Bequest**: a subclass or implementer that ignores or overrides most of what it inherits. → drop the inheritance, use composition.

### 4. Review both axes

When separate reviewers are useful and supported, give each the same resolved scope, relevant committed/staged/unstaged/new-file evidence, and exclusions. Use fresh contexts and issue both together when parallel execution is available. Otherwise explicitly announce sequential self-review and use the briefs below yourself.

**Standards sub-agent prompt** should include:

- All scoped diff commands, new-file contents/paths, commit list, base SHA, and exclusions.
- The list of standards-source files you found in step 3, **plus the smell baseline from step 3** pasted in full (the sub-agent has no other access to it).
- The brief: "Report, per file/hunk where relevant, (a) every place the diff violates a documented standard: cite the standard (file + the rule); and (b) any baseline smell you spot: name it and quote the hunk. Distinguish hard violations from judgement calls: documented-standard breaches can be hard, but baseline smells are always judgement calls, and a documented repo standard overrides the baseline. Skip anything tooling enforces. Under 400 words."

**Spec sub-agent prompt** should include:

- The same full review scope and exclusions.
- The path or fetched contents of the spec.
- The brief: "Report: (a) requirements the spec asked for that are missing or partial; (b) behaviour in the diff that wasn't asked for (scope creep); (c) requirements that look implemented but where the implementation looks wrong. Quote the spec line for each finding. Under 400 words."

If the spec is missing, retain the Spec heading with the not-assessed reason.

### 5. Aggregate

Present the two reports under `## Standards` and `## Spec` headings, verbatim or lightly cleaned. Do **not** merge or rerank findings, because the two axes are deliberately separate (see _Why two axes_).

End with a one-line summary: total findings per axis, and the worst issue _within each axis_ (if any). Don't pick a single winner across axes: that's the reranking the separation exists to prevent.

Report reviewer mode (independent/parallel versus sequential self-review), resolved base/scope and exclusions, exact validation commands/results or not-run reasons, and remaining risks. Use each axis's evidence and severity; prioritize blockers within an axis without letting the other axis mask them. Missing validation or independent review is not proof of readiness.

## Why two axes

A change can pass one axis and fail the other:

- Code that follows every standard but implements the wrong thing → **Standards pass, Spec fail.**
- Code that does exactly what the issue asked but breaks the project's conventions → **Spec pass, Standards fail.**

Reporting them separately stops one axis from masking the other.
