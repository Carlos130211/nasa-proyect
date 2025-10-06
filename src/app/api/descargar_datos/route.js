import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function GET() {
  try {
    // Ruta absoluta del script de descarga
    const scriptPath = path.resolve("src/scripts/nasa_downloader.js");

    console.log("🚀 Ejecutando script:", scriptPath);

    // Ejecutar script de Node que descarga los datos
    await new Promise((resolve, reject) => {
      exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error("❌ Error en descarga:", stderr);
          reject(error);
        } else {
          console.log(stdout);
          resolve();
        }
      });
    });

    return NextResponse.json({ message: "✅ Descarga completada correctamente." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
