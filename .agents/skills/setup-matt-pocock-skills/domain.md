# Domain configuration seed

For this repository, [doc/agents/domain.md](../../../doc/agents/domain.md) owns the selected multi-context layout, consumer rules, vocabulary, and ADR conflict handling. Update it in place rather than copying generic `docs/adr/` or `src/<context>/docs/adr/` defaults.

Follow the root `GLOSSARY-MAP.md` if present; otherwise read relevant existing package glossaries. Create a glossary only after resolving its first terms; create the map alongside the first glossary and add its exact pointer. Preserve existing system-wide `doc/adr/` and package-local `doc/adr/` or `docs/adr/`. New package-local ADRs use `doc/adr/` only when a real decision warrants one.
