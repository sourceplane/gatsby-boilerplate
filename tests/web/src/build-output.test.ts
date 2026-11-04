import { describe, expect, it } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

// What `gatsby build` wrote to apps/web/public — the files the Worker's
// assets serve. turbo builds the app before this package's tests (it is a
// dependency), so a missing file here is a build that did not produce it.
const pub = path.resolve(__dirname, "../../../apps/web/public");
const read = (rel: string) => fs.readFileSync(path.join(pub, rel), "utf8");

describe("the built site (apps/web/public)", () => {
  it("has the home page, with the template's title and welcome", () => {
    const html = read("index.html");
    expect(html).toMatch(/<title[^>]*>Home Page<\/title>/);
    expect(html).toContain("Congratulations");
    expect(html).toContain("you just made a Gatsby site!");
  });

  it("has the 404 page the assets answer a missing page with, and its folder copy", () => {
    for (const file of ["404.html", "404/index.html"]) {
      const html = read(file);
      expect(html).toMatch(/<title[^>]*>Not found<\/title>/);
      expect(html).toContain("Page not found");
    }
  });

  it("has the page data Gatsby's client fetches as it navigates", () => {
    const app = JSON.parse(read("page-data/app-data.json")) as { webpackCompilationHash: string };
    expect(app.webpackCompilationHash).toMatch(/^[0-9a-f]+$/);
    const index = JSON.parse(read("page-data/index/page-data.json")) as { componentChunkName: string; path: string };
    expect(index.componentChunkName).toBe("component---src-pages-index-js");
    expect(index.path).toBe("/");
    const missing = JSON.parse(read("page-data/404.html/page-data.json")) as { componentChunkName: string };
    expect(missing.componentChunkName).toBe("component---src-pages-404-js");
  });

  it("links only scripts it built", () => {
    const html = read("index.html");
    const scripts = [...html.matchAll(/<script src="\/([^"]+\.js)"/g)].map((m) => m[1]!);
    expect(scripts.length).toBeGreaterThan(0);
    for (const script of scripts) expect(fs.existsSync(path.join(pub, script)), script).toBe(true);
  });
});
