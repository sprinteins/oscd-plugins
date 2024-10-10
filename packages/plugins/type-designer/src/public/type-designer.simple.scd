<?xml version="1.0" encoding="UTF-8"?>
<SCL version="2007" revision="B" release="4" xmlns:td="http://localhost:53515/type-designer.template.xslt">
<Header id="test"/>
<DataTypeTemplates>
	<Private>
		<td:SubstationTypesRoot>
			<td:SubstationType>
				<td:VoltageLevelTypeRef />
			</td:SubstationType>
		</td:SubstationTypesRoot>

		<td:VoltageLevelTypesRoot>
			<td:VoltageLevelType>
				<td:BayTypeRef />
			</td:VoltageLevelType>
		</td:VoltageLevelTypesRoot>

		<td:BayTypesRoot>
			<td:BayType>
				<td:IEDTypeRef />
			</td:BayType>
		</td:BayTypesRoot>

		<td:IEDTypesRoot>	
			<td:IEDType>
				<td:LogicalDeviceTypeRef />
			</td:IEDType>
		</td:IEDTypesRoot>	

		<td:LogicalDeviceTypesRoot>
			<td:LogicalDeviceType>
				<td:LogicalNodeTypeRef />
			</td:LogicalDeviceType>
		<td:LogicalDeviceTypesRoot>

		<td:LogicalNodeTypesRoot>
			<td:LogicalNodeType />
		<td:LogicalNodeTypesRoot>

	</Private>
</DataTypeTemplates>
</SCL>