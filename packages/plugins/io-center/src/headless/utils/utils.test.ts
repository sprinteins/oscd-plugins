import { describe, expect, it } from "vitest";
import { searchTree } from "./utils";
import type { TreeNode } from "@/ui/components/object-tree/types.object-tree";

const objectTree: TreeNode[] = [
    {
        name: "Device1",
        children: [
            {
                name: "Node1",
                children: [
                    { name: "ObjectInstance1" },
                    { name: "ObjectInstance2" },
                ],
            },
            {
                name: "Node2",
                children: [
                    { name: "ObjectInstance3" },
                ]
            },
        ],
    },
    {
        name: "Device2",
        children: [
            { name: "Node3", children: [{ name: "ObjectInstance4" }] },
            { name: "Node4", children: [{ name: "ObjectInstance5" }] },
        ],
    },
];

describe("searchNestedArray", () => {
    it("should return nodes that match the search term", () => {
        const result = searchTree(objectTree, "ObjectInstance1");
        expect(result).toEqual([
            {
                name: "Device1",
                children: [
                    {
                        name: "Node1",
                        children: [
                            {
                                name: "ObjectInstance1",
                            }
                        ]
                    }
                ]
            }
        ]);
    });

    it("should return an empty array when no match is found", () => {
        const result = searchTree(objectTree, "NonExistentNode");
        expect(result).toEqual([]);
    });

    it("should return multiple nodes if multiple matches are found", () => {
        const result = searchTree(objectTree, "ObjectInstance");
        expect(result).toEqual([
            {
                name: "Device1",
                children: [
                    {
                        name: "Node1",
                        children: [
                            {
                                name: "ObjectInstance1",
                            },
                            {
                                name: "ObjectInstance2",
                            }
                        ]
                    },
                    {
                        name: "Node2",
                        children: [
                            { name: "ObjectInstance3" },
                        ]
                    },
                ]
            },
            {
                name: "Device2",
                children: [
                    {
                        name: "Node3",
                        children: [
                            {
                                name: "ObjectInstance4",
                            }
                        ]
                    },
                    {
                        name: "Node4",
                        children: [
                            {
                                name: "ObjectInstance5",
                            }
                        ]
                    }
                ]
            }
        ]);
    });

    it("should preserve hierarchy if searched node is in a middle level", () => {
        const result = searchTree(objectTree, "Node1");
        console.log(result)
        expect(result).toEqual([
            {
                name: "Device1",
                children: [
                    {
                        name: "Node1",
                        children: [
                            {
                                name: "ObjectInstance1",
                            },
                            {
                                name: "ObjectInstance2",
                            }
                        ]
                    }
                ]
            }
        ]);
    });
});
