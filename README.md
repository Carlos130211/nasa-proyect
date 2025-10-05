NASA Space Apps Challenge 2025

¿Lloverá en mi evento?

Aplicación web que estima, con datos históricos de la NASA, la probabilidad de que en una ubicación y fecha determinadas se presenten condiciones muy calurosas, muy frías, muy ventosas, muy húmedas/lluviosas o muy incómodas.
Está diseñada para ayudar a planificar actividades al aire libre de forma más informada y confiable.

Stack

Next.js
 (App Router)

TypeScript

React

Tailwind CSS

(Opcional) Recharts / D3.js / ECharts para visualización

📂 Estructura del Proyecto
src/
└─ app/
   └─ components/
      └─ (public)/
         ├─ Navbar.tsx          # Barra de navegación (Inicio, Recursos usados, Integrantes, Demo)
         └─ Home/
            └─ index.tsx       # Página principal con secciones controladas por el Navbar
   └─ page.tsx                 # Punto de entrada que monta HomeIndex

Paleta de Colores

Azul NASA #0B3D91

Rojo NASA #FC3D21

Cielo #BBD5F0

Pizarra #0f172a

Secciones

Inicio: Resumen, objetivos y checklist rápido.

Recursos usados: Fuentes de datos NASA y stack de visualización.

Integrantes: Roles del equipo y estado del reto.

Demo: Flujo técnico sugerido y alcance.

🛠️ Instalación y Ejecución

Instala las dependencias:

npm install
# o
yarn
# o
pnpm install
# o
bun install


Ejecuta el servidor de desarrollo:

npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev


Visita http://localhost:3000
 en tu navegador para ver la app.

🧰 Scripts útiles
npm run dev        # Modo desarrollo
npm run build      # Compilación para producción
npm run start      # Ejecutar build en producción
npm run lint       # Linter

🌐 Integración de Datos

Definir fuentes (catálogos NASA: precipitación, temperatura, viento, etc.)

Aplicar subsetting (rango espacial y temporal)

Calcular probabilidades de excedencia de umbrales

Visualizar distribuciones y series temporales

Exportar resultados en CSV/JSON con metadatos

Puedes usar un .env.local para variables públicas:

NEXT_PUBLIC_API_BASE_URL=...
NEXT_PUBLIC_MAP_TOKEN=...

💻 Flujo de la Demo

El usuario selecciona ubicación y fecha

Se calcula la probabilidad de eventos climatológicos según históricos NASA

Se muestran indicadores visuales y se permite la descarga de datos

🌍 Deploy en Vercel

La forma más sencilla de desplegar es con Vercel
:

Conecta el repositorio

Configura variables de entorno si aplica

Haz deploy desde la rama main

Documentación oficial: Deploy Next.js

📝 Roadmap

 Selector de ubicación en mapa

 Integración con APIs reales de NASA

 Cálculo de probabilidades

 Visualizaciones dinámicas

 Exportación de datos con metadatos

 Optimización para producción y accesibilidad

👥 Créditos

Proyecto desarrollado para NASA Space Apps Challenge 2025.
Equipo multidisciplinario: Datos, Frontend, Backend, Ciencia de Datos y PM.