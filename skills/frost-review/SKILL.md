---
name: frost-review
description: Review a screen, diff or PR against the Frost design language (www.whexy.com) with a fixed checklist of search commands and yes/no checks, and report pass/fail per check. Use after building UI in a Frost project, or when asked to review or audit a Frost screen.
---

# Review a screen against Frost

Run every check below, in order, and report every check, including
the ones that pass. Do not skip a check because it "obviously" passes,
and do not add checks of your own; put other observations under
"Notes" in the report.

Reference files are in the `frost` skill. Load the `frost` skill by name; these paths are inside its directory:
`references/foundations.md` (including the **Off-scale values** table),
`references/components.md`, `references/blocks.md`,
`references/open-questions.md`.

## Results

Each check ends in one result:

- **pass**: no hits, or every hit is allowed by the check's rule.
- **known**: the only hits are values listed in the Off-scale values
  table, in the same component the table names. Reproducing the site
  is allowed; report them so they stay visible.
- **fail**: any other hit. It must be fixed before shipping.
- **ask**: the hit touches an open question. Name the question number.

## 0. Scope

Pick the mode from the request:

- **Diff mode** (a PR, a branch, "review my change"): the files are
  `git diff --name-only <base>...HEAD` plus uncommitted changes,
  limited to `*.tsx *.jsx *.ts *.css *.mdx *.html`. Only hits on lines
  the change added or modified count (check with
  `git diff -U0 <base> -- <file>`).
- **Screen mode** ("review the home page"): the files are the route's
  page and layout files and every component they render, recursively,
  within the project.

Never review `styles/frost/**`; those files are the shared system.
Write the file list into the report.

Set `FILES` to that list. Every command below runs as written, with
ripgrep (`rg`), from the project root.

## 1. Mechanical checks

Run each command exactly as written; it prints the hits. Then apply the
rule.

**C1 Raw colors**

```sh
rg -n -e '#[0-9a-fA-F]{3,8}\b' -e 'rgba?\(' -e 'oklch\(' -e 'hsla?\(' $FILES
```

Fail, except a lookup table of third-party data colors with a comment
naming the source (e.g. GitHub language colors).

**C2 Arbitrary values**

```sh
rg -no '[a-z0-9:-]+-\[[^\] ]+\]' $FILES
```

Pass only: `scale-[1.02]`; the Prose link classes
`prose-a:shadow-[inset_0_-0.4rem_0_var(--color-accent)]` and
`prose-a:duration-[0.25s]`; `min-h-[80vh]` in the Page shell;
`mt-[25vh]` in the Error card; `right-[max(...)]` and `max-h-[70vh]` in
the TOC rail. Anything else fails, or is **known** per the Off-scale
values table.

**C3 Non-neutral grays**

```sh
rg -n '\b(gray|slate|zinc|stone)-[0-9]' $FILES
```

Any hit fails.

**C4 Undeclared palette colors**

```sh
rg -no '\b(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]+' $FILES \
  | rg -v ':(blue-(100|200|500|600)|cyan-200|purple-(50|200)|pink-(100|200)|yellow-200|orange-(100|200|500|600)|red-(50|100|200|500|700))$'
```

Any hit fails: tokens.css does not declare it, so the class generates
no CSS.

**C5 Hue used for meaning**

```sh
rg -no '\b(text|bg|border|ring|outline|fill|stroke|shadow|decoration)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]+' $FILES
```

Pass only: the icon color inside an `icon-tile` (`text-red-700` in the
series card). Any other hit fails; if it signals status, **ask** (Q2).

**C6 Primitive instead of semantic**

```sh
rg -no '\b(text|bg|border|outline|ring)-(neutral-[0-9]+|black-readable|white-readable|highlight|secondary)\b' $FILES
```

Fail; fix with the C6 mapping below. `neutral-50`, `-100` and `-300`
have no token: pass only inside Quote and code chips, otherwise **ask**.

**C7 Durations**

```sh
rg -no 'duration-\[?[0-9.]+m?s?\]?' $FILES
```

Pass: `duration-150`, `duration-200`. `duration-300` on the List row
wash and `duration-[0.25s]` on Prose links are **known**. Anything else
fails.

**C8 Off-scale radius, shadow, scale**

```sh
rg -noP '(?<![\w-])(rounded(?:-(?:xs|sm|4xl))?(?![\w-])|shadow-(?:xs|lg|xl|2xl|inner)\b|scale-[0-9]+)' $FILES
```

Any hit fails: these generate no CSS, or exceed the 1.02 lift.

**C9 Dark mode**

```sh
rg -n -e 'dark:' -e 'prefers-color-scheme' $FILES
```

