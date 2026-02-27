import { describe, it, expect, beforeEach } from 'vitest'
import { matchEquipment } from './match-equipment'
import type {
	BayType,
	ConductingEquipmentTemplate
} from '@/headless/common-types'

const parseBay = (xml: string): Element =>
	new DOMParser().parseFromString(xml, 'application/xml').documentElement

const createBayType = (
	conductingEquipments: Array<{
		uuid: string
		templateUuid: string
		virtual?: boolean
	}>
): BayType => ({
	uuid: 'bay1',
	name: 'BayType1',
	conductingEquipments: conductingEquipments.map((equipment) => ({
		...equipment,
		virtual: equipment.virtual ?? false
	})),
	functions: []
})

const createTemplate = (
	uuid: string,
	type: string,
	name: string
): ConductingEquipmentTemplate => ({
	uuid,
	type,
	name,
	terminals: [],
	eqFunctions: []
})

describe('matching', () => {
	describe('matchEquipment', () => {
		let scdBay: Element
		let bayType: BayType

		beforeEach(() => {
			scdBay = parseBay(`<Bay xmlns="http://www.iec.ch/61850/2003/SCL"></Bay>`)
			bayType = createBayType([])
		})

		describe('GIVEN matching equipment types', () => {
			describe('WHEN running auto-matching', () => {
				it('THEN should match equipment by type', () => {
					// GIVEN
					scdBay = parseBay(
						`<Bay xmlns="http://www.iec.ch/61850/2003/SCL">
							<ConductingEquipment name="CB1" type="CBR"/>
							<ConductingEquipment name="DS1" type="DIS"/>
						</Bay>`
					)

					bayType = createBayType([
						{ uuid: 'ce1', templateUuid: 'template1' },
						{ uuid: 'ce2', templateUuid: 'template2' }
					])

					const templates = [
						createTemplate('template1', 'CBR', 'CB1'),
						createTemplate('template2', 'DIS', 'DS1')
					]

					// WHEN
					const result = matchEquipment(scdBay, bayType, templates)

					// THEN
					expect(result).toHaveLength(2)
					expect(result[0].scdElement.getAttribute('name')).toBe('CB1')
					expect(result[0].templateEquipment.type).toBe('CBR')
					expect(result[1].scdElement.getAttribute('name')).toBe('DS1')
					expect(result[1].templateEquipment.type).toBe('DIS')
				})
			})
		})

		describe('GIVEN manual matches are provided', () => {
			describe('WHEN matching with manual overrides', () => {
				it('THEN should apply manual matches before auto-matching', () => {
					// GIVEN
					scdBay = parseBay(
						`<Bay xmlns="http://www.iec.ch/61850/2003/SCL">
							<ConductingEquipment name="CB1" type="CBR"/>
							<ConductingEquipment name="CB2" type="CBR"/>
						</Bay>`
					)

					bayType = createBayType([
						{ uuid: 'ce1', templateUuid: 'template1' },
						{ uuid: 'ce2', templateUuid: 'template2' }
					])

					const templates = [
						createTemplate('template1', 'CBR', 'CircuitBreakerA'),
						createTemplate('template2', 'CBR', 'CircuitBreakerB')
					]

					const manualMatches = new Map<string, string>([
						['CB1', 'template2']
					])

					// WHEN
					const result = matchEquipment(
						scdBay,
						bayType,
						templates,
						manualMatches
					)

					// THEN
					expect(result).toHaveLength(2)
					expect(result[0].scdElement.getAttribute('name')).toBe('CB1')
					expect(result[0].templateEquipment.uuid).toBe('template2')
					expect(result[1].scdElement.getAttribute('name')).toBe('CB2')
					expect(result[1].templateEquipment.uuid).toBe('template1')
				})
			})
		})

		describe('GIVEN a manual match to a missing template', () => {
			describe('WHEN applying manual matches', () => {
				it('THEN should throw about unavailable equipment', () => {
					// GIVEN
					scdBay = parseBay(
						`<Bay xmlns="http://www.iec.ch/61850/2003/SCL">
							<ConductingEquipment name="CB1" type="CBR"/>
						</Bay>`
					)

					bayType = createBayType([
						{ uuid: 'ce1', templateUuid: 'template1' }
					])

					const templates = [createTemplate('template1', 'CBR', 'CB1')]

					const manualMatches = new Map<string, string>([
						['CB1', 'non-existent-template']
					])

					// WHEN / THEN
					expect(() =>
						matchEquipment(scdBay, bayType, templates, manualMatches)
					).toThrow(
						'No available BayType equipment found for manual match "non-existent-template" (equipment "CB1")'
					)
				})
			})
		})

		describe('GIVEN missing BayType equipment', () => {
			describe('WHEN SCD has an unmatched equipment type', () => {
				it('THEN should throw about missing matching equipment', () => {
					// GIVEN
					scdBay = parseBay(
						`<Bay xmlns="http://www.iec.ch/61850/2003/SCL">
							<ConductingEquipment name="CB1" type="CBR"/>
							<ConductingEquipment name="DS1" type="DIS"/>
						</Bay>`
					)

					bayType = createBayType([
						{ uuid: 'ce1', templateUuid: 'template1' }
					])

					const templates = [createTemplate('template1', 'CBR', 'CB1')]

					// WHEN / THEN
					expect(() =>
						matchEquipment(scdBay, bayType, templates)
					).toThrow(
						'No matching BayType equipment found for SCD equipment "DS1" of type "DIS"'
					)
				})
			})
		})

		describe('GIVEN unresolved template references', () => {
			describe('WHEN template lookup returns undefined', () => {
				it('THEN should skip unresolved templates and match remaining', () => {
					// GIVEN
					scdBay = parseBay(
						`<Bay xmlns="http://www.iec.ch/61850/2003/SCL">
							<ConductingEquipment name="CB1" type="CBR"/>
						</Bay>`
					)

					bayType = createBayType([
						{ uuid: 'ce1', templateUuid: 'invalid-template' },
						{ uuid: 'ce2', templateUuid: 'template1' }
					])

					const templates = [createTemplate('template1', 'CBR', 'CB1')]

					// WHEN
					const result = matchEquipment(scdBay, bayType, templates)

					// THEN
					expect(result).toHaveLength(1)
					expect(result[0].templateEquipment.uuid).toBe('template1')
				})
			})
		})

		describe('GIVEN an empty SCD Bay', () => {
			describe('WHEN no ConductingEquipment elements exist', () => {
				it('THEN should return empty matches', () => {
					// GIVEN
					scdBay = parseBay(
						`<Bay xmlns="http://www.iec.ch/61850/2003/SCL"></Bay>`
					)

					bayType = createBayType([
						{ uuid: 'ce1', templateUuid: 'template1' }
					])

					const templates = [createTemplate('template1', 'CBR', 'CB1')]

					// WHEN
					const result = matchEquipment(scdBay, bayType, templates)

					// THEN
					expect(result).toEqual([])
				})
			})
		})
	})
})
