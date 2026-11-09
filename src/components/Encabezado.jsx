// Props: enlaces = [{ id, texto }]
export default function Encabezado({ enlaces }) {
  return (
    <header>
      <img
        src="/imagenes/Logo de ZargasoRD.jpeg"
        alt="Logo de SargazoRD: ola, palmeras y herramienta de limpieza de sargazo"
        width="160"
        height="160"
      />
      <h1>SargazoRD</h1>
      <p>Plataforma de Incidencias Yuma</p>
      <nav aria-label="Navegación principal">
        <ul>
          {enlaces.map((e) => (
            <li key={e.id}>
              <a href={`#${e.id}`}>{e.texto}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
