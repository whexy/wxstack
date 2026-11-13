# Foundations: primitives and semantic tokens

Every value here is defined in [`../assets/tokens.css`](../assets/tokens.css).
This page says what each value is for and where www.whexy.com uses it.
"Site" below means the whexy/blog-1999 source.

## The look in one paragraph

Frost is light glassmorphism on an Apple-like canvas. The page is a flat
light gray. Chrome and cards are frosted glass (translucent white, blur,
150% backdrop saturation) with a hairline `black/5` border, a faint
`shadow-sm shadow-black/5`, and soft colored blobs glowing behind them.
Long-form reading sits on opaque white paper. Text and controls stay
neutral; the one functional color is a dusty rose (`#eecfcf`) used as a
link highlighter, focus ring and selection color. Everything lives in a
single centered 720px column, which goes edge to edge on phones.

## Colors

### Primitives

| Token                 | Value                 | Notes                                              |
| --------------------- | --------------------- | -------------------------------------------------- |
| `white-readable`      | `#f5f5f7`             | Canvas                                             |
| `black-readable`      | `#1d1d1f`             | Ink                                                |
| `secondary`           | `#f6f6f6`             | Hover wash                                         |
| `highlight`           | `#eecfcf`             | Dusty rose, the brand accent                       |
| `neutral-50`…`900`    | Tailwind neutral      | The only gray ramp (chroma 0)                      |
| `white`, `black`      | `#fff`, `#000`        | Glass fills (`white/20`…`/80`), hairlines (`black/5`, `/10`) |
| Decorative palette    | Tailwind values       | blue 100/200/500/600, cyan 200/600, purple 50/200/500, pink 100/200/500, yellow 200/600, orange 100/200/500/600, red 50/100/200/500/700 |

`tokens.css` resets Tailwind's color, radius and shadow ramps to
`initial`, so `text-gray-500`, `bg-green-600`, `rounded-sm` or
`shadow-lg` produce no CSS at all. That is deliberate: those values are
not part of the site.

The decorative palette only appears as gradient stops: `glass-tint`,
`glow-blob`, `icon-tile`, `bubble-me` (blue 500→600), and the series
card (red/orange). It never carries meaning. The one exception is
chart identity, through the `series-*` tokens below
([charts.md](charts.md)).

Code blocks use the gruvbox dark palette, written as hex inside
`prism-gruvbox.css` and `code.css`. Those files are the only place raw
hex is allowed.

### Semantic tokens

Use these in components. Each points at the primitive the site already
uses for that job.

| Token            | Points to        | Use for                                                       | Site examples                                       |
| ---------------- | ---------------- | ------------------------------------------------------------- | --------------------------------------------------- |
| `canvas`         | `white-readable` | Page background                                               | `body`, `<main>`                                    |
| `ink`            | `black-readable` | Body text, headings, solid button fill                        | `<main>` text, `btn-solid` bg, hero name            |
| `ink-strong`     | `neutral-900`    | Hover or active text of a neutral control                     | `nav-link:hover`, `segmented-active`, TOC hover      |
| `ink-glass`      | `neutral-800`    | Text on glass: buttons, peer bubble, card titles, quotes      | `btn-glass`, series title, Quote body               |
| `ink-soft`       | `neutral-700`    | Idle nav links and idle list rows                             | `nav-link`, idle series rows                        |
| `ink-subtle`     | `neutral-600`    | Idle segment, citation, "temporarily unavailable" notice      | `segmented-idle`, Quote cite, Notion fallback        |
| `ink-muted`      | `neutral-500`    | Metadata, "information unavailable", idle TOC entries         | TOC links, GithubRepo/Bilibili fallback text        |
| `ink-faint`      | `neutral-400`    | Placeholder icons and values                                  | Fallback avatar glyph, `-` stats                    |
| `on-ink`         | `white-readable` | Text on a solid ink fill                                      | `btn-solid` text                                    |
| `accent`         | `highlight`      | Link highlighter, focus ring, `::selection`, a selected chart range. Nothing else. | Prose links, every `focus-visible:outline-*`        |
| `wash`           | `secondary`      | Hover wash on rows and embed cards (`secondbg`)               | Post list row hover, GithubRepo, Bilibili           |
| `placeholder`    | `neutral-200`    | Disc behind a missing avatar or thumbnail                     | GithubRepo/Bilibili fallback                        |
| `rule`           | `neutral-200`    | Hairline rails, chart gridlines                               | TOC left border                                     |
| `series-1`…`6`   | blue-500, orange-500, pink-500, cyan-600, purple-500, yellow-600 | Chart entities, assigned in this order | Charts only ([charts.md](charts.md)) |
| `series-other`   | `neutral-400`    | Chart entities folded into "Other"                            | Charts only                                         |
| `series-total`   | `neutral-800`    | Chart values of no one entity (totals)                        | Charts only                                         |
| `series-muted`   | `neutral-300`    | Chart series pushed back while another is emphasized          | Charts only                                         |
| `axis`           | `neutral-300`    | Chart baseline, crosshair, marker hairlines                   | Charts only                                         |

