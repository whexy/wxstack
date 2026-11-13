This repository publishes agent skills two ways at once: `npx skills`
reads `skills/`, and Claude Code reads `.claude-plugin/marketplace.json`.
Keep them in step. The flake only checks the repository; Nix homes install
from it with the `skills` CLI, like any other skill repository.

## Adding or changing a skill

- A skill is `skills/<name>/SKILL.md`, with frontmatter `name` equal to
  `<name>` and a `description` saying what it does and when to use it.
- Each skill belongs to exactly one set. A set is one grouping in
  `skills.sh.json` and the Claude Code plugin of the same name, lowercased,
  in `.claude-plugin/marketplace.json`, listing the same skills.
- A skill must work when installed alone: `npx skills add --skill` copies one
  folder. Never link or point to a path outside the skill's own directory.
  To use another skill, name it ("load the `frost` skill") and give paths
  inside that skill's directory.
- Nothing here may name private hosts, credentials or infrastructure. Write
  "the user" for whoever the agent works for.

## Frost

Frost documents www.whexy.com as it ships
([whexy/blog-1999](https://github.com/whexy/blog-1999)); it invents nothing
the user has not decided. Charts are the one part decided ahead of the
site; when the site ships charts, bring `references/charts.md` in line.
When an open question is answered, move the decision into `tokens.css`,
`components.md` or `AGENTS.frost.md` and delete the question. When the
site's design changes, update Frost in step.

## Verify

`git add` new files first; the flake sees only tracked files.

```sh
nix flake check
DISABLE_TELEMETRY=1 npx -y skills add . --list
claude plugin validate .
```
