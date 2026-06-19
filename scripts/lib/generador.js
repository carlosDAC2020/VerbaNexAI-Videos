/**
 * VerbaNexAI Lab — Lógica compartida para crear presentaciones
 * ─────────────────────────────────────────────────────
 * Usada por scripts/crear-presentacion.js (CLI) y server.js (interfaz web).
 *
 * Sin dependencias externas — solo Node.js built-in.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const PLANTILLAS = path.join(ROOT, '_plantillas');

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function tituloDesdeSlug(slug) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function leerPlantilla(nombre) {
  return fs.readFileSync(path.join(PLANTILLAS, nombre), 'utf8');
}

function reemplazar(contenido, datos) {
  return contenido
    .replace(/\{\{TITULO\}\}/g, datos.titulo)
    .replace(/\{\{SLUG\}\}/g, datos.slug)
    .replace(/\{\{FECHA\}\}/g, datos.fecha);
}

/**
 * Crea la carpeta <slug>/ con presentacion.html, guion.md y README.md.
 * Lanza un Error con mensaje en español si el slug o el destino no son válidos.
 */
function crearPresentacion(slug, tituloArg) {
  slug = (slug || '').trim();

  if (!SLUG_RE.test(slug)) {
    throw new Error(`"${slug}" no es válido. Usa minúsculas, números y guiones (ej: chain-of-thought).`);
  }

  const destino = path.join(ROOT, slug);
  if (fs.existsSync(destino)) {
    throw new Error(`La carpeta "${slug}" ya existe.`);
  }

  const titulo = (tituloArg || '').trim() || tituloDesdeSlug(slug);
  const fecha = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const datos = { slug, titulo, fecha };

  fs.mkdirSync(destino);

  // presentacion.html — copia de la plantilla base con el <title> actualizado
  const html = leerPlantilla('plantilla-base.html')
    .replace('<title>Título del Video — VerbaNexAI Lab</title>', `<title>${titulo} — VerbaNexAI Lab</title>`);
  fs.writeFileSync(path.join(destino, 'presentacion.html'), html);

  // README.md y guion.md — copias de las plantillas con los placeholders resueltos
  fs.writeFileSync(path.join(destino, 'README.md'), reemplazar(leerPlantilla('plantilla-README.md'), datos));
  fs.writeFileSync(path.join(destino, 'guion.md'), reemplazar(leerPlantilla('plantilla-guion.md'), datos));

  return { slug, titulo, destino };
}

module.exports = { crearPresentacion, tituloDesdeSlug, SLUG_RE, ROOT };
