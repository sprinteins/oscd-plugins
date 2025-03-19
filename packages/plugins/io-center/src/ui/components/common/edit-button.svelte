<script lang="ts">
    import { Edit } from "lucide-svelte";

    let { onclick }: { onclick: () => void } = $props();
</script>

<button
    class="w-8 h-8 rounded-full bg-indigo-500 shadow-lg flex items-center justify-center"
    {onclick}
>
    <Edit size={16} color="#fff" />
</button>
