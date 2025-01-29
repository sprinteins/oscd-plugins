<script lang="ts">
    import ObjectTree from "../object-tree/object-tree.svelte";

    const objectTree = [
        {
            name: "Device1",
            isOpen: true,
            children: [
                {
                    name: "Node1",
                    isOpen: true,
                    children: [
                        {
                            name: "ObjectInstance1",
                            isOpen: true,
                            children: [
                                { name: "Attribute1" },
                                { name: "Attribute2" },
                            ],
                        },
                        {
                            name: "ObjectInstance2",
                            isOpen: false,
                            children: [
                                { name: "Attribute3" },
                                { name: "Attribute4" },
                            ],
                        },
                    ],
                },
                {
                    name: "Node2",
                    isOpen: false,
                    children: [
                        {
                            name: "ObjectInstance3",
                            isOpen: false,
                            children: [
                                { name: "Attribute5" },
                                { name: "Attribute6" },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            name: "Device2",
            isOpen: true,
            children: [
                {
                    name: "Node3",
                    isOpen: true,
                    children: [
                        {
                            name: "ObjectInstance4",
                            isOpen: true,
                            children: [
                                { name: "Attribute7" },
                                { name: "Attribute8" },
                            ],
                        },
                    ],
                },
                {
                    name: "Node4",
                    isOpen: true,
                    children: [
                        {
                            name: "ObjectInstance5",
                            isOpen: true,
                            children: [
                                { name: "Attribute9" },
                                { name: "Attribute10" },
                            ],
                        },
                    ],
                },
            ],
        },
    ];
</script>

<div class="w-full">
    <ObjectTree {objectTree} />
</div>
