// The site's Worker. `gatsby build` writes the whole site as static files in
// public/ — an HTML file per page, the page-data JSON Gatsby's client reads
// as it navigates, the hashed JavaScript chunks — uploaded as Workers Static
// Assets:
//
//   - a request that matches a file is served from the assets, and never
//     reaches this Worker;
//   - anything else reaches this Worker, which hands it to the assets. They
//     answer it with the template's 404 page and a 404 status
//     (`not_found_handling: "404-page"` in wrangler.jsonc): a missing page, a
//     missing chunk and a missing page-data file alike.
//
// It exists because a Workers + Static Assets deploy has a Worker in front of
// the assets — the place a redirect, a header or an API route goes when the
// site needs one.
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return env.ASSETS.fetch(request);
  },
};