**Undecided, check with the user first:** status colors
(success/warning/danger/info), a darker accent, dark mode. The site has
none of them. See [open-questions.md](open-questions.md).

The site also mutes text with opacity (`opacity-60` post summaries,
`opacity-80` captions, `text-black-readable/80` hero subtitle,
`/40` TOC label). Keep those exact recipes when you rebuild those
components; for new text pick an `ink-*` token instead.

### Surfaces

Surfaces are component classes, not colors (`components.css`):

| Need                         | Class         | Recipe                                                         |
| ---------------------------- | ------------- | -------------------------------------------------------------- |
| Raised card, chrome          | `glass-card`  | `bg-white/30` blur-md saturate-150, `rounded-3xl`, `border-black/5`, `shadow-sm shadow-black/5` |
| Page container for a list    | `panel`       | `bg-white/80` blur-sm saturate-150, `rounded-3xl` (square on mobile), `border-white/20` |
| Long-form reading            | `paper`       | Opaque `bg-white`, `shadow-sm shadow-black/5`, `sm:rounded-3xl` |
| Sticky header                | `header-bar`  | `bg-white/80` blur-sm saturate-150, `z-50`                     |
| Hover wash                   | `secondbg`    | `bg-wash/90`, `border-black/10`, `backdrop-blur`               |

## Typography

Fonts (loaded by [`../assets/fonts.ts`](../assets/fonts.ts), next/font):

| Token          | Family                          | Weights loaded   | Use for                                           |
| -------------- | ------------------------------- | ---------------- | ------------------------------------------------- |
| `font-title`   | Lato → Noto Sans SC             | 400, 700         | Headings, nav, buttons, post titles, wordmark     |
| `font-article` | Fira Sans → Noto Sans SC        | 400–700          | Article body, summaries, hero subtitle            |
| `font-sans`    | Fira Sans → system              | 400–700          | Default; bylines, captions, embeds, TOC           |
| `font-mono`    | JetBrains Mono                  | 400, 700         | Code, the error page digits                       |
| `font-serif`   | System serif                    | –                | Only the decorative quote marks in Quote          |

Lato has no 600, so `font-semibold` on `font-title` renders at 700.

Size scale in use (Tailwind defaults; nothing else is used):

| Class                   | Site use                                                                    |
| ----------------------- | --------------------------------------------------------------------------- |
| `text-xs` (12)          | TOC label, `Small` on mobile, bubble link arrow, Bilibili description       |
| `text-sm` (14)          | **Default UI size**: nav, buttons, segments, captions, byline, TOC, series rows, license |
| `text-base` (16)        | Bubbles, Quote body, callout title, summaries on `sm+`, hero subtitle       |
| `text-lg` (18)          | Post-list title (mobile), series title, compact profile name, embed name, hero subtitle `sm+` |
| `text-xl` (20)          | Post-list title `sm+`                                                       |
| `text-2xl` (24)         | Wordmark                                                                    |
| `text-3xl`/`4xl`        | Hero name (mobile/`sm+`)                                                    |
| `text-9xl`              | Error page digits (one-off)                                                 |
| `prose md:prose-lg`     | Article body and its headings (typography plugin scale)                     |

Weight and tracking:

- Titles: `font-bold tracking-tight leading-tight` (hero) or
  `leading-snug` (list titles).
- Small UI labels and buttons: `font-medium tracking-wide`.
- All-caps labels: `text-xs font-semibold tracking-wide uppercase` (TOC
  label); `tracking-wider uppercase` for the license line.
- Body: `leading-relaxed`.

## Spacing

Tailwind's 4px scale. Values in use: `0.5 1 1.5 2 3 4 5 6 7 8 10 12 16`.

Page rhythm:

| Where                            | Value                                         |
| -------------------------------- | --------------------------------------------- |
| `<main>` column                  | `max-w-content mx-auto px-0 py-4 sm:px-4 sm:py-10` |
| Between top-level blocks         | `space-y-8`                                   |
| Header inner                     | `px-4 py-2`, `gap-x-8`; nav links `gap-6`     |
| Hero card padding                | `p-6 lg:p-8` (compact: `p-4`)                 |
| List panel padding / item gap    | `px-6 py-8 sm:px-8 sm:py-12` / `gap-12 sm:gap-16` |
| Paper / prose                    | `py-10 sm:px-8` / `px-4`                      |
| Inner card (series)              | `p-6`, outer `m-4`, header-to-list `mb-6`, rows `space-y-2` |
| Row                              | `px-4 py-3 gap-3`                             |
| Button                           | `px-4 py-2 gap-2`                             |

