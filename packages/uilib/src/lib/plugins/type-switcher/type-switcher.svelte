<script lang="ts">
	import {
		UCTypeTypeSwitcher,
		SCDQueries,
		type SCDElement,
		type IdentifiableElement,
		type HashedElementCollective,
		type HashedElementGroup,
	} from "@oscd-plugins/core"
	import { GroupCardList } from "./group-card-list"
	import { Theme } from "../../theme"
	import Snackbar, { Actions, Label } from "@smui/snackbar"
	import IconButton from "@smui/icon-button"
	import { IconClose } from "../../components/icons"
	import { CategorySelector } from "./category-selector"
	import type { EventDetailCategorySelect } from "./category-selector"
	import type { ElementCategory } from "./category-selector/categories"
	import { TypeLinker } from "./type-linker"
	import { AffectedNodes } from "./affected-nodes"
	import type {
		EventDetailRelink,
		EventDetailTypeLinkerSelect,
	} from "./type-linker/events"
	import { Structure } from "./structure"
	import { Layout } from "./layout"
	import type { Item } from "../../components/list"
	import type { IconKeys } from "../../components/icons"
	import { NullParentElement, type ParentElement } from "./parent-element"

	// Input
	export let doc: Element

	// Internal
	let scdQueries: SCDQueries
	let deduper: UCTypeTypeSwitcher
	let root: HTMLElement
	let snackbar: Snackbar

	$: init(doc)
	function init(document: Element) {
		if (!document) {
			return
		}
		scdQueries = new SCDQueries(document)
		deduper = new UCTypeTypeSwitcher(scdQueries)
		loadDuplicates()
	}

	const categories: { [key in ElementCategory]: HashedElementCollective } = {
		["LN Type"]:   [],
		["DO Type"]:   [],
		["DA Type"]:   [],
		["Enum Type"]: [],
	}
	$: categoryKeys = Object.keys(categories) as ElementCategory[]
	$: categoryLabelsWithCounter = categoryKeys.map((key) => {
		return `${key} (${categories[key].length})`
	})
	async function loadDuplicates() {
		const start = performance.now()
		const duplicates = await Promise.all([
			await deduper.findDuplicateLogicalNodeTypes(),
			await deduper.findDuplicateDataObjectTypes(),
			await deduper.findDuplicateDataAttributeTypes(),
			await deduper.findDuplicateEnumTypes(),
		])

		categories["LN Type"] = duplicates[0]
		categories["DO Type"] = duplicates[1]
		categories["DA Type"] = duplicates[2]
		categories["Enum Type"] = duplicates[3]

		const finish = performance.now()
		console.info({
			level:    "perf",
			msg:      "typeswitcher::loadDuplicates",
			start,
			finish,
			duration: finish - start,
		})
	}

	function getParent(doEl: SCDElement): ParentElement {
		const notFoundName = "~name not found~"
		const parent = doEl.element.parentElement
		if (!parent) {
			return NullParentElement
		}

		const prioritizedNameAttributes = ["id", "name", "desc"]

		let name = notFoundName
		for (const attr of prioritizedNameAttributes) {
			const value = parent.getAttribute(attr)
			if (value) {
				name = value
				break
			}
		}

		const parentElement: ParentElement = {
			name,
			type: parent.tagName,
		}

		return parentElement
	}

	type HashedElementTypedCollective = {
		items: HashedElementGroup;
		type: string;
	}[]; // basically HashedElement[][]
	// let selectedCategories: ElementCategory[] = []
	let selectedFlattenCollectives: HashedElementTypedCollective = []
	function handleCategorySelect(e: CustomEvent<EventDetailCategorySelect>) {
		const selectedCategoryIndices = e.detail.selection

		const selectedCategories = selectedCategoryIndices.map(
			(idx) => categoryKeys[idx]
		)
		// selectedFlattenCollectives = selectedCategories
		// 	.map((catKey) => categories[catKey])
		// 	.flat()
		selectedFlattenCollectives = selectedCategories
			.map((catKey) => {
				return categories[catKey].map((cat) => {
					return {
						type:  catKey,
						items: cat,
					}
				})
			})
			.flat()
			.filter((cat) => cat.items.length > 0)

		// TODO: group selection should stay if we only add new groups
		selectedGroup = []
		structure = []
		// if( !selectedFlattenCollectives.includes(selectedGroup) ){
		// 	// selectedGroup = []
		// }
		// selectedCategories = e.detail.selection
	}

	let selectedGroup: HashedElementGroup = []
	function handleGroupSelect(e: CustomEvent<{ index: number }>) {
		const selectedGroupIndex = e.detail.index
		selectedGroup = selectedFlattenCollectives[selectedGroupIndex].items
		affectedNodes = []
	}

	let structure: Item[] = []
	$: loadStructure(selectedGroup)
	function loadStructure(group: HashedElementGroup) {
		const firstElement = group[0]
		if (!firstElement) {
			return
		}
		const children = Array.from(firstElement.element.element.children)
		structure = children.map((child) => {
			return {
				primaryText:
					child.getAttribute("name") ?? child.textContent ?? "~",
				secondaryText:
					child.getAttribute("bType") ?? child.tagName ?? "~",
			}
		})
	}

	const iconMap: { [xmlTagName: string]: IconKeys } = {
		DAType:    "dAIcon",
		DOType:    "dOIcon",
		DO:        "dOIcon",
		LNodeType: "lNIcon",
		EnumType:  "enumIcon",
	}

	let affectedNodes: Item[] = []
	function handleSourceSelect(
		event: CustomEvent<EventDetailTypeLinkerSelect>
	) {
		const elementIndex = event.detail.indexes
		affectedNodes = elementIndex
			.map((idx) => {
				const element = selectedGroup[idx]
				const parents = element.usages.map(getParent)
				return parents.map((parent) => {
					return {
						icon:          iconMap[parent.type],
						primaryText:   parent.name,
						secondaryText: element.element.id,
					}
				})
			})
			.flat()
	}

	function handleRelink(e: CustomEvent<EventDetailRelink>) {
		const { sourceIndexes, targetIndex } = e.detail
		const relinkSources = sourceIndexes.map(
			(index) => selectedGroup[index]
		)
		const relinkTarget = selectedGroup[targetIndex]

		const actions = relinkSources
			.map((source) => {
				return source.usages.map((doEl) => {
					return createRelinkActions(doEl, relinkTarget.element)
				})
			})
			.flat()

		const detail = {
			action: {
				actions,
			},
		}
		const event = new CustomEvent("editor-action", {
			detail,
			composed: true,
			bubbles:  true,
		})
		root.dispatchEvent(event)
		snackbar.open()
	}

	function createRelinkActions(els: SCDElement, typeEl: IdentifiableElement) {
		const deep = true
		const modifiedEl = els.element.cloneNode(deep) as Element
		modifiedEl.setAttribute("type", typeEl.id)

		const actions = createEventDetail(els.element, modifiedEl)
		return actions
	}
	interface Replace {
		old: { element: Element };
		new: { element: Element };
		derived?: boolean;
		checkValidity?: () => boolean;
	}

	function createEventDetail(oldEl: Element, newEl: Element) {
		const detail: Replace = {
			old: { element: oldEl },
			new: { element: newEl },
		}

		return detail
	}
