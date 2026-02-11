# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-02-11
### Added
- Assigned LNodes tracking system to prevent duplicate LNode assignments to IEDs
  - New `assignedLNodesStore` that maintains an index of already-assigned LNodes
  - Visual feedback for assigned LNodes (50% opacity, disabled cursor, gray text)
  - Parent-level disabling when all child LNodes are assigned
  - Automatic rebuild on bay selection changes and document edits
  - Incremental updates during drag-and-drop for performance
- Scoped LNode uniqueness using `parentUuid:lnClass:lnType:lnInst` format
- Detection of assigned LNodes via `iedName` attribute presence
- Integration with drag-and-drop workflow to mark LNodes as assigned after successful drop

### Changed
- LNode uniqueness is now scoped to LDevice instead of entire document^
  - `hasLNodeInTargetDoc` now checks within specific LDevice context
  - Prevents false positives when same LNode type exists in different LDevices
- Drag-and-drop components now check assignment status before enabling dragging
- UI components reactively update based on assignment status using Svelte 5 `$derived`
- Equipment matching updated to use `bayTypeEquipment.uuid` instead of `templateEquipment.uuid`
- Bay type details view now receives full `bayTypeWithTemplates` for improved context

## [0.2.1] - 2026-02-06
## Fixed
- Resolved an issue where the Toolbar was not properly imported

## [0.2.0] - 2026-02-06
### Added 
- Dialog to create S-IEDs and AccessPoints with validation
- S-IED AccessPoints view showing LNodes per AccessPoint
- Bay type assignment workflow with automatic equipment matching
- Manual equipment matching for ambiguous types
- Restricts the BayType usage to only match with Bays that have the same amount of ConductinEquipments
- Drag-and-drop functionality to assign LNodes from bay types to IED AccessPoints
- LNode assignment to IEDs with automatic LDevice creation
- Equipment matching validation with error reporting
- Bay LNode update functionality to link LNodes to IEDs
- Unit tests for IED operations, matching logic, and validation
- Type definitions for assignable templates and equipment matching

### Changed
- Restructured type definitions from `headless/types` to `headless/common-types`
- Improved component organization with dedicated column folders (bay-type, s-ied)
- Updated store architecture with bay, equipment matching, and DnD stores

## [0.1.3] - 2026-01-19
### Added
- Add IED utilities: functions to create SIEDs and AccessPoints, plus a getSIEDs accessor for retrieval
- Add unit tests validating creation, AccessPoint handling, and retrieval behavior

## [0.1.2] - 2026-01-16
### Changed
- Receive `editor` property from Plugin API

## [0.1.1] 2026-01-12
### Added
- Tests for SSD parsing
- `@vitest/coverage-v8` and `@vitest/ui`

## [0.1.0] 2025-12-18
### Added
- Headless SSD parsing utilities (`parseTemplates`, `parseDataTypeTemplates`, `parseBayTypes`)
- `ssdImportStore` and `bayTypesStore` for SSD import and template resolution
- Svelte UI components: toolbar, type-distributor view, bay type items and cards
- Vitest configuration and an initial spec file
- Package scripts for development, testing and integrated runs

### Changed
- Updated workspace scripts and dependency versions related to the type-distributor plugin
  
  