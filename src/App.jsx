import { useEffect, useRef, useState } from 'react';
import { api } from './api/api.js';
import { useFetch } from './hooks/useFetch.js';
import Encabezado from './components/Encabezado.jsx';
import Seccion from './components/Seccion.jsx';
import Tarjeta from './components/Tarjeta.jsx';
import EstadoCarga from './components/EstadoCarga.jsx';
import FormularioIncidencia from './components/FormularioIncidencia.jsx';
import MapaIncidencias from './components/MapaIncidencias.jsx';
import Alertas from './components/Alertas.jsx';
import HistorialAcciones from './components/HistorialAcciones.jsx';
import PanelReportes from './components/PanelReportes.jsx';

const ENLACES = [
  { id: 'inicio', texto: 'Inicio' },
  { id: 'problema', texto: 'El problema' },
  { id: 'usuarios', texto: 'Usuarios' },
  { id: 'funcionalidades', texto: 'Funcionalidades' },
  { id: 'realidad-local', texto: 'Realidad local' },
];

const USUARIOS = [
  ['Autoridades ambientales y turísticas', 'Personal del MITUR, Medio Ambiente y la Armada. Coordinan recursos y analizan estadísticas.'],
  ['Equipos de limpieza', 'Reciben asignaciones y notificaciones de las playas críticas donde deben trabajar.'],
  ['Pescadores', 'Pasan más tiempo en el mar, por lo que alertan de forma prioritaria la llegada del sargazo.'],
  ['Comunidades locales', 'Reportan acumulaciones con fotos y consultan el historial de intervenciones.'],
  ['Hoteles y operadores turísticos', 'Consultan el nivel de sargazo en playas cercanas para decidir dónde enviar su equipo.'],
];

const FUNCIONALIDADES = [
  { clave: 'reportar', titulo: 'Registrar incidencia', boton: 'Reportar',
    texto: 'El ciudadano o pescador reporta sargazo con foto, video, ubicación y cantidad estimada, sin necesidad de registrarse.' },
  { clave: 'mapa', titulo: 'Mapa de incidencias', boton: 'Ver mapa',
    texto: 'Muestra qué playas están limpias o afectadas, con niveles de severidad: Bajo, Moderado y Crítico.' },
  { clave: 'alertas', titulo: 'Notificaciones de severidad crítica', boton: 'Ver alertas',
    texto: 'Los equipos de limpieza reciben alertas de las playas críticas y confirman que las recibieron.' },
  { clave: 'historial', titulo: 'Historial de acciones', boton: 'Ver historial',
    texto: 'Lista pública de las intervenciones realizadas para que la comunidad compruebe que se están tomando medidas.' },
  { clave: 'panel', titulo: 'Reportes y filtros', boton: 'Ver panel',
    texto: 'Las autoridades filtran incidencias por fecha y zona y generan reportes semanales automáticos.' },
];

const TITULOS = Object.fromEntries(FUNCIONALIDADES.map((f) => [f.clave, f.titulo]));

export default function App() {
  const [vista, setVista] = useState(null); // qué funcionalidad está abierta
  const titulo = useRef(null);

  // Datos de la API (se cargan al montar con useEffect dentro de useFetch)
  const playas = useFetch(api.listarPlayas);
  const incidencias = useFetch(() => api.listarIncidencias());

  // Al abrir un panel: llevar el foco al título (accesibilidad con teclado/lector de pantalla)
  useEffect(() => {
    if (vista && titulo.current) {
      titulo.current.focus();
      titulo.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [vista]);

  const alternar = (clave) => setVista(vista === clave ? null : clave);
  const reintentar = () => { playas.recargar(); incidencias.recargar(); };

  return (
    <>
      <Encabezado enlaces={ENLACES} />

      <main>
        <Seccion id="inicio" titulo="Región Yuma, República Dominicana">
          <p>
            Una aplicación web para reportar, visualizar y atender la acumulación de sargazo en las
            playas de <strong>La Romana</strong>, <strong>Bayahíbe</strong> y <strong>Punta Cana</strong>.
          </p>
          <figure>
            <img src="/imagenes/Playa con zargaso.jpg" alt="Playa de la Región Yuma cubierta de sargazo en la orilla" width="800" />
            <figcaption>Acumulación de sargazo en una playa de la Región Yuma.</figcaption>
          </figure>
        </Seccion>

        <Seccion id="problema" titulo="¿Cuál es el problema?">
          <p>
            El sargazo llega a las playas en cantidades muy variables: una playa puede amanecer cubierta
            mientras otra cercana está limpia. Hoy los reportes circulan de manera informal por redes
            sociales y mensajes directos, sin un registro de la ubicación, la fecha, la severidad ni las
            acciones realizadas.
          </p>
          <p>
            Esto provoca duplicación de esfuerzos, retrasos en la respuesta, pérdida de atractivo turístico
            y falta de datos históricos para evaluar las intervenciones.
          </p>
        </Seccion>

        <Seccion id="usuarios" titulo="Usuarios principales">
          {USUARIOS.map(([t, d]) => <Tarjeta key={t} titulo={t}>{d}</Tarjeta>)}
        </Seccion>

        <Seccion id="funcionalidades" titulo="Funcionalidades">
          {FUNCIONALIDADES.map((f) => (
            <Tarjeta key={f.clave} titulo={f.titulo} textoBoton={vista === f.clave ? 'Cerrar' : f.boton}
              activa={vista === f.clave} onClick={() => alternar(f.clave)}>
              {f.texto}
            </Tarjeta>
          ))}
        </Seccion>

        {/* Panel dinámico: cambia sin recargar la página */}
        {vista && (
          <section className="seccion panel" aria-labelledby="titulo-panel">
            <h2 id="titulo-panel" tabIndex="-1" ref={titulo}>{TITULOS[vista]}</h2>
            <EstadoCarga
              cargando={playas.cargando || incidencias.cargando}
              error={playas.error || incidencias.error}
              onReintentar={reintentar}
            >
              {vista === 'reportar' && (
                <FormularioIncidencia playas={playas.datos} onCreada={incidencias.recargar} />
              )}
              {vista === 'mapa' && (
                <MapaIncidencias playas={playas.datos} incidencias={incidencias.datos} />
              )}
              {vista === 'alertas' && (
                <Alertas playas={playas.datos} version={incidencias.datos} onCambio={incidencias.recargar} />
              )}
              {vista === 'historial' && (
                <HistorialAcciones playas={playas.datos} incidencias={incidencias.datos} />
              )}
              {vista === 'panel' && (
                <PanelReportes playas={playas.datos} incidencias={incidencias.datos} onCambio={incidencias.recargar} />
              )}
            </EstadoCarga>
          </section>
        )}

        <Seccion id="realidad-local" titulo="Pensada para la realidad dominicana">
          <ul>
            <li><strong>Funciona sin conexión:</strong> guarda los reportes y los sincroniza cuando regresa la señal.</li>
            <li><strong>Bajo consumo de datos:</strong> fotos y mapas optimizados; el usuario elige la calidad.</li>
            <li><strong>Interfaz simple y en español:</strong> fácil de usar para todas las comunidades.</li>
          </ul>
        </Seccion>
      </main>

      <footer>
        <p>SargazoRD – Plataforma de Incidencias Yuma · Región Yuma, RD</p>
        <p>
          Equipo: Michael Angelo Herrera Made, Melvin Fausto Montero Paniagua, Esbenni Johan Frías Morel,
          Jhansel Valdez y Joel Villegas Medina.
        </p>
      </footer>
    </>
  );
}
