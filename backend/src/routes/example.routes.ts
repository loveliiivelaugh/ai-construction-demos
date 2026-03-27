import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

const exampleRoutes = new OpenAPIHono();

const ExampleResponse = z.object({
  message: z.string(),
  requestId: z.string(),
});

exampleRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/',
    summary: 'Example starter endpoint',
    tags: ['example'],
    responses: {
      200: {
        description: 'Example response payload',
        content: { 'application/json': { schema: ExampleResponse } },
      },
    },
  }),
  (c) => {
    return c.json({ message: 'Hello from the starter API', requestId: crypto.randomUUID() });
  }
);

export { exampleRoutes };
