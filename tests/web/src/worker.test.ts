import { describe, expect, it, vi } from "vitest";

import worker from "@/worker/index";

// What reaches the Worker is a request no file matched. It is handed to the
// assets, which answer with the template's 404 page and a 404 status; the
// Worker passes that answer through as it is.
function assets(status: number, body: string) {
  return { fetch: vi.fn(async (_req: Request) => new Response(body, { status, headers: { "content-type": "text/html" } })) };
}

describe("the Worker", () => {
  it("hands every request to the assets", async () => {
    const ASSETS = assets(200, "<title>Home Page</title>");
    const req = new Request("https://site.example/");
    const res = await worker.fetch(req, { ASSETS });
    expect(ASSETS.fetch).toHaveBeenCalledWith(req);
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("Home Page");
  });

  it("passes the assets' 404 page through with its status", async () => {
    const ASSETS = assets(404, "<title>Not found</title>");
    const res = await worker.fetch(new Request("https://site.example/no-such-page/"), { ASSETS });
    expect(res.status).toBe(404);
    expect(await res.text()).toContain("Not found");
  });

  it("asks once per request, query and all", async () => {
    const ASSETS = assets(200, "ok");
    const req = new Request("https://site.example/page-data/index/page-data.json?v=1");
    await worker.fetch(req, { ASSETS });
    expect(ASSETS.fetch).toHaveBeenCalledOnce();
    expect(ASSETS.fetch).toHaveBeenCalledWith(req);
  });
});
