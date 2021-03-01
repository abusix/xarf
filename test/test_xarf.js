"use strict";
var validate;
try {
  validate = require("../gen_validate_schema_pretty.js");
} catch (error) {
  console.error("Did you run `npm run generate-code`?", error);
}

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
  this.timeout(40000);

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
