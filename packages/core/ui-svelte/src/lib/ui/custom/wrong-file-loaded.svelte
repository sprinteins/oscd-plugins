<script lang="ts">
import { Origami } from 'lucide-svelte'

const { errorMessage } = $props()
</script>

<main class="flex justify-center items-center space-y-8">
<Origami size={16} />
<h1>{errorMessage}</h1>
</main>
