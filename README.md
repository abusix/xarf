# XARF - eXtended Abuse Reporting Format

## Latest Release

Find the latest schema release [on the releases page](https://github.com/abusix/xarf/releases).

- `xarf_bundled.schema.json`
  - includes all versions (superschema)
  - all schema definitions in one file
  - contains only internal references
  - small file size
  - best for most use cases, when the used tool is good enough to understand complex internal references (multiple hops)
- `xarf_deref.schema.json`
  - includes all versions (superschema)
  - all schema definitions in one file
  - contains no references
  - pretty big file size
  - can be useful for some not-so-sophisticated code generation tools that can't handle references

## Current Version

`alpha`

[Up-To-Date Tested Sample XARF Reports](samples/positive/alpha)

## Build status

[![Build Status](https://travis-ci.org/abusix/xarf.svg?branch=master)](https://travis-ci.org/abusix/xarf)

## Coverage

[![Coverage Status](https://coveralls.io/repos/github/abusix/xarf/badge.svg)](https://coveralls.io/github/abusix/xarf)

Please note that you won't be able to see source code for the generated code due to the way coveralls works. CodeCov is even worse, it doesn't even show percentages for code that doesn't exist in the repo.
The coverage will probably never reach 100% because of the way the code is generated, but it is still a useful metric to see how well our samples cover the schema.

## Superschema

The xarf schema contains the history of all versions including the current development preview. It is recommended to use latest version.
Be aware that in `alpha` there was no requirement to specify the version. `development` should not be used in production and is unstable.

## Validating json-schema samples

### Command line

```bash
npm install -g ajv-cli
ajv -s xarf.schema.json -d "samples/**/*.json" -r "schemas/**/*.schema.json"
```

## Project structure

| File(s)                                   |                       Content                        |
| ----------------------------------------- | :--------------------------------------------------: |
| xarf.schema.json                          | super schema containing links to all schema versions |
| schemas/{version}/xarf.schema.json        |            contains links to schema types            |
| schemas/{version}/xarf_shared.schema.json |                 reusable sub schemas                 |
| schemas/{version}/\*.schema.json          |                   specific schemas                   |
| samples/positive/{version}/\*.json        |          example documents for the schemas           |
| samples/negative/{version}/\*.json        |                   invalid examples                   |
| bundle_xarf.js                            |    allows combining the schema into a single file    |

## Adding a new schema

1. Fork the github repo
1. Add a new schema in `schemas/development/` as [subtype].schema.json and try to reuse as much as possible from xarf_shared.schema.json
1. Add an example sample to `samples/positive/development/`
1. Add the new schema to the list in `schemas/development/xarf.schema.json`
1. Run tests locally: `yarn test-xarf`
1. Open up a github PR
1. Discuss and improve

## Release a new schema version

1. Make sure tests are green
1. Script dependencies: jq, sponge (part of moreutils in debian/ubuntu)
1. ./relase_new_version.sh {version}
1. Update "Current Release" Info in this Readme

## Writing the schema to a single file:

Use [our bundling script](bundle_xarf.js) to create a single file schema.

```bash
git clone https://github.com/abusix/xarf.git
cd xarf
yarn install --frozen-lockfile
yarn bundle-xarf
```

It will generate two files:

| File                     |                                         Content                                         |
| ------------------------ | :-------------------------------------------------------------------------------------: |
| xarf_bundled.schema.json |  bundled and minimized using internal refs, might not work with all json schema tools   |
| xarf_deref.schema.json   | bundled and completely derefed. might be bigger in size, but should work with all tools |
