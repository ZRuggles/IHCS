/**
 * Creates the first administrator account.
 *
 * Needed once, at setup: every other account is invited from the
 * dashboard, but the first admin has no one to invite them.
 *
 * The account is created with a temporary password and immediately
 * sent a reset email, so the real password is chosen by the person
 * themselves and never passes through a terminal, a chat message, or
 * anyone else's hands.
 *
 *   npx tsx scripts/create-admin.ts you@example.com "Your Name"
 */

import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { env } from "../src/lib/env.js";
import { sql } from "../src/lib/db.js";

const [, , email, fullName = ""] = process.argv;

if (!email || !email.includes("@")) {
  console.error("Usage: npx tsx scripts/create-admin.ts <email> [full name]");
  process.exit(1);
}

const admin = createClient(env.supabaseUrl, env.supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function main() {
  const normalized = email!.trim().toLowerCase();

  const existing = await sql<{ id: string }[]>`
    select id from editor_profiles where email = ${normalized}
  `;

  if (existing.length > 0) {
    // Already present: promote rather than fail, so this script is safe
    // to re-run when recovering access or resending a setup link.
    await sql`
      update editor_profiles
      set role = 'admin', is_active = true
      where email = ${normalized}
    `;
    console.log(`${normalized} already existed — promoted to administrator.`);

    // Send a fresh link too. Recovery tokens are single-use and are
    // consumed even when the link lands on a misconfigured URL, so the
    // common reason to re-run this is needing a new email.
    const { error: resendError } = await admin.auth.resetPasswordForEmail(normalized);
    if (resendError) {
      console.log(`\nCould not send a password email: ${resendError.message}`);
      console.log("Use 'Forgot your password?' on the /admin sign-in page instead.");
    } else {
      console.log("A new password setup email is on its way.");
    }

    await sql.end();
    return;
  }

  // Never used to sign in: the reset email below replaces it.
  const temporaryPassword = randomBytes(24).toString("base64url");

  const { data, error } = await admin.auth.admin.createUser({
    email: normalized,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName }
  });

  if (error || !data.user) {
    console.error(`Could not create the account: ${error?.message}`);
    process.exit(1);
  }

  await sql`
    update editor_profiles
    set role = 'admin', is_active = true, full_name = ${fullName}, email = ${normalized}
    where id = ${data.user.id}::uuid
  `;

  const { error: resetError } = await admin.auth.resetPasswordForEmail(normalized);

  console.log(`\nAdministrator account created for ${normalized}.`);
  if (resetError) {
    console.log(
      "\nThe password reset email could not be sent. Use 'Forgot your password?'\n" +
        "on the /admin sign-in page to set the password."
    );
  } else {
    console.log("A password setup email is on its way. Follow it to choose a password.");
  }

  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
