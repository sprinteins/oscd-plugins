# Domain Docs

Consumer rules for engineering skills exploring or modeling this repository's domain. Layout: multi-context.

## Before exploring, read these

- Root GLOSSARY-MAP.md, if present: follow its pointers to each GLOSSARY.md relevant to the task. Until the map exists, read relevant existing package-local glossaries; also read a root GLOSSARY.md if present for shared vocabulary.
- doc/adr/: read system-wide decisions relevant to the task.
- Relevant package-local doc/adr/ or docs/adr/ directories, including packages/plugins/type-distributor/docs/adr/ for that plugin.

If a glossary, map, or ADR directory does not exist, proceed silently. Do not suggest creating it upfront. Domain modeling creates these files lazily when terms or decisions are resolved.

## File structure

- GLOSSARY-MAP.md at the repository root points to context-specific glossaries.
- Context glossaries live at packages/plugins/<plugin>/GLOSSARY.md, packages/core/<package>/GLOSSARY.md, or packages/ui/GLOSSARY.md as appropriate. A package is a candidate context, not automatically a distinct domain; record actual context boundaries in the map when resolved.
- System-wide ADRs stay in doc/adr/.
- Package-local ADRs use an existing doc/adr/ or docs/adr/ directory. For a new package-local ADR directory, use doc/adr/.

When resolving the first terms, create only the relevant glossary and its map entry. Keep implementation details out of glossaries. Retain existing ADRs in place rather than creating parallel root docs/adr/ or src/<context>/docs/adr/ trees.

## Use the glossary's vocabulary

Use the glossary's canonical terms in issue titles, proposals, hypotheses, and test names. If a needed term is missing, reconsider whether it belongs to the domain or flag the gap for domain modeling.

## Flag ADR conflicts

Surface any proposal that contradicts an existing ADR, naming the decision and explaining why it may be worth reopening.
