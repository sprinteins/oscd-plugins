<script lang="ts">
    import Example from "../internal/example/example.svelte"
    import type { Item } from "./item"
    import List from "./list.svelte"

    let items: Item[] = [
    	{ icon: "dAIcon", primaryText: "hallo", secondaryText: "wie gehts" },
    ]
</script>

<h1>List Component</h1>

<Example name="list-item">
    <List {items} />
</Example>
