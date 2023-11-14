# Component Lib

This project is a simple svelte-kit based component library.

1. Create a folder for your `<component>` in `lib/components` eg: `lib/components/<component>`
2. Create your component
3. Create a `+page.svelte`
4. Import `Example` helper in `+page.svelte`
   ```ts
   import { Example } from "$lib/components/internal"
   ```
5. Create examples of your components

> **ℹ️ Tip:** see the sample button component for examples
> [./src/lib/components/button/+page.svelte](src/lib/components/button/+page.svelte)