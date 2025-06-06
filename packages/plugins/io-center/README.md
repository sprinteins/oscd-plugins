# I/O Center Plugin for OpenSCD

The I/O Center plugin is a visual tool for creating and managing connections between data objects and logical nodes in SCL (Substation Configuration Language) files. It provides an intuitive flow-based interface for visualizing and editing the communication relationships between different elements.

## Overview

This plugin enables users to:

* Create connections between Data Objects (DO) and Logical Nodes (LN)
* Visualize the data flow across three main components:
    * Data Objects (left column)
    * Logical Conditioners (middle column)
    * Logical Physical nodes (right column)
* Manage the relationships between these elements with an interactive canvas

## How It Works

The I/O Center plugin represents your SCL elements as interactive nodes in a three-column flow diagram:

1. Data Objects
2. Logical Conditioners
3. Logical Physical

Each element has ports that can be connected, and the connections represent the data flow between elements. The plugin maintains these relationships in your SCL document as:

* `LNRef` elements (for Data Objects and Logical Physical nodes)
* `DOI` (Data Object Instance) elements (for Logical Conditioners)

## Usage

1. Select an IED from the left sidebar to view its Data Objects
2. Click and drag from a port to create a connection
3. Connect elements by dragging from a source port to a target port
4. Manage connections by clicking on existing lines (select/delete)
5. Scroll within columns to view more elements if they don't fit in the viewport

## Technical Details

* Built with Svelte 5
* Uses UUID attributes to uniquely identify elements in the SCL document

## Requirements

The plugin requires an SCL file with IEDs that contain the necessary Data Objects and Logical Nodes. If no IEDs are present in the file, the plugin will display a warning message.