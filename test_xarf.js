'use strict';

var Ajv = require('ajv');
var istanbul = require('istanbul');
var ajvIstanbul = require('ajv-istanbul')
var assert = require('assert')

var fs = require('fs')
var path = require('path')



describe('xarf', () => {
  var validate;

  before(() => {
    var ajv = new Ajv;
    ajvIstanbul(ajv);
    var rootSchema = require('./xarf.schema.json')

    const dir = './schemas'

    fs.readdirSync(dir)
        .filter(name => name.endsWith('.schema.json'))
        .map(name => {
            ajv.addSchema(require('./' + path.join(dir, name)))
        });
    validate = ajv.compile(rootSchema)
  });

  after(() => {
    var collector = new istanbul.Collector();
    var reporter = new istanbul.Reporter();
    var sync = true;

    collector.add(global.__coverage__);

    reporter.addAll([ 'lcov', 'html' ]);

    reporter.write(collector, sync, function () {
        console.log('reports generated');
    })
  });

  it('all samples should validate', () => {
    const dir = './samples'

    fs.readdirSync(dir)
        .filter(name => path.extname(name) === '.json')
        .map(name => {
            assert.strictEqual(validate(require('./' + path.join(dir, name))), true );
        });

    
  });
});
