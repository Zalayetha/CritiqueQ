import { serve } from '@hono/node-server'
import { OpenAPIHono } from '@hono/zod-openapi'
import { jobRouter } from './modules/job/router'


const app = new OpenAPIHono().route('/job', jobRouter)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
