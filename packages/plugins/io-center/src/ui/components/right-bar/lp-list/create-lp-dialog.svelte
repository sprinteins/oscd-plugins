<script lang="ts">
    import { L_NODE_TYPE_HELPER_TEXT, LP_TYPE } from "@/headless/constants";
    import Input from "../../common/input.svelte";
    import Select from "../../common/select.svelte";
    import type { FormData, LpTypes } from "./types.lp-list";

    type Props = {
        isOpen: boolean;
        addLP: (
            type: LpTypes,
            name: string,
            desc: string,
            number?: number,
            numberOfLPDOPorts?: number,
        ) => void;
        hasLNodeType: (type: LpTypes) => boolean;
    };

    let { isOpen = $bindable(), addLP, hasLNodeType }: Props = $props();

    let formData = $state<FormData>({
        name: "",
        desc: "",
        type: "",
    });

    const typePresentInDoc = $derived.by(() => {
        if (!formData.type) {
            return;
        }
        return hasLNodeType(formData.type);
    });

    function handleCancel() {
        isOpen = false;

        formData = {
            name: "",
            desc: "",
            type: "",
        };
    }

    function handleSubmit() {
        if (!formData.type) return;

        addLP(
            formData.type,
            formData.name,
            formData.desc,
            formData.number,
            formData.numberOfLPDOPorts,
        );

        formData = {
            name: "",
            desc: "",
            type: "",
        };

        isOpen = false;
    }

    function getHelperText() {
        return formData.type && !typePresentInDoc
            ? `⚠︎ Missing ${formData.type} LNodeType`
            : undefined;
    }
</script>

<dialog open={isOpen}>
    <div role="button" id="modal" class="backdrop">
        <div class="container space-y-4">
            <Select
                bind:value={formData.type}
                label="LP Type"
                options={Object.values(LP_TYPE)}
                helperText={getHelperText()}
                helperTextDetails={L_NODE_TYPE_HELPER_TEXT}
            />
            <Input bind:value={formData.name} label="LP Name" type="text" />
            {#if formData.type === LP_TYPE.LPDO}
                <Input
                    bind:value={formData.numberOfLPDOPorts}
                    label="Number of Ports"
                    type="number"
                />
            {:else}
                <Input
                    bind:value={formData.number}
                    label="Number of LPs"
                    type="number"
                />
            {/if}
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
