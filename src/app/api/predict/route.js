import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

// 🔹 Calcular día del año
function calcularDOY(fecha) {
  const d = new Date(fecha);
  const inicio = new Date(d.getFullYear(), 0, 0);
  const diff = d - inicio + (inicio.getTimezoneOffset() - d.getTimezoneOffset()) * 60000;
  return Math.floor(diff / 86400000);
}

// 🔹 Normalizar texto (para comparar nombres)
function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .toUpperCase();
}

// 🔹 Buscar archivo CSV que coincida parcialmente con el nombre del departamento
function findFileForDepartment(dirPath, departamento) {
  const files = fs.readdirSync(dirPath);
  const target = normalizeText(departamento);

  // 1️⃣ Búsqueda exacta o que empiece igual
  let found = files.find(
    (f) =>
      normalizeText(f) === `${target}_LIMPIOCSV` ||
      normalizeText(f).startsWith(`${target}_`)
  );
  if (found) return path.join(dirPath, found);

  // 2️⃣ Búsqueda por coincidencia parcial (contiene el nombre)
  found = files.find((f) => normalizeText(f).includes(target));
  if (found) return path.join(dirPath, found);

  // 3️⃣ Búsqueda por palabras del nombre del departamento
  const parts = target.split("_").filter(Boolean);
  for (const part of parts) {
    found = files.find((f) => normalizeText(f).includes(part));
    if (found) return path.join(dirPath, found);
  }

  return null;
}

// 🔹 Endpoint principal
export async function POST(req) {
  try {
    const body = await req.json();
    const { departamento, lat, lon, fecha } = body;

    if (!departamento || !lat || !lon || !fecha) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos (departamento, lat, lon, fecha)." },
        { status: 400 }
      );
    }

    const dataDir = path.join(process.cwd(), "Data_Limpia_Final");

    // Buscar archivo del departamento (aunque tenga nombre extendido)
    const rutaCSV = findFileForDepartment(dataDir, departamento);

    if (!rutaCSV || !fs.existsSync(rutaCSV)) {
      return NextResponse.json(
        { error: `No se encontró el archivo CSV correspondiente a ${departamento}` },
        { status: 404 }
      );
    }

    // Leer el contenido del CSV
    const csvData = fs.readFileSync(rutaCSV, "utf8");

    // Parsear CSV
    const { data } = Papa.parse(csvData, { header: true, dynamicTyping: true });

    // Calcular DOY
    const doy = calcularDOY(fecha);

    // Buscar registro del DOY exacto
    const registros = data.filter((row) => row.DOY === doy);

    if (registros.length === 0) {
      return NextResponse.json(
        { error: `No se encontraron datos para el DOY ${doy} en ${departamento}` },
        { status: 404 }
      );
    }

    // Promediar las variables principales
    const promedio = (campo) =>
      registros.reduce((acc, r) => acc + (r[campo] || 0), 0) / registros.length;

    const resultado = {
      Departamento: departamento,
      Fecha: fecha,
      T2M_MAX: promedio("T2M_MAX"),
      T2M_MIN: promedio("T2M_MIN"),
      RH2M: promedio("RH2M"),
      WS10M: promedio("WS10M"),
      RADIACION_SOLAR: promedio("RADIACION_SOLAR"),
    };

    return NextResponse.json({ exito: true, resultado }, { status: 200 });
  } catch (error) {
    console.error("❌ Error en el endpoint /api/predict:", error);
    return NextResponse.json(
      { error: "Error interno del servidor.", detalle: error.message },
      { status: 500 }
    );
  }
}
