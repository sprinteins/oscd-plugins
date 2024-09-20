# Code Style

## Formatting

Do not use prettier for formatting, we use basic styling for now (which are defined in the [project settings](/.vscode/settings.json) for VSCode):
* tabs is used for indentation
* tabulation size = two spaces
* default formatting for svelte file is active (+ enforce single quotes as default)

## Programming

* use the [barrel pattern](./barrel-pattern.md)
* files in a module should not import from their own index file (except tests, demo pages)
* tests and demo pages (+page.svelte) should import from the module's index to ensure that the module's public API is used
* files outside of a module should always import from the module's index

## Commit convention

We follow the rules of the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary)