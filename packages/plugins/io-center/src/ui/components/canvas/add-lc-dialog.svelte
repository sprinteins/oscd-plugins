<script lang="ts">
	import {
		ALLOWED_LC_FOR_CDC,
		L_NODE_TYPE_HELPER_TEXT,
		LC_TYPE,
	} from "@/headless/constants";
	import Input from "../common/input.svelte";
	import Select from "../common/select.svelte";
	import type { LcTypes } from "./types.canvas";
	import type { Optional } from "../../../types";
	import { store } from "@/store.svelte";

	type Props = {
		isOpen: boolean;
		addLC: (
			type: LcTypes,
			number?: number,
			numberOfLCIVPorts?: number,
		) => void;
		hasLNodeType: (type: LcTypes) => boolean;
	};

	let { isOpen = $bindable(), addLC, hasLNodeType }: Props = $props();
	let tempTypeOfLC: LcTypes | "" = $state("");

	const typePresentInDoc = $derived.by(() => {
		if (!tempTypeOfLC) {
			return;
		}
		return hasLNodeType(tempTypeOfLC);
	});

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		tempTypeOfLC = "";
		if (!event.target) {
			return;
		}

		const formElement = event.target as HTMLFormElement;
		const formData = new FormData(formElement);

		const typeOfLC = formData.get("typeOfLC") as Optional<LcTypes>;
		const numberOfLCs = Number(formData.get("number")) as Optional<number>;
		const numberOfLCIVPorts = Number(
			formData.get("numberOfLCIVPorts"),
		) as Optional<number>;

		if (!typeOfLC || !numberOfLCs) {
			return;
		}

		addLC(typeOfLC, numberOfLCs, numberOfLCIVPorts);
		isOpen = false;
	}

	function handleCancel() {
		tempTypeOfLC = "";
		isOpen = false;
	}

	function getHelperText() {
		return tempTypeOfLC && !typePresentInDoc
			? `⚠︎ Missing ${tempTypeOfLC} LNodeType`
			: undefined;
	}

	function getOptions() {
		if (!store.selectedDataObject) {
			return [];
		}

		if (
			store.selectedDataObject.cdcType &&
			Object.keys(ALLOWED_LC_FOR_CDC).includes(
				store.selectedDataObject.cdcType,
			)
		) {
			return ALLOWED_LC_FOR_CDC[store.selectedDataObject.cdcType];
		}

		return Object.values(LC_TYPE);
	}
</script>

{#if isOpen}
	<dialog open data-name="add-lc-dialog">
		<div role="button" id="modal" class="backdrop">
			<div class="container space-y-4">
				<form onsubmit={handleSubmit}>
					<Select
						bind:value={tempTypeOfLC}
						name="typeOfLC"
						label="Type of LC"
						options={getOptions()}
						helperText={getHelperText()}
						helperTextDetails={L_NODE_TYPE_HELPER_TEXT}
					/>
					<Input
						name="number"
						label="Number of LCs"
						type="number"
						value="1"
					/>
					{#if tempTypeOfLC === LC_TYPE.LCIV}
						<Input
							name="numberOfLCIVPorts"
							label="Number of Ports"
							type="number"
						/>
					{/if}
					<div class="action-buttons">
						<button class="cancel-button" onclick={handleCancel}>
							Cancel
						</button>
						<button type="submit" class="add-button"> Add </button>
					</div>
				</form>
			</div>
		</div>
	</dialog>
{/if}

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
