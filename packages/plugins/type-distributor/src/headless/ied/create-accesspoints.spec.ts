import { describe, it, expect, beforeEach } from 'vitest'
import { createBasicIEDElement } from './create-s-ied'
import { createAccessPoints } from './create-accesspoints'

describe('createAccessPoints', () => {
	let iedElement: Element

	beforeEach(() => {
		iedElement = createBasicIEDElement(
			'TestIED',
			new DOMParser().parseFromString('<SCL></SCL>', 'application/xml')
		)
	})

	describe('Functionality Tests', () => {
		it('should create an AccessPoint element on the same Level as Services', () => {
			const accessPoints = [{ name: 'AP1' }]
			const updatedIedElement = createAccessPoints(
				iedElement,
				accessPoints
			)

			const accessPointElements =
				updatedIedElement.getElementsByTagName('AccessPoint')
			const servicesElements =
				updatedIedElement.getElementsByTagName('Services')

			expect(servicesElements[0].parentElement).toBe(
				accessPointElements[0].parentElement
			)
		})

		it('should set the name attribute of AccessPoint', () => {
			const accessPoints = [{ name: 'AP1' }]
			const updatedIedElement = createAccessPoints(
				iedElement,
				accessPoints
			)

			const accessPointElements =
				updatedIedElement.getElementsByTagName('AccessPoint')

			expect(accessPointElements[0].getAttribute('name')).toBe('AP1')
		})

		it('should set the desc attribute of AccessPoint when description is provided', () => {
			const accessPoints = [
				{ name: 'AP1', description: 'Access Point 1' }
			]
			const updatedIedElement = createAccessPoints(
				iedElement,
				accessPoints
			)

			const accessPointElements =
				updatedIedElement.getElementsByTagName('AccessPoint')

			expect(accessPointElements[0].getAttribute('desc')).toBe(
				'Access Point 1'
			)
		})

		it('should create multiple AccessPoint elements when multiple accessPoints are provided', () => {
			const accessPoints = [{ name: 'AP1' }, { name: 'AP2' }]
			const updatedIedElement = createAccessPoints(
				iedElement,
				accessPoints
			)

			const accessPointElements =
				updatedIedElement.getElementsByTagName('AccessPoint')

			expect(accessPointElements.length).toBe(2)
			expect(accessPointElements[0].getAttribute('name')).toBe('AP1')
			expect(accessPointElements[1].getAttribute('name')).toBe('AP2')
		})

		it('should have a Server child element within AccessPoint', () => {
			const accessPoints = [{ name: 'AP1' }]
			const updatedIedElement = createAccessPoints(
				iedElement,
				accessPoints
			)

			const accessPointElements =
				updatedIedElement.getElementsByTagName('AccessPoint')
			const serverElements =
				accessPointElements[0].getElementsByTagName('Server')

			expect(serverElements.length).toBe(1)
		})

		it('should have an Authentication child element within Server with the attribut none="true"', () => {
			const accessPoints = [{ name: 'AP1' }]
			const updatedIedElement = createAccessPoints(
				iedElement,
				accessPoints
			)

			const accessPointElements =
				updatedIedElement.getElementsByTagName('AccessPoint')
			const serverElements =
				accessPointElements[0].getElementsByTagName('Server')
			const authenticationElements =
				serverElements[0].getElementsByTagName('Authentication')

			expect(authenticationElements.length).toBe(1)
			expect(authenticationElements[0].getAttribute('none')).toBe('true')
		})
	})
})
