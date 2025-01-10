import { DEFINITION } from '@oscd-plugins/core-standard/ed2'
import { findElementsBySelector } from '@oscd-plugins/core-api/plugin/v1'
// TYPES
import type {
	RootElements,
	DataTypeTemplatesElements
} from './types.xmlDocument.js'
import type { Utils } from '@oscd-plugins/core-api/plugin/v1'

class UseXmlDocumentsStore {
	//====== STATES ======//

	xmlDocument: XMLDocument | undefined = $state.raw()

	rootElements: RootElements = $derived({
		header:
			this.xmlDocument?.documentElement.querySelector(
				DEFINITION.header.tag
			) || null,
		substation:
			Array.from(
				this.xmlDocument?.documentElement.querySelectorAll(
					DEFINITION.substation.tag
				) || []
			) || null,
		// TODO: add communication after standard implementation
		// communication:
		// 	this.xmlDocument?.documentElement.querySelector(
		// 		COMMUNICATION.tag
		// 	) || null,
		// TODO: add ied after standard implementation
		// ied:
		// 	Array.from(
		// 		this.xmlDocument?.documentElement.querySelectorAll(
		// 			IED.tag
		// 		) || []
		// 	) || null,
		dataTypeTemplates:
			this.xmlDocument?.documentElement.querySelector(
				DEFINITION.dataTypeTemplates.tag
			) || null
		// TODO: add line after standard implementation
		// line:
		// 	Array.from(
		// 		this.xmlDocument?.documentElement.querySelectorAll(
		// 			LINE.tag
		// 		) || []
		// 	) || null,
		// TODO: add process after standard implementation
		// process:
		// 	Array.from(
		// 		this.xmlDocument?.documentElement.querySelectorAll(
		// 			PROCESS.tag
		// 		) || []
		// 	) || null
	})

	dataTypeTemplatesElements: DataTypeTemplatesElements = $derived.by(() => {
		return {
			lNodeType:
				Array.from(
					this.rootElements.dataTypeTemplates?.querySelectorAll(
						DEFINITION.lNodeType.tag
					) || []
				) || null,
			dOType:
				Array.from(
					this.rootElements.dataTypeTemplates?.querySelectorAll(
						DEFINITION.dOType.tag
					) || []
				) || null,
			dAType:
				Array.from(
					this.rootElements.dataTypeTemplates?.querySelectorAll(
						DEFINITION.dAType.tag
					) || []
				) || null,
			enumType:
				Array.from(
					this.rootElements.dataTypeTemplates?.querySelectorAll(
						DEFINITION.enumType.tag
					) || []
				) || null
		}
	})

	//====== PRIVATE ACTIONS ======//

	//====== PUBLIC ACTIONS ======//

	update({
		editCount,
		newXmlDocument
	}: { editCount: number; newXmlDocument: XMLDocument | undefined }) {
		const trigger = ({
			editCount, // is not used but should be passed to the function to trigger reactivity
			newXmlDocument
		}: {
			editCount: number
			newXmlDocument: XMLDocument | undefined
		}) => {
			if (newXmlDocument) this.xmlDocument = newXmlDocument
		}

		$effect(() => {
			trigger({
				editCount,
				newXmlDocument
			})
		})
	}

	findElements<GenericSclElement extends Utils.CurrentDefinitionElements>({
		selectorTag,
		rootTag
	}: {
		selectorTag: string
		rootTag?: string
	}) {
		if (!this.xmlDocument) throw new Error('No XML Document found')
		return findElementsBySelector<GenericSclElement>({
			selector: selectorTag,
			root:
				(rootTag &&
					this.xmlDocument.documentElement.querySelector(rootTag)) ||
				this.xmlDocument.documentElement
		})
	}
}

export const xmlDocumentStore = new UseXmlDocumentsStore()
