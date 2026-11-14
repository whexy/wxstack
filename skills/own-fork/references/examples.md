# Worked examples

Two forks the user owns. t3code covers every step. tldraw came first, and its
gaps are listed at the end as work still to do.

| Step | whexy/t3code (upstream pingdotgg/t3code) | tldraw fork (upstream tldraw/tldraw, private) |
| --- | --- | --- |
| 1. Survey | Hosted sign-in, push relay, update server and telemetry: each replaced or dropped | A production license gate and watermark |
| 2. Branch | `dev` (default, takes pull requests) is promoted into `self-hosted-nightly`, which is what builds publish | `main`, pushed directly |
| 3. Upstream deployment | 24 upstream workflows disabled one by one; their files stay in the tree | GitHub Actions turned off for the whole repository |
| 4. Checks | The fork's build runs the checks for each part it ships | None on push; check scripts run by hand |
| 5. Deploy | GitHub Actions builds images and a Nix package; GitOps tag bump; hosts pin the commit | Woodpecker builds an image on `v*` tags; argocd-image-updater deploys it |
| 6. Follow | Upstream nightly tags, on a `repository_dispatch` sent when upstream publishes | Upstream `main`, weekly Woodpecker cron |
| 7. Repair | One T3 scheduled task for sync and build failures | None |
| 8. Docs | `.github/README.md`, `.github/operations.md` | A "Fork additions" section in `AGENTS.md`; root README edited |

## whexy/t3code

The fork is public; its `.github/README.md` and `.github/operations.md` on
`dev` are the current source of truth.

**Branch.** `dev` is an upstream nightly tag, then the fork's commits, then one
`chore(nix): pin sources for <tag>` commit, then pull requests merged since
the last rebase. Pull requests are rebase-merged into `dev`. A workflow keeps
one "promote dev" pull request open into `self-hosted-nightly`; merging it
with a merge commit (the only method that branch's ruleset allows) ships
early. Otherwise the next nightly promotes `dev` anyway. The root README is
upstream's, unchanged.

**Disabled workflows.** Upstream's workflow files come back with every rebase,
so they stay in the tree and are disabled in GitHub. The fork's build still
calls one of them (the desktop release workflow): a disabled workflow can
still be called.

**Sync** (`self-hosted-rebase.yml`, `scripts/self-hosted/rebase.sh`). A state
machine with stages `setup`, `resolve`, `rebase`, `pin`, `push` and
`push-race`:

- Resolve takes the newest non-draft prerelease matching
  `vX.Y.Z-nightly.YYYYMMDD.N` from upstream's 30 newest releases. GitHub's
  latest-release endpoint skips prereleases.
- The rebase drops the old pin commit through a sequence editor. A conflict
  only in the pin file takes the fork's side; any other conflict fails.
- Pin regenerates the Nix hashes for every platform, then commits.
- The push leases on the start commit and starts over once on "stale info".
- The checkout keeps persisted credentials. Without them, checkout runs
  `git submodule foreach`, which fails on upstream's gitlinks that have no
  `.gitmodules` entry.

**Build** (`self-hosted-build.yml`). One check job per shipped part. Images
are pushed by digest only. A gate job continues only while the commit is
still the branch head, otherwise it writes `state=SUPERSEDED`. Then it tags
the images `1.2.<run number>`, commits that tag into the GitOps repository,
tags the commit `pin/<sha12>`, and starts the user's dotfiles pipeline to pin
the Nix package on every host. Pull requests run the checks and publish
nothing.

Never re-run a publishing run. A re-run reuses the run number, and with it the
version; the publishing jobs refuse a second attempt. Retry with
`gh workflow run`. For the same reason, never rename the workflow file:
run numbers count per file.

**Repair.** `scripts/self-hosted/report-failure.ts <sync|build>` posts the
failure payload to the `T3_REPAIR_WEBHOOK` secret. If that fails, it falls
back to an alert webhook. The T3 task drops duplicates, retries transient
failures with `workflow_dispatch`, repairs in a scratch worktree, and messages
the user on WeChat when it cannot. Fixes after a rebase are folded into the
owning commit; a build failure that needs no rebase gets a new commit on top.

## tldraw fork

**Customizations.** The first fork commit removes the production license gate
and watermark, then the fork relicenses. The user made both decisions. The
self-hosted server grew out of upstream's `templates/simple-server-example`
rather than a new directory, so upstream changes to that template conflict.

**Sync** (`.woodpecker/upstream-sync.yaml`). Every Monday it fetches upstream
`main` and exits if the merge base is already upstream's head. Otherwise it
rebases onto it and pushes as the GitHub App with
`--force-with-lease=main:$CI_COMMIT_SHA`. A failed rebase pushes nothing.

**Deploy** (`.woodpecker/deploy.yaml`). Pushing a `v<version>` tag builds and
pushes the image; argocd-image-updater then deploys it, so a pushed tag is a
deploy. Manual runs build without pushing.

**Local tooling.** On Nix, `corepack enable` fails on the read-only profile,
and upstream's postinstall and pre-commit hook call bare `pnpm`. Put a
corepack shim directory on `PATH` instead.

**Gaps to close when the fork is next touched:**

- A failed sync is silent: no state line, no alert, no repair task.
- Nothing checks a rebased `main`. Upstream's checks are off with Actions,
  and the sync and persistence scripts run only by hand.
- Fork docs edit the root README and `AGENTS.md`, both of which upstream
  changes.
