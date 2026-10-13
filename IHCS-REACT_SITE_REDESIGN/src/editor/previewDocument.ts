/** Uploaded HTML runs in an opaque-origin sandbox with no network APIs/forms. */
export function previewDocument(html: string, origin: string): string {
  const host = new URL(origin).origin;
  return `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${host} data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src data:; connect-src 'none'; frame-src 'none'; object-src 'none'; form-action 'none'; base-uri 'none'">${html}`;
}
