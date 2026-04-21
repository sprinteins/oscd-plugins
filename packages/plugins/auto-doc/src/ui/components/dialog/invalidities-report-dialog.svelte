<script lang="ts">
import Button, { Label } from '@smui/button'
import Dialog, { Title, Content, Actions } from '@smui/dialog'
import type { InvalditiesReport } from '@/stores'

interface Props {
	isOpen?: boolean
	reports?: InvalditiesReport[]
	onConfirm?: () => void
}

let {
	isOpen = $bindable(false),
	reports = [],
	onConfirm = undefined
}: Props = $props()

function groupReports(reports: InvalditiesReport[]) {
	const named = new Map<string, Map<string, number>>()
	const unnamed = new Map<string, number>()

	for (const r of reports) {
		if (!r.IEDName.trim()) {
			unnamed.set(r.invalidities, (unnamed.get(r.invalidities) ?? 0) + 1)
		} else {
			if (!named.has(r.IEDName)) named.set(r.IEDName, new Map())
			const msgs = named.get(r.IEDName)
			if (msgs) msgs.set(r.invalidities, (msgs.get(r.invalidities) ?? 0) + 1)
		}
	}

	return { named, unnamed }
}

function formatMsg(msg: string, count: number) {
	return count > 1 ? `  (${count}x) ${msg}` : `  ${msg}`
}

function reportsToText(reports: InvalditiesReport[]): string {
	const { named, unnamed } = groupReports(reports)
	const sections: string[] = []

	for (const [ied, msgs] of named) {
		sections.push(
			`${ied}:\n${[...msgs.entries()].map(([msg, count]) => formatMsg(msg, count)).join('\n')}`,
		)
	}

	if (unnamed.size > 0) {
		sections.push(
			`(no IED name):\n${[...unnamed.entries()].map(([msg, count]) => formatMsg(msg, count)).join('\n')}`,
		)
	}

	return sections.join('\n\n')
}

let reportsAsText = $derived(reportsToText(reports))
</script>

<Dialog
    bind:open={isOpen}
    aria-labelledby="invalidities-report-dialog-title"
    aria-describedby="invalidities-report-dialog-content"
>
    <Title id="invalidities-report-dialog-title">Signal List Warnings</Title>
    <Content id="invalidities-report-dialog-content">
        <p>The following issues were found while processing the signal list:</p>
        <textarea
            readonly
            class="reports-textarea"
            value={reportsAsText}
            aria-label="Invalidities report — select all and copy with Cmd+A / Ctrl+A"
        ></textarea>
        <p class="copy-hint">Select all with Cmd+A (or Ctrl+A) to copy.</p>
    </Content>
    <Actions>
        {#if onConfirm}
            <Button action="close">
                <Label>Cancel</Label>
            </Button>
            <Button
                action="close"
                onclick={onConfirm}
            >
                <Label>Generate anyway</Label>
            </Button>
        {:else}
            <Button action="close">
                <Label>Close</Label>
            </Button>
        {/if}
    </Actions>
</Dialog>

<style>
    .reports-textarea {
        width: 100%;
        min-height: 12rem;
        max-height: 20rem;
        resize: vertical;
        font-family: monospace;
        font-size: 0.85rem;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: #f9f9f9;
        box-sizing: border-box;
        margin-top: 0.5rem;
    }

    .copy-hint {
        margin-top: 0.25rem;
        font-size: 0.75rem;
        color: #666;
    }
</style>
