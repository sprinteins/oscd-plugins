<script lang="ts">
    import { Accordion } from "@oscd-plugins/core-ui-svelte";
    import TreeItem from "./TreeItem.svelte";
    import type { TreeNode } from "./object-tree";

    type Props = {
        treeNode: TreeNode;
    };

    let { treeNode }: Props = $props();
</script>

<tree-node>
    <Accordion.Root type="multiple">
        <Accordion.Item value={treeNode.name} class="px-2">
            {#if treeNode.children}
                <Accordion.Trigger
                    class="flex flex-1 w-full items-center py-2 hover:no-underline"
                >
                    <p>{treeNode.name}</p>
                </Accordion.Trigger>
                <Accordion.Content class="ml-4 border-l">
                    <div>
                        {#each treeNode.children as node}
                            <TreeItem treeNode={node} />
                        {/each}
                    </div>
                </Accordion.Content>
            {:else}
                <p
                    class="ml-5 flex text-left items-center py-2 cursor-pointer before:right-1"
                >
                    {treeNode.name}
                </p>
            {/if}
        </Accordion.Item>
    </Accordion.Root>
</tree-node>
