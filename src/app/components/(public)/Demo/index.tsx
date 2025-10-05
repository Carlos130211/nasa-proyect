"use client";

import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";

type LatLng = { lat: number; lng: number };
type NominatimResult = { lat: string; lon: string; display_name: string };

type PredictResult = {
  Departamento?: string;
  T2M_MAX?: number | string;
  T2M_MIN?: number | string;
  RH2M?: number | string;
  WS10M?: number | string;
  RADIACION_SOLAR?: number | string;
  // otros campos posibles
  [k: string]: unknown;
};

const DEFAULT_CENTER: LatLng = { lat: -12.0463, lng: -77.0427 };
const FIXED_COUNTRY_CODE = "PE";
const FIXED_COUNTRY_NAME = "Perú";

const PERU_DEPARTMENTS = [
  { name: "Seleccionar Departamento", value: "" },
  { name: "Amazonas", value: "Amazonas" },
  { name: "Áncash", value: "Áncash" },
  { name: "Apurímac", value: "Apurímac" },
  { name: "Arequipa", value: "Arequipa" },
  { name: "Ayacucho", value: "Ayacucho" },
  { name: "Cajamarca", value: "Cajamarca" },
  { name: "Callao", value: "Callao" },
  { name: "Cusco", value: "Cusco" },
  { name: "Huancavelica", value: "Huancavelica" },
  { name: "Huánuco", value: "Huánuco" },
  { name: "Ica", value: "Ica" },
  { name: "Junín", value: "Junín" },
  { name: "La Libertad", value: "La Libertad" },
  { name: "Lambayeque", value: "Lambayeque" },
  { name: "Lima", value: "Lima" },
  { name: "Loreto", value: "Loreto" },
  { name: "Madre de Dios", value: "Madre de Dios" },
  { name: "Moquegua", value: "Moquegua" },
  { name: "Pasco", value: "Pasco" },
  { name: "Piura", value: "Piura" },
  { name: "Puno", value: "Puno" },
  { name: "San Martín", value: "San Martín" },
  { name: "Tacna", value: "Tacna" },
  { name: "Tumbes", value: "Tumbes" },
  { name: "Ucayali", value: "Ucayali" },
];

