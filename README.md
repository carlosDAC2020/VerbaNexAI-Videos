# VerbaNexAI Lab — Presentaciones

Presentaciones interactivas sobre Inteligencia Artificial con grabación de pantalla integrada.

---

## Requisitos

- [Node.js](https://nodejs.org/) v16 o superior
- Sin dependencias externas — el servidor usa solo módulos nativos de Node

---

## Instalación

```bash
# Clonar o descargar el repositorio
git clone <url-del-repo>
cd VerbaNexAI-Videos
```

No se requiere `npm install`. El servidor no tiene dependencias externas.

---

## Arranque

**Windows** — doble clic en `iniciar.bat`

**Terminal:**
```bash
node server.js
# o equivalente:
npm start
```

Luego abrir **http://localhost:3000** en Chrome.

El índice muestra todas las presentaciones disponibles automáticamente.

---

## Estructura del proyecto

```
VerbaNexAI-Videos/
├── server.js                  # Servidor central (único para todo el proyecto)
├── iniciar.bat                # Lanzador rápido — Windows
├── nueva-presentacion.bat     # Crear una nueva presentación — Windows
├── package.json               # Metadatos del proyecto
├── .gitignore
├── README.md
│
├── scripts/
│   ├── crear-presentacion.js  # Generador de presentaciones nuevas (CLI)
│   └── lib/
│       └── generador.js       # Lógica compartida (usada también por server.js)
│
├── react-prompting/           # Presentación: Prompting ReAct
│   ├── presentacion.html
│   ├── guion.md
│   ├── README.md
│   └── media/                 # Grabaciones (creada automáticamente)
│
└── _plantillas/               # Plantillas para nuevas presentaciones
    ├── plantilla-base.html    # Estructura HTML de las 8 slides
    ├── plantilla-README.md    # README inicial de cada presentación
    └── plantilla-guion.md     # Guion inicial de cada presentación
```

> Las carpetas `media/` se crean automáticamente al guardar la primera grabación y están excluidas del control de versiones (`.gitignore`).

---

## Crear una nueva presentación

### Opción A — Desde la web (recomendado)

Con el servidor corriendo (`npm start`), abre **http://localhost:3000** y haz clic en la tarjeta **➕ Nueva presentación**. Escribe el nombre de la carpeta (se convierte a kebab-case automáticamente) y, si quieres, un título; el resto se genera igual que con el generador por consola.

### Opción B — Generador automático (consola)

```bash
npm run nueva
```

El script pregunta el nombre de la carpeta (kebab-case, ej: `chain-of-thought`) y el título del video, y genera todo lo necesario:

```
<nombre-carpeta>/
├── presentacion.html   # Copia de _plantillas/plantilla-base.html con el título ya puesto
├── guion.md             # Plantilla de guion con las 8 slides
└── README.md            # Checklist y flujo de trabajo para esta presentación
```

También puedes pasar los datos directamente, sin modo interactivo:

```bash
node scripts/crear-presentacion.js chain-of-thought "Chain of Thought Prompting"
```

**Windows:** doble clic en `nueva-presentacion.bat`.

### Opción C — Manual

1. Crea una carpeta con el nombre en kebab-case (ej: `chain-of-thought`)
2. Copia `_plantillas/plantilla-base.html` dentro como `presentacion.html`
3. Arranca el servidor: el índice la detecta y la muestra sola

En ambos casos, la grabación se guarda automáticamente en `<nombre-carpeta>/media/` sin configuración extra. Cuando termines, agrega una fila a la tabla de **Presentaciones** más abajo.

---

## Metodología de trabajo

Una vez generada la carpeta de la presentación (con cualquiera de las opciones anteriores), todo el trabajo de contenido se hace editando directamente el `presentacion.html` de esa carpeta — no hace falta tocar `server.js` ni el resto del proyecto.

Para esto se recomienda apoyarse en asistentes de código como **Claude Code**, **Gemini CLI** u otras herramientas similares, pidiéndoles que escriban o modifiquen el HTML/CSS/JS de la presentación: redactar el contenido de cada slide, sumar animaciones o transiciones, incrustar imágenes, ajustar el diseño, etc. Al venir de `_plantillas/plantilla-base.html`, todas las presentaciones parten de la misma base, así que hay total libertad para añadir lo que el HTML, CSS y JS permitan dentro de esa estructura.

**Se puede cambiar libremente:**
- Textos, títulos, datos e imágenes de las 8 slides
- Animaciones, transiciones y efectos (`@keyframes`, `transition`, `transform`, etc.)
- Estilos adicionales (colores, espaciados, layout) siempre dentro de la paleta oficial
- Slides nuevas o reordenadas, mientras sigan el patrón `.slide` / `.slide-header` / `.slide-body` / `.footer` de la plantilla

**No se debe tocar:**
- El bloque de grabación: `#rec-wrap`, `#rec-modal`, `#rec-toast` y el `<script>` de grabación (`getDisplayMedia`, `MediaRecorder`, `saveRec`, etc.)
- Los controles de navegación del menú: `#controls` (Inicio, Anterior, Siguiente, Pantalla completa) y su lógica (`navigate()`, `toggleFullscreen()`)
- La estructura base heredada de la plantilla (ids `#viewer`, `#stage`, clases `.slide`, `.footer`, `.slide-header`) que mantiene la grabación y el menú funcionando igual en todas las presentaciones

En resumen: contenido y estética son terreno libre para crear y experimentar con ayuda de IA; grabación y menú son la base común del proyecto y deben quedar intactos en cada presentación.

---

## Grabación de pantalla

Cada presentación tiene un botón **⏺ Grabar** integrado.

| Modo | Cuándo usarlo |
|------|--------------|
| 📑 Solo esta pestaña | Presentación sin demos externas |
| 🪟 Ventana del navegador | Presentación + demos en Claude u otras pestañas ✦ Recomendado |
| 🖥️ Pantalla completa | Si usas apps fuera del navegador |

**Tip:** activa la opción *"Entrar en pantalla completa antes de grabar"* del modal para ocultar la barra y las pestañas del navegador sin necesidad de F11.

---

## Presentaciones

| Carpeta | Tema |
|---------|------|
| `react-prompting` | Prompting ReAct — Reasoning + Acting in Language Models |

---

## Tecnologías

- HTML / CSS / JavaScript — sin frameworks
- Node.js (built-in `http`, `fs`, `path`) — sin dependencias npm
- Screen Capture API + MediaRecorder API — grabación nativa del navegador
- Font Awesome 6 · Google Fonts (Inter, JetBrains Mono)
