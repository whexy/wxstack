---
name: ship-pr
description: Commit, rebase, open a pull request, watch CI, and rebase-merge it, or stop just before the merge for the user's review. Ships iOS app changes over the air first when they can go that way. Use only when the user explicitly asks to ship the work, ship the PR, or ship it (merge), or to ready the PR or ready it (stop before merging).
---

# Ship The Work As A Pull Request

Run this after the requested work is done, as the last step of the task. The
user's words pick the mode:

- **Ship** ("ship it", "ship the PR"): merge once the pull request is ready.
- **Ready** ("ready it", "ready the PR"): bring the pull request to the same
  point, then stop and leave the merge to the user.

## iOS app updates

In ship mode, when the work changes an iOS app, deliver it over the air
right after committing (step 1), then carry on with the pull request. This
applies when the app takes over-the-air updates (for example
`expo-updates`, published with `eas update`) and the change can travel that
way: only JavaScript and assets changed, with no change to native code,
native dependencies, permissions, or app config that is built into the
binary. Publish from the
committed branch with the project's own update script or command, to the
channel and runtime version that the installed production builds read. If
the publish fails, stop and report before merging. If the change needs a new
binary, say so and ship the pull request alone. Ready mode publishes nothing.

## Steps

1. Commit all your changes, following the repository's commit conventions
   (the `git-commit` skill, when it is installed). If you are on
   the default branch, create a topic branch first.
2. Fetch and rebase onto the up-to-date default branch (`main` or `master`)
   of the original repository: `upstream` for a fork, otherwise `origin`.
   Resolve conflicts, then re-run the checks relevant to your changes.
3. Push the branch and open a pull request against that default branch. Write
   the summary by the same conventions. If the harness can link pull
   requests to the thread, link this one. In ready mode, also assign the user:
   `gh pr edit <number> --add-assignee @me`.
4. Watch the pull request's CI until it finishes. When a check fails, read
   its log, fix the cause, push, and keep watching. Stop and report when the
   failure is unrelated to your changes, the fix is unclear, or merging needs
   a permission you do not have.
5. The pull request is ready when every required check passes, it has no
   conflicts with the default branch, and the repository allows rebase
   merges. If it does not allow them, stop and report; never squash or create
   a merge commit.
   - Ship mode: rebase-merge it (`gh pr merge --rebase`). If merging needs a
     review, stop and report.
   - Ready mode: do not merge. Stop and hand the decision to the user.

Finish with the pull request URL and its state: merged, or ready and waiting
for the user, or what is blocking it. After an over-the-air update, also give
its channel and update ID.

When the user later approves a readied pull request, check it again first: if
the default branch has moved, rebase, push, and watch CI until it is ready
once more, then rebase-merge it. If they ask for changes, make them, push, and
bring it back to ready without merging.