Any hit is **ask** (Q1).

**C10 Font families**

```sh
rg -noP '(?<![\w-])font-[a-z]+\b' $FILES \
  | rg -v ':font-(title|article|sans|mono|medium|semibold|bold|normal)$'
```

`font-serif` passes only for the Quote marks. Anything else fails.

**C11 Column width**

```sh
rg -no '\bmax-w-[a-z0-9]+' $FILES | rg -v ':max-w-(content|full|none)$'
```

Pass only: `max-w-xs` on bubbles, `max-w-xl` on embeds, `max-w-4xl` on
Quote and the 404 page. `max-w-175` on the Notion page is **known**.
Anything else fails.

**C12 Focus ring**

```sh
rg -n '<(button|a|Link)\b|onClick=' $FILES
```

For each element found: pass if its class list has `btn-glass`,
`btn-solid`, `nav-link`, `segmented-item` or
`focus-visible:outline-accent`, or it is a link inside Prose. List row,
Numbered row and TOC links without it are **known** (Q11). Otherwise
fail.

C6 mapping:

| Found | Replace with |
| ----- | ------------ |
| `text-neutral-900` | `text-ink-strong` |
| `text-neutral-800` | `text-ink-glass` |
| `text-neutral-700` | `text-ink-soft` |
| `text-neutral-600` | `text-ink-subtle` |
| `text-neutral-500` | `text-ink-muted` |
| `text-neutral-400` | `text-ink-faint` |
| `bg-neutral-200` | `bg-placeholder` |
| `border-neutral-200` | `border-rule` |
| `*-black-readable` | `*-ink` |
| `bg-white-readable` / `text-white-readable` | `bg-canvas` / `text-on-ink` |
| `*-highlight` | `*-accent` |
| `bg-secondary` | `bg-wash` |

## 2. Structural checks

Answer each with yes or no by reading the code. "No" is a fail unless
the rule says **ask**.

| ID | Question |
| -- | -------- |
| S1 | Can every section of the screen be named as a block from blocks.md? Write the stack (e.g. `Page shell › Site header › space-y-8 [Profile hero, Entry list]`). A section with no block → **ask** |
| S2 | Is all long-form text (more than one paragraph) on `paper`, never on `glass-card` or `panel`? |
| S3 | In every decorated card, are decorations in the order tint → blobs → shine, at `-z-10` (shine without z-index), with content wrapped in `relative z-10`? Tint opacity ≤ `/40`, blob opacity `/15`–`/30`? |
| S4 | Do page-level surfaces go square edge to edge below `sm` (`max-sm:rounded-none` on `glass-card`, or `panel`/`paper`), and does each nested surface use a smaller radius than its parent? |
| S5 | Does every component appear at a documented variant, and does every state it renders appear in that component's states table in components.md? An invented pressed/disabled/loading/empty state → **ask** (Q10, Q15) |
| S6 | Is every state truthful: the current/active item, `aria-current`, labels, counts and fallback notes derived from the same data that decides them (no hardcoded "current", no label that can disagree with the state it describes)? |
| S7 | Is `accent` used only for link highlighting, focus rings and selection? |
| S8 | At most one `Depth3D` and at most one `btn-solid` per group of actions on the screen? |
| S9 | Is every persistent line of copy data, identity, navigation, an action, a state or a warning (no taglines, eyebrow labels or filler descriptions)? |
| S10 | Does anything new honor `prefers-reduced-motion` if it animates beyond a hover transition? |

## 3. Visual check

Do this when the project can run (`dev` server or a build). Otherwise
mark V1–V3 "not run" with the reason.

| ID | Check |
| -- | ----- |
| V1 | At 390px wide: page-level cards touch both screen edges with square corners; header nav sits on its own row |
| V2 | At 768px: page-level cards are rounded with gutters; content stays within a 720px column |
| V3 | Hover one `btn-glass`: it lifts slightly and brightens. Press Tab to the first link or button: an accent (dusty-rose) outline ring appears |

Take a screenshot at each width and attach or link it.

## 4. Report

```
Frost review — <diff mode|screen mode>: <target>
Files: <list>
Stack: <S1 stack>

| ID  | Result | Where           | Fix |
| --- | ------ | --------------- | --- |
| C1  | pass   |                 |     |
| C2  | fail   | app/x.tsx:12    | `p-[18px]` → `p-4` |
| ... (every check C1–C12, S1–S10, V1–V3) |

Open questions hit: <Q numbers, or none>
Notes: <anything else, or none>
```

The review passes only when no row is **fail**. **ask** rows go to
the user; **known** rows need no action.
