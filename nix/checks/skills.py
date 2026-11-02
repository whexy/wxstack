"""Fails on a skill that would break under one of the ways it is installed.

- Frontmatter `name` must equal the skill's directory and `description` must
  be set: `npx skills` and Claude Code skip a skill otherwise.
- Each skill sits in exactly one `skills.sh.json` grouping, and each grouping
  is the Claude Code plugin of the same name with the same skills, so the
  skills.sh page, the plugin list and Nix's `skillNames` agree.
- A relative link or path may not leave its own skill directory: `npx skills
  add --skill` installs one skill without its siblings.
"""

import json
import re
import sys
from pathlib import Path

import yaml

root = Path(sys.argv[1])
skills_dir = root / "skills"
errors = []

skills = sorted(p.parent.name for p in skills_dir.glob("*/SKILL.md"))
for name in skills:
    text = (skills_dir / name / "SKILL.md").read_text()
    match = re.match(r"---\n(.*?)\n---\n", text, re.S)
    meta = yaml.safe_load(match.group(1)) if match else None
    if not isinstance(meta, dict):
        errors.append(f"{name}: SKILL.md has no frontmatter")
        continue
    if meta.get("name") != name:
        errors.append(f"{name}: frontmatter name is {meta.get('name')!r}")
    if not str(meta.get("description") or "").strip():
        errors.append(f"{name}: description is empty")

groupings = json.loads((root / "skills.sh.json").read_text())["groupings"]
grouped = [s for g in groupings for s in g["skills"]]
for name in sorted(set(grouped) - set(skills)):
    errors.append(f"skills.sh.json lists {name}, which has no skills/{name}/SKILL.md")
for name in sorted(set(skills) - set(grouped)):
    errors.append(f"{name} is in no skills.sh.json grouping")
for name in sorted({s for s in grouped if grouped.count(s) > 1}):
    errors.append(f"{name} is in more than one skills.sh.json grouping")

plugins = json.loads((root / ".claude-plugin/marketplace.json").read_text())["plugins"]
want = {g["title"].lower(): sorted(g["skills"]) for g in groupings}
have = {
    p["name"]: sorted(s.removeprefix("./skills/") for s in p.get("skills", []))
    for p in plugins
}
if want != have:
    errors.append(f"marketplace.json plugins {have} differ from skills.sh.json groupings {want}")

# Markdown link targets, and path-like code spans and comments that start
# with ../ (agents follow both).
ref = re.compile(r"\]\(([^)#\s]+)|(?<![\w/.])(\.\./[\w./-]+)")
for path in sorted(skills_dir.rglob("*")):
    if not path.is_file():
        continue
    skill = skills_dir / path.relative_to(skills_dir).parts[0]
    for lineno, line in enumerate(path.read_text().splitlines(), 1):
        for target in filter(None, (t for m in ref.finditer(line) for t in m.groups())):
            target = target.rstrip(".,;:")
            if re.match(r"[a-z]+:", target):
                continue
            resolved = (path.parent / target).resolve()
            if not resolved.is_relative_to(skill.resolve()):
                errors.append(f"{path.relative_to(root)}:{lineno}: {target} leaves {skill.name}/")
            elif not resolved.exists():
                errors.append(f"{path.relative_to(root)}:{lineno}: {target} does not exist")

if errors:
    print("\n".join(errors), file=sys.stderr)
    sys.exit(1)
print(f"{len(skills)} skills ok")
