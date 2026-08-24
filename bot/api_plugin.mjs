import { createServer } from 'node:http';

export function startApi(cervell, port = 3000) {
  const server = createServer(async (req, res) => {
    // CORS headers for Solutia's frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    if (req.method === 'POST' && req.url === '/api/pregunta') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          const { question, context } = JSON.parse(body);
          if (!question) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'La pregunta és obligatòria' }));
          }

          // Use cervell to answer (acting as a basic query endpoint)
          const answer = await cervell.pensa(question, { 
            sessionKey: 'web-public',
            memoryKey: null,
            adicional: context || 'Consulta des de la web pública (Solutia)'
          });

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ resposta: answer }));
        } catch (error) {
          console.error('[API] Error processant petició:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Error intern del cervell' }));
        }
      });
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Ruta no trobada' }));
  });

  server.listen(port, '127.0.0.1', () => {
    console.log(`[PLUGIN API] Servidor connectable actiu al port ${port}. Llest per a Solutia.`);
  });

  return server;
}
