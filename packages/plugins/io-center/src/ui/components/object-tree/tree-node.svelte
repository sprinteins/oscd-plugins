<script lang="ts">
    import TreeNode from "./tree-node.svelte";
    import type { TreeNode as TreeNodeType } from "./types.object-tree";
    import { ChevronRight, ChevronDown } from "lucide-svelte";

    type Props = {
        treeNode: TreeNodeType;
        isSelectable?: boolean;
        isOpen?: boolean;
        searchTerm: string;
        selectedNodeName: string;
        setSelectedNodeName: (name: string) => void;
        onToggle?: (event: MouseEvent) => void;
        onSelect?: (event: MouseEvent) => void;
    };

    let {
        treeNode,
        isSelectable,
        isOpen = false,
        searchTerm,
        selectedNodeName,
        setSelectedNodeName,
        onToggle,
        onSelect,
    }: Props = $props();

    let open = $state(isOpen);

    let isSearched = $derived(searchTerm !== "" && treeNode.name.toLowerCase().includes(searchTerm.toLowerCase()))

    function onClick(name: string, event: MouseEvent) {
        event.preventDefault();

        open = !open;
        setSelectedNodeName(name);

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
        return isSelectable && selectedNodeName === treeNode.name
            ? "bg-beige hover:bg-beige"
            : "";
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
                    onClick(treeNode.name, e);
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
                {#each treeNode.children as node}
                    <TreeNode
                        treeNode={node}
                        isSelectable
                        isOpen={node.isOpen}
                        {searchTerm}
                        {selectedNodeName}
                        {setSelectedNodeName}
                    />
                {/each}
            </div>
        </details>
    {:else}
        <button
            class={`p-2 w-full text-sm text-left ${baseClass} ${getSelectedClass()} ${getSearchedClass()}`}
            onclick={(e) => {
                onClick(treeNode.name, e);
            }}
        >
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
