<script lang="ts">
import Theme from '../../theme/theme.svelte'
import { Checkbox } from '../../components/checkbox/'
import Textfield from '@smui/textfield'
import Button, { Group, GroupItem, Label } from '@smui/button'
import Menu from '@smui/menu'
import IconButton from '@smui/icon-button'
import Dialog, { Header, Title, Content, Actions } from '@smui/dialog'
import List, { Item, Text } from '@smui/list'
import IconArrowDropDown from '../../components/icons/icon-arrow-drop-down.svelte'
import IconClose from '../../components/icons/icon-close.svelte'
import Snackbar from '@smui/snackbar'

export let isOpen: boolean

// #region Plugin

type PluginKind = 'editor' | 'menu' | 'validator'
const menuPosition = ['top', 'middle', 'bottom'] as const
type MenuPosition = (typeof menuPosition)[number]

type Plugin = {
	name: string
	author?: string
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

// Enables/disables plugin by toggling the "installed" property.
function togglePluginState(plugin: Plugin, isEnabled: boolean) {
	const currentPlugins = storedPlugins()
	currentPlugins.find((it) => it.name === plugin.name).installed = isEnabled
	storePlugins(currentPlugins)
	officialPlugins = currentPlugins
	plugin.installed = isEnabled
	notificationSnackbar.open()
}

// Completely removes plugin from local browser cache.
function uninstallPlugin(plugin: Plugin) {
	const currentPlugins = storedPlugins()
	const updatedPlugins = currentPlugins.filter(
		(it) => it.name !== plugin.name
	)
	storePlugins(updatedPlugins)
	officialPlugins = updatedPlugins
}

let externalPlugins: Plugin[] = []

async function fetchExternalPlugins() {
	const externalPluginsMockup: Plugin[] = [
		{
			name: 'Type Designer',
			author: 'Illia Solovei',
			src: 'https://sprinteins.github.io/plugins/type-designer/index.js',
			kind: 'editor',
			installed: false
		},
		{
			name: 'Auto Doc',
			author: 'Sergio Alvarenga',
			src: 'https://sprinteins.github.io/plugins/auto-doc/index.js',
			kind: 'editor',
			installed: false
		}
	]

	externalPlugins = externalPluginsMockup
}

fetchExternalPlugins()

let showOnlyInstalled = false
let searchFilter = ''

let officialPlugins = storedPlugins()
$: plugins = officialPlugins.concat(externalPlugins)
$: filteredPlugins = plugins
	.filter(
		(plugin) => !showOnlyInstalled || plugin.installed === showOnlyInstalled
	)
	.filter((plugin) =>
		plugin.name.toLowerCase().includes(searchFilter.toLowerCase())
	)
	.filter((plugin) => plugin.name !== 'PluginStore')
	.filter((plugin) => plugin.name !== 'Plugin Store')

// #endregion

// #region UI
let notificationSnackbar: Snackbar

let currentPluginAnchor: Element
let menus: Menu[]
$: menus = filteredPlugins.map(() => null)
$: menuStates = filteredPlugins.map(() => false)

function openPluginMenu(e, index: number) {
	currentPluginAnchor = e.currentTarget
	menuStates = menuStates.map(() => false)
	menuStates[index] = true
}

function alternateRowColors(index: number) {
	return `background: rgba(0, 0, 0, ${index % 2 === 0 ? '0' : '0.03'});`
}

function getPluginAuthor(plugin: Plugin) {
	return plugin.official ? ' ' : plugin.author
}

function getPluginSource(plugin: Plugin) {
	return plugin.src
}

// #endregion
</script>

<Dialog bind:open={isOpen} 
fullscreen
surface$style="width: 850px; max-width: calc(100vw - 32px);"
aria-labelledby="plugin-store-title" 
aria-describedby="plugin-store-content">
<Header>
    <Title id="plugin-store-title">Plugin Store</Title>
    <IconButton class="material-icons" action="close">
        <IconClose/>
    </IconButton>
</Header>
<Content id="plugin-store-content">
<Theme>
    <plugin-store>
        <plugin-store-toolbar>
            <Checkbox label="Only Installed" bind:checked={showOnlyInstalled}/>
            <Textfield
            label={"Search"}
            variant={"outlined"}
            bind:value={searchFilter}
            />
        </plugin-store-toolbar>
        <plugin-store-items> 
            {#each filteredPlugins as plugin, index}
            <plugin-store-item style={alternateRowColors(index)}>
                <plugin-store-item-meta>
                <span style="font-size: 0.85rem;">{getPluginAuthor(plugin)}</span>
                <span><strong>{plugin.name}</strong></span>
                <span style="font-size: 0.85rem;">{getPluginSource(plugin)}</span>
                </plugin-store-item-meta>
                {#if plugin.installed } 
                <Group variant="raised">
                    {#if plugin.official}
                        <Button on:click={() => togglePluginState(plugin, false) } variant="outlined" style="min-width: 148px;">
                            <Label>Disable</Label>
                        </Button>
                    {:else}
                        <Button on:click={() => togglePluginState(plugin, false)} variant="outlined" style="min-width: 102px;">
                            <Label>Disable</Label>
                        </Button>
                        <div use:GroupItem>
                            <Button on:click={(e) => openPluginMenu(e, index)} variant="outlined" style="min-width: 18px;">
                                <IconArrowDropDown />
                            </Button> 
                            <Menu bind:this={menus[index]} anchorElement={currentPluginAnchor} open={menuStates[index]} anchorCorner="BOTTOM_LEFT" style="left: -70px">
                                <List>
                                    <Item on:SMUI:action={() => uninstallPlugin(plugin) }>
                                        <Text>Uninstall</Text>
                                    </Item>
                                </List>
                            </Menu>
                        </div>
                    {/if}
                </Group>
                {:else}
                    {#if plugin.official}
                    <Button on:click={() => togglePluginState(plugin, true) } variant="raised" style="min-width: 148px;">
                        <Label>Enable</Label>
                    </Button>
                    {:else}
                    <Button on:click={() => togglePluginState(plugin, true) } variant="raised" style="min-width: 148px;">
                        <Label>Install</Label>
                    </Button>
                    {/if}
                {/if}
            </plugin-store-item> 
            {/each}
            {#if filteredPlugins.length === 0}
            <p>No plugins found.</p>
            {/if}
        </plugin-store-items>
        <Snackbar bind:this={notificationSnackbar}>
            <Label>Refresh page to see changes.</Label>
        </Snackbar>
    </plugin-store>
</Theme>
</Content>
<Actions>
    <Button action="reject" on:click={() => location.reload()}>
        <Label>Restart</Label>
    </Button>
    <Button action="accept">
        <Label>Close</Label>
    </Button>
</Actions>
</Dialog>

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
        padding: 1rem 0;
    }
    plugin-store-item {
        display: flex;
        justify-content: space-between;
        place-items: center;
        padding: 20px 24px;
        margin: 0 -24px;
    }
    plugin-store-item-meta {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    
</style>
