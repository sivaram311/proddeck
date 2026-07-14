import type { AuthConfig } from "./types";

export const AUTH_CONFIG: AuthConfig = {
  cssEnabled: true,
  authUrl:
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_CSS_ISSUER) ||
    "http://localhost:9000",
  clientId: "proddeck",
  loginPath: "/auth/login",
  refreshPath: "/auth/refresh",
};
