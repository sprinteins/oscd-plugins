# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).


## Communication Explorer [Unreleased]
### Fixed
- align filter pills correctly
- sampled values icon publish is missing
- caching extracted information to improve performance

## Changed
- accordion is now reacting to filtered service types

## Type Switcher [Unreleased]
## Documentation [Unreleased]

## Communication Explorer [0.0.29] - 2023-07-20
### Fixed
- align filter pills correctly
- show sampled value icon

## Added
- add service type filter in accordion view

## Communication Explorer [0.0.28] - 2023-07-20
### Fixed
- show sampled values icon in sidebar

## Network Explorer [0.0.15] - 2023-07-20
### Fixed
- replace id with label
- show sampled value display color


## Network Explorer [0.0.14] - 2023-07-19
### Changed
- changed service-type icons

### Added
- add serviceType Label

## Communication Explorer [0.0.26] - 2023-07-19

### Changed
- changed service-type icons

### Added
- add serviceType Label

## Type Switcher [0.0.15] - 2023-07-11
- select all checkbox
- styling enhancements
## Network Explorer [0.0.13] - 2023-07-04

### Added
- href to navigate easier through the page
- add bay documentation
- add bus documentation

### Changed
- pdf export works now via new tab (technical)

## Communication Explorer [0.0.25] - 2023-06-23

### Fixed
- last content of the sidebar was not visible when scrollable

## Communication Explorer [0.0.24] - 2023-06-23

### Added
- draggable diagram when holding space bar
- zoomable diagram with mouse wheel (not the best but works)

### Changed

- diagrams are centered

### Fixed
- MMS messages had the wrong direction
- deselecting by clicking in empty areas worked only in the SVG
  now it works in the whole panel
- irrelevant connections were animated
- selection were persisted even if the user opened a new file causing
  an invalid state where everything was irrelevant
- typo in the sidebar
- removed misleading color of filter chips when clicked
- empty section in sidebar
- unnecessary scrollbar in sidebar

### Added

- groups have icons to show which type they are

### Changed

- long texts indicated with an ellipsis
- adjusted paddings and margins

### Fix

- selecting a node did not trigger change detection


## Communication Explorer [0.0.22] - 2023-06-15

## Added
- clicking on the background of the diagram will deselect all elements
- multiple IED selection
- animated connections to see better the direction of messages
- toggleable animation
- MMS messages
- preferences are persisted in local storage

## Changed
- new diagram design
- sidebar has separate sections for focus mode and preferences

## Dedupe [0.0.11] - 2023-06-07

### Changed
- if no category filter is selected it behaves as if everything would be selected

### Fixed
- the category filter now works even if the user filters before file is processed

## Dedupe [0.0.10] - 2023-05-19

### Changed

- internal restructure of the plugin to allow easier layout changes
- new design and layout

## Dedupe [0.0.9] - 2023-05-15

## Fixed

- Enum Types' structure was not shown

## Dedupe [0.0.8] - 2023-05-15

## Fixed

- Logical Node Types' usages were not found
- Logical Node Types' parents name were not displayed

## Dedupe [0.0.7] - 2023-05-15

## Added

- Dedupe following types
  - Logical Node Type
  - Data Object Type
  - Data Attribute Type
  - Enum Type

## Communication Explorer [0.0.12] - 2023-04-27

### Fixed

- Rename Labels in Sidebar Panel

## Communication Explorer [0.0.11] - 2023-04-26

### Added

- Experiment: hide irrelevant stuff
- Experiment: search by IED name

## Communication Explorer [0.0.10] - 2023-04-26

### Added

- Added Sampled Value Messages to the Communication Explorer
- Filter by message type

### Fixed

- fixed flickering of the view in case of any change

## Communication Explorer [0.0.9] - 2023-04-21

### Fixed

- Missing IED definition crashed the plugin.
  It ignores the IED connection has a undefined IED.

## Communication Explorer [0.0.8] - 2023-04-20

### Added

- IEDs are selectable
- Selecting an IED will show only relevant IEDs and connections
- Filter for incoming and outgoing connections

### Fixed

- The SVG no grows with the diagram

### Network Explorer [0.0.9] - 2023-05-23

- pdf can be generated
- button for pdf download
