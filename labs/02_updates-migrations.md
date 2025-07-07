# 02 Updates & Migrations

<!-- TOC -->
- [Update to latest Angular including all npm packages](#update-to-latest-angular-including-all-npm-packages)
- [Run a chosen migration for your project](#run-a-chosen-migration-for-your-project)
  - [Prepare your findings](#prepare-your-findings)
<!-- /TOC -->

In this lab, we'll update Angular and try one of the automated migration schematics for Angular apps.

**Lab time:** 30–45 minutes

**Pair programming lab:** If your workshop is onsite, please pair up with a colleague to work on this lab together. Your trainer should check who's doing which migration before you start.

## Update to latest Angular including all npm packages

1. Go to your current project (or choose one).
   > **Note:** When working on your real project, make sure to commit all changes, then create a new branch for our experiments.
2. Update to the latest version of Angular using the `ng update` command (or a variant depending on your needs) in `package.json`.
   > **Note:** If your project is built with Nx, use `nx migrate latest` instead.
3. After that, upgrade all other packages to their latest versions.
   > **Note:** Use `pnpm outdated` to find outdated packages.

## Run a chosen migration for your project

Choose one of these [Angular migration schematics](https://angular.dev/reference/migrations) and apply it to your project:

- NgModules to standalone components (should be done already)
- Structural directives to new control flow (should be done already)
- Migrate constructor-based DI to `inject()`
- Lazy-loaded routes
- Signal inputs (my favorite, but not easy)
- Signal outputs
- Signal queries (also not easy)
- Clean up unused imports
- Self-closing tags
- Migrate webpack to the new app builder (esbuild & Vite, not listed on the website)

### Prepare your findings

Please prepare to share your results with the rest of the group.

Finally, if it makes sense, prepare to commit and push those refactorings.
