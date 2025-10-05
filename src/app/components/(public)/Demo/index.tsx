// src/app/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type LatLng = { lat: number; lng: number };
type VariableKey = "temperatura" | "precipitacion" | "viento";
type NominatimResult = { lat: string; lon: string; display_name: string };

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

export default function Page() {
  const [center, setCenter] = useState<LatLng>(DEFAULT_CENTER);
  const [address, setAddress] = useState<string>("Lima, Perú");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [variable, setVariable] = useState<VariableKey>("temperatura");
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [label, setLabel] = useState<string>("");

  // Refs para Leaflet y mapa
  const leafletRef = useRef<any>(null);          // guardará el namespace L
  const mapRef = useRef<any>(null);              // LeafletMap
  const markerRef = useRef<any>(null);           // LeafletMarker
  const mapElRef = useRef<HTMLDivElement | null>(null);

  // Cargar Leaflet solo en cliente y luego inicializar mapa
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (typeof window === "undefined") return; // seguridad extra
      if (!mapElRef.current || mapRef.current) return;

      // Carga dinámica de Leaflet (evita SSR)
      const Lmod = await import("leaflet");
      const L = Lmod.default || Lmod; // algunos bundlers exponen default
      if (cancelled) return;

      leafletRef.current = L;

      // Fix de iconos (opcional, aquí usamos URLs por defecto)
      const markerIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        shadowSize: [41, 41],
      });

      // Crear mapa
      mapRef.current = L.map(mapElRef.current, {
        center: [center.lat, center.lng],
        zoom: 12,
        scrollWheelZoom: true,
      });

      // Capa base
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // Marcador draggable
      markerRef.current = L.marker([center.lat, center.lng], { draggable: true, icon: markerIcon }).addTo(mapRef.current);
      markerRef.current.bindPopup(getPopupHtml(label || address, center.lat, center.lng, variable, date));

      // Eventos
      markerRef.current.on("dragend", () => {
        const pos = markerRef.current!.getLatLng();
        setCenter({ lat: pos.lat, lng: pos.lng });
        markerRef.current!.setPopupContent(getPopupHtml(label || address, pos.lat, pos.lng, variable, date));
      });

      mapRef.current.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        setCenter({ lat, lng });
        markerRef.current!.setLatLng([lat, lng]);
        markerRef.current!.setPopupContent(getPopupHtml(label || address, lat, lng, variable, date));
        mapRef.current!.flyTo([lat, lng], mapRef.current!.getZoom());
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
  }, []); // solo una vez

  // Sync center → marcador/popup
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    markerRef.current.setLatLng([center.lat, center.lng]);
    markerRef.current.setPopupContent(getPopupHtml(label || address, center.lat, center.lng, variable, date));
  }, [center]);

  // Actualiza popup si cambia label/address/variable/date
  useEffect(() => {
    if (!markerRef.current) return;
    markerRef.current.setPopupContent(getPopupHtml(label || address, center.lat, center.lng, variable, date));
  }, [label, address, variable, date, center.lat, center.lng]);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    setSelectedDepartment(v);
    setAddress(v ? `${v}, ${FIXED_COUNTRY_NAME}` : FIXED_COUNTRY_NAME);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepartment) {
      setAddress("Por favor, selecciona un departamento.");
      return;
    }
    const query = `${selectedDepartment}, ${FIXED_COUNTRY_NAME}`;
    const url = buildNominatimUrl(query, FIXED_COUNTRY_CODE);
    try {
      const resp = await fetch(url, { headers: { "Accept-Language": "es" } });
      const data = (await resp.json()) as NominatimResult[];
      if (data?.length) {
        const r = data[0];
        const lat = parseFloat(r.lat);
        const lng = parseFloat(r.lon);
        setCenter({ lat, lng });
        setAddress(r.display_name || query);
        if (mapRef.current) {
          mapRef.current.flyTo([lat, lng], Math.max(mapRef.current.getZoom(), 8), { animate: true });
          markerRef.current?.setLatLng([lat, lng]);
          markerRef.current?.setPopupContent(getPopupHtml(label || (r.display_name || query), lat, lng, variable, date));
        }
      } else {
        setAddress(`Ubicación de ${selectedDepartment} no encontrada.`);
      }
    } catch {
      setAddress("Error en el servicio de búsqueda.");
    }
  };

  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">🇵🇪 Visor de Departamentos del Perú (Leaflet)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-white p-6 rounded-lg shadow-xl lg:col-span-1">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Buscador por Departamento</h2>

          <form onSubmit={handleSearch} className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-600">Seleccionar Departamento</label>
              <select
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
              >
                {PERU_DEPARTMENTS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
            >
              Mostrar en el mapa
            </button>

            <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400 text-green-800 rounded-md">
              <p className="font-semibold">Ubicación:</p>
              <p className="ml-2 text-sm break-words">{address}</p>
              <p className="font-semibold mt-2">Coordenadas:</p>
              <p className="ml-2 text-sm">Latitud: {center.lat.toFixed(6)}</p>
              <p className="ml-2 text-sm">Longitud: {center.lng.toFixed(6)}</p>
            </div>
          </form>

          <div className="mt-8 h-px bg-black/10" />

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Etiqueta (opcional)</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ej. Plaza de Armas"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-600">Variable</label>
                <select
                  value={variable}
                  onChange={(e) => setVariable(e.target.value as VariableKey)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                >
                  <option value="temperatura">Temperatura</option>
                  <option value="precipitacion">Precipitación</option>
                  <option value="viento">Viento</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Fecha</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="rounded-lg border border-black/10 p-3 text-xs text-slate-600 bg-slate-50">
              <p><strong>Tip:</strong> Haz click en el mapa o arrastra el marcador para ajustar la ubicación.</p>
            </div>
          </div>
        </section>

        <section className="lg:col-span-2">
          <div className="w-full h-[500px] border border-gray-300 rounded-lg shadow-xl overflow-hidden">
            <div ref={mapElRef} className="w-full h-full z-10" />
          </div>
        </section>
      </div>
    </main>
  );
}

function buildNominatimUrl(query: string, countryCode?: string) {
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

function getPopupHtml(label: string, lat: number, lng: number, variable: string, date: string) {
  return `
    <div style="font-size: 12px; line-height: 1.2">
      <div style="font-weight: 600;">${escapeHtml(label)}</div>
      <div style="color: #475569; margin-top: 2px;">
        ${lat.toFixed(5)}, ${lng.toFixed(5)}
      </div>
      <div style="margin-top: 6px;">
        <div><strong>Variable:</strong> ${escapeHtml(variable)}</div>
        <div><strong>Fecha:</strong> ${escapeHtml(date)}</div>
      </div>
    </div>
  `;
}

function escapeHtml(str: string) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
