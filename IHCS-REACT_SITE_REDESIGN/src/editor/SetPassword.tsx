import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";
import { supabase } from "./session";

/**
 * The password-set screen, reached from an invitation or reset email.
 *
 * Supabase puts a recovery token in the URL fragment and, with
 * `detectSessionInUrl` enabled, exchanges it for a temporary session
 * before this component mounts. That session is only good for setting
 * a password — which is exactly what this screen does.
 */

/** Mirrors the minimum length configured in the Supabase dashboard. */
const MIN_LENGTH = 12;

type Phase = "checking" | "ready" | "invalid" | "done";

export function SetPassword() {
  const navigate = useNavigate();
  // When the editor is not configured there is nothing to check, so the
  // initial phase is derived here rather than written from an effect.
  const [phase, setPhase] = useState<Phase>(supabase ? "checking" : "invalid");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    let cancelled = false;

    // The link may still be mid-exchange when this mounts, so listen for
    // the recovery event as well as checking for an existing session.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || session) setPhase("ready");
    });

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setPhase(data.session ? "ready" : "invalid");
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < MIN_LENGTH) {
      setError(`Choose a password of at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }

    setIsSaving(true);
    const { error: updateError } = await supabase!.auth.updateUser({ password });
    setIsSaving(false);

    if (updateError) {
      // Supabase enforces its own strength rules server-side; surface
      // its message rather than guessing which rule was missed.
      setError(updateError.message);
      return;
    }

    setPhase("done");
    window.setTimeout(() => navigate("/admin"), 1800);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F5F9] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <img src="/LOGO.png" alt="" className="mx-auto mb-4 h-14 w-auto" />
          <h1 className="text-xl font-semibold text-[#101828]">Choose your password</h1>
          <p className="mt-1 text-sm text-[#6a7282]">
            This will be the password you use to edit your website.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {phase === "checking" && (
            <p className="flex items-center justify-center gap-2 py-6 text-sm text-[#6a7282]">
              <Loader2 className="h-4 w-4 animate-spin" /> Checking your link…
            </p>
          )}

          {phase === "invalid" && (
            <>
              <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
                This link has expired or has already been used.
              </p>
              <p className="text-sm text-[#4a5565]">
                Go to the sign-in page and choose <em>Forgot your password?</em> to
                request a new one.
              </p>
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="mt-4 w-full rounded bg-[#561D7E] px-4 py-2 font-medium text-white"
              >
                Back to sign in
              </button>
            </>
          )}

          {phase === "done" && (
            <p className="flex items-center justify-center gap-2 py-6 text-sm font-medium text-green-800">
              <CheckCircle2 className="h-5 w-5" /> Password set. Taking you to the editor…
            </p>
          )}

          {phase === "ready" && (
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-[#101828]" htmlFor="password">
                New password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 mb-1 w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[#561D7E] focus:ring-1 focus:ring-[#561D7E]"
              />
              <p className="mb-4 text-xs text-[#6a7282]">
                At least {MIN_LENGTH} characters, with upper and lower case letters,
                a number, and a symbol.
              </p>

              <label className="block text-sm font-medium text-[#101828]" htmlFor="confirm">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 mb-4 w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[#561D7E] focus:ring-1 focus:ring-[#561D7E]"
              />

              {error && (
                <p className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex w-full items-center justify-center gap-2 rounded bg-[#561D7E] px-4 py-2 font-medium text-white disabled:opacity-60"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                Set password
              </button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-[#6a7282]">
          Innovation Healthcare Solutions
        </p>
      </div>
    </div>
  );
}
