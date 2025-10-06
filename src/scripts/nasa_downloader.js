// 🔹 nasa_downloader.js
// Descarga datos diarios de NASA POWER API para distintos departamentos del Perú

import fs from "fs";
import path from "path";
import fetch from "node-fetch";

// ===============================
// 🔧 CONFIGURACIÓN GENERAL
// ===============================
const OUTPUT_DIR = "NASA_Data_Peru_Final_Exito";
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Parámetros de la API POWER
const BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point";
const PARAMETERS = "T2M_MAX,T2M_MIN,PRECTOT,RH2M,WS10M,ALLSKY_SFC_SW_DWN";
const COMMUNITY = "AG"; // Agricultura
const START_DATE = "20231001";
const END_DATE = "20241001";

// ===============================
// 📍 COORDENADAS DEPARTAMENTALES
// ===============================
const DEPARTMENTS = {
  Amazonas_Chachapoyas: { lat: -6.2200, lon: -77.8680 },
  Ancash_Huaraz: { lat: -9.5290, lon: -77.5278 },
  Apurimac_Abancay: { lat: -13.6339, lon: -72.8814 },
  Arequipa_Arequipa: { lat: -16.3989, lon: -71.5350 },
  Ayacucho_Ayacucho: { lat: -13.1588, lon: -74.2232 },
  Cajamarca_Cajamarca: { lat: -7.1617, lon: -78.5128 },
  Cusco_Cusco: { lat: -13.5320, lon: -71.9675 },
  Huancavelica_Huancavelica: { lat: -12.7850, lon: -74.9720 },
  Huanuco_Huanuco: { lat: -9.9290, lon: -76.2390 },
  Ica_Ica: { lat: -14.0678, lon: -75.7286 },
  Junin_Huancayo: { lat: -12.0650, lon: -75.2049 },
  LaLibertad_Trujillo: { lat: -8.1091, lon: -79.0215 },
  Lambayeque_Chiclayo: { lat: -6.7735, lon: -79.8416 },
  Lima_Lima: { lat: -12.0464, lon: -77.0428 },
  Loreto_Iquitos: { lat: -3.7491, lon: -73.2538 },
  MadreDeDios_PuertoMaldonado: { lat: -12.5933, lon: -69.1893 },
  Moquegua_Moquegua: { lat: -17.1950, lon: -70.9350 },
  Pasco_CerroDePasco: { lat: -10.6820, lon: -76.2560 },
  Piura_Piura: { lat: -5.1945, lon: -80.6328 },
  Puno_Puno: { lat: -15.8402, lon: -70.0219 },
  SanMartin_Moyobamba: { lat: -6.0340, lon: -76.9710 },
  Tacna_Tacna: { lat: -18.0066, lon: -70.2463 },
  Tumbes_Tumbes: { lat: -3.5700, lon: -80.4580 },
  Ucayali_Pucallpa: { lat: -8.3791, lon: -74.5539 },
};

// ===============================
// 🚀 FUNCIÓN PARA DESCARGAR UNO
// ===============================
async function descargarUno(nombre, coords) {
  const { lat, lon } = coords;

  // Construir URL con parámetros
  const url =
    `${BASE_URL}?parameters=${encodeURIComponent(PARAMETERS)}` +
    `&community=${encodeURIComponent(COMMUNITY)}` +
    `&longitude=${lon.toFixed(4)}` +
    `&latitude=${lat.toFixed(4)}` +
    `&start=${START_DATE}` +
    `&end=${END_DATE}` +
    `&format=CSV`;

  console.log(`🌎 Descargando datos de ${nombre}...`);
  console.log(`🔗 URL: ${url}`);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const csv = await res.text();
    const filename = `${nombre}_${START_DATE}_to_${END_DATE}.csv`;
    const filePath = path.join(OUTPUT_DIR, filename);

    fs.writeFileSync(filePath, csv, "utf-8");
    console.log(`✅ Guardado: ${filename}`);
  } catch (error) {
    console.error(`❌ Error al descargar ${nombre}:`, error.message);
  }
}

// ===============================
// 📥 FUNCIÓN PRINCIPAL
// ===============================
async function descargarTodos() {
  console.log("🚀 Iniciando descarga de datos NASA POWER...");
  const entries = Object.entries(DEPARTMENTS);

  for (const [nombre, coords] of entries) {
    await descargarUno(nombre, coords);
    await new Promise((r) => setTimeout(r, 800)); // pequeña pausa
  }

  console.log("🎉 Descarga completa. Archivos guardados en:", OUTPUT_DIR);
}

// Ejecutar el proceso
await descargarTodos();
