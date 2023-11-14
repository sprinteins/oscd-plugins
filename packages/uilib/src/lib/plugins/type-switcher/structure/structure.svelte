<script lang="ts">
  import { type Item, List } from "../../../components/list"

  // Input
  export let items: Item[]
</script>

<structure>
  <List {items} />
</structure>

<style lang="scss">
  structure {
    overflow: auto;
    margin-top: -1rem;
    margin-left: 1rem;
  }
  :global(structure .secondary-text-structure) {
    margin-top: -2.25rem;
  }
  :global(structure .list-typeswitcher-structure) {
    margin-top: -1.5rem;
  }
  :global(structure .item-typeswitcher-structure) {
    margin-bottom: -2.25rem;
    padding-left: 0.75rem;
  }
</style>
