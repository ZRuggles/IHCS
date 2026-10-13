export interface PreviewAccess {
  is_shared: boolean;
  reviewer_emails: string[];
}

export function canReadPreview(
  preview: PreviewAccess,
  identity: { role: string; email: string },
): boolean {
  if (identity.role === "admin" || identity.role === "editor") return true;
  return identity.role === "viewer" && preview.is_shared &&
    preview.reviewer_emails.includes(identity.email.trim().toLowerCase());
}
