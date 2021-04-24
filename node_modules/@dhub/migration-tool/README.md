# `@dhub/migration-tool`
A tool for migrating from the [dDrive Daemon](https://github.com) to [dHub](https://github.com/-org/dhub).

This tool does a few things:
1. It moves all your stored dDatabases from `~/.ddrives/storage/vaults` to `~/.dhub/storage`.
2. It copies all network configurations (the vaults you're seeding) from the daemon's Level instance (at `~/.dhub/storage/db`) into dHub's config trie.
3. It copies your FUSE root drive key into a separate config file that will be loaded by [`@dhub/ddrive`](https://github.com).

### Installation
```
npm i @dhub/migration-tool -g
```

### Usage
This migration tool is currently bundled with dHub -- it's run by default when dHub is first started, so you shouldn't have to run this manually. After a few months or so, we'll be removing it. 

If you'd like to do the migration manually anyway, you can install this module globally (`npm i @dhub/migration-tool -g`) and use the included `bin.js` CLI tool.

#### As a module
The tool exports two functions, `migrate` and `isMigrated`. `await migrate()` will perform the migration.

### From the CLI
`./bin.js` will perform the migration. It assumes that your dDrive daemon storage is stored in `~/.ddrive` and that your dHub storage directory is going to be `~/.dhub`.

### License
MIT
