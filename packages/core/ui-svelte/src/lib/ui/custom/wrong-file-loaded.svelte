<script lang="ts">
import { Annoyed } from 'lucide-svelte'

const { extension } = $props()
</script>

<!-- This component is mounted programmatically and thus can't safely get access to tailwind class -->
<main
	style="display: flex; flex-direction: column; color: #29303d; justify-content: center; align-items: center; height: 80vh;"
>
	<Annoyed style="width: 14rem;	height: 14rem;" />
	<h1 style="font-size: 3.75rem; line-height: 1; margin-top: 5rem;">It seems that you are trying to load the wrong type of file!</h1>
	<p style="font-size: 2.25rem; line-height: 2.5rem; margin-top: 3rem;">File type should be <span style="font-weight: 900;">{extension}</span></p>
</main>