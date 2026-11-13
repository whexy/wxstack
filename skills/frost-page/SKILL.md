---
name: frost-page
description: Build a new page or page section in the Frost design language (www.whexy.com) by stacking existing blocks. Use when adding a route, screen, or section to a Frost project.
---

# Build a page or section from blocks

Read first. Load the `frost` skill by name; these paths are inside its directory:
`references/blocks.md`, `references/components.md`,
`references/foundations.md`, and the rules in `assets/AGENTS.frost.md`.
If the page shows data, also `references/charts.md`.

If `styles/frost/tokens.css` is missing from the project, run
`frost-setup` first.

## 1. Write the stack before any code

List the page top to bottom as named blocks, in the format of the
"Pages as stacks" table in blocks.md:

```
Page shell › Site header › space-y-8 [Profile hero, Entry list]
```

For every section, name the block it is (blocks.md, or the chart
blocks in charts.md). If a section matches no block:

- It is a known block with different content (a different list, a
  different identity) → reuse the block.
- It needs a new shape → **stop and ask the user** whether it belongs.
  Show the user the stack and the section that does not fit. A screen that
  needs a new block is a design decision, not an implementation detail.

## 2. Build each block from its recipe

- Start from the Page shell (or the Notion/404 exceptions only if the
  page is one of those).
- Copy each block's structure and classes from blocks.md, then fill in
  the content. Keep its spacing, padding, radius and breakpoints.
- Inside blocks, use components from components.md at their default
  variant. Their states are the only states.
- Between top-level blocks use `space-y-8`.
- Write colors as semantic tokens (`text-ink-muted`, not
  `text-neutral-500`).

## 3. Write only useful copy

Every line is data, identity, navigation or an action. No taglines,
eyebrow labels, or description paragraphs added to fill space. If a
block needs text you do not have (a name, a role, nav labels), ask.

## 4. Check the breakpoints

Render (or reason through) these widths:

| Width | Expect |
| ----- | ------ |
| 390 | Page-level cards edge to edge and square; header nav on its own row; hero photo above text |
| 768 | Rounded cards with gutters; hero side by side; prose at `prose-lg` |
| 1280 | TOC rail in the right gutter (articles with 2+ headings); on a Dashboard shell page, cards in the `lg` grid |

## 5. Review

Run the `frost-review` skill on the files you changed and fix every
**fail**. Do not ship with an unresolved fail.

## 6. Report

Give the page's stack, the files you changed, and any open question you
hit (with its number from open-questions.md).
