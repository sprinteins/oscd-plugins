# Type Distributor

OpenSCD plugin for distributin (SSD) templates to (SCD) files.

## Purpose

The Type Distributor plugin enables users to:
- Import bay templates and data type definitions from SSD files
- Match and distribute templates to existing SCD bays
- Automatically generate and insert IEC 61850 data types (LNodeType, DOType, DAType, EnumType)
- Create IEDs with access points and logical nodes based on SSD templates

## Key Features

- **Template Matching**: Automatic and manual matching of SCD conducting equipment to SSD templates
- **Type Distribution**: Staged insertion of IEC 61850 data types with dependency resolution
- **Validation**: Pre-distribution validation to detect ambiguous matches and type mismatches
- **Drag & Drop**: UI support for selecting and applying bay templates

## Documentation

- [Architecture Decisions](src/docs/architecture-decisions.md) - Design decisions and rationale
- [Code Style](src/docs/code-style.md) - Coding conventions and patterns
- [How-To Guides](src/docs/how-to/) - Task-oriented guides
- [Concepts](src/docs/concepts/) - Understanding matching
