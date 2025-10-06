import { NextResponse } from "next/server";
import path from "path";
import { exec } from "child_process";

// ✅ Ejecuta directamente los scripts del backend
const RUTA_DESCARGAR = path.resolve("src/scripts/nasa_downloader.js");
const RUTA_LIMPIAR = path.resolve("src/scripts/limpiar_data_final.js");

export async function GET() {
  console.log("🚀 Ejecutando proceso combinado: descargar + limpiar");

  try {
    await new Promise((resolve, reject) => {
      exec(`node "${RUTA_DESCARGAR}"`, (error, stdout, stderr) => {
        if (error) return reject(stderr || error.message);
        console.log(stdout);
        resolve();
      });
    });

    await new Promise((resolve, reject) => {
      exec(`node "${RUTA_LIMPIAR}"`, (error, stdout, stderr) => {
        if (error) return reject(stderr || error.message);
        console.log(stdout);
        resolve();
      });
    });

    return NextResponse.json({
      ok: true,
      mensaje: "Datos descargados y limpiados correctamente 🚀",
    });
  } catch (error) {
    console.error("❌ Error en procesamiento:", error);
    return NextResponse.json({ ok: false, error: error.toString() }, { status: 500 });
  }
}
