# Blocks and pages

A block is a section built from [components](components.md). Every
page on www.whexy.com is a stack of the blocks below, and nothing else.
When a new screen needs a section none of these can provide, stop and
ask the user whether it belongs before designing one.

The site has **no footer, no publication list, no feature cards, no
forms**. Do not assume them. Pages that show data use the chart blocks
in [charts.md](charts.md) (Dashboard shell, Metric hero, Chart card,
Stat row).

## Blocks

### Page shell

Wraps every page except 404 and the global error.

```tsx
<body>
  <Header />
  <main className="bg-canvas text-ink min-h-[80vh]">
    <div className="max-w-content mx-auto box-border flex w-full flex-col px-0 py-4 sm:px-4 sm:py-10">
      {children}
    </div>
  </main>
</body>
```

Zero side gutter on mobile, so page-level cards touch the screen edges.

### Site header

`header-bar` (sticky, blurred white, `print:hidden`). One row on `sm+`:
wordmark, nav, then the language segmented control pushed right. On
mobile the nav wraps to its own row under the wordmark.

```tsx
<header className="header-bar print:hidden">
  <div className="max-w-content mx-auto flex flex-wrap items-center justify-between gap-x-8 gap-y-1 px-4 py-2">
    <Link href={home}><div className="font-title text-2xl font-semibold text-black">whexy</div></Link>
    <nav className="order-last flex w-full gap-6 pb-1 sm:order-none sm:mr-auto sm:w-auto sm:pb-0">
      {/* nav-link × 3: Blogs, Notion, About (external, rel="me") */}
    </nav>
    {lang && <LanguageSwitcher lang={lang} />}
  </div>
</header>
```

States: current section uses `nav-link-active`; the language switcher
is omitted on pages that exist in one language only.

### Profile hero

The identity card at the top of the home page (site `WelcomeCard`).
`Depth3D hardness={60}` around a page-level `glass-card p-6 lg:p-8`
with the blue/purple/pink tint, three blobs and the shine.

- Text column: name as the page `h1`
  (`font-title text-3xl sm:text-4xl font-bold tracking-tight leading-tight`),
  one line of role (`font-article text-base sm:text-lg leading-relaxed text-ink/80`,
  the organization in full `text-ink`), then a row of `btn-glass` links
  with 20px icons (`flex flex-col gap-3 sm:flex-row sm:gap-4`).
- Photo: 128px (144px from `sm`), `rounded-full shadow-sm`; above the
  text on mobile, right of it from `md`.

### Profile strip

The compact hero, on top of every article (`showButtons={false}`):
`glass-card p-4`, 64px photo left, name as a `<p>` in `text-lg`
(the article title owns the `h1`), role in `text-sm`. No buttons.

### Entry list

A `panel` of [list rows](components.md#list-row), newest first,
filtered to the page language.

### Article

```tsx
<article className="font-article pb-5 sm:pt-10">
  <Prose>
    {/* 1. Fallback note, only when the post is not in the page language:
           <p className="font-sans text-sm opacity-60"><Link …>This post is only available in Chinese.</Link></p> */}
    <h1>{title}</h1>
    <div className="-mt-5 flex items-center justify-between pb-5 font-sans text-sm lg:text-base">
      <div className="inline-flex items-center space-x-1">
        <div>{author} / </div>
        <time dateTime={date}>{format(date, "MMMM dd, yyyy")}</time>
      </div>
    </div>
    {series}   {/* Series card, if the post is in a series */}
    {body}
    {series}   {/* repeated after the body */}
    <License />
  </Prose>
</article>
```

The License line is `font-sans text-sm tracking-wider`:
"© LICENSED UNDER CC BY-NC-SA 4.0". It is the last thing in the paper;
there is no footer.

### Series card

Inside the article (`not-prose relative m-4`): nested
`glass-card rounded-2xl p-6`, red/orange tint and two blobs, header
`mb-6 flex items-center gap-3` with an [icon tile](components.md#icon-tile)
(`BookOpenIcon`, `text-red-700`) and the series name
(`font-title text-lg font-semibold text-ink-glass`), then
[numbered rows](components.md#numbered-row) in `space-y-2`.

### TOC rail

[Table of contents](components.md#table-of-contents), fixed in the
right gutter, `xl` and up, only with 2+ headings.

### Comments

Giscus thread under the article: `<div className="pb-10">` →
`<div className="mx-auto max-w-full px-2">`, loaded lazily, reactions
off. No placeholder while it loads.

### Error card

`mt-[25vh]`, `Depth3D hardness={20}`, page-level `glass-card p-4` with
the hero's tint at higher blob opacity (`/25`–`/30`). Content: the
status code as `font-mono text-9xl` digits with the drawn avatar
(`h-32 w-32`) standing in for the middle "0", then a centered row:
`btn-glass` "Try again" and `btn-solid` "Return to Homepage".

### 404 terminal

A deliberate one-off: a macOS terminal window (dark, its own hex
palette and shadow) playing an animation, then a centered "404",
"Page Not Found", a one-line explanation and a solid "Return to
Homepage" link. It renders without the header and is the only page
that does. Do not reuse its colors elsewhere.

### Notion page

Header (no language switcher) above an opaque white `<main>` with a
700px column, rendered by react-notion-x in light mode. Overrides:
Lato for titles and headings, `rounded-lg` covers, images and callouts,
hairline `border-black/10` gallery cards. When Notion is unreachable:
one centered line, `font-title px-4 py-16 text-center text-ink-subtle`:
"This page is temporarily unavailable. Please try again later."

## Pages as stacks

| Page | Stack (top to bottom) |
| ---- | --------------------- |
| Home (`/en`, `/zh`) | Page shell › Site header › `space-y-8` [Profile hero, Entry list] |
| Article (`/en/posts/x`) | Page shell › Site header › TOC rail (fixed, `xl+`) › Profile strip › Article [fallback note?, title, byline, Series card?, body, Series card?, License] › Comments |
| Error (500 in a page) | Page shell › Site header › Error card |
| Not found (404) | 404 terminal (no shell) |
| Notion (`/dyn`, `/dyn/[id]`) | Site header › Notion page |
| Global error | Unstyled HTML: "Something went wrong." plus "Try again" and a home link; it replaces the document, so it cannot load the site CSS |
