// Local static server. ES modules do not load from file://, so open the page through this instead.
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));
const PORT = Number(process.env.PORT) || 5173;

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = createServer(async (request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const relativePath = requestPath.endsWith('/') ? `${requestPath}index.html` : requestPath;
  const filePath = resolve(PROJECT_ROOT, `.${relativePath}`);

  if (!filePath.startsWith(resolve(PROJECT_ROOT) + sep)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': CONTENT_TYPES[extname(filePath)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Abre http://localhost:${PORT} en tu navegador (Ctrl+C para detener).`);
});
