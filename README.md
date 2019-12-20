A modified version of https://github.com/actions/typescript-action

# Releases

Tentative SOP, to be improved whenever possible:

1. Commit all your code changes.

2. Check out a release branch. Keeping releases in these branches limits the
   amount of node_modules thrash in the repo.
```bash
git checkout -b releases/v<NUM>
# e.g.:
git checkout -b releases/v3
```

3. Run the following script to commit your compiled JavaScripts and production
   node_modules:
```bash
./scripts/push_release.sh
```

4. Maybe: Use Github UI to create a release and tag.