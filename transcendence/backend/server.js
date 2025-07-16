const fastify = require('fastify')({ logger: true }) //imports fastify and creates server
const path = require('path')                        // Loads Node.js’s built-in path module. Used to resolve file paths in a cross-platform way.
const fastifyStatic = require('@fastify/static') //This plugin lets Fastify serve static files (like .html, .js, .css) from the file system.
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const bcrypt = require('bcrypt');
const vault = require('node-vault')({
  endpoint: process.env.VAULT_ADDR || 'http://vault:8200',
  token: process.env.VAULT_TOKEN,
});

fastify.post('/register', async (request, reply) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return reply.code(400).send({ success: false, error: 'Missing fields' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const vaultPath = `secret/data/users/${username}`;
    await vault.write(vaultPath, {
      data: {
        username,
        passwordHash
      }
    });

    return reply.send({ success: true });
  } catch (err) {
    console.error("🔴 Vault write failed:", err.response?.body || err.message || err);
    reply.code(500).send({
      success: false,
      error: 'Vault write failed: ' + (err.response?.body?.errors?.[0] || err.message),
    });
  }
});


let currentSecret = null;
fastify.get('/2fa/setup', async (req, reply) => {
  const secret = speakeasy.generateSecret({
    name: 'MyCoolApp (example@site.com)', // what shows up in Google Auth
  });

  currentSecret = secret.base32; // we'll use this to verify later

  const qr = await qrcode.toDataURL(secret.otpauth_url);
  return reply.send({ qrCode: qr, secret: secret.base32 });
});

// POST /2fa/verify → checks submitted code
fastify.post('/2fa/verify', async (req, reply) => {
  const { token } = req.body;

  const verified = speakeasy.totp.verify({
    secret: currentSecret,
    encoding: 'base32',
    token,
    window: 1, // allow +/- 30 seconds
  });

  reply.send({ verified });
});




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
  return { message: 'Request for a pizza accepted.\nPlease wait 3-5 Business days for delivery.' } //same as above, for button
})

fastify.listen({ port: 3000, host: '0.0.0.0' }, err => { //makes the server accessible, if startup fails, logs it
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})