export default function Demo() {
  const [center, setCenter] = useState<LatLng>(DEFAULT_CENTER);
  const [address, setAddress] = useState<string>("Lima, Perú");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

  // Estados para predicción
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PredictResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Leaflet refs tipadas
  const leafletRef = useRef<null | typeof import("leaflet")>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const markerRef = useRef<Leaflet.Marker | null>(null);
  const mapElRef = useRef<HTMLDivElement | null>(null);

  // Inicializar mapa
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (typeof window === "undefined") return;
      if (!mapElRef.current || mapRef.current) return;

      const L: typeof import("leaflet") = await import("leaflet");
      if (cancelled) return;

      leafletRef.current = L;

      const markerIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        shadowSize: [41, 41],
      });

      mapRef.current = L.map(mapElRef.current, {
        center: [center.lat, center.lng],
        zoom: 7,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      markerRef.current = L.marker([center.lat, center.lng], {
        draggable: true,
        icon: markerIcon,
      }).addTo(mapRef.current);

      markerRef.current.bindPopup(getPopupHtml(address, center.lat, center.lng, date));

      markerRef.current.on("dragend", () => {
        const pos = markerRef.current!.getLatLng();
        setCenter({ lat: pos.lat, lng: pos.lng });
        markerRef.current!.setPopupContent(getPopupHtml(address, pos.lat, pos.lng, date));
      });
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actualizar popup si cambia algo
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([center.lat, center.lng]);
      markerRef.current.setPopupContent(getPopupHtml(address, center.lat, center.lng, date));
    }
  }, [center, address, date]);

  // Cambio de departamento
  const handleDepartmentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    setSelectedDepartment(v);
    if (!v) {
      setAddress(FIXED_COUNTRY_NAME);
      return;
    }

    const query = `${v}, ${FIXED_COUNTRY_NAME}`;
    const url = buildNominatimUrl(query, FIXED_COUNTRY_CODE);

    try {
      const resp = await fetch(url, { headers: { "Accept-Language": "es" } });
      const data = (await resp.json()) as NominatimResult[];
      if (Array.isArray(data) && data.length > 0) {
        const r = data[0];
        const lat = parseFloat(r.lat);
        const lng = parseFloat(r.lon);
        setCenter({ lat, lng });
        setAddress(r.display_name || query);
        if (mapRef.current) {
          mapRef.current.flyTo([lat, lng], 8, { animate: true });
          markerRef.current?.setLatLng([lat, lng]);
          markerRef.current?.setPopupContent(getPopupHtml(r.display_name || query, lat, lng, date));
        }
      } else {
        setAddress(`Ubicación de ${v} no encontrada.`);
      }
    } catch {
      setAddress("Error en el servicio de búsqueda.");
    }
  };

  // Botón: Predecir clima
  const handlePredict = async () => {
    if (!selectedDepartment || !center.lat || !center.lng || !date) {
      alert("⚠️ Por favor, selecciona el departamento, fecha y punto en el mapa.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departamento: selectedDepartment,
          lat: center.lat,
          lon: center.lng,
          fecha: date,
        }),
      });

      const raw: unknown = await res.json();
      if (!res.ok) {
        const maybeErr = (raw as { error?: string })?.error ?? "Error al obtener la predicción.";
        throw new Error(maybeErr);
      }

      // Algunos backends devuelven {resultado:{...}} o {datos:{...}}
      const payload = raw as Record<string, unknown>;
      const normalized =
        (payload.resultado as PredictResult | undefined) ??
        (payload.datos as PredictResult | undefined) ??
        (payload as PredictResult);

      setResult(normalized);
    } catch (err) {
      console.error("❌ Error:", err);
      setError("❌ No se pudo obtener la predicción. Verifica los datos e intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
        🗺️ Mapa de Departamentos del Perú
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel lateral */}
        <section className="bg-white p-6 rounded-lg shadow-xl lg:col-span-1">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Seleccionar Ubicación</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">País</label>
              <input
                type="text"
                value={FIXED_COUNTRY_NAME}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Departamento</label>
              <select
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {PERU_DEPARTMENTS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>

            {/* Info ubicación */}
            <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400 text-green-800 rounded-md">
              <p className="font-semibold">Ubicación:</p>
              <p className="ml-2 text-sm break-words">{address}</p>
              <p className="font-semibold mt-2">Coordenadas:</p>
              <p className="ml-2 text-sm">Latitud: {center.lat.toFixed(6)}</p>
              <p className="ml-2 text-sm">Longitud: {center.lng.toFixed(6)}</p>
            </div>

            {/* Botón */}
            <button
              onClick={handlePredict}
              disabled={loading}
              className="w-full mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? "⏳ Analizando..." : "🔍 Predecir clima"}
            </button>

            {/* Error */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Resultados */}
            {result && (
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-md text-sm space-y-1">
                <p className="font-bold">📍 {result.Departamento ?? selectedDepartment}</p>
                <p>🌡️ Temp. Máx: {result.T2M_MAX ?? "N/A"} °C</p>
                <p>🌡️ Temp. Mín: {result.T2M_MIN ?? "N/A"} °C</p>
                <p>💧 Humedad: {result.RH2M ?? "N/A"}%</p>
                <p>💨 Viento: {result.WS10M ?? "N/A"} m/s</p>
                <p>🔆 Radiación: {result.RADIACION_SOLAR ?? "N/A"} MJ/m²</p>
              </div>
            )}
          </div>
        </section>

        {/* Mapa */}
        <section className="lg:col-span-2">
          <div className="w-full h-[500px] border border-gray-300 rounded-lg shadow-xl overflow-hidden">
            <div ref={mapElRef} className="w-full h-full z-10" />
          </div>
        </section>
      </div>
    </main>
  );
}

function buildNominatimUrl(query: string, countryCode?: string): string {
  const base = "https://nominatim.openstreetmap.org/search";
  const params = new URLSearchParams({
    format: "json",
    q: query,
    limit: "1",
    addressdetails: "1",
  });
  if (countryCode) params.append("countrycodes", countryCode.toLowerCase());
  return `${base}?${params.toString()}`;
}

function getPopupHtml(label: string, lat: number, lng: number, date: string): string {
  return `
    <div style="font-size: 12px; line-height: 1.3">
      <div style="font-weight: 600;">${escapeHtml(label)}</div>
      <div style="color: #475569; margin-top: 2px;">
        ${lat.toFixed(5)}, ${lng.toFixed(5)}
      </div>
      <div style="margin-top: 6px;">
        <strong>Fecha:</strong> ${escapeHtml(date)}
      </div>
    </div>
  `;
}

function escapeHtml(str: string): string {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
