# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [UNRELEASED]
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
  
  