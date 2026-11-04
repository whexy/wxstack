---
name: postmortem
description: Recover the parts of your own understanding and intent after a task is decided - interview yourself about what you did not specify, and record what you have stopped practising and what was never checked. Runs after the decision, or immediately after a failed exam.
---

# postmortem

This one is about your input, not the work.

## When this runs

**Run it** in two places:

1. **After the decision** - the work is merged, shipped, or abandoned. This is its
   natural home.
2. **Right after a failed exam** - as a repair step, inside the review window. You did
   not understand the mechanism; the interview is how you find out what you were missing.

**Do not run it:**

- before the verdict on this round's work - it examines your input, so using it to justify
  a decision is deferral with extra steps;
- when another round is still possible and the task description can be rewritten - that
  is brief's job, not this one's.

**Context:** fresh subagent for the interview half; main session for the written record.

## Procedure

### Mode A - interview

Use when the brief was thin, when two rounds of correction failed, or when an exam
exposed a gap between what you asked for and what you understood.

Dispatch a fresh subagent with the artifact and your original request, and this prompt:

> You have this artifact and the request that produced it. You do not know what the
> requester was thinking. Ask them the questions you would need answered to review this
> work properly - the ones the request left open. Ask a few at a time, and wait for
> answers.

Answer in your own words, not by re-reading the work. The questions you cannot answer are
the missing parts of the brief. Two or three rounds is usually enough.

Two rules: the interviewer must not be told the history (it would ask less), and you must
not answer by pointing at the artifact ("it's in there") - that answer means the
requirement was never yours.

### Mode B - record

Use after the decision. Short, and specific to this task:

- What did I stop practising to get this done?
- What did I not check?
- Which criterion passed on a signal rather than on evidence?
- What can I no longer explain?

Then one decision: for each item, keep it, or accept letting it go - explicitly, not by
drift. Silent decay is how the skill disappears without anyone noticing.

### Feeding forward

Mode A's output belongs in the *next* brief, not in this verdict. Write the missing
requirements into the brief template so the next task starts with them. Mode B's output
belongs somewhere it will be seen again - a note, not a file nobody opens.

## Output

```markdown
## Interview
- Q: <question> -> A: <my answer> / could not answer
- Missing from the brief: <requirement>

## Record
| stopped practising | keep / let go |
|---|---|

## Carried forward
- <what goes into the next brief>
```
