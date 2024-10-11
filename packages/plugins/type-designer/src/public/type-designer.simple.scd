<?xml version="1.0" encoding="UTF-8"?>
<SCL version="2007" revision="B" release="4" xmlns:td="http://localhost:53515/type-designer.schema.xsd">
<Header id="Type Designer Plugin simple test file"/>
<DataTypeTemplates>
	<Private name="Type designer Plugin">
		<td:SubstationTypesRoot>
			<td:SubstationType id="substation-type-1" name="Substation Type One" desc="Substation Type One description">
				<td:VoltageLevelTypeRef to="voltage-level-type-1" />
			</td:SubstationType>
		</td:SubstationTypesRoot>

		<td:VoltageLevelTypesRoot>
			<td:VoltageLevelType id="voltage-level-type-1" name="Voltage Level Type One" desc="Voltage Level Type One description" voltage="" stages="" frequency="">
				<td:BayTypeRef to="bay-type-1" />
			</td:VoltageLevelType>
		</td:VoltageLevelTypesRoot>

		<td:BayTypesRoot>
			<td:BayType id="bay-type-1" name="Bay Type One" desc="Bay Type One description" type="">
				<td:IEDTypeRef to="ied-type-1" />
			</td:BayType>
		</td:BayTypesRoot>

		<td:IEDTypesRoot>	
			<td:IEDType id="ied-type-1" name="IED Type One" desc="IED Type One description" type="">
				<td:LogicalDeviceTypeRef to="ld-type-1" />
			</td:IEDType>
		</td:IEDTypesRoot>	

		<td:LogicalDeviceTypesRoot>
			<td:LogicalDeviceType id="ld-type-1" name="LD Type One" desc="LD Type One description" function="" stage="">
				<td:LogicalNodeTypeRef to="ln-type-1" />
			</td:LogicalDeviceType>
		<td:LogicalDeviceTypesRoot>

		<td:LogicalNodeTypesRoot>
			<td:LogicalNodeType id="ln-type-1" name="LN Type One" desc="LN Type One description"/>
		<td:LogicalNodeTypesRoot>
	</Private>
</DataTypeTemplates>
</SCL>