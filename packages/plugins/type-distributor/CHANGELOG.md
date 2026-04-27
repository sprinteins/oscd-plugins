# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-04-27
### Added
- Handles now general equipment elements
- missing attributes on parsing ssd

## [1.0.7] - 2026-04-24
### Added
- Re-matching of equipment after LNode assignment: when equipment is re-assigned to a different BayType match, existing LNodes are updated and LDevice instances are renamed accordingly
### Changed
- Moved the "Edit Matching" button into the bay type selection header

## [1-0-6] 2026-04-21
### Changed
- the behavior of the drag and drop so it closes and opens the accesspoint
- allow to drag inside the children of the accesspoint

## [1.0.5] 2026-04-09
### Added
- Validation of the SSD to include mandatory LLN0 Type and its mandatory DOs [#719](https://github.com/sprinteins/oscd-plugins/issues/719)
- Allow renaming of IEDs and Access Points, as well as empty IEDs. Renaming considers current naming rules.
### Changed
- IEDs and APs can't be created without a valid SSD [#719](https://github.com/sprinteins/oscd-plugins/issues/719)
### Fixed
- Option to Edit Matching falsely appearig after assigning all eq(functions) and switching bay back and forth.

## [1.0.4] 2026-03-27
### Fixed
- Initial dnd of from eq(functions) onto AccessPoint closed opened (eq)functions [#707](https://github.com/sprinteins/oscd-plugins/issues/707)
- an issue where BayTypeDetails were shown although the BayType did not match with the Bay [#770](https://github.com/sprinteins/oscd-plugins/issues/770)
- create IedName character issue [#765](https://github.com/sprinteins/oscd-plugins/issues/765)
### Changed
- Refactoring of manualMatching logic, removal of complex state.

## [1.0.3] - 2026-03-26
### Fixed
- An issue in Chromium based browser that run effects different to firefox. Removed an effect and simplified it to the handleBayChange

## [1.0.2] - 2026-03-23
### Changed
- Strip characters illegal in `tLDInst` (`[^A-Za-z0-9_]`) from function names and conducting-equipment names when generating `LDevice inst`. Uniqueness is ensured solely by the 8-character UUID prefix.
- `queryMatchingBayLNode` now locates `EqFunction` elements by UUID prefix only, removing the previous `ConductingEquipment[name=…]` scoping that broke when bay names contained illegal characters.
- BayType Select only enabled if bay selection has been made to guide the user through the two selects.

## [1.0.1] - 2026-03-23
### Changed
- Mark AccessPoints as unused if they do only have LD0 lnodes
- Add another deeper tree so it is now:
```
IED - AP
  > LD
    > LNode
```
### Fixed
- Names on Cards now break to two lines and the options for the Cards won't disappear on too long names

## [1.0.0] - 2026-03-19
### Added
- Added automatic ld0 creation to the accespoints. It will include all l-class lnodes except LGOS and LSVS.
- Added automatic lln0 creation to the ldevice when it is created.
- Allow user to reopen equipment matching panel before the first lnode assignment
- Added validation for IedName: min-max 1-64 chars, start with letter, only alphanumeric, can not be "None"
- `LDevice` elements now receive a `ldName` attribute set to `IedName_inst` on creation.
- `LD0` inst and ldName now encode the access point name: `LD0_APname` / `IedName_LD0_APname`.
### Changed
- Better form handling for the creation of IEDs and AccessPoints. Show dedicated errors below the input fields.
- Do not allow deleting of LD0 and LLN0. These will be deleted when the AP gets deleted or the last LNode of that LDevice gets deleted.
- `LDevice inst` now embeds an 8-character hex UUID prefix derived from the source `EqFunction`/`Function` element's `uuid` attribute (e.g. `ProtectionFunction_a1b2c3d4`, `QA1_ProtectionFunction_a1b2c3d4`). Full UUIDs are not written because the SCL standard forbids hyphens in `inst`.
- `parseLDeviceInst` now requires the new `FunctionName_XXXXXXXX` format and throws on unrecognised formats; returns `functionPrefixUuid` instead of `functionUuid`.
- UUID prefix collision avoidance is now enforced document-wide: `collectExistingPrefixes` scans all `Function` and `EqFunction` elements before inserting new ones.
### Fixed
- Resolved scd still referencing bayType if the last lNode has been deleted. Now removes all references.
- Resolved overflowing text in lNode card of the ied column.
- Resolved an issue where using the wrong function for element creation could lead to `xmlns=""` attributes being added. See [code style](docs/code-style.md) for details.
- Fixed delete button incorrectly appearing on LD0 lnode cards when the ldInst started with `LD0` but was not an exact match.

## [0.5.1]
### Added
- Allow user to delete empty ieds

## [0.5.0]
### Added
- Creation of multiple Access Point for one IED in the create-dialog

### Changed
- Split equipment matching into explicit modes: `matchEquipmentForInitialApply` (manual + fallback) and `matchEquipmentForPersistedBay` (strict persisted mapping)
- Updated drag-and-drop payload model to use explicit `parentUuid`, `functionScopeUuid`, and optional `equipmentUuid`
- Updated assigned-LNode key scoping to include function scope for reliable Function vs EqFunction separation
### Fixed
- Prevent same-type equipment identity drift by prioritizing persisted `templateUuid` mappings
- Scoped conducting-equipment queries to direct bay children (`:scope > ConductingEquipment`) in matching and validation paths

## [0.4.1] - 2026-02-23
### Added
- Search modal for IEDs, AccessPoints, LDevices, LNodes

## [0.4.0] - 2026-02-13
### Added
- Allow user to delete APs and LNodes if it is the last LNode it will also remove the BayType assignment

## [0.3.2] - 2026-02-18
## Added
- Dialog notifying the User to open only .scd files initially
### Changed
- Restrict Switching Bays when working on assigning a BayType to a Bay.
- Cache BayType resolution
### Fixed
- Dropdown being cut into on scroll of right container

## [0.3.1] - 2026-02-12
### Changed
- Restrict BayType usage: As soon as a connection between a BayType and a Bay is established, the BayType becomes locked to that Bay.

## [0.3.0] - 2026-02-11
## Added
- Added `assignedLNodesStore` to track and prevent duplicate LNode assignments, with visual feedback and parent-level disabling.
- Scoped LNode uniqueness to `LDevice` using `parentUuid:lnClass:lnType:lnInst` and detect assignments via `iedName`.
- Drag-and-drop integration marks LNodes assigned and components check assignment status before enabling dragging.

## Changed
- Supports incremental updates during drag-and-drop and automatic rebuilds on bay selection or document edits for performance.
- Equipment matching now uses `bayTypeEquipment.uuid`; UI updates use Svelte 5 `$derived` and bay details receive `bayTypeWithTemplates`.

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
  
