// Capa única de comunicación con la API REST (server.js).
// Todos los componentes usan estas funciones; nadie más llama a fetch().
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

async function pedir(ruta, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${BASE}${ruta}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opciones,
    });
  } catch {
    throw new Error(
      'No se pudo conectar con la API. Verifica que el servidor esté corriendo en el puerto 3000.'
    );
  }
  if (respuesta.status === 204) return null; // DELETE correcto: sin contenido
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) throw new Error(datos.error || `Error ${respuesta.status}`);
  return datos;
}

export const api = {
  // PLAYAS
  listarPlayas: () => pedir('/playas'),
  // INCIDENCIAS
  listarIncidencias: (filtros = {}) => {
    const texto = new URLSearchParams(filtros).toString();
    return pedir(`/incidencias${texto ? `?${texto}` : ''}`);
  },
  crearIncidencia: (datos) =>
    pedir('/incidencias', { method: 'POST', body: JSON.stringify(datos) }),
  actualizarIncidencia: (id, cambios) =>
    pedir(`/incidencias/${id}`, { method: 'PATCH', body: JSON.stringify(cambios) }),
  eliminarIncidencia: (id) => pedir(`/incidencias/${id}`, { method: 'DELETE' }),
  // ACCIONES
  listarAcciones: (incidenciaId) => pedir(`/incidencias/${incidenciaId}/acciones`),
  crearAccion: (datos) =>
    pedir('/acciones', { method: 'POST', body: JSON.stringify(datos) }),
};
