# Changelog

All notable changes to the network explorer plugin will be documented here

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.20] - 2026-01-16
### Changed
- Receive `editor` property from Plugin API
- Fixed import from `Utils.PluginCustomComponentsProps` to `Plugin.CustomComponentsProps`

## [0.0.19] - 2026-01-09
### Added
- Fitview on window resize for AD preview (isOutsidePluginContext)

## [0.0.18] - 2025-12-10
### Changed
- the way we export the network explorer for use in Auto Doc

## [0.0.17] - 2025-11-28
### Added
- Exports the Network-Explorer Component from the Network Explorer
- Accepts prop selectedBays to filter view for selectedBays
- store filtering logic for bays
### Changed
- Switched to LegacyTheme

## [0.0.16] - 2025-11-24
### Changed
- use default color for temp edge

## [0.0.15] - 2025-11-19
### Fixed
- Do not reset position of nodes when creating cables for example
- Use a temporary cable while creating a new connection

## [0.0.14] - 2025-11-14
### Fixed
- Set relative path for .css files

## [0.0.13] - 2025-11-13
### Changed
- Version bumped to 0.0.13 to avoid conflicts with older versions present on gh-pages. This ensures continuity and prevents overlap with previously published releases.

## [0.0.10] - 2025-11-11
### Fixed
- `Uncaught (in promise) ReferenceError: process is not defined` Apparently elkjs contains a reference to the node process which fails in browser (not verified)

## [0.0.9] - 2025-11-11
### Changed
- Setup rollupOptions to bundle to a single file

## [0.0.8] - 2025-11-04
### Changed
- Migrated to Svelte 5

## [0.0.7] - 2024-02-22

### Added

- add validation for cable name (#36)
- add SCD assumptions to sidebar (#37)

## [0.0.6] - 2024-02-22

### Added

- add more details to IED in sidebar (#6)

## [0.0.5] - 2024-02-14

### Added

- add, edit and delete physical connections between IEDs (#17, #28)

## [0.0.4] - 2023-12-13

### Fixed

- connected IED name in IED details accordion in sidebar

## [0.0.3] - 2023-11-30

### Added

- port to IED details accordion in sidebar

## [0.0.2] - 2023-11-27

### Added

- cable accordions to IED details in sidebar

## [0.0.1] - 2023-11-22

### Added

- new network explorer plugin (#1)
- layout (#3)
- IEDs to the network explorer (#2)
- zoomable and movable diagram
- display bays and add IEDs to them (#8)
- select and multiselect IEDs (#15)
- sidebar for details (#16)
- show selected IEDs and their details (#6)