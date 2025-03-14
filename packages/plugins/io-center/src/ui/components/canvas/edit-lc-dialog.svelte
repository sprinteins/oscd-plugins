<script lang="ts">
    import { LC_TYPE } from "@/headless/constants";
    import Select from "../common/select.svelte";
    import type {
        FormData,
        LcTypes,
        NodeElement as NodeElementType,
    } from "./types.canvas";

    type Props = {
        isOpen: boolean;
        nodeSelected: boolean;
        lcNode: NodeElementType;
        editLC: (lcNode: NodeElementType, newType: LcTypes) => void;
    };

    let { isOpen = $bindable(), nodeSelected = $bindable(), lcNode, editLC }: Props = $props();

    let newType = $state<LcTypes>(LC_TYPE.LCBI);

    function handleCancel() {
        isOpen = false;
        nodeSelected = false;
    }

    function handleSubmit() {
        editLC(lcNode, newType);

        isOpen = false;
        nodeSelected = false;
    }
</script>

<dialog open={isOpen}>
    <div role="button" id="modal" class="backdrop">
        <div class="container space-y-4">
            <Select
                bind:value={newType}
                label="LC Type"
                options={Object.values(LC_TYPE)}
            />
            <div class="action-buttons">
                <button class="cancel-button" onclick={handleCancel}>
                    Cancel
                </button>
                <button class="add-button" onclick={handleSubmit}> Add </button>
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

        .add-button {
            @apply px-4 py-2 bg-blue-600 text-white rounded-lg;
        }
    }
</style>
