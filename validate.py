from __future__ import print_function

import os
import json
import jsonschema
import argparse
import traceback
import sys

from jsonschema.exceptions import ValidationError, SchemaError


parser = argparse.ArgumentParser(description='Validate document against jsonschema')
parser.add_argument('schema', help="path to the schema file or url to schema")
parser.add_argument('documents', nargs='+', help="paths of documents to validate")

args = parser.parse_args()

schema = args.schema
documents = args.documents

if schema.startswith('http'):
    loaded_schema = {'$ref': schema}
else:
    with open(schema, 'r') as schema_file:
        loaded_schema = json.load(schema_file)

for document in documents:
    with open(document, 'r') as document_file:
        loaded_document = json.load(document_file)

    try:
        jsonschema.validate(loaded_document, loaded_schema)
        print('Validation of %s successful!' % document)
    except ValidationError as e:
        print('Validation of %s failed!' % document)
        traceback.print_exc()
        sys.exit(1)
    except SchemaError as e:
        print('Invalid schema!')
        traceback.print_exc()
        sys.exit(2)