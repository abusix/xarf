# schema-discussion
This is the place to share and discuss new xarf schemas.
The schemas are written in [json schema](http://json-schema.org/) and use its extension mechanisms to allow sharing common sub schemas.

## Latest Release
Find the latest schema release [on the releases page](https://github.com/xarf/schema-discussion/releases).

* `xarf_bundled_<VERSION>.schema.json`
  * all schema definitions in one file
 * contains only internal references
 * small file size
 * best for most use cases
* `xarf_deref_<VERSION>.schema.json`
 * all schema definitions in one file
 * contains no references
 * pretty big file size
 * can be useful for some not-so-sophisticated code generation tools that can't handle references

You can also load the schema dynamically (see python example below) using this url:

```
https://raw.githubusercontent.com/xarf/schema-discussion/<VERSION>/xarf.schema.json
```

Replace <VERSION> with the version tag (e.g. 'alpha5') or 'master' for the latest version. Be aware that, when using 'master', updates
to the schema can break your application.

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

schema_link = {'$ref': 'https://raw.githubusercontent.com/xarf/schema-discussion/master/xarf.schema.json'}

def validate_xarf(document):
    jsonschema.validate(document, schema_link)
```

schema_link is only a reference to the mail xarf schema root, so that everything else is loaded from the web. The schemas are cached after first load.

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

## Writing the schema to a single file:

For some json schema tools and use cases (code generation, e.g.) you need a single schema file because for one reason or another the dereferencing doesn't work. The following steps allow to create a single schema file on the fly.

### Step 0 - Install Nodejs (and npm)

[Download and Install from here](https://nodejs.org/en/download/)

### Step 1 - Install Dependencies

```
npm install jsonfile json-schema-ref-parser
```
### Step 2 - Create script.js

```
const $RefParser = require('json-schema-ref-parser');
const jsonfile = require('jsonfile')
const fullUri = 'https://raw.githubusercontent.com/xarf/schema-discussion/master/xarf.schema.json'

$RefParser.dereference(fullUri)
  .then(function(schema) {
    var file = 'xarf_full.schema.json'
    jsonfile.writeFile(file, schema, function (err) {
        if (err != null){
            console.error(err)
            process.exit(2)
        }
        console.error('done')
        process.exit()
    })
  })
  .catch(function(err) {
    console.error(err)
  });

```

### Step 3 - Run the script
```
node script.js
```
The full schema can now be found in xarf_full.schema.json
