import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function GET() {
  try {
    const scriptPath = path.resolve("src/scripts/limpiar_data_final.js");

    console.log("🧹 Ejecutando limpieza:", scriptPath);

    await new Promise((resolve, reject) => {
      exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error("❌ Error en limpieza:", stderr);
          reject(error);
        } else {
          console.log(stdout);
          resolve();
        }
      });
    });

    return NextResponse.json({ message: "✅ Limpieza completada correctamente." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
