# Changelog

All notable changes to the communication explorer plugin will be documented here

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Exports the TelemetryView Component from the Communication Explorer

## [0.0.37] - 11.11.2025
### Changed
- Setup rollupOptions to bundle to a single file
### Fixed
- Set relative path for .css files

## [0.0.36] - 04.11.2025
### Changed
- Migrated to Svelte 5

## [0.0.35] - 2025-03-12
### Fixed
- fixing uilib examples

## [0.0.34] - 2025-02-26
### Changed
- revert theme color fix (dark theme)

## [0.0.33] - 2025-02-19
### Added
- Added option to remove grouping by bay. When selected, bays are visualized by small text labels instead. All IEDs that are part of a bay are selected when clicking a label.

## [0.0.32] - 2025-02-13
### Added
- added outline around IEDs to visualize the bay containing them

### Changed
- IEDs are now grouped together by their bays

## [0.0.31] - 2025-02-12
### Added
- bays (aswell as IEDs) can now be selected in the 'filter' searchbar on the right

### Changed
- filter dropdown + searchbar are now combined

## [0.0.30] - 2023-11-14
### Changed
- accordion is now reacting to filtered service types

### Fixed
- align filter pills correctly
- sampled values icon publish is missing
- caching extracted information to improve performance

## [0.0.29] - 2023-07-20
### Fixed
- align filter pills correctly
- show sampled value icon

### Added
- add service type filter in accordion view

## [0.0.28] - 2023-07-20
### Fixed
- show sampled values icon in sidebar

## [0.0.26] - 2023-07-19

### Changed
- changed service-type icons

### Added
- add serviceType Label

## [0.0.25] - 2023-06-23

### Fixed
- last content of the sidebar was not visible when scrollable

## [0.0.24] - 2023-06-23

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


## [0.0.22] - 2023-06-15

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

## [0.0.12] - 2023-04-27

### Fixed

- Rename Labels in Sidebar Panel

## [0.0.11] - 2023-04-26

### Added

- Experiment: hide irrelevant stuff
- Experiment: search by IED name

## [0.0.10] - 2023-04-26

### Added

- Added Sampled Value Messages to the Communication Explorer
- Filter by message type

### Fixed

- fixed flickering of the view in case of any change

## [0.0.9] - 2023-04-21

### Fixed

- Missing IED definition crashed the plugin.
  It ignores the IED connection has a undefined IED.

## [0.0.8] - 2023-04-20

### Added

- IEDs are selectable
- Selecting an IED will show only relevant IEDs and connections
- Filter for incoming and outgoing connections

### Fixed

- The SVG no grows with the diagram