<script lang="ts">
    import { LP_TYPE } from "@/headless/constants";
    import Input from "../common/input.svelte";
    import Select from "../common/select.svelte";
    import { lpStore } from "./lp-store.svelte";
    import { collectLPs } from "@/query.svelte";

    type Props = {
        isOpen: boolean;
        addLp: () => void;
    };

    let { isOpen = $bindable(), addLp }: Props = $props();

    function handleCancel() {
        isOpen = false;
    }

    function handleSubmit() {
        addLp();

        lpStore.dialogFormData = {
            name: "",
            instance: "",
            desc: "",
            type: LP_TYPE.LPDI,
        };

        isOpen = false;

        collectLPs()
    }
</script>

<dialog open={isOpen}>
    <div role="button" id="modal" class="backdrop">
        <div class="container space-y-4">
            <Select
                bind:value={lpStore.dialogFormData.type}
                label="LP Type"
                options={[LP_TYPE.LPDI, LP_TYPE.LPDO]}
            />
            <Input bind:value={lpStore.dialogFormData.name} label="LP Name" />
            <Input
                bind:value={lpStore.dialogFormData.instance}
                label="LP Instance"
            />
            <Input
                bind:value={lpStore.dialogFormData.desc}
                label="LP Description"
            />
            <div class="action-buttons">
                <button class="cancel-button" onclick={handleCancel}
                    >Cancel</button
                >
                <button class="add-button" onclick={handleSubmit}>Add</button>
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
