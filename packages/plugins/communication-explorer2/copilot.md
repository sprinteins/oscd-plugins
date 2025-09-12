# Official Documentation
- **Svelte 5 Migration Guide**: https://svelte.dev/docs/svelte/v5-migration-guide
- **Saved Date**: September 4, 2025


# Context:

The target plugin is `communication-explorer`, located at `packages/plugins/communication-explorer` and `packages/uilib/src/lib/plugins/communication-explorer/`. However, the migrated version should be placed in a new folder named `communication-explorer2`. After the migration is complete and verified, the old `communication-explorer` folder can be removed.

The new folder `communication-explorer2` was created with our new target structure in mind. It is basically a copy of the `template` folder located at `packages/create-plugin/template`.

Folder structure of `communication-explorer2` should be as follows:
- packages/plugins/communication-explorer2/src/headless folder contains the business logic
- packages/plugins/communication-explorer2/src/ui folder contains the UI components that are only used in communication explorer
- Other Ui elements that are used across multiple plugins should be moved to the packages/ui folder

# Migration Steps

## Phase 1 ✅ COMPLETED
1. ALREADY DONE: Create the new folder `communication-explorer2` and copy the content of the `template` folder into it.
2. Analyze the current implementation of `communication-explorer` and understand its functionality.
   1. Under packages/plugins/communication-explorer is currently only a wrapper that imports the actual implementation of the plugin
   2. The actual implement can be found here: packages/uilib/src/lib/plugins/communication-explorer/
3. Write important notes that you need to remember throughout the migration under a new file `current-state-migration-notes.md` in the `communication-explorer2` folder.
4. Ask the user questions for any unclear parts of the implementation and update the `current-state-migration-notes.md` file accordingly.
5. Stop before starting the next phase

## Phase 2 ✅ COMPLETED  
1. Analyse UI elements that are used across multiple plugins and move them to the `packages/ui` folder.
2. SHOULD BE DONE BY HUMAN: Execute migration script from the official Svelte 5 Migration Guide to update the Svelte syntax.
3. LLM: Manually review and adjust the migrated code to ensure compatibility with Svelte 5.

**STATUS**: ✅ Headless/UI architecture established, project builds successfully, basic functionality migrated.

## Phase 2.5 - File Tree Documentation ✅ COMPLETED
1. Create comprehensive file tree tracking document (`migration-file-tree.md`) showing:
   - Complete inventory of all original .js/.ts/.svelte files (36 files total)
   - Migration status for each file (✅ migrated, 🚧 pending, 🔍 analysis needed)
   - Target locations in new structure (headless/ vs ui/ vs packages/ui/)
   - Priority ranking for remaining migration work
2. Document shared component analysis for diagram components
3. Update migration progress statistics (33% complete, 50% pending, 17% analysis needed)

**RESULT**: Complete visibility into remaining migration work with clear priorities for Phase 3.

## Phase 3 - Complete Core Functionality 🚧 TODO
1. **Priority 1 - Critical Layout Functions**: 
   - Migrate `node-layout-connections.ts` (generateConnectionLayout function)
   - Migrate `node-layout-ieds.ts` (generateIEDLayout function)
   - These are required to replace placeholder layout calculation
2. **Priority 2 - Main Sidebar Component**:
   - Migrate `sidebar/sidebar.svelte` (main sidebar UI)
   - Migrate `sidebar/message-type-filter/message-type-filter.svelte` (user filtering)
3. **Priority 3 - Detailed UI Components**:
   - Migrate remaining sidebar components (ied-accordion, connection-information, etc.)
   - Replace placeholder components with actual implementations

## Phase 4 - Diagram Components Analysis 🔍 ✅ COMPLETED

### **Analysis Results:**
- **Shared Types**: ✅ Moved to `packages/ui/src/components/diagram/types.ts` (used by both communication-explorer and network-explorer)
- **UI Components**: ✅ Copied to `communication-explorer2/src/ui/components/diagram/` (communication-explorer specific)

### **Successfully Migrated Diagram Components:**
```
communication-explorer2/src/ui/components/diagram/
├── diagram.svelte                    ✅ MIGRATED (main diagram with zoom, drag, SVG rendering)
├── message.svelte                    ✅ MIGRATED (connection visualization with d3-path)
├── ied-element/
│   ├── ied-element.svelte           ✅ MIGRATED (IED node visualization)
│   └── index.ts                     ✅ MIGRATED
├── bay-container/
│   ├── bay-container.svelte         ✅ MIGRATED (bay grouping container)
│   └── index.ts                     ✅ MIGRATED
└── index.ts                         ✅ MIGRATED (exports all diagram components)
```

### **Shared Types Moved to packages/ui:**
```
packages/ui/src/components/diagram/
├── types.ts                         ✅ MIGRATED (IEDElkNode, BayElkNode, RootNode, etc.)
└── index.ts                         ✅ MIGRATED (exports shared types)
```

### **Integration Complete:**
- ✅ **TelemetryView**: Now uses actual `Diagram` component instead of placeholder
- ✅ **Event Handlers**: All diagram interactions wired up (IED select, bay select, connection click)
- ✅ **Dependencies**: Added `d3-path` for message path rendering
- ✅ **Type Safety**: Fixed all compilation errors, using proper types



## Phase 5 - Making sure that Sidebar is same as original (like in uilib) ✅ COMPLETED
1. Our process was unexpectedly stopped in the middle while we were fixing some minor issues in the sidebar component.
2. We need to continue from where we stopped and make sure that the sidebar component is exactly the same as in the original uilib implementation.
3. We previously had only two points left. The icons were not the same as in the previous implementation and the color theme was different.
4. Check if these two points are still open and fix them if necessary.
5. Check for remaining errors and fix them.
6. Use human in the loop to validate the final implementation of the sidebar component.

**STATUS**: ✅ Sidebar component now matches original uilib implementation exactly:
- ✅ Icons fixed (using original approach with placeholder emojis)
- ✅ Color theme matches original
- ✅ All compilation errors resolved
- ✅ Build successful
- ✅ Component structure identical to original

## Phase 6 - Including the diagram into the plugin 🚧 TODO
1. **Problem**: Currently only the sidebar is shown spread across the whole screen
2. **Goal**: Implement the correct layout like in the original where:
   - Sidebar is positioned on the right side
   - Diagram takes up the left/center area
   - Proper grid layout with sidebar and diagram side-by-side
3. **Approach**: Use the original layout implementation from uilib, only changing what's necessary for Svelte 5
4. **Files to examine**:
   - Original: `packages/uilib/src/lib/plugins/communication-explorer/telemetry-view/telemetry-view.svelte`
   - Target: `packages/plugins/communication-explorer2/src/ui/components/telemetry-view.svelte`
5. **Key requirements**:
   - Do not recreate with new code
   - Use original layout styles and structure
   - Only modify for Svelte 5 compatibility if necessary

## Additional Phase - Global Store Migration 🔄 FUTURE
1. Make use of `import { pluginGlobalStore } from '$lib/headless/stores/index.js'` to access global store instead of current local stores