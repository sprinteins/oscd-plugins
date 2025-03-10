import { describe, expect, it } from "vitest";
import { searchTree } from "./utils";
import type { TreeNode } from "@/ui/components/object-tree/types.object-tree";
import { NODE_TYPE } from "../constants";

const objectTree: TreeNode[] = [
    {
        id: "1",
        name: "Device1",
        type: NODE_TYPE.logicalDevice,
        children: [
            {
                id: "2",
                name: "Node1",
                type: NODE_TYPE.logicalNode,
                children: [
                    { id: "3", name: "ObjectInstance1", type: NODE_TYPE.dataObjectInstance },
                    { id: "4", name: "ObjectInstance2", type: NODE_TYPE.dataObjectInstance },
                ],
            },
            {
                id: "5",
                name: "Node2",
                type: NODE_TYPE.logicalNode,
                children: [
                    { id: "6", name: "ObjectInstance3", type: NODE_TYPE.dataObjectInstance },
                ]
            },
        ],
    },
    {
        id: "7",
        name: "Device2",
        type: NODE_TYPE.logicalDevice,
        children: [
            {
                id: "8",
                name: "Node3", type: NODE_TYPE.logicalNode,
                children: [{ id: "9", name: "ObjectInstance4", type: NODE_TYPE.dataObjectInstance }]
            },
            {
                id: "10", name: "Node4", type: NODE_TYPE.logicalNode,
                children: [{ id: "11", name: "ObjectInstance5", type: NODE_TYPE.dataObjectInstance }]
            },
        ],
    },
];

describe("searchNestedArray", () => {
    it("should return nodes that match the search term", () => {
        const result = searchTree(objectTree, "ObjectInstance1");
        expect(result).toEqual([
            {
                id: "1",
                name: "Device1",
                type: NODE_TYPE.logicalDevice,
                children: [
                    {
                        id: "2",
                        name: "Node1",
                        type: NODE_TYPE.logicalNode,
                        children: [
                            {
                                id: "3",
                                name: "ObjectInstance1",
                                type: NODE_TYPE.dataObjectInstance,
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
                id: "1",
                name: "Device1",
                type: NODE_TYPE.logicalDevice,
                children: [
                    {
                        id: "2",
                        name: "Node1",
                        type: NODE_TYPE.logicalNode,
                        children: [
                            {
                                id: "3",
                                name: "ObjectInstance1",
                                type: NODE_TYPE.dataObjectInstance,
                            },
                            {
                                id: "4",
                                name: "ObjectInstance2",
                                type: NODE_TYPE.dataObjectInstance,
                            }
                        ]
                    },
                    {
                        id: "5",
                        name: "Node2",
                        type: NODE_TYPE.logicalNode,
                        children: [
                            {
                                id: "6",
                                name: "ObjectInstance3",
                                type: NODE_TYPE.dataObjectInstance,
                            },
                        ]
                    },
                ]
            },
            {
                id: "7",
                name: "Device2",
                type: NODE_TYPE.logicalDevice,
                children: [
                    {
                        id: "8",
                        name: "Node3",
                        type: NODE_TYPE.logicalNode,
                        children: [
                            {
                                id: "9",
                                name: "ObjectInstance4",
                                type: NODE_TYPE.dataObjectInstance,
                            }
                        ]
                    },
                    {
                        id: "10",
                        name: "Node4",
                        type: NODE_TYPE.logicalNode,
                        children: [
                            {
                                id: "11",
                                name: "ObjectInstance5",
                                type: NODE_TYPE.dataObjectInstance,
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
                id: "1",
                name: "Device1",
                type: NODE_TYPE.logicalDevice,
                children: [
                    {
                        id: "2",
                        name: "Node1",
                        type: NODE_TYPE.logicalNode,
                        children: [
                            {
                                id: "3",
                                name: "ObjectInstance1",
                                type: NODE_TYPE.dataObjectInstance,
                            },
                            {
                                id: "4",
                                name: "ObjectInstance2",
                                type: NODE_TYPE.dataObjectInstance,
                            }
                        ]
                    }
                ]
            }
        ]);
    });
});
