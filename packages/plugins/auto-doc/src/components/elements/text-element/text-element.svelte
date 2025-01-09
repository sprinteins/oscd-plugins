<script lang="ts">
	export let content = "";
	export let onContentChange: (newContent: string) => void;

	import {debounce} from '@/utils/debounce';
	const TWO_SECONDS_IN_MS = 2000;

	const debouncedContentChange = debounce(onContentChange, TWO_SECONDS_IN_MS);
</script>


<div>
	<textarea 
		name="templateText"
		id=""
		bind:value={content}
		placeholder="Enter your content here"
		on:input={e => debouncedContentChange(e.target.value)}
		/>
</div>

<style>
	textarea {
		width: 95%;
		padding: 0.5rem;
		font-size: 1rem;
	}
</style>