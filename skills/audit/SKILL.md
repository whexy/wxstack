---
name: audit
description: Collect evidence from a finished piece of agent work, extract the decisions the model made on your behalf, and decide whether to sign off. Runs when work has been returned but nothing has been committed, merged, or shipped yet.
---

# audit

Evidence first, opinion second, signature last.

## When this runs

**Run it** when work lands and is still undecided: the model has finished, you are still
in the conversation, and nothing has been committed or shipped. It opens at the start of
that window and closes when you sign.

**Do not run it:**

- while the model is still working - there is nothing to audit yet;
- before you have the raw evidence - asking for an opinion before reading the command,
  the output, or the diff inverts this skill into a vibe check;
- twice in the same round - a second pass will argue with the first and produce
  agreement rather than scrutiny;
- as a post-hoc request for the decision list (see step 0).

**Context:** the main session. The decision list is only accurate when it comes from the
context where the decisions were made.

## Procedure

### 0. Attach the standing requirement at task start

The decision list cannot be retrieved afterwards. Asked later, the model re-reads its own
output and reconstructs a flattering account of why it did what it did. So the request
has to travel with the work:

> When you finish, include a list of the decisions you made and the assumptions behind
> them: defaults you chose, things you put out of scope, requirements you reinterpreted,
> and edge cases where you picked one behaviour over another.

Getting this in before the work is the whole trick. In this window you only *collect* it.

### 1. Read the evidence before the prose

Order: the command that ran, its output, the diff or artifact, then anything the model
wrote about itself. A summary is the author's account of the work; the evidence is the
work. Reading the summary first sets the frame you will then unconsciously verify
against.

### 2. Read the diff as if a stranger wrote it

Not as "did the model do what it said" but "is this correct". Those are different
questions, and only the second one is yours.

### 3. Spot-check three things

Not everything - three, chosen so that a miss is informative:

- one hunk picked at random, read line by line
- the number or claim your conclusion depends on, recomputed or re-derived
- one source document behind any summary (a ticket, a call transcript, a spec section)

The purpose of a spot check is to find what is in the parts you did not read. It is not
to confirm the parts you did.

### 4. Extract the decisions

From the list the model sent, keep only the ones that could be wrong in a way that
matters, and for each ask: would I have decided this the same way? The interesting
entries are:

- defaults chosen silently
- scope quietly excluded
- a requirement reinterpreted when two of them conflicted
- an edge case where a behaviour flipped

If the list is missing or thin, that is itself a finding: it means the decisions were
made implicitly, and you now have to infer them from the diff.

### 5. Apply the gate

Compare the evidence against the verification contract you wrote before the work
started. Per criterion: met / not met / could not tell. "Looks done", "tests pass", and
"it says it works" are not evidence - a passing check names one property, and says
nothing about the ones it does not name.

Three outcomes:

- **all met, and you can explain each one** - sign, go to step 6
- **any not met** - return to work with the specific gap, not with a general sense of
  unease
- **could not tell** - the contract was underspecified. Fix the contract before
  continuing; do not sign on ambiguity.

### 6. Leave a trace

The window closes when you sign, and everything you learned in it dies with the
conversation unless you write it down. Put into the PR body, commit message, or review
note:

- the decisions that mattered and why they were acceptable
- the criterion that passed without evidence
- the thing you did not check

The next reader - or you in three months - will otherwise inherit the intent without the
reasoning.

## Output

```markdown
## Evidence read
- <commands / files actually inspected>

## Decisions made on my behalf
- <decision> -> acceptable because <reason> / not acceptable

## Gate
| criterion | met? | evidence |
|---|---|---|

## Not checked
- <item>

## Verdict
sign / return for <specific gap> / fix contract first
```

Keep the verdict to one line. If it needs a paragraph, the gate was not specific enough.
