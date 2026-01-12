<script lang="ts">
import Button, { Label } from '@smui/button'
import Dialog, { Title, Content, Actions } from '@smui/dialog'

interface Props {
	isOpen?: boolean
}

let { isOpen = $bindable(false) }: Props = $props()
</script>

<Dialog
    bind:open={isOpen}
    aria-labelledby="ied-pattern-help-dialog-title"
    aria-describedby="ied-pattern-help-dialog-content"
>
    <Title id="ied-pattern-help-dialog-title">IED Pattern Help</Title>
    <Content id="ied-pattern-help-dialog-content">
        Filter IEDs using patterns or XPath expressions. Leave empty to match
        all IEDs.<br /><br />

        <strong>Simple Patterns:</strong>
        <ul>
            <li>
                <code>*</code> or empty: Match all IEDs
            </li>
            <li>
                <code>*PROT*</code>: Match IEDs containing "PROT"
            </li>
            <li>
                <code>NWHEI_C1_Q01_MU1</code>: Exact match for IED named
                "NWHEI_C1_Q01_MU1"
            </li>
        </ul>

        <br />
        <strong>XPath Syntax:</strong>
        <ul>
            <li>
                <code>//default:IED[@name='IED1']</code>: Exact match
            </li>
            <li>
                <code>//default:IED[contains(@name,'BAY')]</code>: Contains
                "BAY"
            </li>
            <li>
                <code>//default:IED[starts-with(@name,'CTRL')]</code>: Starts
                with "CTRL"
            </li>
        </ul>

        <br />
        <strong>Examples:</strong>
        <ul>
            <li>
                All protection IEDs: <br />
                <code>*PROT*</code> or
                <code>//default:IED[contains(@name,'PROT')]</code>
            </li>
            <li>
                All merging units: <br />
                <code>*MU*</code> or
                <code>//default:IED[contains(@name,'MU')]</code>
            </li>
            <li>
                Specific bay controller: <br />
                <code>CTRL_BAY1</code>
            </li>
        </ul>
        <Actions>
            <Button>
                <Label>Got it</Label>
            </Button>
        </Actions>
    </Content>
</Dialog>

<style>
    code {
        background: #f2ebde;
        color: #515f7a;

        font-size: 14px;

        padding: 4px;
        border-radius: 4px;
    }

    ul {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    strong {
        color: #333;
    }
</style>
