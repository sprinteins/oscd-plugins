
# Barrel Pattern

Handling folders in JavaScript/TypeScript projects as modules makes encapsulation
easier and the structure clearer. 

In the barrel pattern a folder re-exports items from its files and sub-folders   
through an `index.ts` file, like a barrel and its tap. This makes the code more readable and, 
if used correctly, more robust because internals of a module/folder 
do not leak out and we use only that is made public through the `index.ts`.

In short, `index.ts` defines a folder's/module's public API.

### Rules

<details open>
  <summary>A folder is a module if it contains an <code>index.ts</code>.</summary>

```txt
module-one/
└─index.ts
```
</details>


<details>
  <summary>
    A module can have sub-modules.
  </summary>

```txt
module-one/
├─index.ts
└─module-two/
  └─index.ts
```
</details>

<details>
  <summary>
    A module can import items from its direct sub-modules.
  </summary>

```txt
root/
├── main.ts
└── restaurant/
    ├── index.ts
    ├── prepare.ts
    └── food/
        ├── index.ts
        └── food.ts
```

```ts
// main.ts
import { prepare } from './restaurant'

const pizza = ...
prepare(pizza)
```

```ts
// restaurant/index.ts
export { prepare } from './prepare.ts
```

```ts
// restaurant/prepare.ts
import { Food } from './food'

export function prepare(food: Food){ ... }

```

```ts
// restaurant/food/index.ts
export { Food } from './food.ts
```

```ts
// restaurant/food/food.ts
export interface Food{ ... }
```

</details>


<details>
  <summary>
    A module can re-export items from its direct submodules, 
    but not from sub-modules of its direct sub-modules.
  </summary>

```txt
root/
└── restaurant/
    ├── index.ts
    └── food/
        ├── index.ts
        └── pizzas/
            ├── index.ts
            └── margherita.ts


```

```ts
// restaurant/index.ts

// GOOD:
export { PizzaMargherita } from './food'

// BAD:
export { margherita as PizzaMargherita} from './food/pizzas/margherita.ts

```

```ts
// restaurant/food/index.ts
export { margherita as PizzaMargherita } from './pizzas'
```

```ts
// restaurant/food/pizzas/index.ts
export { margherita } from './margherita.ts'
```

</details>

<details>
  <summary>
    If a folder does not have an `index.ts` it is not a module and other modules can import from its sub-folders.
  </summary>

```txt
root/
├── main.ts
└── x
    ├── types/
    │   ├── index.ts
    │   └── user.ts
    └── log
        ├── index.ts
        ├── console.ts
        └── file.ts
```

```ts
// main.ts

// 'x' does not have an `index.ts` therefore not a module
import { User } from './x/types'
import { FileLogger, ConsoleLogger } from './x/log'

const fileLogger = new FileLogger('./log.txt')
const consoleLogger = new ConsoleLogger()

const user = new User()

fileLogger.log(user)
consoleLogger.log(user)

```

</details>


