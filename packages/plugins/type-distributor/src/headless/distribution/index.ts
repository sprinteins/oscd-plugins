/**
 * Main distribution operations for the Type Distributor plugin
 * 
 * This module provides the main operations for distributing types from SSD to SCD:
 * - Assigning LNodes from Functions to AccessPoints
 * - Assigning LNodes from EqFunctions (ConductingEquipment) to AccessPoints
 * - Adding Functions to Bays
 * - Adding ConductingEquipment to Bays
 */

export { assignLNodeToAccessPoint } from './operations/assign-lnode-to-accesspoint'
export { assignEqFunctionLNodeToAccessPoint } from './operations/assign-eqfunction-lnode-to-accesspoint'
export { addFunctionToBay, addFunctionToSelectedBay } from './operations/add-function-to-bay'

// Re-export utility functions that may be needed externally
export { getDocumentAndEditor, getAccessPoint, getBayElement } from './utils/document-helpers'
export { getNextLNodeInstance } from './utils/element-helpers'
