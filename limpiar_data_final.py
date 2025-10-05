# --- limpiar_data_final.py (CORREGIDO PARA EVITAR OS.BASENAME ERROR) ---
import pandas as pd
import os
import glob
import re
from io import StringIO

# --- 1. CONFIGURACIÓN DE RUTAS Y ARCHIVOS ---
INPUT_DIR = "NASA_Data_Peru_Final_Exito" 
OUTPUT_DIR = "Data_Limpia_Final"
os.makedirs(OUTPUT_DIR, exist_ok=True)
print(f"Directorio de entrada: {os.path.abspath(INPUT_DIR)}")
print(f"Directorio de salida: {os.path.abspath(OUTPUT_DIR)}")

# La NASA ahora enviará: YEAR, DOY, T2M_MAX, T2M_MIN, PRECTOT, RH2M, WS10M, ALLSKY_SFC_SW_DWN
DATA_COLUMNS = ['YEAR', 'DOY', 'T2M_MAX', 'T2M_MIN', 'PRECTOT', 'RH2M', 'WS10M', 'ALLSKY_SFC_SW_DWN']

# Este es el orden final deseado, incluyendo las columnas de contexto
FINAL_ORDER = [
    'Departamento', 'Latitud', 'Longitud', 
    'YEAR', 'DOY', 
    'T2M_MAX', 'T2M_MIN', 'PRECIPITACION_MM', 'RH2M', 'WS10M', 'RADIACION_SOLAR'
]

all_dataframes = []

# --- 2. FUNCIÓN PRINCIPAL DE PROCESAMIENTO ---

def process_nasa_files():
    """Lee, limpia, extrae metadatos y consolida todos los archivos CSV de la NASA."""
    
    file_paths = glob.glob(os.path.join(INPUT_DIR, "*.csv"))
    
    if not file_paths:
        print("\n❌ ERROR: No se encontraron archivos CSV en la carpeta:", os.path.abspath(INPUT_DIR))
        return

    print(f"\n✅ Encontrados {len(file_paths)} archivos CSV para procesar.")

    for i, file_path in enumerate(file_paths):
        # 🛑 CORRECCIÓN: os.path.basename() es lo correcto 🛑
        file_name = os.path.basename(file_path)
        print(f"\n[{i+1}/{len(file_paths)}] Limpiando archivo: {file_name}")

        try:
            # 2.1 Lectura y búsqueda de metadatos/inicio de datos
            with open(file_path, 'r') as f:
                lines = f.readlines()

            data_start_line_index = -1
            latitude = "N/A"
            longitude = "N/A"
            
            # El nombre del archivo ahora incluye las fechas, hay que ajustarlo:
            # Quitamos todo desde el primer guion bajo de la fecha (_2023...)
            department_name = file_name.split('_2023')[0].replace('_', ' ')
            
            for j, line in enumerate(lines):
                if 'Location: latitude' in line:
                    parts = line.split()
                    latitude = parts[2]
                    longitude = parts[4]
                
                # La línea de encabezado de datos ahora comienza con YEAR,DOY...
                if line.startswith("YEAR,DOY"): 
                    data_start_line_index = j
                    break

            if data_start_line_index == -1:
                print("!!! ADVERTENCIA: No se encontró la línea de inicio de datos (YEAR,DOY). Saltando.")
                continue

            # 2.2 Pre-procesamiento de texto (Transformar a CSV estándar)
            data_text = lines[data_start_line_index:]
            
            cleaned_lines = []
            for line in data_text:
                line = line.strip()
                if line and not line.startswith(("-END HEADER-")): 
                    if not line.startswith("YEAR,DOY"):
                        # Reemplazamos los separadores de la NASA (espacios) por comas.
                        line = re.sub(r' +', ',', line) 
                    cleaned_lines.append(line)

            final_data_string = "\n".join(cleaned_lines)
            
            # 2.3 Leer la data limpia con Pandas
            df = pd.read_csv(
                StringIO(final_data_string), 
                sep=',',                  
                header=0,                 
                index_col=False
            )
            
            # 2.4 Limpieza y Conversión Final
            
            # Renombrado de columnas 
            df = df.rename(columns={
                'PRECTOT': 'PRECIPITACION_MM',
                'ALLSKY_SFC_SW_DWN': 'RADIACION_SOLAR'
            })
            
            # Convertimos a numérico y tratamos valores perdidos
            numeric_cols = [c for c in ['YEAR', 'DOY', 'T2M_MAX', 'T2M_MIN', 'PRECIPITACION_MM', 'RH2M', 'WS10M', 'RADIACION_SOLAR'] if c in df.columns]
            for col in numeric_cols:
                 df[col] = df[col].replace(-999.0, pd.NA)
                 df[col] = pd.to_numeric(df[col], errors='coerce')

            # 2.5 Añadir columnas de contexto final
            df.insert(0, 'Departamento', department_name)
            df.insert(1, 'Latitud', latitude)
            df.insert(2, 'Longitud', longitude)
            
            # 2.6 Guardar el archivo limpio individual
            clean_file_name = f"{department_name.replace(' ', '_')}_LIMPIO.csv"
            clean_file_path = os.path.join(OUTPUT_DIR, clean_file_name)
            
            # Aseguramos el ORDEN FINAL 
            df = df[[c for c in FINAL_ORDER if c in df.columns]]
            
            df.to_csv(clean_file_path, index=False)
            print(f" -> Archivo limpio individual generado con {len(df.columns)} columnas.")

            # 2.7 Agregar a la lista para el archivo consolidado
            all_dataframes.append(df)

        except Exception as e:
            print(f"!!! ERROR al procesar {file_name}: {e}")
            continue

    # --- 3. Consolidación Final ---
    if all_dataframes:
        print("\n--- Consolidando todos los datos ---")
        df_consolidado = pd.concat(all_dataframes, ignore_index=True)
        consolidated_path = os.path.join(OUTPUT_DIR, "Data_Climatica_PERU_CONSOLIDADO.csv")
        
        # Aseguramos el orden de las columnas en el archivo maestro
        df_consolidado = df_consolidado[[c for c in FINAL_ORDER if c in df_consolidado.columns]]
        
        df_consolidado.to_csv(consolidated_path, index=False)
        print(f"🎉 ¡Éxito! Archivo maestro consolidado (limpio y ordenado) guardado en:\n{os.path.abspath(consolidated_path)}")
    else:
        print("\nNo se pudo consolidar la data porque ningún archivo pudo ser procesado.")

# Ejecutar la función principal
if __name__ == "__main__":
    process_nasa_files()