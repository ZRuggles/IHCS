import { useSyncExternalStore } from "react";
import { Loader2 } from "lucide-react";
import { useEditor } from "./useEditor";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";
import { getToken, TOKEN_CHANGE_EVENT } from "./session";

/**
 * The /admin route.
 *
 * Shows the dashboard when signed in, the login form otherwise.
 *
 * A "checking" state is needed because a stored token must be validated
 * against the API before we know which view is correct — without it, a
 * returning editor sees a login flash on every page load. That state is
 * derived from storage during render rather than written from an effect,
 * which keeps this component free of the cascading-render shape that
 * froze CourseDetail once before.
 */

/** localStorage changes only on sign-in and sign-out. */
function subscribeToStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(TOKEN_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(TOKEN_CHANGE_EVENT, onChange);
  };
}

function hasStoredToken() {
  return getToken() !== null;
}

export function AdminRoute() {
  const { isSignedIn } = useEditor();

  // True when a token exists but the provider has not yet confirmed it.
  const tokenPresent = useSyncExternalStore(
    subscribeToStorage,
    hasStoredToken,
    () => false // server/prerender: assume signed out
  );

  if (isSignedIn) return <AdminDashboard />;

  if (tokenPresent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F5F9]">
        <Loader2 className="h-6 w-6 animate-spin text-[#561D7E]" aria-label="Signing in" />
      </div>
    );
  }

  // signIn() stores the token and fires the change event, so the view
  // switches without any state being threaded through here.
  return <AdminLogin />;
}
