import { describe, expect, it } from 'vitest'
import type { IED } from '../../diagram/networking'
import {
	buildCreateCableEvent,
	buildUpdateCableEvent,
	getCableNameErrors,
	getInitialPort
} from './cable-form.new-connection'

function makeIED(name: string, ports: { port: string; cable: string }[]): IED {
	return {
		name,
		networking: ports.map(({ port, cable }) => ({
			iedName: name,
			ipAddress: '',
			ipSubnet: '',
			ipGateway: '',
			connectedAP: '',
			plug: '',
			type: '',
			port,
			cable,
			_physConnectionElement: {} as Element
		}))
	}
}

describe('GIVEN a cable form', () => {
	it('WHEN a cable name is empty THEN it is required', () => {
		expect(getCableNameErrors('', [], null)).toEqual({
			required: true,
			cableNameInUse: false
		})
	})

	it('WHEN a new cable name is already assigned THEN it is rejected', () => {
		expect(getCableNameErrors('cable-1', ['cable-1'], null)).toEqual({
			required: false,
			cableNameInUse: true
		})
	})

	it('WHEN a new cable name is unused THEN it is accepted', () => {
		expect(getCableNameErrors('cable-2', ['cable-1'], null)).toEqual({
			required: false,
			cableNameInUse: false
		})
	})

	it('WHEN an existing cable keeps its name THEN it is not treated as a duplicate', () => {
		expect(getCableNameErrors('cable-1', ['cable-1'], 'cable-1')).toEqual({
			required: false,
			cableNameInUse: false
		})
	})

	it('WHEN ports are initialized for an existing cable THEN its current port is selected', () => {
		const ied = makeIED('IED-1', [
			{ port: 'P1', cable: '0' },
			{ port: 'P2', cable: 'cable-1' }
		])

		expect(getInitialPort(ied, 'cable-1')).toBe('P2')
	})

	it('WHEN ports are initialized for a new cable THEN the first open port is selected', () => {
		const ied = makeIED('IED-1', [
			{ port: 'P1', cable: '0' },
			{ port: 'P2', cable: '0' }
		])

		expect(getInitialPort(ied, null)).toBe('P1')
	})

	it('WHEN no open port exists THEN port initialization reports the missing port', () => {
		const ied = makeIED('IED-1', [{ port: 'P1', cable: 'cable-1' }])

		expect(() => getInitialPort(ied, null)).toThrow(
			'No open port found in IED IED-1'
		)
	})

	it('WHEN the existing cable has no port on the IED THEN port initialization reports the missing cable', () => {
		const ied = makeIED('IED-1', [{ port: 'P1', cable: '0' }])

		expect(() => getInitialPort(ied, 'cable-1')).toThrow(
			'Port for cable cable-1 in IED IED-1 not found'
		)
	})

	it('WHEN a cable is created without changing ports THEN the first open ports are used', () => {
		const source = makeIED('IED-1', [{ port: 'P1', cable: '0' }])
		const target = makeIED('IED-2', [{ port: 'P2', cable: '0' }])

		expect(
			buildCreateCableEvent(
				{ isNew: true, source, target },
				'cable-1',
				undefined,
				undefined
			)
		).toEqual({
			cable: 'cable-1',
			source: { ied: source, port: 'P1' },
			target: { ied: target, port: 'P2' }
		})
	})

	it('WHEN a cable is created with selected ports THEN those ports are used', () => {
		const source = makeIED('IED-1', [
			{ port: 'P1', cable: '0' },
			{ port: 'P2', cable: '0' }
		])
		const target = makeIED('IED-2', [{ port: 'P3', cable: '0' }])

		expect(
			buildCreateCableEvent(
				{ isNew: true, source, target },
				'cable-1',
				'P2',
				'P3'
			)
		).toEqual({
			cable: 'cable-1',
			source: { ied: source, port: 'P2' },
			target: { ied: target, port: 'P3' }
		})
	})

	it('WHEN a cable is created without an open port THEN creation reports the missing port', () => {
		const source = makeIED('IED-1', [])
		const target = makeIED('IED-2', [{ port: 'P2', cable: '0' }])

		expect(() =>
			buildCreateCableEvent(
				{ isNew: true, source, target },
				'cable-1',
				undefined,
				undefined
			)
		).toThrow('No open port found in IED IED-1')
	})

	it('WHEN an existing cable is updated without changing ports THEN the existing ports are preserved', () => {
		const source = makeIED('IED-1', [{ port: 'P1', cable: 'cable-1' }])
		const target = makeIED('IED-2', [{ port: 'P2', cable: 'cable-1' }])

		expect(
			buildUpdateCableEvent(
				{ isNew: false, cableName: 'cable-1', source, target },
				'cable-2',
				undefined,
				undefined
			)
		).toEqual({
			cable: 'cable-2',
			source: { ied: source, oldPort: 'P1', newPort: 'P1' },
			target: { ied: target, oldPort: 'P2', newPort: 'P2' }
		})
	})

	it('WHEN an existing cable is updated with selected ports THEN the new ports are included', () => {
		const source = makeIED('IED-1', [
			{ port: 'P1', cable: 'cable-1' },
			{ port: 'P3', cable: '0' }
		])
		const target = makeIED('IED-2', [
			{ port: 'P2', cable: 'cable-1' },
			{ port: 'P4', cable: '0' }
		])

		expect(
			buildUpdateCableEvent(
				{ isNew: false, cableName: 'cable-1', source, target },
				'cable-2',
				'P3',
				'P4'
			)
		).toEqual({
			cable: 'cable-2',
			source: { ied: source, oldPort: 'P1', newPort: 'P3' },
			target: { ied: target, oldPort: 'P2', newPort: 'P4' }
		})
	})

	it('WHEN an update has no existing cable name THEN it reports the missing cable', () => {
		const source = makeIED('IED-1', [{ port: 'P1', cable: '0' }])
		const target = makeIED('IED-2', [{ port: 'P2', cable: '0' }])

		expect(() =>
			buildUpdateCableEvent(
				{ isNew: false, source, target },
				'cable-2',
				undefined,
				undefined
			)
		).toThrow('Existing cable not found during update')
	})

	it('WHEN the existing cable is missing from an IED THEN the update reports the missing port', () => {
		const source = makeIED('IED-1', [{ port: 'P1', cable: '0' }])
		const target = makeIED('IED-2', [{ port: 'P2', cable: 'cable-1' }])

		expect(() =>
			buildUpdateCableEvent(
				{ isNew: false, cableName: 'cable-1', source, target },
				'cable-2',
				undefined,
				undefined
			)
		).toThrow('Port for cable cable-1 in IED IED-1 not found')
	})
})
