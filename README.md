# Turborepo monorepo

Welcome to this monorepo Proof of Concept (POC), powered by [Turborepo](https://turbo.build/repo).

This repository was initially set up using the official Turborepo starter:

```sh
pnpm dlx create-turbo@latest
```

However, numerous modifications have been made to evaluate whether a monorepo is the right fit for our needs. To understand the changes made to the original template, refer to [How was this project set up](./docs/setup.md).

For ongoing questions and TODOs related to this POC, please check [TODOs](./docs/TODOs.md).

## Motivation

This POC is exclusively focused on Turborepo. While there are alternative solutions like [Nx](https://nx.dev/), time constraints led us to concentrate solely on Turborepo. Here are a few reasons for choosing Turborepo:

- Alignment with our tech stack: Turborepo is developed by Vercel, the same company behind Next.js.
- Future-proof: It is expected to eventually merge into a unified tool with [Turbopack](https://turbo.build/pack), the successor to Webpack.

## Getting Started

To develop all apps and packages, use the following command:

```
pnpm dev
```

To build all apps and packages, run:

```
pnpm build
```

## Package managers

### Pnpm

This POC uses `pnpm` as a package manager.
Refer to [pnpm.io/installation](https://pnpm.io/installation) for installation instructions.

### Yarn

It is also possible to use `yarn` as the packege manager of the monorepo.

Note that from `yarn 2` the yarn version itself was supposed to be commited to repository.
With `yarn 4` this changes slightly as is not longer mandatory if you are using `corepack`.
With Node 18+ `corepack` is available by default.

When running `yarn`, it will try to find a `yarnrc.yml`, first in the current directory and the in the parent, and then in parent of the parent and so on.

To set the `yarn` version, we advice to do so in either your projects folder, or in your user `~`

```
corepack enable
yarn set version 4.0.1
```

It will create a `package.json` that you can remove as the current directory is not meant to be a project.

```
rm ./package.json
```

With that set, you are good to create a project, e.g `turborepo`

```
yarn -v // 4.0.1
yarn dlx create-turbo@latest

? Where would you like to create your turborepo? my-turporepo
? Which package manager do you want to use? yarn workspaces

cd my-turporepo
yarn install // it will use the nearest `.yarnrc.yml` file
yarn run dev

```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `ui`: a stub React component library shared by both `web` and `docs` applications. Published to npm as `marnaiz-turborepo-ui`
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo. Published to npm as `@marnaiz/turborepo-tsconfig

## Changes, versioning and releases

Our research shows that the monorepo philosophy is to work _always_ with the latest changes.
That's achived by pointing dependencies to `workspace:*`, e.g.:

```
"eslint-config-custom": "workspace:*",
```

This would mean a big change in the way we work.

Until now you were able to create a release with breaking changes and it was up to consumers to fix those breaking changes when adoption the new version.

With a monorepo where everything is always working on _latest_ the responsibility of fixing those breaking changes relies on the person introducing the breaking changes.

To avoid such a radical change we can and will be using versioning, releasing packages to the registry. We will do that with a 3rd party tool; [changeset](https://github.com/changesets/changesets).

`Changeset` is a CLI that after answering which packages we want to release, and how, whether _major_, _minor_ or _patch_, it will create a file inside `.changeset/` with the provided data.

Afterwards we have two options

1. Locally

   - run command to update package versions; `pnpm changeset:version`
   - publish; `pnpm publish`

2. Let Github action do that.
   - Once your PR get's merge, a new PR will be created automatically updating versions
   - When this latter PR get's merge, it will publish the packages

We advice for the latter.
To illustrate, and to release a new version of the `ui` package, including changes to the `<Button>` component.

1.  Create changeset file

    When we have all the changes we need and want to prepate a release we create a changeset file.

    ```
    pnpm changeset
    ```

    ![](/docs/images/changeset.png)

    It will ask you which packages to update, usually those with changes. Choose between major, minor and patch

    ![](/docs/images/changeset-patch.png)

    Write a message for the release notes. It will generate a _3 word_ file inside `./.changeset/` directory. File that you should commit.

    ![](/docs/images/changeset-file.png)

1.  Commit and push changes
1.  Create PR and merge it.
1.  Second PR will be created

    When this PR get's merged, the publishing of the new versions will happen
    ![](./docs//images/version-packages-pr.png)

### Snapshot and prerelease versions

`changeset` supports both `preseleases` and `snapshot` releases.

#### Prereleases

To create a prerelease, e.g. `1.2.3-next.0`, you should first enter in `pre` mode;

```

pnpm changeset:version:pre

```

Once you are ready to release a stable release, `1.2.3`, you should exit `pre` mode:

```

pnpm changeset:version:pre:exit

```

### Snapshot releases

We have configured a github action to react on the `/publish` command and create a snapshot release.
The release will be done in the `alpha` tag.

![](./docs/images/alpha-release.png)

## Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel.

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

- Docs: https://turborepo-basic-docs-pearl.vercel.app/
- Web: https://turborepo-basic-web-ivory.vercel.app/

To do so you have to create a project per `app` you want to deploy, and make sure to change the config and point to each app directory:

![](./docs/images/vercel-app-docs.png)
![](./docs/images/vercel-app-web.png)

## Bundling

While working inside the monorepo `packages/` don't need to be bundled but if we want to consume them from a microservice (installing it from `npm`) we need to do so.

### Background

Until recencly it was common to generate commomJS (CJS) files, however we should aim to produce ES modules (ESM) so bundlers like webpack can do tree shaking and keep ES6 code if needed.

For `marnaiz-turborepo-ui` I needed to configure the package. It was a chanllenge to make it compliance with ESM and CJS. After lots of try and error it works now.

Key points.

- `package.json` should not have a `type` property,
- `main` should point to the `cjs` version
- `module` to `mjs` (aka ESM) version
- `types` to `cjs`
- `exports` property with both `require` (CJS) and `import` (ESM) props.

Example from [packages/ui/package.json](./packages/ui/package.json)

```json
  "name": "marnaiz-turborepo-ui",
  "version": "1.0.10",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "files": [
    "dist",
    "src"
  ],
  "exports": {
    "./package.json": "./package.json",
    ".": {
      "import": {
        "types": "./dist/index.d.mts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
  }
```

The resources I used were:

- https://arethetypeswrong.github.io/
- https://github.com/arethetypeswrong/arethetypeswrong.github.io/blob/main/docs/problems/FalseCJS.md
- https://tsup.egoist.dev/#bundle-formats
- https://blog.isquaredsoftware.com/2023/08/esm-modernization-lessons/#round-2-results

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
