import { pluginGlobalStore } from "@oscd-plugins/core-ui-svelte";
import { pluginLocalStore } from "../stores";
// TYPES
import type {
	IEDElement,
	CommunicationInfo,
	IEDDetails,
	PublishedMessage,
	ReceivedMessage,
	ExtRefElement,
	ExtRefElementWithDatSet,
	ReportControlInfo,
	ReportControlElement,
	ClientLNElement,
	InputElement,
	GSEControlElement
} from './xml.types.d';

// Constants
const MESSAGE_TYPE = {
	MMS: 'MMS',
	GOOSE: 'GOOSE',
	SMV: 'SMV'
};

// export default function xmlService(rootElement: () => Element, editCount: () => number) {
const MMS_SERVICE_CB_NAME = 'MMS';
const MMS_SERVICE_DAT_SET = 'not implemented yet';


// Core XML query functions
function searchElements<T>(selector: string, attributes: string[] = [], options: { root?: Element } = {}): T[] {
	const root = options.root || pluginGlobalStore.editionStores[pluginLocalStore.currentEdition].rootElement
	if (!root) return [];

	const elements = Array.from(root.querySelectorAll(selector));

	return elements.map(element => {
		const result = { element } as unknown as Record<string, unknown>;

		for (const attr of attributes) {
			result[attr] = element.getAttribute(attr) || '';
		}

		return result as unknown as T;
	});
}

// Implement IED methods
function getIEDs(): IEDElement[] {
	return searchElements<IEDElement>('IED', ['name']);
}

export function getBays(): Set<string> {
	const root = pluginGlobalStore.editionStores[pluginLocalStore.currentEdition].rootElement
	if (!root) return new Set<string>();

	const bays = Array.from(root.querySelectorAll('Bay[name]')).map(bay =>
		bay.getAttribute('name') || ''
	);

	return new Set(bays.filter(bay => bay !== ''));
}

function getBaysByIEDName(iedName: string): Set<string> {
	const root = pluginGlobalStore.editionStores[pluginLocalStore.currentEdition].rootElement
	if (!root) return new Set<string>();

	// Find all LNodes referencing this IED
	const lnodes = Array.from(root.querySelectorAll(`LNode[iedName="${iedName}"]`));

	// Find the Bay ancestors of these LNodes
	const bays = new Set<string>();
	for (const lnode of lnodes) {
		let parent = lnode.parentElement;
		while (parent) {
			if (parent.tagName === 'Bay' && parent.getAttribute('name')) {
				bays.add(parent.getAttribute('name') || '');
				break;
			}
			parent = parent.parentElement;
		}
	}

	return bays;
}

// Parse details from an IED element
function parseDetails(element: Element): IEDDetails {
	const parser = new DOMParser();
	const doc = parser.parseFromString(element.outerHTML, 'text/xml');

	return {
		logicalNodes: parseNodes(doc, ['LN', 'LN0']),
		dataObjects: parseNodes(doc, ['DO', 'DOI']),
		dataAttributes: parseNodes(doc, ['DA', 'FCDA'])
	};
}

function parseNodes(doc: Document, nodeTypes: string[]): string[] {
	const details: string[] = [];

	for (const nodeType of nodeTypes) {
		const elements = doc.getElementsByTagName(nodeType);
		parseElements(elements, details);
	}
	return details;
}

function parseElements(elements: HTMLCollectionOf<Element>, details: string[]) {
	for (const element of Array.from(elements)) {
		details.push(parseAttributes(element));
	}
}

function parseAttributes(element: Element): string {
	let detail = `${element.localName} (`;

	for (const attribute of Array.from(element.attributes)) {
		detail += attribute.name;
		if (attribute.value) {
			detail += `=${attribute.value} `;
		}
	}
	return `${detail})`;
}

// Find published messages
function findPublishedMessages(ied: IEDElement): PublishedMessage[] {
	const messages: PublishedMessage[] = [];
	const reportControlInfos = findPublishedReportControls(ied);

	for (const info of reportControlInfos) {
		messages.push({
			id: info.rptID,
			name: info.name,
			targetIEDName: info.clientIEDName,
			serviceType: MESSAGE_TYPE.MMS,
			serviceCbName: MMS_SERVICE_CB_NAME,
			serviceDatSet: MMS_SERVICE_DAT_SET
		});
	}

	return messages;
}

function findPublishedReportControls(ied: IEDElement): ReportControlInfo[] {
	const controls: ReportControlInfo[] = [];
	const reportControls = searchElements<ReportControlElement>('ReportControl', ['rptID', 'name', 'datSet'], { root: ied.element });

	for (const reportControl of reportControls) {
		const clientLNs = searchElements<ClientLNElement>('ClientLN', ['iedName'], { root: reportControl.element });

		for (const clientLN of clientLNs) {
			controls.push({
				clientIEDName: clientLN.iedName,
				rptID: reportControl.rptID,
				name: reportControl.name
			});
		}
	}

	return controls;
}

