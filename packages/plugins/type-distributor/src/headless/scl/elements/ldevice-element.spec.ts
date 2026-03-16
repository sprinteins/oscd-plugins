import { describe, it, expect, vi, afterEach } from 'vitest'
import type { LNodeType } from '@/headless/common-types'
import {
	createLD0Element,
	createLD0LNodeTemplates,
	createLDeviceElement,
	parseLDeviceInst
} from './ldevice-element'

const LLN0_TYPE_ID = 'LLN0Type'

const DOC = new DOMParser().parseFromString(
	'<SCL xmlns="http://www.iec.ch/61850/2003/SCL"/>',
	'application/xml'
) as XMLDocument

function makeLNodeType(lnClass: string, id = `${lnClass}Type`): LNodeType {
	return { id, lnClass, dataObjects: [] } as LNodeType
}

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
	it('GIVEN no underscore WHEN called THEN returns bare name as functionName with no equipmentName', () => {
		const result = parseLDeviceInst('FunctionOnly')
		expect(result.equipmentName).toBeNull()
		expect(result.functionName).toBe('FunctionOnly')
		expect(result.functionUuid).toBeNull()
	})

	it('GIVEN FunctionName_UUID schema WHEN called THEN returns functionName and no equipmentName', () => {
		const result = parseLDeviceInst(
			'Protection_550e8400-e29b-41d4-a716-446655440000'
		)
		expect(result.equipmentName).toBeNull()
		expect(result.functionName).toBe('Protection')
		expect(result.functionUuid).toBe('550e8400-e29b-41d4-a716-446655440000')
	})

	it('GIVEN Eq_Function_UUID schema WHEN called THEN returns equipmentName and functionName', () => {
		const result = parseLDeviceInst(
			'CB1_CBFunction_550e8400-e29b-41d4-a716-446655440000'
		)
		expect(result.equipmentName).toBe('CB1')
		expect(result.functionName).toBe('CBFunction')
		expect(result.functionUuid).toBe('550e8400-e29b-41d4-a716-446655440000')
	})

	it('GIVEN equipment name with underscore WHEN called THEN joins extra segments into equipmentName', () => {
		const result = parseLDeviceInst(
			'CB_1_CBFunction_550e8400-e29b-41d4-a716-446655440000'
		)
		expect(result.equipmentName).toBe('CB_1')
		expect(result.functionName).toBe('CBFunction')
		expect(result.functionUuid).toBe('550e8400-e29b-41d4-a716-446655440000')
	})

	it('GIVEN LD0_APname schema WHEN called THEN returns null equipmentName and LD0 as functionName', () => {
		const result = parseLDeviceInst('LD0_S1-AP')
		expect(result.equipmentName).toBeNull()
		expect(result.functionName).toBe('LD0')
		expect(result.functionUuid).toBe('S1-AP')
	})
})

describe('createLDeviceElement', () => {
	const sourceFunction = { uuid: 'fn-uuid', name: 'TestFunction', lnodes: [] }
	const params = {
		sourceFunction,
		equipmentUuid: undefined,
		equipmentMatches: [],
		iedName: 'TestIED'
	}

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('GIVEN no lnodeTypes WHEN called THEN creates LDevice with correct inst and ldName and no children', () => {
		const lDevice = createLDeviceElement(DOC, params)

		expect(lDevice.getAttribute('inst')).toBe('TestFunction_fn-uuid')
		expect(lDevice.getAttribute('ldName')).toBe(
			'TestIED_TestFunction_fn-uuid'
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
})

describe('createLDeviceElement', () => {
	const sourceFunction = { uuid: 'fn-uuid', name: 'TestFunction', lnodes: [] }
	const params = {
		sourceFunction,
		equipmentUuid: undefined,
		equipmentMatches: [],
		iedName: 'TestIED'
	}

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('GIVEN no lnodeTypes WHEN called THEN creates LDevice with correct inst and ldName and no children', () => {
		const lDevice = createLDeviceElement(DOC, params)

		expect(lDevice.getAttribute('inst')).toBe('TestFunction_fn-uuid')
		expect(lDevice.getAttribute('ldName')).toBe(
			'TestIED_TestFunction_fn-uuid'
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
})
