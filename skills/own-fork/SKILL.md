---
name: own-fork
description: Fork an open-source project so the user owns it - turn off upstream's deployments, deploy the fork on the user's own stack, keep the user's commits rebased on upstream, and have an agent repair a failed sync or build. Use when asked to fork, self-host or take over an upstream project, or to add upstream sync, deployment or failure repair to an existing fork.
---

# Own a fork

The user owns a fork when three things keep working without them:

- **Deploy.** Every good build reaches the user's infrastructure, and nothing
  reaches upstream's.
- **Customize.** The user's changes are commits on top of upstream that
  survive every upstream update.
- **Verify.** Checks prove each build still works. A failure gets repaired by
  an agent or reported, and the last good build keeps serving.

Two forks went through this and serve as worked examples: whexy/t3code and the
user's tldraw fork. [references/examples.md](references/examples.md) shows how
each handled every step below. Read it before step 1.

## Ask, don't guess

The user decides anything that changes what runs, where it runs, under which
license, or how upstream comes in. Each step lists its questions. Ask them
together once that step's survey is done. Load the `explain` skill to choose
how to present what you found and the trade-offs. When a worked example
already answered the question, offer its answer as the first option. Never
pick one silently to keep moving.

## 1. Survey upstream

Read the repository and change nothing. Then report:

- The license. Also any license check, watermark, telemetry or phone-home in
  the code. Removing or relicensing anything is the user's decision.
- Every CI file (`.github/workflows/`, and any other CI system), sorted into
  **deployment** (anything that releases, publishes, deploys or posts to an
  outside service) and **checks** (build, test, lint).
- The hosted services the project depends on (sign-in, relays, telemetry,
  update servers), and which ones the user's deployment must replace or drop.
