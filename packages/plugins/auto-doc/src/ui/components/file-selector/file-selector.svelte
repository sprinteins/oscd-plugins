<script lang="ts">
    interface Props {
        onchange: (file: File) => void
    }
    let { onchange }: Props = $props()

    export const accept = '.scd'
    export function open() {
        input.click()
    }

    let input: HTMLInputElement = $state()

    function onChange(e: Event) {
        const files = (e.target as HTMLInputElement).files
        const file = files ? files.item(0) : null

        if (!file) {
            throw new Error('No file selected')
        }

        onchange(file)

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
