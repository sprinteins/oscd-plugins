<script lang="ts">
	import { LC_TYPE } from "@/headless/constants";
	import Input from "../common/input.svelte";
	import Select from "../common/select.svelte";
	import type { FormData, LcTypes } from "./types.canvas";

	type Props = {
		isOpen: boolean;
		addLc: (type: LcTypes, number?: number) => void;
	};

	let { isOpen = $bindable(), addLc }: Props = $props();

	let formData = $state<FormData>({
		type: LC_TYPE.LCBI,
	});

	function handleCancel() {
		formData = {
			type: LC_TYPE.LCBI,
		};

		isOpen = false;
	}

	function handleSubmit() {
		addLc(formData.type, formData.number);

		formData = {
			type: LC_TYPE.LCBI,
		};

		isOpen = false;
	}
</script>

<dialog open={isOpen}>
	<div role="button" id="modal" class="backdrop">
		<div class="container space-y-4">
			<Select
				bind:value={formData.type}
				label="LC Type"
				options={Object.values(LC_TYPE)}
			/>
			<Input
				bind:value={formData.number}
				label="LP Number"
				type="number"
			/>
			{#if formData.type === LC_TYPE.LCIV}
				<Input
					bind:value={formData.nbOfLCIVPorts}
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
