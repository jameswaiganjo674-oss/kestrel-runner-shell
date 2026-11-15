import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const allowed = new Set([
  ".github/workflows/android-toolchain-preflight.yml",
  ".github/workflows/magnan-build-compatibility-preflight.yml",
  ".github/workflows/public-lab-audit.yml",
  ".github/workflows/public-runner-smoke.yml",
  "README.md",
  "SECURITY-REVIEW.md",
  "tools/public-lab-audit.mjs",
  "tools/public-lab-audit.test.mjs"
]);

const failures = [];
const tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0").filter(Boolean);

for (const path of tracked) {
  if (!allowed.has(path)) failures.push(`Unreviewed path outside allowlist: ${path}`);
}

const allText = tracked.map(path => {
  try { return { path, text: readFileSync(path, "utf8") }; }
  catch { failures.push(`Unable to read tracked text file: ${path}`); return { path, text: "" }; }
});

const forbidden = [
  ["GitHub personal access token", /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/],
  ["GitHub fine-grained token", /\bgithub_pat_[A-Za-z0-9_]{20,}\b/],
  ["Cloudflare API token assignment", /CF_API_TOKEN\s*[:=]/i],
  ["private MAGNAN repository URL", /github\.com\/jameswaiganjo674-oss\/Magnan-core/i],
  ["GitHub Actions secret reference", /\$\{\{\s*secrets\./i]
];

for (const { path, text } of allText) {
  for (const [label, pattern] of forbidden) {
    if (pattern.test(text)) failures.push(`${label} pattern found in ${path}`);
  }
}

const workflowPaths = tracked.filter(path => path.startsWith(".github/workflows/") && path.endsWith(".yml"));
for (const path of workflowPaths) {
  const text = readFileSync(path, "utf8");
  if (!/^permissions:\s*\n\s+contents:\s+read\s*$/m.test(text)) {
    failures.push(`Workflow must declare contents: read only: ${path}`);
  }
  if (!/^\s+timeout-minutes:\s*\d+\s*$/m.test(text)) {
    failures.push(`Workflow must set a job timeout: ${path}`);
  }
  if (/actions\/checkout@/i.test(text) && !/actions\/checkout@11bd71901bbe5b1630ceea73d27597364c9af683/.test(text)) {
    failures.push(`Checkout action must be pinned to the reviewed v4 commit: ${path}`);
  }
  if (/uses:\s*[^\s]+/g.test(text)) {
    const uses = [...text.matchAll(/^\s*uses:\s*(\S+)/gm)].map(match => match[1]);
    for (const action of uses) {
      if (!/^[^@]+@[0-9a-f]{40}$/.test(action)) failures.push(`Third-party action is not pinned by full commit SHA in ${path}: ${action}`);
    }
  }
  if (/upload-artifact|deploy-pages|cloudflare\/wrangler-action|repository_dispatch/i.test(text)) {
    failures.push(`Artifact publication or deployment is not permitted in public lab workflow: ${path}`);
  }
}

const compatibility = readFileSync(".github/workflows/magnan-build-compatibility-preflight.yml", "utf8");
const expected = [
  ["Android Gradle Plugin", /com\.android\.application' version '8\.9\.2'/],
  ["Kotlin Multiplatform", /org\.jetbrains\.kotlin\.multiplatform' version '2\.4\.0'/],
  ["Kotlin Android", /org\.jetbrains\.kotlin\.android' version '2\.4\.0'/],
  ["LiteRT-LM", /litertlm-android:0\.18\.1/],
  ["Robolectric", /robolectric:4\.14\.1/],
  ["AndroidX Activity", /androidx\.activity:activity:1\.10\.1/],
  ["AndroidX Biometric", /androidx\.biometric:biometric:1\.1\.0/]
];
for (const [label, pattern] of expected) {
  if (!pattern.test(compatibility)) failures.push(`Compatibility fixture missing expected ${label} version`);
}
if (!/MainActivityTest/.test(compatibility) || !/includeAndroidResources = true/.test(compatibility) || !/:app:testDebugUnitTest/.test(compatibility)) {
  failures.push("Compatibility fixture must execute a real Robolectric Android unit test");
}
if (!/gradle-8\.11\.1-bin\.zip\.sha256/.test(compatibility)) {
  failures.push("Compatibility fixture must verify the official Gradle distribution checksum");
}
if (!/No MAGNAN source, repository checkout, credentials, or private artifacts were used/.test(compatibility)) {
  failures.push("Compatibility fixture must state its no-private-source boundary");
}

if (failures.length) {
  console.error("PUBLIC LAB AUDIT: FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("PUBLIC LAB AUDIT: PASS");
  console.log(`Reviewed ${tracked.length} tracked files and ${workflowPaths.length} workflows.`);
  console.log("No private-source URL, credential pattern, unreviewed file, or unsafe workflow permission was detected.");
}
