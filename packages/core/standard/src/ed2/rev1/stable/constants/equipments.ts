export const GENERAL_EQUIPMENTS = {
	filters: {
		label: 'Filters',
		type: 'FIL'
	},
	valves: {
		label: 'Valves',
		type: 'VLV'
	},
	auxiliaryPowerNetwork: {
		label: 'Auxiliary Power Network',
		type: 'AXN'
	}
} as const

export const CONDUCTING_EQUIPMENTS = {
	circuitBreaker: {
		label: 'Circuit Breaker',
		type: 'CBR',
		numberOfTerminals: 2
	},
	disconnectorOrEarthSwitch: {
		label: 'Disconnector or Earth Switch',
		type: 'DIS',
		numberOfTerminals: 2
	},
	currentTransformer: {
		label: 'Current Transformer',
		type: 'CTR',
		numberOfTerminals: 2
	},
	voltageTransformer: {
		label: 'Voltage Transformer',
		type: 'VTR',
		numberOfTerminals: 1
	},
	battery: {
		label: 'Battery',
		type: 'BAT',
		numberOfTerminals: 1
	},
	bushing: {
		label: 'Bushing',
		type: 'BSH',
		numberOfTerminals: 2
	},
	capacitorBank: {
		label: 'Capacitor Bank',
		type: 'CAP',
		numberOfTerminals: undefined
	},
	converter: {
		label: 'Converter',
		type: 'CON',
		numberOfTerminals: undefined
	},
	earthFaultNeutralizer: {
		label: 'Earth Fault Neutralizer',
		type: 'EFN',
		numberOfTerminals: 1
	},
	fan: {
		label: 'Fan',
		type: 'FAN',
		numberOfTerminals: 1
	},
	gasInsulatedLine: {
		label: 'Gas Insulated Line',
		type: 'GIL',
		numberOfTerminals: 2
	},
	generator: {
		label: 'Generator',
		type: 'GEN',
		numberOfTerminals: 1
	},
	infeedingLine: {
		label: 'Infeeding Line',
		type: 'IFL',
		numberOfTerminals: 1
	},
	motor: {
		label: 'Motor',
		type: 'MOT',
		numberOfTerminals: 1
	},
	neutralResistor: {
		label: 'Neutral Resistor',
		type: 'RES',
		numberOfTerminals: 2
	},
	reactor: {
		label: 'Reactor',
		type: 'REA',
		numberOfTerminals: undefined
	},
	powerShunt: {
		label: 'Power Shunt',
		type: 'PSH',
		numberOfTerminals: 2
	},
	powerCable: {
		label: 'Power Cable',
		type: 'CAB',
		numberOfTerminals: 2
	},
	pump: {
		label: 'Pump',
		type: 'PMP',
		numberOfTerminals: 1
	},
	powerOverheadLine: {
		label: 'Power Overhead Line',
		type: 'LIN',
		numberOfTerminals: 2
	},
	rotatingReactiveComponent: {
		label: 'Rotating Reactive Component',
		type: 'RRC',
		numberOfTerminals: 1
	},
	semiconductorControlledRectifier: {
		label: 'Semiconductor Controlled Rectifier',
		type: 'SCR',
		numberOfTerminals: 2
	},
	surgeArrester: {
		label: 'Surge Arrester',
		type: 'SAR',
		numberOfTerminals: 1
	},
	synchronousMachine: {
		label: 'Synchronous Machine',
		type: 'SMC',
		numberOfTerminals: 1
	},
	thyristorControlledFrequencyConverter: {
		label: 'Thyristor Controlled Frequency Converter',
		type: 'TCF',
		numberOfTerminals: 2
	},
	thyristorControlledReactiveComponent: {
		label: 'Thyristor Controlled Reactive Component',
		type: 'TCR',
		numberOfTerminals: 2
	}
} as const
