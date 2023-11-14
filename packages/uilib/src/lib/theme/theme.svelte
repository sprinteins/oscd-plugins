<script lang="ts">
	import "svelte-material-ui/bare.css"
	import "./fonts/google/roboto-mono-v13.css"
	import "./fonts/google/roboto-v27.css"
	import "@material/typography/mdc-typography.scss"
</script>

<tscd-theme>
	<slot />
</tscd-theme>

<style>
	:root,
	:host {
		--color-paper-white: #ffffff;
		--color-white: #f9f7f1;
		--color-white-dark: #f2f2f2;
		--color-yellow: #d9d800;
		--color-blue: #004552;
		--color-blue-dark: #14343e;
		--color-blue-1: #3253a8;
		--color-blue-1-light: #00c0f9;
		--color-blue-light: #e5ecee;
		--color-torques: #007d80;
		--color-torques-30-opacity: #007d804d;
		--color-green: #288409;
		--color-green-30pc-opacity: #2884094d;
		--color-green-light: #9bff00;
		--color-black: #000000;
		--color-beige-1: burlywood;
		--color-beige-2: blanchedalmond;
		--color-beige-3: #f3ecda;
		--color-beige-4: #fcf6e5;
		--color-beige-5: #fdfbf2;
		--color-pink: #c73c61;
		--color-pink-30-pc-opacity: #c73c614d;
		--color-pink-light: #ff40a7;
		--color-grey-1: #626262;
		--color-grey-2: #808080;

		--color-grey-3: #bdbdbd;
		--color-grey-dark: #4d5d63;
		--color-grey-dark-70pc-opacity: #4d5d63b3;

		--color-cyan: #2aa198;
		--color-cyan-30-pc-opacity: #2aa1984d;
		--color-select-dropdown: #fffff4;
		--color-select-dropdown-transparent: #fffff480;

		--color-border: #4d5d63;

		--color-filter-chips-background: #fdfbf2;

		--color-primary: var(--color-yellow);
		--color-secondary: var(--color-blue);
		--color-text: var(--color-white);
		--color-accent: var(--color-cyan);
		--color-text-disabled-1: rgba(0, 0, 0, 0.4);

		--border-radius: 5px;

		--font-family: "Roboto", sans-serif;
		--letter-spacing: 0.2px;
		--font-size: 12px;
		--font-size-small: 8px;
		--font-color: var(--color-grey-dark);

		--color-ied-focus: var(--color-beige-1);
		--color-ied-focus-hover: var(--color-beige-2);

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

		--color-category-selector: var(--color-beige-5);

		/* cb = colorblind */
		/* --color-message-goose-cb: #3BC40E; */
		/* --color-message-mms-cb: #00BCBF; */
		/* --color-message-sampledvalues-cb: #407CF5; */

		--sidebar-width: 400px;

		/* SMUI Variables */

		--mdc-theme-primary: var(--color-cyan);
		--mdc-typography-button-font-weight: bold;
		--mdc-theme-surface: var(--color-beige-3);
	}

	:root,
	:host {
		font-family: var(--font-family);
		letter-spacing: var(--letter-spacing);
		font-size: var(--font-size);
	}

	:global(input[type="checkbox"]) {
		accent-color: var(--color-accent);
		/* margin: 0; */
	}
</style>
