import { useState } from "react";
import { Link, useLocation } from "react-router";
import { getDocumentationTitle, getSidebarNavigationSections } from "../../lib/docs";
import { Close } from "./elements/Elements";
import { getSectionLabel } from "../../lib/section-labels";

const navigationSections = getSidebarNavigationSections();
const siteTitle = getDocumentationTitle();
const noDropdownSections = new Set([""]);

const sectionLabels: Record<string, string> = {
  "Install Theme": "Installation",
  "Logo and Favicon": "Theme Settings",
  "About Rico": "Geetting Started",
};

function NavigationLink({ href, label, isActive, onClick }: {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={href}
      discover="render"
      prefetch="intent"
      onClick={onClick}
      className={`block rounded-2xl px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
          : "text-stone-600 hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

function NavigationSection({ name, items, currentPath, onLinkClick, isOpen, onToggle }: {
  name: string;
  items: Array<{ name: string; href: string }>;
  currentPath: string;
  onLinkClick?: () => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const isSingleLinkSection = items.length === 1 && items[0] && items[0].name === name;
  const isDropdown = !noDropdownSections.has(name);

  if (isSingleLinkSection) {
    return (
      <NavigationLink
        href={items[0].href}
        label={name}
        isActive={currentPath === items[0].href}
        onClick={onLinkClick}
      />
    );
  }

  return (
    <section>
      <button
        type="button"
        onClick={() => isDropdown && onToggle()}
        className={`flex w-full items-center justify-between px-1 mb-1 group rounded-lg py-1 transition-colors ${
          isDropdown ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <span className={`text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
          isOpen && isDropdown
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-stone-500 dark:text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200"
        }`}>
          {/* {sectionLabels[name] ?? name} */}
          {getSectionLabel(name)}
        </span>
        {isDropdown && (
          <svg
            style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
            className={`w-3 h-3 flex-shrink-0 ${isOpen ? "text-emerald-500" : "text-stone-400"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          > 
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        !isDropdown || isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="space-y-1 mt-1">
          {items.map((item, index) => (
            <div
              key={item.href}
              className={`transition-all duration-300 ease-in-out ${
                !isDropdown || isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: isOpen ? `${index * 50}ms` : "0ms" }}
            >
              <NavigationLink
                href={item.href}
                label={item.name}
                isActive={currentPath === item.href}
                onClick={onLinkClick}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SideBar({ isMobileOpen, onMobileClose }: {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const { pathname } = useLocation();

  const defaultOpen = navigationSections.find((s) =>
    s.items.some((item) => item.href === pathname)
  )?.name ?? null;

  const [openSection, setOpenSection] = useState<string | null>(defaultOpen);

  const handleToggle = (name: string) => {
    setOpenSection((prev) => (prev === name ? null : name));
  };

  const renderSections = (onLinkClick?: () => void) =>
    navigationSections.map((section) => (
      <NavigationSection
        key={section.name}
        name={section.name}
        items={section.items}
        currentPath={pathname}
        onLinkClick={onLinkClick}
        isOpen={openSection === section.name || noDropdownSections.has(section.name)}
        onToggle={() => handleToggle(section.name)}
      />
    ));

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-stone-950/45 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          isMobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-[min(22rem,calc(100vw-2rem))] border-r border-stone-200/80 bg-white/95 p-4 shadow-2xl shadow-stone-900/20 backdrop-blur-xl transition-transform duration-300 dark:border-stone-800 dark:bg-stone-950/95 dark:shadow-black/40 lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isMobileOpen}
      >
        <div className="flex h-full flex-col">
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-stone-200/80 pb-4 dark:border-stone-800">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
                {siteTitle}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                Navigation
              </p>
            </div>
            <button
              type="button"
              onClick={onMobileClose}
              className="rounded-full p-2 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:text-white"
              aria-label="Close sidebar"
            >
              <Close />
            </button>
          </div>
          <nav className="flex-1 space-y-6 overflow-y-auto pr-1">
            {renderSections(onMobileClose)}
          </nav>
        </div>
      </aside>

      <aside className="hidden lg:block lg:pr-2 sticky top-28">
        <div className="lg:sticky lg:top-28">
          <div className="rounded-3xl border border-stone-200/80 bg-white/80 p-5 shadow-sm shadow-stone-200/40 backdrop-blur-sm dark:border-stone-800 dark:bg-stone-900/80 dark:shadow-black/20 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <nav className="space-y-6">
              {renderSections()}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}