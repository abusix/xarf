import argparse
import json
import os
import sys

# pip install gitpython
from git import Repo

parser = argparse.ArgumentParser(description='Release a new schema version.')
parser.add_argument('version', type=str, help='Version name. e.g. \'alpha5\'')
args = parser.parse_args()

version = args.version

repo = Repo(os.getcwd())

if version in repo.tags:
    print('Tag {0} already exists. Cancelling release'.format(version))


main_schema_path = 'xarf.schema.json'
with open(main_schema_path) as main_schema_file:
    main_schema = json.load(main_schema_file)

main_schema['$id'] = 'https://raw.githubusercontent.com/xarf/schema-discussion/${0}/xarf.schema.json'

with open(main_schema_path, 'w') as main_schema_file:
    json.dump(main_schema, main_schema_file, indent=True)

index = repo.index

index.add(main_schema_path)
index.commit('{0} release'.format(version))

repo.create_tag(version)


main_schema['$id'] = 'https://raw.githubusercontent.com/xarf/schema-discussion/master/xarf.schema.json'

with open(main_schema_path, 'w') as main_schema_file:
    json.dump(main_schema, main_schema_file, indent=True)

index.add(main_schema_path)
index.commit('revert url to master after release')

