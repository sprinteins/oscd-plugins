export namespace Plugin {
	export type Type = 'editor' | 'menu' | 'validator'

	export type CustomComponentsProps = {
		doc: XMLDocument
		docName: string
		editCount: number
		editor: XMLEditor
		locale: string
		isCustomInstance: boolean
	}
}
