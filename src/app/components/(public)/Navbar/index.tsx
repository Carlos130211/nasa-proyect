"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/recursos", label: "Recursos usados" },
  { href: "/integrantes", label: "Integrantes" },
  { href: "/demo", label: "Demo" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <span className="font-bold flex items-center space-x-2 text-lg tracking-tight">
            <img src="/Icon2.png" className="h-10 w-10 rounded-lg"/> <span className="text-xl font-bold">URA DATA</span>
          </span>

          <button
            className="sm:hidden inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
          >
            Menú
          </button>

          <ul className="hidden sm:flex items-center gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive(item.href)
                      ? "bg-[#0B3D91] text-white shadow"
                      : "hover:bg-black/5"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {open && (
          <ul className="sm:hidden grid gap-2 pb-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block w-full rounded-md px-3 py-2 text-left text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-[#0B3D91] text-white"
                      : "hover:bg-black/5"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(90deg, #0B3D91, #FC3D21)" }}
      />
    </header>
  );
}
