/**
 * VerbaNexAI Lab — Servidor central de presentaciones
 * ─────────────────────────────────────────────────────
 * • Sirve todas las presentaciones en subdirectorios
 * • Guarda grabaciones en <carpeta>/media/ automáticamente
 * • Índice visual en http://localhost:3000
 *
 * Sin dependencias externas — solo Node.js built-in.
 * Uso: node server.js   (o doble clic en iniciar.bat)
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');
const { crearPresentacion } = require('./scripts/lib/generador');

const PORT = 3000;
const ROOT = __dirname;

// ── Utilidades ────────────────────────────────────────

function ensureMedia(folder) {
  const p = path.join(ROOT, folder, 'media');
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  return p;
}

function listPresentations() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('_') && !d.name.startsWith('.'))
    .map(d => d.name)
    .filter(name => fs.existsSync(path.join(ROOT, name, 'presentacion.html')))
    .sort();
}

function safePath(reqPath) {
  const full = path.join(ROOT, path.normalize(reqPath));
  return full.startsWith(ROOT) ? full : null;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css' : 'text/css',
  '.js'  : 'application/javascript',
  '.json': 'application/json',
  '.webm': 'video/webm',
  '.mp4' : 'video/mp4',
  '.png' : 'image/png',
  '.jpg' : 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg' : 'image/svg+xml',
  '.ico' : 'image/x-icon',
  '.woff2':'font/woff2',
};

// ── Índice HTML ───────────────────────────────────────

function buildIndex() {
  const list = listPresentations();
  const cards = list.length
    ? list.map(p => {
        const label = p.replace(/-/g, ' ');
        // contar grabaciones en media/ si existe
        const mediaDir = path.join(ROOT, p, 'media');
        const count = fs.existsSync(mediaDir)
          ? fs.readdirSync(mediaDir).filter(f => /\.(webm|mp4)$/.test(f)).length
          : 0;
        const badge = count ? `<span class="badge">${count} video${count>1?'s':''}</span>` : '';
        return `
        <a href="/${p}/" class="card">
          <div class="card-top">
            <span class="card-icon">🎞</span>
            ${badge}
          </div>
          <div class="card-name">${label}</div>
          <div class="card-sub">${p}</div>
        </a>`;
      }).join('')
    : '<p class="empty">Aún no hay presentaciones.<br>Crea una carpeta con <code>presentacion.html</code> dentro.</p>';

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VerbaNexAI Lab</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;background:#071E4A;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 20px}
.brand{display:flex;flex-direction:column;align-items:center;gap:6px;margin-bottom:48px}
.brand-name{color:#C9A020;font-size:28px;font-weight:800;letter-spacing:-.02em}
.brand-sub{color:rgba(255,255,255,.4);font-size:13px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;width:100%;max-width:800px}
.card{display:flex;flex-direction:column;gap:6px;background:rgba(255,255,255,.06);border:1px solid rgba(201,160,32,.25);border-radius:12px;padding:20px;text-decoration:none;transition:background .15s,border-color .15s,transform .15s}
.card:hover{background:rgba(201,160,32,.1);border-color:rgba(201,160,32,.55);transform:translateY(-2px)}
.card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
.card-icon{font-size:22px}
.badge{background:rgba(201,160,32,.2);border:1px solid rgba(201,160,32,.4);color:#E5BD4A;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px}
.card-name{color:#fff;font-size:14px;font-weight:600;text-transform:capitalize}
.card-sub{color:rgba(255,255,255,.3);font-size:11px;font-family:monospace}
.empty{color:rgba(255,255,255,.35);font-size:14px;line-height:1.8;text-align:center}
.empty code{background:rgba(255,255,255,.08);padding:2px 7px;border-radius:4px;font-size:12px}
.footer{margin-top:48px;color:rgba(255,255,255,.2);font-size:11px}

/* Tarjeta "Nueva presentación" */
.card-new{background:transparent;border:1px dashed rgba(201,160,32,.4);align-items:center;justify-content:center;text-align:center;cursor:pointer;color:rgba(255,255,255,.55)}
.card-new:hover{background:rgba(201,160,32,.08);border-color:rgba(201,160,32,.7);color:#E5BD4A}
.card-new .card-icon{font-size:26px;margin-bottom:4px}
.card-new .card-name{color:inherit;text-transform:none}

/* Modal — nueva presentación */
.modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.65);align-items:center;justify-content:center;z-index:999;padding:20px}
.modal-overlay.open{display:flex}
.modal-box{background:#0E1E3B;border:1px solid rgba(201,160,32,.35);border-radius:14px;padding:26px 28px;max-width:380px;width:100%;box-shadow:0 10px 40px rgba(0,0,0,.6)}
.modal-box h3{color:#fff;font-size:16px;font-weight:700;margin-bottom:4px}
.modal-sub{color:rgba(255,255,255,.42);font-size:12px;line-height:1.5;margin-bottom:18px}
.field-label{display:block;color:rgba(255,255,255,.45);font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:5px}
.modal-box input{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.15);border-radius:8px;padding:10px 12px;color:#fff;font-family:inherit;font-size:13px;margin-bottom:14px;outline:none}
.modal-box input:focus{border-color:rgba(201,160,32,.6)}
.modal-error{color:#FC8181;font-size:12px;min-height:14px;margin:-6px 0 10px}
.modal-actions{display:flex;gap:10px;margin-top:4px}
.modal-actions button,.modal-actions a{flex:1;text-align:center;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;text-decoration:none;border:none}
.btn-cancel{background:transparent;border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.6)}
.btn-cancel:hover{color:#fff;border-color:rgba(255,255,255,.35)}
.btn-crear{background:#C9A020;color:#071E4A}
.btn-crear:hover{background:#E5BD4A}
.btn-crear:disabled{opacity:.6;cursor:default}
.modal-files{background:rgba(255,255,255,.05);border-radius:8px;padding:10px 12px;margin-bottom:16px;font-family:monospace;font-size:11.5px;color:rgba(255,255,255,.6);line-height:1.7;text-align:left}
.modal-icon-ok{font-size:30px;color:#6FCF97;margin-bottom:8px}
</style>
</head>
<body>
  <div class="brand">
    <div class="brand-name">VerbaNexAI Lab</div>
    <div class="brand-sub">Selecciona una presentación</div>
  </div>
  <div class="grid">
    ${cards}
    <div class="card card-new" onclick="abrirModal()">
      <span class="card-icon">➕</span>
      <div class="card-name">Nueva presentación</div>
    </div>
  </div>
  <div class="footer">http://localhost:${PORT} &nbsp;·&nbsp; node server.js</div>

  <!-- Modal: nueva presentación -->
  <div id="modal" class="modal-overlay">
    <div class="modal-box">
      <div id="modal-form">
        <h3>Nueva presentación</h3>
        <p class="modal-sub">Se genera desde <code>_plantillas/</code>: presentación, guion y README listos para editar.</p>
        <label class="field-label" for="in-slug">Carpeta (kebab-case)</label>
        <input id="in-slug" type="text" placeholder="ej: chain-of-thought" autocomplete="off" spellcheck="false">
        <label class="field-label" for="in-titulo">Título del video (opcional)</label>
        <input id="in-titulo" type="text" placeholder="Se sugiere a partir de la carpeta" autocomplete="off">
        <div class="modal-error" id="modal-err"></div>
        <div class="modal-actions">
          <button class="btn-cancel" onclick="cerrarModal()">Cancelar</button>
          <button class="btn-crear" id="btn-crear" onclick="crearPresentacion()">Crear</button>
        </div>
      </div>
      <div id="modal-ok" style="display:none;text-align:center">
        <div class="modal-icon-ok">✓</div>
        <h3>Presentación creada</h3>
        <p class="modal-sub" id="modal-ok-msg" style="text-align:left"></p>
        <div class="modal-files" id="modal-ok-files"></div>
        <div class="modal-actions">
          <button class="btn-cancel" onclick="location.reload()">Cerrar</button>
          <a class="btn-crear" id="modal-ok-link" target="_blank" rel="noopener">Ver presentación →</a>
        </div>
      </div>
    </div>
  </div>

  <script>
  const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

  function slugify(s) {
    return s.toLowerCase()
      .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function tituloDesdeSlug(slug) {
    return slug.split('-').filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  const inSlug = document.getElementById('in-slug');
  const inTitulo = document.getElementById('in-titulo');

  inSlug.addEventListener('input', () => {
    const s = slugify(inSlug.value);
    inSlug.value = s;
    inTitulo.placeholder = s ? tituloDesdeSlug(s) : 'Se sugiere a partir de la carpeta';
  });

  function abrirModal() {
    document.getElementById('modal-form').style.display = '';
    document.getElementById('modal-ok').style.display = 'none';
    document.getElementById('modal-err').textContent = '';
    inSlug.value = '';
    inTitulo.value = '';
    inTitulo.placeholder = 'Se sugiere a partir de la carpeta';
    document.getElementById('modal').classList.add('open');
    inSlug.focus();
  }

  function cerrarModal() {
    document.getElementById('modal').classList.remove('open');
  }

  document.getElementById('modal').addEventListener('click', e => {
    if (e.target.id === 'modal') cerrarModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarModal();
    if (e.key === 'Enter' && document.getElementById('modal').classList.contains('open')) crearPresentacion();
  });

  async function crearPresentacion() {
    const slug = inSlug.value.trim();
    const titulo = inTitulo.value.trim();
    const err = document.getElementById('modal-err');
    err.textContent = '';

    if (!SLUG_RE.test(slug)) {
      err.textContent = 'Usa minúsculas, números y guiones, sin espacios (ej: chain-of-thought).';
      return;
    }

    const btn = document.getElementById('btn-crear');
    btn.disabled = true;
    btn.textContent = 'Creando…';

    try {
      const resp = await fetch('/crear-presentacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, titulo })
      });
      const data = await resp.json();
      if (!data.ok) {
        err.textContent = data.error || 'No se pudo crear la presentación.';
        btn.disabled = false;
        btn.textContent = 'Crear';
        return;
      }

      document.getElementById('modal-form').style.display = 'none';
      document.getElementById('modal-ok').style.display = '';
      document.getElementById('modal-ok-msg').innerHTML =
        'Carpeta <code>' + data.slug + '/</code> creada con título «' + data.titulo + '».';
      document.getElementById('modal-ok-files').innerHTML =
        data.slug + '/presentacion.html<br>' + data.slug + '/guion.md<br>' + data.slug + '/README.md';
      document.getElementById('modal-ok-link').href = '/' + data.slug + '/';
    } catch (e) {
      err.textContent = 'No se pudo conectar con el servidor.';
      btn.disabled = false;
      btn.textContent = 'Crear';
    }
  }
  </script>
</body>
</html>`;
}

// ── Servidor ──────────────────────────────────────────

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const parsed   = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsed.pathname;

  // ── POST /save-recording?folder=nombre&name=archivo.webm ──
  if (req.method === 'POST' && pathname === '/save-recording') {
    const folder = parsed.searchParams.get('folder') || '';
    const name   = (parsed.searchParams.get('name') || `grabacion-${Date.now()}.webm`)
                     .replace(/[/\\:*?"<>|]/g, '_');

    const folderFull = path.join(ROOT, folder);
    const isValid    = folder
      && !folder.includes('..')
      && folderFull.startsWith(ROOT)
      && fs.existsSync(folderFull);

    if (!isValid) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Carpeta inválida o inexistente: ' + folder }));
      return;
    }

    const mediaDir = ensureMedia(folder);
    const filePath = path.join(mediaDir, name);
    const chunks   = [];

    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      const buf = Buffer.concat(chunks);
      fs.writeFile(filePath, buf, err => {
        if (err) {
          console.error(`✗ Error guardando ${name}:`, err.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        } else {
          const mb = (buf.length / 1024 / 1024).toFixed(1);
          console.log(`✓  ${folder}/media/${name}  (${mb} MB)`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ saved: name, folder, size: buf.length }));
        }
      });
    });

    req.on('error', e => { console.error(e); res.writeHead(500); res.end(); });
    return;
  }

  // ── POST /crear-presentacion  { slug, titulo } ─────────
  if (req.method === 'POST' && pathname === '/crear-presentacion') {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      let body = {};
      try { body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch {}

      try {
        const r = crearPresentacion(body.slug, body.titulo);
        console.log(`✓  Nueva presentación creada: ${r.slug}/`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, slug: r.slug, titulo: r.titulo }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    req.on('error', e => { console.error(e); res.writeHead(500); res.end(); });
    return;
  }

  // ── GET / → índice ────────────────────────────────────
  if (pathname === '/' || pathname === '/index.html') {
    const html = buildIndex();
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  // ── GET archivos estáticos ────────────────────────────
  let filePath = safePath(pathname);
  if (!filePath) { res.writeHead(403); res.end('Forbidden'); return; }

  // Si termina en / intentar presentacion.html
  if (pathname.endsWith('/')) filePath = path.join(filePath, 'presentacion.html');

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found: ' + pathname); return; }
    const ext      = path.extname(filePath).toLowerCase();
    const mimeType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('\n════════════════════════════════════════');
  console.log('  🚀  VerbaNexAI Lab — Servidor activo');
  console.log('════════════════════════════════════════');
  console.log(`  Índice     →  http://localhost:${PORT}`);
  console.log(`  Grabaciones →  <presentacion>/media/`);
  console.log('  Detener    →  Ctrl + C');
  console.log('════════════════════════════════════════');
  const list = listPresentations();
  if (list.length) {
    console.log('\n  Presentaciones detectadas:');
    list.forEach(p => console.log(`    · http://localhost:${PORT}/${p}/`));
  }
  console.log('');
});
