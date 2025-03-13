export type DataObject = {
	id: string,
	ied: {name: string };
	lDevice: { inst: string };
	ln: { lnClass: string, inst: string };
	doName: string;
	children: DataObject[]
}