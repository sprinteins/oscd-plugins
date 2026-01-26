/**
 * Matching operations for BayType assignment
 *
 * This module provides operations for matching and assigning BayTypes to Bays in the SCD.
 *
 * The matching process involves:
 * 1. Validation - ensuring equipment counts and types match
 * 2. Matching - pairing SCD equipment with BayType templates
 * 3. UUID updates - distributing UUIDs to establish relationships
 * 4. EqFunction creation - copying equipment functions from templates
 * 5. Function creation - copying bay-level functions from templates
 *
 * Note: If the BayType contains multiple equipment templates with the same type
 * but different names (e.g., "Disconnector" and "Earth Switch" both with type="DIS"),
 * the validation will fail with requiresManualMatching=true. In this case, the UI
 * should present a manual matching dialog to the user.
 */

export { onSelectBayType } from './onSelectBayType'
export { validateEquipmentMatch } from './validation'
export { matchEquipmentSequentially, matchEquipmentManually } from './matching'
export type { EquipmentMatch } from './matching'
export type { ValidationResult } from './validation'
