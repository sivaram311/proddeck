import type { AuthConfig } from "./types";
import {
  cssAuthMode,
  cssIssuer,
  cssOauthRedirectUri,
} from "./cssEnv";

export const AUTH_CONFIG: AuthConfig = {
  cssEnabled: true,
  authUrl: cssIssuer(),
  clientId: "proddeck",
  loginPath: "/auth/login",
  refreshPath: "/auth/refresh",
  authMode: cssAuthMode(),
  oauthRedirectUri: cssOauthRedirectUri(),
};
