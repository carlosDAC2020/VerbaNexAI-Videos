/**
 * VerbaNexAI Lab — Generador de nuevas presentaciones (CLI)
 * ─────────────────────────────────────────────────────
 * Crea la carpeta <slug>/ con:
 *   - presentacion.html  (copia de _plantillas/plantilla-base.html, con el título ya puesto)
 *   - guion.md           (copia de _plantillas/plantilla-guion.md)
 *   - README.md          (copia de _plantillas/plantilla-README.md)
 *
 * También disponible desde la interfaz web (botón "+ Nueva presentación" en http://localhost:3000).
 *
 * Sin dependencias externas — solo Node.js built-in.
 *
 * Uso:
 *   node scripts/crear-presentacion.js
 *   node scripts/crear-presentacion.js chain-of-thought "Chain of Thought Prompting"
 *   npm run nueva
 */

const readline = require('readline');
const { crearPresentacion, tituloDesdeSlug, SLUG_RE } = require('./lib/generador');

function ask(rl, pregunta) {
  return new Promise(resolve => rl.question(pregunta, resolve));
}

async function main() {
  const [, , slugArg, tituloArg] = process.argv;

  let rl;
  if (!slugArg) {
    rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  }

  let slug = slugArg;
  if (!slug) {
    while (true) {
      slug = (await ask(rl, '\nNombre de la carpeta (kebab-case, ej: chain-of-thought): ')).trim();
      if (SLUG_RE.test(slug)) break;
      console.log('  ✗ Usa solo minúsculas, números y guiones, sin espacios ni acentos.');
    }
  } else if (!SLUG_RE.test(slug)) {
    console.error(`✗ "${slug}" no es válido. Usa kebab-case (ej: chain-of-thought).`);
    process.exit(1);
  }

  let titulo = tituloArg;
  if (!titulo) {
    const sugerido = tituloDesdeSlug(slug);
    if (rl) {
      const respuesta = (await ask(rl, `Título de la presentación [${sugerido}]: `)).trim();
      titulo = respuesta || sugerido;
    } else {
      titulo = sugerido;
    }
  }

  if (rl) rl.close();

  let resultado;
  try {
    resultado = crearPresentacion(slug, titulo);
  } catch (err) {
    console.error(`✗ ${err.message}`);
    process.exit(1);
  }

  console.log('\n════════════════════════════════════════');
  console.log('  ✓  Presentación creada');
  console.log('════════════════════════════════════════');
  console.log(`  Carpeta   →  ${resultado.slug}/`);
  console.log(`  Título    →  ${resultado.titulo}`);
  console.log('');
  console.log('  Archivos generados:');
  console.log(`    ${resultado.slug}/presentacion.html`);
  console.log(`    ${resultado.slug}/guion.md`);
  console.log(`    ${resultado.slug}/README.md`);
  console.log('');
  console.log('  Próximos pasos:');
  console.log('    1. Edita presentacion.html (busca los comentarios ✏️)');
  console.log('    2. Escribe el guion en guion.md');
  console.log('    3. node server.js   (o npm start)');
  console.log(`    4. Abre http://localhost:3000/${resultado.slug}/`);
  console.log('');
}

main();
