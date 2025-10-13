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
	import jsonPackage from "../package.json";
	// CORE
	import { initPlugin, initSsdTemplate } from "@oscd-plugins/core-ui-svelte";
	// TYPES
	import type { Utils } from "@oscd-plugins/core-api/plugin/v1";
	import TypeSwitcher from "./ui/components/views/type-switcher.svelte";

	// props
	const {
		doc,
		docName,
		editCount,
		isCustomInstance,
	}: Utils.PluginCustomComponentsProps = $props();
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
	{#if doc}
		{#key doc}
			<TypeSwitcher doc={doc?.documentElement} />
		{/key}
	{/if}
</main>

<style>
	main {
		/* Missing Styles */
		--color-white: #f9f7f1;
		--color-beige-3: #f3ecda;
		--color-beige-5: #fdfbf2;
		--color-grey-dark: #4d5d63;
		--color-cyan: #2aa198;

		--font-color: var(--color-grey-dark);

		--color-category-selector: var(--color-beige-5);
		--mdc-theme-surface: var(--color-beige-3);

		--mdc-typography-headline5-font-weight: 400;

		--color-accent: var(--color-cyan);

		--font-size-small: 8px;

		--color-select-dropdown: #fffff4;
		--color-select-dropdown-transparent: #fffff480;
	}

	:host {
		font-size: 12px;
	}
</style>
