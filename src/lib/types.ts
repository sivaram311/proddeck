export type AuthConfig = {
  cssEnabled: boolean;
  authUrl: string;
  clientId: string;
  loginPath?: string;
  refreshPath?: string;
  /** password = legacy /auth/login on ProdDeck; oauth = redirect to css-next */
  authMode?: "password" | "oauth";
  oauthRedirectUri?: string;
};

export type DeckApp = {
  slug: string;
  name: string;
  description: string;
  baseUrl: string;
  clientId: string;
  env: string;
};

export type CatalogResponse = {
  apps: DeckApp[];
  source: "static" | "merged";
};
