export namespace Plugin {
	export type Type = 'editor' | 'menu' | 'validator'

	export type CustomComponentsProps = {
		doc: XMLDocument
		docName: string
		editCount: number
		locale: string
		isCustomInstance: boolean
	}
}
