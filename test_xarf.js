"use strict";

var Ajv = require("ajv");
var ajvIstanbul = require("./util/schema_instrumenter");
var assert = require("assert");

var fs = require("fs");
var path = require("path");

describe("xarf", function () {
  this.timeout(10000);
  var validate;

  before(function () {
    console.log("Instrumenting schema code ...");
    var ajv = new Ajv();
    ajvIstanbul(ajv);
    var rootSchema = require("./xarf.schema.json");

    const schemaDir = "./schemas";
    return new Promise((resolve) => {
      fs.readdirSync(schemaDir)
        .filter((name) => name.endsWith(".schema.json"))
        .map((name) => {
          ajv.addSchema(require("./" + path.join(schemaDir, name)));
        });
      validate = ajv.compile(rootSchema);
      console.log("Done instrumenting schema code ...");
      resolve();
    });
  });

  it("all positive samples should validate", function () {
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

  it("no negative samples should validate", function () {});
});
