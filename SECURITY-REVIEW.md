# KESTREL Public Runner Shell — Security Review

**Revision:** 1.0 — 15 November 2026  
**Repository:** `jameswaiganjo674-oss/kestrel-runner-shell`  
**Classification:** Public, deliberately minimal workflow infrastructure  
**Status:** Initial boundary reviewed; hosted-runner execution not yet verified.

## Disclosure inventory

Permitted contents:
- This README.
- One manually dispatched generic runner smoke workflow.
- No MAGNAN project source or project-specific implementation details.

Prohibited contents:
- MAGNAN Core source, Git history, branch names, diffs, internal URLs, architectural records, owner records, personal information, prompts, memory, vault assets, credentials, API tokens, private keys, signing assets, recovery kits, or private build artifacts.

## Workflow controls

- Trigger: `workflow_dispatch` only.
- Runner: `ubuntu-latest`.
- Job timeout: 3 minutes.
- Permissions: `contents: read` only.
- No checkout action.
- No third-party actions.
- No repository or environment secrets.
- No external network calls.
- No artifact upload.
- No deployment or publication step.
- No pull-request, fork, push, issue-comment, or schedule trigger.

## Threat assessment

| Threat | Control | Residual status |
|---|---|---|
| Public disclosure of private source | No source checkout or import | Low within current scope |
| Fork/PR workflow secret exposure | No PR/fork trigger and no secrets | Low within current scope |
| Third-party action compromise | No third-party actions | Low within current scope |
| Excessive token permissions | Explicit read-only contents permission | Low within current scope |
| Runaway compute | 3-minute job timeout | Low |
| Artifact leakage | No artifacts produced | Low |
| Public workflow abuse | Manual dispatch, minimal job, no credentials | Limited; repository is public |
| Runner availability assumption | Must be tested with a real workflow run | Open |
| Private-source exfiltration in future | No private source allowed in this repository | Prohibited / not approved |

## Acceptance criteria

The smoke test is accepted only when:
1. GitHub provisions a hosted runner.
2. The job executes all steps successfully.
3. The recorded run has no checkout, secrets, or artifact activity.
4. The observed result is explicitly limited to public runner availability.

A successful run does not prove that private-source builds are safe or permitted.

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
