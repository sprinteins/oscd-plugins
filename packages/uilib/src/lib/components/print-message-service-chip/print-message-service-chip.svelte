<script lang="ts">
	import { Button } from "../button"
	import { Icons, openSCDIcons } from "../icons"

	export let type = "unknown"
	$: serviceType = type.toLocaleLowerCase()

	const variantLabel: { [key in typeof serviceType]: string } = {
		goose:         "GOOSE",
		mms:           "MMS",
		reportcontrol: "MMS",
		sampledvalues: "SMV",
		smv:           "SMV",
	}

	const variantClass: { [key in typeof serviceType]: string } = {
		goose:         "goose",
		mms:           "mms",
		reportcontrol: "mms",
		sampledvalues: "sampledvalues",
		smv:           "sampledvalues",
	}

	const variantIconName: { [key in typeof serviceType]: keyof typeof openSCDIcons } =
		{
			goose:         "tscdGooseIcon",
			mms:           "tscdMmsIcon",
			reportcontrol: "tscdMmsIcon",
			sampledvalues: "tscdSvIcon",
			smv:           "tscdSvIcon",
		}
</script>

<div class="print-message-type-chip">
	<div class="chip-size">
		<Button
			componentClasses={"tscd-button tscd-button-service-type-" +
				variantClass[serviceType]}
		>
			<div class="tscd-button-chip">
				<Icons name={variantIconName[serviceType]} size={"small"} />
				<span>{variantLabel[serviceType]}</span>
			</div>
		</Button>
	</div>
</div>

<style lang="scss">
	.print-message-type-chip {
		$size: 0.8rem;
		$iconSize: 1.5rem;
		.chip-size {
			span {
				font-size: $size;
				display: block;
			}
			:global(button.tscd-button) {
				padding: 0.1rem 0.3rem;
			}
			:global(div.icon-size svg) {
				height: $iconSize;
				width: $iconSize;
			}
			:global(div.icon-size) {
				height: $iconSize;
				width: $iconSize;
			}
		}

		div.tscd-button-chip {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			gap: 0.3rem;
		}

		:global(button.tscd-button) {
			print-color-adjust: exact;
			-webkit-print-color-adjust: exact;
			border: 2px solid var(--color-black);
			background-color: var(--color-paper-white) !important;
			color: var(--color-black) !important;
		}
		:global(button.mdc-button--raised) {
			box-shadow: none;
		}
		:global(button.tscd-button-service-type-goose) {
			border-color: var(--color-message-goose) !important;
			color: var(--color-message-goose) !important;
		}
		:global(button.tscd-button-service-type-mms) {
			border-color: var(--color-message-mms) !important;
			color: var(--color-message-mms) !important;
		}
		:global(button.tscd-button-service-type-sampledvalues) {
			border-color: var(--color-message-sampledvalues) !important;
			color: var(--color-message-sampledvalues) !important;
		}
		:global(button.tscd-button-service-type-undefined) {
			border-color: var(--color-black) !important;
			color: var(--color-black) !important;
		}
	}
</style>
