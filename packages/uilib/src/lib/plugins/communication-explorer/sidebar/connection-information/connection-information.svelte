<script lang="ts">
    import type { IEDConnectionWithCustomValues } from "../../../../components/diagram"

    export let ConnectionSelection: IEDConnectionWithCustomValues
</script>

<table>
    <tr>
        <td>ID:</td>
        <td>{ConnectionSelection.id}</td>
    </tr>
    <tr>
        <td>Sources:</td>
        <td>{ConnectionSelection.sourceIED?.iedName}</td>
    </tr>
    <tr>
        <td>Targets:</td>
        <td>{ConnectionSelection.targetIED?.iedName}</td>
    </tr>
    <tr>
        <td>ServiceType:</td>
        <td>{ConnectionSelection.messageType}</td>
    </tr>
    <tr>
        <td>ServiceType Label:</td>
        <td>{ConnectionSelection.messageTypeLabel}</td>
    </tr>
</table>
