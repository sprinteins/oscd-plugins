<script lang="ts">
    import { SearchIcon } from "lucide-svelte";

    let { searchTerm = $bindable() }: { searchTerm: string } = $props();
</script>

<div class="relative flex">
    <input
        class="bg-gray-50 w-full border-2 border-gray-300 rounded-lg pl-8 py-2"
        bind:value={searchTerm}
        placeholder="Search DO"
    />
    <SearchIcon
        size={16}
        class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
    />
</div>
