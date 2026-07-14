"use client";

import { VaultSessionStrip, type VaultSessionStripProps } from "./VaultSessionStrip";

export function IdentityView(props: VaultSessionStripProps = {}) {
  return <VaultSessionStrip {...props} />;
}

export { VaultSessionStrip, type VaultSessionStripProps } from "./VaultSessionStrip";
