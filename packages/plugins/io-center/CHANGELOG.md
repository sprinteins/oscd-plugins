# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 09.04.2025

### Add

- uuids as attribute for LNs

### Changed

- Tree component - Melt library in use

### Fixed

- LCs and LPs stays in the canvas when selected and on changes

## [1.3.0] - 07.04.2025

### Add

- A wrong loaded file page appear if the user loads a file without IEDs

### Changed

- New UI for the left sidebar:
  - the IED tree has a scroll bar
	- dropdown and search input stays on top
	- new dropdown and input style
	- tree colors theme adaptation

## [1.2.0] - 2025-03-30

### Added

- LC list implemented, similar to the LP list
- Restriction: editing Logical Conditioners is blocked after a link has been added to a DO or LP

### Changed

- Tweaks to LC editing logic

## [1.1.3] - 2025-03-28

### Added

- Logic to restrict DO-to-LC connections
- Display of full connection chain (DO → LC → LP) when selecting a DO

### Changed

- Improved LP selection behavior

## [1.1.2] - 2025-03-26

### Added

- Support for multiple ports per element
- Ports are now named according the specified DOs in LCs or LPs

## [1.1.1] - 2025-03-21

### Added

- Support for connecting DO ports to LC ports and vice versa
- Restrictions to disallow connections between incompatible element types (e.g., DO ↔ LP)
- Writing of connection data to SCD file

## [1.1.0] - 2025-03-18

### Added

- Automatically fills missing `LNodeType` when creating LCs or LPs

## [1.0.5] - 2025-03-13

### Added

- Ability to add new LC elements

### Changed

- Support for editing LC elements

## [1.0.4] - 2025-03-06

### Added

- Editing and deleting LP elements

## [1.0.3] - 2025-03-05

### Added

- Creation of new LP elements

## [1.0.2] - 2025-02-21

### Added

- LP list, sorted into LPDI and LPDO
- Search bar to find LPs
- Button to add a new LP
- Selected LPs appear in “Logical Physical Input/Output” column
- Selected LPs are highlighted with a checkbox icon in the sidebar

## [1.0.1] - 2025-02-06

### Added

- Dropdown to select IED
- Tree view for selected IED: LDs > LNs > DOs
- Search bar to locate DOs (search across IED, LD, DO names)
- Search results open in-place and appear only in DO-Bar
- Ability to select multiple DOs in the IED Tree View
- Selected DOs are highlighted and marked with a checkbox icon

## [1.0.0] - 2025-01-31

### Added

- Initial release
