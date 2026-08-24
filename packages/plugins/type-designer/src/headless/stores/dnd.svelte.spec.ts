import { afterEach, describe, expect, it, vi } from 'vitest'

const { mockCreateNewRef, mockConstants } = vi.hoisted(() => ({
	mockCreateNewRef: vi.fn(),
	mockConstants: {
		TYPE_FAMILY: {
			bay: 'bay',
			generalEquipment: 'generalEquipment',
			conductingEquipment: 'conductingEquipment',
			function: 'function',
			lNodeType: 'lNodeType',
		},
		REF_FAMILY: {
			function: 'function',
			eqFunction: 'eqFunction',
		},
	},
}))

vi.mock('@/headless/stores', () => ({
	typeElementsStore: {
		createNewRef: mockCreateNewRef,
	},
}))

vi.mock('@/headless/constants', () => mockConstants)

import { dndStore } from './dnd.svelte'

function createParentWrapper(): Element {
	return document.createElement('ParentType')
}

function startDrag({
	sourceTypeId = 'source-id',
	sourceTypeFamily = 'bay',
	sourceRefFamily,
}: {
	sourceTypeId?: string
	sourceTypeFamily?: string
	sourceRefFamily?: string
} = {}): void {
	dndStore.handleDragStart({
		event: {} as DragEvent,
		sourceTypeId,
		sourceTypeFamily: sourceTypeFamily as never,
		sourceRefFamily: sourceRefFamily as never,
	})
}

afterEach(() => {
	dndStore.handleDragEnd()
	mockCreateNewRef.mockReset()
})

describe('dndStore.handleDragStart', () => {
	it('sets the drag state from the dragged source', () => {
		startDrag({
			sourceTypeId: 'function-id',
			sourceTypeFamily: 'function',
			sourceRefFamily: 'eqFunction',
		})

		expect(dndStore.isDragging).toBe(true)
		expect(dndStore.currentSourceTypeIdOrUuid).toBe('function-id')
		expect(dndStore.currentSourceTypeFamily).toBe('function')
		expect(dndStore.currentSourceRefFamily).toBe('eqFunction')
	})
})

describe('dndStore.handleDragEnd', () => {
	it('clears the complete drag state', () => {
		startDrag({
			sourceTypeId: 'function-id',
			sourceTypeFamily: 'function',
			sourceRefFamily: 'eqFunction',
		})

		dndStore.handleDragEnd()

		expect(dndStore.isDragging).toBe(false)
		expect(dndStore.currentSourceTypeIdOrUuid).toBeUndefined()
		expect(dndStore.currentSourceTypeFamily).toBeUndefined()
		expect(dndStore.currentSourceRefFamily).toBeUndefined()
	})
})

describe('dndStore.handleDrop', () => {
	it('creates a reference with an explicitly supplied reference family', () => {
		const parentTypeWrapper = createParentWrapper()

		startDrag({
			sourceTypeId: 'lNodeType-id',
			sourceTypeFamily: 'lNodeType',
			sourceRefFamily: 'function',
		})

		dndStore.handleDrop({
			parentTypeWrapper,
			parentTypeFamily: 'bay' as never,
		})

		expect(mockCreateNewRef).toHaveBeenCalledWith({
			family: 'function',
			sourceTypeIdOrUuid: 'lNodeType-id',
			parentTypeWrapper,
		})
	})

	it.each([
		{
			parentTypeFamily: 'generalEquipment',
			expectedRefFamily: 'eqFunction',
		},
		{
			parentTypeFamily: 'conductingEquipment',
			expectedRefFamily: 'eqFunction',
		},
		{
			parentTypeFamily: 'bay',
			expectedRefFamily: 'function',
		},
		{
			parentTypeFamily: 'lNodeType',
			expectedRefFamily: 'function',
		},
	])(
		'derives "$expectedRefFamily" for a function dropped on "$parentTypeFamily"',
		({ parentTypeFamily, expectedRefFamily }) => {
			const parentTypeWrapper = createParentWrapper()

			startDrag({
				sourceTypeId: 'function-id',
				sourceTypeFamily: 'function',
			})

			dndStore.handleDrop({
				parentTypeWrapper,
				parentTypeFamily: parentTypeFamily as never,
			})

			expect(mockCreateNewRef).toHaveBeenCalledWith({
				family: expectedRefFamily,
				sourceTypeIdOrUuid: 'function-id',
				parentTypeWrapper,
			})
		},
	)

	it('resets the drag state after a successful drop', () => {
		startDrag({
			sourceTypeId: 'function-id',
			sourceTypeFamily: 'function',
		})

		dndStore.handleDrop({
			parentTypeWrapper: createParentWrapper(),
			parentTypeFamily: 'bay' as never,
		})

		expect(dndStore.isDragging).toBe(false)
		expect(dndStore.currentSourceTypeIdOrUuid).toBeUndefined()
		expect(dndStore.currentSourceTypeFamily).toBeUndefined()
		expect(dndStore.currentSourceRefFamily).toBeUndefined()
	})

	it('throws when no reference family can be determined', () => {
		startDrag({
			sourceTypeId: 'bay-id',
			sourceTypeFamily: 'bay',
		})

		expect(() =>
			dndStore.handleDrop({
				parentTypeWrapper: createParentWrapper(),
				parentTypeFamily: 'function' as never,
			}),
		).toThrow('No ref family')

		expect(mockCreateNewRef).not.toHaveBeenCalled()
	})
})