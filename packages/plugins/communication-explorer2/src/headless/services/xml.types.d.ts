export type IEDElement = {
	name: string;
	element: Element;
}

export type IEDDetails = {
	logicalNodes: string[];
	dataObjects: string[];
	dataAttributes: string[];
}

export type ReportControlInfo = {
	clientIEDName: string;
	rptID: string;
	name: string;
}

export type ReportControlElement = {
	element: Element;
	rptID: string;
	name: string;
	datSet: string;
}

export type ClientLNElement = {
	element: Element;
	iedName: string;
}

export type InputElement = {
	element: Element;
}

export type GSEControlElement = {
	element: Element;
	name: string;
	datSet: string;
}

export type PublishedMessage = {
	id: string;
	name: string;
	targetIEDName: string;
	serviceType: string;
	serviceCbName: string;
	serviceDatSet: string;
}

export type ExtRefElement = {
	iedName: string;
	serviceType: string;
	srcCBName: string;
	element: Element;
}

export type ExtRefElementWithDatSet = ExtRefElement & {
	datSet: string | null;
}

export type ReceivedMessage = {
	iedName: string;
	serviceType: string;
	srcCBName: string;
	datSet: string | null;
	data: ExtRefElementWithDatSet[];
}

export type CommunicationInfo = {
	iedName: string;
	iedDetails: IEDDetails;
	bays: Set<string>;
	published: PublishedMessage[];
	received: ReceivedMessage[];
}