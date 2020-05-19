// https://github.com/ajv-validator/ajv-istanbul
// see ./ajv-istanbul-LICENSE for original LICENSE

// modified to use up to date istanbul intrumenter by Frederik Petersen, fp@abusix.com, 2020

"use strict";

const beautify = require("js-beautify").js_beautify;
const { createInstrumenter } = require("istanbul-lib-instrument");
const instrumenter = createInstrumenter();

module.exports = function (ajv) {
  compileAddedSchemas(ajv, "_refs");
  compileAddedSchemas(ajv, "_schemas");
  ajv._opts.processCode = instrument;
  return ajv;
};

function compileAddedSchemas(ajv, schemasKey) {
  for (var key in ajv[schemasKey]) ajv.getSchema(key);
}

function instrument(code) {
  code = beautify(code, { indent_size: 2 });
  return instrumenter.instrumentSync(code);
}
