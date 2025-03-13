<script lang="ts">
    import { LP_TYPE } from "@/headless/constants";
    import Input from "../common/input.svelte";
    import Select from "../common/select.svelte";
    import type { FormData, LpTypes } from "./types.lp-list";

    type Props = {
        isOpen: boolean;
        addLp: (
            type: LpTypes,
            name: string,
            desc: string,
            number?: number,
        ) => void;
    };

    let { isOpen = $bindable(), addLp }: Props = $props();

    let formData = $state<FormData>({
        name: "",
        desc: "",
        type: LP_TYPE.LPDI,
    });

    function handleCancel() {
        isOpen = false;

        formData = {
            name: "",
            desc: "",
            type: LP_TYPE.LPDI,
        };
    }

    function handleSubmit() {
        addLp(formData.type, formData.name, formData.desc, formData.number);

        formData = {
            name: "",
            desc: "",
            type: LP_TYPE.LPDI,
        };

        isOpen = false;
    }
</script>

<dialog open={isOpen}>
    <div role="button" id="modal" class="backdrop">
        <div class="container space-y-4">
            <Select
                bind:value={formData.type}
                label="LP Type"
                options={Object.values(LP_TYPE)}
            />
            <Input bind:value={formData.name} label="LP Name" type="text" />
            <Input
                bind:value={formData.number}
                label="LP Number"
                type="number"
            />
            <Input
                bind:value={formData.desc}
                label="LP Description"
                type="text"
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
