<script lang="ts">
import type { AccessPointData } from '../lib'

let {
	accessPoints,
	onRemove
}: {
	accessPoints: AccessPointData[]
	onRemove: (name: string) => void
} = $props()
</script>

{#if accessPoints.length > 0}
	<section>
		<header class="pb-2">
			<h1 class="text-sm font-medium text-muted-foreground">Access Points to create:</h1>
		</header>
		<div class="flex flex-wrap gap-2">
			{#each accessPoints as ap}
				<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground">
					{ap.name}
					<button
						type="button"
						class="ml-1 hover:text-destructive focus:outline-none"
						onclick={() => onRemove(ap.name)}
						aria-label="Remove {ap.name}"
					>
						×
					</button>
				</span>
			{/each}
		</div>
	</section>
{/if}