- How upstream releases: tags, nightly prereleases, or only `main`.
- How to build and test it on this machine. On Nix, the toolchain may need a
  shim (tldraw's pnpm did).

## 2. Lay out the branch

The fork's branch is an upstream commit with the user's commits on top. Each
upstream update rebases those commits; it never merges. That keeps every
change a single commit that an agent can read, fix and fold a fix into.

- Put fork code in paths upstream does not have: new directories, workflows
  named `self-hosted-*`. Every edit to an upstream file becomes a future
  conflict, so keep those edits few and small.
- Put the fork's README at `.github/README.md`, which GitHub shows in place of
  the root one, and leave the root `README.md` identical to upstream's.
- In the lockfile, commit only the fork's own changes, such as a new
  package's entry. Regenerate the rest from upstream's lockfile.
- The branch is force-pushed, so anything that consumes the fork pins a
  commit or a tag, never the branch.

Ask: the branch names, and whether changes land through pull requests or
direct pushes.

## 3. Turn off upstream's deployment

Disable every deployment workflow in GitHub with
`gh workflow disable <file>`. Leave the files alone: upstream changes them
often, and a fork commit that deletes or edits them would conflict each time.
A disabled workflow can still be called by the fork's own workflows.

If the fork's CI runs on another system, you can instead turn GitHub Actions
off for the whole repository, as the tldraw fork does. Steps 4 and 6 then
need that other system.

Also check scheduled jobs, release bots and webhooks. Upstream may add a
deployment workflow in a later release, and it arrives enabled, so have the
sync job (step 6) list workflow files that are new since the last base.

Ask: any workflow you cannot classify.

## 4. Keep upstream's checks

Leave upstream's check workflows on by default. They are the cheapest proof
that a rebase broke nothing. Disable one only when it cannot run in the fork
(it needs upstream's secrets, runners or services), and ask first. If the
fork's build cannot run upstream's checks as written, run the ones that matter
inside the fork's own build.

Then add checks for what the fork adds: tests for the fork's code, plus one
check against the built artifact. t3code checks that its Nix package reports
the pinned version and honours the fork's settings. tldraw has scripts that
test live sync and persistence against a running server.

## 5. Deploy on the user's stack

Load the `cluster-native` skill to design the deployment: which of the user's
services replace upstream's hosted ones. Then load `deploy-to-cluster` to
build the pipeline. If neither skill is installed, ask the user where the
fork runs.

Rules specific to a fork:

- A failed sync or build publishes nothing, so the last good build keeps
  serving.
- Publish only while the build's commit is still the branch head. A newer
  push publishes itself.
- Every published build gets a version of its own, and its commit gets a tag
  that survives the next force-push.

Ask: what gets deployed and where, what is public, and whether every build
ships (t3code) or only tagged releases (tldraw).

## 6. Follow upstream

Ask before writing anything:

- **What to follow.** Upstream's release or nightly tags (t3code), or the
  newest `main` (tldraw). Tags have passed upstream's release process; `main`
  is fresher and breaks more often.
- **When.** When upstream releases (t3code: an outside watcher sends a
  `repository_dispatch`), or on a cron (tldraw: weekly).
- **Where it runs.** GitHub Actions, or the user's own CI.

Then write the sync job. It must:

1. Clone with full history; the rebase needs the merge base.
2. End without pushing if upstream has not moved past the merge base, or if
   the target is older than it.
3. Run `git rebase --onto <target> <merge base>`. Any conflict fails the run;
   resolving conflicts is the repair agent's job. The one exception is a file
   the job regenerates itself (t3code's Nix pin), which takes the fork's side
   and is regenerated afterwards.
4. Push as a GitHub App, with `--force-with-lease=<branch>:<start commit>` so
   that a commit pushed in the meantime is never lost. A push made with
   `GITHUB_TOKEN` starts no workflows, so the build would never run.
5. If its scripts live in the repository, run copies of them, because the
   rebase rewrites the originals mid-run.
6. Write one line to the run summary: `state=PUSHED`, `NOOP(<why>)` or
   `FAILED(<stage>)`, with the target and the start and result commits. The
   repair agent and the user diagnose from this line.

## 7. Repair failures with an agent

A failed sync or build starts an agent run through a T3 Code scheduled task's
webhook. One task can handle both cases, told apart by a `kind` field, as
t3code's does.

1. Create the task with `schedule_task`, in a T3 project on the fork's
   checkout. Load the `t3-setup` skill to get its webhook URL. The URL
   contains the token, so store it as a repository secret and never commit
   it.
2. On failure, CI posts `{kind, stage, branch, commit, release_tag, run_id,
   run_url}` to that secret. If the secret is unset or the webhook does not
   answer 2xx, alert the user some other way. Pull requests never report.
3. The task's prompt tells the agent to:
   - drop duplicates by `kind`, `stage`, `commit` and `release_tag`;
   - read the run's `state=` line and its logs;
   - retry a transient failure by starting a new run;
   - otherwise repair in a scratch worktree made from the remote branch,
     never the user's checkout;
   - fold each fix into the fork commit that owns the code (`git commit
     --fixup`, then `git rebase -i --autosquash`) so the next rebase carries
     it, then push with a lease;
   - message the user when it cannot repair the branch.

Ask: which T3 host and project own the task, and how the user wants to be
told.

## 8. Write it down

- `.github/README.md`: what the fork adds, where each part runs, how a change
  ships, and how to use the fork from outside.
- A fork section in `AGENTS.md`: fork-only paths, the upstream files the fork
  edits, and the rules fork code must pass.
- An operations page: why upstream's workflows are disabled, how to retry a
  failed run, and anything that expires.
- If the user keeps a knowledge base (the `knowledge` skill), record the
  fork's branch and CI there.

## Done when

- `gh workflow list --all` shows only workflows the user agreed to keep
  enabled.
- A manual sync run ended in `PUSHED` or `NOOP`.
- The fork's build passed on the branch head, and the deployment serves that
  commit.
- The repair webhook accepted a test delivery and its task started.
- Every question above has the user's answer.
