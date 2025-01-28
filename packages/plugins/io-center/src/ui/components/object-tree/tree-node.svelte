<script lang="ts">
    import { Accordion } from "@oscd-plugins/core-ui-svelte";
    import TreeNode from "./tree-node.svelte";
    import type { TreeNode as TreeNodeType } from "./object-tree";

    type Props = {
        treeNode: TreeNodeType;
        isSelectable?: boolean;
        onToggle?: (event: MouseEvent) => void;
    };

    let { treeNode }: Props = $props();
</script>

<Accordion.Item value={treeNode.name}>
    {#if treeNode.children}
        <Accordion.Trigger
            class="flex items-center py-2 cursor-pointer hover:no-underline"
        >
            <p class="text-sm font-medium">{treeNode.name}</p>
        </Accordion.Trigger>
        <Accordion.Content class="ml-4">
            <div>
                {#each treeNode.children as node}
                    <TreeNode treeNode={node} />
                {/each}
            </div>
        </Accordion.Content>
    {:else}
        <p class="ml-6 py-1 text-sm text-gray-700 cursor-pointer">
            {treeNode.name}
        </p>
    {/if}
</Accordion.Item>
