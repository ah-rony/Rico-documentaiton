// lib/section-labels.ts

export const sectionLabels: Record<string, string> = {
  "Install Theme": "Getting Started",
  "Logo and Favicon": "Theme Settings",
  "Announcement Bar": "Header & Footer",
  "Featured Collection": "Sections",
  "Collection Page":"Pages",
  "Product Page":"Product & Metafields"
};  

export function getSectionLabel(name?: string) {
  return name ? sectionLabels[name] ?? name : "";
}