# Stores

- The store in `store.svelte.ts` is our main store. We track here the needed business objects and application states. 
- Stores and states of the component derive information from this store. 
- Components do not affect the state of other components directly


Two examples of it below. The `ObjectTree` component derives its own data structure from the store's `dataObjects`. The `CanvaseStore` creates its own data structure based on the selected Data Objects in the store.


```txt
╔══════════════════════════════════════════════╗
║The Store                                     ║
║    ┌────────────┐       ┌───────────────────┐║
║    │dataObjects │       │selectedDataObjects│║
║    └────────────┘       └───────────────────┘║
║           ▲                       ▲          ║
╚═══════════╬═══════════════════════╬══════════╝
            │                       │
╔═══════════╩═══════════╗ ╔═════════╩══════════╗
║ ┌───────────────────┐ ║ ║  ┌────────────┐    ║
║ │   filteredTree    │ ║ ║  │dataObjects │    ║
║ └───────────────────┘ ║ ║  └────────────┘    ║
║            Object Tree║ ║        Canvas Store║
╚═══════════════════════╝ ╚════════════════════╝
 ```
