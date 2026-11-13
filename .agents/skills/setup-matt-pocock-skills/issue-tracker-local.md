# Issue tracker: Local Markdown

Inactive alternative: use only after explicit tracker reconfiguration under [AGENTS.md](../../../AGENTS.md). Replace `<configured-ticket-directory>` with an agreed retained repository directory before writing. The active tracker is GitHub; root `.tmp/` drafts are not a parallel tracker.

## Conventions

- One feature per directory: `<configured-ticket-directory>/<feature-slug>/`
- The spec is `<configured-ticket-directory>/<feature-slug>/spec.md`
- Implementation issues are one file per ticket at `<configured-ticket-directory>/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`, never a single combined tickets file
- Triage state is recorded as a `Status:` line near the top of each issue file (see `triage-labels.md` for the role strings)
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## When a skill says "publish to the issue tracker"

Create a new file under `<configured-ticket-directory>/<feature-slug>/` only once that location is configured and authorized.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `<configured-ticket-directory>/<effort>/map.md` (the Notes / Decisions-so-far / Fog body).
- **Child ticket**: `<configured-ticket-directory>/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`); a `Status:` line records `claimed`/`resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked when every file it lists is `resolved`.
- **Frontier**: scan `<configured-ticket-directory>/<effort>/issues/` for files that are open, unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.
