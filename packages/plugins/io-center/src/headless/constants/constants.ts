import type { ConnectionPort, LcTypes } from "@/ui/components/canvas/types.canvas"
import type { LpTypes } from "@/ui/components/lp-list/types.lp-list"

export const NODE_TYPE = {
    accessPoint: 'accessPoint',
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
    LCBI: `
        <DO name="NamPlt" type="LPL"/>
        <DO name="OutInd" type="SPS"/>
        <DO name="Beh" type="ENS"/>
        <DO name="Health" type="ENS"/>
        <DO name="Mir" type="SPS"/>
        <DO name="Mod" type="ENC"/>
        <DO name="ActHi" type="SPG"/>
        <DO name="InvOut" type="SPG"/>
        <DO name="OscNum" type="ING"/>
        <DO name="OscTm" type="ING"/>
        <DO name="PlsDur" type="ING"/>
        <DO name="InRef" type="ORG"/>
    `,
    LCBO: `
        <DO name="NamPlt" type="LPL"/>
        <DO name="OutInd" type="SPS"/>
        <DO name="Beh" type="ENS"/>
        <DO name="Health" type="ENS"/>
        <DO name="Mir" type="SPS"/>
        <DO name="LatchRs" type="SPC"/>
        <DO name="Mod" type="ENC"/>
        <DO name="DlDropout" type="ING"/>
        <DO name="Dwell" type="SPG"/>
        <DO name="InvOut" type="SPG"/>
        <DO name="Latch" type="SPG"/>
        <DO name="MaxPlsDur" type="ING"/>
        <DO name="MinPlsDur" type="ING"/>
        <DO name="InRef" type="ORG"/>
    `,
    LCDP: '<DO name="OutPos" type="DPS"/>',
    LCIV: '<DO name="OutPos" type="INS"/>',
    LPDO: `
        <DO name="BrdRef" type="VSD"/>
        <DO name="DsgOutCom" type="VSD"/>
        <DO name="DsgOutSig" type="VSD"/>
        <DO name="FctOutCom" type="VSD"/>
        <DO name="FctOutSig" type="VSD"/>
        <DO name="OutNam" type="VSD"/>
        <DO name="OutOffCap" type="VSD"/>
        <DO name="OutOnCap" type="VSD"/>
        <DO name="OutRefDsg" type="VSD"/>
        <DO name="NamPlt" type="LPL"/>
        <DO name="RdbSt" type="SPS"/>
        <DO name="Beh" type="ENS"/>
        <DO name="Health" type="ENS"/>
        <DO name="Mir" type="SPS"/>
        <DO name="Mod" type="ENC"/>
        <DO name="FastOut" type="SPG"/>
        <DO name="OutOffDl" type="ASG"/>
        <DO name="OutOnDl" type="ASG"/>
        <DO name="OutTyp" type="ENG"/>
        <DO name="InRef" type="ORG"/>
    `,
    LPDI: `
        <DO name="BrdRef" type="VSD"/>
        <DO name="DsgInpCom" type="VSD"/>
        <DO name="DsgInpSig" type="VSD"/>
        <DO name="FctInpCom" type="VSD"/>
        <DO name="FctInpSig" type="VSD"/>
        <DO name="InpNam" type="VSD"/>
        <DO name="InpRefDsg" type="VSD"/>
        <DO name="NamPlt" type="LPL"/>
        <DO name="In" type="SPS"/>
        <DO name="Beh" type="ENS"/>
        <DO name="Health" type="ENS"/>
        <DO name="Mir" type="SPS"/>
        <DO name="Mod" type="ENC"/>
        <DO name="DebTm" type="ING"/>
        <DO name="OscNum" type="ING"/>
        <DO name="OscTm" type="ING"/>
        <DO name="VlnOff" type="ASG"/>
        <DO name="VlnOn" type="ASG"/>
        <DO name="VlnTyp" type="ENG"/>
        <DO name="InRef" type="ORG"/>
    `,
    LPAI: '<DO name="Ind" type="SPS"/>',
    LPAO: '<DO name="Ind" type="SPS"/>',
} as const

export const L_NODE_TYPE_HELPER_TEXT =
    "The selected type has no matching LNodeType, which will be created automatically, or you can create one using the Template Plugin.";

export const PORTS_CONFIG_PER_TYPE: Record<string, ConnectionPort[]> = {
    LCBI: [
        { name: 'OutInd', side: 'left' },
        { name: 'In', side: 'right' },
    ],
    LCBO: [
        { name: 'In', side: 'left' },
        { name: 'OutInd', side: 'right' },
    ],
    LCDP: [
        { name: 'OutPos', side: 'left' },
        { name: 'InOn', side: 'right' },
        { name: 'InOff', side: 'right' }
    ],
    LCIV: [
        { name: 'OutInd', side: 'left' },
        { name: 'In', side: 'right' },
    ],
    LPDO: [{ name: 'In', side: 'left' }],
    LPDI: [{ name: 'Ind', side: 'left' }],
    LPAI: [{ name: 'Ind', side: 'left' }],
    LPAO: [{ name: 'Ind', side: 'left' }],
}

// TARGET_CDC: Only data objects with a cdc attribute included in targetCdc will be collected from the SCD document
// Currently hard-coded per client request but in future we may make it dynamic and allow the user to fill the targetScd
export const TARGET_CDC_TYPES = ['dps', 'sps', 'ins', 'ens']
