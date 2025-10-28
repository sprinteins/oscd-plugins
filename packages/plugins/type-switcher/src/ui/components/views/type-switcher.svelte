<script lang="ts">
import {
	UCTypeTypeSwitcher,
	SCDQueries,
	type SCDElement,
	type IdentifiableElement,
	type HashedElementGroup
} from '@oscd-plugins/core'
import { GroupCardList } from '../group-card-list'
import { MaterialTheme } from '@oscd-plugins/ui'
import Snackbar, { Actions, Label } from '@smui/snackbar'
import IconButton from '@smui/icon-button'
import { IconClose } from '@oscd-plugins/ui'
import { CategorySelector } from '../category-selector'
import type { EventDetailCategorySelect } from '../category-selector'
import { TypeLinker } from '../type-linker'
import { AffectedNodes } from '../affected-nodes'
import type {
	EventDetailRelink,
	EventDetailTypeLinkerSelect
} from '../type-linker/events'
import { Structure } from '../structure'
import type { Item } from '../list'
import type { IconKeys } from '@oscd-plugins/ui'
import { getParent } from './parent-element'
import type { ElementCategoryMap, Replace } from '@/headless/types'
import { CATEGORY_KEY_REGEX } from '@/headless/regex/categoryKey'

interface Props {
	// Input
	doc: Element
}

let { doc }: Props = $props()

// Internal
let scdQueries: SCDQueries
let deduper: UCTypeTypeSwitcher
let root: HTMLElement | undefined = $state()
let snackbar: Snackbar | undefined = $state()

let categories: ElementCategoryMap = $state({
	'LN Type': [],
	'DO Type': [],
	'DA Type': [],
	'Enum Type': []
})

async function init(document: Element) {
	if (!document) return
	scdQueries = new SCDQueries(document)
	deduper = new UCTypeTypeSwitcher(scdQueries)
	categories = await loadDuplicates(categories)
}

$effect(() => {
	init(doc)
})

async function loadDuplicates(categories: ElementCategoryMap) {
	const start = performance.now()
	const duplicates = await Promise.all([
		await deduper.findDuplicateLogicalNodeTypes(),
		await deduper.findDuplicateDataObjectTypes(),
		await deduper.findDuplicateDataAttributeTypes(),
		await deduper.findDuplicateEnumTypes()
	])

	categories['LN Type'] = duplicates[0]
	categories['DO Type'] = duplicates[1]
	categories['DA Type'] = duplicates[2]
	categories['Enum Type'] = duplicates[3]

	const finish = performance.now()
	console.info({
		level: 'perf',
		msg: 'typeswitcher::loadDuplicates',
		start,
		finish,
		duration: finish - start
	})

	return categories
}

let selectedCategoryLabels = $state<string[]>([])

let selectedFlattenCollectives = $derived.by(() => {
	// Convert labels like "LN Type (5)" back to category keys like "LN Type"
	const selectedCatKeys =
		selectedCategoryLabels.length === 0
			? categoryKeys
			: (selectedCategoryLabels.map((label) => {
					const match = label.match(CATEGORY_KEY_REGEX)
					return match ? match[1] : label
				}) as (keyof ElementCategoryMap)[])

	return selectedCatKeys.flatMap((catKey) => {
		const categoryItems = categories[catKey]
		if (!categoryItems) return []
		return categoryItems.map((cat) => {
			return {
				type: catKey,
				items: cat
			}
		})
	})
})

let selectedGroup: HashedElementGroup = $state([])

// Update selectedIndex based on selectedGroup's position in selectedFlattenCollectives
$effect(() => {
	if (selectedGroup.length === 0) {
		selectedIndex = -1
		return
	}

	const newIndex = selectedFlattenCollectives.findIndex(
		(collective) => collective.items === selectedGroup
	)

	if (newIndex === -1) {
		selectedGroup = []
		affectedNodes = []
		selectedIndex = -1
	} else {
		selectedIndex = newIndex
	}
})

let selectedIndex = $state(-1)

function handleGroupSelect(index: number) {
	selectedIndex = index
	selectedGroup = selectedFlattenCollectives[selectedIndex].items
	affectedNodes = []
}

const iconMap: { [xmlTagName: string]: IconKeys } = {
	DAType: 'dAIcon',
	DOType: 'dOIcon',
	DO: 'dOIcon',
	LNodeType: 'lNIcon',
	EnumType: 'enumIcon'
}

let affectedNodes: Item[] = $state([])

function handleSourceSelect(detail: EventDetailTypeLinkerSelect) {
	const elementIndex = detail.indexes
	affectedNodes = elementIndex.flatMap((idx) => {
		const element = selectedGroup[idx]
		const parents = element.usages.map(getParent)
		return parents.map((parent) => {
			return {
				icon: iconMap[parent.type],
				primaryText: parent.name,
				secondaryText: element.element.id
			}
		})
	})
}

