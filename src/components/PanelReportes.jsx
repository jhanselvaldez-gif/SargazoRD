import { useMemo, useState } from 'react';
import { api } from '../api/api.js';
import ItemIncidencia from './ItemIncidencia.jsx';
import { ESTADOS, ETIQUETAS, SEVERIDADES, haceDias, nombrePlaya } from '../utils.js';

const FILTROS_INICIALES = { zona: '', severidad: '', estado: '', desde: '', hasta: '' };

// Props: incidencias, playas, onCambio
export default function PanelReportes({ incidencias, playas, onCambio }) {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [verSemanal, setVerSemanal] = useState(false);
  const [error, setError] = useState('');

  const zonas = [...new Set(playas.map((p) => p.zona))];
  const zonaDe = (playaId) => playas.find((p) => p.id === playaId)?.zona;

  const filtradas = useMemo(
    () =>
      incidencias.filter(
        (i) =>
          (!filtros.zona || zonaDe(i.playaId) === filtros.zona) &&
          (!filtros.severidad || i.severidad === filtros.severidad) &&
          (!filtros.estado || i.estado === filtros.estado) &&
          (!filtros.desde || i.fecha >= filtros.desde) &&
          (!filtros.hasta || i.fecha <= filtros.hasta)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [incidencias, playas, filtros]
  );

  const cambiarFiltro = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value });

  async function cambiarEstado(id, estado) {
    setError('');
    try {
      await api.actualizarIncidencia(id, { estado });
      onCambio();
    } catch (e) {
      setError(e.message);
    }
  }

  async function eliminar(id) {
    if (!window.confirm(`¿Eliminar la incidencia #${id}? Esta acción no se puede deshacer.`)) return;
    setError('');
    try {
      await api.eliminarIncidencia(id);
      onCambio();
    } catch (e) {
      setError(e.message);
    }
  }

  // Resumen de los últimos 7 días (se calcula en el navegador con los datos de la API)
  const semana = incidencias.filter((i) => i.fecha >= haceDias(6));
  const contar = (lista, clave) =>
    lista.reduce((acc, i) => ({ ...acc, [clave(i)]: (acc[clave(i)] ?? 0) + 1 }), {});

  function descargarCSV() {
    const filas = [['id', 'playa', 'zona', 'severidad', 'cantidad', 'estado', 'fecha', 'descripcion']];
    filtradas.forEach((i) =>
      filas.push([i.id, nombrePlaya(playas, i.playaId), zonaDe(i.playaId), i.severidad,
        i.cantidadEstimada, i.estado, i.fecha, `"${i.descripcion.replaceAll('"', '""')}"`])
    );
    const blob = new Blob(['\ufeff' + filas.map((f) => f.join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = 'reporte-sargazord.csv';
    enlace.click();
    URL.revokeObjectURL(enlace.href);
  }

  return (
    <div>
      <form className="filtros" onSubmit={(e) => e.preventDefault()}>
        <div className="campo">
          <label htmlFor="f-zona">Zona</label>
          <select id="f-zona" name="zona" value={filtros.zona} onChange={cambiarFiltro}>
            <option value="">Todas</option>
            {zonas.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="f-sev">Severidad</label>
          <select id="f-sev" name="severidad" value={filtros.severidad} onChange={cambiarFiltro}>
            <option value="">Todas</option>
            {SEVERIDADES.map((s) => <option key={s} value={s}>{ETIQUETAS[s]}</option>)}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="f-est">Estado</label>
          <select id="f-est" name="estado" value={filtros.estado} onChange={cambiarFiltro}>
            <option value="">Todos</option>
            {ESTADOS.map((s) => <option key={s} value={s}>{ETIQUETAS[s]}</option>)}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="f-desde">Desde</label>
          <input id="f-desde" name="desde" type="date" value={filtros.desde} onChange={cambiarFiltro} />
        </div>
        <div className="campo">
          <label htmlFor="f-hasta">Hasta</label>
          <input id="f-hasta" name="hasta" type="date" value={filtros.hasta} onChange={cambiarFiltro} />
        </div>
        <button type="button" className="boton boton-secundario" onClick={() => setFiltros(FILTROS_INICIALES)}>
          Limpiar filtros
        </button>
      </form>

      <p role="status" className="item-meta">
        Mostrando {filtradas.length} de {incidencias.length} incidencias.
      </p>
      {error && <p role="alert" className="mensaje mensaje-error">{error}</p>}

      <ul className="lista">
        {filtradas.map((i) => (
          <ItemIncidencia key={i.id} incidencia={i} nombrePlaya={nombrePlaya(playas, i.playaId)}>
            <label htmlFor={`estado-${i.id}`} className="sr-only">Cambiar estado de la incidencia {i.id}</label>
            <select id={`estado-${i.id}`} value={i.estado} onChange={(e) => cambiarEstado(i.id, e.target.value)}>
              {ESTADOS.map((s) => <option key={s} value={s}>{ETIQUETAS[s]}</option>)}
            </select>
            <button type="button" className="boton boton-peligro" onClick={() => eliminar(i.id)}>
              Eliminar
            </button>
          </ItemIncidencia>
        ))}
      </ul>

      <div className="acciones-panel">
        <button type="button" className="boton" onClick={() => setVerSemanal(!verSemanal)} aria-expanded={verSemanal}>
          {verSemanal ? 'Ocultar reporte semanal' : 'Generar reporte semanal'}
        </button>
        <button type="button" className="boton boton-secundario" onClick={descargarCSV} disabled={filtradas.length === 0}>
          Descargar CSV (filtro actual)
        </button>
      </div>

      {verSemanal && (
        <div className="tarjeta resumen">
          <h4>Reporte de los últimos 7 días</h4>
          <p>Total de incidencias: <strong>{semana.length}</strong></p>
          <ul>
            {SEVERIDADES.map((s) => (
              <li key={s}>{ETIQUETAS[s]}: {contar(semana, (i) => i.severidad)[s] ?? 0}</li>
            ))}
          </ul>
          <ul>
            {zonas.map((z) => (
              <li key={z}>{z}: {semana.filter((i) => zonaDe(i.playaId) === z).length}</li>
            ))}
          </ul>
          <p>Resueltas: {semana.filter((i) => i.estado === 'resuelta').length}</p>
        </div>
      )}
    </div>
  );
}
