# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.7.0] - 27.03.2025

### Added 

- Drag and Drop adaptions 

## [3.6.0] - 26.03.2025

### Added 

- One can now modify the number of `Terminal` of a `ConductingEquipment` via the sidebar.
Note that :
  - some of them have a fixed number defined by the standard, and thus the dropdown is disabled
	- the default number at creation has been restricted to two.

## [3.5.0] - 24.03.2025

### Added 

- Add occurrence on refs name

## [3.4.1] - 21.03.2025

### Fixed 

- Sidebar input validation on names : i.e. changing to a non-unique value is no longer allowed

## [3.4.0] - 20.03.2025

### Added 

- Add user decision dialog thats displays the imports/changes to be made
- Deep import (resolves all nested and related elements - ref to type)

## [3.3.0] - 14.03-2025

### Added

- Load file from Com-pas
- Load file locally
- Import `Function` or `LNodeType` from another SSD file
- Add container components for imported elements
- Rename imported type when same name arise (suffixed with `Imported`)
- Disable details for imported types in the sidebar view

### Changed

- Wrong page component : new UI

### Fixed

- Reactive creation of the `TEMPLATE` structure

## [3.2.0] - 27-02-2025

### Added

- Virtual attribute is added on equipment creation (default to 'false')
- Sidebar close on type deletion
- Names are unique (custom or automated) - each iteration is assigned a new occurrence

## [3.1.0] - 26-02-2025

### Added

- Add Terminals on ConductingEquipment creation

## [3.0.0] - 25-02-2025

### Added

- Automated SCL file attributes update to last available definition (ed2.2) : ie. `Version=""2007" Revision="C" Release="5"`
- Add `originUuid` attribute on instantiated elements from a given template element
- All Equipment and Function types are written in `Substation [name="TEMPLATE", desc="Template Container"]` > `VoltageLevel [name="TEMPLATE", desc="Template Container"]` > `Bay [name="TEMPLATE", desc="Template Container"]`
- Bay Types are written in `Substation [name="TEMPLATE", desc="Template Container"]` > `VoltageLevel [name="TEMPLATE", desc="Template Container"]`
- All types have uuid attributes (according to standard ed 2.2)
- All refs have `templateUuid` linking to the type's uuid (according to standard ed 2.2)
- All refs have `originUuid` (according to standard ed 2.2)
- LNode refs have the following attributes : 
  - `lnClass` (copy of `LNodeType`)
	- `lnInst` (which iterate based on ref occurrence in the current type)
	- `iedName` set to `None`
	- `lnType` set to `LNodeType` id
- Instance `warning` and `issue` toasts has been deactivated for now

### Removed

- Those elements have been deprecated : 
  - `FunctionTemplate` (standard)
  - `EquipmentTypeTemplates` (custom)
  - `GeneralEquipmentType` (custom)
	- `ConductingEquipmentType` (custom)

## [2.4.0] - 17-02-2025

### Added

- Search input for each columns
- The searched result is automatically displayed

## [2.3.0] - 17-02-2025

### Added

- Delete entry in Ref menu (+ ref deletion)
- Ring around the selected type
- Truncated ref placeholder

### Changed

- Private element at the top of the file below the `Header` (as per definition)
- New namespaces added to the `SCL` (root) element

## [2.2.0] - 12-02-2025

### Added

- Duplicate entry in Type menu
- Type (and related refs) duplication with default naming following this pattern : `${parentName}_Copy_${occurrence}`

## [2.1.0] - 10-02-2025

### Added

- Dropdown menu attach to Type
- Type manual deletion with related refs automated deletion

### Changed

- Refs rules :
	* FunctionTemplate goes in GeneralEquipment as EqFunction
	* FunctionTemplate goes in ConductingEquipment as EqFunction
	* FunctionTemplate goes in Bay as Function

### Fixed

- Type namespaced attributes from unstable revision to type-designer
- Reset equipment selection when changing from GenEq to CondEq and vice versa

## [2.0.0] - 10-01-2025

### Added 

- Reading ssd files
- Error page if the user has not loaded an SSD file
- Creating the Substation[name=TEMPLATE] > VoltageLevel[name=TEMPLATE] fields on file opening
- Input to set the name of the type (with default name and occurrence)
- Select input to choose an equipment from a given list (with default names and occurrence based on kind)
- Add refs via drag and drop following specific rules :
  * LNTypes goes in FunctionTemplate as LNode
	* FunctionTemplate goes in GeneralEquipment as EqFunction
	* FunctionTemplate goes in ConductingEquipment as Function
	* FunctionTemplate goes in Bay as Function
	* GeneralEquipmentType (from EquipmentTypeTemplates) goes in Bay as GeneralEquipment
	* ConductingEquipmentType (from EquipmentTypeTemplates) goes in Bay as ConductingEquipment
- EquipmentTypeTemplates is wrapped by a Private 'type-designer' field (as not part of the standard)
- FunctionTemplate are wrapped by a Private 'eIEC61850-6-100' field (as part of the revision 90-30 proposal)
- Type and Refs are created using the last Edit API v3

### Changed

- 4 boards for each type elements : Bay, Equipment, Function, LNodeType
- New {Element} button
- Edit parameters drawer showing the attributes from the current type + adding them from the standard as available and modifiable

### Removed

- Hide/Display Columns
- Add and remove typeRefs through drawer
- SCD XSD schema file for Type Designer

## [1.0.0] - 04-10-2024

### Added

- SCD XSD schema file for Type Designer
- 6 boards for each elements : Substation, Voltage Level, Bay, IED, LDevice, LNode
- New {Element} button
- Data persistence through SCD file
- Hide/Display Columns
- Edit parameters drawer
- Add and remove typeRefs through drawer
