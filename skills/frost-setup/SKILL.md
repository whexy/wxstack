---
name: frost-setup
description: Install Frost (the whexy.com design language) into a new or existing web project - tokens, component classes, fonts, design rules. Use when starting a project that should look like www.whexy.com, or when a project's UI work needs Frost and styles/frost/ does not exist yet.
---

# Set up Frost in a project

Frost's files live in the `frost` skill. Load it by name and read its
SKILL.md first; the paths below are inside its directory.

## 1. Check the stack

Frost needs **Tailwind CSS v4** (CSS-first `@theme`). Check
`package.json`:

- Tailwind v4 present, or no CSS framework yet → continue.
- Tailwind v3, another CSS framework, or a non-web project → stop and
  ask the user; porting the tokens is a separate decision.

`fonts.ts` uses `next/font`. On another framework, load the same
families and weights (Lato 400/700, Fira Sans 400–700, Noto Sans SC
400/700, JetBrains Mono 400/700) and expose them as the CSS variables
`--font-lato`, `--font-fira`, `--font-notosans`, `--font-jetbrains` on
`<html>`.

## 2. Install packages

Always: `tailwindcss` (v4), `@tailwindcss/postcss`.
Add only what the project uses:

| Package | Needed for |
| ------- | ---------- |
| `@tailwindcss/typography` | `Prose` (any long-form text) |
| `@react-spring/web` | `Depth3D` tilt |
| `@heroicons/react` | Icons (the site's icon set) |
| `rehype-prism-plus`, `rehype-code-titles` | Code blocks in Markdown/MDX |

Use the project's package manager and lockfile.

## 3. Copy the files

From the `frost` skill's `assets/` into the project:

| File | Destination | When |
| ---- | ----------- | ---- |
| `tokens.css`, `components.css` | `styles/frost/` | Always |
| `code.css`, `prism-gruvbox.css` | `styles/frost/` | The project renders Markdown/MDX |
| `fonts.ts` | `lib/fonts.ts` | Next.js |

Copy them unchanged. They are the shared source; a project-specific
tweak is an open question, not an edit.

## 4. Wire the stylesheet

In the global stylesheet, in this order:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography"; /* if using Prose */
@import "./frost/tokens.css";
@import "./frost/components.css";
@import "./frost/code.css"; /* if Markdown/MDX */
```

Import `prism-gruvbox.css` from the root layout next to the global
stylesheet. Put the font variables on `<html>`:

```tsx
<html lang={lang} className={fontVariables}>
```

## 5. Add the rules

Append the `frost` skill's `assets/AGENTS.frost.md` to the project's `AGENTS.md`
(create it if missing; if the project has `CLAUDE.md` instead, use
that). Fix the `tokens.css` path in its first paragraph if you placed
the files elsewhere.

## 6. Build the shell

If the project is a site, start from the **Page shell** and **Site
header** blocks in the `frost` skill's `references/blocks.md`. Ask the
user for the wordmark text and the nav entries; do not copy
whexy.com's ("whexy", Blogs/Notion/About) unless this is that site.

## 7. Verify

1. Run the project's build. It must pass.
2. In the compiled CSS, `--color-white-readable` is present and a test
   class such as `text-gray-500` generates no rule (the palette is
   closed on purpose).
3. Render one `glass-card` on the canvas and look at it: light-gray
   page, translucent white card, hairline border, faint shadow.

Report what you installed, where the files went, and anything you had
to ask about.
