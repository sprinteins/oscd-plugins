# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.16.0] - 06.06.2025

### Added

- Update LNode lnInst attributes on ref deletion

## [3.15.0] - 06.06.2025

### Added

- Type refs are always visible in the import container (even after importing a linked type)

## [3.14.1] - 06.06.2025

### Fixed

- Import naming on duplicate elements

## [3.14.0] - 06.06.2025

### Added

- Imported bays are always written after the `Bay[name="Template"]`

## [3.13.0] - 06.06.2025

### Added

- Update notification dot and tooltip 

## [3.12.0] - 05.06.2025

### Changed

- Drag'n'Drop opening time on elements card (from 500 to 200 ms)

### Fixed

- Scrollbar adjust its position for the last type element item in the list, so that it is now possible to easily drop elements.

## [3.11.0] - 23.05.2025

### Added

- global import menu for local or compas imports
- import for columns `Bay` and `Equipments`
- Three import tabs in the import container : All / Import / Update
- Ability to import or update already imported elements recursively:
	- comparing an imported element with those in the working document:
		- if there is not twin element, it appears in the add tab
		- if there is a twin but are not strictly identic (we check attributes and children recursively, except uuids and names attributes), it appears in the update tab : which is a delete and recreate functionality.
		- if they are strictly identic (recursively), they doesn't appear

### Removed

- import dropdown menu in all columns

## [3.10.4] - 02.05.2025

### Fixed

- Create a new element named after one that was deleted

## [3.10.3] - 02.05.2025

### Fixed

- Uuids are recursively added to element that are not part of DataTypeTemplates

## [3.10.2] - 16.04.2025

### Changed

- Adapt the dialog calls to its newer logic

## [3.10.1] - 31.03.2025

### Fixed

- The allowed dropzone have been restricted to go along with the UI

## [3.10.0] - 31.03.2025

### Changed 

- Container height ratio changed from 1:2 / 1:2 to 1:4 / 3:4
- Drag'n'drop dropzone has been enhanced

### Fixed 

- importing `Function` opens the container in the right column if there is no type to import

## [3.9.0] - 27.03.2025

### Added 

- Add duplicate ref menu entry

## [3.8.0] - 27.03.2025

### Added 

- Bay refs badges to differentiate function from equipment

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
