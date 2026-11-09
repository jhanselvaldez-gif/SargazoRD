import { useState } from 'react';
import { api } from '../api/api.js';
import { useFetch } from '../hooks/useFetch.js';
import EstadoCarga from './EstadoCarga.jsx';
import { nombrePlaya } from '../utils.js';

// Props: incidencias, playas
export default function HistorialAcciones({ incidencias, playas }) {
  // Pide las acciones de cada incidencia y las junta en una sola lista
  const { datos, cargando, error, recargar } = useFetch(async () => {
    const grupos = await Promise.all(incidencias.map((i) => api.listarAcciones(i.id)));
    return grupos.flat().sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
  }, [incidencias]);

  const [valores, setValores] = useState({ incidenciaId: '', equipo: '', descripcion: '' });
  const [enviando, setEnviando] = useState(false);
  const [error2, setError2] = useState('');
  const [exito, setExito] = useState('');

  const cambiar = (e) => setValores({ ...valores, [e.target.name]: e.target.value });
  const porId = (id) => incidencias.find((i) => i.id === id);

  async function enviar(e) {
    e.preventDefault();
    setError2('');
    setExito('');
    if (!valores.incidenciaId) return setError2('Selecciona la incidencia atendida.');
    setEnviando(true);
    try {
      await api.crearAccion({ ...valores, incidenciaId: Number(valores.incidenciaId) });
      setExito('Acción registrada en el historial.');
      setValores({ incidenciaId: '', equipo: '', descripcion: '' });
      recargar();
    } catch (err) {
      setError2(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <EstadoCarga
        cargando={cargando}
        error={error}
        onReintentar={recargar}
        vacio={datos.length === 0}
        mensajeVacio="Todavía no hay acciones registradas."
      >
        <ul className="lista">
          {datos.map((a) => {
            const inc = porId(a.incidenciaId);
            return (
              <li key={a.id} className="item-incidencia">
                <div className="item-cabecera">
                  <strong>{a.equipo}</strong>
                  <span className="item-meta">{a.fecha}</span>
                </div>
                <p>{a.descripcion}</p>
                <p className="item-meta">
                  Incidencia #{a.incidenciaId}
                  {inc ? ` · ${nombrePlaya(playas, inc.playaId)}` : ''}
                </p>
              </li>
            );
          })}
        </ul>
      </EstadoCarga>

      <h4>Registrar una intervención</h4>
      <form onSubmit={enviar} noValidate className="formulario">
        <div className="campo">
          <label htmlFor="accion-incidencia">Incidencia atendida</label>
          <select id="accion-incidencia" name="incidenciaId" value={valores.incidenciaId} onChange={cambiar}>
            <option value="">— Selecciona —</option>
            {incidencias.map((i) => (
              <option key={i.id} value={i.id}>
                #{i.id} · {nombrePlaya(playas, i.playaId)} · {i.fecha}
              </option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="accion-equipo">Equipo responsable</label>
          <input id="accion-equipo" name="equipo" type="text" value={valores.equipo} onChange={cambiar} />
        </div>
        <div className="campo">
          <label htmlFor="accion-desc">Descripción de lo realizado</label>
          <textarea id="accion-desc" name="descripcion" rows="3" value={valores.descripcion} onChange={cambiar} />
        </div>
        <button type="submit" className="boton" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Registrar acción'}
        </button>
        <div aria-live="polite">
          {error2 && <p role="alert" className="mensaje mensaje-error">{error2}</p>}
          {exito && <p className="mensaje mensaje-exito">{exito}</p>}
        </div>
      </form>
    </div>
  );
}
