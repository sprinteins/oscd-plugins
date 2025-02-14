import type { TreeNode } from "@/ui/components/object-tree/types.object-tree";

export function searchTree(tree: TreeNode[], searchTerm: string): TreeNode[] {
    return tree
        .map(node => {
            if (node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                return node;
            }
            if (node.children) {
                const filteredChildren = searchTree(node.children, searchTerm);
                if (filteredChildren.length > 0) {
                    return { ...node, children: filteredChildren };
                }
            }
            return null;
        })
        .filter(node => node !== null);
}
