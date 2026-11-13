# Review evidence and architectural critique

Supplement to [code-review](SKILL.md), retaining useful guidance from the removed pre-review and critical-branch-review prompts. This is reference, not a rival review workflow.

## Scope and evidence

Show the actual branch, resolved base, purpose (what/why), relevant committed/worktree/new-file scope, exclusions, and sources loaded before detailed review. Call out large/complex histories and suggest a review order when useful. First-parent logs explain history; the merge-base net diff owns evidence. State local-ref freshness limitations; do not fetch or rewrite history automatically.

Check correctness, package boundaries, error handling, generated output, user-visible behavior, meaningful affected coverage, and directly relevant docs. Use executable checks already owned by the package. Distinguish actual passes, failures, and not-run checks.

Commit clarity (what/why, required issue references) matters when the scoped review includes commits; generic WIP or cleanup messages may merit a nonblocking suggestion. Never rewrite or squash history as part of review.

## Significant decisions

For each relevant architectural decision, identify:

- What was decided: the abstraction, invariant, schema/data structure, and read/write system boundary.
- Assumptions: which are guaranteed by IEC 61850/SCL, existing contracts, ADRs, or only convention?
- Risks/failure modes: what breaks if assumptions fail, including edge cases and hidden coupling?
- Alternatives: at least one plausible alternative and when it would be preferable.
- Verdict: Solid / Acceptable with caveats / Questionable / Risk: high, backed by evidence.

Conclude with the most fragile decision, hidden coupling, missing implicit contracts/documentation, and IEC 61850 naming/structure/reference concerns when applicable. Assess necessity, maintainability, leaky abstractions, and future change cost; do not invent an ADR for a reversible configuration choice.

## Actionable report

Keep Standards and Spec findings separate. Within each, label **Blocking**, **Important**, **Optional**, or **Question**. Cite file/location, observed evidence, applicable rule/spec, impact, and required action. Flag only provable defects; mark uncertain assumptions as questions and smells as heuristics. Skip lint-only comments and unrelated dirty work.

Use direct, constructive language and assume missing context may explain a choice. Genuine positive highlights may be brief; omit empty optional sections. Suggest follow-up tickets for nonblocking out-of-scope work instead of silently expanding the task. Add before/after evidence, manual steps, screenshots for visible changes, or a review-order guide only when useful. No “all checks passed” or “ready for merge” without actual supporting evidence, and no automatic posting.
