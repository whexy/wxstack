# Open questions: check with the user first

Decisions the site has not made, or has made in two ways. When a task
touches one of these, **ask the user before choosing**. Do not fill the
gap with a reasonable-looking guess; guesses become the product.

If you cannot ask (for example, you are running unattended), follow the
"Until answered" line and say in your summary which question you hit.

Frost's maintainer removes a question once it is decided and moves the
answer into tokens.css, components.md or the rules. Do not edit this
file from a project.

## Color

1. **Dark mode.** The site is light only (no `dark:` classes, Notion
   renderer pinned to light). *Until answered:* build light only and do
   not add `dark:` variants or `prefers-color-scheme` rules.
2. **Status colors** (success, warning, danger, info). None exist;
   unavailable data is shown in neutral tones (`ink-muted`,
   `ink-faint`). *Until answered:* use the neutral unavailable pattern;
   no green/amber/red.
3. **Accent strong.** The active TOC entry uses an untokenized darker
   rose (`#dd9999` border, `#bb6666` text). Is there an `accent-strong`
   token, and where may it appear? *Until answered:* use it only in
   the TOC, as is.
4. **Pure black vs ink.** The wordmark, the active nav link and the
   post-list rows use `#000`; everything else uses ink `#1d1d1f`.
   *Until answered:* reproduce those three as they are; use `ink` for
   anything new.
5. **Text tiers.** `ink` (#1d1d1f), `ink-strong` (neutral-900) and
   `ink-glass` (neutral-800) are within a few percent of each other,
   and some text is muted with opacity (`opacity-60`, `/80`) instead.
   Should these collapse? *Until answered:* use the token that names
   the job (see foundations.md).
6. **Idle control text.** Nav links rest at `ink-soft` (neutral-700),
   segments at `ink-subtle` (neutral-600). *Until answered:* keep each
   as built; a new control copies the nearest existing one.

## Spacing and motion

7. **10px spacing** (`2.5`) appears in the hero margin, the post-list
   row and the 404 button. On scale it would be 8 or 12. *Until
   answered:* keep it where it is; never introduce it elsewhere.
8. **Off-scale durations:** the post-list wash uses 300ms and prose
   links 250ms; the scale is 150/200. *Until answered:* keep those two;
   use 150/200 for anything new.
9. **Reduced motion for Depth3D.** The tilt ignores
   `prefers-reduced-motion` (the TOC scroll honors it). *Until
   answered:* leave Depth3D as is; any new motion must honor it.

## Components and states

10. **Missing states.** No component has a pressed (`active:`),
    disabled or loading state, and `btn-solid` has no hover. *Until
    answered:* do not invent them; ask when a feature needs one.
11. **Focus rings on rows.** Buttons, nav links and segments carry the
    accent focus ring; post-list rows, series rows and TOC links fall
    back to the browser default. *Until answered:* add the accent ring
    to any new interactive element; leave the existing rows.
12. **Inline code chip.** `code.css` styles `.prose:not(pre) > code`,
    which only matches a `<code>` directly under `.prose`. On the live
    site inline code in paragraphs has no chip (transparent, semibold).
    Is the chip the intent? *Until answered:* ship `code.css` as is.
13. **Callout title font.** It uses `font-sans`; every other heading
    uses `font-title`. *Until answered:* keep `font-sans` for callouts.
14. **Embed hover.** GithubRepo lifts on hover, Bilibili does not.
    *Until answered:* keep each as built; ask before adding a third
    embed.
15. **Empty list.** An empty entry list renders an empty panel; there
    is no empty-state design. *Until answered:* ask.
16. **Glow intensity.** Hero blobs sit at `/15`–`/20`, error-card
    blobs at `/25`–`/30`. *Until answered:* new identity cards use the
    hero values.

## Layout

17. **Notion column.** Notion pages use 700px (`max-w-175`); everything
    else is 720px. *Until answered:* use `max-w-content` for anything
    new.
