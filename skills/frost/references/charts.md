# Charts

How Frost draws data. www.whexy.com has no charts; everything here is
the user's decision, made on a specimen of every pattern below:
[`../assets/charts-specimen.html`](../assets/charts-specimen.html)
(open it in a browser; it is interactive).

Files: classes in [`../assets/charts.css`](../assets/charts.css),
geometry helpers in [`../assets/charts.ts`](../assets/charts.ts),
series tokens in [`../assets/tokens.css`](../assets/tokens.css).

Contents: [Principles](#principles) · [Pick the form](#pick-the-form) ·
[Color](#color) · [Marks](#marks) · [Axes and text](#axes-and-text) ·
[Legend and labels](#legend-and-labels) · [Interaction](#interaction) ·
[States](#states) · [Blocks](#blocks) · [Bad examples](#bad-examples)

## Principles

- **Data sits on paper.** A chart is reading, so its surface is opaque
  `paper`. The one glass element inside a chart is the tooltip, which
  floats over the marks.
- **Color is identity.** A hue means "this entity" and nothing else:
  not size, not rank, not good or bad. Totals and everything around
  the data stay neutral.
- **The data is the only loud thing.** Hairline grid, small muted axis
  text, no borders around marks, no chart backgrounds.
- **No width limit.** A chart fills its container. A page built
  around data uses the [Dashboard shell](#dashboard-shell), which drops
  the 720px column; reading pages keep it.
- **Light only**, like the rest of Frost (open question 1).

## Pick the form

| The data's job | Form | Block |
| -------------- | ---- | ----- |
| One number that matters most | Hero figure, with a `delta-chip` if it changed | [Metric hero](#metric-hero) |
| A few numbers side by side | Stat row (2 columns on phones, 4 from `sm`), optional sparkline | [Stat row](#stat-row) |
| Change over time, 1–6 entities | Line with area wash | [Chart card](#chart-card) |
| One total per period (day, week) | Columns | Chart card |
| Measured, then forecast | Line: recorded solid, projected dashed, a Now marker | Chart card |
| Ranking or share of a total | Ranked bars | Chart card |
| One whole split into ≤6 parts | Segmented whole (28px) | Chart card |

Never: pie or donut (use ranked bars or the segmented whole), two
y-axes on one plot (use two charts, or index both to 100), 3D,
radar, a one-bar bar chart (use a hero figure or a stat).

## Color

### Series slots

| Token | Primitive | Contrast on white |
| ----- | --------- | ----------------- |
| `series-1` | `blue-500` | 3.8:1 |
| `series-2` | `orange-500` | 2.9:1, needs a legend and direct label |
| `series-3` | `pink-500` | 3.6:1 |
| `series-4` | `cyan-600` | 3.6:1 |
| `series-5` | `purple-500` | 4.1:1 |
| `series-6` | `yellow-600` | 2.9:1, needs a legend and direct label |
| `series-other` | `neutral-400` | The folded tail: "Other" |
| `series-total` | `neutral-800` | Aggregates that belong to no one entity |
| `series-muted` | `neutral-300` | Series pushed back while another is emphasized |

The hues are the families of Frost's glows (blue/pink/purple from the
hero, orange from the series card, cyan and yellow from the blobs).
Blue goes first because blue is already the author in `bubble-me`: on a
personal page, slot 1 is "me".

- **Assign in slot order and keep each entity's slot.** Claude is
  `series-1` in the usage chart, the ranked list and the quota chart.
  A filter that removes an entity never repaints the others.
- **Six entities at most.** The seventh and later fold into "Other"
  (`series-other`), listed last. Never generate a seventh hue.
- **Three when any two marks can meet.** The order is validated for
  neighbours (lines, stacks, bars, legends). Forms where any two series
  can sit side by side (scatter, dot plots, small multiples) use slots
  1–3 only; past three, fold or split the chart.
- **Totals are neutral.** A sum across entities, or a metric of no one
  entity (requests per day), uses `series-total`, never `series-1`.
- **One color dimension per view.** When entities already own the
  hues, a breakdown along another dimension (token type) uses the
  neutral ramp: `series-muted`, `series-other` (`neutral-400`),
  `ink-muted`, `series-total`.
- **Emphasis is gray, not a brighter hue.** To bring one series
  forward, turn the rest `series-muted` and drop their area.
- **Text never wears a series color.** Labels, values and legends stay
  `ink-*`; the colored key beside the text carries identity.
- **No status colors.** Direction is an arrow in a neutral
  `delta-chip` ("↓ 24.8 kg · 24.4%"); whether that is good is the
  reader's call. Thresholds and limits are `axis` hairlines.

Run the validator before changing a slot: the dataviz skill's
`validate_palette.js` against white, adjacent pairs for all six and
`--pairs all` for the first three. With the tokens above: worst
adjacent color-blind ΔE 10.2, worst normal-vision ΔE 19.6; first three
all-pairs 15.6 / 19.6.

### Accent

A range the reader selects (drag to compare) is painted `accent`, the
same dusty rose as text selection: `fill-accent/40` across the plot,
1.5px `stroke-accent` hairlines at both edges, and a
`chart-range-chip` above with the change. Nothing else in a chart uses
the accent.

## Marks

Constants are in `CHART` (charts.ts).

| Mark | Spec |
| ---- | ---- |
| Line | 2px, round joins and caps, `monotonePath` (smooth, never overshoots a value) |
| Stepped value (quota, balance) | `stepPath`, 2px |
| Area | Linear gradient of the series color, top stop 16% (multi-series 12%, emphasized 22%) to 0 at the baseline |
| Projected | Same line, `stroke-dasharray: 4 4`; its area at half the opacity. Dashes mean projected and nothing else |
| Dot | r 4 in the series color with a 2px white ring; only at the endpoint, under the crosshair, and at selection edges |
| Column | `columnWidth(band)`: band − 4px, at most 24px; rounded `radius-md` at the data end only (`columnPath`) |
| Ranked bar | `rank-track` (6px, `bg-black/5`, full radius) with a `rank-fill` in the entity's color |
| Segmented whole | `whole`: 28px, 2px gaps, `rounded-md` parts, widths proportional; a value prints inside only if it fits (white, or `text-ink` on `series-muted`) |
| Sparkline | 28px tall, 1.5px `stroke-series-other` line, last point r 3 in `series-total` with a white ring; no axes |
| Gridline | 1px `stroke-rule`, solid, crisp edges; 3–4 lines |
| Baseline | 1px `stroke-axis` |
| Crosshair | 1px `stroke-axis`, full plot height |
| Now / phase marker | 1px hairline (`stroke-ink-faint` for Now, `stroke-axis` for a phase), label at the foot of the plot |

No borders around marks, no drop shadows on marks, no entrance
animation.

Plot heights: 220px for columns, 260px for a multi-series line, 300px
for a single-series trend or projection, 180px for an empty frame.
Margins `CHART.margin`; the left margin holds the y labels.

## Axes and text

- **Y labels** in the left gutter, right-aligned 8px from the plot,
  `text-xs text-ink-muted tabular-nums`. Ticks from `niceTicks`,
  starting at 0 for columns and areas. A trend whose range is far from
  0 (body weight) may start near its minimum; its area then fills to
  the plot floor, and the y labels show where that floor is.
- **X labels** below the plot, culled by `placeXLabels` so they never
  touch (the most recent survive). Dates as "Nov 13", hours as "14:00",
  weekdays as "Fri 13".
- **Numbers** through `compact`: full below 10,000 (2,490), then 12.9K,
  4.2M, 12.2B.
- **Chart title** `chart-title`: Lato `text-lg` bold, `ink-glass`. A
  total or range for the chart goes on the right of the title row in
  `text-sm text-ink-muted`.
- **Hero figure** `figure-hero` (Lato 60px bold, tight) with
  `figure-unit`. One per view.
- **Marker labels** `chart-mark`: `text-xs` uppercase, `ink-faint`.

## Legend and labels

- **Two or more series: a legend**, above the plot, `chart-legend`,
  one `chart-legend-item` button per series: key, name, total. Order
  is slot order.
- **One series: no legend.** The card title names it.
- **Direct labels are rare.** The endpoint dot, a reset jump ("+49%"),
  the Now marker. Never a value on every point.
- **Keys:** `chart-key` (8px dot) for series, `chart-key-line` for a
  solid line, `chart-key-dash` for projected.

## Interaction

Every chart that has a plot is interactive.

| Input | Response |
| ----- | -------- |
| Pointer over the plot | Crosshair at the nearest x (`nearestIndex`), a ringed dot on each visible series, `chart-tip` beside it (`tipLeft`). Tooltip: date in `chart-tip-when`, one `chart-tip-row` per series sorted by value, a `chart-tip-total` row when series add up |
| Pointer over a column | That column stays `series-total`, the rest turn `series-muted`; tooltip with date and value |
| Hover or focus a legend item | Its series comes forward (area at 22%), the others turn `series-muted`; legend items other than it fade to 45% opacity |
| Drag across a trend | Accent range plus `chart-range-chip` ("Jul 1 → Aug 31 · −6.4 kg in 61 d"); Escape or a click clears it |
| Tab to the plot | `chart-plot` is `tabindex="0"` with the accent ring; ←/→ move the crosshair, Escape hides it |
| Range or metric switch | `segmented` above the chart, right-aligned with the title or hero figure |

- **One data source.** The hero figure, legend totals, stats and plot
  all recompute from the same filtered data when the range changes.
- Transitions are the usual 150ms (color, opacity) and 200ms.
- Give the plot an `aria-label` naming what it shows.

## States

| State | Look |
| ----- | ---- |
| Empty | The chart frame (grid, x labels, no y labels, no marks) with `chart-empty` centered: "No usage in this range" |
| Unavailable value | Same stat shape, `stat-value stat-value-none` showing "–" |
| Loading | none (open question 10): ask before designing one |
| Emphasized | See interaction; `series-muted` for the rest |

## Blocks

### Metric hero

The headline of a page about one quantity. A page-level `glass-card`
with the profile hero's tint and blobs, or the top of a chart card
when the page has only one chart.

```tsx
<div className="glass-card w-full p-6 max-sm:rounded-none lg:p-8">
  {/* tint, blobs, shine as in the Profile hero */}
  <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
    <div>
      <p className="text-ink-muted text-sm">Oct 15 to Nov 13</p>
      <p className="figure-hero mt-2">12.2B</p>
      <p className="text-ink-muted mt-2.5 text-sm">4,766 sessions · $4,905.16</p>
    </div>
    <div className="segmented">{/* 24h · 7 days · 30 days */}</div>
  </div>
</div>
```

### Chart card

```tsx
<section className="paper p-6">
  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
    <h2 className="chart-title">Processed tokens</h2>
  </div>
  <ul className="chart-legend mb-3">
    <li>
      <button className="chart-legend-item">
        <span className="chart-key bg-series-1" />Claude <span className="chart-legend-value">10.7B</span>
      </button>
    </li>
  </ul>
  <div className="chart-plot" tabIndex={0} aria-label="Processed tokens per day by model family">
    <svg>{/* rule grid, axis baseline, areas, lines */}</svg>
    <div className="chart-tip">{/* rows */}</div>
  </div>
</section>
```

`paper` goes square and edge to edge below `sm` on its own. Between
chart cards: `space-y-8`, like other blocks.

### Stat row

```tsx
<div className="stat-row">
  <div className="stat">
    <p className="stat-label">Cached input</p>
    <p className="stat-value">11.8B</p>
    <p className="stat-note">+21% vs prior 30 days</p>
  </div>
</div>
```

Inside a chart card or under a hero figure. A note says what a change
is measured against.

### Dashboard shell

The Page shell without `max-w-content`, for pages whose content is
charts. Below `lg` the cards stack as in any page; from `lg` they sit
in a 3-column grid.

```tsx
<main className="bg-canvas text-ink min-h-[80vh]">
  <div className="box-border flex w-full flex-col gap-8 px-0 py-4 sm:px-4 sm:py-10 lg:px-8">
    <div className="grid items-start gap-8 lg:grid-cols-3">
      <div className="flex min-w-0 flex-col gap-8">{/* Metric hero, ranked bars */}</div>
      <div className="flex min-w-0 flex-col gap-8 lg:col-span-2">{/* chart cards */}</div>
    </div>
    {/* a wide trend: one full-width chart card */}
    <div className="grid items-start gap-8 lg:grid-cols-2">{/* two chart cards */}</div>
  </div>
</main>
```

- The headline goes top left: Metric hero over the list it sums up
  (ranked bars), beside the main chart in `lg:col-span-2`.
- A long time series gets a full-width row; peers share a
  `lg:grid-cols-2` row.
- Gaps are `gap-8`, the same rhythm as `space-y-8` between blocks.
- Plot heights stay fixed at every width; only the x-axis stretches.
- `min-w-0` on every column, so a chart can shrink below its SVG width.

### Example stack

```
Dashboard shell › [lg:grid-cols-3: (Metric hero, Chart card: ranked bars)
| lg:col-span-2 (Chart card: multi-series line, Chart card: segmented
whole + stat row)] › Chart card: single-series trend › [lg:grid-cols-2:
Chart card: projection | Chart card: columns]
```

## Bad examples

*(constructed)*

- `stroke="#22c55e"` on a line that went up: a status color, and a raw
  hex. Use the entity's slot; direction goes in a `delta-chip`.
- A chart on `glass-card`: the blur behind thin lines costs
  legibility. Use `paper`.
- Coloring the bars of one series darker where they are taller: the
  height already says it. One series is one color.
- `series-1` for "requests per day": a total belongs to no entity. Use
  `series-total`.
- A number above every column, or a weekly average label on every
  week: label the endpoint and let the tooltip carry the rest.
- Dashed gridlines: dashes mean projected.
- `text-series-2` on a legend label: orange text fails contrast. Color
  the key, not the text.
- A seventh family in a generated teal: fold it into "Other".
