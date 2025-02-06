<script lang="ts">
    import { Accordion } from "@oscd-plugins/core-ui-svelte";
    import TreeNode from "./tree-node.svelte";
    import type { TreeNode as TreeNodeType } from "./types.object-tree";

    type Props = {
        treeNode: TreeNodeType;
        isSelectable?: boolean;
        selectedNodeName: string;
        setSelectedNodeName: (name: string) => void;
        onToggle?: (event: MouseEvent) => void;
        onSelect?: (event: MouseEvent) => void;
    };

    let {
        treeNode,
        isSelectable,
        selectedNodeName,
        setSelectedNodeName,
        onToggle,
        onSelect,
    }: Props = $props();

    function onClick(name: string, event: MouseEvent) {
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

{#if treeNode.children}
    <details name={treeNode.name}>
        <summary
            onclick={(e) => {
                onClick(treeNode.name, e);
            }}
            class={`flex items-center text-lg p-2 ${baseClass} ${getSelectedClass()}`}
        >
            <p class="text-sm font-medium">{treeNode.name}</p>
        </summary>
        <div class="ml-4 border-l">
            {#each treeNode.children as node}
                <TreeNode
                    treeNode={node}
                    isSelectable
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
