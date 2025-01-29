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

    const onClick = (name: string, event: MouseEvent) => {
        setSelectedNodeName(name);

        if (onToggle) {
            onToggle(event);
        }

        if (onSelect) {
            onSelect(event);
        }
    };
</script>

<Accordion.Item value={treeNode.name}>
    {#if treeNode.children}
        <Accordion.Trigger
            onclick={(e) => {
                onClick(treeNode.name, e);
            }}
            class="flex items-center py-2 cursor-pointer hover:no-underline {isSelectable &&
            selectedNodeName === treeNode.name
                ? 'bg-white'
                : ''}"
        >
            <p class="text-sm font-medium">{treeNode.name}</p>
        </Accordion.Trigger>
        <Accordion.Content class="ml-4">
            <div>
                {#each treeNode.children as node}
                    <TreeNode
                        treeNode={node}
                        isSelectable
                        {selectedNodeName}
                        {setSelectedNodeName}
                    />
                {/each}
            </div>
        </Accordion.Content>
    {:else}
        <p class="ml-6 py-1 text-sm text-gray-700 cursor-pointer">
            {treeNode.name}
        </p>
    {/if}
</Accordion.Item>
