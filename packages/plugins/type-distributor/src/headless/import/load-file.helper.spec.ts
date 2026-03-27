import { ssdMockA } from '@oscd-plugins/core-api/mocks/v1'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreationPrerequisiteError } from '@/headless/domain/type-resolution'
import { ssdImportStore } from '@/headless/stores/ssd-import.store.svelte'
import { resetSSDImportStore } from '@/headless/test-helpers'
import { INVALID_XML_IMPORT_MESSAGE, loadFromLocal } from './load-file.helper'

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

	const invalidLln0Ssd = `
		<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
			<DataTypeTemplates>
				<LNodeType id="LLN0_Default" lnClass="LLN0">
					<DO name="NamPlt" type="LPL" />
				</LNodeType>
				<DOType id="LPL" cdc="LPL" />
			</DataTypeTemplates>
		</SCL>
	`

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

	it('GIVEN invalid XML WHEN loading from local THEN it rejects and keeps the store empty', async () => {
		const invalidXML = 'This is not valid XML'
		const mockFile = createMockFile(invalidXML, 'invalid.ssd')

		const mockInput = {
			files: [mockFile],
			value: 'invalid.ssd'
		} as unknown as HTMLInputElement

		ssdImportStore.fileInput = mockInput

		await expect(loadFromLocal()).rejects.toThrow(
			INVALID_XML_IMPORT_MESSAGE
		)

		expect(ssdImportStore.loadedSSDDocument).toBeNull()
		expect(ssdImportStore.currentFilename).toBeNull()
		expect(ssdImportStore.bayTypes).toHaveLength(0)
	})

	it('GIVEN an SSD with invalid LLN0 prerequisites WHEN loading from local THEN it rejects and clears any previously loaded SSD', async () => {
		const validFile = createMockFile(ssdMockA, 'valid.ssd')
		const invalidFile = createMockFile(invalidLln0Ssd, 'invalid-lln0.ssd')

		const validInput = {
			files: [validFile],
			value: 'valid.ssd'
		} as unknown as HTMLInputElement

		ssdImportStore.fileInput = validInput
		await loadFromLocal()

		const invalidInput = {
			files: [invalidFile],
			value: 'invalid-lln0.ssd'
		} as unknown as HTMLInputElement

		ssdImportStore.fileInput = invalidInput

		await expect(loadFromLocal()).rejects.toThrow(CreationPrerequisiteError)
		expect(ssdImportStore.loadedSSDDocument).toBeNull()
		expect(ssdImportStore.currentFilename).toBeNull()
		expect(ssdImportStore.bayTypes).toHaveLength(0)
	})
})
