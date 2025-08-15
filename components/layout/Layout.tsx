"use client";

import Link from "next/link";

import { Bell, Search as SearchIcon } from "lucide-react";
import dynamic from "next/dynamic";
const ProfileMenu = dynamic(() => import("../ProfileMenu"), { ssr: false });
import { ReactNode } from "react";

// Accessible site layout with Header / Main / Footer
// - Includes skip link, keyboard focus styles, and global search
// - Header actions: search input, notifications icon, avatar placeholder
// - Uses CSS variables from globals.css tokens

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-4">
        {children}
      </main>

      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-border/60 bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/60"
      role="banner"
    >
      <div className="mx-auto flex min-h-14 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-3 sm:px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ring/50 rounded-md">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-sky-600 to-indigo-600" aria-hidden="true" />
          <span className="text-sm font-semibold tracking-tight">NVCCZ</span>
        </Link>

        {/* Global search */}
        <form
          role="search"
          aria-label="Global search"
          className="relative hidden min-w-0 flex-1 items-center md:flex"
          onSubmit={(e) => e.preventDefault()}
        >
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="search"
            name="q"
            placeholder="Search news, markets, people…"
            aria-label="Search"
            className="w-full rounded-md border border-input bg-background/60 py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </form>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background/60 text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            <Bell size={18} />
          </button>

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/70">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-2 px-3 py-6 text-xs text-muted-foreground sm:grid-cols-2 sm:px-4">
        <p>© {new Date().getFullYear()} NVCCZ. All rights reserved.</p>
        <nav className="flex justify-start gap-4 sm:justify-end" aria-label="Footer">
          <Link href="/" className="hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 rounded-sm px-1">
            Home
          </Link>
          <a href="#" className="hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 rounded-sm px-1">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 rounded-sm px-1">
            Terms
          </a>
        </nav>
      </div>
    </footer>
  );
}