<svelte:options customElement={{
	props: {
		Title: { reflect: true, type: 'String'},
	}
}} />

<script lang="ts" >
import Title from '@/title.svelte'

const { title } = $props()
</script>

<Title {title} />