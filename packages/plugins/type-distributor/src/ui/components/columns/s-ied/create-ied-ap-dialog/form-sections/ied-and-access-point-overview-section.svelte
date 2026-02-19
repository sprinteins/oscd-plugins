<script lang="ts">
import type { AccessPointData, IedData } from '../form-helpers'
import { IedChip, PendingAccessPoints } from '../form-elements'

let {
	ied,
	accessPoints,
	removeAccessPoint
}: {
	ied: IedData
	accessPoints: AccessPointData[]
	removeAccessPoint: (name: string) => void
} = $props()
</script>

<section class="pb-4">
  <header class="pb-4 pt-2">
    <h1 class="text-xl font-bold">IED and Access Points</h1>
  </header>
  <div class="flex flex-col gap-y-2">
    <IedChip {ied} />
    <PendingAccessPoints {accessPoints} onRemove={removeAccessPoint} />
  </div>
</section>
