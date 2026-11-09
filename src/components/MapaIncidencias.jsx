import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ETIQUETAS, nivelPlaya } from '../utils.js';

const COLORES = { limpia: '#1B7F37', bajo: '#E0B400', moderado: '#E07B00', critico: '#B3261E' };

// Props: playas, incidencias
export default function MapaIncidencias({ playas, incidencias }) {
  const contenedor = useRef(null);
  const capa = useRef(null);
  const mapa = useRef(null);

  // 1) Crear el mapa una sola vez
  useEffect(() => {
    mapa.current = L.map(contenedor.current).setView([18.5, -68.7], 9);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap',
    }).addTo(mapa.current);
    capa.current = L.layerGroup().addTo(mapa.current);
    return () => mapa.current.remove();
  }, []);

  // 2) Redibujar marcadores cuando cambian los datos
  useEffect(() => {
    capa.current.clearLayers();
    playas.forEach((p) => {
      const nivel = nivelPlaya(p.id, incidencias);
      const marcador = L.circleMarker([p.latitud, p.longitud], {
        radius: 11,
        color: '#22301F',
        weight: 2,
        fillColor: COLORES[nivel],
        fillOpacity: 0.9,
      });
      const popup = document.createElement('div');
      popup.textContent = `${p.nombre} — ${ETIQUETAS[nivel]}`;
      marcador.bindPopup(popup).addTo(capa.current);
    });
    if (playas.length) {
      mapa.current.fitBounds(playas.map((p) => [p.latitud, p.longitud]), { padding: [40, 40] });
    }
  }, [playas, incidencias]);

  return (
    <div>
      <div ref={contenedor} className="mapa" role="region" aria-label="Mapa de playas con nivel de sargazo" />
      <p className="item-meta">
        El mapa necesita conexión a internet. Si no carga, usa la lista de abajo.
      </p>
      <ul className="lista-playas">
        {playas.map((p) => {
          const nivel = nivelPlaya(p.id, incidencias);
          return (
            <li key={p.id} className="item-incidencia">
              <div className="item-cabecera">
                <strong>{p.nombre}</strong>
                <span className={`badge badge-${nivel}`}>{ETIQUETAS[nivel]}</span>
              </div>
              <p className="item-meta">{p.zona} · {p.municipio}</p>
              <a
                href={`https://www.google.com/maps?q=${p.latitud},${p.longitud}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver en Google Maps<span className="sr-only"> (se abre en una pestaña nueva): {p.nombre}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
