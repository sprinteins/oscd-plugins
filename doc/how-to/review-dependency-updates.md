# Review Dependency Updates

This guide is for maintainers reviewing Dependabot pull requests and repository administrators configuring the required checks.

## Update Groups

[Dependabot configuration](../../.github/dependabot.yml) checks npm dependencies and GitHub Actions weekly on Monday at 09:00 Europe/Berlin, with a three-day cooldown for version updates. Tobias Menzel (`tmenzel27`) is the configured assignee for both ecosystems.

The npm version-update groups separate:

- Vitest and `@vitest/*` development dependencies into patch and minor groups.
- Production dependencies into patch and minor groups.
- The remaining development dependencies into patch and minor groups.

Dependabot uses the first matching group. Keep the Vitest groups before the development catch-all groups. Major version updates remain individual pull requests; they are not ignored. GitHub Actions minor and patch updates remain grouped separately from npm updates.

Security updates have their own npm group, including fixes that require major upgrades. This grouping does not enable Dependabot alerts or security updates in repository settings. Security updates do not wait for the version-update schedule or cooldown. If a grouped security fix is blocked by another update, arrange a separate fix rather than delaying an urgent remediation.

UILib belongs to the root pnpm workspace and has an importer in the root lockfile. It is updated through the root npm entry, not a second Dependabot job. Its historical package-local lockfile is retained; workspace installs and CI use the root lockfile. Do not use the historical lockfile as the baseline for reviewing workspace updates.

## Pull Request Checks

The [Dependency Quality workflow](../../.github/workflows/dependency-quality.yml) runs on pull requests and supports manual dispatch. Package, dependency, lint-configuration, and workflow changes run:

- Builds and type checks for all nine plugins.
- Configured unit-test scripts for Auto Doc, Type Designer, and Type Distributor.
- Shared dependency and UI builds, shared type checks, UILib tests, headless legacy-core browser tests, and the repository Biome check.

Packages without a working test script are not treated as having passing tests. In particular, core-api declares a test script but has no local Vitest dependency or test files; it is covered by the shared build and type checks instead. Other existing test files without a configured package test command still need a separate test-setup task.

The workflow conservatively checks every plugin because they share dependencies. It uses read-only repository permissions, requires no deployment secrets, and does not publish artifacts. The existing Type Distributor quality workflow remains in place, including its coverage checks, and also responds to root-lockfile and shared-package changes.

The final `Dependency quality gate` fails when path detection, any plugin job, or the shared job fails. For documentation-only changes, package jobs are skipped and the final check succeeds. Keep the workflow itself enabled for every pull request so a required check does not remain pending after a path-filtered skip.

## Administrator Setup

Complete these steps in GitHub; changing YAML alone cannot enable these settings:

1. In repository code-security settings, verify Dependency Graph, Dependabot alerts, and Dependabot security updates are enabled. Confirm that the workspace packages appear in the dependency graph and review Dependabot logs for resolution errors.
2. Confirm `tmenzel27` is eligible for assignment in this repository and agrees to own triage. Arrange a backup maintainer during absences.
3. Run the new workflow on the default branch through manual dispatch after merging. Investigate existing package failures before making the gate required. Local validation during introduction found seven failing plugin type-check commands; these must not be hidden with `continue-on-error`.
4. Once the baseline is green, add `Dependency quality gate` to the required status checks in the rule protecting `main`. Select the actual check emitted by GitHub Actions and require pull requests and review before merging.
5. Test the rule with a dependency-only pull request and a documentation-only pull request. Verify that failed package jobs block merging and documentation-only changes do not leave a pending gate.
6. Leave automatic merging disabled initially. Only consider a limited patch-update policy after the checks are reliable; retain manual review for major and security-sensitive updates.

These steps do not require sharing credentials. Screenshots should show settings and required checks, not secrets.

## Review Routine

1. Review scheduled updates weekly. Read release notes and inspect manifest and root-lockfile changes together, especially peer dependencies and version alignment within a tool family.
2. Triage security alerts as they arrive instead of waiting for the weekly review. Agree response targets by severity, exposure, and available fixes with the team.
3. Confirm all relevant builds, tests, and type checks actually ran. A merged dependency update does not by itself guarantee that already-published plugin bundles contain the fix; follow the existing [plugin release process](release-a-plugin.md) when publication is needed.
4. Keep a failing group open for investigation or split out its blocking dependency. Do not automatically close security alerts or approve updates solely because Dependabot opened the pull request.
5. Revisit the number and size of groups after a few update cycles. Merge groups only when the reduced review overhead outweighs the loss of failure isolation.

## Local Checks

Install dependencies from the unchanged workspace lockfile and build shared packages before checking a plugin:

```bash
pnpm install --frozen-lockfile
pnpm run dependencies:build
pnpm --dir packages/plugins/type-distributor run build
pnpm --dir packages/plugins/type-distributor run test --run
pnpm --dir packages/plugins/type-distributor run check
```

Use the commands in the workflow for other packages. Legacy-core browser tests require Chrome or Chromium. Existing package errors must be resolved in their owning packages, not suppressed in the dependency workflow.