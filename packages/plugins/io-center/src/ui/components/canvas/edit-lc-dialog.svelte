<script lang="ts">
    import { LC_TYPE } from "@/headless/constants";
    import Select from "../common/select.svelte";
    import type { LcTypes, LogicalConditioner } from "./types.canvas";
    import type { Optional } from "@/types";
    import Input from "../common/input.svelte";
    import { toast } from "@zerodevx/svelte-toast";

    type Props = {
        isOpen: boolean;
        lc: LogicalConditioner;
        removeLC: (lc: LogicalConditioner) => void;
        editLC: (
            lc: LogicalConditioner,
            newType: LcTypes,
            numberOfLCIVPorts?: number,
        ) => void;
    };

    let { isOpen = $bindable(), lc, removeLC, editLC }: Props = $props();

    let newType = $state<LcTypes>(lc.type);
    let numberOfLCIVPorts = $state<Optional<number>>(undefined);

    function handleCancel() {
        isOpen = false;
    }

    function handleDelete() {
        removeLC(lc);
        toast.push(`${lc.type}-${lc.instance} Deleted!`);
        isOpen = false;
    }

    function handleSubmit() {
        toast.push(
            `${lc.type}-${lc.instance}${newType !== lc.type ? ` type changed to ${newType}` : ""}${numberOfLCIVPorts ? ` ports number changed to ${numberOfLCIVPorts}` : ""}!`,
        );
        editLC(lc, newType, numberOfLCIVPorts);
        isOpen = false;
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
            {#if newType === LC_TYPE.LCIV}
                <Input
                    bind:value={numberOfLCIVPorts}
                    label="Number of LCIV Ports"
                    defaultValue={lc.numberOfLCIVPorts}
                />
            {/if}
            <div class="action-buttons">
                <button class="cancel-button" onclick={handleCancel}>
                    Cancel
                </button>
                <button class="delete-button" onclick={handleDelete}>
                    Delete
                </button>
                <button class="add-button" onclick={handleSubmit}>
                    Edit
                </button>
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
            @apply px-4 py-2 text-white bg-red-600 rounded-lg;
        }

        .add-button {
            @apply px-4 py-2 bg-blue-600 text-white rounded-lg;
        }
    }
</style>