// Find received messages
function findReceivedMessages(ied: IEDElement, allIeds: IEDElement[]): ReceivedMessage[] {
	const inputs = searchElements<InputElement>('Inputs', [], { root: ied.element });

	const extRefs = inputs.flatMap(input =>
		searchElements<ExtRefElement>('ExtRef', ['iedName', 'serviceType', 'srcCBName'], { root: input.element })
	);

	const extRefsWithConnectionID = extRefs.map(el => {
		const srcCBName = el.srcCBName;
		const iedName = el.iedName;
		const parentIed = allIeds.find(i => i.name === iedName);

		if (!parentIed) {
			return {
				...el,
				datSet: null
			};
		}

		const connection = searchElements<GSEControlElement>(
			`GSEControl[name="${srcCBName}"]`,
			['name', 'datSet'],
			{ root: parentIed.element }
		)[0];

		return {
			...el,
			datSet: connection?.datSet || null
		};
	});

	return groupInputExtRefElementsByIedNameServiceTypeAndSrcCBName(extRefsWithConnectionID);
}

function groupInputExtRefElementsByIedNameServiceTypeAndSrcCBName(
	elements: ExtRefElementWithDatSet[]
): ReceivedMessage[] {
	const indexed: Record<string, {
		elements: ExtRefElementWithDatSet[];
		key: {
			iedName: string;
			serviceType: string;
			srcCBName: string;
			datSet: string | null;
		};
	}> = {};

	for (const element of elements) {
		if (element.iedName === '') {
			continue;
		}

		const key = `${element.iedName}_${element.serviceType}_${element.srcCBName}_${element.datSet}`;
		const tempKey = {
			iedName: element.iedName,
			serviceType: element.serviceType,
			srcCBName: element.srcCBName,
			datSet: element.datSet
		};

		if (!indexed[key]) {
			indexed[key] = {
				elements: [],
				key: tempKey
			};
		}

		indexed[key].elements.push(element);
	}

	const grouped: ReceivedMessage[] = [];

	for (const obj of Object.values(indexed)) {
		const { iedName, serviceType, srcCBName, datSet } = obj.key;

		grouped.push({
			iedName,
			serviceType,
			srcCBName,
			datSet,
			data: obj.elements
		});
	}

	return grouped;
}

// Main method for getting communication information
export function getIEDCommunicationInfos(): CommunicationInfo[] {
	const ieds = getIEDs();
	console.log('Found IEDs:', ieds);
	const communicationInfos: CommunicationInfo[] = ieds.map(ied => {
		return {
			iedName: ied.name,
			iedDetails: parseDetails(ied.element),
			bays: getBaysByIEDName(ied.name),
			published: findPublishedMessages(ied),
			received: findReceivedMessages(ied, ieds)
		};
	});

	return communicationInfos;
}

// Method to group communication info by bay
function getIEDCommunicationInfosByBay(): Map<string, CommunicationInfo[]> {
	const selector = 'SCL > Substation > VoltageLevel > Bay > LNode';
	return getIEDCommunicationInfosByAncestor({
		ancestor: 'Bay',
		selector
	});
}

// Method to group communication info by subnetwork
function getIEDCommunicationInfosBySubNetworkBus(): Map<string, CommunicationInfo[]> {
	const selector = 'SCL > Communication > SubNetwork > ConnectedAP';
	return getIEDCommunicationInfosByAncestor({
		ancestor: 'SubNetwork',
		selector
	});
}

function retrieveAncestorsNameBySelectorWithAttribute({
	ancestor,
	selector,
	attribute
}: {
	ancestor: string;
	selector: string;
	attribute: string;
}): string[] {
	const root = pluginGlobalStore.editionStores[pluginLocalStore.currentEdition].rootElement
	if (!root) return [];

	const elements = Array.from(root.querySelectorAll(`${selector}[${attribute}]`));
	const names = new Set<string>();

	for (const element of elements) {
		let parent = element.parentElement;
		while (parent) {
			if (parent.tagName === ancestor && parent.getAttribute('name')) {
				names.add(parent.getAttribute('name') || '');
				break;
			}
			parent = parent.parentElement;
		}
	}

	return Array.from(names);
}

function getIEDCommunicationInfosByAncestor({
	ancestor,
	selector
}: { ancestor: string; selector: string }): Map<string, CommunicationInfo[]> {
	const ieds = getIEDCommunicationInfos();
	const iedsCommunicationInfoByElement = new Map<string, CommunicationInfo[]>();

	for (const ied of ieds) {
		const names = retrieveAncestorsNameBySelectorWithAttribute({
			ancestor,
			selector,
			attribute: `iedName='${ied.iedName}'`
		});

		for (const name of names) {
			if (!iedsCommunicationInfoByElement.has(name)) {
				iedsCommunicationInfoByElement.set(name, []);
			}

			const setList = iedsCommunicationInfoByElement.get(name);
			if (setList) setList.push(ied);
		}
	}

	return iedsCommunicationInfoByElement;
}