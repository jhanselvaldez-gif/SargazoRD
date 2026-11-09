export const ETIQUETAS = {
  bajo: 'Bajo',
  moderado: 'Moderado',
  critico: 'Crítico',
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  resuelta: 'Resuelta',
  limpia: 'Limpia',
};

export const SEVERIDADES = ['bajo', 'moderado', 'critico'];
export const CANTIDADES = ['baja', 'media', 'alta'];
export const ESTADOS = ['pendiente', 'en_proceso', 'resuelta'];

const ORDEN = { bajo: 1, moderado: 2, critico: 3 };

// Nivel de una playa = la severidad más alta entre sus incidencias sin resolver.
export function nivelPlaya(playaId, incidencias) {
  const activas = incidencias.filter(
    (i) => i.playaId === playaId && i.estado !== 'resuelta'
  );
  if (activas.length === 0) return 'limpia';
  return activas.reduce((max, i) => (ORDEN[i.severidad] > ORDEN[max] ? i.severidad : max), 'bajo');
}

export const hoy = () => new Date().toISOString().slice(0, 10);

export function haceDias(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export const nombrePlaya = (playas, id) =>
  playas.find((p) => p.id === id)?.nombre ?? `Playa #${id}`;
