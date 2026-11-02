---
name: frost
description: Frost, the design language of Wenxuan's site www.whexy.com - tokens, components, blocks and open questions. Use for any UI work in a project that uses Frost or should look like whexy.com, before choosing a color, size, component or layout. The frost-setup, frost-page, frost-component and frost-review skills build on it.
---

# Frost

Frost is light glassmorphism on an Apple-like canvas: a flat light-gray
page, frosted-glass cards with soft colored glows behind them, opaque
white paper for reading, neutral text, and one dusty-rose accent. All
content sits in one centered 720px column that goes edge to edge on
phones.

It is extracted from www.whexy.com (source: github.com/whexy/blog-1999).
Only what the site actually ships is documented here.

## Files

| File | What it holds | Read it when |
| ---- | ------------- | ------------ |
| [assets/tokens.css](assets/tokens.css) | Every primitive and semantic token. The only source of values. | Before choosing any value |
| [assets/components.css](assets/components.css) | Component classes (`glass-card`, `btn-glass`, `segmented`, …) | Building or changing a component |
| [assets/code.css](assets/code.css), [assets/prism-gruvbox.css](assets/prism-gruvbox.css) | Code blocks, footnotes, inline code, diagrams | The project renders Markdown/MDX |
| [assets/fonts.ts](assets/fonts.ts) | next/font setup for Lato, Fira Sans, Noto Sans SC, JetBrains Mono | Setting up a project |
| [assets/AGENTS.frost.md](assets/AGENTS.frost.md) | The design rules, one sentence plus reason each | Always; it is pasted into the project's AGENTS.md |
| [references/foundations.md](references/foundations.md) | What each token is for, type scale, spacing, radius, shadow, motion, layout, off-scale values | Choosing values |
| [references/components.md](references/components.md) | Every component: when to use, default, good/bad example, states | Using or changing a component |
| [references/blocks.md](references/blocks.md) | Named page sections and every page as a stack of blocks | Building a page or section |
| [references/open-questions.md](references/open-questions.md) | Undecided choices the user decides | Whenever a choice is not covered above |

## Which skill to use

- New project, or Frost not installed yet → `frost-setup`.
- New page or section → `frost-page`.
- New or changed component → `frost-component`.
- Checking a screen, diff or PR → `frost-review`.

Each is a separate skill; load it by name.

## Ground rules

1. Values come from `tokens.css`. If none fits, ask; never add one.
2. Components come from `components.md`. If none fits, use
   `frost-component`, and ask before inventing a new look.
3. Pages are stacks of blocks from `blocks.md`. If none fits, ask
   whether the section belongs.
4. Anything in `open-questions.md` is the user's call.
