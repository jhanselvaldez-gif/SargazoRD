import BadgeSeveridad from './BadgeSeveridad.jsx';
import { ETIQUETAS } from '../utils.js';

// Props: incidencia, nombrePlaya (texto), children (controles opcionales)
export default function ItemIncidencia({ incidencia, nombrePlaya, children }) {
  return (
    <li className="item-incidencia">
      <div className="item-cabecera">
        <strong>{nombrePlaya}</strong>
        <BadgeSeveridad nivel={incidencia.severidad} />
      </div>
      <p>{incidencia.descripcion}</p>
      <p className="item-meta">
        #{incidencia.id} · {incidencia.fecha} · Cantidad: {ETIQUETAS[incidencia.cantidadEstimada]} ·
        Estado: <strong>{ETIQUETAS[incidencia.estado]}</strong>
      </p>
      {children && <div className="item-controles">{children}</div>}
    </li>
  );
}
