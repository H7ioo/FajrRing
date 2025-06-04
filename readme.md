### Helpful Notes

- Add a dep to a specific package

```bash
pnpm install jest --save-dev --recursive --filter=web --filter=@repo/ui --filter=docs
```

- Update dep for all packages

```bash
pnpm up -recursive typescript@latest
```

- To keep all the packages versions in sync you can use [syncpack](https://www.npmjs.com/package/syncpack), [Manypkg](https://www.npmjs.com/package/@manypkg/cli), [sherif](https://www.npmjs.com/package/sherif)

or [pnpm catalog](https://pnpm.io/catalogs)

- [Turbo run commands](https://turborepo.com/docs/reference/run)

Like turbo build --filter=web and turbo run web#build

- [Watch mode for packages that don't have built in watch](https://turborepo.com/docs/crafting-your-repository/developing-applications#watch-mode)

### Tasks (TODO:)

- [ ] Add a production build scripts (update tsconfig) [see](https://turborepo.com/docs/core-concepts/internal-packages#compilation-strategies)
- [ ] Adding environment variables to task hashes [see](https://turborepo.com/docs/crafting-your-repository/using-environment-variables)
- [ ] Add [eslint-config-turbo](https://turborepo.com/docs/reference/eslint-config-turbo)
- [ ] Try SPA inside of the dashboard router using react-router see josh twitter
