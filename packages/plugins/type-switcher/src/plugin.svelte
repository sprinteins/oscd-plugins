<svelte:options
	customElement={{
		props: {
			doc: { reflect: true, type: "Object" },
			docName: { reflect: true, type: "String" },
			editCount: { reflect: true, type: "Number" },
			locale: { reflect: true, type: "String" },
			pluginType: { reflect: true, type: "String" },
			isCustomInstance: { reflect: true, type: "Boolean" },
		},
	}}
/>

<script lang="ts">
// PACKAGE
import jsonPackage from '../package.json'
// CORE
import { initPlugin, initSsdTemplate } from '@oscd-plugins/core-ui-svelte'
// TYPES
import type { Utils } from '@oscd-plugins/core-api/plugin/v1'
import TypeSwitcher from './ui/components/views/type-switcher.svelte'
import { LegacyTheme, MaterialTheme } from '@oscd-plugins/ui'

// props
const {
	doc,
	docName,
	editCount,
	isCustomInstance
}: Utils.PluginCustomComponentsProps = $props()
</script>

<main
	use:initPlugin={{
		getDoc: () => doc,
		getDocName: () => docName,
		getEditCount: () => editCount,
		getIsCustomInstance: () => isCustomInstance,
		getHost: () => $host() || window,
		theme: "legacy-oscd-instance",
		definition: {
			edition: "ed2Rev1",
		},
	}}
	data-plugin-name={jsonPackage.name}
	data-plugin-version={jsonPackage.version}
>
<MaterialTheme pluginType="editor">
	<LegacyTheme>
		{#if doc}
			{#key doc}
				<TypeSwitcher doc={doc?.documentElement} />
			{/key}
		{/if}
	</LegacyTheme>
</MaterialTheme>
</main>

<!-- <style>
	main {
		/* Missing Styles */
		--color-white: #f9f7f1;
		--color-beige-3: #f3ecda;
		--color-beige-5: #fdfbf2;
		--color-grey-dark: #4d5d63;
		--color-cyan: #2aa198;
		--color-cyan-30-pc-opacity: #2aa1984d;
		--color-green: #288409;
		--color-green-light: #9bff00;
		--color-pink: #c73c61;
		--color-pink-30-pc-opacity: #c73c614d;
		--color-pink-light: #ff40a7;
		--color-grey-dark: #4d5d63;
		--color-torques-30-opacity: #007d804d;
		--color-blue-1-light: #00c0f9;
		--color-blue-1: #3253a8;
		--color-grey-dark-70pc-opacity: #4d5d63b3;

		--font-color: var(--color-grey-dark);

		--color-category-selector: var(--color-beige-5);
		--mdc-theme-surface: var(--color-beige-3);

		--mdc-typography-headline5-font-weight: 400;

		--mdc-typography-button-font-weight: 700;

		--color-accent: var(--color-cyan);

		--font-size-small: 8px;

		--color-select-dropdown: #fffff4;
		--color-select-dropdown-transparent: #fffff480;

		--color-message-goose: var(--color-green);
		--color-message-highlight-goose: var(--color-green-light);
		--color-message-disabled-goose: var(--color-green-30pc-opacity);
		--color-message-mms: var(--color-blue-1);
		--color-message-highlight-mms: var(--color-blue-1-light);
		--color-message-disabled-mms: var(--color-torques-30-opacity);
		--color-message-sampledvalues: var(--color-pink);
		--color-message-highlight-sampledvalues: var(--color-pink-light);
		--color-message-disabled-samplevalues: var(--color-pink-30-pc-opacity);
		--color-message-unknown: var(--color-black);
	}

	:root,
	:host {
		--font-size: 12px;
		--letter-spacing: 0.2px;
		--font-family: "Roboto", sans-serif;
		font-family: var(--font-family);
		letter-spacing: var(--letter-spacing);
		font-size: var(--font-size);
	}
</style> -->
