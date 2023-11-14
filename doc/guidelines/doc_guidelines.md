# Documentation Guidelines

This document defines a set of guidelines to help:

* create consistent documentation
* decide what and in what form to document

These guidelines are meant for the developers in the team.

It provides guidelines for:

* file structure
* document structure
* content style guide
* diagrams

## Responsibility

Who is responsible for the documentation? You are!

When do you have to document something:

* if you know a part of the system
* if you are doing something that you are unfamiliar with then either you can document as you learn it or ask somebody, who already knows to document it.

<!-- TODO: guideline and link -->

Use the a Team Directory to see who can help.

We are all responsible for our own individual documentation, however there must be one or two "gardeners" who take care of the structure, consistency, accuracy, completeness, and relevance of the whole documentation.

<!-- TODO: article and link about gardeners and their responsibilities -->

## Types

We follow [↗ Diátaxis](https://diataxis.fr/) framework.

## Location

Store any documentation directly connected to the system in git.

## File Location

* Globally applicable documentation should be in the `/doc` folder.
* PLugin specific documentation goes into `packages/plugins/<plugin>/doc`.

## Language

Write documentation in English.
It avoids mixing languages in a sentence and makes the document more readable and consistent.
Furthermore, most of the readers will understand the documentation.

### Technical Terms

Include terms in the Glossary.

<!-- TODO: article about glossary and link -->

## What To Document

You can document anything, but here are a few guidelines:

* others may need the information when you are not around (e.g.: a how-to restore backup)
* the team needs to do something the same way (e.g.: this guideline)
* a process will be performed seldomly, and you might forget the steps (e.g.: how to clean up cron jobs)
* you must explain something often (e.g.: how-to setup the development environment)

## What Not To Document

Few things that do not belong into documentation:

* credentials of any internal or external system (e.g.: username-passwords, API keys, etc...)
* sensitive personal information

## Document's Structure

1. Scope: briefly define the scope of the document; what is in it, what is not
2. Audience: describe to whom the document is intended:
   * Role of the audience
   * Prerequisite: something you should already know or posses
   * Goal: what the audience is going to learn
3. Summary
4. Document itself

### For Example

1. Scope:

   ```txt
   This document defines a set of guidelines to help:
   - create consistent documentation
   - decide what and in what form to document  
   ```

2. Audience:

   ```txt
   These guidelines are meant for the developers in the team.
   ```

3. Summary:

   ```txt
   It provides guidelines for:
   - file structure
   - document structure
   - content style guide
   - diagrams
   ```

4. Document: this document

## Document Status

You can use certain tags that can show the status of the document:

* <kbd>🚧 WIP</kbd>: "Work In Progress" documents are actively worked on. You can expect changes in them.
* <kbd>🌿 Living</kbd>: Living documents are never finished and always changing. They usually contain the progress or status of something.

## Examples

Give examples in the form of a small code block or a link to files.

<!-- TODO -->

## Versioning And Commit Messages

When versioning documentation consider the followings:

* separate documentation from code changes
* split typo fixes and content changes into separate commits
* it should be clear from the commit message that it is about documentation

> **Note:**  
> You can find more information about the style guide here: [Documentation Style Guide](./doc_styleguide.md)