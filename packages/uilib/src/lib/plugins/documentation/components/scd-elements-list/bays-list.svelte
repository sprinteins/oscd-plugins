<script lang="ts">
import PrintIEDs from './ieds-list.svelte'
// STORES
import iedStore from '../../stores/ied'
// UTILS
import { calcPublished } from '../../utils/mappers'

// stores
const { iedCommunicationInfosByBay } = iedStore

$: bayNames =
	$iedCommunicationInfosByBay &&
	Array.from($iedCommunicationInfosByBay.keys())
</script>

{#if $iedCommunicationInfosByBay}
	<div class="bay-list">
			<h2>List with all Bays</h2>
			<ul>
					{#each bayNames as bayName}
							{@const bayIeds = $iedCommunicationInfosByBay.get(bayName)}
							<li>
									<h3>{bayName}</h3>
									<ul>
											{#if bayIeds != undefined}
													{#each bayIeds as ied}
															{@const publishedServiceTypes = calcPublished(
																	ied.iedName,
																	$iedCommunicationInfosByBay
															)}
															<li>
																	<PrintIEDs {ied} {publishedServiceTypes} />
															</li>
													{/each}
											{/if}
									</ul>
							</li>
					{/each}
			</ul>
	</div>
{/if}

<style lang="scss">
    :global(li) {
        font-size: 1rem;
    }
</style>
