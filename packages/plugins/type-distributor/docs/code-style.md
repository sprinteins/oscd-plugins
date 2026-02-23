# Code Style

## Naming Conventions

### Functions
- Use descriptive verb-based names: `matchEquipment`, `validateBayTypeSelection`, `applyBayTypeSelection`
- Prefix boolean-returning functions with `is`, `has`, `can`: `isValid`, `canAutoMatch`
- Use `build*` prefix for factory functions returning edits: `buildEditsForBayLNode`, `buildEditsForType`
- Use `query*` prefix for querying XML structure: `queryConductingEquipment`, `queryLNodeTypes`
- use `ensure` prefix for functions that guarantee a condition: `ensureDataTypeTemplates`

### Variables
- Use camelCase for variables: `scdBay`, `bayType`, `manualMatches`
- Use descriptive names over abbreviations: `conductingEquipment` not `ce`
- Use plurals for arrays/collections: `matches`, `templates`, `edits`

### Types
- Use PascalCase for type names: `BayType`, `EquipmentMatch`, `ValidationResult`
- Suffix with descriptive noun: `ConductingEquipmentTemplate`, `LNodeTemplate`

## File Organization

### Module Structure
```
src/
├── headless/           # Business logic
│   ├── stores/         # State management
│   ├── matching/       # Equipment matching logic
│   │   ├── scd-edits/  # SCD modification functions
│   │   └── validation/ # Validation logic
│   ├── ied/            # IED creation
│   ├── ssd-parsing/    # SSD file parsing
│   └── common-types/   # Shared type definitions
└── ui/                 # UI components
    └── components/
        └── views/      # Main View
        └── columns/    # the 3 columns in the Type Distributor UI: SLD, S-IED and BayType
```

### File Naming
- Use kebab-case for files: `equipment-matching.svelte`, `apply-bay-type-selection.ts`
- Co-locate tests with source: `matching.ts` → `matching.spec.ts`
- Use `.d.ts` for type-only files: `ssd-types.d.ts`

## Testing Patterns

### Given-When-Then Structure
```typescript
describe('GIVEN matching equipment types', () => {
  describe('WHEN running auto-matching', () => {
    it('THEN should match equipment by type', () => {
      // test implementation
    })
  })
})
```

### Test Utilities
- Extract mock creation into helper functions: `createBayType`, `createTemplate`, `mockTemplates`
- Use descriptive mock data: `'template1'`, `'CBR'`, not generic values

## Parameter object rule (Code Style Decision)

- For functions with three or more parameters, prefer a single object parameter typed via an interface (see decision: `docs/code-style-decisions/0001-parameter-object-params.md`).
- Pass resolved inputs into functions instead of reading stores inside the function to keep functions simpler and easier to test.
