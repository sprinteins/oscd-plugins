<script lang="ts">
import { InputGroup, DropdownMenuWorkaround, Badge } from '@oscd-plugins/core-ui-svelte'
import Search from '@lucide/svelte/icons/search'
import ChevronDown from '@lucide/svelte/icons/chevron-down'
import type { SearchType } from '@/headless/scl';

let {
  searchTerm = $bindable(''),
  searchType = $bindable<SearchType>('IED'),
  disabled = false
}: { searchTerm: string; searchType?: SearchType; disabled?: boolean } = $props()

const searchTypeActions = [
  { label: 'IED', disabled: false, callback: () => { searchType = 'IED' } },
  { label: 'AccessPoint', disabled: false, callback: () => { searchType = 'AccessPoint' } },
  { label: 'LDevice', disabled: false, callback: () => { searchType = 'LDevice' } },
  { label: 'LNode', disabled: false, callback: () => { searchType = 'LNode' } }
]
</script>

<InputGroup.Root>
  <InputGroup.Addon>
    <Search class="size-4" />
  </InputGroup.Addon>
  <InputGroup.Input
    bind:value={searchTerm}
    placeholder="Search..."
    {disabled}
  />
  <InputGroup.Addon align="inline-end">
    <Badge.Root variant="secondary" class="text-xs">
      {searchType}
    </Badge.Root>
    <DropdownMenuWorkaround
      actions={searchTypeActions}
      size="sm"
      icon={ChevronDown}
    />
  </InputGroup.Addon>
</InputGroup.Root>
