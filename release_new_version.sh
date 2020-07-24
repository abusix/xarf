#!/bin/bash

if [ -z "$1" ]
  then
    echo "No version supplied as argument. Example: './relase_new_version.sh 23'"
fi

version="$1"

cp -r schemas/development schemas/${version}
cp -r samples/positive/development samples/positive/${version}
cp -r samples/negative/development samples/negative/${version}

sed -i 's/development/${version}/g' schemas/${version}/xarf.schema.json
sed -i 's/development/${version}/g' samples/positive/${version}/xarf.schema.json
sed -i 's/development/${version}/g' samples/negative/${version}/xarf.schema.json