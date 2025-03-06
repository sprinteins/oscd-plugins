<dialog {open}>
	<p>Add New Logical Conditional</p>
	<form method="dialog" onsubmit={onSubmit}>
		<label>
			<span>LC Type</span>
			<select bind:value={formData.lcType}>
				<option value={LCTypes.LRTB}>{LCTypes.LRTB}</option>
				<option value={LCTypes.LRTD}>{LCTypes.LRTD}</option>
				<option value={LCTypes.LRTI}>{LCTypes.LRTI}</option>
			</select>
		</label>
		<label>
			<span>LC Instance</span>
			<input type="text" bind:value={formData.lcInstance}/>
		</label>
		{#if formData.lcType === LCTypes.LRTI}
		<label>
			<span>Number of LRTI Inputs</span>
			<input type="number" bind:value={formData.nrOfLRTIInputs}/>
		</label>
		{/if}
		<span>
			<button type="submit">Add</button>
			<button onclick={onCancel}>Cancel</button>
		</span>
	</form>
</dialog>

<style>
	dialog {
		position: absolute;
		top: 50%;
		border: black thin solid;
		padding:0.5rem;
	}
	form{
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.5rem;
	}
	input {
		border: black thin solid;
	}
	label {
		display: grid;
		grid-template-columns: 1fr 1fr;
		justify-items: flex-end;
		gap: 1rem;
	}
	select{
		width: 100%;
	}
	button{
		border: black thin solid;
	}
</style>

<script lang="ts">

	import { 
		LCTypes, 
		type LCType, 
		type NewLC,
	} from "./add-lc-dialog.types.d"

	type Props = {
		open: boolean;
		onAdd: (newLC: NewLC) => void;
		onCancel: () => void;
	}
	const { 
		open, 
		onAdd,
		onCancel,
	 }: Props = $props();

	const formData = $state<FormData>({
		lcType: LCTypes.LRTB,
		lcInstance: "",
		nrOfLRTIInputs: undefined,
	})

	type FormData = {
		lcType: LCType;
		lcInstance: string;
		nrOfLRTIInputs?: number;
	}

	function onSubmit(){
		onAdd({
			type: formData.lcType,
			instance: formData.lcInstance,
			nrOfLRTIInputs: formData.nrOfLRTIInputs,
		});
	}
</script>