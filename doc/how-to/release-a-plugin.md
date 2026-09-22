# Release a Plugin

Plugin releases are automated. Do not build or copy release files manually.

## 1. Update the plugin version

Edit the `version` field in
`packages/plugins/<plugin-name>/package.json` directly. Use Semantic
Versioning:

- Increase the patch number for a bug fix, for example `0.0.21` to `0.0.22`.
- Increase the minor number for a backwards-compatible feature.
- Increase the major number for a breaking change.

Only change the selected plugin's version. Do not change the root package
version.

## 2. Update the changelog

Add an entry for the new version to the plugin's `CHANGELOG.md`, if the plugin
has one. Follow the [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)
format:

```markdown
## [0.0.22] - YYYY-MM-DD

### Fixed
- Describe the fix.
```

## 3. Merge the changes into `main`

Commit the version and changelog changes, open a pull request, and merge it
into `main` in the upstream repository.

After the merge, the plugin's GitHub Actions workflow automatically:

- Detects the new version
- Builds the plugin
- Publishes the latest and versioned artifacts to `gh-pages`

No manual build, tag, GitHub Release, or artifact copy is required.

## 4. Sync the TransnetBW fork

Open the
[TransnetBW plugin fork](https://github.com/TransnetBW-openSCD/oscd-transnetbw-plugins)
and press **Sync fork**.

This updates the fork from upstream, including the source and published
artifacts used by the TransnetBW deployment.

## Supported plugins

The automated release workflow currently covers:

- `auto-doc`
- `communication-explorer`
- `documentation`
- `io-center`
- `network-explorer`
- `type-designer`
- `type-distributor`
- `type-switcher`

`diffing-tool` does not currently have a release workflow.

For the workflow implementation, see
[`plugin_network-explorer.yml`](../../.github/workflows/plugin_network-explorer.yml)
and [`build.yml`](../../.github/workflows/build.yml).
