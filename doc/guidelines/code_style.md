# Code Style


- do not use prettier for formatting
- use the [barrel pattern](./barrel-pattern.md)
- files in a module should not import from their own index file (except tests, demo pages)
- tests and demo pages (+page.svelte) should import from the module's index to ensure that the module's public API is used
- files outside of a module should always import from the module's index