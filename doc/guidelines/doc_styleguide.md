# Documentation Style Guide

Prefer only markdown elements and avoid HTML tags if possible. 
This makes the content easier to maintain and more transferable.

## Emojis

* Emojis are a great way to recognise content quickly.
* Use them if a content is used often.
* Try not overuse them.

### External Links

It is polite to warn readers if they leave the current page. They can choose to open the link in a new tab if they want to. 
Use the `↗` before the link, e.g.: [↗ SprintEins](https://www.sprinteins.com/)

## Expandable Content

In markdown you can use the HTML [↗ details](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) tag.

<details>
  <summary>Use this for content that you do not want to read every time, such as:</summary>
  <ul>
    <li>screenshots that help in tutorials </li>
    <li>additional descriptions that explain something that you only must read once</li>
    <li>install steps that the user does not need but good if it is needed. e.g.: "how to install git" </li>
    <li>etc... </li>
  </ul>
</details>

## Tables

Use tables for data and not for styling. It is not 1990s.

## Admonition

Admonition help draw attention to content. Use it for extra information, tips, and warnings.

### Templates

* Warning
  > **⚠️ Warning:** This is really important!
  > Sometimes only warnings have an "icon" to emphasize their importance

  ```md
  > **⚠️ Warning:** This is really important!
  > Sometimes only warning have an "icon" to emphasize their importance
  ```

* Info

  > **ℹ️ Info:** This is just additional information, maybe a link to another documentation.
  > They can be multi-line.
  
  ```md
  > **ℹ️ Info:** This is just additional information, maybe a link to another documentation.
  > They can be multi-line.
  ```

* Tip
  
  > **✅ Tip:** This is a helpful tip.

  ```md
  > **✅ Tip:** This is a helpful tip.
  ```
