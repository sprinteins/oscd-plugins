# HOW TO USE THIS TEMPLATE

- [] Copy the content of the template folder as is in your new plugin directory
- [] Rename the package name
- [] Check the license information
- [] Update packages if needed
- [] Modify the imported mock file imported in `src` > `plugin.dev.ts` to a `SCD`file that suits your needs
- [] Launch `pnpm i`
- [] Add if needed launch scripts to the monorepo package.json as shortcuts

## LAUNCH SCRIPT

1. Stand alone mode : `pnpm dev`

In this mode the plugin is launched with HRM and locally with a mocked file already loaded

2. Integrated mode with an SCD Instance : `pnpm integrated`

In this mode the plugin has to be implemented with the given url in the console.
The plugin is build, and then launched in a preview mode.
Copy the given URL to your test instance : `${URL}/${buildJSFilename}.js`
The `buildJSFilename` is the one provided in the `vite.config` : here `plugin.js` by default.



