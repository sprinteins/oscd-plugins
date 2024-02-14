# Naming Variables and Functions

## Business Terms

- In `core` package and in use cases modules we use the business terms (`BT`)
- In ElkJS context: `<BT>` + Elk + `<Elk Term>`
- In SvelteFlow context: `<BT>` + Flow + `<Svelte Flow Term>`

For example:
The network information of an IED is called:
- `Networking` in the use case
- `NetworkingElkNode` in ElkJS context
- and `NetworkingFlowNode` in SvelteFlow context

### Reasoning

  We use `Networking` in the use-case `Network Information` and we only handle IED Network Information
therefore, we can omit the `IED` prefix and we can shorten the `Network Information` to `Networking` fore sake of brevity.
In ElkJS context we use `NetworkingElkNode` and in SvelteFlow context we use `NetworkingFlowNode`
  The term `Cable` term only used in the plugin so we only use in it and not in the `core` package.

### Questions to Answer

  How do we handle the elements in DOM and in XML? We cannot call both `element`.
It would be `iedElement` in both cases. Following options:
- `iedDOM` and `iedXML`
- `iedElementDOM` and `iedElementXML`
- `iedDOMElement` and `iedXMLElement`
- we can reference the business domain: `iedElement` and  `iedSCLElement`


## Naming Maps
format: `<ke><value>Map`

Put both the key and the value in the name. For example:
```ts
const type BayIEDMap = { [bay: string]: string }
```