</script>

<Theme>
	<typeswitcher bind:this={root}>
		<Layout>
			<svelte:fragment slot="category-selector">
				<CategorySelector
					labels={categoryLabelsWithCounter}
					on:select={handleCategorySelect}
				/>
			</svelte:fragment>

			<svelte:fragment slot="group-card-list">
				{#key selectedFlattenCollectives}
					<GroupCardList
						itemSets={selectedFlattenCollectives.map((itemSet) => {
							const tagName =
								itemSet.items[0]?.element.element.tagName
							return {
								icon:  iconMap[tagName],
								items: itemSet.items.map(
									(item) => item.element.id
								),
							}
						})}
						on:select={handleGroupSelect}
					/>
				{/key}
			</svelte:fragment>

			<svelte:fragment slot="type-linker">
				{#key selectedGroup}
					<TypeLinker
						items={selectedGroup.map((item) => ({
							label: item.element.id,
						}))}
						on:select={handleSourceSelect}
						on:relink={handleRelink}
					/>
				{/key}
			</svelte:fragment>

			<svelte:fragment slot="affected-nodes">
				{#key selectedGroup}
					<AffectedNodes items={affectedNodes} />
				{/key}
			</svelte:fragment>

			<svelte:fragment slot="structure">
				{#key selectedGroup}
					<Structure items={structure} />
				{/key}
			</svelte:fragment>
		</Layout>

		<span class="success">
			<Snackbar bind:this={snackbar} class="snackbar-position-fix">
				<Label>Relink was successful</Label>
				<Actions>
					<IconButton class="material-icons" title="Dismiss">
						<IconClose />
					</IconButton>
				</Actions>
			</Snackbar>
		</span>
	</typeswitcher>
</Theme>

<style>
	typeswitcher {
		--header-hight: 146px;
		height: calc(100vh - var(--header-hight));
		display: block;
		padding: 1rem;
		overflow: hidden;
		color: var(--font-color);
	}

	.success :global(.mdc-snackbar__surface) {
		background: var(--color-green);
	}

	typeswitcher :global(.snackbar-position-fix) {
		bottom: 70px;
	}
</style>
