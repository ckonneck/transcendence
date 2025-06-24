// server.js
const fastify = require('fastify')({ logger: true })
fastify.register(require('./routes/users'))

fastify.get('/', async (request, reply) => {
  return { hello: 'world is going down down down down' }
})


// Dummy in-memory data
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]


const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
    console.log('Server running on http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()

