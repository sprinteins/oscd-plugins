<script lang="ts">
import type { HashedElementGroup } from '@oscd-plugins/core'
import type { IconKeys } from '@oscd-plugins/ui'
import { IconClose, MaterialTheme } from '@oscd-plugins/ui'
import IconButton from '@smui/icon-button'
import Snackbar, { Actions, Label } from '@smui/snackbar'
import {
	createRelinkActions,
	flattenCategories,
	getAffectedNodes,
	getTypeStructure,
	loadDuplicateCategories
} from '@/headless/type-switcher'
import type { ElementCategory, ElementCategoryMap } from '@/headless/types'
import { AffectedNodes } from '../affected-nodes'
import { CategorySelector } from '../category-selector'
import { GroupCardList } from '../group-card-list'
import type { Item } from '../list'
import { Structure } from '../structure'
import { TypeLinker } from '../type-linker'
import type {
	EventDetailRelink,
	EventDetailTypeLinkerSelect
} from '../type-linker/events'

interface Props {
	// Input
	doc: Element
}

let { doc }: Props = $props()

// Internal
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
	categories = await loadDuplicateCategories(document)
}

$effect(() => {
	init(doc)
})

let selectedCategoryLabels = $state<string[]>([])

let selectedFlattenCollectives = $derived.by(() => {
	if (selectedCategoryLabels.length === 0) {
		return flattenCategories(categories, categoryKeys)
	}

	const selectedKeys = selectedCategoryLabels
		.map((label) => categoryKeys[categoryLabelsWithCounter.indexOf(label)])
		.filter((key): key is ElementCategory => key !== undefined)
	return flattenCategories(categories, selectedKeys)
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
	affectedNodes = getAffectedNodes(selectedGroup, detail.indexes).map(
		({ parent, typeId }) => ({
			icon: iconMap[parent.type],
			primaryText: parent.name,
			secondaryText: typeId
		})
	)
}

function handleRelink({ sourceIndexes, targetIndex }: EventDetailRelink) {
	if (!root || !snackbar) {
		console.error('Root or snackbar not initialized')
		return
	}

	const actions = createRelinkActions(
		selectedGroup,
		sourceIndexes,
		targetIndex
	)
	const event = new CustomEvent('editor-action', {
		detail: { action: { actions } },
		composed: true,
		bubbles: true
	})

	root.dispatchEvent(event)
	snackbar.open()
}

let categoryKeys = $derived(
	Object.keys(categories) as (keyof ElementCategoryMap)[]
)

let categoryLabelsWithCounter = $derived(
	categoryKeys.map((key) => {
		return `${key} (${categories[key].length})`
	})
)

let structure = $derived(
	getTypeStructure(selectedGroup[0]).map(({ name, type }) => ({
		primaryText: name,
		secondaryText: type
	}))
)

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
