import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { LNodeType } from '@/headless/common-types'
import {
	createLD0Element,
	createLD0LNodeTemplates,
	createLDeviceElement,
	parseLDeviceInst,
	sanitizeLDeviceInstSegment
} from './ldevice-element'

const LLN0_TYPE_ID = 'LLN0Type'

const DOC = new DOMParser().parseFromString(
	'<SCL xmlns="http://www.iec.ch/61850/2003/SCL"/>',
	'application/xml'
) as XMLDocument

function makeLNodeType(lnClass: string, id = `${lnClass}Type`): LNodeType {
	return { id, lnClass, dataObjects: [] } as LNodeType
}

describe('sanitizeLDeviceInstSegment', () => {
	it('GIVEN a name with hyphens WHEN called THEN strips hyphens', () => {
		expect(sanitizeLDeviceInstSegment('Bay-1')).toBe('Bay1')
	})

	it('GIVEN a name with spaces WHEN called THEN strips spaces', () => {
		expect(sanitizeLDeviceInstSegment('Bay 1')).toBe('Bay1')
	})

	it('GIVEN a name with dots WHEN called THEN strips dots', () => {
		expect(sanitizeLDeviceInstSegment('Bay.1')).toBe('Bay1')
	})

	it('GIVEN a name with underscores WHEN called THEN preserves underscores', () => {
		expect(sanitizeLDeviceInstSegment('Bay_1')).toBe('Bay_1')
	})

	it('GIVEN an alphanumeric-only name WHEN called THEN returns unchanged', () => {
		expect(sanitizeLDeviceInstSegment('CBR1')).toBe('CBR1')
	})

	it('GIVEN an empty string WHEN called THEN returns empty string', () => {
		expect(sanitizeLDeviceInstSegment('')).toBe('')
	})

	it('GIVEN a name with multiple illegal char types WHEN called THEN strips all of them', () => {
		expect(sanitizeLDeviceInstSegment('Bay-1.A B')).toBe('Bay1AB')
	})
})

describe('createLD0LNodeTemplates', () => {
	it('GIVEN empty lnodeTypes WHEN called THEN returns empty array', () => {
		expect(createLD0LNodeTemplates([])).toEqual([])
	})

	describe('GIVEN lnodeTypes starting with "L"', () => {
		it('WHEN called THEN maps lnType to the type id', () => {
			const result = createLD0LNodeTemplates([makeLNodeType('LPHD')])

			expect(result[0].lnType).toBe('LPHDType')
		})

		it('WHEN lnClass is LLN0 THEN lnInst is empty string', () => {
			const result = createLD0LNodeTemplates([makeLNodeType('LLN0')])

			expect(result[0].lnInst).toBe('')
		})

		it('WHEN lnClass is not LLN0 THEN lnInst is "1"', () => {
			const result = createLD0LNodeTemplates([makeLNodeType('LPHD')])

			expect(result[0].lnInst).toBe('1')
		})
	})

	describe('GIVEN LGOS and LSVS lnodeTypes', () => {
		it('WHEN called THEN excludes LGOS', () => {
			const result = createLD0LNodeTemplates([makeLNodeType('LGOS')])

			expect(result).toHaveLength(0)
		})

		it('WHEN called THEN excludes LSVS', () => {
			const result = createLD0LNodeTemplates([makeLNodeType('LSVS')])

			expect(result).toHaveLength(0)
		})

		it('WHEN mixed with LPHD THEN only LPHD is included', () => {
			const result = createLD0LNodeTemplates([
				makeLNodeType('LPHD'),
				makeLNodeType('LGOS'),
				makeLNodeType('LSVS')
			])

			expect(result).toHaveLength(1)
			expect(result[0].lnClass).toBe('LPHD')
		})
	})

	describe('GIVEN duplicate lnodeTypes for the same class', () => {
		it('WHEN called THEN keeps only the first type for that class', () => {
			const result = createLD0LNodeTemplates([
				makeLNodeType('LPHD', 'LPHDFirst'),
				makeLNodeType('LPHD', 'LPHDSecond')
			])

			expect(result).toHaveLength(1)
			expect(result[0].lnType).toBe('LPHDFirst')
		})
	})

	describe('GIVEN LLN0 mixed with other classes', () => {
		it('WHEN called THEN LLN0 is first in the result', () => {
			const result = createLD0LNodeTemplates([
				makeLNodeType('LPHD'),
				makeLNodeType('LLN0')
			])

			expect(result[0].lnClass).toBe('LLN0')
		})
	})
})

