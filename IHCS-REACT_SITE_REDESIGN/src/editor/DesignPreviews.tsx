import { useEffect, useState } from "react";
import { previewApi, type DesignPreview } from "./api";

const field = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm";
const button = "rounded-lg bg-[#561D7E] px-4 py-2 text-sm font-medium text-white disabled:opacity-50";
const emails = (text: string) => [...new Set(text.split(/[\s,;]+/).map(e => e.trim().toLowerCase()).filter(Boolean))];

export function DesignPreviews() {
  const [previews, setPreviews] = useState<DesignPreview[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [html, setHtml] = useState("");
  const [fileName, setFileName] = useState("");
  const [reviewers, setReviewers] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let ignore = false;
    previewApi.list().then(r => { if (!ignore) setPreviews(r.previews); })
      .catch(e => { if (!ignore) setMessage(e.message); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);
  async function refresh() { setPreviews((await previewApi.list()).previews); }
  async function loadProposal() {
    setBusy(true);
    try {
      setHtml((await previewApi.template()).html);
      setTitle("IHS services & partnerships — proposed layout");
      setDescription("Proposed navigation, homepage, service organization, and strategic partnerships. For discussion before production changes.");
      setFileName("IHS proposal template");
    } catch (e) { setMessage(e instanceof Error ? e.message : "Could not load the proposal."); }
    finally { setBusy(false); }
  }
  async function create(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    try {
      await previewApi.create({ title, description, html, reviewerEmails: emails(reviewers), isShared: false });
      await refresh(); setHtml(""); setFileName(""); setTitle(""); setDescription(""); setReviewers("");
      setMessage("Preview saved privately. Open it to check the design, then enable client access below.");
    } catch (e) { setMessage(e instanceof Error ? e.message : "Could not save the preview."); }
    finally { setBusy(false); }
  }
  return (
    <section>
      <h2 className="text-lg font-semibold">Design previews</h2>
      <p className="mt-2 text-sm leading-6 text-gray-600">Save temporary designs here and share a private review link. Saving a preview does not change the website or publish content.</p>
      <p className="mt-2 text-sm leading-6 text-gray-600">Invite clients through People using the View only role, then add their email to a preview. They choose their own password and can view only previews shared with them.</p>
      {message && <p role="status" className="my-4 rounded-lg bg-purple-50 p-3 text-sm">{message}</p>}
      <form onSubmit={create} className="my-6 space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-medium">New design preview</h3><button type="button" disabled={busy} onClick={() => void loadProposal()} className="text-sm font-medium text-[#561D7E] underline">Start with the IHS proposal</button></div>
        <label className="block text-sm">Title<input className={field} required maxLength={160} value={title} onChange={e => setTitle(e.target.value)} /></label>
        <label className="block text-sm">Notes for the client<textarea className={field} maxLength={2000} value={description} onChange={e => setDescription(e.target.value)} /></label>
        <label className="block text-sm">Reviewers' email addresses<textarea className={field} placeholder="Separate multiple addresses with commas" value={reviewers} onChange={e => setReviewers(e.target.value)} /></label>
        <label className="block text-sm">Or upload a standalone HTML design<input type="file" accept=".html,.htm,text/html" className="mt-2 block w-full text-sm" onChange={e => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 5_000_000) { setMessage("Choose an HTML file smaller than 5 MB."); return; }
          void file.text().then(text => { setHtml(text); setFileName(file.name); }).catch(() => setMessage("Could not read that file."));
        }} /></label>
        {fileName && <p className="text-sm text-gray-600">Design ready: {fileName}</p>}
        <button className={button} disabled={busy || !html}>{busy ? "Saving…" : "Save private preview"}</button>
      </form>
      {loading ? <p>Loading previews…</p> : previews.length === 0 ? <p className="text-sm text-gray-600">No previews saved yet.</p> : previews.map(p => <PreviewSharing key={`${p.id}:${p.updated_at}`} preview={p} refresh={refresh} />)}
    </section>
  );
}

function PreviewSharing({ preview: p, refresh }: { preview: DesignPreview; refresh: () => Promise<void> }) {
  const [reviewers, setReviewers] = useState((p.reviewer_emails ?? []).join(", "));
  const [shared, setShared] = useState(p.is_shared);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const url = `${window.location.origin}/review/${p.id}`;
  async function save() {
    setBusy(true);
    try { await previewApi.update(p.id, { title: p.title, description: p.description, reviewerEmails: emails(reviewers), isShared: shared }); await refresh(); }
    catch (e) { setMessage(e instanceof Error ? e.message : "Could not update sharing."); }
    finally { setBusy(false); }
  }
  return <article className="mb-4 space-y-3 rounded-xl border border-gray-200 p-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-medium">{p.title}</h3><span className="text-xs text-gray-500">{p.is_shared ? "Shared for review" : "Private draft"}</span></div>
    <p className="text-sm text-gray-600">{p.description}</p>
    <a href={url} target="_blank" rel="noreferrer" className="inline-block text-sm font-medium text-[#561D7E] underline">Open design preview</a>
    <div className="flex gap-2"><input aria-label={`Review link for ${p.title}`} className={field} readOnly value={url} /><button type="button" className="shrink-0 rounded border px-3 text-sm" onClick={() => void navigator.clipboard.writeText(url).then(() => setMessage("Link copied.")).catch(() => setMessage("Select the link above and copy it."))}>Copy link</button></div>
    <label className="block text-sm">Allowed reviewer emails<textarea className={field} value={reviewers} onChange={e => setReviewers(e.target.value)} /></label>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={shared} onChange={e => setShared(e.target.checked)} /> Allow these reviewers to view this design</label>
    <button type="button" disabled={busy} className={button} onClick={() => void save()}>Save sharing settings</button>
    {message && <p role="status" className="text-sm">{message}</p>}
  </article>;
}
