import { describe, expect, it } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

// The template's own pages, ported as they were: Gatsby's minimal starter's
// welcome page (src/pages/index.js) and its 404 page (src/pages/404.js), byte
// for byte vercel/examples' framework-boilerplates/gatsby.
const appDir = path.resolve(__dirname, "../../../apps/web");
const read = (rel: string) => fs.readFileSync(path.join(appDir, rel), "utf8");

describe("the welcome page (apps/web/src/pages/index.js)", () => {
  const page = read("src/pages/index.js");

  it("is the template's congratulations and its edit hint", () => {
    expect(page).toContain("Congratulations");
    expect(page).toContain("— you just made a Gatsby site! 🎉🎉🎉");
    expect(page).toContain("Edit <code style={codeStyles}>src/pages/index.js</code> to see this page");
  });

  it("links the template's documentation and its five guides", () => {
    const urls = [...page.matchAll(/url: '([^']+)'/g)].map((m) => m[1]);
    expect(urls).toEqual([
      "https://www.gatsbyjs.com/docs/",
      "https://www.gatsbyjs.com/docs/tutorial/",
      "https://www.gatsbyjs.com/docs/how-to/",
      "https://www.gatsbyjs.com/docs/reference/",
      "https://www.gatsbyjs.com/docs/conceptual/",
      "https://www.gatsbyjs.com/plugins",
    ]);
  });

  it("keeps the Gatsby logo and the page's title", () => {
    expect(page).toContain('alt="Gatsby G Logo"');
    expect(page).toContain("export const Head = () => <title>Home Page</title>;");
  });
});

describe("the 404 page (apps/web/src/pages/404.js)", () => {
  const page = read("src/pages/404.js");

  it("is the template's page-not-found, with a link home", () => {
    expect(page).toContain("<h1 style={headingStyles}>Page not found</h1>");
    expect(page).toContain('<Link to="/">Go home</Link>');
    expect(page).toContain("export const Head = () => <title>Not found</title>;");
  });
});

describe("the licence", () => {
  it("is the template's MIT licence, © Vercel", () => {
    const licence = read("LICENSE.md");
    expect(licence).toContain("The MIT License (MIT)");
    expect(licence).toContain("Copyright (c) 2023 Vercel, Inc.");
  });
});
