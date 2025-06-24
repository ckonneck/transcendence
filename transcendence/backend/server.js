const fastify = require('fastify')({ logger: true })
const path = require('path')
const fastifyStatic = require('@fastify/static')

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../frontend'),
  prefix: '/', // Serve index.html at root
})

fastify.get('/api/hello', async (request, reply) => {
  return { message: 'Hello owowo server is live omagawd' }
})

fastify.listen({ port: 3000, host: '0.0.0.0' }, err => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})