describe('createLD0Element', () => {
	it('GIVEN apName and iedName WHEN called THEN creates LDevice with inst="LD0_AP" and ldName="IED_LD0_AP"', () => {
		const ld0 = createLD0Element(DOC, [], 'S1-AP', 'TestIED')

		expect(ld0.getAttribute('inst')).toBe('LD0_S1-AP')
		expect(ld0.getAttribute('ldName')).toBe('TestIED_LD0_S1-AP')
	})

	it('GIVEN empty lnodeTypes WHEN called THEN LDevice has no children', () => {
		const ld0 = createLD0Element(DOC, [], 'S1-AP', 'TestIED')

		expect(ld0.children).toHaveLength(0)
	})

	describe('GIVEN LLN0 lnodeType', () => {
		it('WHEN called THEN creates LN0 child with correct attributes', () => {
			const ld0 = createLD0Element(
				DOC,
				[makeLNodeType('LLN0')],
				'S1-AP',
				'TestIED'
			)

			const ln0 = ld0.querySelector(
				'LN0[lnClass="LLN0"][lnType="LLN0Type"]'
			)
			expect(ln0).not.toBeNull()
			expect(ln0?.getAttribute('lnInst')).toBe('')
		})

		it('WHEN called THEN does not create an LN element', () => {
			const ld0 = createLD0Element(
				DOC,
				[makeLNodeType('LLN0')],
				'S1-AP',
				'TestIED'
			)

			expect(ld0.querySelector('LN')).toBeNull()
		})
	})

	describe('GIVEN LPHD lnodeType', () => {
		it('WHEN called THEN creates LN child with correct attributes', () => {
			const ld0 = createLD0Element(
				DOC,
				[makeLNodeType('LPHD')],
				'S1-AP',
				'TestIED'
			)

			const ln = ld0.querySelector(
				'LN[lnClass="LPHD"][lnType="LPHDType"][lnInst="1"]'
			)
			expect(ln).not.toBeNull()
		})

		it('WHEN called THEN does not create an LN0 element', () => {
			const ld0 = createLD0Element(
				DOC,
				[makeLNodeType('LPHD')],
				'S1-AP',
				'TestIED'
			)

			expect(ld0.querySelector('LN0')).toBeNull()
		})
	})

	it('GIVEN LGOS lnodeType WHEN called THEN does not create any child', () => {
		const ld0 = createLD0Element(
			DOC,
			[makeLNodeType('LGOS')],
			'S1-AP',
			'TestIED'
		)
		expect(ld0.children).toHaveLength(0)
	})
})

describe('parseLDeviceInst', () => {
	it('GIVEN no underscore WHEN called THEN throws invalid format error', () => {
		expect(() => parseLDeviceInst('FunctionOnly')).toThrow(
			'Invalid LDevice inst format: FunctionOnly'
		)
	})

	it('GIVEN FunctionName_UuidPrefix schema WHEN called THEN returns isLD0 false with functionName and uuid prefix and no equipmentName', () => {
		const result = parseLDeviceInst('Protection_550e8400')
		expect(result.isLD0).toBe(false)
		expect(result.equipmentName).toBeNull()
		expect(result.functionName).toBe('Protection')
		expect(result.functionPrefixUuid).toBe('550e8400')
	})

	it('GIVEN Eq_Function_UuidPrefix schema WHEN called THEN returns isLD0 false with equipmentName and functionName', () => {
		const result = parseLDeviceInst('CB1_CBFunction_b4e3f901')
		expect(result.isLD0).toBe(false)
		expect(result.equipmentName).toBe('CB1')
		expect(result.functionName).toBe('CBFunction')
		expect(result.functionPrefixUuid).toBe('b4e3f901')
	})

	it('GIVEN equipment name with underscore WHEN called THEN returns isLD0 false and joins extra segments into equipmentName', () => {
		const result = parseLDeviceInst('CB_1_CBFunction_b4e3f901')
		expect(result.isLD0).toBe(false)
		expect(result.equipmentName).toBe('CB_1')
		expect(result.functionName).toBe('CBFunction')
		expect(result.functionPrefixUuid).toBe('b4e3f901')
	})

	it('GIVEN function name with underscore WHEN called THEN returns isLD0 false and treats leading part as equipmentName for later runtime disambiguation', () => {
		const result = parseLDeviceInst('Pro_tection_c0ffee01')
		expect(result.isLD0).toBe(false)
		expect(result.equipmentName).toBe('Pro')
		expect(result.functionName).toBe('tection')
		expect(result.functionPrefixUuid).toBe('c0ffee01')
	})

	it('GIVEN plain LD0 inst WHEN called THEN returns isLD0 true with null uuid and equipment fields', () => {
		const result = parseLDeviceInst('LD0')
		expect(result.isLD0).toBe(true)
		expect(result.equipmentName).toBeNull()
		expect(result.functionName).toBe('LD0')
		expect(result.functionPrefixUuid).toBeNull()
	})

	it('GIVEN LD0_APname schema WHEN called THEN returns isLD0 true with full inst as functionName', () => {
		const result = parseLDeviceInst('LD0_S1-AP')
		expect(result.isLD0).toBe(true)
		expect(result.equipmentName).toBeNull()
		expect(result.functionName).toBe('LD0_S1-AP')
		expect(result.functionPrefixUuid).toBeNull()
	})
})

