"use client";

type Resource = {
  name: string;
  url: string;
  note?: string;
};

const dataSources: Resource[] = [
  { name: "NASA GPM (Precipitación)", url: "https://gpm.nasa.gov/", note: "Lluvia histórica" },
  { name: "MERRA-2 (Reanálisis)", url: "https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/", note: "Viento/temperatura" },
  { name: "POWER (Climatología)", url: "https://power.larc.nasa.gov/", note: "Series para energía/meteorología" },
];

const techStack: Resource[] = [
  { name: "Next.js (App Router)", url: "https://nextjs.org/", note: "Framework React para SSR/ISR" },
  { name: "Tailwind CSS", url: "https://tailwindcss.com/", note: "Estilos utilitarios" },
  { name: "Leaflet", url: "https://leafletjs.com/", note: "Mapa interactivo" },
  { name: "React Leaflet", url: "https://react-leaflet.js.org/", note: "Bindings de Leaflet para React" },
];


export default function Recursos() {
  return (
    <div className="w-full text-slate-900">
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
          Recursos usados
        </h1>

        <section className="mt-8">
          <h2 className="text-lg font-bold tracking-tight">Fuentes de datos</h2>
          <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {dataSources.map((r) => (
              <ResourceCard key={r.url} {...r} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold tracking-tight">Tecnologías utilizadas</h2>
          <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {techStack.map((r) => (
              <ResourceCard key={r.url} {...r} />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

function ResourceCard({ name, url, note }: Resource) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{name}</h3>
          {note && <p className="mt-1 text-sm text-slate-600 line-clamp-2">{note}</p>}
          <p className="mt-2 text-xs text-slate-500 truncate">{url}</p>
        </div>
        <ExternalIcon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400 transition group-hover:text-slate-700" />
      </div>
    </a>
  );
}

function ExternalIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M14 3h7v7h-2V6.41l-9.3 9.3-1.4-1.42 9.3-9.3H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z" />
    </svg>
  );
}
