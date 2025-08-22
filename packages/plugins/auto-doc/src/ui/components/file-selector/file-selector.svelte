<script module lang="ts">
export type FileSelectorChangeEvent = CustomEvent<{ file: File }>
</script>

<script lang="ts">
    import { createEventDispatcher } from 'svelte'

    export const accept = '.scd'
    export function open() {
        input.click()
    }

    const dispatch = createEventDispatcher()
    let input: HTMLInputElement = $state()

    function onChange(e: Event) {
        const files = (e.target as HTMLInputElement).files
        const file = files ? files.item(0) : null

        if (!file) {
            throw new Error('No file selected')
        }

        dispatch('change', { file })

        input.value = ''
    }
</script>

<input 
    bind:this={input}
    class="file-selector"
    type="file"
    accept={accept}
    onchange={onChange} />

<style>
    .file-selector {
        display: none;
    }
</style>
