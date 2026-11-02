# wxstack

Agent skills by [Wenxuan Shi](https://github.com/whexy). Each one is a
folder under [`skills/`](skills) holding a `SKILL.md`, the
[Agent Skills](https://agentskills.io/) format that Claude Code, Codex,
OpenCode, Cursor and most other coding agents read.

## Install

```sh
npx skills add whexy/wxstack
```

The [`skills`](https://github.com/vercel-labs/skills) CLI asks which skills
and agents to install for. Pass `--skill <name>` to pick skills, `-g` to
install for every project.

Claude Code can also install each set as a plugin:

```sh
claude plugin marketplace add whexy/wxstack
claude plugin install frost@wxstack
```

<details>
<summary>From Nix</summary>

`packages.<system>.default` holds every skill at `share/skills/<name>`;
link that directory into your agents' skill directories.

```nix
inputs.wxstack.url = "github:whexy/wxstack";
```

</details>

## Skills

### Frost

The design language of [www.whexy.com](https://www.whexy.com), for projects
that should look like it. Install all five together.

| Skill | Use it to |
| ----- | --------- |
| [frost](skills/frost/SKILL.md) | Look up tokens, components, blocks and open questions |
| [frost-setup](skills/frost-setup/SKILL.md) | Install Frost into a project |
| [frost-page](skills/frost-page/SKILL.md) | Build a page or section as a stack of blocks |
| [frost-component](skills/frost-component/SKILL.md) | Add or change a component |
| [frost-review](skills/frost-review/SKILL.md) | Review a screen or diff, with a pass/fail report |

## License

[MIT](LICENSE)
