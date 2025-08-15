# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.17.4] - 2025-08-15
- Fix drop zone freeze when dragging signal list rows
- Improve UX when dragging singal list rows

## [1.17.3] - 2025-06-16

### Changed

- Improve UX by gathering data only when needed on signal list pdf generation
- Remove duplicates in generated tables

## [1.17.2] - 2025-05-27

### Fixed

- Fix signallist calculation

## [1.17.0] - 2025-05-02

### Added

- Insert placeholder button
- XPath help modal
- Tooltip for rich text editor buttons 

### Changed

- Turn rich text editor buttons to icons

## [1.16.2] - 2025-04-25

### Fixed

- Open SCD files in overiew instead of edit view

## [1.16.1] - 2025-04-15

### Fixed

- Images cut in PDF export

## [1.16.0] - 2025-03-31

### Added

- Display images in PDF export

## [1.15.0] - 2025-03-31

### Added

- Fill table with placeholder values

## [1.14.0] - 2025-03-28

### Added

- Master template flag on SCD file
- Disable import template function when it's a master template


## [1.13.1] - 2025-03-28

### Fix

- xpath placeholder storage on scd file
 
## [1.13.0] - 2025-03-26

### Added

- Table module

## [1.12.0] - 2025-03-21

### Added

- Drag and Drop functionality for Signallist element.

## [1.11.0] - 2025-03-20

### Added

- Import templates from file

## [1.10.0] - 2025-03-14

### Changed

- Migrate event store to V3

### Fixed

- Remove direct doc access

## [1.9.0] - 2025-03-14

### Added

- Move block elements

## [1.8.1] - 2025-03-17

### Added

- UI/UX Adjustments

## [1.8.0] - 2025-03-13

### Added

- Duplicate block elements

## [1.7.0] - 2025-03-11

### Added

- Rich Text Editor

## [1.6.0] - 2025-03-10

### Added

- Export Signal List block element as a extra xlsx file
  
## [1.5.1] - 2025-03-07

### Fix

- Search logic of message subscribers: Users can now search multiple message types at once

## [1.5.0] - 2025-02-24

### Added

- Duplicate a template

## [1.4.0] - 2025-02-21

### Added

- Edit an already created template

## [1.3.1] - 2025-02-25

### Fix

- Fix deployment build issue

## [1.3.0] - 2025-02-19

### Added
- PDF generation based on content of block elements 

## [1.2.0] - 2024-12-08

### Added
- New block element (Signal List) 



## [1.1.0] - 2024-12-08

### Added
- Template creation Page
- Navigation router for switching between the template overview and template creation page
- Creation of block elements such as Text and Image
- Edit template title and description
- Deletion of an already created template on the overview page
- Deletion of created block elements on the template creation page
- Persistence of data in the scd file


## [1.0.0] - 2024-10-21

### Added

- Template overview page
- New Table with 5 Columns that displays template values such as title, description and last modification date
- 4 action icons on the table with future possibility to delete, edit, duplicate and export a template
- Logic for saving templates into the scd file

