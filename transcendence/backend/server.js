const fastify = require('fastify')({ logger: true })
const path = require('path')
const fastifyStatic = require('@fastify/static')

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../frontend'),
  prefix: '/', // This will serve index.html at /
})

// Serve compiled TypeScript from /dist
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../dist'),
  prefix: '/dist/', // JS files will be available at /dist/main.js, etc.
})

fastify.get('/api/hello', async (request, reply) => {
  return { message: 'Hello owowo server is live omagawd' }
})

fastify.get('/api/request', async (request, reply) => {
  return { message: 'Response from server!' }
})

fastify.listen({ port: 3000, host: '0.0.0.0' }, err => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})

