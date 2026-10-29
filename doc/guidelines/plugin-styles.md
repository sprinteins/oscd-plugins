# Plugin styles and shadow roots

OpenSCD loads every plugin as a custom element. Plugin styles must stay inside the plugin's shadow root and must not leak into the OpenSCD document head or ship as separate CSS files.

## Rules

- Only `src/plugin.svelte` is compiled as a custom element. Each plugin's `vite.config.ts` selects it through `dynamicCompileOptions` on the `svelte()` plugin: `customElement: true` for `src/plugin.svelte`, and `customElement: false, css: 'injected'` for every other component. This overrides the global `compilerOptions.customElement` in `svelte.config.js`.
- All other components, including those from `@oscd-plugins/ui` and `@oscd-plugins/core-ui-svelte`, therefore have their styles appended to the shadow root they render in.
- Do not rely on the global `compilerOptions.customElement: true` alone. It compiles every component as a custom element, which adds unused wrapper code and prevents `css: 'injected'` from applying per component.
- Import vendor or standalone CSS with `?inline`, never as a plain side-effect import (`import 'lib/style.css'`). A plain import ends up in the document head in development and in a separate CSS file in the build.
- Inject inline CSS into the component's root with the `injectStyles` action from `@oscd-plugins/ui`:

  ```svelte
  <script lang="ts">
  import { injectStyles } from '@oscd-plugins/ui'
  import vendorStyles from 'some-lib/dist/style.css?inline'
  </script>

  <div use:injectStyles={vendorStyles}>...</div>
  ```

  Do not write a literal `<style>` tag inside a `.svelte` script or markup string. The Svelte preprocessor treats it as a component style block and fails.
- Add `/// <reference types="vite/client" />` to the plugin's `src/vite-env.d.ts` so `?inline` imports are typed.

## Verify

1. Run `pnpm build` in the plugin and check that `dist/` has no `index.css`.
2. Load the plugin in OpenSCD and check that its styles are in the shadow root and that no new `<style>` elements appear in `document.head`.
