# ============================================================================ #
#
# Educational computer simulator on a mission to "superscalate" the study of
# computer architecture fundamentals.
#
# ---------------------------------------------------------------------------- #
{
  description = "Educational computer architecture simulator";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    pre-commit-hooks = {
      url = "github:cachix/pre-commit-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    pnpm2nix = {
      url = "github:nzbr/pnpm2nix-nzbr";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    { self
    , nixpkgs
    , pre-commit-hooks
    , pnpm2nix
    , ...
    }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      # Helper to provide system-specific attributes
      forAllSystems = f:
        nixpkgs.lib.genAttrs systems (system:
          f rec {
            pkgs = nixpkgs.legacyPackages.${system};
            commonPackages = builtins.attrValues {
              inherit (pkgs) nodejs;
              inherit (pkgs.nodePackages) pnpm;
            };
          });
    in
    {
      pre-commit-check = pre-commit-hooks.run {
        src = builtins.path { path = ./.; };
        default_stages = [ "manual" "push" ];
        hooks = {
          nixpkgs-fmt.enable = true;
          commitizen.enable = true;
          biome = {
            enable = true;
            name = "Biome.js";
            entry = "biome check --apply";
            stages = [ "pre-push" ];
          };
        };
        settings = {
          alejandra.verbosity = "quiet";
        };
      };

      # Development environment
      devShells = forAllSystems ({ pkgs, commonPackages }: {
        inherit (self.pre-commit-check) shellHook;
        default = pkgs.mkShell {
          packages = with pkgs; [ nixpkgs-fmt biome ] ++ commonPackages;
        };
      });

      # Build package into `dist/` dir from `pnpm-lock.yaml`
      buildDist = pnpm2nix.mkPnpmPackage {
        src = ./.;
        noDevDependencies = true;
      };

      # Create SIMDE `dist/` + `Static-Web-Server` bundle
      packages = forAllSystems ({ pkgs, ... }: {
        default = pkgs.writeShellScriptBin "default" ''
          ${pkgs.static-web-server}/bin/static-web-server --root .
        '';
      });
    };
}
