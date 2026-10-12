export interface DeployTarget { name: string; url: string }
export interface DeployResult { name: string; triggered: boolean; error: string | null }

/** Hook URLs are secrets; return only site names and failure descriptions. */
export async function deploySites(targets: DeployTarget[], request: typeof fetch = fetch): Promise<DeployResult[]> {
  return Promise.all(targets.map(async ({ name, url }) => {
    try {
      const response = await request(url, { method: "POST", signal: AbortSignal.timeout(15_000) });
      return { name, triggered: response.ok, error: response.ok ? null : `Deploy hook returned ${response.status}.` };
    } catch {
      return { name, triggered: false, error: "Could not reach the deploy service." };
    }
  }));
}
