# schema-discussion
This is the place to share and discuss new xarf schemas.
The schemas are written in [json schema](http://json-schema.org/) and use its extension mechanisms to allow sharing common sub schemas.

## Build status
[![Build Status](https://travis-ci.org/xarf/schema-discussion.svg?branch=master)](https://travis-ci.org/xarf/schema-discussion)

## Validating json-schema samples

### Command line

```
pip install jsonschema
python validate.py xarf.schema.json samples/*.json
```		

If it validation fails for a sample you can get better error messages by using the specific schema:

```
python validate.py rpz.schema.json samples/rpz_sample.json
```

### Python

If you want to start validating xarf documents in your code you can use this snippet:

```
import jsonschema

ref_resolver = jsonschema.RefResolver('https://raw.githubusercontent.com/xarf/schema-discussion/master/', None)
schema_link = {'$ref': 'xarf.schema.json'}

def validate_xarf(document):
    jsonschema.validate(document, schema_link, resolver=ref_resolver)
```

The RefResolver makes sure that the references between the schema files can be resolved and it uses the master branch of this repository (this should change when xarf is released and hosted somewhere). So schema_link is only a reference to the mail xarf schema root, so that everything else is loaded from the web. The schemas are cached after first load.

The validate_xarf method can be called from your code (this is just an example):

```
import json

from jsonschema.exceptions import ValidationError

with open('samples/rpz_sample.json') as json_file:
    document = json.load(json_file)
    
try:
    validate_xarf(document)
except ValidationError as e:
    //handle error here. For example return 400 status code in web app
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
