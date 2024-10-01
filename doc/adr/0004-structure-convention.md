# 4. Structure convention

Date: 2024-09-24

## Status

Accepted

## Context

The core packages gains more and more logic, we need a way to have small piece of code that are easily maintainable.

## Decision

### Domain Driven
Code is split by domain. Each domain will have its own directory, and within each directory, the code will be further organized by functionality. This structure will help in maintaining a clean and manageable codebase.

### Naming Convention

To maintain consistency across the codebase, we will adopt a clear and concise naming convention. All files and directories will use `kebab-case` for their names. Except for main or index file, each file will be named using the format `name-of-file.name-of-folder.ts`, ensuring uniformity and readability. 

#### Examples

- Directories: `data-type-templates`
- Files: `queries.data-type-templates.ts`

It goes the same way for `service` or `utility` files : `service.data-type-templates.ts`

### Type Declaration Files

Type declaration files are special TypeScript files that end with the `.d.ts` extension. These files are used exclusively for declaring types and do not contain any executable code. By using `.d.ts` files, we ensure that type definitions are centralized, easily accessible, and separate from implementation code. These files should remains next to the domain, like the others.

#### Examples

- `types.data-type-templates.d.ts`: Contains type definitions related to data type templates. (inside the `data-type-templates` folder)
- `types.scd-queries.d.ts`: Contains type definitions related to SCD queries. (inside the `scd-queries` folder)

This approach promotes better type management and reduces redundancy, contributing to a more organized and maintainable codebase.


#### Directory Structure

The proposed directory structure is as follows:

```
/src
	/domain1
		/featureA
		/featureB
	/domain2
		/featureC
		/featureD
```

### Benefits

- **Modularity**: Each domain and feature can be developed and tested independently.
- **Scalability**: New domains and features can be added without affecting existing code.
- **Maintainability**: Easier to locate and fix bugs or add new functionality.

### Drawbacks

- **Initial Setup**: Requires initial effort to set up the directory structure.
- **Learning Curve**: New developers may need time to understand the structure.

## Consequences

Adopting this structure will require refactoring existing code to fit into the new directories. However, the long-term benefits of a more organized and maintainable codebase outweigh the initial setup costs.


