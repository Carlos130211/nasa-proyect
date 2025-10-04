"use client";

import { useState } from "react";

export const navItems = [
  { key: "join", label: "Inicio" },
  { key: "resources", label: "Recursos usados" },
  { key: "teams", label: "Integrantes" },
  { key: "details", label: "Demo" },
] as const;

export type NavbarTabKey = typeof navItems[number]["key"];

type Props = {
  active: NavbarTabKey;
  onTabChangeAction: (key: NavbarTabKey) => void;
};

export default function Navbar({ active, onTabChangeAction }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <span className="font-bold text-lg tracking-tight">
            🚀 NASA Space Apps 2025
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
              <li key={item.key}>
                <button
                  onClick={() => onTabChangeAction(item.key)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active === item.key
                      ? "bg-[#0B3D91] text-white shadow"
                      : "hover:bg-black/5"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {open && (
          <ul className="sm:hidden grid gap-2 pb-3">
            {navItems.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => {
                    onTabChangeAction(item.key);
                    setOpen(false);
                  }}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium ${
                    active === item.key ? "bg-[#0B3D91] text-white" : "hover:bg-black/5"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #0B3D91, #FC3D21)" }} />
    </header>
  );
}
