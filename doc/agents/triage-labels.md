# Triage Labels

Apply the [shared authorization preflight](../../AGENTS.md) before label writes.

Map canonical triage roles to this repository's GitHub label strings.

| Canonical role | Tracker label | Meaning |
| --- | --- | --- |
| needs-triage | Status: Needs Triage | Maintainer needs to evaluate the issue |
| needs-info | Status: Clarification Needed | Waiting on more information |
| ready-for-agent | Status: Ready | Fully specified; anyone can pick it up without further discussion |
| ready-for-human | Status: Needs Decision | Requires judgment, external access, or manual testing first |
| wontfix | Status: Won't Fix | Will not be actioned |

When a skill mentions a triage role, use its tracker label from this table. Canonical role IDs stay as upstream skill vocabulary; tracker labels describe readiness, not who implements the work. Edit the tracker-label column to change the vocabulary.
