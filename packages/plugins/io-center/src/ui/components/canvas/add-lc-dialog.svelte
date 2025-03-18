<script lang="ts">
	import { L_NODE_TYPE_HELPER_TEXT, LC_TYPE } from "@/headless/constants";
	import Input from "../common/input.svelte";
	import Select from "../common/select.svelte";
	import type { AddLCFormData, LcTypes } from "./types.canvas";

	type Props = {
		isOpen: boolean;
		addLc: (type: LcTypes, number?: number) => void;
		hasLNodeType: (type: LcTypes) => boolean;
	};

	let { isOpen = $bindable(), addLc, hasLNodeType }: Props = $props();

	let formData = $state<AddLCFormData>({
		type: "",
		number: undefined,
		numberOfLCIVPorts: undefined,
	});

	const typePresentInDoc = $derived.by(() => {
		if (!formData.type) {
			return;
		}
		return hasLNodeType(formData.type);
	});

	function handleCancel() {
		formData.type = "";

		isOpen = false;
	}

	function handleSubmit() {
		if (!formData.type) return;

		addLc(formData.type, formData.number);

		formData.type = "";

		isOpen = false;
	}

	function getHelperText() {
		return formData.type && !typePresentInDoc
			? `⚠︎ Missing ${formData.type} LNodeType`
			: undefined;
	}
</script>

<dialog open={isOpen}>
	<div role="button" id="modal" class="backdrop">
		<div class="container space-y-4">
			<Select
				bind:value={formData.type}
				label="LC Type"
				options={Object.values(LC_TYPE)}
				helperText={getHelperText()}
				helperTextDetails={L_NODE_TYPE_HELPER_TEXT}
			/>
			<Input
				bind:value={formData.number}
				label="LC Number"
				type="number"
			/>
			{#if formData.type === LC_TYPE.LCIV}
				<Input
					bind:value={formData.numberOfLCIVPorts}
					label="Number of Ports"
					type="number"
				/>
			{/if}
			<div class="action-buttons">
				<button class="cancel-button" onclick={handleCancel}>
					Cancel
				</button>
				<button class="add-button" onclick={handleSubmit}> Add </button>
			</div>
		</div>
	</div>
</dialog>

<style lang="scss">
	.backdrop {
		@apply cursor-auto pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300;
	}

	.container {
		@apply bg-white rounded-lg shadow-lg p-6 max-w-sm w-full;
	}

	.action-buttons {
		@apply mt-4 flex justify-end space-x-2;

		.cancel-button {
			@apply px-4 py-2 text-gray-600;
		}

		.add-button {
			@apply px-4 py-2 bg-blue-600 text-white rounded-lg;
		}
	}
</style>
