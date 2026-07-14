/**
 * Viewport presets — mirror of E:\MyAgent\workflow\devices\PRIMARY.json
 * Do not web-search or invent sizes.
 */
export const devices = {
  "realme-p2-pro": {
    id: "realme-p2-pro",
    label: "Realme P2 Pro (primary)",
    viewport: { width: 360, height: 780 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
  "tablet-pad2-approx": {
    id: "tablet-pad2-approx",
    label: "Tablet Pad2 approx",
    viewport: { width: 800, height: 1280 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  "desktop-1280": {
    id: "desktop-1280",
    label: "Desktop 1280",
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
} as const;

export type DeviceId = keyof typeof devices;
