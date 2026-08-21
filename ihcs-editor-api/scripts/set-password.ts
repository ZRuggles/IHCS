/**
 * Sets an editor's password directly, without sending an email.
 *
 * Supabase's built-in SMTP is rate limited to a handful of messages per
 * hour, which makes the emailed setup flow unusable during initial
 * setup. This writes the password straight through the Admin API.
 *
 * Intended for bootstrapping and for recovering an account when email
 * is unavailable. Day to day, editors should use "Forgot your
 * password?" so their password is never typed into a terminal or seen
 * by anyone else.
 *
 *   npx tsx --env-file=.env scripts/set-password.ts you@example.com
 *
 * Prompts for the password rather than taking it as an argument, so it
 * does not land in shell history. Pass --generate for a random one.
 */

import { createInterface } from "node:readline";
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { env } from "../src/lib/env.js";
import { sql } from "../src/lib/db.js";

const [, , emailArg, ...flags] = process.argv;

if (!emailArg || !emailArg.includes("@")) {
  console.error("Usage: npx tsx --env-file=.env scripts/set-password.ts <email> [--generate]");
  process.exit(1);
}

const generate = flags.includes("--generate");

const admin = createClient(env.supabaseUrl, env.supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

/** Reads a line without echoing it to the terminal. */
function promptHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const output = rl as unknown as { output?: NodeJS.WriteStream; _writeToOutput?: unknown };

    process.stdout.write(question);
    output._writeToOutput = function () {
      // Swallow the echo so the password never appears on screen.
    };

    rl.question("", (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

/**
 * A readable random password: 4 groups of 5 base32-ish characters.
 * Long enough to satisfy any policy, and possible to read aloud.
 */
function generatePassword(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = randomBytes(20);
  let out = "";
  for (let i = 0; i < 20; i += 1) {
    if (i > 0 && i % 5 === 0) out += "-";
    out += alphabet[bytes[i]! % alphabet.length];
  }
  // Guarantee a symbol and a digit so the strictest policy passes.
  return `${out}!7`;
}

async function main() {
  const email = emailArg!.trim().toLowerCase();

  const rows = await sql<{ id: string; role: string; is_active: boolean }[]>`
    select id::text, role, is_active from editor_profiles where email = ${email}
  `;
  const profile = rows[0];

  if (!profile) {
    console.error(`No editor account exists for ${email}.`);
    console.error("Create one first with scripts/create-admin.ts");
    await sql.end();
    process.exit(1);
  }

  let password: string;

  if (generate) {
    password = generatePassword();
  } else {
    password = await promptHidden("New password (min 12 chars): ");
    const again = await promptHidden("Confirm password: ");

    if (password !== again) {
      console.error("\nThe two passwords do not match.");
      await sql.end();
      process.exit(1);
    }
    if (password.length < 12) {
      console.error("\nPassword must be at least 12 characters.");
      await sql.end();
      process.exit(1);
    }
  }

  const { error } = await admin.auth.admin.updateUserById(profile.id, {
    password,
    // Confirm the address at the same time: an unconfirmed email blocks
    // sign-in, and no confirmation mail can be delivered while rate
    // limited — which is the whole reason for using this script.
    email_confirm: true
  });

  if (error) {
    console.error(`\nCould not set the password: ${error.message}`);
    await sql.end();
    process.exit(1);
  }

  // Make sure the profile can actually sign in.
  await sql`
    update editor_profiles
    set role = 'admin', is_active = true
    where id = ${profile.id}::uuid
  `;

  console.log(`\nPassword set for ${email}.`);
  if (generate) {
    console.log(`\n  ${password}\n`);
    console.log("Copy it now — it is not stored anywhere and cannot be shown again.");
    console.log("Change it after signing in, from your account settings.");
  }
  console.log("\nSign in at http://localhost:5173/admin");

  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
