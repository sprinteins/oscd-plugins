import { type Writable, writable } from 'svelte/store'
import { beforeEach, describe, expect, it } from 'vitest'
import { pluginStore } from './index'
import { placeholderStore } from './placeholder.store'

describe('placeholders', () => {
	let xmlDocument: Writable<XMLDocument | undefined>

	beforeEach(() => {
		xmlDocument = writable<XMLDocument | undefined>(undefined)
		const parser = new DOMParser()
		const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
    <SCL xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.iec.ch/61850/2003/SCL" xmlns:sxy="http://www.iec.ch/61850/2003/SCLcoordinates" revision="B" version="2007">
        <Header id="STS" nameStructure="IEDName" revision="R000" toolID="Helinks STS 3.8.0.7" version="V1">
            <History>
                <Hitem revision="R000" version="V1" what="" when="Thu Feb 29 13:53:39 CET 2024" who="TM" why=""/>
            </History>
        </Header>
        <Substation sxy:x="6" sxy:y="5" desc="Neckarwestheim" name="NWHEI_">
            <PowerTransformer sxy:y="16" name="RA401" type="PTR">
                <TransformerWinding name="W1" type="PTW">
                    <Terminal bayName="Q01A_" cNodeName="CN_dae0598f-dc05-4909-a8a3-e6e5e10505fa" connectivityNode="NWHEI_/C1_/Q01A_/CN_dae0598f-dc05-4909-a8a3-e6e5e10505fa" name="TW" substationName="NWHEI_" voltageLevelName="C1_"/>
                </TransformerWinding>
            </PowerTransformer>
            <VoltageLevel desc="380kV" name="C1_">
                <Voltage multiplier="k" unit="V">380</Voltage>
                <Bay desc="-C1Q01A KPDR" name="Q01A_">
                    <ConductingEquipment sxy:y="2" name="QB91" type="DIS">
                        <Terminal bayName="Q01A_" cNodeName="CN_42839720-5b13-4227-843e-5c417f253b78" connectivityNode="NWHEI_/C1_/Q01A_/CN_42839720-5b13-4227-843e-5c417f253b78" name="T1" substationName="NWHEI_" voltageLevelName="C1_"/>
                        <Terminal bayName="Q01A_" cNodeName="CN_887dbde1-2c05-4a55-a102-96b82fc03bbb" connectivityNode="NWHEI_/C1_/Q01A_/CN_887dbde1-2c05-4a55-a102-96b82fc03bbb" name="T2" substationName="NWHEI_" voltageLevelName="C1_"/>
                        <EqFunction name="INTF_QB91_SMU">
                            <LNode iedName="NWHEI_C1_Q01A_SMU1" ldInst="SWEQ" lnClass="XSWI" lnInst="1" lnType="XSWI$866ebcf07e908466" prefix=""/>
                        </EqFunction>
                    </ConductingEquipment>
                </Bay>
            </VoltageLevel>
            <Function name="HMI">
			    <LNode iedName="None" ldInst="NWHEI_HMI" lnClass="IHMI" lnInst="1" lnType="IHMI$30380665cfbdd920" prefix=""/>
		    </Function>
        </Substation>
        <IED configVersion="X.X" engRight="limited" manufacturer="Anon" originalSclRevision="X" originalSclVersion="XXXX" type="DeviceType" name="Device_01">
        <Services name="XX">
            <DynAssociation max="X"/>
        </Services>
        </IED>
        <IED configVersion="X.2" engRight="limited2" manufacturer="Anon2" originalSclRevision="X2" originalSclVersion="XXXX2" type="DeviceType2" name="Device_02">
        <Services name="XX2">
            <DynAssociation max="X2"/>
        </Services>
        </IED>
    </SCL>`
		const xmlDoc = parser.parseFromString(xmlString, 'application/xml')
		xmlDocument.set(xmlDoc)
		pluginStore.init({
			newXMLDocument: xmlDoc,
			newPluginHostElement: document.createElement('SCL')
		})
	})

	it('should replace placeholders with corresponding XML values', () => {
		const markdownText =
			'This is a Header: {{//Header/@id}} & VoltageLevel name: {{//VoltageLevel/@name}} {{//IED[1]/@manufacturer}} and {{//IED/Services/@name}} test.'
		const result = placeholderStore.fillPlaceholder(markdownText)

		expect(result).toBe(
			'This is a Header: STS & VoltageLevel name: C1_ Anon and XX, XX2 test.'
		)
	})

	it('should not modify text if no placeholders are provided', () => {
		const markdownText = 'This is a test without placeholders.'

		const result = placeholderStore.fillPlaceholder(markdownText)

		expect(result).toBe(markdownText)
	})

	it('should replace multiple instances of the same placeholder', () => {
		const markdownText =
			'This is a {{//IED[1]/@manufacturer}} and another {{//IED[1]/@manufacturer}} test.'

		const result = placeholderStore.fillPlaceholder(markdownText)

		expect(result).toBe('This is a Anon and another Anon test.')
	})

	it('should handle nested XML elements', () => {
		const markdownText =
			'Device name is {{//IED[1]/@name}} and its type is {{//IED[1]/@type}}.'

		const result = placeholderStore.fillPlaceholder(markdownText)

		expect(result).toBe(
			'Device name is Device_01 and its type is DeviceType.'
		)
	})

	it('should handle missing placeholders gracefully', () => {
		const markdownText =
			'This is a {{//NonExistentElement/@nonExistentAttribute}} test.'

		const result = placeholderStore.fillPlaceholder(markdownText)

		expect(result).toBe('This is a N/A test.')
	})

	it('should fill table with corresponding XML values', () => {
		const input: PlaceholderTable = {
			tableColumns: [
				{
					columnTitle: 'IED Manufactorer',
					placeholder: '//IED/@manufacturer'
				},
				{
					columnTitle: 'Service Name',
					placeholder: '//IED/Services/@name'
				}
			]
		}

		const result = placeholderStore.fillTableWithPlaceholders(input)
		const expected = `
            | IED Manufactorer | Service Name |
            | --- | --- |
            | Anon | XX |
            | Anon2 | XX2 |`.replace(/^\s+/gm, '')

		expect(result).toBe(expected)
	})

	it('should handle empty table columns', () => {
		const input: PlaceholderTable = {
			tableColumns: []
		}

		const result = placeholderStore.fillTableWithPlaceholders(input)
		const expected = '|  |\n|  |\n|  |'

		expect(result).toBe(expected)
	})

	it('should handle table with single column', () => {
		const input: PlaceholderTable = {
			tableColumns: [
				{
					columnTitle: 'IED Manufacturer',
					placeholder: '//IED/@manufacturer'
				}
			]
		}

		const result = placeholderStore.fillTableWithPlaceholders(input)
		const expected = `
            | IED Manufacturer |
            | --- |
            | Anon |
            | Anon2 |`.replace(/^\s+/gm, '')

		expect(result).toBe(expected)
	})

	it('should handle table with missing XML values', () => {
		const input: PlaceholderTable = {
			tableColumns: [
				{
					columnTitle: 'Non Existent',
					placeholder: '//NonExistentElement/@nonExistentAttribute'
				}
			]
		}

		const result = placeholderStore.fillTableWithPlaceholders(input)
		const expected = `
            | Non Existent |
            | --- |
            | N/A |`.replace(/^\s+/gm, '')

		expect(result).toBe(expected)
	})

	it('should handle table with mixed existing and non-existing XML values', () => {
		const input: PlaceholderTable = {
			tableColumns: [
				{
					columnTitle: 'IED Manufacturer',
					placeholder: '//IED/@manufacturer'
				},
				{
					columnTitle: 'Non Existent',
					placeholder: '//NonExistentElement/@nonExistentAttribute'
				}
			]
		}

		const result = placeholderStore.fillTableWithPlaceholders(input)
		const expected = `
            | IED Manufacturer | Non Existent |
            | --- | --- |
            | Anon | N/A |
            | Anon2 |  |`.replace(/^\s+/gm, '')

		expect(result).toBe(expected)
	})
})

type Placeholder = string
interface ColumnWithPlaceholder {
	columnTitle: string
	placeholder: Placeholder
}
interface PlaceholderTable {
	tableColumns: ColumnWithPlaceholder[]
}
