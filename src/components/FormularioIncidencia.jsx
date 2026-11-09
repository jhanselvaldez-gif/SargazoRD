import { useState } from 'react';
import { api } from '../api/api.js';
import { CANTIDADES, ETIQUETAS, SEVERIDADES } from '../utils.js';

const INICIAL = { playaId: '', severidad: 'bajo', cantidadEstimada: 'baja', descripcion: '' };

// Props: playas (lista), onCreada (callback para refrescar datos)
export default function FormularioIncidencia({ playas, onCreada }) {
  const [valores, setValores] = useState(INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const cambiar = (e) => setValores({ ...valores, [e.target.name]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setError('');
    setExito('');
    if (!valores.playaId) return setError('Selecciona la playa afectada.');
    if (valores.descripcion.trim().length < 5)
      return setError('La descripción debe tener al menos 5 caracteres.');

    setEnviando(true);
    try {
      const creada = await api.crearIncidencia({ ...valores, playaId: Number(valores.playaId) });
      setExito(`Incidencia #${creada.id} registrada correctamente.`);
      setValores(INICIAL);
      onCreada();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="formulario">
      <div className="campo">
        <label htmlFor="playaId">Playa</label>
        <select id="playaId" name="playaId" value={valores.playaId} onChange={cambiar} required>
          <option value="">— Selecciona una playa —</option>
          {playas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} ({p.zona})
            </option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label htmlFor="severidad">Severidad</label>
        <select id="severidad" name="severidad" value={valores.severidad} onChange={cambiar}>
          {SEVERIDADES.map((s) => (
            <option key={s} value={s}>{ETIQUETAS[s]}</option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label htmlFor="cantidadEstimada">Cantidad estimada de sargazo</label>
        <select id="cantidadEstimada" name="cantidadEstimada" value={valores.cantidadEstimada} onChange={cambiar}>
          {CANTIDADES.map((c) => (
            <option key={c} value={c}>{ETIQUETAS[c]}</option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows="3"
          value={valores.descripcion}
          onChange={cambiar}
          aria-describedby="ayuda-descripcion"
          required
        />
        <small id="ayuda-descripcion">Mínimo 5 caracteres. Describe qué ves en la orilla.</small>
      </div>

      <button type="submit" className="boton" disabled={enviando}>
        {enviando ? 'Enviando…' : 'Enviar reporte'}
      </button>

      <div aria-live="polite">
        {error && <p role="alert" className="mensaje mensaje-error">{error}</p>}
        {exito && <p className="mensaje mensaje-exito">{exito}</p>}
      </div>
    </form>
  );
}
