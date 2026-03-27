import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { bearerAuth } from 'hono/bearer-auth';
import { showRoutes } from 'hono/dev'
import { swaggerUI } from '@hono/swagger-ui';
import { apiReference } from '@scalar/hono-api-reference'; // nicer UI than @hono/swagger-ui
import { OpenAPIHono } from '@hono/zod-openapi';

import { corsConfig } from '../config/clients.config';
import { routes } from './routes';


// Server
const port = Bun.env.PORT || 5001;

const app = new OpenAPIHono();


// Use the middleware to serve Swagger UI at /ui
app.get('/ui', swaggerUI({ url: '/openapi.json' }));
app.get('/ui2', apiReference({ theme: 'kepler', spec: { url: '/openapi.json' } }));
app.doc('/openapi.json', {
    openapi: '3.1.0',
    info: { title: 'Starter API', version: '1.0.0' }
});

app.onError((err, c) => {
  console.error('💥 Uncaught error:', err);
  return c.json({ error: 'internal_error', message: String(err) }, 500);
});

// Middleware
app.use(logger());
app.use(poweredBy());
app.use(cors(corsConfig));
// app.use(cors({ origin: "*" }));
app.use(prettyJSON({ space: 4 }));
app.use(secureHeaders());

// Optional auth if MASTER_API_KEY is provided
if (Bun.env.MASTER_API_KEY) {
  app.use(bearerAuth({ token: Bun.env.MASTER_API_KEY }));
}

// Routes
app.route('/', routes);

showRoutes(app, { verbose: true });

export default { 
  port, 
  fetch: app.fetch,
  // websocket: websocket
};
