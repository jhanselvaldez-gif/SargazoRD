const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json()); // permite leer JSON en el body
app.use(cors()); // Permitir que React se comunique con la API

app.use((req, res, next) => {
  if (['POST', 'PATCH', 'PUT'].includes(req.method) && !req.body) {
    req.body = {};
  }
  next();
});

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API SargazoRD funcionando',
    endpoints: ['/api/playas', '/api/incidencias']
  });
});

// Datos de ejemplo en memoria
const playas = [
  { id: 1, nombre: 'Playa Bayahíbe', municipio: 'San Rafael del Yuma', zona: 'Bayahíbe', latitud: 18.3734, longitud: -68.8452 },
  { id: 2, nombre: 'Playa Bávaro', municipio: 'Higüey', zona: 'Punta Cana', latitud: 18.6947, longitud: -68.4231 },
  { id: 3, nombre: 'Playa Minitas', municipio: 'La Romana', zona: 'La Romana', latitud: 18.4042, longitud: -68.9197 }
];

const incidencias = [
  { id: 1, playaId: 1, severidad: 'critico', cantidadEstimada: 'alta',
    descripcion: 'Orilla cubierta por completo', estado: 'pendiente',
    fecha: '2026-11-01' },
  { id: 2, playaId: 2, severidad: 'bajo', cantidadEstimada: 'baja',
    descripcion: 'Algunas manchas en la orilla', estado: 'pendiente',
    fecha: '2026-11-02' }
];

const acciones = [
  { id: 1, incidenciaId: 1, equipo: 'Equipo de limpieza La Romana',
    descripcion: 'Retiro de sargazo con rastrillos', fecha: '2026-11-02' }
];

// Contadores para generar ids nuevos
let siguientePlayaId = 4;
let siguienteIncidenciaId = 3;
let siguienteAccionId = 2;

const SEVERIDADES = ['bajo', 'moderado', 'critico'];
const ESTADOS = ['pendiente', 'en_proceso', 'resuelta'];
const CANTIDADES = ['baja', 'media', 'alta'];

// Validaciones: devuelven un texto con el error, o null si todo esta bien
function validarPlaya(datos) {
  if (!datos.nombre || typeof datos.nombre !== 'string' || datos.nombre.trim() === '') {
    return 'El campo "nombre" es obligatorio y debe ser texto';
  }
  if (!datos.municipio || typeof datos.municipio !== 'string' || datos.municipio.trim() === '') {
    return 'El campo "municipio" es obligatorio y debe ser texto';
  }
  if (!datos.zona || typeof datos.zona !== 'string' || datos.zona.trim() === '') {
    return 'El campo "zona" es obligatorio y debe ser texto';
  }
  if (datos.latitud === undefined || typeof datos.latitud !== 'number') {
    return 'El campo "latitud" es obligatorio y debe ser un número decimal';
  }
  if (datos.longitud === undefined || typeof datos.longitud !== 'number') {
    return 'El campo "longitud" es obligatorio y debe ser un número decimal';
  }
  return null;
}

function validarIncidencia(datos) {
  if (!Number.isInteger(datos.playaId) || !playas.some(p => p.id === datos.playaId)) {
    return 'El campo "playaId" es obligatorio y debe ser el id de una playa existente';
  }
  if (!SEVERIDADES.includes(datos.severidad)) {
    return `El campo "severidad" debe ser uno de: ${SEVERIDADES.join(', ')}`;
  }
  if (!CANTIDADES.includes(datos.cantidadEstimada)) {
    return `El campo "cantidadEstimada" debe ser uno de: ${CANTIDADES.join(', ')}`;
  }
  if (!datos.descripcion || typeof datos.descripcion !== 'string' || datos.descripcion.trim().length < 5) {
    return 'El campo "descripcion" es obligatorio (minimo 5 caracteres)';
  }
  return null;
}

function validarAccion(datos) {
  if (!Number.isInteger(datos.incidenciaId) || !incidencias.some(i => i.id === datos.incidenciaId)) {
    return 'El campo "incidenciaId" es obligatorio y debe ser el id de una incidencia existente';
  }
  if (!datos.equipo || typeof datos.equipo !== 'string' || datos.equipo.trim() === '') {
    return 'El campo "equipo" es obligatorio';
  }
  if (!datos.descripcion || typeof datos.descripcion !== 'string' || datos.descripcion.trim().length < 5) {
    return 'El campo "descripcion" es obligatorio (minimo 5 caracteres)';
  }
  return null;
}

// GET: todas las playas
app.get('/api/playas', (req, res) => {
  let resultado = playas;
  if (req.query.zona) {
    resultado = resultado.filter(p => p.zona === req.query.zona);
  }
  res.status(200).json(playas);
});

// GET: una playa por id
app.get('/api/playas/:id', (req, res) => {
  const playa = playas.find(p => p.id === Number(req.params.id));
  if (!playa) {
    return res.status(404).json({ error: 'Playa no encontrada' });
  }
  res.status(200).json(playa);
});

