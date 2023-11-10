## How was this project set up

The following steps are mere informative to understand how to set up a turborepo from scratch.
This can be used as a checklist when setting up a monorepo.

### Scalfolding

This project is based on the [Turborepo starter](https://github.com/vercel/turbo/tree/main/examples/basic) basic template.

1. [Install pnpm](https://pnpm.io/installation)

   This POC uses `pnpm` as it can handle workspaces better than `npm`/`yarn`.

1. Run `pnpm dlx create-turbo@latest`

### Package name changes (optional)

Internal package names where prefixed with either `marnaiz-` or `@marnaiz/` so to be able to release them publically to `npm` and not have collisions with other package names.

1. ui
   1. `packages/ui/package.json`'s `name` was changed to `marnaiz-turborepo-ui`.
   1. To propagate the changes run `pnpm install`
   1. Change broken references:
   1. Replace `ui` with `marnaiz-turborepo-ui`:
      1. `apps/docs/app/page.tsx` import now should be `from "marnaiz-turborepo-ui"`
      1. `apps/docs/next.config.js`, replace ` ["ui"]` with `["marnaiz-turborepo-ui"]`
      1. `apps/web/app/page.tsx` import now should be `from "marnaiz-turborepo-ui"`
      1. `apps/docs/next.config.js`, replace ` ["ui"]` with `["marnaiz-turborepo-ui"]`
1. tsconfig
   1. `packages/tsconfig/package.json`'s name was changed from `tsconfig` to `@marnaiz/turborepo-tsconfig`
   1. Change references:
      1. in `/package.json` (root), `apps/docs/package.json`, `apps/web/package.json`, `packages/ui/package.json`
      1. `/tsconfig.json`, `apps/docs/tsconfig.json`, `apps/web/tsconfig.json`, `packages/ui/tsconfig.json` extends property

### Adds @changesets

Turborepo is a task runner, it won't create package versions itself, for that we use [changesets](https://github.com/changesets/changesets).

1. Install `@changesets/cli`.

   ```
   pnpm install @changesets/cli -D
   ```

1. It should have automatically added the files

   1. `changeset/README.md`
   1. `changeset/config.json`, with:

      ```json
      {
        "$schema": "https://unpkg.com/@changesets/config@2.3.0/schema.json",
        "changelog": "@changesets/cli/changelog",
        "commit": false,
        "fixed": [],
        "linked": [],
        "access": "restricted",
        "baseBranch": "main",
        "updateInternalDependencies": "patch",
        "ignore": []
      }
      ```

   1. change access in `changeset/config.json`.
      This sets how packages are published. If access: `restricted`, packages will be published as private, requiring log in to an npm account with access to install. If access: `public`, the packages will be made available on the public registry.

      https://github.com/changesets/changesets/blob/main/docs/config-file-options.md#access-restricted--public

1. Add to `package.json`'s scripts

   ```json
   "build-packages": "turbo run build --filter='./packages/*'",
   "changeset": "changeset",
   "changeset:enter": "changeset pre enter next",
   "changeset:pre": "pnpm changeset:enter && pnpm changeset:version",
   "changeset:exit": "changeset pre exit",
   "changeset:publish": "changeset publish",
   "changeset:version": "changeset version && pnpm i --lockfile-only",
   "release": " turbo run build --filter=docs^... && changeset publish",
   "release-packages": "pnpm run build-packages && changeset publish",
   "release:pre": "pnpm changeset:pre && pnpm release",
   ```

1. Create a GitHub PAT, e.g `GH_MY_PAT`.

   https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

1. Add `.github/workflows/release.yml`.
   Note, it references the previously create PAT, variable name should match.
   There are inline comments, pay attention to them.
   File can be found at [.github/workflows/release.yml](.github/workflows/release.yml)
