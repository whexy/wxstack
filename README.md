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

### Ownership

Keeping ownership of work an agent produced. The middle of the work — writing,
iterating, debugging — moves to the model; what stays with you is the framing
before it starts and the evidence after it ends. Each skill below covers one
moment, and none of them run on their own.

| Skill | Use it to |
| ----- | --------- |
| [brief](skills/brief/SKILL.md) | Turn a vague intent into a hypothesis, a brief and a definition of done, before any work starts |
| [audit](skills/audit/SKILL.md) | Collect evidence from returned work, extract the decisions made on your behalf, and apply the sign-off gate |
| [fresh-eyes](skills/fresh-eyes/SKILL.md) | Get a second read from a reviewer that shares none of your context |
| [counter](skills/counter/SKILL.md) | Have a different model argue the strongest case against a position you have already taken |
| [exam](skills/exam/SKILL.md) | Get a report and a quiz on the work, to find out whether you understand it well enough to sign |
| [postmortem](skills/postmortem/SKILL.md) | Recover what you left unspecified, and record what you stopped practising |

The moments they serve:

```
before the task      brief
work in progress     nothing, deliberately
returned, undecided  audit -> fresh-eyes -> counter -> exam
decision             audit (gate step)
after the decision   postmortem
```

Install them together to get the whole loop:

```sh
claude plugin install ownership@wxstack
```


## License

[MIT](LICENSE)
