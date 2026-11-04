// The site's name — the one place it is spelled. SITE_NAME is the rename
// seam: a product built from this baseline gets its own display name written
// here, and Gatsby hands it to every page and plugin as siteMetadata.title.
// It is gatsby-starter-minimal's own title; Vercel's copy of the template
// named its host instead ("Gatsby + Vercel"), and this one is not on Vercel.
const SITE_NAME = "My Gatsby Site";

// The site's own origin, for siteMetadata.siteUrl (what a sitemap, a robots
// file or a canonical link plugin reads). The deploy's build passes the
// environment's address (GATSBY_SITE_URL, from the component's
// buildCommand); a local build is the development server's.
const SITE_URL = process.env.GATSBY_SITE_URL || "http://localhost:8000";

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: SITE_NAME,
    siteUrl: SITE_URL,
  },
  plugins: [],
};
