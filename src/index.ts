import { serve } from '@hono/node-server'
import { OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { jobRouter } from './modules/job/router'

const app = new OpenAPIHono()
  .route('/jobs', jobRouter)
  .doc('/doc', {
    openapi: '3.0.0',
    info: {
      title: 'CritiqueQ API',
      version: '1.0.0',
      description: 'AI-powered feedback analysis and triage service',
    },
  })
  .get(
    '/reference',
    apiReference({
      spec: {
        url: '/doc',
      },
      theme: 'saturn',
    }),
  );

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
    console.log(`API Docs available at http://localhost:${info.port}/reference`)
  }
)
