<script lang="ts">
    import TreeItem from './TreeItem.svelte'
    import type { TreeNode } from "./object-tree";

    type Props = {
        treeNode: TreeNode;
    };

    let { treeNode }: Props = $props();
</script>

<tree-node>
    <p>{treeNode.name}</p>
    {#if treeNode.children}
        <div class="pl-4">
            {#each treeNode.children as node}
                <TreeItem treeNode={node} />
            {/each}
        </div>
    {/if}
</tree-node>
