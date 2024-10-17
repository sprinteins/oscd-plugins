## Proposals for Type Designer data storing

* Always append regular element with Type, i.e. for `<IED>` use `<IEDType>` and for `<Bay>` use `<BayType>`
* Store new types under a `<Private>` field with a suitable identifier in `<DataTypeTemplates>`

```
<SCL>
	...
	<DataTypeTemplates>
		<Private name="TBD">
			<BayType description="BusBar">
				...
			</BayType>
			<IEDType description="Relay">
				...
			</IEDTYpe>
		</Private>
	</DataTypeTemplates>
</SCL>
```

* If a parent element references children by type, it should be done by type reference like it is done in the templates plugin for logical node types down to DO and DA elements

```
<DataTypeTemplates>
	<Private name="TBD">
		<BayType description="BusBar">
			<IED name="Protection A" type="IED_protection_type" />
			<IED name="Protection B" type="IED_protection_type" />
			<IED name="Measurement B" type="IED_measurement_type" />
		<BayType>
		<IEDType id="IED_protection_type">
			...
		</IEDType>
		<IEDType id="IED_measurement_type">
			...
		</IEDType>
	</Private>
</DataTypeTemplates>
```
