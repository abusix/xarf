"use strict";

var Ajv = require("ajv");
var ajvIstanbul = require("ajv-istanbul");
var assert = require("assert");

var fs = require("fs");
var path = require("path");

describe("xarf", function () {
  var validate;

  it("all samples should validate", function () {
    var ajv = new Ajv();
    ajvIstanbul(ajv);
    var rootSchema = require("./xarf.schema.json");

    const schemaDir = "./schemas";

    fs.readdirSync(schemaDir)
      .filter((name) => name.endsWith(".schema.json"))
      .map((name) => {
        ajv.addSchema(require("./" + path.join(schemaDir, name)));
      });
    validate = ajv.compile(rootSchema);

    const samplesDir = "./samples";

    fs.readdirSync(samplesDir)
      .filter((name) => path.extname(name) === ".json")
      .map((name) => {
        assert.strictEqual(
          validate(require("./" + path.join(samplesDir, name))),
          true
        );
      });
  });
});
