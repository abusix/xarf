from __future__ import print_function

import os
import json
import jsonschema
import argparse
import traceback
import sys

from jsonschema.exceptions import ValidationError, SchemaError


parser = argparse.ArgumentParser(description='Validate document against jsonschema')
parser.add_argument('schema', help="path to the schema file")
parser.add_argument('documents', nargs='+', help="paths of documents to validate")

args = parser.parse_args()

schema = args.schema
documents = args.documents

absolute_path_to_base_directory = os.path.abspath(os.path.dirname(schema))

with open(schema, 'r') as schema_file:
    loaded_schema = json.load(schema_file)

# Note that the second parameter does nothing.
resolver = jsonschema.RefResolver('file://' + absolute_path_to_base_directory + '/', None)

for document in documents:
    with open(document, 'r') as document_file:
        loaded_document = json.load(document_file)

    try:
        jsonschema.validate(loaded_document, loaded_schema, resolver=resolver)
        print('Validation of %s successful!' % document)
    except ValidationError as e:
        print('Validation of %s failed!' % document)
        traceback.print_exc()
        sys.exit(1)
    except SchemaError as e:
        print('Invalid schema!')
        traceback.print_exc()
        sys.exit(2)