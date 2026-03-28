import { OpenAPIHono } from '@hono/zod-openapi';
import { exampleRoutes } from './example.routes';
import { ragRoutes } from './rag.routes';

const routes = new OpenAPIHono();

routes.get('/', (c) =>
  c.json({
    name: 'ai-construction-demos-api',
    status: 'ok',
    features: ['example', 'rag'],
  }),
);
routes.get('/health', (c) => c.json({ status: 'ok' }));
routes.route('/api/v1/example', exampleRoutes);
routes.route('/api/v1/rag', ragRoutes);

export { routes };
