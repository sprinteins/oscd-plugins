<script lang="ts">
    import TreeNode from "./tree-node.svelte";
    import type { TreeNode as TreeNodeType } from "./types.object-tree";
    import { ChevronRight, ChevronDown } from "lucide-svelte";

    type Props = {
        treeNode: TreeNodeType;
        isSelectable?: boolean;
        isOpen?: boolean;
        selectedNodeName: string;
        setSelectedNodeName: (name: string) => void;
        onToggle?: (event: MouseEvent) => void;
        onSelect?: (event: MouseEvent) => void;
    };

    let {
        treeNode,
        isSelectable,
        isOpen = false,
        selectedNodeName,
        setSelectedNodeName,
        onToggle,
        onSelect,
    }: Props = $props();

    let open = $state(isOpen);

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
</script>

<div class="tree-node">
    {#if treeNode.children}
        <details name={treeNode.name} {open}>
            <summary
                onclick={(e) => {
                    onClick(treeNode.name, e);
                }}
                class={`flex items-center gap-1 text-lg p-2 ${baseClass} ${getSelectedClass()}`}
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
                        {selectedNodeName}
                        {setSelectedNodeName}
                    />
                {/each}
            </div>
        </details>
    {:else}
        <button
            class={`p-2 w-full text-sm text-left ${baseClass} ${getSelectedClass()}`}
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
