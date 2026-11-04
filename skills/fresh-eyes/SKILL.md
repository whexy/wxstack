---
name: fresh-eyes
description: Get a second look at finished work from a reviewer that shares none of the author's context, so that rationalisations the author already produced do not get inherited. Runs on returned work before it is signed off.
---

# fresh-eyes

A reader who was not in the room.

## When this runs

**Run it** on work that has been returned and not yet signed off, and only after you
have read it yourself once. Your own read is what lets you judge whether the findings
are real; without it you cannot tell a genuine gap from a misunderstanding.

Two good moments: after an audit came back clean, as a vote against the clean result;
and when you have read the diff but cannot say what feels wrong.

**Do not run it:**

- while the work is still in progress - there is nothing to review;
- inside the main session - a reviewer with your conversation in context is not a second
  pair of eyes, it is a second opinion from the same brain;
- with an explanation of why the code or document is the way it is - that converts review
  into defence;
- as a replacement for reading it yourself.

**Context:** a fresh subagent. Mandatory, and the reason this skill exists at all.

## Procedure

### 1. Assemble the minimum packet

Send only:

- the artifact: the diff, the document, the output
- the contract, if you wrote one: audience, scope, done-when, verification criteria
- the original request, in the words you actually used

Send nothing else. No conversation history, no summary of what happened, no "here is
what I was trying to do", no list of things you are already worried about. Each of those
narrows the reviewer to your frame.

### 2. Ask for gaps, not for a grade

Use a prompt shaped like this:

> You are reviewing work you did not write and have no context for. Below is the
> artifact and the request it answers.
>
> Report:
> - what is asserted without evidence
> - what could break, and under what conditions
> - what was decided implicitly that a maintainer would need to know
> - what is missing entirely
> - what you cannot evaluate from what you were given
>
> Do not summarise the work. Do not assess overall quality. Locate each finding.

Explicitly banning a summary and a grade keeps the output usable. A reviewer that says
"looks solid overall, minor nits" has told you nothing you can act on.

### 3. Read the findings against your own read

Some findings will be wrong because the reviewer lacked context. That is expected and is
the price of the isolation. The ones worth attention are those that survive your
knowledge of the context - that is, the ones where the reviewer's confusion reveals a
thing the artifact genuinely fails to communicate.

### 4. Feed real gaps back into the audit

This skill does not produce a verdict. It produces a list of gaps, which belongs in the
gate table. Anything that survives becomes a "not met" or a "not checked" entry.

## Output

```markdown
## Findings
1. <location> - <what is wrong or unproven> - <why it matters>
2. ...

## Could not evaluate from the given packet
- <item>

## Survives my context check
- <findings 1, 4, ...> (the rest are explained by missing context)
```

The third section is the one that matters. Everything else is raw material for it.
