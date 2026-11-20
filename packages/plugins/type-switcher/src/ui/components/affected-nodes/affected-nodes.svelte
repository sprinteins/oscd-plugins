<script lang="ts">
import { type Item, List } from '../list'

interface Props {
	// Input
	items: Item[] // Internal
}

let { items }: Props = $props()
</script>

<div class="affected-nodes">
	<List
		{items}
		emptyText="Select a source type to inspect its affected nodes."
	/>
</div>

<style>
  .affected-nodes {
    overflow: auto;

    margin-top: -1rem;
    margin-left: 1rem;
  }
  :global(.affected-nodes .affected-nodes-names) {
    margin-left: -1.5rem;
  }
  :global(.affected-nodes .list-typeswitcher-affected-nodes) {
    margin-top: -1.5rem;
  }
  :global(.affected-nodes .secondary-text-affected-nodes) {
    margin-top: -2.25rem;
  }
  :global(.affected-nodes .item-typeswitcher-affected-nodes) {
    margin-bottom: -2.25rem;
    padding-left: 0.75rem;
  }
</style>
