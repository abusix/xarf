// npm install jsonfile json-schema-ref-parser
const $RefParser = require('json-schema-ref-parser');
const jsonfile = require('jsonfile')

var schema = require('./xarf.schema.json')

$RefParser.bundle(schema)
  .then(function(schema) {
    var file = 'xarf_bundled.schema.json'
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
    var file = 'xarf_deref.schema.json'
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


