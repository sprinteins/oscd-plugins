<script lang="ts">
import {
	Toaster as Sonner,
	type ToasterProps as SonnerProps
} from 'svelte-sonner'

let {
	mode = 'light',
	...restProps
}: {
	mode: 'light' | 'dark' | 'system' | undefined
	restProps?: SonnerProps
} = $props()
</script>
	
	<Sonner
		theme={mode}
		class="toaster group"
		toastOptions={{
			classes: {
				toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
				description: "group-[.toast]:text-muted-foreground",
				actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
				cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
			},
		}}
		richColors
		{...restProps}
	/>
	