# Communication Explorer Migration File Tree

This document tracks the migration status of all .js, .ts, and .svelte files from the original `packages/uilib/src/lib/plugins/communication-explorer/` implementation to the new `communication-explorer2` structure.

## Original File Structure (packages/uilib/src/lib/plugins/communication-explorer/)

### ✅ Root Level Files
```
├── communication-explorer.svelte               ✅ MIGRATED → communication-explorer2/src/ui/components/communication-explorer.svelte
├── index.ts                                    ✅ MIGRATED → communication-explorer2/src/ui/index.ts
└── +page.svelte                               🔄 EXAMPLE FILE (not needed for migration)
```

### ✅ Business Logic / Services (→ headless/)
```
├── services/
│   └── ied.ts                                 ✅ MIGRATED → communication-explorer2/src/headless/services/ied.ts
```

### 🔄 Layout Calculation (→ headless/services/)
```
├── _func-layout-calculation/
│   ├── config.ts                              ✅ MIGRATED → communication-explorer2/src/headless/types/ied.ts (as Config interface)
│   ├── index.ts                               ⚠️  PARTIALLY MIGRATED (exports moved to services/index.ts)
│   ├── node-layout.ts                         ✅ MIGRATED → communication-explorer2/src/headless/services/layout-calculation.ts
│   ├── node-layout-connections.ts             🚧 TODO → needs migration (generateConnectionLayout function)
│   ├── node-layout-ieds.ts                   🚧 TODO → needs migration (generateIEDLayout function)
│   ├── get-connected-ieds.ts                 🚧 TODO → needs migration
│   └── get-ied-details.ts                    🚧 TODO → needs migration
```

### ✅ Stores (→ headless/stores/)
```
├── _store-view-filter/
│   ├── index.ts                               ✅ MIGRATED → communication-explorer2/src/headless/stores/index.ts
│   ├── selected-filter-store.ts               ✅ MIGRATED → communication-explorer2/src/headless/stores/filter-store.ts
│   └── selected-filter-store-functions.ts     ✅ MIGRATED → communication-explorer2/src/headless/stores/filter-store.ts (functions integrated)
├── _store-preferences/
│   ├── index.ts                               ✅ MIGRATED → communication-explorer2/src/headless/stores/index.ts
│   ├── preferences-store.ts                   ✅ MIGRATED → communication-explorer2/src/headless/stores/preferences-store.ts
│   └── local-storage-adapter.ts              🔄 TODO (optional enhancement)
```

### ✅ Core UI Component (→ ui/components/)
```
├── telemetry-view/
│   ├── telemetry-view.svelte                  ✅ MIGRATED → communication-explorer2/src/ui/components/telemetry-view.svelte
│   └── index.ts                               ✅ MIGRATED → communication-explorer2/src/ui/index.ts
```

### 🚧 Sidebar Components (→ ui/components/sidebar/) - PENDING MIGRATION
```
├── sidebar/
│   ├── sidebar.svelte                         🚧 TODO → communication-explorer2/src/ui/components/sidebar/sidebar.svelte
│   ├── connection-information/
│   │   └── connection-information.svelte      🚧 TODO → communication-explorer2/src/ui/components/sidebar/connection-information.svelte
│   ├── connection-type-filter/
│   │   └── connection-type-filter.svelte      🚧 TODO → communication-explorer2/src/ui/components/sidebar/connection-type-filter.svelte
│   ├── ied-accordion/
│   │   ├── ied-accordion.svelte               🚧 TODO → communication-explorer2/src/ui/components/sidebar/ied-accordion.svelte
│   │   ├── types.ts                           🚧 TODO → communication-explorer2/src/headless/types/ied.ts (merge types)
│   │   └── index.ts                           🚧 TODO → communication-explorer2/src/ui/components/sidebar/index.ts
│   └── message-type-filter/
│       ├── message-type-filter.svelte         🚧 TODO → communication-explorer2/src/ui/components/sidebar/message-type-filter.svelte
│       ├── message-type-filter.spec.ts        🚧 TODO → communication-explorer2/tests/ (if tests are migrated)
│       ├── index.ts                           🚧 TODO → communication-explorer2/src/ui/components/sidebar/index.ts
│       └── +page.svelte                       🔄 EXAMPLE FILE (not needed for migration)
```

### 🔄 Types (→ headless/types/)
```
├── types/
│   └── index.d.ts                             ✅ MIGRATED → communication-explorer2/src/headless/types/ied.ts (integrated)
```

### 🔄 Assets (→ ui/assets/ if needed)
```
├── sidebar/assets/
│   └── connection-selector.svg                🚧 TODO → communication-explorer2/src/ui/assets/ (if used)
```

## Shared Components Analysis

### ✅ Already Available in packages/ui/
```
├── Theme component                            ✅ AVAILABLE → @oscd-plugins/ui (MaterialTheme)
├── Icons component                           ✅ AVAILABLE → @oscd-plugins/ui
├── Filter components                         ❓ NEEDS ANALYSIS
└── Accordion components                      ❓ NEEDS ANALYSIS
```

### 🔍 Diagram Components (packages/uilib/src/lib/components/diagram/)
```
├── diagram.svelte                            🔍 ANALYSIS NEEDED → potentially move to packages/ui/
├── nodes.ts                                  ✅ MIGRATED → communication-explorer2/src/headless/types/ied.ts
├── message.svelte                            🔍 ANALYSIS NEEDED
├── ied-element/                              🔍 ANALYSIS NEEDED
└── bay-container/                            🔍 ANALYSIS NEEDED
```

## Migration Status Summary

### ✅ Completed (Phase 2)
- **Headless Architecture**: ✅ Complete foundation
- **Basic Services**: ✅ IED services migrated
- **Store Foundation**: ✅ Filter and preferences stores
- **Core Types**: ✅ Basic type definitions
- **UI Framework**: ✅ Basic UI structure with placeholders
- **Build System**: ✅ Working build configuration

### 🚧 In Progress / TODO (Phase 3)
- **Layout Calculation**: 🚧 Missing helper functions (generateConnectionLayout, generateIEDLayout)
- **Sidebar Components**: 🚧 All sidebar UI components need migration
- **Advanced Services**: 🚧 IED details, connection analysis functions

### 🔍 Analysis Needed (Phase 4)
- **Diagram Components**: 🔍 Determine if shared or plugin-specific
- **Asset Files**: 🔍 SVG icons and other assets
- **Advanced Features**: 🔍 Local storage, focus mode, etc.

## File Count Statistics
- **Total Original Files**: ~36 files (.js/.ts/.svelte)
- **Migrated**: ~12 files (33%)
- **Pending Migration**: ~18 files (50%)
- **Analysis Needed**: ~6 files (17%)

## Next Priority Files for Phase 3
1. `_func-layout-calculation/node-layout-connections.ts` (critical for diagram functionality)
2. `_func-layout-calculation/node-layout-ieds.ts` (critical for diagram functionality)
3. `sidebar/sidebar.svelte` (main sidebar component)
4. `sidebar/message-type-filter/message-type-filter.svelte` (user interaction)
5. `sidebar/ied-accordion/ied-accordion.svelte` (detailed view)