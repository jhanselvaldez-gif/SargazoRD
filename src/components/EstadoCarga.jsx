// Maneja los 3 estados de una petición: cargando, error y datos disponibles.
// Props: cargando, error, vacio (bool), mensajeVacio, onReintentar, children
export default function EstadoCarga({
  cargando,
  error,
  vacio = false,
  mensajeVacio = 'No hay datos para mostrar.',
  onReintentar,
  children,
}) {
  if (cargando) {
    return (
      <p role="status" className="mensaje">
        Cargando información…
      </p>
    );
  }
  if (error) {
    return (
      <div role="alert" className="mensaje mensaje-error">
        <p>{error}</p>
        {onReintentar && (
          <button type="button" className="boton boton-secundario" onClick={onReintentar}>
            Reintentar
          </button>
        )}
      </div>
    );
  }
  if (vacio) return <p className="mensaje">{mensajeVacio}</p>;
  return children;
}
