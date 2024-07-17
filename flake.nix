# ============================================================================ #
#
# Educational computer simulator on a mission to "superscalate" the study of
# computer architecture fundamentals.
#
# ---------------------------------------------------------------------------- #
{
  description = "Educational computer architecture simulator";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
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
            inherit system;
            pkgs = nixpkgs.legacyPackages.${system};
            commonPackages = builtins.attrValues {
              inherit (pkgs) nodejs pnpm;
            };
            inherit (pnpm2nix.packages.${system}) mkPnpmPackage;
          });
    in
    {
      # Pre-commit hooks
      checks = forAllSystems ({ system, pkgs, ... }: {
        pre-commit-check = pre-commit-hooks.lib.${system}.run {
          src = builtins.path { path = ./.; };
          default_stages = [ "manual" "push" ];
          hooks = {
            actionlint.enable = true;
            commitizen.enable = true;
            nixpkgs-fmt.enable = true;
            biome = {
              enable = true;
              package = pkgs.biome;
              name = "biome";
              entry = "biome check --no-errors-on-unmatched";
              types_or = [ "javascript" "jsx" "ts" "tsx" "json" ];
              stages = [ "pre-push" ];
            };
          };
        };
      });

      # Development environment
      devShells = forAllSystems ({ system, pkgs, commonPackages, ... }: {
        default = pkgs.mkShell {
          # Add pre-commit hooks
          inherit (self.checks.${system}.pre-commit-check) shellHook;
          packages = commonPackages ++ self.checks.${system}.pre-commit-check.enabledPackages;
        };
      });

      # Package derivations
      packages = forAllSystems ({ system, pkgs, mkPnpmPackage, ... }: rec {
        # Build package into `dist/` dir from `pnpm-lock.yaml`
        dist = mkPnpmPackage {
          src = ./.;
          distDir = "dist";
        };

        # Build binary package with `static-web-server` running SIMDE dist
        sws = pkgs.pkgsStatic.writeShellScriptBin "simde-sws" ''
          ${pkgs.pkgsStatic.static-web-server}/bin/static-web-server --root ${dist}
        '';

        # Build a Docker image that runs `simde-sws`
        docker = pkgs.dockerTools.buildImage {
          name = sws.name;
          tag = "latest";

          created = "now";

          copyToRoot = pkgs.buildEnv {
            name = "image-root";
            paths = [ sws ];
            pathsToLink = [ "/bin" ];
          };

          config = { Cmd = [ "/bin/simde-sws" ]; };

          diskSize = 128;
          buildVMMemorySize = 512;
        };

        default = dist;
      });
    };
}
