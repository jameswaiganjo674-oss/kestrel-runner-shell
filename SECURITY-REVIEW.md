# KESTREL Public Runner Shell — Security Review

**Revision:** 1.1 — 15 November 2026  
**Repository:** `jameswaiganjo674-oss/kestrel-runner-shell`  
**Classification:** Public, deliberately minimal workflow infrastructure  
**Status:** Initial boundary reviewed; public-lab audit CI passed. Private-source execution remains NO-GO.

## Disclosure inventory

Permitted contents:
- Public runner and Android toolchain smoke workflows.
- Generated, disposable compatibility fixtures containing no private project source.
- Generic audit scripts and documentation.

Prohibited contents:
- MAGNAN Core source, Git history, private branch names, diffs, internal URLs, private architecture records, owner records, personal information, prompts, memory, vault assets, credentials, API tokens, private keys, signing assets, recovery kits, or private build artifacts.

## Workflow controls

- Public-lab audit trigger: pull request, push to main, or manual dispatch.
- Audit runner timeout: 5 minutes.
- Permissions: `contents: read` only.
- Checkout action pinned to a full commit SHA.
- Checkout uses `persist-credentials: false`.
- No repository/environment secrets are referenced.
- No artifact upload, deployment, or release step.
- Other runner/toolchain workflows remain manually dispatched.
- No private repository checkout or source import.

## Automated guardrails

The Node.js audit checks:
1. Tracked files against an explicit allowlist.
2. Obvious GitHub token, Cloudflare token-assignment, private MAGNAN repository URL, and Actions secret-reference patterns.
3. Workflow read-only permissions and job timeouts.
4. Full-SHA pinning for any third-party Actions used.
5. Absence of artifact publication/deployment markers.
6. Selected Android/Kotlin dependency versions and Gradle checksum verification in the generated compatibility fixture.

The PR workflow passed on 15 November 2026:
- Run: `43688984853`
- Job: `132735387785`
- Runner provisioned and all steps completed.
- Audit result: `PUBLIC LAB AUDIT: PASS`
- 8 tracked files and 4 workflows reviewed.
- Node test result: 1 passed, 0 failed.
- Workflow token permissions observed in logs: Contents read, Metadata read.
- Checkout credential persistence disabled.

**Limitations:** The scanner uses explicit allowlists and pattern checks. It cannot prove the absence of all sensitive information, detect every obfuscated secret, or establish that arbitrary code is safe. It is a supplementary control, not a security certification. Human review remains required.

## Threat assessment

| Threat | Control | Residual status |
|---|---|---|
| Public disclosure of private source | No source checkout/import; tracked-file allowlist | Low within current scope |
| Fork/PR secret exposure | No secrets referenced; read-only token | Low within current scope |
| Third-party action compromise | Full-SHA pinning for the audit checkout action | Reduced; action trust still matters |
| Excessive token permissions | Explicit read-only contents permission | Low |
| Runaway compute | Per-job timeout | Low |
| Artifact leakage | No artifact upload | Low |
| Public workflow abuse | Bounded workflows, no credentials | Limited; public repo remains externally visible |
| Hidden/obfuscated sensitive data | Pattern scanner and human review | Residual risk remains |
| Private-source exfiltration in future | Private source prohibited | NO-GO |

## Future private-build no-go gates

Do not add private source or credentials until a separate owner-approved design establishes:
- exact source commit and provenance;
- read-only, narrowly scoped credential use limited to checkout;
- credentials unavailable to build/test processes;
- dependency integrity and pinned toolchain/actions;
- demonstrable controls preventing build scripts/dependencies from exfiltrating source;
- secure, owner-controlled encrypted artifact delivery and retention;
- auditable provenance linking outputs to the exact private source commit.

If build code can access a source-fetch credential or untrusted dependencies can make unrestricted network calls, private-source execution on this public runner is NO-GO.

## Governance

The public shell is disposable infrastructure only. MAGNAN Core remains the private, authoritative repository. No source mirroring, bidirectional synchronisation, release authority, or trust delegation is permitted.
