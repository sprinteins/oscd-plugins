<script lang="ts">
import Button, { Label } from '@smui/button'
import Dialog, { Title, Content, Actions } from '@smui/dialog'
import type { InvalditiesReport } from '@/stores'

interface Props {
	isOpen?: boolean
	reports?: InvalditiesReport[]
}

let {
	isOpen = $bindable(false),
	reports = []
}: Props = $props()
</script>

<Dialog
    bind:open={isOpen}
    aria-labelledby="invalidities-report-dialog-title"
    aria-describedby="invalidities-report-dialog-content"
>
    <Title id="invalidities-report-dialog-title">Signal List Warnings</Title>
    <Content id="invalidities-report-dialog-content">
        <p>The following issues were found while processing the signal list:</p>
        <ul class="reports-list">
            {#each reports as report}
                <li>
                    <strong>{report.IEDName}</strong>: {report.invalidities}
                </li>
            {/each}
        </ul>
    </Content>
    <Actions>
        <Button action="close">
            <Label>Close</Label>
        </Button>
    </Actions>
</Dialog>

<style>
    .reports-list {
        margin-top: 0.5rem;
        padding-left: 1.25rem;
        max-height: 20rem;
        overflow-y: auto;
    }

    .reports-list li {
        margin-bottom: 0.5rem;
    }
</style>
