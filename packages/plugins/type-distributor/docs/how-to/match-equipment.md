# How to Match Equipment Manually

## When to Use Manual Matching

Manual matching is required when:
- Multiple SSD templates exist for the same equipment type (e.g., two different "CBR" templates)
- Templates have the same type but different names or configurations
- Automatic matching cannot determine the correct template unambiguously

## Steps

### 1. Identify Ambiguous Equipment

After selecting a bay type, the plugin displays:
- A list of equipment requiring manual intervention
- The equipment type and name for each item
- Available template options with counts

### 2. Review Available Templates

For each ambiguous equipment item:
- View the dropdown list of compatible templates
- Templates show: `TemplateName (EquipmentType)`
- The list is filtered to show only:
  - Templates matching the equipment type
  - Templates not already fully consumed by other matches

### 3. Assign Templates

1. Select the appropriate template for each equipment from the dropdown
2. The plugin tracks template usage to prevent over-assignment
3. If a template appears multiple times in the bay type, multiple instances can be assigned

Example:
```
Equipment: CB1 (CBR)
Options:
  - CircuitBreaker_A (CBR)
  - CircuitBreaker_B (CBR)

Selection: CircuitBreaker_A (CBR)
```

### 4. Verify All Matches Are Set

- The "Apply" button remains disabled until all ambiguous equipment is matched
- A status indicator shows match completion

### 5. Apply Changes

Once all matches are set:
1. Click "Apply"
2. The plugin uses manual matches first, then auto-matches remaining equipment
3. Changes are committed to the SCD in a single edit transaction

## Understanding Template Availability

Template availability is calculated as:
- **Available count**: Number of times the template appears in the bay type
- **Used count**: Number of times already assigned in manual matches
- **Remaining**: Available - Used

Only templates with remaining instances appear in the dropdown for selection.

## Changing Manual Matches

To modify a manual match:
1. Select a different template from the dropdown
2. The previous assignment is automatically cleared
3. Template availability counts update in real-time
