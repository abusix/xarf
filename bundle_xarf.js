const $RefParser = require('@apidevtools/json-schema-ref-parser');
const jsonfile = require('jsonfile')

var schema = require('./xarf.schema.json')

var options = {
    'resolve': {
        'http': false
    }
} 

function removeKeys(obj, keys, depth = 0){
    var index;
    for (var prop in obj) {
        // important check that this is objects own property
        // not from prototype prop inherited
        if(obj.hasOwnProperty(prop)){
            switch(typeof(obj[prop])){
                case 'string':
                    index = keys.indexOf(prop);
                    if(index > -1 & depth > 0){
                        delete obj[prop];
                    }
                    break;
                case 'object':
                    removeKeys(obj[prop], keys, ++depth);
                    break;
            }
        }
    }
}

$RefParser.bundle(schema, options)
  .then(function(schema) {
    removeKeys(schema, ['$id', '$schema'])
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

$RefParser.dereference(schema, options)
  .then(function(schema) {
    removeKeys(schema, ['$id', '$schema'])
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


