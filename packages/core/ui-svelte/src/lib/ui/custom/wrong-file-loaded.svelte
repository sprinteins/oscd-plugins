<script lang="ts">
import { FileX } from 'lucide-svelte'
const { pluginName, extension } = $props()
</script>

<main class="flex flex-col font-black justify-center items-center h-100vh">
	<FileX class="size-60 text-primary mb-16 stroke-[1.25]"/>
	<h1 class="font-black text-4xl mb-5">Wrong File Format!</h1>
	<p class="font-light text-muted-foreground/75">To work with <span style="font-weight: 900;">{pluginName}</span> you have to</p>
	<p class="font-light text-muted-foreground/75">create or open a <span style="font-weight: 900;">{extension}</span> file.</p>
</main>