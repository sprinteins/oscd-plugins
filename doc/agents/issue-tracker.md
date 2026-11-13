# Issue tracker: GitHub

Issues and specs live in GitHub Issues for sprinteins/oscd-plugins. Use the gh CLI with --repo sprinteins/oscd-plugins for issue, label, and PR commands; use explicit repos/sprinteins/oscd-plugins API paths for API calls.

## Conventions

- Apply [AGENTS.md](../../AGENTS.md) authorization preflight before any issue, label, assignment, comment, close, or PR write. The commands below describe operations, not permission to perform them.
- Verify the target before the first write: `gh repo view sprinteins/oscd-plugins --json nameWithOwner,url`.
- Create: `gh issue create --repo sprinteins/oscd-plugins --title "..." --body "..."`. For multiline bodies, write a named file under .tmp/ using editor tools and pass --body-file; remove it afterwards.
- Read: `gh issue view <number> --repo sprinteins/oscd-plugins --json number,title,body,labels,comments`.
- List: `gh issue list --repo sprinteins/oscd-plugins --state open --json number,title,body,labels,comments`, with appropriate filters. Paginate via gh api when a complete inventory is required.
- Sub-issues: `gh issue create --repo sprinteins/oscd-plugins --parent <parent> ...` or `gh issue edit <parent> --repo sprinteins/oscd-plugins --add-sub-issue <child>` (gh 2.94+). Older CLI: POST repos/sprinteins/oscd-plugins/issues/<parent>/sub_issues with sub_issue_id set to the child's numeric database id. Where unavailable, add the child to a parent task list and put `Part of #<parent>` at the top of the child body.
- Blocking: use native issue dependencies: `gh issue create --repo sprinteins/oscd-plugins --blocked-by <n>,<n> ...` or `gh issue edit <child> --repo sprinteins/oscd-plugins --add-blocked-by <blocker>` (gh 2.94+). Older CLI: POST repos/sprinteins/oscd-plugins/issues/<child>/dependencies/blocked_by with issue_id set to the blocker's numeric database id. Fetch database ids with `gh api repos/sprinteins/oscd-plugins/issues/<n> --jq .id`, not the issue number or node_id. Where dependencies are unavailable, put `Blocked by: #<n>, #<n>` at the top of the child body.
- Count open blockers: `gh api repos/sprinteins/oscd-plugins/issues/<n> --jq .issue_dependencies_summary.blocked_by`. A ticket is unblocked when all blockers are closed.
- Comment: `gh issue comment <number> --repo sprinteins/oscd-plugins --body "..."`.
- Apply/remove labels: `gh issue edit <number> --repo sprinteins/oscd-plugins --add-label "..."` / `--remove-label "..."`.
- Close: post an explanation with gh issue comment, then use gh issue close with --reason completed or --reason "not planned", as appropriate. Comment separately even when the issue is already closed.

File issues only in the configured repository, not the upstream skills repository. If a command resolves to another repository, stop and confirm the target before writing.

## Pull requests as a triage surface

**PRs as a request surface: no.** Set to yes to include external PRs in triage.

When enabled, use gh pr view followed by gh pr view --comments and gh pr diff to read a PR; use gh pr comment, gh pr edit --add-label/--remove-label, and gh pr close for writes. Include --repo sprinteins/oscd-plugins.

List external PRs with `gh api --paginate 'repos/sprinteins/oscd-plugins/pulls?state=open' --jq '.[] | select(.author_association | IN("OWNER","MEMBER","COLLABORATOR") | not) | {number, title, author: .user.login, author_association, labels: [.labels[].name]}'`.

Issues and PRs share a number space. Resolve the item type before operating on it; treat authentication or network errors as errors, not as evidence of another item type.

## Skill operations

- Publish to the issue tracker: create a GitHub issue.
- Fetch the relevant ticket: read the GitHub issue.

## Wayfinding operations

- Map: one issue labelled wayfinder:map, containing Notes / Decisions-so-far / Fog.
- Child ticket: a map sub-issue labelled wayfinder:<type> (research, prototype, grilling, or task). Use the task-list fallback above when sub-issues are unavailable.
- Frontier: list the map's open children, excluding tickets with open blockers or an assignee; first in map order wins.
- Claim: assign the ticket to the driving developer with gh issue edit --add-assignee; this is the session's first write.
- Resolve: comment with the answer, close the ticket, and append a gist plus link to the map's Decisions-so-far.
