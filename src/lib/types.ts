export type AuthConfig = {
  cssEnabled: boolean;
  authUrl: string;
  clientId: string;
  loginPath?: string;
  refreshPath?: string;
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
