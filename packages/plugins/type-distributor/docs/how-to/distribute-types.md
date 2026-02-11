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
   - Inserts equipment functions and logical nodes
   - Inserts bay-level functions
   - Collects and inserts required data types in dependency order

### 6. Verify Results

Check that:
- Bay attributes are updated correctly
- Conducting equipment has proper function assignments
- Data type templates section contains all required types
- No validation errors appear in OpenSCD

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
