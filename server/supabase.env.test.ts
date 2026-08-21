import { describe, expect, it } from "vitest";

describe("Supabase configuration", () => {
  it("responds to a lightweight REST request with the configured public credentials", async () => {
    const url = process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
    expect(url).toMatch(/^https:\/\/[^/]+\.supabase\.co$/);
    expect(anonKey).toBeTruthy();

    const response = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: anonKey as string, Authorization: `Bearer ${anonKey}` },
    });
    expect([200, 401, 404]).toContain(response.status);
    expect(response.status).not.toBe(403);
  }, 15000);
});
