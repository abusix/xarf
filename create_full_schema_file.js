// npm install jsonfile json-schema-ref-parser
const $RefParser = require('json-schema-ref-parser');
const jsonfile = require('jsonfile')
const util = require('util')

var schema = require('./xarf.schema.json')

$RefParser.bundle(schema)
  .then(function(schema) {
    var file = util.format('xarf_bundled.schema.json', url_location_part)
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

$RefParser.dereference(schema)
  .then(function(schema) {
    var file = util.format('xarf_deref.schema.json', url_location_part)
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


