// npm i @jdw/jst ajv
fs = require('fs')
path = require('path')
const Ajv = require('ajv')
const dereference = require('@jdw/jst').dereference
const jsonfile = require('jsonfile')

var schema = require('./xarf.schema.json')
var schemas = [schema];

const dir = './schemas'

fs.readdirSync(dir)
    .filter(name => path.extname(name) === '.schema.json')
    .map(name => {
        schemas.push(require(path.join(dir, name)))
    });

var ajv = new Ajv({schemas: schemas})
var dereferenced = dereference(schema, (id) => {
    return ajv.getSchema(id).schema
});

console.log(dereferenced)
