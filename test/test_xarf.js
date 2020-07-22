"use strict";

const Ajv = require("ajv");
const ajvIstanbul = require("../util/schema_instrumenter");
const assert = require("assert");

const path = require("path");

const { readdir } = require("fs").promises;

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

describe("xarf", function () {
  this.timeout(10000);
  var validate;

  before(function () {
    console.log("Instrumenting schema code ...");
    var ajv = new Ajv();
    ajvIstanbul(ajv);
    var rootSchema = require("../xarf.schema.json");

    const schemaDir = "./schemas";
    return new Promise((resolve) => {
      (async () => {
        for await (const f of getFiles(schemaDir)) {
          if (f.endsWith(".schema.json")) {
            //console.log(`Adding sub schema: ${f}`);
            ajv.addSchema(require(f));
          }
        }
        console.log("Compiling schema ...");
        validate = ajv.compile(rootSchema);
        console.log("Done instrumenting schema code ...");
        resolve();
      })();
    });
  });

  it("all positive samples should validate", function () {
    const samplesDir = "samples";
    return new Promise((resolve) => {
      (async () => {
        for await (const f of getFiles(samplesDir)) {
          if (f.endsWith(".json")) {
            //console.log(`Validating sample: ${f}`);
            assert.strictEqual(validate(require(f)), true);
          }
        }
        resolve();
      })();
    });
  });

  it("no negative samples should validate", function () {});
});
