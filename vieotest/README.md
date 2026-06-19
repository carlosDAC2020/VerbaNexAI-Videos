# Vieotest

> 📌 **Estado:** en preparación — completa este README a medida que avances.

Presentación interactiva de **VerbaNexAI Lab** sobre _Vieotest_.

---

## Estructura de la presentación

Este video está basado en `_plantillas/plantilla-base.html` y contiene 8 slides:

| # | Slide | Qué editar |
|---|-------|------------|
| 1 | Portada | Título, subtítulo, tags y autor |
| 2 | Tabla de contenido | Tarjetas con los temas del video |
| 3 | Introducción | Texto + imagen circular |
| 4 | Contenido + imagen lateral | Texto principal y recurso visual |
| 5 | Diagrama / flujo | Pasos del proceso o arquitectura |
| 6 | Comparación (✗ vs ✓) | Dos columnas contrastando enfoques |
| 7 | Tabla de datos | Resultados, métricas o referencias |
| 8 | Cierre / resumen | Puntos clave y llamada a la acción |

Busca los comentarios `✏️` dentro de `presentacion.html` — marcan exactamente qué cambiar en cada slide.

---

## Flujo de trabajo

1. **Edita `presentacion.html`** — completa cada slide siguiendo los comentarios `✏️` de la plantilla.
2. **Escribe el guion en `guion.md`** — ya viene con la estructura de las 8 slides, solo rellena el contenido.
3. **Levanta el servidor** desde la raíz del proyecto:
   ```bash
   npm start
   ```
4. **Abre la presentación**: http://localhost:3000/vieotest/
5. **Graba** con el botón ⏺ Grabar integrado (elige el modo según si vas a mostrar demos externas).
6. Las grabaciones se guardan automáticamente en `vieotest/media/` (excluida de git).

---

## Checklist

- [ ] Slide 1 — título, subtítulo, tags y autor actualizados
- [ ] Slide 2 — tabla de contenido refleja las secciones reales
- [ ] Slides 3–8 — contenido propio (sin texto de plantilla)
- [ ] `guion.md` completo
- [ ] Grabación realizada y revisada
- [ ] Entrada agregada a la tabla de **Presentaciones** del [README principal](../README.md)

---

## Referencias

> Agrega aquí los recursos, papers o enlaces usados para esta presentación.

---

_Generado el 13 de junio de 2026 con `node scripts/crear-presentacion.js`._
