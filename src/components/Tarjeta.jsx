// Props: titulo, children, textoBoton (opcional), onClick (opcional), activa (opcional)
export default function Tarjeta({ titulo, children, textoBoton, onClick, activa = false }) {
  return (
    <article className={`tarjeta${activa ? ' tarjeta-activa' : ''}`}>
      <h3>{titulo}</h3>
      <p>{children}</p>
      {textoBoton && (
        <button type="button" className="boton" onClick={onClick} aria-pressed={activa}>
          {textoBoton}
        </button>
      )}
    </article>
  );
}
