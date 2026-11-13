# Contributing to OpenSCD Plugins

Thank you for contributing to the OpenSCD plugins monorepo. This guide describes the usual workflow for preparing a change, validating it locally, and submitting it for review.

## Before you start

For a small change, you can work directly from the repository. For a larger change, bug fix, or new feature, create or identify a GitHub issue first so that the scope and acceptance criteria are clear.

Keep changes focused on one purpose. Discuss changes to shared packages, public APIs, plugin contracts, or the repository architecture before implementing them.

Do not commit credentials, tokens, customer data, or other sensitive information. Do not disclose security vulnerabilities in a public issue; contact the maintainers through a private GitHub channel instead.

## Prerequisites

The repository currently uses:

* Node.js 24 in CI
* pnpm 10, pinned in the root `package.json`
* Chromium for the browser-based tests in `packages/core/legacy`

See [Setup the project](./doc/how-to/setup.md) for the basic environment requirements. On macOS, Chromium can be installed with:

```bash
brew install chromium
```

## Set up the repository

Install and build the shared workspace dependencies from the repository root:

```bash
pnpm dependencies:install+build
```

This step is required before building or running most plugins. Use the frozen lockfile in automated or reproducible environments:

```bash
pnpm install --frozen-lockfile
pnpm dependencies:build
```

## Fork the repository

If you do not have write access to the repository, fork [sprinteins/oscd-plugins on GitHub](https://github.com/sprinteins/oscd-plugins) and work from your fork:

```bash
git clone https://github.com/<your-github-user>/oscd-plugins.git
cd oscd-plugins
git remote rename origin upstream
git remote add origin https://github.com/<your-github-user>/oscd-plugins.git
git fetch upstream
git switch --create <branch-name> upstream/main
```

Here, `upstream` is the repository maintained by the project and `origin` is your fork. Use a separate branch for each contribution; do not work directly on `main`.

Before starting new work, update your local base branch from the project repository:

```bash
git fetch upstream
git switch main
git pull --ff-only upstream main
git switch --create <branch-name> main
```

Push your branch to your fork and open the pull request against `main` in `sprinteins/oscd-plugins`:

```bash
git push --set-upstream origin <branch-name>
```

If you have write access, you may clone the project repository directly and use `origin` for the project repository instead of creating a fork.

## Find the package to change

The repository is a pnpm monorepo. Most work belongs to one of these areas:

* `packages/plugins/<plugin>` contains an OpenSCD plugin
* `packages/core/api` contains shared plugin API types
* `packages/core/legacy` contains legacy SCD business logic
* `packages/core/standard` contains IEC 61850 standard types
* `packages/core/ui-svelte` contains shared Svelte components
* `packages/ui` and `packages/uilib` contain additional UI libraries

Read the package `README.md` and `package.json` before choosing commands. Package scripts are the source of truth because the available commands differ between packages.

## Develop locally

Run a package command with pnpm's workspace filter:

```bash
pnpm --filter @oscd-plugins/<package> <command>
```

For example, a plugin will commonly support:

```bash
pnpm --filter @oscd-plugins/<package> dev
pnpm --filter @oscd-plugins/<package> check
pnpm --filter @oscd-plugins/<package> test
pnpm --filter @oscd-plugins/<package> build
```

For an integrated plugin build, use the matching root script when one exists:

```bash
pnpm network-explorer:integrated
```

The `integrated` command builds the plugin in watch mode and serves it for use with a local OpenSCD instance. The root `makefile` also contains shortcuts for plugin watch builds and starting OpenSCD.

## Validate your changes

Run the checks relevant to every package you changed. At minimum, run the root formatter and linter check:

```bash
pnpm biome:check
```

For a plugin or TypeScript/Svelte package, also run its available type check, tests, and production build:

```bash
pnpm --filter @oscd-plugins/<package> check
pnpm --filter @oscd-plugins/<package> test
pnpm --filter @oscd-plugins/<package> build
```

Run the relevant package checks again when a change affects a shared dependency. Legacy core tests run in a Chromium browser and may require the local Chromium prerequisite described above.

Do not use Prettier. This repository uses Biome; see [Code Style Guidelines](./doc/guidelines/code_style.md) and [Barrel Pattern](./doc/guidelines/barrel-pattern.md).

## Branches and commits

Use a short-lived branch based on `main` and keep it focused. Descriptive prefixes such as `feat/`, `fix/`, `docs/`, and `refactor/` are recommended, for example:

```text
feat/network-service-discovery
fix/type-distributor-ldevice-name
docs/contributing-guide
```

Write concise, descriptive commit messages. Keep unrelated refactors, formatting-only changes, and generated output out of a functional change unless they are required for it.

## Changelogs and documentation

Update documentation when the behavior, setup, public API, or contributor workflow changes. Follow the [Documentation Guidelines](./doc/guidelines/doc_guidelines.md) and [Documentation Style Guide](./doc/guidelines/doc_styleguide.md).

For user-visible changes, update the changelog belonging to the affected package. For repository-wide or configuration changes, update the root [CHANGELOG.md](./CHANGELOG.md). Follow the existing [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) structure and do not change package versions as part of ordinary development unless the release process requires it.

## Open a pull request

Before opening a pull request:

* describe what changed and why
* link the related issue or ticket when one exists
* include screenshots or a recording for user-interface changes
* record the checks and tests you ran
* update the relevant changelog and documentation
* assign the appropriate labels and reviewers
* resolve or answer all review comments

Use the repository [pull request template](./.github/pull_request_template.md) for the complete checklist. Keep the pull request focused and explain any known limitations or follow-up work.

## Documentation map

The documentation follows the [Diátaxis](https://diataxis.fr/) framework:

* [How-Tos](#how-tos) guide you through concrete tasks.
* [Guides](#guides) describe practices and principles.
* [References](#references) document APIs and technical details.
* [Explanations](#explanations) describe architecture and design decisions.

### How-Tos

* [Setup the project](./doc/how-to/setup.md)

### Guides

* [Documentation Guidelines](./doc/guidelines/doc_guidelines.md)
* [Documentation Style Guide](./doc/guidelines/doc_styleguide.md)
* [Code Style Guidelines](./doc/guidelines/code_style.md)
* [Barrel Pattern](./doc/guidelines/barrel-pattern.md)

### Explanations

* [1. Record architecture decisions](./doc/adr/0001-record-architecture-decisions.md)
* [2. Use Monorepo-Polypackage Setup](./doc/adr/0002-use-monorepo-polypackage-setup.md)
* [3. Release Process](./doc/adr/0003-release-process.md)

### References

* [Release Process](./doc/references/architecture/release-process.md)

## License

By contributing, you agree that your contributions are provided under the repository's [license](./LICENSE).