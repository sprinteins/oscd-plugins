import type { TreeNode } from "./types.object-tree";

export function getOpenItems(nodes: TreeNode[]): string[] {
    return nodes.reduce<string[]>(
        (acc, node) => [
            ...acc,
            ...(node.isOpen ? [node.name] : []),
            ...(node.children ? getOpenItems(node.children) : []),
        ],
        [],
    );
}