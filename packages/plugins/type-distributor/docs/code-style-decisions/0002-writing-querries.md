# 0002 — Writing XML queries

Purpose: prefer targeted XML queries over broad node scans and normalize absent results to `null`.

Guidelines

- **Avoid broad node lists + post-filtering.** Selecting many nodes and filtering them in code is inefficient. Instead, express the selection precisely in the query (predicate, attribute, axis, namespace):

  Bad (select-all then filter):

  ```js
  // gets all <item> then filters in JS — full traversal + temporary array
  const item = Array.from(doc.getElementsByTagName('item')).filter(n => n.getAttribute('id') === id)[0];
  ```

  Better:

  ```js
  const item = doc.querySelector(`item[id="${id}"]`);
  ```

  Rationale: letting the query engine prune the tree is both clearer and faster than filtering programmatically.

- **Return `null` for missing results.**

  Bad:
  ```js
  function findItem(id) {
    const item = doc.querySelector(`item[id="${id}"]`);
    return item ?? undefined;
  }
  ```

  Better:
  ```js
  function findItem(id) {
    return doc.querySelector(`item[id="${id}"]`);
  }
  ```

  - In TypeScript prefer `Element | null` (not `Element | undefined`) for APIs that may return nothing.
