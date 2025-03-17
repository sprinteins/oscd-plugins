export const NODE_TYPE = {
    logicalDevice: 'logicalDevice',
    logicalNode: 'logicalNode',
    dataObjectInstance: 'dataObjectInstance'
} as const

export const NODE_ELEMENT_TYPE = {
    DO: "DO",
    LC: "LC",
    LP: "LP"
} as const

export const LP_TYPE = {
    LPDO: 'LPDO',
    LPDI: 'LPDI',
    LPAI: 'LPAI',
    LPAO: 'LPAO',
} as const

export const LC_TYPE = {
    LCBI: "LCBI",
    LCBO: "LCBO",
    LCDP: "LCDP",
    LCIV: "LCIV",
} as const

export const L_NODE_TYPE_CONTENT = {
    LCBI: '<DO name="OutInd" type="SPS"/>',
    LCBO: '<DO name="OutInd" type="SPS"/>',
    LCDP: '<DO name="OutPos" type="DPS"/>',
    LCIV: '<DO name="OutPos" type="INS"/>',
} as const