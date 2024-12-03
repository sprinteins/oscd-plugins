<script lang="ts">
// STORES
import iedStore from '../../stores/ied'
// UTILS
import { convertIEDNameToID } from '../../utils/formatters'

// stores
const { iedCommunicationInfosBySubNetworkBus } = iedStore

$: busNames =
	$iedCommunicationInfosBySubNetworkBus &&
	Array.from($iedCommunicationInfosBySubNetworkBus.keys())
</script>

{#if $iedCommunicationInfosBySubNetworkBus }
	<div class="bay-list">
			<h2>List with all Buses</h2>
			<ul>
					{#each busNames as bayName}
							{@const busIeds = $iedCommunicationInfosBySubNetworkBus.get(bayName)}
							<li>
									<h3>{bayName}</h3>
									<ul>
											{#if busIeds != undefined}
													{#each busIeds as ied}
															{@const iedLink = convertIEDNameToID(
																	ied.iedName,
																	true
															)}
															<li>
																	<a href={iedLink}>{ied.iedName}</a>
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
