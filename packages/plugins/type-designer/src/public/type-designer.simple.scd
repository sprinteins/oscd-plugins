<?xml version="1.0" encoding="UTF-8"?>
<SCL version="2007" revision="B" release="4" xmlns:td="http://localhost:53515/type-designer.schema.xsd">
<Header id="Type Designer Plugin simple test file"/>
<DataTypeTemplates>
	<Private type="type-designer-plugin">
			<td:SubstationType id="substation-type-1" name="Substation Type 1" desc="Substation Type 1 description">
				<td:VoltageLevelTypeRef type="voltage-level-type-1" />
			</td:SubstationType>
			<td:SubstationType id="substation-type-2" name="Substation Type 2" desc="Substation Type 2 description">
				<td:VoltageLevelTypeRef type="voltage-level-type-2" />
			</td:SubstationType>

			<td:VoltageLevelType id="voltage-level-type-1" name="Voltage Level Type 1" desc="Voltage Level Type 1 description" voltage="" stages="" frequency="">
				<td:BayTypeRef type="bay-type-3" />
				<td:BayTypeRef type="bay-type-2" />
			</td:VoltageLevelType>	
			<td:VoltageLevelType id="voltage-level-type-2" name="Voltage Level Type 2" desc="Voltage Level Type 2 description" voltage="" stages="" frequency="">
				<td:BayTypeRef type="bay-type-1" />
				<td:BayTypeRef type="bay-type-3" />
			</td:VoltageLevelType>

			<td:BayType id="bay-type-1" name="Bay Type 1" desc="Bay Type 1 description" type="">
				<td:IEDTypeRef type="ied-type-1" />
				<td:IEDTypeRef type="ied-type-2" />
				<td:IEDTypeRef type="ied-type-3" />
			</td:BayType>
			<td:BayType id="bay-type-2" name="Bay Type 2" desc="Bay Type 2 description" type="">
				<td:IEDTypeRef type="ied-type-3" />
			</td:BayType>
			<td:BayType id="bay-type-3" name="Bay Type 3" desc="Bay Type 3 description" type="">
				<td:IEDTypeRef type="ied-type-3" />
				<td:IEDTypeRef type="ied-type-2" />
			</td:BayType>

			<td:IEDType id="ied-type-1" name="IED Type 1" desc="IED Type 1 description" type="">
				<td:LDeviceTypeRef type="ld-type-2" />
				<td:LDeviceTypeRef type="ld-type-3" />
			</td:IEDType>
			<td:IEDType id="ied-type-2" name="IED Type 2" desc="IED Type 2 description" type="">
				<td:LDeviceTypeRef type="ld-type-1" />
				<td:LDeviceTypeRef type="ld-type-2" />
			</td:IEDType>
			<td:IEDType id="ied-type-3" name="IED Type 3" desc="IED Type 3 description" type="">
				<td:LDeviceTypeRef type="ld-type-2" />
			</td:IEDType>
			<td:IEDType id="ied-type-4" name="IED Type 4" desc="IED Type 4 description" type="">
				<td:LDeviceTypeRef type="ld-type-1" />
				<td:LDeviceTypeRef type="ld-type-2" />
				<td:LDeviceTypeRef type="ld-type-3" />
			</td:IEDType>

			<td:LDeviceType id="ld-type-1" name="LD Type 1" desc="LD Type 1 description" function="" stage="">
				<td:LNodeTypeRef type="ln-type-1" />
				<td:LNodeTypeRef type="ln-type-2" />
				<td:LNodeTypeRef type="ln-type-3" />
				<td:LNodeTypeRef type="ln-type-8" />
			</td:LDeviceType>
			<td:LDeviceType id="ld-type-2" name="LD Type 2" desc="LD Type 2 description" function="" stage="">
				<td:LNodeTypeRef type="ln-type-5" />
				<td:LNodeTypeRef type="ln-type-6" />
				<td:LNodeTypeRef type="ln-type-7" />
			</td:LDeviceType>
			<td:LDeviceType id="ld-type-3" name="LD Type 3" desc="LD Type 3 description" function="" stage="">
				<td:LNodeTypeRef type="ln-type-2" />
				<td:LNodeTypeRef type="ln-type-3" />
				<td:LNodeTypeRef type="ln-type-4" />
				<td:LNodeTypeRef type="ln-type-9" />
			</td:LDeviceType>

	</Private>
	<LNodeType id="ln-type-1" name="LN Type 1" desc="LN Type 1 description" lnClass=""/>
	<LNodeType id="ln-type-2" name="LN Type 2" desc="LN Type 2 description" lnClass=""/>
	<LNodeType id="ln-type-3" name="LN Type 3" desc="LN Type 3 description" lnClass=""/>
	<LNodeType id="ln-type-4" name="LN Type 4" desc="LN Type 4 description" lnClass=""/>
	<LNodeType id="ln-type-5" name="LN Type 5" desc="LN Type 5 description" lnClass=""/>
	<LNodeType id="ln-type-6" name="LN Type 6" desc="LN Type 6 description" lnClass=""/>
	<LNodeType id="ln-type-7" name="LN Type 7" desc="LN Type 7 description" lnClass=""/>
	<LNodeType id="ln-type-8" name="LN Type 8" desc="LN Type 8 description" lnClass=""/>
	<LNodeType id="ln-type-9" name="LN Type 9" desc="LN Type 9 description" lnClass=""/>
	<LNodeType id="ln-type-10" name="LN Type 10" desc="LN Type 10 description" lnClass=""/>
	
</DataTypeTemplates>
</SCL>