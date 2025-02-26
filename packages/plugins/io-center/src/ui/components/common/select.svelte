<script lang="ts">
    type Props = {
        label: string;
        value: string;
        options: string[];
    };

    let { label, value = $bindable(), options }: Props = $props();
</script>

<div>
    <label for="select">
        {label}
    </label>
    <select id="select" bind:value>
        {#each options as option}
            <option value={option}>{option}</option>
        {/each}
    </select>
</div>

<style lang="scss">
    label {
        @apply block mb-2 text-sm font-medium text-gray-900 dark:text-white;
    }

    select {
        @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500;
    }
</style>
