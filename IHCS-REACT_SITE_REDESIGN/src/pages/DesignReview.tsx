import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { previewApi, type DesignPreview } from "../editor/api";
import { signIn, signOut, getToken, watchSession, sendPasswordReset } from "../editor/session";
import { previewDocument } from "../editor/previewDocument";

export default function DesignReview() {
  const { previewId } = useParams();
  return <ReviewContent key={previewId ?? "list"} previewId={previewId} />;
}

function ReviewContent({ previewId }: { previewId?: string }) {
  const [preview, setPreview] = useState<(DesignPreview & { html: string }) | null>(null);
  const [list, setList] = useState<DesignPreview[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(() => Boolean(getToken()));
  const [loading, setLoading] = useState(() => Boolean(getToken()));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [width, setWidth] = useState("100%");
  useEffect(() => watchSession(setSignedIn), []);
  useEffect(() => {
    if (!signedIn) return;
    let ignore = false;
    const result = previewId ? previewApi.get(previewId) : previewApi.list();
    result.then(r => {
      if (ignore) return;
      if ("preview" in r) setPreview(r.preview);
      else setList(r.previews);
    }).catch(e => { if (!ignore) setMessage(e.message); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [signedIn, previewId]);
  async function login(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    const result = await signIn(email.trim(), password);
    setBusy(false);
    if (result.ok) { setLoading(true); setSignedIn(true); setPassword(""); }
    else setMessage(result.message);
  }
  async function logout() { await signOut(); setSignedIn(false); setPreview(null); setList([]); setMessage(""); }
  return <div className="min-h-screen bg-[#f7f5f9]">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4"><div><p className="text-xs uppercase tracking-widest text-[#6b2d94]">Private design review</p><h1 className="mt-1 text-xl font-medium text-[#28133e]">{preview?.title ?? "Design previews"}</h1></div>{signedIn && <button className="text-sm text-[#6b2d94] underline" onClick={() => void logout()}>Sign out</button>}</header>
    {!signedIn ? <form onSubmit={login} className="mx-auto mt-16 max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-7 shadow-sm"><h2 className="text-xl font-medium">Sign in to review</h2><p className="text-sm leading-6 text-gray-600">Use the email and password for your invited account.</p><label className="block text-sm">Email<input type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border p-3" /></label><label className="block text-sm">Password<input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border p-3" /></label>{message && <p role="status" className="text-sm text-red-700">{message}</p>}<button disabled={busy} className="w-full rounded-full bg-[#561D7E] py-3 text-white disabled:opacity-50">{busy ? "Signing in…" : "Open design preview"}</button><button type="button" className="text-sm text-[#561D7E] underline" onClick={() => { if (!email.trim()) { setMessage("Enter your email first."); return; } void sendPasswordReset(email.trim()).then(r => setMessage(r.message)); }}>Forgot your password?</button></form>
    : <main className="p-4 sm:p-6">
      {loading && <p role="status">Loading your preview…</p>}
      {message && <p role="status" className="mb-4 rounded bg-white p-4 text-sm">{message}</p>}
      {preview && <><div className="mb-4 flex flex-wrap items-center justify-between gap-4"><p className="max-w-3xl text-sm leading-6 text-gray-600">{preview.description}<span className="block">Temporary concept for review. The live website is unchanged.</span></p><div className="flex gap-2">{[["100%", "Desktop"], ["390px", "Phone"]].map(([w, label]) => <button key={w} aria-pressed={width === w} className={`rounded-lg border px-4 py-2 text-sm ${width === w ? "bg-[#561D7E] text-white" : "bg-white"}`} onClick={() => setWidth(w)}>{label}</button>)}</div></div><iframe title={preview.title} sandbox="allow-scripts" referrerPolicy="no-referrer" srcDoc={previewDocument(preview.html, window.location.origin)} className="mx-auto block h-[calc(100dvh-12rem)] min-h-[500px] max-w-full rounded-xl border border-gray-200 bg-white shadow-sm" style={{ width }} /></>}
      {!previewId && !loading && <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">{list.length === 0 && <p>No designs have been shared with this account yet.</p>}{list.map(p => <Link key={p.id} to={`/review/${p.id}`} className="rounded-xl border bg-white p-6"><h2 className="font-medium text-[#28133e]">{p.title}</h2><p className="mt-3 text-sm text-gray-600">{p.description}</p><p className="mt-5 text-sm font-medium text-[#561D7E]">Open preview →</p></Link>)}</div>}
    </main>}
  </div>;
}
