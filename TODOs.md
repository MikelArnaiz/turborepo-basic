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

- [ ] add the missing files described in the impact analisys, e.g
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