function handleRelink(eventDetail: EventDetailRelink) {
	const { sourceIndexes, targetIndex } = eventDetail
	const relinkSources = sourceIndexes.map((index) => selectedGroup[index])
	const relinkTarget = selectedGroup[targetIndex]

	const actions = relinkSources.flatMap((source) => {
		return source.usages.map((doEl) => {
			return createRelinkActions(doEl, relinkTarget.element)
		})
	})

	const detail = {
		action: {
			actions
		}
	}
	const event = new CustomEvent('editor-action', {
		detail,
		composed: true,
		bubbles: true
	})

	if (!root || !snackbar) {
		console.error('Root or snackbar not initialized')
		return
	}

	root.dispatchEvent(event)
	snackbar.open()
}

function createRelinkActions(els: SCDElement, typeEl: IdentifiableElement) {
	const deep = true
	const modifiedEl = els.element.cloneNode(deep) as Element
	modifiedEl.setAttribute('type', typeEl.id)

	const actions = createEventDetail(els.element, modifiedEl)
	return actions
}

function createEventDetail(oldEl: Element, newEl: Element) {
	const detail: Replace = {
		old: { element: oldEl },
		new: { element: newEl }
	}

	return detail
}

let categoryKeys = $derived(
	Object.keys(categories) as (keyof ElementCategoryMap)[]
)

let categoryLabelsWithCounter = $derived(
	categoryKeys.map((key) => {
		return `${key} (${categories[key].length})`
	})
)

let structure = $derived.by(() => {
	const firstElement = selectedGroup[0]
	if (!firstElement) return []

	const children = Array.from(firstElement.element.element.children)
	return children.map((child) => {
		return {
			primaryText: child.getAttribute('name') ?? child.textContent ?? '~',
			secondaryText: child.getAttribute('bType') ?? child.tagName ?? '~'
		}
	})
})

let itemsWithIcons = $derived(
	selectedFlattenCollectives.map((itemSet) => {
		const tagName = itemSet.items[0]?.element.element.tagName
		return {
			icon: iconMap[tagName],
			items: itemSet.items.map((item) => item.element.id)
		}
	})
)
</script>

<MaterialTheme pluginType="editor">
	<div class="typeswitcher" bind:this={root}>
		<div class="columns">
			<div class="collective">
				<h5 class="mdc-typography--headline5">Duplicates</h5>
				<CategorySelector
					labels={categoryLabelsWithCounter}
					bind:selected={selectedCategoryLabels}
				/>
				<GroupCardList
					itemSets={itemsWithIcons}
					onclick={handleGroupSelect}
					bind:selectedIndex
				/>
			</div>
			<div class="panel">
				<h5 class="mdc-typography--headline5">Duplicates Types</h5>
				{#key selectedGroup}
					<TypeLinker
						items={selectedGroup.map((item) => ({
							label: item.element.id,
						}))}
						handleSelect={handleSourceSelect}
						{handleRelink}
					/>
				{/key}
			</div>
			<div class="panel">
				<h5 class="mdc-typography--headline5">Affected Nodes</h5>
				<AffectedNodes items={affectedNodes} />
			</div>
			<div class="panel">
				<h5 class="mdc-typography--headline5">Structure</h5>
				<Structure items={structure} />
			</div>
		</div>

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
	</div>
</MaterialTheme>

<style>
	.typeswitcher {
		background-color: #eee8d5;
		--header-hight: 112px;
		height: calc(100vh - var(--header-hight));
		display: block;
		padding: 1rem;
		overflow: hidden;
		color: var(--font-color);
	}

	.success :global(.mdc-snackbar__surface) {
		background: var(--color-green);
	}

	.typeswitcher :global(.snackbar-position-fix) {
		bottom: 70px;
	}

	.collective {
		display: grid;
		grid-template-rows: auto auto 1fr;
		padding-bottom: 0 !important;
	}

	h5.mdc-typography--headline5 {
		margin: 16px 0;
		font-size: 14px;
		margin-top: 0.5rem;
		padding-bottom: 1rem;
		margin-left: 1rem;
		font-weight: 400;
		letter-spacing: normal;
		line-height: 2rem;
		text-align: none;
		/* webkit-font-smoothing: antialiased; THIS IS MISSING*/
	}

	.columns {
		--magic-number: 510px;
		height: 100%;
		overflow: hidden;
		display: grid;
		grid-template-columns: 2.75fr 1.75fr 2fr 1.5fr;
		gap: 1rem;
	}
	.columns > div {
		padding: 0.5rem;
		height: 100%;
		overflow: hidden;
	}

	.panel {
		height: 100%;
		background: var(--mdc-theme-surface);
		display: grid;
		grid-template-rows: auto 1fr;
		overflow: hidden;
	}
</style>
