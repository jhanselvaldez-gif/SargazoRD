import { ETIQUETAS } from '../utils.js';

// Muestra el nivel con texto (no solo color) para no depender únicamente del color.
export default function BadgeSeveridad({ nivel }) {
  return <span className={`badge badge-${nivel}`}>{ETIQUETAS[nivel] ?? nivel}</span>;
}
