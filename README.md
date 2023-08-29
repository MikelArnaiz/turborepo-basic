# Turborepo monorepo

Welcome to this POC.
This repository was created initially with the official starter of Turborepo;

```sh
npx create-turbo@latest
```

It however includes many changes to assess if a monorepo is the right tool for us.

For a description of the changes made to the original template check [How was this project set up](#how-was-this-project-set-up).

Check the open questions and TODOs of this POC at [TODOs](./TODOs.md)
.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `ui`: a stub React component library shared by both `web` and `docs` applications
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting.
  - [x] Missing prettier configuration file.

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

## How was this project set up

### Scalfolding

Project uses [Turborepo starter](https://github.com/vercel/turbo/tree/main/examples/basic) basic template.

1. [install pnpm](https://pnpm.io/installation)

   This POC uses `pnpm` as it can handle workspaces better than `npm`/`yarn`.

1. `pnpm dlx create-turbo@latest`

### Package name changes (optional)

Internal package names where prefixed with `marnaiz` so to be able to release them publically to `npm` and not have collisions with other package names.

1. `packages/ui/package.json`'s `name` was changed to `marnaiz-turborepo-ui`.
1. To propagate the changes run `pnpm install`
1. Change broken references:
   1. Replace `ui` with `marnaiz-turborepo-ui`:
      1. `apps/docs/app/page.tsx` import now should be `from "marnaiz-turborepo-ui"`
      1. `apps/docs/next.config.js`, replace ` ["ui"]` with `["marnaiz-turborepo-ui"]`
      1. `apps/web/app/page.tsx` import now should be `from "marnaiz-turborepo-ui"`
      1. `apps/docs/next.config.js`, replace ` ["ui"]` with `["marnaiz-turborepo-ui"]`

### Adds @changesets

Turborepo is a task runner, it won't create package versions itself, for that we use [changesets](https://github.com/changesets/changesets).

1. Install `@changesets/cli`.
   ```
   pnpm install @changesets/cli -D
   ```
1. Add to `package.json`'s scripts

   ```json
   "changeset": "changeset",
   "version-packages": "changeset version",
   "version": "changeset version && pnpm i --lockfile-only",
   "release": " turbo run build --filter=docs^... && changeset publish"
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

1. Create a GitHub PAT, e.g `GH_MY_PAT`.

   ‼️ TODO explain how ands why

1. ‼️ TODO check whether the release file is automatically added
1. Add/Replace `.github/workflows/release.yml` file with the content.

   Note it references the previously create PAT, name should match.

   There are inline comments, pay attention to them.

   ```yml
   name: Release

   on:
     push:
       branches:
         - main

   concurrency: ${{ github.workflow }}-${{ github.ref }}

   jobs:
     release:
       name: Release
       runs-on: ubuntu-latest
       steps:
         - name: Checkout Repo
           uses: actions/checkout@v2
           # based on
           # https://github.com/changesets/action/issues/295#issuecomment-1549427775
           # https://github.com/ad-m/github-push-action/issues/44#issuecomment-581706892
           with:
             persist-credentials: false # otherwise, the token used is the GITHUB_TOKEN, instead of your personal token
             fetch-depth: 0 # otherwise, you will fail to push refs to dest repo

         - name: Install pnpm
           uses: pnpm/action-setup@v2
           with:
             version: 8

         - name: Setup Node.js 16.x
           uses: actions/setup-node@v3
           with:
             node-version: 16.x
             cache: 'pnpm'

         - name: Install Dependencies
           run: pnpm install

         - name: Create Release Pull Request or Publish to npm
           id: changesets
           uses: changesets/action@v1
           with:
             # To prevent ERR_PNPM_OUTDATED_LOCKFILE error.
             # PR get's merge with changes in package.json but it doesn't update the lock file
             # https://github.com/changesets/action/issues/203#issuecomment-1460115073
             version: pnpm run version-ci
             # This expects you to have a script called release which does a build for your packages and calls changeset publish
             publish: pnpm run release
           env:
             GITHUB_TOKEN: ${{ secrets.GH_MY_PAT }}
             NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

         # - name: Send a Slack notification if a publish happens
         #   if: steps.changesets.outputs.published == 'true'
         #   # You can do something when a publish happens.
         #   run: my-slack-bot send-notification --message "A new version of ${GITHUB_REPOSITORY} was published!"
   ```

<!-- 1. change `uses: actions/checkout@v2` for `uses: actions/checkout@v3` UNDONE after-->

## Changes and releases

1. Make a change in `packages/ui/Button.tsx`, e.g the inner text.
1. Run `pnpm changeset`

   1. Choose the packages to create a changeset for, in our case just `marnaiz-turborepo-ui`

      ![](/docs/changeset.png)

   1. Choose patch (skip both major and minor changes)

      ![](/docs/changeset-patch.png)

   1. Write a message for the release notes.
   1. It will create a file in the `.changeset` directory
      ![](/docs/changeset-file.png)

1. You can commit the changes and push. On merge, the Github action will generate a new pull request that once this is merged it will create a new patch release.
1. ‼️ TODO CHECK, at this point it might happen that both docs and web are pointing to the new version. If so change it manually and run `pnpm install` again.
1. You've done your first release!

## Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

It can also be set up to use a [custom server for remore caching](https://turbo.build/repo/docs/core-concepts/remote-caching#custom-remote-caches).

## Deploying

As a mere showcase I have deployed the apps to Vercel.

TODO add screenshots

- Docs: https://turborepo-basic-docs-pearl.vercel.app/
- Web: https://turborepo-basic-web-ivory.vercel.app/

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
