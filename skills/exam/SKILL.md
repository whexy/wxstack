---
name: exam
description: Produce a report on what changed, then quiz you on it from a context that does not contain your conversation, so you can find out whether you actually understand the work well enough to sign off on it. Runs after you have read the work yourself and before the decision.
---

# exam

Find out whether you can defend it, not whether it is done.

## When this runs

**Run it** late in the review window: you have read the work yourself, and you are close
to a decision. It is worth the cost when the work will be delivered, will be maintained
by someone else, or came out of a long session where many small decisions accumulated
without you watching.

**Do not run it:**

- before you have read the work yourself - the quiz becomes a substitute for reading, and
  a good score will then feel like comprehension;
- on a small change - reading the report will take longer than reading the change;
- after the work has shipped - understanding matters before the decision, not after;
- in a context that shares your conversation - questions calibrated to what you have
  already discussed are easy, and easy questions certify nothing.

**Context:** a fresh subagent. Give it the artifact and the spec, and nothing about the
conversation that produced them.

## Procedure

### 1. Ask for the claim list first

> Read the work below. Without explaining the conversation that produced it, list what it
> changes, in the order the reader would need to understand it, and for each item the
> decision that was made.

The claim list is the syllabus. If the model cannot state what it changed without
reference to your discussion, the work does not yet stand on its own, and that is the
finding.

### 2. Ask for the quiz

> Then write 6 to 8 questions that test whether someone understands this change well
> enough to maintain it. Mix: what breaks if X is changed, which behaviour was chosen at
> Y, what the tests do not cover, and one question about a part that looks unimportant.
> Do not include the answers yet.

A useful mix: mostly questions with checkable answers, at least one about an omission,
and at least one that a superficial reader would get wrong. All multiple-choice is a
sign the quiz is not testing anything.

### 3. Answer without the artifact

Close the work, answer from memory, then bring the answers back. Answering with the diff
open tests your search skill, not your understanding.

### 4. Grade strictly, then act on the outcome

> Grade these answers. For each: correct / partly / wrong, and what the answer missed.

- **Full marks** - you have the model. Sign.
- **Missed on details** - fine, that is why the artifact exists. Note what you had to
  look up.
- **Missed on mechanism** - you do not have the model. Do not sign; go to postmortem and
  rebuild understanding first. A merge here is a decision made on someone else's
  understanding.

### 5. Keep the failing question

The question you got wrong is the most valuable artifact this skill produces. It goes in
the PR body or your notes as "this part I did not understand when I approved it". It
tells the next reader where the risk is, and it tells you what to learn.

## Output

```markdown
## What it changes
1. <item> - decision: <what was chosen>

## Quiz
Q1..Q8

## My answers
...

## Grade
Q1 correct / Q3 wrong - missed <what>

## Verdict
sign / rebuild understanding first (see <topic>)
```
