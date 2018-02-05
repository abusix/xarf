# schema-discussion
This is the place to share and discuss new xarf schemas.
The schemas are written in [json schema](http://json-schema.org/) and use its extension mechanisms to allow sharing common sub schemas.

## Validating json-schema samples

```
pip install jsonschema
python validate.py xarf.schema.json samples/*.json
```		

If it validation fails for a sample you can get better error messages by using the specific schema:

```
python validate.py rpz.schema.json samples/rpz_sample.json
```

## Project structure

| File(s)                 | Content                                             |
| ----------------------- |:---------------------------------------------------:|
| xarf.schema.json        | contains links to all specific schemas              |
| xarf_shared.schema.json | reusable sub schemas                                |
| *.schema.json           | specific schemas                                    |
| validate.py             | script for validating documents against the schemas |
| samples/*               | example documents for the schemas                   |

## Adding a new schema

1. Add a new schema as [subtype].schema.json and try to reuse as much as possible from xarf_shared.schema.json
2. Add an example sample to samples/*
3. Add the new schema to the list in xarf.schema.json
4. Discuss and improve
