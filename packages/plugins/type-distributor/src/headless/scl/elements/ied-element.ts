import { createElement } from '@oscd-plugins/core'

const DEFAULT_SIED_ATTRIBUTES = {
	configVersion: '1.0',
	engRight: 'full',
	manufacturer: 'none',
	originalSclRevision: 'B',
	originalSclVersion: '2007',
	type: 'none'
} as const

function createServicesElement(xmlDocument: XMLDocument): Element {
	const services = createElement(xmlDocument, 'Services', { nameLength: '64' })

	services.appendChild(
		createElement(xmlDocument, 'DynAssociation', { max: '8' })
	)

	const settingGroups = createElement(xmlDocument, 'SettingGroups', {})
	settingGroups.appendChild(
		createElement(xmlDocument, 'SGEdit', { resvTms: 'true' })
	)
	services.appendChild(settingGroups)

	services.appendChild(createElement(xmlDocument, 'GetDirectory', {}))
	services.appendChild(
		createElement(xmlDocument, 'GetDataObjectDefinition', {})
	)
	services.appendChild(createElement(xmlDocument, 'DataObjectDirectory', {}))
	services.appendChild(createElement(xmlDocument, 'GetDataSetValue', {}))
	services.appendChild(createElement(xmlDocument, 'DataSetDirectory', {}))
	services.appendChild(
		createElement(xmlDocument, 'ConfDataSet', {
			max: '50',
			maxAttributes: '100',
			modify: 'true'
		})
	)
	services.appendChild(createElement(xmlDocument, 'ReadWrite', {}))
	services.appendChild(
		createElement(xmlDocument, 'ConfReportControl', {
			max: '60',
			bufConf: 'true',
			bufMode: 'both'
		})
	)
	services.appendChild(createElement(xmlDocument, 'GetCBValues', {}))
	services.appendChild(
		createElement(xmlDocument, 'ReportSettings', {
			cbName: 'Conf',
			datSet: 'Conf',
			bufTime: 'Dyn',
			intgPd: 'Dyn',
			optFields: 'Dyn',
			owner: 'true',
			resvTms: 'true',
			rptID: 'Dyn',
			trgOps: 'Dyn'
		})
	)
	services.appendChild(
		createElement(xmlDocument, 'GSESettings', {
			cbName: 'Conf',
			datSet: 'Conf',
			appID: 'Conf',
			dataLabel: 'Conf'
		})
	)

	const smvSettings = createElement(xmlDocument, 'SMVSettings', {
		cbName: 'Conf',
		datSet: 'Conf',
		optFields: 'Conf',
		samplesPerSec: 'true',
		smpRate: 'Conf',
		svID: 'Conf'
	})
	for (const rate of ['80', '256']) {
		const el = createElement(xmlDocument, 'SmpRate', {})
		el.textContent = rate
		smvSettings.appendChild(el)
	}
	for (const sps of ['4000', '4800', '12800', '14400', '15360']) {
		const el = createElement(xmlDocument, 'SamplesPerSec', {})
		el.textContent = sps
		smvSettings.appendChild(el)
	}
	services.appendChild(smvSettings)

	services.appendChild(
		createElement(xmlDocument, 'GOOSE', { max: '16', fixedOffs: 'false' })
	)
	services.appendChild(
		createElement(xmlDocument, 'SMVsc', {
			max: '2',
			delivery: 'multicast',
			deliveryConf: 'false'
		})
	)
	services.appendChild(
		createElement(xmlDocument, 'FileHandling', { ftp: 'true', ftps: 'true' })
	)
	services.appendChild(
		createElement(xmlDocument, 'ConfLNs', {
			fixLnInst: 'true',
			fixPrefix: 'true'
		})
	)

	const clientServices = createElement(xmlDocument, 'ClientServices', {
		goose: 'true',
		maxAttributes: '6000',
		maxGOOSE: '100',
		supportsLdName: 'true'
	})
	clientServices.appendChild(createElement(xmlDocument, 'TimeSyncProt', {}))
	services.appendChild(clientServices)

	services.appendChild(createElement(xmlDocument, 'ConfLdName', {}))
	services.appendChild(
		createElement(xmlDocument, 'SupSubscription', {
			maxGo: '100',
			maxSv: '0'
		})
	)
	services.appendChild(
		createElement(xmlDocument, 'ValueHandling', { setToRO: 'false' })
	)

	return services
}

export function createBasicIEDElement(
	name: string,
	xmlDocument: XMLDocument,
	description?: string
): Element {
	const iedElement = createElement(xmlDocument, 'IED', {
		...DEFAULT_SIED_ATTRIBUTES,
		name,
		desc: description ?? null
	})

	iedElement.appendChild(createServicesElement(xmlDocument))

	return iedElement
}
