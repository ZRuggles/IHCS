import test from "node:test";
import assert from "node:assert/strict";
import { canReadPreview } from "./previewAccess.js";

test("a viewer sees only a shared preview assigned to their own account", () => {
  const preview = { is_shared: true, reviewer_emails: ["client@example.com"] };
  assert.equal(canReadPreview(preview, { role: "viewer", email: " CLIENT@example.com " }), true);
  assert.equal(canReadPreview(preview, { role: "viewer", email: "other@example.com" }), false);
  assert.equal(canReadPreview({ ...preview, is_shared: false }, { role: "viewer", email: "client@example.com" }), false);
  assert.equal(canReadPreview(preview, { role: "unknown", email: "client@example.com" }), false);
});

test("editors can inspect private drafts without granting client access", () => {
  const preview = { is_shared: false, reviewer_emails: [] };
  for (const role of ["admin", "editor"]) assert.equal(canReadPreview(preview, { role, email: "staff@example.com" }), true);
  assert.equal(canReadPreview(preview, { role: "viewer", email: "staff@example.com" }), false);
});
