# Design Document



## Plan

```text
                            ┌─────────┐
                            │ OpenSCD │
                            └─────────┘
                                 │
                             open Doc
                                 │
                                 ▼
       ┌──────────┐         ┌─────────┐
       │  Select  │         │IO Center│
       └──────────┘         └─────────┘
             △                   │
             │                set Doc
      <<specialized>>            │
             │                   ▼
       ┌──────────┐IEDs sub.  ┌─────┐              ┌─────────────┐
       │IED-Select│─ ─ ─ ─ ─ ▶│     │   Doc sub.   │    Query    │
       └──────────┘  set      │     │◀─ ─ ─ ─ ─ ─ ─│──▶┌─────┐   │
             │  selected ied  │     │◀─────────────│set│ Doc │   │
             └───────────────▶│     │   set IEDs   │   │[XML]│   │
                              │     │              │   └─────┘   │
              ─ ─ ─ ─ ─ ─ ─ ─▶│     │ selected IED │             │
             │object tree sub.│     │     sub.     │             │
    ┌────────────────┐        │     │◀─ ─ ─ ─ ─ ─ ─│             │
    │  Object Tree   │        │     │◀─────────────│             │
    └────────────────┘        │     │  set object  │             │
             │      set       │     │     tree     │             │
             └───selected ───▶│     │              │             │
                  objects     │     │              │             │
                              │     │              │             │
              selected        │     │   selected   │             │
        ┌ ─ ─ objects ─ ─ ─ ─▶│     │◀─ objects ─ ─│             │
                sub.          │     │     sub.     │             │
        │                     │     │              │             │
             ─ ─ LCs sub.─ ─ ▶│Store│◀──set LCs────│             │
        │   │                 │     │              │             │
                 ─ LPs sub.─ ▶│     │◀─────────────┤             │
        │   │   │             │     │  set active  │             │
                              │     │     LPs      │             │
    ┌───┴───┴───┴────┐        │     │              │             │
┌───┤                │        │     │◀─────────────┤             │
│   │  Routing Area  │        │     │   set LP     │             │
│ ┌─┤                │        │     │    List      │             │
│ │ └────────────────┘        │     │              │             │
│ │                           │     │              │             │
│ │                           │     │              │             │
│ │                           │     │              │             │
│ │               LP List     │     │              │             │
│ │          ─ ─ ─ sub.─ ─ ─ ▶│     │              │             │
│ │         │                 │     │              │             │
│ │               active LPS  │     │              │             │
│ │         │   ┌ ─ ─sub. ─ ─▶│     │              │             │
│ │                           │     │              │             │
│ │ ┌───────┴───┴────┐        └─────┘              │             │
│ │ │ LP Assignment  │                             │             │
│ │ └────────────────┘       ┌──────┐              │             │
│ │          │               │      │       LP     │             │
│ │          └──assign LP───▶│      │◀ ─assignment ┤             │
│ │     connect              │      │    listener  └─────────────┘
│ └────object-lc────────────▶│      │
│                            │Action│
│      connect               │ Hub  │
└───────lp-lc───────────────▶│      │
                             │      │
                             │      │
                             │      │
                             │      │
                             └──────┘
```

### Components

- `OpenSCD`
- `IO Center`: our plugin
- `Query`: the main business logic is here. It queries and change the XML document
- `Store`: where the state is stored, offers setters and subscriptions
- `Select`: a generic select component
- `IED-Select`: a specialized select component that allows searching and selecting IEDs
- `Object Tree`: the tree that visualizes the IEDs object model and allows selection of elements
- `Routing Area`: where the users can make connections between objects, LCs and Lampshade
- `LP Assignment`: where the users can assign LPs to Objects to allow connections
- `Action Hub`: where the actions are dispatched and the listeners are registered


### Actions and Subscriptions

- `──────▶`: (A) Action
- `─ ─ ─ ▶`: (S) Subscription

- (A) `open Doc`: OpenSCD opens a document and passes on to IO Center
- (A) `set Doc`: IO Center sets the opened document in the store
- (S) `Doc sub.`: The Query's document subscriptions. If the document changes `Query` saves the new version
- (A) `set IEDs`: if the document changes, the `Query` updates the IEDs list
- (S) `IEDs sub.`: the `IED-Select` subscribes and lists the IEDs from the `Store`
- (A) `set selected ied`: if the users chooses an IED, the `IED-Select` sets the selected IED in the `Store`
- (S) `selected IED sub.`: the `Query` subscribes to the selected IED
- (A) `set object tree`: if the selected IED changes, the `Query` updates the object tree
- (S) `object tree sub.`: the `Object Tree` subscribes to the object tree and displays in
- (A) `set selected objects`: if the users one or more objects the `Object Tree` sets the selected ones in the `Store`
- (S) `selected objects sub.`: the `Routing Area` and `Query` subscribes to the selected objects
- (A) `set LCs`: the `Query` sets the available LCs based on the selected object
- (A) `set active LPs`: the `Query` sets the available LPs based on the selected object
- (A) `set LP List`: the `Query` sets the available LPs based on the selected IED
- (S) `LP List sub.`: the `LP Assignment` subscribes to the LP list to display
	  all the LPs of the selected IED and their status if they are already in use
- (S) `active LPs sub.`: the `LP Assignment` subscribes to the active LPs
      that are to be shown in the `Routing Area`
- (A) `assign LP`: users can display non-assigned LPs in the `Routing Area`
  	  and assign them to objects
- (A) `connect object-lc`: users can connect object with LCs in the `Routing Area`
- (A) `connect lp-lc`: users can connect LPs with LCs in the `Routing Area`