import { afterEach, describe, expect, it } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { createRequire } from "node:module";

const appDir = path.resolve(__dirname, "../../../apps/web");
const read = (rel: string) => fs.readFileSync(path.join(appDir, rel), "utf8");
const require = createRequire(import.meta.url);
const configPath = path.join(appDir, "gatsby-config.js");

type GatsbyConfig = { siteMetadata: { title: string; siteUrl: string }; plugins: unknown[] };

// gatsby-config.js reads its origin when it loads, so each case loads it
// fresh with the environment it names.
function loadConfig(env: Record<string, string | undefined>): GatsbyConfig {
  const saved = process.env.GATSBY_SITE_URL;
  if (env.GATSBY_SITE_URL === undefined) delete process.env.GATSBY_SITE_URL;
  else process.env.GATSBY_SITE_URL = env.GATSBY_SITE_URL;
  try {
    delete require.cache[require.resolve(configPath)];
    return require(configPath) as GatsbyConfig;
  } finally {
    if (saved === undefined) delete process.env.GATSBY_SITE_URL;
    else process.env.GATSBY_SITE_URL = saved;
  }
}

afterEach(() => {
  delete require.cache[require.resolve(configPath)];
});

describe("site identity (apps/web/gatsby-config.js)", () => {
  it("is a literal the rename seam can find", () => {
    expect(read("gatsby-config.js")).toMatch(/^const SITE_NAME = "[^"]+";$/m);
  });

  it("is what Gatsby hands every page and plugin as siteMetadata.title", () => {
    const literal = /^const SITE_NAME = "([^"]+)";$/m.exec(read("gatsby-config.js"))![1];
    expect(loadConfig({}).siteMetadata.title).toBe(literal);
  });

  it("is spelled nowhere else in the app", () => {
    const literal = /^const SITE_NAME = "([^"]+)";$/m.exec(read("gatsby-config.js"))![1];
    for (const file of ["src/pages/index.js", "src/pages/404.js", "worker/index.ts"]) {
      expect(read(file)).not.toContain(literal);
    }
  });

  it("adds no plugin the template does not have", () => {
    expect(loadConfig({}).plugins).toEqual([]);
  });
});

describe("the site's origin (siteMetadata.siteUrl)", () => {
  it("is the environment's address the deploy's build passes", () => {
    const url = "https://gatsby-boilerplate-web-stage.your-workers-subdomain.workers.dev";
    expect(loadConfig({ GATSBY_SITE_URL: url }).siteMetadata.siteUrl).toBe(url);
  });

  it("is the development server's when nothing is passed", () => {
    expect(loadConfig({ GATSBY_SITE_URL: undefined }).siteMetadata.siteUrl).toBe("http://localhost:8000");
  });

  it("is no longer the template's Vercel demo host", () => {
    expect(read("gatsby-config.js")).not.toContain("vercel.app");
  });
});

describe("the build (apps/web/package.json)", () => {
  const pkg = JSON.parse(read("package.json")) as { scripts: Record<string, string>; dependencies: Record<string, string> };

  it("is gatsby build, with Gatsby's telemetry off", () => {
    expect(pkg.scripts.build).toBe("GATSBY_TELEMETRY_DISABLED=1 gatsby build");
    for (const script of ["develop", "start", "dev", "serve"]) {
      expect(pkg.scripts[script]).toMatch(/^GATSBY_TELEMETRY_DISABLED=1 gatsby /);
    }
  });

  it("is Gatsby 5 on React 18, as the template is", () => {
    expect(pkg.dependencies.gatsby).toMatch(/^\^5\./);
    expect(pkg.dependencies.react).toMatch(/^\^18\./);
    expect(pkg.dependencies["react-dom"]).toMatch(/^\^18\./);
  });
});

describe("the Worker and its assets (apps/web/wrangler.jsonc)", () => {
  const wrangler = read("wrangler.jsonc");

  it("serves Gatsby's output behind the Worker", () => {
    expect(wrangler).toContain('"main": "./worker/index.ts"');
    expect(wrangler).toContain('"directory": "./public"');
    expect(wrangler).toContain('"binding": "ASSETS"');
  });

  it("answers a missing page with the template's 404 page, not the home page", () => {
    expect(wrangler).toContain('"not_found_handling": "404-page"');
    expect(wrangler).not.toContain("single-page-application");
  });

  it("serves folder pages at their trailing-slash address (Gatsby 5's default)", () => {
    expect(wrangler).toContain('"html_handling": "auto-trailing-slash"');
  });
});