describe('createLDeviceElement', () => {
	// UUID: 550e8400-e29b-41d4-a716-446655440000 → prefix: 550e8400
	const FUNCTION_UUID = '550e8400-e29b-41d4-a716-446655440000'
	const FUNCTION_UUID_PREFIX = '550e8400'
	const sourceFunction = {
		uuid: FUNCTION_UUID,
		name: 'TestFunction',
		lnodes: []
	}
	const params = {
		sourceFunction,
		equipmentUuid: undefined,
		equipmentMatches: [],
		iedName: 'TestIED'
	}

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('GIVEN no lnodeTypes WHEN called THEN creates LDevice with 8-char uuid prefix inst and ldName and no children', () => {
		const lDevice = createLDeviceElement(DOC, params)

		expect(lDevice.getAttribute('inst')).toBe(
			`TestFunction_${FUNCTION_UUID_PREFIX}`
		)
		expect(lDevice.getAttribute('ldName')).toBe(
			`TestIED_TestFunction_${FUNCTION_UUID_PREFIX}`
		)
		expect(lDevice.children).toHaveLength(0)
	})

	describe('GIVEN lnodeTypes containing LLN0', () => {
		const lnodeTypes: LNodeType[] = [makeLNodeType('LLN0', LLN0_TYPE_ID)]

		it('WHEN called THEN LDevice has an LN0 child', () => {
			const lDevice = createLDeviceElement(DOC, { ...params, lnodeTypes })

			expect(lDevice.querySelector('LN0')).not.toBeNull()
		})

		it('WHEN called THEN LN0 has lnClass="LLN0"', () => {
			const lDevice = createLDeviceElement(DOC, { ...params, lnodeTypes })

			expect(lDevice.querySelector('LN0')?.getAttribute('lnClass')).toBe(
				'LLN0'
			)
		})

		it('WHEN called THEN LN0 has lnType from the LLN0 type id', () => {
			const lDevice = createLDeviceElement(DOC, { ...params, lnodeTypes })

			expect(lDevice.querySelector('LN0')?.getAttribute('lnType')).toBe(
				LLN0_TYPE_ID
			)
		})

		it('WHEN called THEN LN0 has lnInst as empty string', () => {
			const lDevice = createLDeviceElement(DOC, { ...params, lnodeTypes })

			expect(lDevice.querySelector('LN0')?.getAttribute('lnInst')).toBe(
				''
			)
		})
	})

	describe('GIVEN lnodeTypes without LLN0', () => {
		const lnodeTypes: LNodeType[] = [makeLNodeType('LPHD')]

		it('WHEN called THEN LDevice has no LN0 child', () => {
			const lDevice = createLDeviceElement(DOC, { ...params, lnodeTypes })

			expect(lDevice.querySelector('LN0')).toBeNull()
		})

		it('WHEN called THEN emits a console.warn', () => {
			const warnSpy = vi
				.spyOn(console, 'warn')
				.mockImplementation(() => {})

			createLDeviceElement(DOC, { ...params, lnodeTypes })

			expect(warnSpy).toHaveBeenCalledOnce()
		})
	})

	it('GIVEN lnodeTypes is undefined WHEN called THEN LDevice has no children', () => {
		const lDevice = createLDeviceElement(DOC, {
			...params,
			lnodeTypes: undefined
		})

		expect(lDevice.children).toHaveLength(0)
	})

	it('GIVEN sourceFunction with hyphens in name WHEN called THEN inst uses sanitized name', () => {
		const illegalParams = {
			...params,
			sourceFunction: { ...sourceFunction, name: 'Bay-Protection' }
		}
		const lDevice = createLDeviceElement(DOC, illegalParams)

		expect(lDevice.getAttribute('inst')).toBe(
			`BayProtection_${FUNCTION_UUID_PREFIX}`
		)
	})

	describe('GIVEN equipment match with illegal chars in CE name', () => {
		const EQUIPMENT_UUID = 'equipment-uuid-1'
		let doc: XMLDocument
		let scdEquipment: Element

		beforeEach(() => {
			doc = new DOMParser().parseFromString(
				'<SCL xmlns="http://www.iec.ch/61850/2003/SCL"/>',
				'application/xml'
			) as XMLDocument
			scdEquipment = new DOMParser().parseFromString(
				'<ConductingEquipment name="CB-1" type="CBR"/>',
				'application/xml'
			).documentElement
		})

		it('WHEN called THEN inst strips illegal chars from the equipment name', () => {
			const equipmentMatch = {
				bayTypeEquipment: {
					uuid: EQUIPMENT_UUID
				} as unknown as import('@/headless/common-types').ConductingEquipmentTemplate,
				templateEquipment: {
					eqFunctions: []
				} as unknown as import('@/headless/common-types').ConductingEquipmentTemplate,
				scdElement: scdEquipment
			}
			const lDevice = createLDeviceElement(doc, {
				...params,
				equipmentUuid: EQUIPMENT_UUID,
				equipmentMatches: [equipmentMatch]
			})

			expect(lDevice.getAttribute('inst')).toBe(
				`CB1_TestFunction_${FUNCTION_UUID_PREFIX}`
			)
		})
	})
})
