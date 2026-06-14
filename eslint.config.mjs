import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // We intentionally initialise loading state, reset UI on route change,
      // and set state from external (Supabase auth) subscriptions inside
      // effects. Keep this visible as a warning rather than a hard error.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
