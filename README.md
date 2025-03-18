# Digdir Illustration library

This repo contains SVGs that are transformed into React components when built.

## Development

```bash
pnpm i
```

Build the components:

```bash
pnpm run build
```

Run the illustration app:

```bash
pnpm run dev
```

## Publishing to NPM

After we merge the PR with the new version, we have to publish the package to npm.

First, **always** make sure you are in the `main` branch, with all changes pulled.

Secondly, run the build command 
```bash
pnpm run build:illustrations
```

Third, run 
```bash
npm whoami
```
to make sure you are logged in to npm on an account that has access to the digdir organisation.

Since the PR we merged contains a version changeset already, we only need to run the publish command.
When we are safe to publish the package, we will run this command:

```shell
pnpm changeset publish
```

This will create a tag we need to push to github.
You need to make sure you have the correct permissions to the repository.

To push the new tag, run

```shell
git push origin <tag_name>
```

or, if you are **certain** you only have one tag to push

```shell
git push --tags
```

_This is not recommended_