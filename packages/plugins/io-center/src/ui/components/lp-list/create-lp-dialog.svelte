<script lang="ts">
    import Input from "../common/input.svelte";
    import Select from "../common/select.svelte";

    type Props = {
        isOpen: boolean;
        addLp: () => void;
    };

    let { isOpen = $bindable(), addLp }: Props = $props();

    let formData = $state({
        name: "",
        instance: "",
        desc: "",
        type: "",
    });
</script>

<dialog open={isOpen}>
    <div role="button" id="modal" class="backdrop">
        <div
            class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full space-y-4"
        >
            <Select
                value={formData.type}
                label="LP Type"
                options={["LPDI", "LPDO"]}
            />
            <Input value={formData.name} label="LP Name" />
            <Input value={formData.instance} label="LP Instance" />
            <Input value={formData.desc} label="LP Description" />
            <div class="mt-4 flex justify-end space-x-2">
                <button
                    class="px-4 py-2 text-gray-600"
                    onclick={() => (isOpen = false)}>Cancel</button
                >
                <button
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    onclick={addLp}
                >
                    Add
                </button>
            </div>
        </div>
    </div>
</dialog>

<style lang="scss">
    .backdrop {
        @apply cursor-auto pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300;
    }
</style>
