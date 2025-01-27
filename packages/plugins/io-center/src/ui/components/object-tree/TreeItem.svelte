<script lang="ts">
    import {
        Accordion
    } from '@oscd-plugins/core-ui-svelte'
    import TreeItem from './TreeItem.svelte'
    import type { TreeNode } from "./object-tree";

    type Props = {
        treeNode: TreeNode;
    };

    let { treeNode }: Props = $props();
</script>

<tree-node>
    <Accordion.Root type="single" class="bg-white">
        <Accordion.Item value={treeNode.name}>
            <Accordion.Trigger>
                <p>{treeNode.name}</p>
            </Accordion.Trigger>
            {#if treeNode.children}
            <Accordion.Content>
                <div class="pl-4">
                    {#each treeNode.children as node}
                    <TreeItem treeNode={node} />
                    {/each}
                </div>
            </Accordion.Content>
            {/if}
        </Accordion.Item>
    </Accordion.Root>
</tree-node>
