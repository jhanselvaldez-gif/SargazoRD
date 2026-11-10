# SargazoRD API REST

## 1. Descripción del proyecto

SargazoRD es un proyecto orientado al reporte, seguimiento y gestión de incidencias relacionadas con la presencia de sargazo en las playas. Su propósito es facilitar el registro de reportes, la consulta de información y el seguimiento de las intervenciones realizadas para atender estas situaciones.

Esta API REST funciona como el componente encargado de gestionar los datos del sistema y permitir que, posteriormente, la plataforma web pueda conectarse para consultar y registrar información.

La API está desarrollada utilizando Node.js y Express, y trabaja con respuestas en formato JSON.

## 2. Objetivos de la API

- Registrar y consultar información de las playas.
- Registrar incidencias relacionadas con la presencia de sargazo.
- Consultar incidencias mediante diferentes filtros.
- Actualizar el estado y la severidad de los reportes.
- Eliminar reportes duplicados o registrados incorrectamente.
- Registrar y consultar las acciones realizadas por los equipos de intervención.
- Facilitar la futura conexión con la interfaz web y el mapa de incidencias.

## 3. Tecnologías utilizadas

- **Node.js:** entorno de ejecución de JavaScript.
- **Express:** framework utilizado para desarrollar la API REST.
- **JavaScript:** lenguaje de programación.
- **JSON:** formato utilizado para recibir y enviar información.
- **Postman o Thunder Client:** herramientas para realizar pruebas de los endpoints.

## 4. Recursos principales

La API contempla tres recursos relacionados con el funcionamiento del sistema:

### 4.1 Playas

Contiene la información de las playas que forman parte del proyecto.

Cada playa contempla los siguientes campos:

| Campo | Descripción |
|---|---|
| id | Identificador único de la playa. |
| nombre | Nombre de la playa. |
| zona | Zona geográfica a la que pertenece. |
| municipio | Municipio donde se encuentra. |
| latitud | Coordenada geográfica de latitud. |
| longitud | Coordenada geográfica de longitud. |

Las zonas consideradas para los datos de ejemplo son La Romana, Bayahíbe y Punta Cana. Los nombres y ubicaciones definitivos de las playas deberán verificarse con fuentes confiables.

### 4.2 Incidencias

Representa los reportes relacionados con la presencia de sargazo en las playas.

| Campo | Descripción |
|---|---|
| id | Identificador único de la incidencia. |
| playaId | Identificador de la playa relacionada. |
| severidad | Nivel de gravedad de la incidencia. |
| cantidadEstimada | Cantidad estimada de sargazo. |
| descripcion | Detalles del reporte. |
| estado | Situación actual de la incidencia. |
| fecha | Fecha de registro de la incidencia. |

**Niveles de severidad:**

- Bajo.
- Moderado.
- Crítico.

**Estados de las incidencias:**

- Pendiente.
- En proceso.
- Resuelta.

### 4.3 Acciones

Representa las intervenciones realizadas para atender una incidencia.

| Campo | Descripción |
|---|---|
| id | Identificador único de la acción. |
| incidenciaId | Identificador de la incidencia relacionada. |
| equipo | Nombre del equipo responsable de la intervención. |
| descripcion | Descripción de las actividades realizadas. |
| fecha | Fecha en que se registró la intervención. |

Las acciones están relacionadas directamente con una incidencia y permiten consultar el historial de intervenciones realizadas.

## 5. Endpoints de la API

