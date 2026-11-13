/**
 * Frost chart geometry: framework-free helpers that turn data into SVG
 * path strings, ticks and labels. Measurements come from
 * ../references/charts.md; colors stay in CSS (`stroke-series-1`,
 * `fill-axis`), never here.
 */

export type Point = readonly [x: number, y: number];

/** Plot geometry shared by every Frost chart (px). */
export const CHART = {
  line: 2,
  dot: 4, // radius; with `ring` it reads as an 8px marker on a 2px white ring
  ring: 2,
  barMax: 24,
  barGap: 4, // between columns
  barRadius: 6, // radius-md, data end only
  dash: "4 4", // projected values only
  areaTop: 0.16, // single series; area fades to 0 at the baseline
  areaTopMulti: 0.12,
  areaTopFocus: 0.22,
  labelGap: 12, // minimum space between two x-axis labels
  margin: { top: 8, right: 8, bottom: 28, left: 44 },
} as const;

/**
 * Monotone cubic curve (Fritsch–Carlson): smooth, but never overshoots
 * a data point, so a peak drawn is a peak measured.
 */
export function monotonePath(pts: readonly Point[]): string {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M${pts[0][0]},${pts[0][1]}`;
  if (n === 2) return `M${pts[0][0]},${pts[0][1]}L${pts[1][0]},${pts[1][1]}`;
  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1][0] - pts[i][0];
    m[i] = (pts[i + 1][1] - pts[i][1]) / dx[i];
  }
  const t: number[] = [m[0]];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  t[n - 1] = m[n - 2];
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i] / m[i];
    const b = t[i + 1] / m[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      t[i] = k * a * m[i];
      t[i + 1] = k * b * m[i];
    }
  }
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += `C${pts[i][0] + h},${pts[i][1] + t[i] * h} ${pts[i + 1][0] - h},${pts[i + 1][1] - t[i + 1] * h} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
}

/** Straight segments with vertical jumps, for values that change in steps. */
export function stepPath(pts: readonly Point[]): string {
  return pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join("");
}

/** Close a line path down to the baseline, for the area wash under it. */
export function areaPath(line: string, x0: number, x1: number, baseline: number): string {
  return `${line}L${x1},${baseline}L${x0},${baseline}Z`;
}

/** A column grown from the baseline, rounded at the data end only. */
export function columnPath(cx: number, width: number, top: number, baseline: number): string {
  const r = Math.min(CHART.barRadius, width / 2, baseline - top);
  const x0 = cx - width / 2;
  const x1 = cx + width / 2;
  return `M${x0},${baseline}V${top + r}Q${x0},${top} ${x0 + r},${top}H${x1 - r}Q${x1},${top} ${x1},${top + r}V${baseline}Z`;
}

/** Column width for a band: capped at 24px, the rest of the band is air. */
export function columnWidth(band: number): number {
  return Math.min(CHART.barMax, Math.max(CHART.barGap, band - CHART.barGap));
}

/** Round ticks from 0 that cover `max`, about `count` steps (1, 2, 2.5, 5 × 10ⁿ). */
export function niceTicks(max: number, count = 3): number[] {
  if (!(max > 0)) return [0, 1];
  const raw = max / count;
  const p = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((k) => k * p).find((s) => s >= raw)!;
  const ticks: number[] = [];
  for (let v = 0; v < max + step / 2; v += step) ticks.push(+v.toPrecision(12));
  if (ticks[ticks.length - 1] < max) ticks.push(+(ticks[ticks.length - 1] + step).toPrecision(12));
  return ticks;
}

/** 1,284 · 12.9K · 4.2M · 12.2B. */
export function compact(v: number): string {
  const a = Math.abs(v);
  const f = (x: number, s: string) =>
    (Math.abs(x) >= 100 ? x.toFixed(0) : x.toFixed(1).replace(/\.0$/, "")) + s;
  if (a >= 1e9) return f(v / 1e9, "B");
  if (a >= 1e6) return f(v / 1e6, "M");
  if (a >= 1e4) return f(v / 1e3, "K");
  return Math.round(v).toLocaleString("en-US");
}

export type XLabel = { x: number; text: string; anchor: "start" | "middle" | "end" };

/**
 * Place x-axis labels and drop the ones that would touch a neighbour,
 * keeping the most recent. `charWidth` approximates text-xs Fira Sans.
 */
export function placeXLabels(
  ticks: readonly { x: number; text: string }[],
  left: number,
  right: number,
  charWidth = 6.6,
): XLabel[] {
  const out: XLabel[] = [];
  let edge = Infinity;
  for (let i = ticks.length - 1; i >= 0; i--) {
    const { x, text } = ticks[i];
    const w = text.length * charWidth;
    const anchor: XLabel["anchor"] =
      i === 0 && x - left < w / 2 ? "start" : i === ticks.length - 1 && right - x < w / 2 ? "end" : "middle";
    const a = anchor === "start" ? x : anchor === "end" ? x - w : x - w / 2;
    if (a + w + CHART.labelGap > edge) continue;
    edge = a;
    out.unshift({ x, text, anchor });
  }
  return out;
}

/** Index of the data point nearest a pointer x, for crosshair and keyboard tracking. */
export function nearestIndex(xs: readonly number[], px: number): number {
  let best = 0;
  for (let i = 1; i < xs.length; i++) if (Math.abs(xs[i] - px) < Math.abs(xs[best] - px)) best = i;
  return best;
}

/** Tooltip offset beside the crosshair, flipped to the left near the right edge. */
export function tipLeft(x: number, tipWidth: number, plotWidth: number, gap = 16): number {
  const right = x + gap;
  if (right + tipWidth <= plotWidth) return right;
  const left = x - gap - tipWidth;
  return left >= 0 ? left : Math.max(0, Math.min(plotWidth - tipWidth, x - tipWidth / 2));
}
