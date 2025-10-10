# OpenSCD Plugin: Dedupe

The problem:

- SCD files can contain redundant LN/Object/Attribute/Enum Types
- We currently consider two types equivalent if their structure is the same (this could evolve with more understanding but currently it is enough)
- At the moment we cannot automate deduping and it might be not even possible because there are times where two equivalent types have different purposes. It is a design decision

Prior Art:

- You can change the type of any object in the template plugin, therefore you can remove any usage of unwanted Types
- You can delete unused types with the "Cleanup" plugin
- The process of finding duplicates takes long and it prone to human error

Proposed solution:
- Strategy: we want to accelerate the finding of these duplicates and make it easy (what ever that means) to dedupe them
- Solution:
  - We'll create a plugin that shows similar/equivalent Types and provide the possibility to move all usage from Type-B to Type-A
  - All dangling Types can be cleaned up by the "Cleanup" plugin