<?xml version="1.0" encoding="UTF-8"?>
<SCL version="2007" revision="B" release="4" xmlns:td="http://localhost:53515/type-designer.schema.xsd">
<Header id="Type Designer Plugin simple test file"/>
<DataTypeTemplates>
	<Private type="type-designer-plugin">
			<td:SubstationType id="substation-type-1" name="Substation Type One" desc="Substation Type One description">
				<td:VoltageLevelTypeRef type="voltage-level-type-1" />
			</td:SubstationType>

			<td:VoltageLevelType id="voltage-level-type-1" name="Voltage Level Type One" desc="Voltage Level Type One description" voltage="" stages="" frequency="">
				<td:BayTypeRef type="bay-type-1" />
			</td:VoltageLevelType>


			<td:BayType id="bay-type-1" name="Bay Type One" desc="Bay Type One description" type="">
				<td:IEDTypeRef type="ied-type-1" />
			</td:BayType>

			<td:IEDType id="ied-type-1" name="IED Type One" desc="IED Type One description" type="">
				<td:LogicalDeviceTypeRef type="ld-type-1" />
			</td:IEDType>

			<td:LDeviceType id="ld-type-1" name="LD Type One" desc="LD Type One description" function="" stage="">
				<td:LNodeTypeRef type="ln-type-1" />
			</td:LDeviceType>
	</Private>
	<LNodeType id="ln-type-1" name="LN Type One" desc="LN Type One description" lnClass=""/>
</DataTypeTemplates>
</SCL>