// GET: incidencias, con filtro opcional por severidad
app.get('/api/incidencias', (req, res) => {
const { severidad, fecha, zona } = req.query;
  let resultado = incidencias;

  if (severidad) resultado = resultado.filter(i => i.severidad === severidad);
  if (fecha)     resultado = resultado.filter(i => i.fecha === fecha);
  if (zona) {
    resultado = resultado.filter(i => {
      const playa = playas.find(p => p.id === i.playaId);
      return playa && playa.zona === zona;
    });
  }
  res.status(200).json(resultado);
});

// GET: una incidencia por id
app.get('/api/incidencias/:id', (req, res) => {
  const incidencia = incidencias.find(i => i.id === Number(req.params.id));
  if (!incidencia) {
    return res.status(404).json({ error: 'Incidencia no encontrada' });
  }
  res.status(200).json(incidencia);
});

// ---------- PLAYAS ----------
app.post('/api/playas', (req, res) => {
  const error = validarPlaya(req.body);
  if (error) return res.status(400).json({ error });

  const nueva = {
    id: siguientePlayaId++,
    nombre: req.body.nombre.trim(),
    municipio: req.body.municipio.trim(),
    zona: req.body.zona.trim(),
    latitud: req.body.latitud,
    longitud: req.body.longitud
  };
  playas.push(nueva);
  res.status(201).json(nueva);
});

// ---------- INCIDENCIAS ----------
app.post('/api/incidencias', (req, res) => {
  const error = validarIncidencia(req.body);
  if (error) return res.status(400).json({ error });

  const nueva = {
    id: siguienteIncidenciaId++,
    playaId: req.body.playaId,
    severidad: req.body.severidad,
    cantidadEstimada: req.body.cantidadEstimada,
    descripcion: req.body.descripcion.trim(),
    estado: 'pendiente',
    fecha: new Date().toISOString().slice(0, 10)
  };
  incidencias.push(nueva);
  res.status(201).json(nueva);
});

app.patch('/api/incidencias/:id', (req, res) => {
  const incidencia = incidencias.find(i => i.id === Number(req.params.id));
  if (!incidencia) {
    return res.status(404).json({ error: 'Incidencia no encontrada' });
  }

  const { severidad, estado } = req.body;
  if (severidad === undefined && estado === undefined) {
    return res.status(400).json({ error: 'Envia al menos "severidad" o "estado"' });
  }
  if (severidad !== undefined && !SEVERIDADES.includes(severidad)) {
    return res.status(400).json({ error: `"severidad" debe ser uno de: ${SEVERIDADES.join(', ')}` });
  }
  if (estado !== undefined && !ESTADOS.includes(estado)) {
    return res.status(400).json({ error: `"estado" debe ser uno de: ${ESTADOS.join(', ')}` });
  }

  if (severidad !== undefined) incidencia.severidad = severidad;
  if (estado !== undefined) incidencia.estado = estado;
  res.status(200).json(incidencia);
});

app.delete('/api/incidencias/:id', (req, res) => {
  const indice = incidencias.findIndex(i => i.id === Number(req.params.id));
  if (indice === -1) {
    return res.status(404).json({ error: 'Incidencia no encontrada' });
  }
  incidencias.splice(indice, 1);
  res.status(204).send();
});

// ---------- ACCIONES ----------
app.get('/api/incidencias/:id/acciones', (req, res) => {
  const idIncidencia = Number(req.params.id);
  const accionesFiltradas = acciones.filter(a => a.incidenciaId === idIncidencia);
  res.status(200).json(accionesFiltradas);
});

app.post('/api/acciones', (req, res) => {
  const error = validarAccion(req.body);
  if (error) return res.status(400).json({ error });

  const nueva = {
    id: siguienteAccionId++,
    incidenciaId: req.body.incidenciaId,
    equipo: req.body.equipo.trim(),
    descripcion: req.body.descripcion.trim(),
    fecha: new Date().toISOString().slice(0, 10)
  };
  acciones.push(nueva);
  res.status(201).json(nueva);
});

app.post('/api/incidencias/:id/acciones', (req, res) => {
  const datos = { ...req.body, incidenciaId: Number(req.params.id) };
  const error = validarAccion(datos);
  if (error) return res.status(400).json({ error });

  const nueva = {
    id: siguienteAccionId++,
    incidenciaId: datos.incidenciaId,
    equipo: datos.equipo.trim(),
    descripcion: datos.descripcion.trim(),
    fecha: new Date().toISOString().slice(0, 10)
  };
  acciones.push(nueva);
  res.status(201).json(nueva);
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: `La ruta ${req.method} ${req.originalUrl} no existe` });
});

// Errores inesperados (incluye JSON mal escrito en el body)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El JSON enviado es invalido' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API SargazoRD corriendo en http://localhost:${PORT}`);
});