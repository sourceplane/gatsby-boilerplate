import shared from "../../tooling/eslint/index.js";

// The shared config lints TypeScript: here, the Worker. The template's pages
// and gatsby-config.js are JavaScript with JSX; they are parsed (a syntax
// error fails lint) with no rules of ours on top, as the template ships them.
// Gatsby's build output (public/) and its cache (.cache/) are not sources.
export default [
  ...shared,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  { ignores: ["public/**", ".cache/**"] },
];
