# XARF — eXtended Abuse Reporting Format

> ## ⚠️ This repository is deprecated
>
> **This repo hosts the legacy XARF v3 schema and is no longer maintained.**
> XARF has moved to a new home and a new major version, **XARF v4**.
>
> | | New canonical location |
> |---|---|
> | 🌐 Website & docs | **https://xarf.org** |
> | 📖 Specification | **https://github.com/xarf/xarf-spec** |
> | 🧩 v4 Schemas | **https://xarf.org/schemas/v4/** |
> | 💻 Libraries | https://github.com/xarf (Python, JavaScript/TS, Perl, Go, Java, C#) |
>
> **New integrations:** use XARF v4 — start at https://xarf.org and https://github.com/xarf/xarf-spec.
>
> **Migrating from v3?** See the v3 → v4 migration guide in the [spec repo](https://github.com/xarf/xarf-spec).

---

## Already consuming the XARF v3 schema?

**Nothing breaks.** The v3 schema remains available at its existing locations:

- This repository's **release assets** (e.g. `xarf_bundled.schema.json`) continue to resolve.
- The legacy `$id` URL (`https://raw.githubusercontent.com/xarf/schema-discussion/master/xarf.schema.json`) continues to resolve.

However, **no new v3 releases will be published** and this repository is now read-only (archived). The long-term canonical home for all XARF schemas is **[xarf.org](https://xarf.org)**; new integrations should adopt **XARF v4** via the [spec repo](https://github.com/xarf/xarf-spec).

---

## Why the move?

XARF v4 is a ground-up revision: a unified, machine-readable format with a per-type schema model, real-world sample reports, a published migration path, and officially maintained libraries across multiple languages. Development, issues, and discussion all happen in the **[xarf organization](https://github.com/xarf)** now.

## Historical v3 information

The original v3 README content below is retained for historical reference.

<details>
<summary>Legacy XARF v3 README (archived)</summary>

# XARF - eXtended Abuse Reporting Format

## Latest Release

Find the latest schema release [on the releases page](https://github.com/abusix/xarf/releases).

- `xarf_bundled.schema.json`
  - includes all versions (superschema)
  - all schema definitions in one file
  - contains only internal references
  - small file size
  - best for most use cases, when the used tool is good enough to understand complex internal references (multiple hops)
- `xarf_deref.schema.json`
  - includes all versions (superschema)
  - all schema definitions in one file
  - contains no references
  - pretty big file size
  - can be useful for some not-so-sophisticated code generation tools that can't handle references

## Current Version

`3`

[Up-To-Date Tested Sample XARF Reports](samples/positive/3)

## Build status

[![Build Status](https://img.shields.io/github/actions/workflow/status/abusix/xarf/.github/workflows/ci.yml?branch=master)](https://github.com/abusix/xarf/actions?query=workflow%3Axarf-ci)

## Coverage

[![Coverage Status](https://img.shields.io/codecov/c/github/abusix/xarf)](https://codecov.io/gh/abusix/xarf/branch/master)

Please note that you won't be able to see source code for the generated code due to the way CodeCov works. CodeCov doesn't show percentages for code that doesn't exist in the repo.
The coverage will probably never reach 100% because of the way the code is generated, but it is still a useful metric to see how well our samples cover the schema.

## Superschema

The xarf schema contains the history of all versions including the current development preview. It is recommended to use latest version.
Be aware that in `alpha` there was no requirement to specify the version. `development` should not be used in production and is unstable.

## XARF via SMTP

For the purpose of sending XARF reports in an email we "extend" RFC5965 (An Extensible Format for Email Feedback Reports) which defines the ARF format, this is so that anyone that currently parses ARF can extend their code slightly to receive XARF reports.

RFC5965 requires that the email sent uses an outer Content-Type of `multipart/report; report-type=feedback-report` (defined in [https://tools.ietf.org/html/rfc6522](https://tools.ietf.org/html/rfc6522)) and this requires an additional two MIME parts minimum:

- A human-readable part to describe the condition(s) that caused the report to be generated
- A machine-readable part that RFC5965 defines. This requires a minimum of 3 fields: Feedback-Type, User-Agent and Version.

The Feedback-Type field in the standard only allows for `abuse`, `fraud`, `virus`, `other` or `not-spam` values but we unofficially add the `xarf` type, so that a normal ARF receiver would fail at this point, but an XARF compatible parser will then know to expect an XARF report in the next MIME part.

The 3rd MIME part in a RFC6522 message would normally be a `message/rfc822` part containing the message being reported, but for XARF this would be `application/json` and will contain the XARF report.

Here is an example of the proposed XARF message:

```
Content-Type: multipart/report; report-type=feedback-report;
    boundary="--_NmP-f348b15e0b4a4931-Part_1"
From: Abusix <noreply@abusix.org>
To: Max Musterman <max@abusix.com>
Subject: XARF test
Message-ID: <9a271f0f-8929-421b-5bfa-80e50dabf32d@abusix.org>
Date: Tue, 21 Apr 2020 10:25:47 +0000
MIME-Version: 1.0

----_NmP-f348b15e0b4a4931-Part_1
Content-Type: text/plain
Content-Transfer-Encoding: 7bit

This is the human readable description
----_NmP-f348b15e0b4a4931-Part_1
Content-Type: message/feedback-report
Content-Disposition: inline

Feedback-Type: xarf
User-Agent: Abusix/1.0
Version: 1
----_NmP-f348b15e0b4a4931-Part_1
Content-Type: application/json; name=xarf.json
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename=xarf.json

ewogICJWZXJzaW9uIjogIjEiLAogICJSZXBvcnRlckluZm8iOiB7CiAgICAiUmVwb3J0ZXJPcmci
OiAiRXhhbXBsZU9yZyIsCiAgICAiUmVwb3J0ZXJPcmdEb21haW4iOiAiZXhhbXBsZS5jb20iLAog
ICAgIlJlcG9ydGVyT3JnRW1haWwiOiAicmVwb3J0c0BleGFtcGxlLmNvbSIsCiAgICAiUmVwb3J0
ZXJDb250YWN0RW1haWwiOiAiY29udGFjdEBleGFtcGxlLmNvbSIsCiAgICAiUmVwb3J0ZXJDb250
YWN0TmFtZSI6ICJNci4gRXhhbXBsZSIsCiAgICAiUmVwb3J0ZXJDb250YWN0UGhvbmUiOiAiKyAw
MSAwMDAgMTIzNDU2NyIKICB9LAogICJEaXNjbG9zdXJlIjogdHJ1ZSwKICAiUmVwb3J0Ijogewog
ICAgIlJlcG9ydENsYXNzIjogIkFjdGl2aXR5IiwKICAgICJSZXBvcnRUeXBlIjogIlNwYW0iLAog
ICAgIlJlcG9ydFN1YlR5cGUiOiAiVHJhcCIsCiAgICAiRGF0ZSI6ICIyMDE4LTAyLTA1VDE0OjE3
OjEwWiIsCiAgICAiU291cmNlSXAiOiAiMTkyLjAuMi41NSIsCiAgICAiU291cmNlUG9ydCI6IDU0
MzIxLAogICAgIkRlc3RpbmF0aW9uSXAiOiAiMTk4LjUxLjEwMC4zMyIsCiAgICAiRGVzdGluYXRp
b25Qb3J0IjogMjUsCiAgICAiU210cE1haWxGcm9tQWRkcmVzcyI6ICJzcGFtQGV4YW1wbGUuY29t
IiwKICAgICJTbXRwUmNwdFRvQWRkcmVzcyI6ICJ2aWN0aW1AZXhhbXBsZS5jb20iLAogICAgIlNh
bXBsZXMiOiBbCiAgICAgIHsKICAgICAgICAiQ29udGVudFR5cGUiOiAibWVzc2FnZS9yZmM4MjIi
LAogICAgICAgICJCYXNlNjRFbmNvZGVkIjogdHJ1ZSwKICAgICAgICAiRGVzY3JpcHRpb24iOiAi
VGhlIHNwYW0gbWFpbCIsCiAgICAgICAgIlBheWxvYWQiOiAiYldGcGJBPT0iCiAgICAgIH0KICAg
IF0KICB9Cn0=
----_NmP-f348b15e0b4a4931-Part_1--
```

## Validating json-schema samples

### Command line

## With ajv-cli >= 4.0.0

```bash
npm install -g ajv-cli ajv-formats
ajv -c ajv-formats -s xarf.schema.json -d "samples/positive/**/*.json" -r "schemas/**/*.schema.json"
```

## With ajv-cli < 4.0.0

```bash
npm install -g ajv-cli@3.3.0
ajv -s xarf.schema.json -d "samples/positive/**/*.json" -r "schemas/**/*.schema.json"
```

## Project structure

| File(s)                                   |                       Content                        |
| ----------------------------------------- | :--------------------------------------------------: |
| xarf.schema.json                          | super schema containing links to all schema versions |
| schemas/{version}/xarf.schema.json        |            contains links to schema types            |
| schemas/{version}/xarf_shared.schema.json |                 reusable sub schemas                 |
| schemas/{version}/\*.schema.json          |                   specific schemas                   |
| samples/positive/{version}/\*.json        |          example documents for the schemas           |
| samples/negative/{version}/\*.json        |                   invalid examples                   |
| bundle_xarf.js                            |    allows combining the schema into a single file    |

## Adding a new schema

1. Fork the github repo
1. Add a new schema in `schemas/development/` as [subtype].schema.json and try to reuse as much as possible from xarf_shared.schema.json
1. Add an example sample to `samples/positive/development/`
1. Add the new schema to the list in `schemas/development/xarf.schema.json`
1. Run tests locally: `npm run test-xarf`
1. Open up a github PR
1. Discuss and improve

## Release a new schema version

1. Make sure tests are green
1. Script dependencies:
   - [jq](https://stedolan.github.io/jq/download/)
   - [sponge (part of moreutils in debian/ubuntu)](http://joeyh.name/code/moreutils/)
1. ./relase_new_version.sh {version}
1. Update "Current Release" Info in this Readme

## Writing the schema to a single file:

Use [our bundling script](bundle_xarf.js) to create a single file schema.

```bash
git clone https://github.com/abusix/xarf.git
cd xarf
npm install
npm run bundle-xarf
```

It will generate two files:

| File                     |                                         Content                                         |
| ------------------------ | :-------------------------------------------------------------------------------------: |
| xarf_bundled.schema.json |  bundled and minimized using internal refs, might not work with all json schema tools   |
| xarf_deref.schema.json   | bundled and completely derefed. might be bigger in size, but should work with all tools |

</details>
