## Must

- [ ] document all steps to create the monorepo
- [ ] take screenshots and record video.
- [ ] ask about "Package "docs" must depend on the current version of "marnaiz-turborepo-ui": "0.0.4" vs "0.0.1""

## Should

- [ ] Read https://github.com/changesets/changesets/blob/main/docs/common-questions.md
- [ ] try again with yarn, perhaps yarn 2 or yarn 3
- [x] try what happens with the PR bot and GH action if
  - [x] instead of a changeset file, commit the changes from `changeset version`, the `package.json`'s updated
- [x] deploy to vercel and document learnings
- [ ] 1st commit is from `create-turbo@`. Commit is `feat(create-turbo): create basic`. Does this mean they support `conventional commits`?
  - [ ] How to enforce the commit messages.
  - [ ] Would a commit with `BREAKING CHANGE` produce a major release?
  - [ ] move back tsconfig dependency to dev

## Have to

- [x] add the missing files described in the impact analisys, e.g
  - [x] Prettier
  - [x] editorconfig

## Nice to have

- [ ] import or create this repo in Catawiki org, e.g `turborepo-poc`
  - [ ] need npm token
- [ ] create meaningful examples
- [ ] Understand how does "[Linked Packages](https://github.com/changesets/changesets/blob/main/docs/linked-packages.md)" and "[Fixed Packages](https://github.com/changesets/changesets/blob/main/docs/fixed-packages.md#fixed-packages)" work.
- [ ] [Remote caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [ ] Enable slack notifications in the release file

## Read

- https://segmentfault.com/a/1190000041417381/en
- https://refine.dev/blog/how-to-use-turborepo/#prune-now-supports-all-package-managers

---

### Checklist

- Yarn 4

  - [x] Turpo with yarn 4

    ```
    yarn -v // 1.22.19
    node -v // v18.17.1
    cd ~/projects/turbo
    corepack enable
    yarn set version 4.0.1 // it will create some files
    rm ./package.json
    yarn -v // 4.0.1
    yarn dlx create-turbo@latest

    ? Where would you like to create your turborepo? yarn4
    ? Which package manager do you want to use? yarn workspaces

    cd yarn4
    yarn install // it will use the nearest `.yarnrc.yml` file
    yarn run dev
    ```

  - [ ] Confirm changesets work with yarn 4
  - [ ] Make private registry work
  - [ ] Convert existing `.yarnrc` [into `.yarnrc.yml`](https://yarnpkg.com/migration/guide#update-your-configuration-to-the-new-settings).

- Pnpm
  - [ ] Convert existing `yarn.lock` [into `pnpm-lock.yaml`](https://pnpm.io/cli/import).
- Turborepo
  - [ ] Try adding turbo [to existing project](https://turbo.build/repo/docs/getting-started/add-to-project).
