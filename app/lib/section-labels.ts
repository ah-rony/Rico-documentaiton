// lib/section-labels.ts

export const sectionLabels: Record<string, string> = {
  "Install Theme": "Installation",
  "Logo and Favicon": "Theme Settings",
  "About Rico": "Getting Started",
};

export function getSectionLabel(name?: string) {
  return name ? sectionLabels[name] ?? name : "";
}