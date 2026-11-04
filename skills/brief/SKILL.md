---
name: brief
description: Turn a vague intent into a task contract before any work is handed to a model - a written hypothesis, a request brief, and an up-front definition of what counts as done. Invoked explicitly at the start of a non-trivial task, before anything has been produced.
---

# brief

Write the contract before the work, not after.

## When this runs

**Run it** at the start of a task: before the model has produced anything, and again
right before a retry after a failed review.

**Do not run it** once results exist. A brief written after you have seen an answer is
not a brief - it is a justification of that answer, dressed as intent. This is the
single most important rule here; everything else in this skill is machinery around it.

**Context:** the main session. It needs your history, your preferences, and the things
you have already rejected.

## Procedure

### 1. Write down what you think the answer is

One or two sentences, in your own words. A wrong guess is fine and often more useful
than none - you are allowed to change your mind later. The point is to have a prior
that can be contradicted.

Why this matters: once a fluent, confident answer is in front of you, other
possibilities stop being imaginable. The prior is what keeps the answer falsifiable.

### 2. If you have no prior, run a blind spot pass

Give the model only what you already know, and ask for the gaps rather than the answer:

- What questions should I be able to answer before this task is well-defined, that I
  currently cannot?
- What am I assuming that I have not written down?
- What would a reviewer ask in the first five minutes?

Keep this step to the unknowns. If it starts producing a solution, stop it and say so -
you are trying to leave this step with a better question, not an answer.

### 3. Write the request brief

Four lines, no more:

- **Audience** - who receives this, and what they already know.
- **Out of scope** - what this explicitly is not.
- **Definition of done** - what exists when it is finished.
- **Constraints** - the few things that are not negotiable.

Unstated scope is not neutral. A model will fill the gap with something plausible, and
plausible is what you will then have to review.

### 4. Name the verification artifact

Decide now what will serve as evidence, and make it something you can check without
trusting the model's own report:

- a test that currently fails and should pass, by name
- a screenshot of a specific state
- a log line or trace with an expected shape
- a command whose output you will read yourself

"A green check" is not a contract - it does not say what was checked. Write the
criterion so that it names the property, not the signal.

### 5. Rewrite, do not patch

If a second round of corrections still has not landed, stop adjusting the task. The
problem is upstream of the model. Rewrite the brief from scratch, or split it. Further
tweaks will only make it look more specified than it is.

### 6. Close on your own model

End the brief with one line:

> After this task I should be able to explain ___.

If you cannot fill that in, you are about to delegate something you will not be able to
defend later, and no amount of verification will fix that.

## Output

```markdown
## Hypothesis
<one or two sentences; may be wrong>

## Brief
- Audience:
- Out of scope:
- Done when:
- Constraints:

## Verification
- Evidence: <artifact>
- Property it proves: <what failing would look like>

## I should be able to explain
<one line>
```

Hand this to the model as the task, not as commentary next to the task. If the task is
trivial - a rename, a one-line question - skip this skill; the overhead is the point
only when there is something to own.
