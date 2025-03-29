<script lang="ts">
    type Props = {
        label: string;
        value?: string;
        options: string[];
        helperText?: string;
        helperTextDetails?: string;
		name?: string;
    };

    let {
        label,
        value = $bindable(),
        options,
        helperText,
        helperTextDetails,
		...restProps
    }: Props = $props();
</script>

<div>
    <label for="select">
        {label}
    </label>
    <select id="select" bind:value {...restProps}>
        {#each options as option}
            <option value={option}>{option}</option>
        {/each}
    </select>
    {#if helperText}
        <details>
            <summary>
                {helperText}
            </summary>
            {helperTextDetails}
        </details>
    {:else}
        <div class="h-6"></div>
    {/if}
</div>

<style lang="scss">
    label {
        @apply block mb-2 text-sm font-medium text-gray-900 dark:text-white;
    }

    select {
        @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500;
    }

    summary {
        outline: none;
        position: relative;
        cursor: pointer;
    }
    details {
        @apply ps-2 pt-2 text-slate-500 text-xs;
        box-sizing: border-box;
    }

    details[open] > summary:before {
        transform: rotate(90deg);
    }
    summary:before {
        content: "";
        position: absolute;
        top: 1.3rem;
        left: 1rem;
        transform: rotate(0);
        transform-origin: 0.2rem 50%;
        transition: 0.25s transform ease;
    }
</style>
