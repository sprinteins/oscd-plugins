# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
