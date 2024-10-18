import type { DataTypeTemplatesQueries } from "@oscd-plugins/core";

export class TypeDesignerService {

	constructor(
		private readonly scdQueries: DataTypeTemplatesQueries,
	){}

	public findAllLogicalDeviceElements(){
		return this.scdQueries.searchLDeviceElements();
	}
    public findAllIEDElements(){
		return this.scdQueries.searchIEDElements();
	}
    public findAllBayElements(){
		return this.scdQueries.searchBayElements();
	}
    public findAllSubstationElements(){
		return this.scdQueries.searchSubstationElements();
	}
    public findAllVoltageLevelElements(){
		return this.scdQueries.searchVoltageLevelElements();
	}

}