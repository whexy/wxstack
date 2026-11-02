---
name: frost-component
description: Add a new component or change an existing one in the Frost design language (www.whexy.com). Use when a Frost project needs a UI element that blocks and existing components do not cover, or when altering a component's look, variants or states.
---

# Add or change a component

Read first. Load the `frost` skill by name; these paths are inside its directory:
`references/components.md`, `references/foundations.md`,
`references/open-questions.md`, and `assets/components.css`.

## 1. Look for it first

Search components.md and components.css for the job, not the name
(a "pill toggle" is the segmented control; a "tag link card" may be an
embed card or a list row).

- It exists → use it at its default variant. Stop here unless the task
  is to change it.
- It exists but needs a variant or state that is not documented → that
  is a change (step 3), and probably an open question.
- Nothing does the job → step 2.

## 2. New component

1. Find the closest existing component and say which one you derive
   from. Reuse its surface, radius, padding, type and hover language.
2. If there is no close analogue (a new kind of control, a form field,
   a modal, a status badge), **ask the user before building**. Show what
   it is for and which existing component you would derive it from.
3. Build it from tokens and Frost classes only:
   - Surface: `glass-card` (raised), `panel` (list container),
     `paper` (reading), `secondbg` (hover wash).
   - Radius one step below its container (3xl > 2xl > xl > lg > md).
   - Text `text-sm` in `font-title` for controls, `font-article` for
     reading text; colors from the `ink-*` tokens.
   - Hover: lift ≤ `scale-[1.02]`, more translucency, or the wash;
     never a color change alone. `duration-150` for color,
     `duration-200` otherwise.
   - Focus: the accent ring
     (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`).
4. Make it a class in `styles/frost/components.css` only when it is
   pure styling used three or more times; otherwise a React component
   with utilities.

## 3. Change an existing component

1. Find every usage (`rg -n "<ComponentName|class-name"`) and list
   them. A change applies to all of them.
2. Keep every documented state working. Remove a state only if the user
   asked.
3. Add a state only if it is needed now. Pressed, disabled and loading
   do not exist anywhere yet (open question 10): ask before adding one.
4. If the change touches a value on the off-scale list or an open
   question, ask.

## 4. States

For each state the component has, use the existing vocabulary:

| State | Frost vocabulary |
| ----- | ---------------- |
| Hover | Lift, translucency or wash (see above) |
| Current / selected | Raised white (`bg-white` or `bg-white/40`, `shadow-sm`), stronger text; `aria-current` |
| Focus | Accent outline ring |
| Unavailable / error | Same shape; `placeholder` disc, `ink-muted` message, `ink-faint` values; no hover |
| Empty | Render nothing, or ask (open question 15) |

Make the state truthful: what the component shows (current item,
label, count) must come from the same data that decides it.

## 5. Document it

Write an entry for it in the components.md format: when to use, use
instead, default, good example, bad example, states table. Put it in
your summary for the user to approve. Do not edit the shared `frost`
skill folder yourself; it serves every project.

## 6. Review

Run `frost-review` on the changed files and fix every **fail**.
