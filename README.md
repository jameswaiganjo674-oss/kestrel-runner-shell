# KESTREL Runner Shell

A clean, public, workflow-only repository used to test GitHub-hosted runner availability and reusable, non-sensitive engineering checks.

## Security boundary

- This repository contains no MAGNAN source code or Git history.
- It contains no credentials, personal records, private repository URLs, vault data, signing material, or recovery information.
- Public workflows use read-only repository permissions and bounded job timeouts.
- No private source checkout, secret access, artifact publication, deployment, or release authority is permitted.
- The repository is not an authority for MAGNAN source, identity, policy, memory, signing, releases, or recovery.

## Purpose

The public repository is a disposable engineering laboratory. It can validate generic tooling, runner availability, and generated compatibility fixtures. A successful workflow proves only the exact checks it executed; it does not validate MAGNAN source or authorise private-source execution here.

## Current safeguards

- `tools/public-lab-audit.mjs` checks the tracked-file allowlist, obvious credential/private-repository disclosure patterns, workflow permissions and timeouts, action pinning, deployment/artifact restrictions, and selected compatibility fixture versions.
- `tools/public-lab-audit.test.mjs` runs a regression test using Node's built-in test runner.
- `.github/workflows/public-lab-audit.yml` runs on pull requests and pushes to main, checks out only this public repository, disables persisted checkout credentials, and runs the audit with a five-minute timeout.
- Android toolchain and compatibility workflows generate disposable projects and do not import private source.

## Important limitation

The audit is a guardrail, not a guarantee against malicious code, compromised dependencies, or all forms of information disclosure. Human review remains mandatory. Never put private MAGNAN code or secrets here on the assumption that they can be deleted later; Git history can retain them.

## Future private-build no-go gates

Any proposal to execute private source on a public runner requires a separate owner-approved design covering source provenance, narrowly scoped credential isolation, dependency integrity, build-script network egress, artifact confidentiality, retention, and verifiable provenance. Until enforceable controls exist, private-source execution in this repository is NO-GO.
