import type { SCDElement, IdentifiableElement } from "../scd/scd-query"
import type { SCDQueries } from "../scd/scd-query"
import { hashElement } from "../xml/hash"

/** 
 * The name is temporary, rename it if you have a better one
 * UC = Use Case
 */
export class UCTypeTypeSwitcher {

	constructor(
		private readonly scdQueries: SCDQueries,
	){}

	public async findDuplicateDataObjectTypes(): Promise<HashedElementCollective> {
		const duplicates = await this.findDuplicateTypes(this.scdQueries.searchDOTypes.bind(this.scdQueries))
		return duplicates
	}

	public async findDuplicateDataAttributeTypes(): Promise<HashedElementCollective>{
		const duplicates = await this.findDuplicateTypes(this.scdQueries.searchDATypes.bind(this.scdQueries))
		return duplicates
	}

	public async findDuplicateLogicalNodeTypes(): Promise<HashedElementCollective>{
		const duplicates = await this.findDuplicateTypes(this.scdQueries.searchLNodeTypes.bind(this.scdQueries))
		return duplicates
	}

	public async findDuplicateEnumTypes(): Promise<HashedElementCollective>{
		const duplicates = await this.findDuplicateTypes(this.scdQueries.searchEnumTypes.bind(this.scdQueries))
		return duplicates
	}
	
	public async findDuplicateTypes(searchElements: () => IdentifiableElement[]): Promise<HashedElementCollective>{
		const types = searchElements()
		const hashedTypes: HashedElement[] = await Promise.all(
			types.map(this.createHashedElement.bind(this)),
		)
		const grouped = this.groupByHash(hashedTypes)
		const duplicates = Object.values(grouped).filter(group => group.length > 1)

		return duplicates
	}


	// TODO: this is a big perofrmance bottleneck
	// we should delay until the user selects elements from duplica types (2nd column)
	private findUserElements(elId: string): SCDElement[] {
		const elements:SCDElement[] = [
			...this.scdQueries.searchElementsByTypeAttr(elId),
			...this.scdQueries.searchElementsByLnTypeAttr(elId),
		]
		return elements
	}

	private async createHashedElement(el: IdentifiableElement): Promise<HashedElement>{
		const hash = await hashElement(el.element)
		const usages = this.findUserElements(el.id)
		return {
			element: el,
			hash,
			usages,
		}
	}

	private groupByHash(dots: HashedElement[]): GroupedHashedTypedElements {
		const grouped: GroupedHashedTypedElements = {}
		for (const dot of dots) {
			if (!grouped[dot.hash]) {
				grouped[dot.hash] = []
			}
			grouped[dot.hash].push(dot)
		}
		return grouped
	}

	
}

export type HashedElement = {
	element: IdentifiableElement,
	hash: string,
	usages: SCDElement[],
}

export type HashedElementGroup = HashedElement[] // basically HashedElement[]
export type HashedElementCollective = HashedElementGroup[] // basically HashedElement[][]

/**
 * Only used internally
 */
type GroupedHashedTypedElements = {
	[hash: string]: HashedElement[]
}