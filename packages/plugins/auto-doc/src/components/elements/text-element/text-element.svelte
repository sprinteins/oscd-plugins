<script lang="ts">
	export let content = "";
</script>


<div>
	<textarea 
		name="templateText"
		id=""
		bind:value={content}
		placeholder="Enter your content here"
		/>
</div>

<style>
	textarea {
		width: 95%;
		padding: 0.5rem;
		font-size: 1rem;
	}
</style>