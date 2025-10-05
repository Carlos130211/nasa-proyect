"use client";

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
    "Presentamos una app que, con datos históricos de la NASA, estima la probabilidad de enfrentar condiciones climáticas ‘extremas’ en una ubicación y fecha dadas. Es una herramienta para planificar actividades al aire libre con contexto climatológico, no un pronóstico.",
};

export default function HomeIndex() {
  return (
    <div className="w-full text-slate-900">
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Hero />

        {/* Tarjetas meta (arranque rápido de la presentación) */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <InfoCard title="Evento" value={meta.proyecto} subtitle={meta.reto} />
          <InfoCard title="Dificultad" value={meta.dificultad} />
          <InfoCard title="Temas" value={meta.temas.join(" • ")} subtitle="Habilidades clave del reto" />
        </div>

        {/* Presentación del proyecto */}
        <div className="mt-10 grid gap-6">
          <Section title="1) Propósito">
            <p>
              Ayudar a personas y equipos a decidir <strong>cuándo y dónde</strong> realizar sus actividades al aire libre
              (eventos, ferias, deportes, logística) con una <strong>señal basada en historia climática</strong>: qué tan
              probable es que el día elegido sea inusualmente <em>caluroso, frío, ventoso o húmedo/lluvioso</em>.
            </p>
          </Section>

          <Section title="2) ¿Qué construiremos? (visión del producto)">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Selector</strong> de ubicación y fecha (día del año).</li>
              <li><strong>Indicadores</strong> de probabilidad de exceder umbrales (calor, frío, viento, humedad/lluvia).</li>
              <li><strong>Visualizaciones</strong> simples: distribución histórica y señal de “riesgo relativo”.</li>
              <li><strong>Exportación</strong> de resultados (CSV/JSON) con unidades y metadatos.</li>
            </ul>
          </Section>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="3) ¿Cómo funciona? (en palabras simples)">
              <ol className="list-decimal pl-5 space-y-1">
                <li>Tomamos <strong>históricos climáticos</strong> de la zona elegida.</li>
                <li>Extraemos la <strong>distribución</strong> de cada variable (p.ej., temperatura máxima diaria).</li>
                <li>Definimos <strong>umbrales</strong> “extremos” (p. ej., percentil 85 para calor).</li>
                <li>Calculamos la <strong>probabilidad de excedencia</strong> para el día elegido.</li>
                <li>Lo mostramos con <strong>gráficos e indicadores</strong> y permitimos <strong>descargar</strong> los datos.</li>
              </ol>
            </Section>

            <Section title="4) Demo en 3 minutos (flujo)">
              <ol className="list-decimal pl-5 space-y-1">
                <li>Elegimos <strong>Ciudad</strong> y <strong>Fecha</strong>.</li>
                <li>La app devuelve <strong>probabilidades</strong> (calor, frío, viento, humedad/lluvia).</li>
                <li>Vemos <strong>gráficos</strong> de contexto (histograma/boxplot/serie).</li>
                <li>Descargamos <strong>CSV/JSON</strong> con resultados y metadatos.</li>
              </ol>
            </Section>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="5) Arquitectura (MVP)">
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Frontend:</strong> Next.js + Tailwind (UI responsiva, accesible).</li>
                <li><strong>Capa de datos:</strong> servicios de <em>subsetting</em> para traer solo lo necesario.</li>
                <li><strong>Lógica:</strong> cálculo de percentiles/umbrales y prob. de excedencia en el servidor o edge.</li>
                <li><strong>Export:</strong> generador de CSV/JSON con unidades, fuente y período.</li>
              </ul>
            </Section>

            <Section title="6) Entregables del MVP">
              <ul className="list-disc pl-5 space-y-1">
                <li>Interfaz de selección (ubicación + fecha) y variables.</li>
                <li>Indicadores de “riesgo” por variable y umbral.</li>
                <li>Gráficos básicos (distribución + serie anual)</li>
                <li>Descarga CSV/JSON con metadatos.</li>
              </ul>
            </Section>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="7) Alcance y límites (transparencia)">
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>No es pronóstico</strong>; usamos historia climática para <em>contexto</em>.</li>
                <li>Umbrales y percentiles serán <strong>configurables</strong> y <strong>documentados</strong>.</li>
                <li>Primera versión enfocada en <strong>pocas variables útiles</strong> para evitar ruido.</li>
              </ul>
            </Section>

            <Section title="8) Próximos pasos">
              <ul className="list-disc pl-5 space-y-1">
                <li>Integrar primera fuente histórica y definir <strong>umbrales</strong> por variable.</li>
                <li>Validar con <strong>casos de uso reales</strong> (eventos, deporte, turismo).</li>
                <li>Pulir <strong>UX</strong> y enriquecer <strong>visualizaciones</strong>.</li>
              </ul>
            </Section>
          </div>
        </div>
      </main>

      <footer className="border-t border-black/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-slate-600 flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} NASA Space Apps (demo)</span>
          <span className="underline underline-offset-4 hover:no-underline">Educa Coders</span>
        </div>
      </footer>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            ¿Lloverá en mi evento?
          </h1>
          <p className="mt-3 text-slate-700">
            {copy.resumen}
          </p>
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
