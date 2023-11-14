

import { derived, writable } from "svelte/store"
import { setContext, getContext }from "svelte"
import type {  ElementCategory } from "../category-selector/categories"
import type { HashedElementCollective, HashedElementGroup } from "@oscd-plugins/core"


type Finder = {
	findDuplicateLogicalNodeTypes: () => Promise<HashedElementCollective>,
	findDuplicateDataObjectTypes: () => Promise<HashedElementCollective>,
	findDuplicateDataAttributeTypes: () => Promise<HashedElementCollective>,
	findDuplicateEnumTypes: () => Promise<HashedElementCollective>,
}

export class UIState {

	private static uistat: UIState
	public static init(finder: Finder){
		UIState.uistat = new UIState(finder)
	}

	public static use(): UIState{
		if(!UIState.uistat){
			throw new Error("UIState not initialized, call `UIState.init()` first")
		}

		return UIState.uistat
	}


	private constructor(
		private finder: Finder,
	){}


	private duplicates: {[key in ElementCategory]: HashedElementCollective} = {
		["LN Type"]:   [],
		["DO Type"]:   [],
		["DA Type"]:   [],
		["Enum Type"]: [],
	}

	public async loadDuplicates(){
		const duplicates = await Promise.all([
			this.finder.findDuplicateLogicalNodeTypes(),
			this.finder.findDuplicateDataObjectTypes(),
			this.finder.findDuplicateDataAttributeTypes(),
			this.finder.findDuplicateEnumTypes(),
		])

		this.duplicates["LN Type"] =   duplicates[0]
		this.duplicates["DO Type"] =   duplicates[1]
		this.duplicates["DA Type"] =   duplicates[2]
		this.duplicates["Enum Type"] = duplicates[3]
	}

	// async loadDuplicates1(type: string){
	// 	if(type === SCDQueries.SelectorDOType){
	// 		duplicateGroups =  await deduper.findDuplicateObjectTypes()
	// 		return 
	// 	}
	// 	if(type === SCDQueries.SelectorDAType) {
	// 		duplicateGroups = await deduper.findDuplicateDataAttributeTypes()
	// 		return
	// 	}
	// 	if(type === SCDQueries.SelectorLNodeType){
	// 		duplicateGroups = await deduper.findDuplicateLogicalNodeTypes()
	// 		return
	// 	}
	// 	if(type === SCDQueries.SelectorEnumType){
	// 		duplicateGroups = await deduper.findDuplicateEnumTypes()
	// 		return
	// 	}

	// 	duplicateGroups = []

	// }

	// 
	// Categories
	// 
	private _category$ = writable<ElementCategory[]>([])
	public category$ = derived(this._category$, types => types)

	public set_Categories(categories: ElementCategory[]){
		this._category$.set(categories)
		this.reset_CategorySelection()
	}


	private _selectedCategories$ = writable<ElementCategory[]>([])
	public selectedCategories$ = derived(this._selectedCategories$, type => type)

	private reset_CategorySelection(){
		this._selectedCategories$.set([])
	}

	public select_Categories(categories: ElementCategory[]){
		this._selectedCategories$.set(categories)
	}

	public selectedCollectives$ = derived(this.selectedCategories$, categories => categories.map(category => this.duplicates[category]).flat() )

	

	// 
	// Hashed Element Group
	// 
	private _selectedHashedElementGroup$ = writable<HashedElementGroup | undefined>([])
	public selectedHashedElementGroup$ = derived(this._selectedHashedElementGroup$, group => group)
	
	public select_HashedElementGroup(newGroup: HashedElementGroup){
		this._selectedHashedElementGroup$.set(newGroup)
	}

	private reset_HashedElementGroupSelection(){
		this._selectedHashedElementGroup$.set(undefined)
	}

}
