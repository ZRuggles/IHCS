import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { signIn, sendPasswordReset } from "./session";

/**
 * The private sign-in page at /admin.
 *
 * Not linked from anywhere on the public site. Error text never
 * reveals whether an email address has an account.
 */
export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await signIn(email.trim(), password);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      setPassword("");
    }
    // On success there is nothing to do here: storeToken() fires the
    // token-change event and AdminRoute swaps to the dashboard.
  }

  async function handleReset(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    const result = await sendPasswordReset(email.trim());
    setIsSubmitting(false);
    setNotice(result.message);
    setShowReset(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F5F9] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <img src="/LOGO.png" alt="" className="mx-auto mb-4 h-14 w-auto" />
          <h1 className="text-xl font-semibold text-[#101828]">Website Editor</h1>
          <p className="mt-1 text-sm text-[#6a7282]">
            Sign in to edit your website content.
          </p>
        </div>

        <form
          onSubmit={showReset ? handleReset : handleSubmit}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <label className="block text-sm font-medium text-[#101828]" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 mb-4 w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[#561D7E] focus:ring-1 focus:ring-[#561D7E]"
          />

          {!showReset && (
            <>
              <label className="block text-sm font-medium text-[#101828]" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 mb-4 w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[#561D7E] focus:ring-1 focus:ring-[#561D7E]"
              />
            </>
          )}

          {error && (
            <p className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="mb-3 rounded bg-green-50 px-3 py-2 text-sm text-green-800" role="status">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded bg-[#561D7E] px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            {showReset ? "Send reset link" : "Sign in"}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowReset(!showReset);
              setError(null);
              setNotice(null);
            }}
            className="mt-3 w-full text-center text-sm text-[#561D7E] underline"
          >
            {showReset ? "Back to sign in" : "Forgot your password?"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[#6a7282]">
          Innovation Healthcare Solutions
        </p>
      </div>
    </div>
  );
}
