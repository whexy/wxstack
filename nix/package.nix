# Every skill in the repository at `share/skills/<name>`, the layout a Nix
# home links into its agents' skill directories.
{ pkgs, ... }:
let
  inherit (pkgs) lib;
  root = ../.;
  config = lib.importJSON ../skills.sh.json;
in
pkgs.runCommand "wxstack-skills"
  {
    src = lib.fileset.toSource {
      inherit root;
      fileset = root + "/skills";
    };
    # The names agents see, so a consumer that checks its skill list can
    # take this repository's from here instead of repeating them.
    passthru.skillNames = lib.sort lib.lessThan (lib.concatMap (g: g.skills) config.groupings);
    meta = {
      description = "Wenxuan Shi's agent skills";
      homepage = "https://github.com/whexy/wxstack";
      license = lib.licenses.mit;
      platforms = lib.platforms.all;
    };
  }
  ''
    mkdir -p $out/share
    cp -r $src/skills $out/share/skills
  ''
