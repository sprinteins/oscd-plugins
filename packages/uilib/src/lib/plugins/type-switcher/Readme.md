# Dedupe Plugin
> it will be renamed


GroupSelector

- input: list of types
- output: a list of selected types


GroupCardList:

- input: Groups
- output: an emitted event containing the selected group's index

TypeLinker:

- input: a group
- output: an emitted event that contains:
  - the relink target
  - the types to relink

AffectedNodes:

- input: a group
- output: N/A

Structure:

- input: an item from the selected group
- output: N/A