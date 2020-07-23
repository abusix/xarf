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
    const samplesDir = "samples/positive";
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          for await (const f of getFiles(samplesDir)) {
            if (f.endsWith(".json")) {
              //console.log(`Validating sample: ${f}`);
              const valid = validate(require(f));
              if (!valid) {
                console.log(`Erros while validating sample: ${f}`);
                console.log(validate.errors);
              }
              assert.strictEqual(valid, true);
            }
          }
        } catch (reason) {
          console.log(`Testing positive samples failed: ${reason}`);
          reject(reason);
        }
        resolve();
      })();
    }).catch((reason) => {
      assert.fail(`Testing positive samples failed: ${reason}`);
    });
  });

  it("no negative samples should validate", function () {
    const samplesDir = "samples/negative";
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          for await (const f of getFiles(samplesDir)) {
            if (f.endsWith(".json")) {
              //console.log(`Validating sample: ${f}`);
              const valid = validate(require(f));
              if (valid) {
                console.log(`Expected error but did not throw one: ${f}`);
              }
              assert.notStrictEqual(valid, true);
            }
          }
        } catch (reason) {
          console.log(`Testing negative samples failed: ${reason}`);
          reject(reason);
        }
        resolve();
      })();
    }).catch((reason) => {
      assert.fail(`Testing negative samples failed: ${reason}`);
    });
  });
});
