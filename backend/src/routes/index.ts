import { OpenAPIHono } from '@hono/zod-openapi';
import { exampleRoutes } from './example.routes';

const routes = new OpenAPIHono();

routes.get('/', (c) => c.json({ name: 'starter-api', status: 'ok' }));
routes.get('/health', (c) => c.json({ status: 'ok' }));
routes.route('/api/v1/example', exampleRoutes);

export { routes };
