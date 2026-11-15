# KESTREL Runner Shell

A clean, public, workflow-only repository used to test GitHub-hosted runner availability.

## Security boundary

- This repository contains no MAGNAN source code or Git history.
- It contains no credentials, personal records, private repository URLs, vault data, signing material, or recovery information.
- The workflow is manually dispatched only.
- It does not check out any repository.
- It does not access secrets or make external network calls.
- It reports only generic runner environment facts.

## Purpose

Determine whether a public repository can obtain a GitHub-hosted runner when private-repository runner provisioning has failed. A successful smoke test proves only that this public workflow can execute. It does **not** authorise private source checkout or private build artifacts.

## Explicit non-goals

This repository is not an authority for MAGNAN source, identity, policy, memory, signing, releases, or recovery. It must never become a mirror of MAGNAN Core.

## Next security gates

Any future proposal to build private source here requires a separate review and approval covering source provenance, credential isolation, dependency pinning, build-script egress, artifact confidentiality, retention, and verifiable provenance.
