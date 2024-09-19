import type { SCDQueries } from "../scd/scd-query"

/** 
 * The name is temporary, rename it if you have a better one
 * UC = Use Case
 */
export class UCTypeDesigner {

	constructor(
		private readonly scdQueries: SCDQueries,
	){}

	public findAllLogicalDevices(){
		return this.scdQueries.searchLDeviceType();
	}

	public findAllBays(){
		return this.scdQueries.searchBayType();
	}

	public findAllIEDs(){
		return this.scdQueries.searchIEDType();
	}

	public findAllVoltageLevels(){
		return this.scdQueries.searchVoltageLevelType();
	}

	public findAllSubstations(){
		return this.scdQueries.searchSubstationType();
	}

}
