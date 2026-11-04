---
name: counter
description: Have a different model argue the strongest case against a position you have already taken, so you can find out whether the position survives opposition before you act on it. Runs on a formed position, not on an open question.
---

# counter

Attack the position, not the person holding it.

## When this runs

**Run it** after you have formed a position on something open-ended and before you act
on it: a design choice, a strategy, an assessment of a risk, a recommendation. The
position has to exist first, or there is nothing to attack.

**Do not run it:**

- before you have a stance - an unformed question answered from two sides produces
  noise, not judgement;
- on verifiable facts - a counter-argument about a number that a test can settle is
  theatre; run the test;
- after the decision is made - you will either be seeking permission to change it or
  defending it, and neither is useful;
- repeatedly inside the same window - the goal is a decidable position, and re-running
  the attack indefinitely keeps it undecided.

**Context:** a fresh subagent, and preferably a different model. A model arguing against
itself in the session that produced the position tends to produce an objection it has
already answered internally, which is the least informative one available.

## Procedure

### 1. State the position as a claim

One paragraph, plus the evidence it rests on:

```markdown
Position: <the claim, in one sentence>
Because: <the two or three reasons>
Evidence: <what I actually observed or measured>
What would change my mind: <your own first attempt>
```

Writing down "what would change my mind" before asking is the part people skip, and it is
the part that makes the exercise falsifiable. If you cannot fill it in, your position is
a preference, and you should say so.

### 2. Ask for one objection, not a balance

> Here is a position and the evidence behind it. Do not evaluate it fairly. Give me the
> single strongest argument that it is wrong, and the evidence that would establish that.
> If you think it is correct, say what the most dangerous failure mode is anyway.

Asking for one keeps the exercise sharp. A balanced response lets you pick the weak
objection and feel vindicated.

### 3. Ask what would refute the objection

A second round, same context:

> For that objection, what observation would confirm it?

This converts the objection into something testable. An objection you cannot test is a
worry, and worries are allowed to stay, but they should be labelled as such rather than
quietly deciding the question.

### 4. Judge, do not average

Read the objection against your evidence. Three outcomes, all legitimate:

- **the objection holds and is testable** - go run the test, you now have work to do
- **the objection holds and is untestable** - record it as a residual risk, with its
  trigger condition; do not let it silently dissolve
- **the objection is answered by evidence you already have** - say so, and note which
  piece of evidence answered it

What is not legitimate is treating the existence of an objection as a reason to stall.

## Output

```markdown
## Position
<claim + reasons + evidence>

## Strongest objection
<the objection, from the other model>

## Would be confirmed by
<the observation>

## Verdict
- answered by existing evidence: <which>
- testable now: <what to run>
- residual risk: <trigger condition / what would make it real>
```
