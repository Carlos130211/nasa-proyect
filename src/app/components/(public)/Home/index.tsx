"use client";

import { useMemo, useState } from "react";
import Navbar, { type NavbarTabKey } from "../Navbar";

const meta = {
  proyecto: "NASA Space Apps Challenge 2025",
  reto: "¿Lloverá en mi evento? (Will It Rain On My Parade?)",
  dificultad: "Intermedio",
  temas: [
    "Programación",
    "Análisis de Datos",
    "Visualización",
    "Pronósticos",
    "Software",
    "Clima",
    "Desarrollo Web",
  ],
};

const copy = {
  resumen:
    "Construye una app con interfaz personalizada que use datos históricos de NASA para estimar la probabilidad de condiciones muy calurosas, muy frías, muy ventosas, muy húmedas/lluviosas o muy incómodas para un lugar y fecha específicos.",
  contexto:
    "Las probabilidades se basan en datos históricos (no pronóstico) para planificar actividades al aire libre. NASA dispone de décadas de datos globales (lluvia, viento, polvo, temperatura, nieve, nubosidad) y modelos que caracterizan condiciones típicas y extremos.",
  objetivos:
    "Dashboard para elegir ubicación y día del año; seleccionar variables (temperatura, precipitación, viento, etc.); mostrar medias/umbrales y probabilidad de superar límites; visualizaciones y export.",
  consideraciones: [
    "Exportar CSV/JSON con metadatos (unidades y fuentes).",
    "Evitar duplicar métricas similares; priorizar variables útiles.",
    "Visualizaciones: distribuciones, series de tiempo, promedios por área.",
    "Usar servicios existentes para subsetting de datos.",
  ],
};

export default function HomeIndex() {
  const [active, setActive] = useState<NavbarTabKey>("join");

  const onTabChangeAction = (key: NavbarTabKey) => {
    setActive(key);
    if (typeof window !== "undefined") {
      const main = document.getElementById("page-main");
      if (main) main.scrollTo({ top: 0, behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const section = useMemo(() => {
    switch (active) {
      case "join":
        return <InicioSection />;
      case "resources":
        return <RecursosUsadosSection />;
      case "teams":
        return <IntegrantesSection />;
      case "details":
        return <DemoSection />;
      default:
        return null;
    }
  }, [active]);

  return (
    <div className="w-full text-slate-900">
      <Navbar active={active} onTabChangeAction={onTabChangeAction} />
      <main id="page-main" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Hero onTabChange={onTabChangeAction} />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <InfoCard title="Evento" value={meta.proyecto} subtitle={meta.reto} />
          <InfoCard title="Dificultad" value={meta.dificultad} />
          <InfoCard title="Temas" value={meta.temas.join(" • ")} subtitle="Habilidades clave del reto" />
        </div>
        <div className="mt-10">{section}</div>
      </main>
      <footer className="border-t border-black/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-slate-600 flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} NASA Space Apps (demo)</span>
          <a href="#" className="underline underline-offset-4 hover:no-underline">Código de conducta</a>
        </div>
      </footer>
    </div>
  );
}

function Hero({ onTabChange }: { onTabChange: (k: NavbarTabKey) => void }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">¿Lloverá en mi evento?</h1>
          <p className="mt-3 text-slate-700">{copy.resumen}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => onTabChange("join")} className="rounded-full bg-[#0B3D91] px-5 py-2.5 text-white text-sm font-medium hover:bg-[#0A3a85]">Inicio</button>
            <button onClick={() => onTabChange("resources")} className="rounded-full border border-[#0B3D91]/30 px-5 py-2.5 text-sm font-medium hover:bg-[#0B3D91]/5">Recursos usados</button>
            <button onClick={() => onTabChange("teams")} className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-medium hover:bg-black/5">Integrantes</button>
            <button onClick={() => onTabChange("details")} className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-medium hover:bg-black/5">Demo</button>
          </div>
        </div>
        <div aria-hidden className="w-full lg:h-48 h-40 rounded-xl">
          <div
            className="h-full w-full rounded-xl"
            style={{
              background:
                "radial-gradient(120% 100% at 0% 0%, #BBD5F0 0%, transparent 60%), radial-gradient(120% 100% at 100% 0%, #0B3D91 0%, transparent 60%), radial-gradient(140% 120% at 50% 120%, #FC3D21 0%, transparent 60%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

function InfoCard({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">{title}</div>
      <div className="mt-1 text-base font-semibold">{value}</div>
      {subtitle && <div className="mt-1 text-sm text-slate-600">{subtitle}</div>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-6 sm:p-7">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      <div className="mt-3 text-slate-700 leading-relaxed">{children}</div>
    </section>
  );
}

function InicioSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Section title="Resumen">
        <p>{copy.resumen}</p>
      </Section>
      <Section title="Objetivos">
        <ul className="list-disc pl-5 space-y-1">
          <li>Dashboard por ubicación y fecha.</li>
          <li>Variables (temperatura, precipitación, viento, etc.).</li>
          <li>Umbrales y probabilidades.</li>
          <li>Gráficos/mapas y descarga de datos.</li>
        </ul>
      </Section>
      <Section title="Checklist rápido">
        <ul className="list-disc pl-5 space-y-1">
          <li>Definir fuentes de datos NASA.</li>
          <li>Elegir variables y umbrales clave.</li>
          <li>Diseñar UI/UX mínima viable.</li>
          <li>Implementar export CSV/JSON.</li>
        </ul>
      </Section>
    </div>
  );
}

function RecursosUsadosSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Section title="Fuentes de datos">
        <ul className="list-disc pl-5 space-y-1">
          <li>Observación de la Tierra (precipitación, viento, temperatura, etc.).</li>
          <li>Modelos y climatologías de NASA para extremos y promedios.</li>
          <li>Servicios de subsetting para recortes espaciales/temporales.</li>
        </ul>
      </Section>
      <Section title="Stack de visualización">
        <ul className="list-disc pl-5 space-y-1">
          <li>Gráficos de distribución y series de tiempo.</li>
          <li>Promedios por área e indicadores de umbral.</li>
          <li>Exportación CSV/JSON con metadatos.</li>
        </ul>
      </Section>
    </div>
  );
}

function IntegrantesSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Section title="Equipo">
        <ul className="list-disc pl-5 space-y-1">
          <li>Datos</li>
          <li>Frontend</li>
          <li>Backend</li>
          <li>Ciencia de Datos</li>
          <li>PM</li>
        </ul>
      </Section>
      <Section title="Estado del reto">
        <ul className="list-disc pl-5 space-y-1">
          <li>Ideación</li>
          <li>Prototipo de UI</li>
          <li>Ingesta de datos NASA</li>
          <li>Visualizaciones y export</li>
        </ul>
      </Section>
    </div>
  );
}

function DemoSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Section title="Objetivo de la demo">
        <p>
          Mostrar el flujo principal: selección de ubicación/fecha → cálculo de probabilidades → visualización de indicadores y descarga de datos.
        </p>
      </Section>
      <Section title="Alcance técnico sugerido">
        <ul className="list-disc pl-5 space-y-1">
          <li>Selector de ubicación: pin en mapa, texto o polígono.</li>
          <li>Visual: distribución de probabilidades y serie temporal.</li>
          <li>Export: CSV/JSON con unidades y metadatos.</li>
          <li>Accesible y responsivo (mobile-first).</li>
        </ul>
      </Section>
    </div>
  );
}
