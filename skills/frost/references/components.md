# Components

Every component on www.whexy.com, and only those. If a screen needs
something that is not here, it is not part of Frost yet: build it with
the `frost-component` skill, and ask
the user before inventing a new look.

Each entry gives: when to use it, what to use instead, the default
variant, a good and a bad example, and its states. Examples come from
the site source (whexy/blog-1999), with colors rewritten to semantic
tokens. Examples marked *(constructed)* are typical mistakes, not site
code.

States the site never built are written as **none**. Do not invent
them; if you need one, it is an open question.

Contents: [Glass card](#glass-card) · [Panel](#panel) ·
[Paper and Prose](#paper-and-prose) · [Buttons](#buttons) ·
[Segmented control](#segmented-control) · [Nav link](#nav-link) ·
[Icon tile](#icon-tile) · [List row](#list-row) ·
[Numbered row](#numbered-row) · [Table of contents](#table-of-contents) ·
[Callout](#callout) · [Quote](#quote) · [Chat bubbles](#chat-bubbles) ·
[Image and caption](#image-and-caption) · [Code block](#code-block) ·
[Embed card](#embed-card) · [Avatar](#avatar) · [Depth3D](#depth3d)

---

## Glass card

`glass-card` plus decorations (`glass-tint`, `glow-blob`, `glass-shine`).

- **Use for** a raised card that carries identity or navigation: the
  profile hero, the series card, the error card, a callout.
- **Instead:** a list of many entries → [Panel](#panel). Long-form
  text → [Paper](#paper-and-prose). Never put article body text on glass.
- **Default:** `glass-card`, `rounded-3xl`, padding set per instance
  (`p-4`, `p-6 lg:p-8`). Nested inside another surface → `rounded-2xl`.
  Page-level → add `w-full max-sm:rounded-none`.

Good (profile hero):

```tsx
<div className="glass-card mb-2.5 w-full p-6 max-sm:rounded-none lg:p-8">
  <div className="glass-tint from-blue-100/30 via-purple-50/20 to-pink-100/30" />
  <div className="glow-blob top-4 left-4 h-24 w-24 from-blue-200/20 to-cyan-200/20 blur-xl" />
  <div className="glow-blob right-6 bottom-4 h-20 w-20 from-purple-200/15 to-pink-200/15 blur-lg" />
  <div className="glow-blob top-8 right-4 h-16 w-16 from-yellow-200/15 to-orange-200/15 blur-lg" />
  <div className="glass-shine" />
  <div className="relative z-10">{/* content */}</div>
</div>
```

Bad *(constructed)*: re-deriving the surface, opaque border, dark
shadow, content not lifted above the decorations.

```tsx
<div className="rounded-3xl border border-neutral-300 bg-white/30 shadow-lg backdrop-blur-md">
  <div className="glow-blob ... " />
  <p>content</p>
</div>
```

Tint palettes in use: blue/purple/pink (+cyan, yellow/orange blobs) for
identity cards; red/orange for the series card; neutral for Quote.

| State    | Look                                   |
| -------- | -------------------------------------- |
| Hover    | None on the card itself; wrap in [Depth3D](#depth3d) for tilt |
| Pressed, loading, empty, disabled, error | none |

## Panel

`panel`: translucent white container that holds a list.

- **Use for** the page-level list of entries (the post list).
- **Instead:** one raised card → Glass card; reading → Paper.
- **Default:** `panel flex w-full flex-col gap-12 overflow-hidden px-6 py-8 sm:gap-16 sm:px-8 sm:py-12`.

Good (post list):

```tsx
<div className="panel flex w-full flex-col gap-12 overflow-hidden px-6 py-8 sm:gap-16 sm:px-8 sm:py-12">
  {posts.map(post => <PostRow key={post.slug} {...post} />)}
</div>
```

Bad *(constructed)*: `<div className="glass-card p-8">` around a long
list: glass is for a single raised card, and the list loses the white
legibility of `panel`.

| State | Look |
| ----- | ---- |
| Empty | none: an empty list renders an empty panel |
| Others | none |

## Paper and Prose

`paper` is the opaque reading surface; `Prose` is the typography
wrapper inside it.

- **Use for** any long-form text: articles, docs, about pages.
- **Instead:** short UI text → glass or panel.
- **Default** (site `components/Layouts/Prose.tsx`):

```tsx
<div className="paper mx-auto w-full max-w-full py-10 sm:px-8">
  <div className="prose prose-neutral md:prose-lg prose-headings:font-title prose-a:break-words prose-a:no-underline prose-a:shadow-[inset_0_-0.4rem_0_var(--color-accent)] prose-a:transition-all prose-a:duration-[0.25s] prose-a:hover:bg-accent mx-auto !max-w-none px-4 break-words">
    {children}
  </div>
</div>
```

Links are a rose highlighter: a 0.4rem inset underline that fills the
word on hover. Headings render in `font-title`; body in `font-article`
(set on the `<article>`). Headings get `scroll-mt-24` so anchors clear
the sticky header. Components embedded in prose that bring their own
styling add `not-prose`. Small print inside prose is
`<Small>`: `text-xs opacity-80 md:text-sm`.

Bad *(constructed)*: `prose-a:text-blue-600 prose-a:underline`. Links
are never blue text; the accent is the highlighter.

| State | Look |
| ----- | ---- |
| Link hover | Highlighter fills the link background with `accent` (0.25s, off-scale; see open questions) |
| Link focus | Browser default inside prose |
| Others | none |

## Buttons

`btn-glass` and `btn-solid`. Both render as `<Link>` or `<button>`.

- **Use `btn-glass`** for actions sitting on glass (hero social links,
  "Try again"). It is the default.
- **Use `btn-solid`** for the single primary action in a group
  ("Return to Homepage").
- **Instead:** navigation inside text → a prose link; header
  navigation → [Nav link](#nav-link).
- **Icons:** 20px (`h-5 w-5`), `fill="currentColor"`, before the label;
  `gap-2` is built in.

Good (error card):

```tsx
<div className="relative flex justify-center gap-3">
  <button type="button" className="btn-glass" onClick={() => reset()}>
    Try again
  </button>
  <Link className="btn-solid" href="/">Return to Homepage</Link>
</div>
```

Bad (site 404 page, re-implements `btn-solid` inline with off-scale
padding and its own hover):

```tsx
<Link href="/" className="bg-black-readable text-white-readable inline-block rounded-xl px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 sm:px-6 sm:py-3 sm:text-base">
```

| State    | `btn-glass`                                                    | `btn-solid` |
| -------- | -------------------------------------------------------------- | ----------- |
| Hover    | `scale-[1.02]`, `bg-white/40`, `border-white/50`, 200ms         | none (open question) |
| Focus    | `outline-2 outline-offset-2 outline-accent`                    | same        |
| Pressed, loading, disabled | none                                         | none        |

## Segmented control

`segmented` track + `segmented-item` with `segmented-active` or
`segmented-idle`. The site uses it as the language switcher.

- **Use for** switching between 2–3 parallel views of the same page
  (languages).
- **Instead:** site sections → nav links; actions → buttons.
- **Default:** links, the current one marked `aria-current="page"`.

Good (`LanguageSwitcher`):

```tsx
<div className="segmented">
  {locales.map(l => (
    <Link
      key={l}
      href={pathFor(l)}
      hrefLang={l}
      aria-current={l === lang ? "page" : undefined}
      className={`segmented-item ${l === lang ? "segmented-active" : "segmented-idle"}`}>
      {labels[l]}
    </Link>
  ))}
</div>
```

Bad *(constructed)*: a blue pill for the active item
(`bg-blue-500 text-white`). Active is a raised white segment, not color.

| State   | Look |
| ------- | ---- |
| Active  | `bg-white text-ink-strong shadow-sm` |
| Hover (idle) | `text-ink-subtle` → `text-ink-strong`, 150ms |
| Focus   | accent outline |
| Pressed, disabled | none |

## Nav link

`nav-link` (+ `nav-link-active`): Lato `text-sm font-medium`.

- **Use for** top-level site sections in the header.
- **Instead:** in-page actions → buttons; prose → prose links.
- **Default:** idle `text-ink-soft`; current section adds
  `nav-link-active` and `aria-current="true"`. External links (About)
  stay plain `nav-link`.

Good:

```tsx
<Link href={`/${lang}`} aria-current={isBlogPage ? "true" : undefined}
  className={`nav-link ${isBlogPage ? "nav-link-active" : ""}`}>
  Blogs
</Link>
```

Bad *(constructed)*: `text-gray-600 hover:text-blue-600 underline`.

| State  | Look |
| ------ | ---- |
| Hover  | `text-ink-strong`, 150ms |
| Active | `text-black` (pure black; open question) |
| Focus  | accent outline |

## Icon tile

`icon-tile`: 40px `rounded-xl` tile behind a 20px icon.

- **Use for** the leading icon of a card header (series card).
- **Default:** gradient stops inline from the card's tint palette, icon
  one shade darker: `icon-tile bg-gradient-to-br from-red-500/20 to-orange-500/20` with `h-5 w-5 text-red-700`.

Bad *(constructed)*: a bare icon with no tile next to a card title, or
a solid `bg-red-500` tile.

States: none.

## List row

The post-list entry (site `PostCard`). A title and an optional summary,
the whole row is one link.

- **Use for** entries in a `panel` that each lead to a page.
- **Instead:** ordered steps in a sequence → [Numbered row](#numbered-row).

Good:

```tsx
<Link href={url} className="group">
  <div className="group-hover:secondbg -m-4 rounded-2xl p-4 transition-all duration-300">
    <h3 className="font-title text-lg leading-snug font-bold tracking-tight transition-colors duration-200 group-hover:text-ink-glass sm:text-xl">
      {title}
    </h3>
    <p className="font-article mt-2.5 text-sm leading-relaxed opacity-60 transition-opacity duration-200 group-hover:opacity-80 sm:text-base">
      {summary}
    </p>
  </div>
</Link>
```

The `-m-4 p-4` lets the hover wash bleed past the text without shifting
it. The site wraps the row in `text-black`, `duration-300` and
`mt-2.5`; all three are off-scale (see open questions).

Bad *(constructed)*: a bordered card per post
(`border rounded-xl p-4 mb-4`). Rows are borderless; the wash appears
only on hover.

| State | Look |
| ----- | ---- |
| Hover | `secondbg` wash on a `rounded-2xl` area; title to `ink-glass`; summary 60→80% opacity |
| Focus | Browser default (no accent ring on this link) |
| Empty, loading, disabled | none |

## Numbered row

The rows of the series card: a numbered badge and a title.

- **Use for** an ordered sequence where one item is "you are here".
- **Default:** inside a glass card, `space-y-2`:

```tsx
<Link href={href} className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
  isActive ? "bg-white/40 shadow-sm" : "hover:bg-white/20"}`}>
  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-all ${
    isActive
      ? "bg-gradient-to-br from-red-500 to-orange-600 text-white shadow-md"
      : "bg-white/30 text-ink-subtle group-hover:bg-white/50"}`}>
    {index + 1}
  </span>
  <span className={`text-sm leading-tight ${
    isActive ? "font-semibold text-ink-strong" : "text-ink-soft group-hover:text-ink-strong"}`}>
    {title}
  </span>
</Link>
```

Bad *(constructed)*: marking the current item with a checkmark or a
green badge.

| State   | Look |
| ------- | ---- |
| Current | Raised `bg-white/40 shadow-sm`; gradient badge with white number; semibold title |
| Hover   | `bg-white/20`; badge `bg-white/50`; title `ink-strong` |
| Others  | none |

## Table of contents

Site `JumpTable`: a fixed rail in the right gutter of the 720px column.

- **Use for** long articles with 2+ headings, on `xl` screens only.
- **Default:**

```tsx
<nav aria-label="Table of contents"
  className="fixed top-32 right-[max(1.5rem,calc((100vw-720px)/2-15rem))] z-10 hidden max-h-[70vh] w-56 overflow-y-auto font-sans xl:block">
  <p className="text-ink/40 mb-3 text-xs font-semibold tracking-wide uppercase">On this page</p>
  <ul className="border-rule space-y-1 border-l">
    {/* li > a: "-ml-px block border-l py-1 text-sm leading-snug transition-colors duration-200", pl-4 (h2) / pl-7 (h3) */}
  </ul>
</nav>
```

Active section is tracked with an IntersectionObserver
(`rootMargin: "-96px 0px -70% 0px"`); clicks smooth-scroll unless
`prefers-reduced-motion`.

Bad (site code, off-token colors for the active entry):
`border-[#d99] font-medium text-[#b66]`. Keep it as is when reproducing
the site; do not reuse these hexes elsewhere (open question
"Accent strong").

| State  | Look |
| ------ | ---- |
| Idle   | `border-transparent text-ink-muted` |
| Hover  | `text-ink-strong` |
| Active | rose border and text, `font-medium` |
| Empty  | Renders nothing with fewer than 2 headings; hidden below `xl` |

## Callout

An aside inside an article: optional title, optional faded emoji or
image watermark top-right.

- **Use for** a self-contained note, definition, or digression.
- **Instead:** someone else's words → [Quote](#quote); the author
  talking to the reader → [Chat bubbles](#chat-bubbles).
- **Default:** `glass-card z-10 rounded-2xl px-4 py-1 backdrop-blur-sm`;
  title `font-sans text-base font-semibold md:text-lg`; body
  `prose-sm md:prose`; emoji watermark `h-24 w-24 opacity-30`
  (Twemoji), image watermark `opacity-20`, 96px.

```tsx
<Callout title="When Not to Use ORM" icon="🤔">…</Callout>
```

Bad *(constructed)*: a colored "warning" callout (`bg-amber-50
border-amber-400`). Callouts are neutral glass; there are no status
variants.

States: none. Inline code inside a callout uses a `neutral-200` chip
(`code.css`).

## Quote

Pull quote with large serif quote marks and an optional citation link.

- **Use for** quoting someone else.
- **Default:** a neutral variant of glass, kept inline in the
  component (single-use flourish):
  `rounded-3xl border border-white/20 bg-gradient-to-br from-neutral-100/80 via-neutral-50/60 to-neutral-100/40 p-8 shadow-sm backdrop-blur-xl`;
  body `text-base leading-relaxed font-medium tracking-wide text-ink-glass`;
  marks `font-serif text-neutral-300/60`; cite
  `border-l-2 border-neutral-200/50 pl-4`, `text-sm font-semibold text-ink-subtle`,
  subcite `text-sm text-ink-muted`.

Bad *(constructed)*: Markdown `>` blockquote styled with a colored left
border. Use the component.

| State | Look |
| ----- | ---- |
| Cite hover (with `url`) | `translate-x-1`; cite to `ink-glass`, subcite to `ink-subtle`, 200ms |
| Others | none |

## Chat bubbles

`Dialog` (author, right, blue) and `DialogBack` (other voice, left,
gray), each with the drawn avatar (`h-12 w-12`; mirrored for the peer).

- **Use for** asides in the author's own voice, or a back-and-forth
  with the reader.
- **Instead:** neutral notes → Callout.

```tsx
<div className="not-prose my-3 ml-4 flex break-inside-avoid-page items-end justify-end gap-2">
  <div className="bubble bubble-me">
    <div className="absolute inset-0 bg-white/10" />
    <div className="relative">{children}</div>
  </div>
  <Avatar className="h-12 w-12" />
</div>
```

Bad *(constructed)*: other bubble colors (green "peer"). Blue is the
author, gray is everyone else.

| State | Look |
| ----- | ---- |
| Link  | Underlined, `↗` appended; hover: me `blue-100`→white, peer `ink-subtle`→`ink-strong` |
| Others | none |

## Image and caption

Markdown images (site `ImgComponent`).

- **Default:** `mx-auto rounded-lg`, sized from the file; the alt text
  doubles as a caption: `pt-2 text-center font-sans text-sm opacity-80`.
  Wrapper `not-prose break-inside-avoid-page`. Local paths resolve under
  `public/`; remote URLs render as a lazy `<img>`.
- **Instead:** SVG diagrams → `Diagram` (same caption style, no
  radius) or inline Typst SVG (`typst-diagram`).

Bad *(constructed)*: `rounded-3xl shadow-lg` on content images.

| State | Look |
| ----- | ---- |
| Error | A missing local file fails the build with a message naming the expected path |
| Others | none |

## Code block

Gruvbox dark `pre` (`prism-gruvbox.css`), `rounded-lg`, optional title
bar from rehype-code-titles: `rounded-t-lg`, gruvbox `bg0_soft`, mono
bold `text-sm`, `> ` prefix and a gruvbox-red dot. Diff lines tint
green/red at 15%; highlighted lines get gruvbox `bg1` and a blue left
border. All in `code.css`.

- **Instead:** inline code → `<code>` in prose (see open question
  "Inline code chip").

Bad *(constructed)*: a light code theme or a different dark theme.

States: none.

## Embed card

External-resource card (site `GithubRepo`, `Bilibili`): `secondbg`
wash, `rounded-xl`, avatar/cover left, name and stats right.

- **Use for** a link to a repository or video that deserves more than
  inline text.
- **Default** (GithubRepo): `not-prose mx-auto max-w-xl font-sans`,
  link `secondbg block overflow-hidden rounded-xl`, body
  `flex space-x-4 p-4`, 60px round avatar, name `text-lg` with the repo
  in `font-semibold`, description `text-sm`, stats row `text-sm` with
  16px icons, language bar `h-1.5` at the bottom.

| State   | Look |
| ------- | ---- |
| Hover   | GithubRepo: `sm:hover:scale-[1.02]`, 200ms (only when data loaded). Bilibili: none |
| Loading | none (server-rendered) |
| Error / unavailable | Same card: `placeholder` disc with an `ink-faint` glyph, message in `ink-muted` ("Repository information unavailable"), stats shown as `-` in `ink-faint`, no language bar, no hover lift |

Bad *(constructed)*: a red error box when the API fails. Unavailable
data is shown in neutral tones inside the same shape.

## Avatar

Two kinds: the **photo** (`rounded-full object-cover shadow-sm`,
144px hero / 64px compact, `next/image` with `priority`) and the
**drawn avatar** SVG used beside bubbles and in the error card
(`h-12 w-12`, mirrored with `scale(-1, 1)` for the peer).

- Embed avatars: 60px, `rounded-full`.

States: none.

## Depth3D

Client wrapper that tilts its child toward the cursor (react-spring).

- **Use for** the one identity card on a page (hero, error card).
  `hardness` 60 on the hero (subtle), 20 on the error card.
- **Instead:** never on lists, prose, or more than one element per
  screen.

```tsx
<Depth3D hardness={60}>
  <div className="glass-card …">…</div>
</Depth3D>
```

| State | Look |
| ----- | ---- |
| Hover | Rotates toward the cursor, scales to 0.96; springs back on leave |
| Reduced motion | Not handled (open question) |
