# Holds the repository to what `npx skills`, Claude Code's plugin loader and
# Nix consumers each assume about it.
{ pkgs, flake, ... }:
pkgs.runCommand "skills-check"
  {
    nativeBuildInputs = [ (pkgs.python3.withPackages (p: [ p.pyyaml ])) ];
  }
  ''
    python3 ${./skills.py} ${flake}
    touch $out
  ''
