<script lang="ts">
    import { NODE_TYPE } from "@/headless/constants";
    import TreeNode from "./tree-node.svelte";
    import type { TreeNode as TreeNodeType } from "./types.object-tree";
    import { ChevronRight, ChevronDown, CheckIcon } from "lucide-svelte";
    import { addDoElementToCanvas } from "@/headless/stores/canvas-operations.svelte";
    import { canvasStore } from "../canvas/canvas-store.svelte";

    type Props = {
        treeNode: TreeNodeType;
        isOpen?: boolean;
        searchTerm: string;
        onToggle?: (event: MouseEvent) => void;
        onSelect?: (event: MouseEvent) => void;
    };

    let {
        treeNode,
        isOpen = false,
        searchTerm,
        onToggle,
        onSelect,
    }: Props = $props();

    let open = $state(isOpen);

    let isSearched = $derived(
        searchTerm !== "" &&
            treeNode.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    let isSelected = $derived(
        canvasStore.dataObjects.some((item) => item.id === treeNode.id),
    );

    function onClick(id: string, event: MouseEvent) {
        event.preventDefault();

        open = !open;

        if (treeNode.type === NODE_TYPE.dataObjectInstance) {
            addDoElementToCanvas(treeNode);
        }

        if (onToggle) {
            onToggle(event);
        }

        if (onSelect) {
            onSelect(event);
        }
    }

    const baseClass =
        "font-mono cursor-pointer hover:no-underline rounded-md hover:bg-gray-100 transition-colors duration-300";

    function getSelectedClass() {
        return isSelected ? "bg-beige hover:bg-beige" : "";
    }

    function getSearchedClass() {
        return isSearched ? "bg-gray-200 hover:bg-gray-200" : "";
    }
</script>

<div class="tree-node">
    {#if treeNode.children}
        <details {open}>
            <summary
                onclick={(e) => {
                    onClick(treeNode.id, e);
                }}
                class={`flex items-center gap-1 text-lg p-2 ${baseClass} ${getSelectedClass()} ${getSearchedClass()}`}
            >
                {#if open}
                    <ChevronDown size={14} />
                {:else}
                    <ChevronRight size={14} />
                {/if}
                <p class="text-sm font-medium">{treeNode.name}</p>
            </summary>
            <div class="ml-4 border-l">
                {#each treeNode.children as node (node.id)}
                    <TreeNode
                        treeNode={node}
                        isOpen={node.isOpen}
                        {searchTerm}
                    />
                {/each}
            </div>
        </details>
    {:else}
        <button
            class={`p-2 w-full text-sm text-left flex items-center gap-1 ${baseClass} ${getSelectedClass()} ${getSearchedClass()}`}
            onclick={(e) => {
                onClick(treeNode.id, e);
            }}
        >
            {#if isSelected}
                <CheckIcon size={16} />
            {/if}
            {treeNode.name}
        </button>
    {/if}
</div>

<style>
    .tree-node {
        user-select: none;
        -webkit-user-select: none;
    }
</style>
