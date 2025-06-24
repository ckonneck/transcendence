async function userRoutes(fastify, options) {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]

  fastify.get('/users', async () => users)

  fastify.get('/users/:id', async (request, reply) => {
    const id = Number(request.params.id)
    const user = users.find(u => u.id === id)
    if (!user) {
      reply.code(404).send({ error: 'Not found' })
    }
    return user
  })

  fastify.post('/users', async (request, reply) => {
    const { name } = request.body
    const newUser = { id: Date.now(), name }
    users.push(newUser)
    reply.code(201).send(newUser)
  })
}

module.exports = userRoutes
