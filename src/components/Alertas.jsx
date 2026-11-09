import { useState } from 'react';
import { api } from '../api/api.js';
import { useFetch } from '../hooks/useFetch.js';
import EstadoCarga from './EstadoCarga.jsx';
import ItemIncidencia from './ItemIncidencia.jsx';
import { nombrePlaya } from '../utils.js';

// Props: playas, version (cambia cuando hay datos nuevos), onCambio
export default function Alertas({ playas, version, onCambio }) {
  // Usa el filtro del servidor: GET /api/incidencias?severidad=critico
  const { datos, cargando, error, recargar } = useFetch(
    () => api.listarIncidencias({ severidad: 'critico' }),
    [version]
  );
  const [errorAccion, setErrorAccion] = useState('');

  async function confirmar(id) {
    setErrorAccion('');
    try {
      // "Confirmar recepción" = el equipo toma el caso: pendiente → en_proceso
      await api.actualizarIncidencia(id, { estado: 'en_proceso' });
      onCambio();
    } catch (e) {
      setErrorAccion(e.message);
    }
  }

  const activas = datos.filter((i) => i.estado !== 'resuelta');

  return (
    <EstadoCarga
      cargando={cargando}
      error={error}
      onReintentar={recargar}
      vacio={activas.length === 0}
      mensajeVacio="No hay alertas críticas activas. ¡Buenas noticias!"
    >
      {errorAccion && <p role="alert" className="mensaje mensaje-error">{errorAccion}</p>}
      <ul className="lista">
        {activas.map((i) => (
          <ItemIncidencia key={i.id} incidencia={i} nombrePlaya={nombrePlaya(playas, i.playaId)}>
            {i.estado === 'pendiente' ? (
              <button type="button" className="boton" onClick={() => confirmar(i.id)}>
                Confirmar recepción
              </button>
            ) : (
              <span className="mensaje-exito mensaje">✔ Recepción confirmada</span>
            )}
          </ItemIncidencia>
        ))}
      </ul>
    </EstadoCarga>
  );
}
