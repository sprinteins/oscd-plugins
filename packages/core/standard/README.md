# IEC61850 standard translation to typescript

## How to write a new stable definition

Stable definition are written based on the XSD schema from the official code component that one can find on the IEC official website.

Naming convention : `ed${editionNumber}Rev${revisionNumber}`
This is important for the generation scripts

Each element that is part of the SCL definition should have these attributes :

```ts
type Element = {
	tag: string
	attributes: Record<string, string>
	subElements: Record<string, any>
}
```

See `ed2Rev1` for reference

## How to write a new unstable definition

Naming convention of the folder : `IEC61850-${iterationNumbersSeparatedWithAnHyphen}`
This is important for the generation scripts

Each new unstable definition element should have the same attributes as the stable versions.
If you are referencing/mocking one element from the based on stable definition, you should at least add these attributes :

```ts
type Element = {
	tag: string
}
```
See `IEC61850-90-30`for reference
