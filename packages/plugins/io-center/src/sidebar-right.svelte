<script lang="ts">
    import type { LcTypes } from "./ui/components/canvas/types.canvas";
	import LcList from "./ui/components/right-bar/lc-list/lc-list.svelte";
	import LpList from "./ui/components/right-bar/lp-list/lp-list.svelte";
	import type {
		LpElement,
		LpTypes,
	} from "./ui/components/right-bar/lp-list/types.lp-list";

	type Props = {
		addLP: (
			type: LpTypes,
			name: string,
			desc: string,
			number?: number,
			numberOfLPDOPorts?: number,
		) => void;
		removeLP: (lpElement: LpElement) => void;
		editLP: (LpElement: LpElement, name: string, desc: string) => void;
		hasLNodeType: (type: LpTypes | LcTypes) => boolean;
		addLC: (type: LcTypes, number?: number, numberOfLCIVPorts?: number) => void;

	};

	type TabType = "LP" | "LC";

	let { addLP, addLC, removeLP, editLP, hasLNodeType }: Props = $props();

	let activeTab = $state<TabType>("LP");

	const tabs: TabType[] = ["LP", "LC"];

	function handleTabChange(tabId: TabType) {
		activeTab = tabId;
	}
</script>

<sidebar-right>
	<div class="tab-switcher -ms-4">
		{#each tabs as tab}
			<button
				class="tab"
				class:active={activeTab === tab}
				onclick={() => handleTabChange(tab)}
			>
				{tab}
			</button>
		{/each}
	</div>
	{#if activeTab === "LP"}
		<LpList {addLP} {removeLP} {editLP} {hasLNodeType} />
	{:else}
		<LcList {addLC} {hasLNodeType}/>
	{/if}
</sidebar-right>

<style lang="scss">
	.tab-switcher {
		display: flex;
		border-bottom: 2px solid #e0e0e0;
	}

	.tab {
		flex: 1;
		padding: 10px 0;
		border: none;
		background-color: transparent;
		cursor: pointer;
		font-weight: normal;
		color: #666;
		transition: all 0.3s ease;
		text-align: center;
	}

	.tab.active {
		font-weight: bold;
		color: #000;
		border-bottom: 2px solid #000;
	}

	.tab:hover {
		background-color: #f0f0f0;
	}
</style>
