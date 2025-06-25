const fastify = require('fastify')({ logger: true }) //imports fastify and creates server
const path = require('path')                        // Loads Node.js’s built-in path module. Used to resolve file paths in a cross-platform way.
const fastifyStatic = require('@fastify/static') //This plugin lets Fastify serve static files (like .html, .js, .css) from the file system.


// Serve the frontend (HTML) (index.html)
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../frontend'), //path to the static directory(frontend)
  prefix: '/',    //prefix: '/': Files here are available directly from /, so index.html is served as the home page.
  decorateReply: false, // Avoids sendFile collision
})

// Serve the compiled TypeScript JS
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../dist'), //Serves static files (compiled TypeScript output) from the ../dist folder.
  prefix: '/dist/', //These files are accessible via URLs like /dist/main.js.
})

fastify.get('/api/hello', async (request, reply) => { //Responds to GET requests at /api/hello.
  return { message: 'Hello owowo server is live omagawd' } //Returns a simple JSON object with a message.
})

fastify.get('/api/request', async (request, reply) => {
  return { message: 'Response from server!' } //same as above, for button
})

fastify.listen({ port: 3000, host: '0.0.0.0' }, err => { //makes the server accessible, if startup fails, logs it
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})