## Radius

`md` 6 · `lg` 8 · `xl` 12 · `2xl` 16 · `3xl` 24 · `full`.

| Radius        | Use                                                             |
| ------------- | --------------------------------------------------------------- |
| `rounded-3xl` | Page surfaces and primary cards (`glass-card`, `panel`, `paper`), bubbles, Quote |
| `rounded-2xl` | Cards nested in a surface (callout, series card, hover wash area) |
| `rounded-xl`  | Buttons, icon tiles, list rows, embed cards                     |
| `rounded-lg`  | Segmented track, number badges, images, code blocks             |
| `rounded-md`  | Segments, inline-code chip, bubble tail corner                  |
| `rounded-full`| Avatars, glow blobs                                             |

Nested surfaces step down one radius at a time. Page-level surfaces go
square and edge-to-edge below `sm` (`max-sm:rounded-none`, built into
`panel` and `paper`); nested cards keep their radius.

## Shadow, blur, depth

- Shadows: `shadow-sm shadow-black/5` on cards and paper;
  `shadow-sm` on the active segment, active series row and avatar photo;
  `shadow-md` on bubbles and the active series badge. Never darker.
- Borders: hairlines only: `border-black/5` (glass), `border-white/20`
  to `/50` (panel, buttons), `border-black/10` (`secondbg`).
- Backdrop blur: `sm` (panel, header, buttons, icon tile, callout),
  `md` (glass-card), `xl` (bubbles, Quote), plain `backdrop-blur` (`secondbg`).
  Always paired with `backdrop-saturate-150` on surfaces.
- Glow-blob blur grows with size: `h-16`–`h-20` → `blur-lg`,
  `h-24` → `blur-xl`, `h-32` → `blur-2xl`. Blob opacity `/15`–`/30`,
  tint opacity ≤ `/40`.
- Z order: decorations `-z-10`, content `relative z-10`, TOC `z-10`,
  header `z-50`.

## Motion

| Duration                     | Use                                                               |
| ---------------------------- | ----------------------------------------------------------------- |
| `duration-150`               | Color changes on links, nav, segments                             |
| `duration-200`               | Everything else: button lift, row background, title color, opacity |
| `transition-*` (no duration) | Tailwind's default 150ms                                          |

- Lifts never exceed `hover:scale-[1.02]` (the only arbitrary value
  allowed outside the flagged list).
- Hover always changes more than color: a lift, more translucency
  (`hover:bg-white/40`), or the `secondbg` wash.
- `Depth3D` (react-spring) tilts the hero and error cards toward the
  cursor: `perspective(1000px)`, scale `0.96` while hovered, `hardness`
  60 on the hero, 20 on the error card.
- Smooth scrolling (TOC) honors `prefers-reduced-motion`.

## Layout

- One column: `max-w-content` (720px), centered. Exception: chart
  pages use the full-width Dashboard shell
  ([charts.md](charts.md#dashboard-shell)).
- Breakpoints are Tailwind's defaults. `sm` (640): surfaces become
  rounded cards with gutters. `md` (768): hero goes side by side,
  prose goes `prose-lg`. `lg` (1024): hero padding grows. `xl` (1280):
  the TOC appears in the right gutter.
- Mobile has zero side gutter: content first.

## Light and dark

Light only. There is no `dark:` variant, no `prefers-color-scheme`
handling, and the Notion renderer is pinned to `darkMode={false}`. Code
blocks are the only dark surface. Dark mode is an open question; do not
add it unasked.

## Off-scale values found on the site

These exist on www.whexy.com but are not part of the scale. Do not copy
them into new work; each is listed in [open-questions.md](open-questions.md).

| Value                                   | Where                                         |
| --------------------------------------- | --------------------------------------------- |
| `#dd9999` / `#bb6666` (`border-[#d99] text-[#b66]`) | Active TOC entry: an untokenized darker rose |
| `duration-300`                          | Post-list row hover wash                      |
| `duration-[0.25s]`                      | Prose link highlighter                        |
| `2.5` (10px): `mb-2.5`, `gap-2.5`, `mt-2.5`, `py-2.5` | Hero card margin, post-list row, 404 button |
| `15` (60px): `h-15 w-15`, `mr-15`       | Embed fallback avatar, 404 title bar          |
| `max-w-175` (700px)                     | Notion page column (everything else is 720)   |
| `text-black` (`#000`)                   | Wordmark, active nav link, post-list rows      |
| `text-[#666]`, `text-[#999]`, `shadow-[0_4px_6px_rgba(0,0,0,0.3)]`, terminal hexes | 404 page terminal mock (deliberate one-off) |
| `0.3em` inline-code radius              | `prism-gruvbox.css`                           |
| `mt-[25vh]`, `max-h-[70vh]`, `min-h-[80vh]` | Error card offset, TOC height, `<main>` height |
