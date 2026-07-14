import type { AuthConfig } from "./types";

const issuer =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_CSS_ISSUER) ||
  "http://localhost:9000";

const authModeEnv = (
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_CSS_AUTH_MODE) ||
  "password"
).toLowerCase();

export const AUTH_CONFIG: AuthConfig = {
  cssEnabled: true,
  authUrl: issuer,
  clientId: "proddeck",
  loginPath: "/auth/login",
  refreshPath: "/auth/refresh",
  authMode: authModeEnv === "oauth" ? "oauth" : "password",
  oauthRedirectUri:
    (typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_CSS_OAUTH_REDIRECT_URI) ||
    "https://home-dev.delena.buzz/auth/callback",
};
