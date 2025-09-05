<script lang="ts">
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion'
</script>

<div>
	<Accordion>
		<Panel open="true">
			<Header>SCD Assumptions</Header>
			<Content>
				<div>
					We make certain assumptions how connections between IEDs and open ports are represented in the SCD. If you do not see any IEDs in the diagram, please verify that the SCD conforms to the following rules.
				</div>
				<ul>
					<li>A PhysConn element represents an open port if its child cable element has the value "0".</li>
					<li>Two PhysConn elements represent a connection between their parent IEDs if their children cable elements have the same value and there are no other PhysConn with this cable element. The value is considered to be the cable name.</li>
				</ul>
			</Content>
		</Panel>
	</Accordion>
</div>
