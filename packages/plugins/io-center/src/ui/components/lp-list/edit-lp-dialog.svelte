<script lang="ts">
    import Input from "../common/input.svelte";
    import { lpStore } from "./lp-store.svelte";

    type Props = {
        isOpen: boolean;
        removeLP: () => void;
    };

    let { isOpen = $bindable(), removeLP }: Props = $props();

    function handleCancel() {
        isOpen = false;
    }

    function handleSubmit() {
        isOpen = false;
    }
</script>

<dialog open={isOpen}>
    <div role="button" id="modal" class="backdrop">
        <div class="container space-y-4">
            <Input
                bind:value={lpStore.dialogFormData.name}
                label="LP Name"
                type="text"
            />
            <Input
                bind:value={lpStore.dialogFormData.desc}
                label="LP Description"
                type="text"
            />
            <div class="action-buttons">
                <button class="cancel-button" onclick={handleCancel}>
                    Cancel
                </button>
                <button class="delete-button" onclick={removeLP}> Delete </button>
                <button class="add-button" onclick={handleSubmit}> Edit </button>
            </div>
        </div>
    </div>
</dialog>

<style lang="scss">
    .backdrop {
        @apply cursor-auto pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300;
    }

    .container {
        @apply bg-white rounded-lg shadow-lg p-6 max-w-sm w-full;
    }

    .action-buttons {
        @apply mt-4 flex justify-end space-x-2;

        .cancel-button {
            @apply px-4 py-2 text-gray-600;
        }

        .delete-button {
            @apply px-4 py-2 text-white bg-red-600 rounded-lg
        }

        .add-button {
            @apply px-4 py-2 bg-blue-600 text-white rounded-lg;
        }
    }
</style>
