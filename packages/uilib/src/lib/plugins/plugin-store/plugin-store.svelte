<script lang="ts">
import Theme from '../../theme/theme.svelte'
//import { TemplateResult } from 'lit-element'
import { Checkbox } from '../../components/checkbox/'
import Textfield from '@smui/textfield'
import Button, { Group, GroupItem, Label, Icon } from '@smui/button'
import IconArrowDropDown from '../../components/icons/icon-arrow-drop-down.svelte'
import Snackbar from '@smui/snackbar'
export let root: Element

let htmlRoot: HTMLElement

type PluginKind = 'editor' | 'menu' | 'validator'
const menuPosition = ['top', 'middle', 'bottom'] as const
type MenuPosition = (typeof menuPosition)[number]

type Plugin = {
	name: string
	src: string
	icon?: string
	kind: PluginKind
	requireDoc?: boolean
	position?: MenuPosition
	installed: boolean
	official?: boolean
}

function storedPlugins(): Plugin[] {
	return <Plugin[]>(
		JSON.parse(
			localStorage.getItem('plugins') ?? '[]',
			(key, value) => value
		)
	)
}

function withoutContent<P extends Plugin>(plugin: P): P {
	return { ...plugin, content: undefined }
}

function storePlugins(plugins: Array<Plugin>) {
	localStorage.setItem('plugins', JSON.stringify(plugins.map(withoutContent)))
}

function managePlugin(plugin: Plugin, enabled: boolean) {
	const currentPlugins = storedPlugins()
	currentPlugins.find((it) => it.name === plugin.name).installed = enabled
	storePlugins(currentPlugins)
	plugins = currentPlugins

	if (enabled) installedSnackbar.open()
	else uninstalledSnackbar.open()
}

let showOnlyInstalled = false
let searchFilter = ''
let plugins = storedPlugins()

$: filteredPlugins = plugins
	.filter(
		(plugin) => !showOnlyInstalled || plugin.installed === showOnlyInstalled
	)
	.filter((plugin) =>
		plugin.name.toLowerCase().includes(searchFilter.toLowerCase())
	)

let installedSnackbar: Snackbar
let uninstalledSnackbar: Snackbar

//let manageMenu: Menu
</script>

<Theme>
    <plugin-store bind:this={htmlRoot}>
        <plugin-store-toolbar>
            <Checkbox label="Only Installed" bind:checked={showOnlyInstalled}/>
            <Textfield
            label={"Search"}
            variant={"outlined"}
            bind:value={searchFilter}
            />
        </plugin-store-toolbar>
        <plugin-store-items>
            {#each filteredPlugins as plugin}
            <plugin-store-item>
                <plugin-store-item--title>{plugin.name}</plugin-store-item--title>
                {#if plugin.installed } 
                <Group variant="raised">
                <Button on:click={() => managePlugin(plugin, false)} variant="outlined">
                    <Label>Enabled</Label>
                </Button>
                <div use:GroupItem>
                     <Button on:click={() => console.log("clicked")} variant="outlined" style="min-width: 18px;">
                         <IconArrowDropDown />
                     </Button> 
                </div>
                </Group>
                {:else}
                <Button on:click={() => managePlugin(plugin, true) } variant="raised" style="min-width:148px;">
                    <Label>Install</Label>
                </Button>
                {/if}
            </plugin-store-item> 
            {/each}
            {#if filteredPlugins.length === 0}
            <p>No plugins found.</p>
            {/if}
        </plugin-store-items>
        <Snackbar bind:this={installedSnackbar}>
            <Label>Installed plugin. Refresh page to see changes.</Label>
        </Snackbar>
        <Snackbar bind:this={uninstalledSnackbar}>
            <Label>Uninstalled plugin.</Label>
        </Snackbar>
    </plugin-store>
</Theme>

<style>
    :root,
    :host {
        --header-height: 128px;
    }
    plugin-store {
        height: calc(100vh - var(--header-height));
        display: flex;
        flex-direction: column;
        align-items: stretch;
        position: relative;
        padding: 0 1rem;
    }
    plugin-store-toolbar {
        display: flex;
        justify-content: space-between; 
        place-items: center;
        margin-top: 1rem;
    }
    plugin-store-items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem 0;
    }
    plugin-store-item {
        display: flex;
        justify-content: space-between;
        place-items: center;
    }
    plugin-store-item--title{
       font-size: 1rem; 
    }
</style>
