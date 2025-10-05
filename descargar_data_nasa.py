import requests
import os
import time

# --- 1. CONFIGURACIÓN DEL PROYECTO ---
DOWNLOAD_DIR = "NASA_Data_Peru_Final_Exito" # Nueva carpeta para evitar conflictos
os.makedirs(DOWNLOAD_DIR, exist_ok=True)
print(f"Directorio de descarga: {os.path.abspath(DOWNLOAD_DIR)}")

# 🛑 CORRECCIÓN CLAVE: SE AÑADEN MÁS VARIABLES CLIMÁTICAS 🛑
# T2M_MAX, T2M_MIN (Frío/Calor), PRECTOT (Lluvia), RH2M (Humedad), WS10M (Viento), ALLSKY_SFC_SW_DWN (Radiación)
PARAMETERS = "T2M_MAX,T2M_MIN,PRECTOT,RH2M,WS10M,ALLSKY_SFC_SW_DWN" 

# Rango Histórico: Un año completo (Octubre 2023 a Octubre 2024)
START_DATE = "20231001" 
END_DATE = "20241001" 

# Base de la URL del API de NASA POWER
BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"
COMMUNITY = "AG" 

# --- 2. UBICACIONES: (Sin cambios en esta sección) ---
DEPARTMENTS = {
    "Amazonas_Chachapoyas": {"lat": -6.2200, "lon": -77.8680},
    "Ancash_Huaraz": {"lat": -9.5290, "lon": -77.5278},
    "Apurimac_Abancay": {"lat": -13.6338, "lon": -72.8824},
    "Arequipa": {"lat": -16.4090, "lon": -71.5375},
    "Ayacucho": {"lat": -13.1587, "lon": -74.2230},
    "Cajamarca": {"lat": -7.1561, "lon": -78.5097},
    "Callao_Provincia_Const": {"lat": -12.0560, "lon": -77.1350},
    "Cusco": {"lat": -13.5320, "lon": -71.9675},
    "Huancavelica": {"lat": -12.7937, "lon": -74.9760},
    "Huanuco": {"lat": -9.9284, "lon": -76.2378},
    "Ica": {"lat": -14.0678, "lon": -75.7286},
    "Junin_Huancayo": {"lat": -12.0664, "lon": -75.2045},
    "La_Libertad_Trujillo": {"lat": -8.1150, "lon": -79.0290},
    "Lambayeque_Chiclayo": {"lat": -6.7710, "lon": -79.8402},
    "Lima_Metropolitana": {"lat": -12.0464, "lon": -77.0428},
    "Lima_Provincias_Huacho": {"lat": -11.1000, "lon": -77.6000},
    "Loreto_Iquitos": {"lat": -3.7491, "lon": -73.2538},
    "Madre_de_Dios_Pto_Maldonado": {"lat": -12.5933, "lon": -69.1966},
    "Moquegua": {"lat": -17.1996, "lon": -70.9352},
    "Pasco_Cerro_de_Pasco": {"lat": -10.6860, "lon": -76.2570},
    "Piura": {"lat": -5.1944, "lon": -80.6320},
    "Puno": {"lat": -15.8400, "lon": -70.0210},
    "San_Martin_Moyobamba": {"lat": -6.0336, "lon": -76.9740},
    "Tacna": {"lat": -18.0143, "lon": -70.2520},
    "Tumbes": {"lat": -3.5667, "lon": -80.4500},
    "Ucayali_Pucallpa": {"lat": -8.3800, "lon": -74.5500},
}


# --- 3. FUNCIÓN DE DESCARGA Y EJECUCIÓN (Sin cambios aquí) ---

def download_nasa_data():
    """Recorre las ubicaciones, construye la URL del API y descarga los datos."""
    
    total_locations = len(DEPARTMENTS)
    print(f"Iniciando descarga de datos para {total_locations} ubicaciones.")

    for i, (name, coords) in enumerate(DEPARTMENTS.items()):
        
        # Redondeo a 2 decimales para compatibilidad máxima
        lat_rounded = round(coords['lat'], 2)
        lon_rounded = round(coords['lon'], 2)
        
        # 1. Construir la URL de la API
        api_url = (
            f"{BASE_URL}?parameters={PARAMETERS}"
            f"&community={COMMUNITY}"
            f"&longitude={lon_rounded}" 
            f"&latitude={lat_rounded}"   
            f"&start={START_DATE}" 
            f"&end={END_DATE}"
            f"&format=CSV" 
        )

        print(f"\n[{i+1}/{total_locations}] Procesando {name} (Lat: {lat_rounded}, Lon: {lon_rounded})...")

        # 2. Realizar la solicitud HTTP
        try:
            response = requests.get(api_url, verify=True, timeout=60) 
            response.raise_for_status() 
            
        except requests.exceptions.HTTPError as e:
            error_message = response.text 
            print(f"!!! ERROR: Falló la solicitud para {name}. Razón: {e}")
            print(f"!!! RESPUESTA DETALLADA DEL SERVIDOR: {error_message.strip()}")
            print("Saltando al siguiente departamento. Si el error persiste, la causa es la ubicación o la fecha.")
            time.sleep(2)
            continue
        except requests.exceptions.RequestException as e:
            print(f"!!! ERROR DE CONEXIÓN: Falló la conexión para {name}. Razón: {e}")
            time.sleep(2)
            continue

        # 3. Guardar el contenido en un archivo CSV
        file_path = os.path.join(DOWNLOAD_DIR, f"{name}_{START_DATE}_to_{END_DATE}.csv")
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(response.text)
            
        print(f"-> Descarga exitosa. Archivo guardado en: {file_path}")
        
        time.sleep(1) 
        
    print("\n=======================================================")
    print("✅ ¡PROCESO DE DESCARGA FINALIZADO! 🎉")
    print("=======================================================")

# Ejecutar la función principal
if __name__ == "__main__":
    download_nasa_data()