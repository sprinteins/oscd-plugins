<script lang="ts">
    type Props = {
        label: string;
        value: string;
    };

    let { label, value = $bindable() }: Props = $props();
</script>

<div>
    <label for="input">
        {label}
    </label>
    <input type="text" id="input" bind:value />
</div>

<style lang="scss">
    label {
        @apply block mb-2 text-sm font-medium text-gray-900 dark:text-white;
    }

    input {
        @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500;
    }
</style>
