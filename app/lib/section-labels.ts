// lib/section-labels.ts

export const sectionLabels: Record<string, string> = {
  "Install Theme": "Getting Started",
  "Logo and Favicon": "Theme Settings",
  "Announcment Bar": "Header & Footer",
};  

export function getSectionLabel(name?: string) {
  return name ? sectionLabels[name] ?? name : "";
}