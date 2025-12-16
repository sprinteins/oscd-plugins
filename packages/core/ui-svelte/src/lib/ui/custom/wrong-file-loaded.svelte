<script lang="ts">
import FileX from '@lucide/svelte/icons/file-x'
const { pluginName, errorMessage } = $props()
</script>

<main class="flex flex-col text-muted-foreground justify-center items-center h-100vh">
	<FileX class="size-60 text-primary mb-16 stroke-[1.25]"/>
	<h1 class="font-black text-4xl mb-5 uppercase">Wrong File!</h1>
	<p class="font-light text-muted-foreground/75 text-lg">To work with the <span class="font-black">{pluginName}</span> plugin, please refer to this error message:</p>
	<p class="text-muted-foreground/75 font-black mt-2 text-lg">{ errorMessage }</p>
</main>