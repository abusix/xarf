# XARF - eXtended Abuse Reporting Format

## Latest Release
Find the latest schema release [on the releases page](https://github.com/xarf/schema-discussion/releases).

* `xarf_bundled_<VERSION>.schema.json`
  * all schema definitions in one file
  * contains only internal references
  * small file size
  * best for most use cases, when the used tool is good enough to understand complex internal references (multiple hops)
* `xarf_deref_<VERSION>.schema.json`
  * all schema definitions in one file
  * contains no references
  * pretty big file size
  * can be useful for some not-so-sophisticated code generation tools that can't handle references

## Build status
[![Build Status](https://travis-ci.org/xarf/schema-discussion.svg?branch=master)](https://travis-ci.org/xarf/schema-discussion)

## Validating json-schema samples

### Command line

```bash
npm install -g jsonfile json-schema-ref-parser ajv-cli
ajv -s xarf.schema.json -d "samples/*.json" -r "schemas/*.schema.json"
```

## Project structure

| File(s)                         | Content                                             |
| -----------------------         |:---------------------------------------------------:|
| xarf.schema.json                | contains links to all specific schemas              |
| schemas/xarf_shared.schema.json | reusable sub schemas                                |
| schemas/*.schema.json           | specific schemas                                    |
| samples/*.json                  | example documents for the schemas                   |
| create_full_schema_file.js      | allows combining the schema into a single file      |

## Adding a new schema

1. Add a new schema as [subtype].schema.json and try to reuse as much as possible from xarf_shared.schema.json
2. Add an example sample to samples/*
3. Add the new schema to the list in xarf.schema.json
4. Discuss and improve

## Writing the schema to a single file:

Use [create_full_schema_file.js](create_full_schema_file.js) to create a single file schema. 

```bash
npm install jsonfile json-schema-ref-parser
node create_full_schema_file.js
```

It will generate two files:

| File                     | Content                                                                                |
| -----------------------  |:--------------------------------------------------------------------------------------:|
| xarf_bundled.schema.json | bundled and minimized using internal refs, might not work with all json schema tools   |
| xarf_deref.schema.json   | bundled and completely derefed. might be bigger in size, but should work with all tools|
