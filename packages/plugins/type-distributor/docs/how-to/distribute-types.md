# How to Distribute Types from SSD to SCD

## Prerequisites

- An SCD file loaded in OpenSCD
- An SSD file containing bay templates and data type definitions
- A bay in the SCD that needs type distribution

## Steps

### 1. Import SSD File

1. Open the Type Distributor plugin
2. Import your SSD file (drag-and-drop or file picker)
3. The plugin parses bay types, equipment templates, and data type definitions

### 2. Select Target Bay

1. Navigate to the bay in your SCD that you want to update
2. The plugin displays the selected bay name
3. Ensure the bay contains conducting equipment elements

### 3. Select Bay Template

1. View the list of available bay types from the imported SSD
2. Select the bay type that matches your SCD bay structure
3. The plugin validates the match automatically

### 4. Handle Manual Matching (if required)

If the validation indicates ambiguous matches:

1. The plugin displays equipment that requires manual matching
2. For each ambiguous equipment, select the correct template from the dropdown
3. Available options are filtered based on:
   - Equipment type compatibility
   - Already-used template instances
4. Confirm all manual matches are set

### 5. Apply Bay Type

1. Click "Apply" or equivalent action button
2. The plugin executes the following operations:
   - Updates bay attributes (name, description)
   - Updates conducting equipment references
   - Inserts equipment functions and logical nodes (each `EqFunction` receives a fresh `uuid`)
   - Inserts bay-level functions
   - Collects and inserts required data types in dependency order

### 6. Assign LNodes to an IED

Drag a `Function` or `EqFunction` card from the SSD panel onto an IED access point:

1. The plugin creates an `LDevice` in the target access point with a deterministic `inst`:
   - Equipment function: `EquipmentName_FunctionName_XXXXXXXX`
   - Bay function: `FunctionName_XXXXXXXX`
   - LD0: `LD0_AccessPointName`

   `XXXXXXXX` is an 8-character lowercase hex prefix derived from the source `EqFunction` or `Function` element's `uuid` attribute by stripping hyphens and taking the first 8 characters (e.g., UUID `a1b2c3d4-…` → prefix `a1b2c3d4`).
2. The `ldName` attribute is set to `IedName_inst`.
3. The `LNode` elements in the SSD bay receive `iedName` and `ldInst` attributes pointing to the new `LDevice`.
4. The assigned card is greyed out in the SSD panel.

#### Duplicate same-named EqFunctions

When a piece of equipment has multiple `EqFunction` elements with the same `name` (e.g., two `DisconnectorFunction` entries), the plugin disambiguates them by **position** — the nth template EqFunction corresponds to the nth SCD EqFunction of that name. Each gets a distinct `LDevice inst` via its own UUID.

### 7. Verify Results

Check that:
- Bay attributes are updated correctly
- Conducting equipment has proper function assignments
- Data type templates section contains all required types
- LDevice `inst` values are unique and follow the naming schema (e.g., `CEQ1_DisconnectorFunction_a1b2c3d4`)
- Each assigned `LNode` in the SSD bay has `iedName` and `ldInst` set

## Troubleshooting

**Error: "Manual matching required"**
- Multiple templates exist for the same equipment type
- Solution: Use the manual matching UI to specify which template to use for each equipment

**Error: "Type mismatch between SCD and BayType"**
- The number of equipment of a certain type doesn't match between SCD and template
- Solution: Adjust SCD bay structure or select a different bay template

**Missing data types after application**
- Dependency resolution may have failed
- Solution: Check browser console for errors and report the issue

**Second EqFunction of the same name not getting `iedName` set**
- Caused by name-only EqFunction lookup always resolving to the first match
- Fixed by position-based matching and `scdEqFunctionUuid` lookup; ensure you are on the latest version
