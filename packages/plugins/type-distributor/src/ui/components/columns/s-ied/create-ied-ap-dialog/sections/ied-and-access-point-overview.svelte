<script lang="ts">
  import { IedChip } from "../ui";
  import PendingAccessPoints from "../ui/pending-access-points.svelte";

  let {
    lockedIedName,
    lockedIsNewIed,
    pendingAccessPoints,
    removeAccessPoint
  }: {
    lockedIedName: string
    lockedIsNewIed: boolean
    pendingAccessPoints: { name: string; description: string }[]
    removeAccessPoint: (name: string) => void
  } = $props()
</script>

<section class="pb-4">
  <header class="pb-4 pt-2">
    <h1 class="text-xl font-bold">IED and Access Points</h1>
  </header>
  <div class="flex flex-col gap-y-2">
    <IedChip name={lockedIedName} isNew={lockedIsNewIed} />
    <PendingAccessPoints
      accessPoints={pendingAccessPoints}
      onRemove={removeAccessPoint}
    />
  </div>
</section>
