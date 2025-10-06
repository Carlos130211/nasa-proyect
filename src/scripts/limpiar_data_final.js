import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { parse } from "fast-csv";

const INPUT_DIR = "NASA_Data_Peru_Final_Exito";
const OUTPUT_DIR = "Data_Limpia_Final";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
  console.log("📁 Carpeta creada:", OUTPUT_DIR);
}

const FINAL_ORDER = [
  "Departamento", "Latitud", "Longitud",
  "YEAR", "DOY",
  "T2M_MAX", "T2M_MIN", "PRECIPITACION_MM",
  "RH2M", "WS10M", "RADIACION_SOLAR"
];

const allData = [];

async function limpiarArchivos() {
  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith(".csv"));
  if (files.length === 0) {
    console.error("❌ No hay archivos CSV en", INPUT_DIR);
    return;
  }

  console.log(`✅ Se encontraron ${files.length} archivos para limpiar.`);

  for (const file of files) {
    try {
      const filePath = path.join(INPUT_DIR, file);
      const data = fs.readFileSync(filePath, "utf8").split("\n");
      let dataStart = -1, lat = "N/A", lon = "N/A";

      const depName = file.split("_2023")[0].replace(/_/g, " ");

      for (let line of data) {
        if (line.includes("Location: latitude")) {
          const parts = line.trim().split(/\s+/);
          lat = parts[2];
          lon = parts[4];
        }
        if (line.startsWith("YEAR,DOY")) {
          dataStart = data.indexOf(line);
          break;
        }
      }

      if (dataStart === -1) {
        console.warn("⚠️ No se encontró encabezado en", file);
        continue;
      }

      const csvText = data.slice(dataStart).join("\n");
      const rows = [];

      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", row => rows.push(row))
          .on("end", resolve)
          .on("error", reject);
      });

      const df = rows.map(r => ({
        Departamento: depName,
        Latitud: lat,
        Longitud: lon,
        YEAR: r.YEAR,
        DOY: r.DOY,
        T2M_MAX: r.T2M_MAX,
        T2M_MIN: r.T2M_MIN,
        PRECIPITACION_MM: r.PRECTOT,
        RH2M: r.RH2M,
        WS10M: r.WS10M,
        RADIACION_SOLAR: r.ALLSKY_SFC_SW_DWN
      }));

      const outPath = path.join(OUTPUT_DIR, `${depName.replace(/ /g, "_")}_LIMPIO.csv`);
      const ws = fs.createWriteStream(outPath);
      parse.writeToStream(ws, df, { headers: true });
      allData.push(...df);

      console.log(`🧹 Limpieza completada: ${file}`);
    } catch (e) {
      console.error("Error limpiando", file, e.message);
    }
  }

  // Consolidado final
  const consolidado = path.join(OUTPUT_DIR, "Data_Climatica_PERU_CONSOLIDADO.csv");
  const ws = fs.createWriteStream(consolidado);
  parse.writeToStream(ws, allData, { headers: true });
  console.log("🎉 Consolidado generado:", consolidado);
}

await limpiarArchivos();
