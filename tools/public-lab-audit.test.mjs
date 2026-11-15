import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

test("public laboratory disclosure and workflow guard passes", () => {
  const output = execFileSync(process.execPath, ["tools/public-lab-audit.mjs"], {
    encoding: "utf8"
  });
  assert.match(output, /PUBLIC LAB AUDIT: PASS/);
  assert.match(output, /Reviewed \d+ tracked files and \d+ workflows/);
});
