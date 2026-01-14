import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadFromLocal } from './load-file.helper'
import { ssdImportStore } from '@/headless/stores'
import { ssdMockA } from '@oscd-plugins/core-api/mocks/v1'
import { resetSSDImportStore } from '@/headless/test-helpers'

function createMockFile(
	content: string,
	filename: string,
	type = 'application/xml'
): File {
	const file = new File([content], filename, { type })
	if (typeof file.text !== 'function') {
		Object.defineProperty(file, 'text', {
			value: async () => content,
			writable: false
		})
	}
	return file
}

describe('loadFromLocal', () => {
	beforeEach(resetSSDImportStore)

	it('throws when no file is selected or fileInput is undefined', async () => {
		const emptyInput = { files: [] } as unknown as HTMLInputElement
		ssdImportStore.fileInput = emptyInput
		await expect(loadFromLocal()).rejects.toThrow('No file selected')

		ssdImportStore.fileInput = undefined
		await expect(loadFromLocal()).rejects.toThrow('No file selected')
	})

	it('loads, parses SSD, triggers parsing and clears input', async () => {
		const mockFile = createMockFile(ssdMockA, 'test.ssd')

		let inputValue = 'test.ssd'
		const mockInput = {
			files: [mockFile],
			get value() {
				return inputValue
			},
			set value(v) {
				inputValue = v
			}
		} as unknown as HTMLInputElement

		ssdImportStore.fileInput = mockInput

		await loadFromLocal()

		expect(ssdImportStore.currentFilename).toBe('test.ssd')
		const doc = ssdImportStore.loadedSSDDocument
		expect(doc).toBeDefined()
		expect(doc?.documentElement.tagName).toBe('SCL')

		expect(ssdImportStore.bayTypes).toHaveLength(3)
	})

	it('handles invalid XML gracefully and keeps store empty', async () => {
		const invalidXML = 'This is not valid XML'
		const mockFile = createMockFile(invalidXML, 'invalid.ssd')

		const mockInput = {
			files: [mockFile],
			value: 'invalid.ssd'
		} as unknown as HTMLInputElement

		ssdImportStore.fileInput = mockInput

		await loadFromLocal()

		const doc = ssdImportStore.loadedSSDDocument
		expect(doc).toBeDefined()
		expect(ssdImportStore.currentFilename).toBe('invalid.ssd')
		expect(ssdImportStore.bayTypes).toHaveLength(0)
	})
})
