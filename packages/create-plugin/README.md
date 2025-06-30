# HOW TO USE THIS TEMPLATE

- [] Copy the content of the template folder as is in your new plugin directory
- [] Rename the package name
- [] Check the license information
- [] Update packages if needed
- [] Modify the imported mock file imported in `src` > `plugin.dev.ts` to a `SCD`file that suits your needs
- [] Launch `pnpm i`
- [] Add if needed launch scripts to the monorepo package.json as shortcuts
- [] Change `vite.config.ts` ports to a random one (both `server` and `preview`)

## LAUNCH SCRIPT

1. Stand alone mode :

* Launch the plugin with : `pnpm dev`
In this mode the plugin is launched with HRM and locally with a mocked file already loaded

2. Integrated mode with an SCD Instance : `pnpm integrated`

* Launch the plugin with : `pnpm dev`
* Copy the given url and add this : `${URL}/src/plugin.js`.
* Load the plugin in OpenSCD with this url.

It gives you HMR ability inside the OpenSCD instance.

## SVELTE ACTIONS

See `src > lib >headless > actions` in `core-ui-svelte`

* initPlugin : takes care of the plugin initialization (theme + document load in the xmlDocumentStore)
* initSsdTemplate : takes care of the initialization of a ssd `template` file for plugin working exclusively with this type of file