La API contempla un total de 9 endpoints para gestionar los recursos del sistema.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/playas` | Listar playas y filtrar por zona. |
| GET | `/api/playas/:id` | Consultar una playa específica. |
| GET | `/api/incidencias` | Listar incidencias aplicando filtros. |
| GET | `/api/incidencias/:id` | Consultar una incidencia específica. |
| POST | `/api/incidencias` | Registrar una nueva incidencia. |
| PATCH | `/api/incidencias/:id` | Actualizar el estado o la severidad. |
| DELETE | `/api/incidencias/:id` | Eliminar un reporte duplicado o erróneo. |
| GET | `/api/incidencias/:id/acciones` | Consultar el historial de acciones de una incidencia. |
| POST | `/api/incidencias/:id/acciones` | Registrar una intervención para una incidencia. |

### 5.1 Consulta de playas

**GET `/api/playas`**

Permite consultar las playas registradas.

También contempla la posibilidad de filtrar por zona.

Ejemplo:

`GET /api/playas?zona=La Romana`

**GET `/api/playas/:id`**

Permite consultar los detalles de una playa utilizando su identificador.

Ejemplo:

`GET /api/playas/1`

### 5.2 Consulta y gestión de incidencias

**GET `/api/incidencias`**

Permite consultar las incidencias registradas y aplicar filtros.

Los filtros contemplados son:

- Severidad.
- Fecha.
- Zona.

Ejemplos:

`GET /api/incidencias?severidad=critico`

`GET /api/incidencias?zona=La Romana`

`GET /api/incidencias?fecha=2026-11-05`

**GET `/api/incidencias/:id`**

Permite consultar los detalles de una incidencia específica.

Ejemplo:

`GET /api/incidencias/1`

**POST `/api/incidencias`**

Permite registrar una nueva incidencia.

Ejemplo de solicitud:

```json
{
  "playaId": 1,
  "severidad": "moderado",
  "cantidadEstimada": "media",
  "descripcion": "Presencia considerable de sargazo en la orilla."
}
```

**PATCH `/api/incidencias/:id`**

Permite modificar el estado o la severidad de una incidencia existente.

Ejemplo de solicitud:

```json
{
  "estado": "en_proceso",
  "severidad": "critico"
}
```

**DELETE `/api/incidencias/:id`**

Permite eliminar una incidencia registrada incorrectamente o que represente un reporte duplicado.

Ejemplo:

`DELETE /api/incidencias/1`

### 5.3 Gestión de acciones

**GET `/api/incidencias/:id/acciones`**

Permite consultar el historial de intervenciones relacionadas con una incidencia.

Ejemplo:

`GET /api/incidencias/1/acciones`

**POST `/api/incidencias/:id/acciones`**

Permite registrar una intervención realizada para atender una incidencia.

Ejemplo de solicitud:

```json
{
  "equipo": "Equipo de limpieza",
  "descripcion": "Se realizó una jornada de recolección de sargazo."
}
```

La fecha y la relación con la incidencia corresponden al registro de la acción.

## 6. Ejemplo de respuesta JSON

Al consultar una incidencia, la API puede devolver una respuesta con la siguiente estructura:

```json
{
  "id": 1,
  "playaId": 1,
  "severidad": "moderado",
  "cantidadEstimada": "media",
  "descripcion": "Presencia considerable de sargazo en la orilla.",
  "estado": "pendiente",
  "fecha": "2026-11-05"
}
```

Este ejemplo representa la estructura de información utilizada para una incidencia.

## 7. Validaciones de datos

La API contempla validaciones básicas para evitar registros incompletos o incorrectos.

Entre las validaciones consideradas se encuentran:

- Verificar que los campos obligatorios estén presentes.
- Comprobar que los identificadores correspondan a recursos existentes.
- Verificar que la severidad sea Bajo, Moderado o Crítico.
- Comprobar que la cantidad estimada corresponda a los valores permitidos.
- Evitar descripciones vacías o demasiado cortas.
- Verificar que el estado de una incidencia corresponda a uno de los estados permitidos.
- Comprobar que las acciones estén relacionadas con una incidencia existente.

## 8. Códigos de respuesta HTTP

La API utiliza códigos HTTP para indicar el resultado de las solicitudes.

| Código | Significado | Uso |
|---|---|---|
| 200 | OK | Consulta o actualización realizada correctamente. |
| 201 | Created | Registro creado correctamente. |
| 204 | No Content | Eliminación realizada correctamente, sin contenido de respuesta. |
| 400 | Bad Request | Datos inválidos o solicitud incorrecta. |
| 404 | Not Found | Recurso no encontrado. |
| 500 | Internal Server Error | Error interno del servidor. |

## 9. Ubicación geográfica y mapa

Para facilitar la representación geográfica de las playas y las incidencias, se contempla incorporar las coordenadas de latitud y longitud a los registros de las playas.

Estos datos permitirán que la plataforma web pueda identificar la ubicación de cada playa y posteriormente representar las incidencias mediante marcadores en un mapa.

Para la implementación del mapa se consideran dos alternativas:

**Google Maps embebido:**

Permite insertar un mapa directamente en la página mediante un iframe. Se puede obtener desde Google Maps utilizando la opción Compartir → Insertar un mapa.

El iframe debe incluir un título descriptivo y `loading="lazy"` para mejorar la accesibilidad y el rendimiento.

**Leaflet con OpenStreetMap:**

Permite crear un mapa interactivo y agregar marcadores dinámicos utilizando las coordenadas obtenidas desde la API. No requiere una clave de Google Maps.

Para la futura conexión de la interfaz se considera esta segunda alternativa, ya que permite representar las incidencias registradas en el sistema.

Se debe tener en cuenta que los mapas externos requieren conexión a internet y pueden consumir datos adicionales. Por eso, se contempla ofrecer una alternativa mediante enlaces para consultar las ubicaciones en Google Maps.

## 10. Instalación y ejecución

Para ejecutar el proyecto se necesita tener instalado Node.js.

**Paso 1.** Descargar o clonar el proyecto.

**Paso 2.** Abrir la carpeta del proyecto desde Visual Studio Code.

**Paso 3.** Instalar las dependencias:

npm install

**Paso 4.** Ejecutar el servidor:

node server.js

La API utiliza el puerto 3000 como puerto de referencia.

Una vez iniciado el servidor, se puede comprobar su funcionamiento desde el navegador o una herramienta de pruebas mediante:

`http://localhost:3000`

