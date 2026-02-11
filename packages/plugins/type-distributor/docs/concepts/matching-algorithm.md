# Equipment Matching Concepts

## Overview

Equipment matching is the process of pairing conducting equipment elements in the SCD with template definitions from the SSD. This determines which template's logical nodes and functions get applied to each piece of equipment.

## Matching Strategies

### Automatic Matching

The plugin attempts automatic matching based on equipment type:

```xml
<!-- SCD Bay -->
<ConductingEquipment name="CB1" type="CBR"/>
<ConductingEquipment name="DS1" type="DIS"/>

<!-- SSD Bay Type -->
<ConductingEquipmentTemplate type="CBR" name="CircuitBreaker">
  <!-- template details -->
</ConductingEquipmentTemplate>
<ConductingEquipmentTemplate type="DIS" name="Disconnector">
  <!-- template details -->
</ConductingEquipmentTemplate>
```

**Matching**:
- `CB1 (CBR)` → `CircuitBreaker (CBR)`
- `DS1 (DIS)` → `Disconnector (DIS)`

This works when each equipment type has exactly one template.

### Manual Matching

Manual matching is required when ambiguity exists:

```xml
<!-- SCD Bay -->
<ConductingEquipment name="CB1" type="CBR"/>
<ConductingEquipment name="CB2" type="CBR"/>

<!-- SSD Bay Type -->
<ConductingEquipmentTemplate type="CBR" name="CircuitBreaker_A">
  <!-- template details -->
</ConductingEquipmentTemplate>
<ConductingEquipmentTemplate type="CBR" name="CircuitBreaker_B">
  <!-- template details -->
</ConductingEquipmentTemplate>
```

**Problem**: Two CBR templates exist. Which should match to CB1 and which to CB2?

**Solution**: User manually specifies:
- `CB1` → `CircuitBreaker_A`
- `CB2` → `CircuitBreaker_B`

## Validation Logic

### Type Count Validation

The number of equipment elements of each type in the SCD must match the bay type:

**Valid**:
```
SCD: 2x CBR, 1x DIS
BayType: 2x CBR templates, 1x DIS template
```

**Invalid**:
```
SCD: 1x CBR, 1x DIS
BayType: 2x CBR templates, 1x DIS template
Error: "SCD has 1 CBR, BayType has 2"
```

### Ambiguity Detection

Ambiguity exists when multiple templates share the same equipment type but have different names:

```typescript
// Detecting ambiguity
Templates for type "CBR":
  - CircuitBreaker_A
  - CircuitBreaker_B

Result: Ambiguous (requires manual matching)
```

## Matching Algorithm

### Two-Phase Approach

**Phase 1: Manual Matches**
```typescript
for each manual match (equipmentName → templateUuid):
  1. Find SCD equipment by name
  2. Find template by UUID
  3. Create match
  4. Mark template as used
  5. Mark SCD element as matched
```

**Phase 2: Auto Matches**
```typescript
for each unmatched SCD equipment:
  1. Get equipment type
  2. Find unused template with matching type
  3. Create match
  4. Mark template as used
```

### Template Usage Tracking

Templates can appear multiple times in a bay type:

```xml
<BayType>
  <ConductingEquipment templateUuid="cbr-template-1"/>
  <ConductingEquipment templateUuid="cbr-template-1"/>  <!-- Same template -->
</BayType>
```

The algorithm tracks template usage by UUID:
- Each bay type equipment reference represents one "use" of the template
- A template can be matched until all its references are consumed

## Match Result

Each successful match produces an `EquipmentMatch`:

```typescript
{
  scdElement: <ConductingEquipment name="CB1" type="CBR"/>,
  bayTypeEquipment: {
    uuid: "baytype-ce-1",
    templateUuid: "template-1",
    virtual: false
  },
  templateEquipment: {
    uuid: "template-1",
    type: "CBR",
    name: "CircuitBreaker_A",
    terminals: [...],
    eqFunctions: [...]
  }
}
```

This match object contains:
1. The SCD element to update
2. The bay type reference (for tracking)
3. The full template (for applying logical nodes and functions)

## Edge Cases

### Virtual Equipment

Bay types can reference virtual equipment (not physically present):

```typescript
{
  uuid: "ce-virtual",
  templateUuid: "template-x",
  virtual: true
}
```

Virtual equipment is excluded from matching since it doesn't exist in the SCD.

### Missing Templates

If a template UUID cannot be resolved:
```typescript
bayTypeEquipment.templateUuid = "non-existent"
ssdImportStore.getConductingEquipmentTemplate("non-existent") // returns undefined
```

The equipment is skipped during matching (filtered out before matching begins).

### Unmatched Equipment

If SCD has equipment not present in the bay type:
```
SCD: CBR, DIS, CTR
BayType: CBR, DIS

Error: "No matching BayType equipment found for SCD equipment 'CTR1' of type 'CTR'"
```

This is a hard error - all SCD equipment must have a matching template.
