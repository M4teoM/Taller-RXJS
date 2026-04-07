// Modulos nativos de Node para levantar un servidor estatico simple.
const http = require("http");
const fs = require("fs");
const path = require("path");

// Host y puerto donde se sirve la demo.
const host = "127.0.0.1";
const port = Number(process.env.PORT || 5174);
const baseDir = __dirname;

// Mapa basico de tipos MIME para responder con headers correctos.
const mimeByExt = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

// Servidor HTTP: resuelve ruta pedida, valida seguridad y entrega archivo.
const server = http.createServer((req, res) => {
  // Si entran a "/", devolvemos index.html por defecto.
  const requestPath = req.url === "/" ? "/index.html" : req.url;

  // Normaliza la ruta para evitar traversal con ../
  const safePath = path.normalize(requestPath).replace(/^([.][.][/\\])+/, "");
  const filePath = path.join(baseDir, safePath);

  // Corta acceso si alguien intenta salir de la carpeta social.
  if (!filePath.startsWith(baseDir)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Acceso denegado");
    return;
  }

  // Lee el archivo solicitado y responde contenido o 404.
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("No encontrado");
      return;
    }

    // Detecta tipo de contenido por extension para que el navegador lo procese bien.
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeByExt[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

// Inicia la app y deja visible la URL final.
server.listen(port, host, () => {
  console.log(`Social RX disponible en http://${host}:${port}`);
});