## 11. Pruebas de la API

Los endpoints deben probarse utilizando Postman o Thunder Client.

Durante las pruebas se deben verificar:

- Consultas de playas e incidencias.
- Aplicación de filtros.
- Registro de nuevas incidencias.
- Actualización de estados y severidades.
- Eliminación de incidencias.
- Consulta del historial de acciones.
- Registro de nuevas intervenciones.
- Respuestas ante identificadores inexistentes.
- Respuestas ante datos inválidos.

Las evidencias de estas pruebas se incluirán en el PDF de entrega del proyecto.

## 12. Estructura del proyecto

La estructura actual del proyecto es la siguiente:

```text
SARGAZORDAPI/
│
├── server.js
├── package.json
├── package-lock.json
├── README.md
├── evidencias.pdf
└── SargazoRD_API_Entrega.pdf
```

## 13. Consideraciones del proyecto

La API está diseñada para funcionar como componente independiente de la interfaz web, permitiendo que ambas partes puedan conectarse posteriormente.

La información de las playas, incidencias y acciones debe mantenerse relacionada mediante sus respectivos identificadores.

La incorporación de coordenadas permitirá ampliar las funcionalidades del sistema mediante la visualización geográfica de las playas y los reportes.

El proyecto contempla el manejo de reportes duplicados, la consulta de información por filtros y el seguimiento de las intervenciones realizadas.

## 14. Entrega del proyecto

De acuerdo con los requisitos del hito final, la entrega debe incluir:

- Proyecto completo comprimido.
- Código fuente de la API REST.
- Archivo README.md con la documentación.
- PDF breve con la tabla de endpoints.
- Ejemplos de solicitudes y respuestas.
- Evidencias de las pruebas realizadas.

El objetivo es disponer de una API REST funcional, documentada y coherente con el proyecto integrador SargazoRD, preparada para conectarse posteriormente con la interfaz web.