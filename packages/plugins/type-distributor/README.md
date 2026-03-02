# Type Distributor

OpenSCD plugin for distributing SSD templates to SCD files.

## Purpose

The Type Distributor plugin enables users to:
- Import bay templates and data type definitions from SSD files
- Match and distribute templates to existing SCD bays
- Copy relevant data types (LNodeType, DOType, DAType, EnumType)
- Create SIEDs with access points and assign functionality to them

## Key Features

- **Template Matching**: Automatic and manual matching of SCD conducting equipment to SSD templates
- **Deterministic Re-Matching**: Persisted bays are resolved by stored `templateUuid` mappings to preserve equipment identity
- **Type Distribution**: Staged insertion of data types with dependency resolution
- **Validation**: Pre-distribution validation to detect ambiguous matches and type mismatches
- **Drag & Drop**: UI support for selecting and applying bay templates

## Documentation

- [Architecture Decisions](docs/architecture-decisions.md) - Design decisions and rationale
- [Code Style](docs/code-style.md) - Coding conventions and patterns
- [How-To Guides](docs/how-to/) - Task-oriented guides
- [Concepts](docs/concepts/) - Matching, assignment, and state model details
