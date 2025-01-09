export namespace OpenEvent {
	//==== EVENT

	export type Root = CustomEvent<Detail>

	export type Detail = {
		doc: XMLDocument
		docName: string
	}
}
