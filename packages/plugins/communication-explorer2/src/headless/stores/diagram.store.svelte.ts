// STORES
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// SERVICES
import { xmlService } from '@/headless/services'

class UseDiagramStore {
	//====== CONSTANTS ======//

	//====== STATES ======//
	iedCommunicationInfos = $derived.by(() => {
		if (`${pluginGlobalStore.editCount}`) return xmlService.getIEDCommunicationInfos();
	});

	bays = $derived.by(() => {
		if (`${pluginGlobalStore.editCount}`) return xmlService.getBays();
	});

	//====== METHODS ======//


}

export const diagramStore = new UseDiagramStore()
