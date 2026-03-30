# Create IED & Access Point Dialog — Form Architecture

## Overview

The "Create IED & Access Point" dialog is a multi-step form for creating a new IED together with one or more
Access Points, or for adding new Access Points to an existing IED.

We deliberately avoid a dedicated form-handling library. Validation is handled entirely by
[Zod](https://zod.dev), and error state is derived directly from Zod's `z.treeifyError()` output.
If the form grows significantly in complexity in the future, the
[shadcn-svelte Form](https://www.shadcn-svelte.com/docs/components/form) wrapper 
is a natural next step.

---

## Folder Structure

```
create-ied-ap-dialog/
├── add-ied-ap-dialog-form.svelte   # Root form component — owns all state and logic
├── add-ied-ap-dialog-trigger.svelte
├── index.ts
│
├── form-helpers/                   # Pure logic: schemas, validation, types, submission
│   ├── schemas.ts                  # Zod schema definitions
│   ├── validation.ts               # Validation functions (thin wrappers around safeParse)
│   ├── submission.ts               # Dispatches XML edits on valid submit
│   ├── reset.ts                    # Returns initial/empty form state
│   ├── types.d.ts                  # IedData, AccessPointData, FieldErrors, FormErrors
│   └── index.ts
│
├── form-sections/                  # Compound UI sections (own their fields)
│   ├── ied-selector-section.svelte
│   ├── ied-form-section.svelte
│   ├── access-point-form-section.svelte
│   └── ied-and-access-point-overview-section.svelte
│
└── form-elements/                  # Atomic reusable UI pieces
    ├── field-error.svelte          # Displays a single field-level error message
    ├── form-actions.svelte
    ├── multi-ap-button.svelte
    ├── multi-ap-back-button.svelte
    ├── pending-access-points.svelte
    ├── ied-chip.svelte
    └── index.ts
```

---

## Component Architecture

```
add-ied-ap-dialog-form.svelte          (owns: ied, accessPoints, isMultiApMode, formErrors)
│
├── [normal mode]
│   ├── IedSelectorSection             (bind: ied)
│   └── IedFormSection                 (bind: ied, errors: formErrors.properties?.ied)
│
├── [multi-AP mode]
│   └── IedAndAccessPointOverview      (ied, confirmedAps, onRemoveAp)
│
├── AccessPointFormSection             (bind: activeAp, errors: formErrors.properties?.ap)
├── MultiApButton                      (onEnterMultiApMode, onAddAccessPoint)
└── FormActions                        (onSubmit, onCancel, onGoBack)
```

`add-ied-ap-dialog-form.svelte` is the single source of truth. Sections receive data and errors via
props and bind their inputs back up. No child component writes to error state directly.

---

## Validation Approach

### Schemas (`form-helpers/schemas.ts`)

Each logical entity has its own Zod schema factory:

| Function | Validates |
|---|---|
| `createIedSchema(xmlDocument, isNew)` | IED name (uniqueness if new) and description |
| `createAccessPointSchema(context)` | Single AP name (uniqueness within pending and existing) |
| `createAccessPointsCollectionSchema(context)` | Array of APs (collection-level rules) |
| `createFormSchema({xmlDocument, ssdDocument, isNew, existingNames, iedName})` | Entire form as one object: `{ ied, ap }` |

The full-form schema is composed from the individual schemas, so rules are never duplicated.

### Validation functions (`form-helpers/validation.ts`)

Each function calls `safeParse` and converts the error with `z.treeifyError()` — no manual mapping:

```typescript
// Single field group (used for inline validation before submit)
validateIedFields(ied, xmlDocument, isNew): FieldErrors | null
validateAccessPointFields(accessPointData, context): FieldErrors | null

// Full form (used on submit)
validateSubmission({ ied, accessPoints, xmlDocument }): FormErrors | null
```

`validateSubmission` runs a **single parse** against `createFormSchema`, keeping all rules in one
place and producing one consistent error tree.

### Error shape

Zod's `z.treeifyError()` returns a nested structure that mirrors the schema. We type this directly:

```typescript
// types.d.ts
type FieldErrors = {
  errors?: string[]
  properties?: {
    name?: { errors?: string[] }
    description?: { errors?: string[] }
  }
}

type FormErrors = {
  errors?: string[]
  properties?: {
    ied?: FieldErrors
    ap?: {
      errors?: string[]
      items?: (FieldErrors | undefined)[]
    }
  }
}
```

This means `formErrors` in the root component is already in the shape of the treeified result —
no intermediate mapping required.

### Accessing errors in templates

Follow the treeify path directly with optional chaining:

```svelte
<!-- IED name field -->
<FieldError errors={formErrors.properties?.ied?.properties?.name?.errors} />

<!-- AP name field (item-level error, fallback to collection-level) -->
<FieldError errors={formErrors.properties?.ap?.items?.[0]?.properties?.name?.errors
                    ?? formErrors.properties?.ap?.errors} />
```

---

## FieldError Component

`form-elements/field-error.svelte` is intentionally minimal:

```svelte
<script lang="ts">
  const { errors }: { errors?: string[] } = $props()
</script>

{#if errors?.[0]}
  <p class="text-sm text-red-600">{errors[0]}</p>
{/if}
```

Only the **first** error in the array is rendered. Zod can produce multiple messages per field,
but showing all of them at once would overload the user. Once the first is fixed the next becomes
visible, guiding the user step by step.

---

## Form Modes and Flow

### Normal mode (single AP)

1. User selects an existing IED **or** toggles "Create new IED" and fills in its name.
2. User fills in the Access Point name.
3. Submit runs `validateSubmission` → on success dispatches XML edits and closes the dialog.

### Multi-AP mode

Entered via the "Add another Access Point" button. The form separates into:

- **confirmed APs** — validated and locked in (`accessPoints.slice(0, -1)`)
- **active AP** — the current input slot (`accessPoints[accessPoints.length - 1]`)

Each call to "Add Access Point" validates the active AP via `validateAccessPointFields` and, if
valid, moves it into the confirmed list and opens a fresh input slot.

Submit in multi-AP mode only considers confirmed APs, not the (possibly empty) active slot.

```
enterMultiApMode()
  └── validateIedFields          ← blocks entry if IED name invalid
  └── confirmActiveAp()          ← moves active AP to confirmed list if valid

addAccessPoint()
  └── confirmActiveAp()

handleSubmit()
  └── validateSubmission({ ied, confirmedAps, xmlDocument })
      └── createFormSchema().safeParse(...)
          └── z.treeifyError(error) → FormErrors
```
