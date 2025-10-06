// 📄 src/app/api/procesar_datos/route.js
import { NextResponse } from "next/server";
import { descargarDatos } from "../descargar_datos/descargar_datos";
import { limpiarDatos } from "../limpiar_datos/limpiar_datos";

export async function GET() {
  try {
    console.log("🔹 Iniciando descarga de datos...");
    const resultadoDescarga = await descargarDatos(); // función importada

    console.log("🔹 Limpiando datos...");
    const resultadoLimpieza = await limpiarDatos(); // función importada

    return NextResponse.json({
      message: "✅ Datos descargados y limpiados correctamente.",
      descarga: resultadoDescarga,
      limpieza: resultadoLimpieza,
    });
  } catch (error) {
    console.error("❌ Error al procesar datos:", error);
    return NextResponse.json(
      { error: "Error al procesar datos: " + error.message },
      { status: 500 }
    );
  }
}
