const fs = require('fs');
const fastify = require('fastify')({
  logger: true,
  https: {
    key: fs.readFileSync('/etc/ssl/private/fastify.key'),
    cert: fs.readFileSync('/etc/ssl/certs/fastify.crt'),
  }
}); //imports fastify and creates server
const path = require('path')                        // Loads Node.js’s built-in path module. Used to resolve file paths in a cross-platform way.
const fastifyStatic = require('@fastify/static') //This plugin lets Fastify serve static files (like .html, .js, .css) from the file system.
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const bcrypt = require('bcrypt');
const vault = require('node-vault')({
  endpoint: process.env.VAULT_ADDR || 'http://vault:8200',
  token: process.env.VAULT_TOKEN,
});
//REGISTERFORM
const secrets = {}; // Temporary memory store: { [username]: base32secret }

fastify.post('/register/init', async (request, reply) => {
  const { username, enable2FA } = request.body;

  if (!username) return reply.code(400).send({ success: false, error: 'Missing username' });

  if (enable2FA) {
    const secret = speakeasy.generateSecret({ name: `Transcendence (${username})` });
    secrets[username] = secret.base32;

    const qrCode = await qrcode.toDataURL(secret.otpauth_url);
    return reply.send({ success: true, qrCode, tempSecret: secret.base32 });
  }

  return reply.send({ success: true }); // Proceed with registration without 2FA
});

fastify.post('/register/complete', async (request, reply) => {
  const { username, password, token, enable2FA } = request.body;

  if (!username || !password) {
    return reply.code(400).send({ success: false, error: 'Missing fields' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    let is2FAEnabled = false;
    let twoFASecret;

    if (enable2FA) {
      twoFASecret = secrets[username];
      if (!twoFASecret) {
        return reply.code(400).send({ success: false, error: '2FA setup was not initiated' });
      }

      const verified = speakeasy.totp.verify({
        secret: twoFASecret,
        encoding: 'base32',
        token,
        window: 1,
      });

      if (!verified) {
        return reply.code(400).send({ success: false, error: 'Invalid 2FA token' });
      }

      is2FAEnabled = true;
      delete secrets[username]; // Clean up after registration
    }

    const vaultPath = `secret/data/users/${username}`;
    await vault.write(vaultPath, {
      data: {
        username,
        passwordHash,
        is2FAEnabled,
        twoFASecret,
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


//LOGINFORM
fastify.post('/login', async (request, reply) => {
  const { username, password, token } = request.body;

  try {
    const vaultPath = `secret/data/users/${username}`;
    const result = await vault.read(vaultPath);
    const user = result.data.data;

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return reply.code(401).send({ success: false, error: '❌ Invalid password' });
    }

    if (user.is2FAEnabled) {
      if (!token) {
        return reply.code(401).send({ success: false, error: '2FA token required' });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: 'base32',
        token,
        window: 1,
      });

      if (!verified) {
        return reply.code(401).send({ success: false, error: '❌ Invalid 2FA token' });
      }
    }

    return reply.send({ success: true, message: '✅ Login successful' });
  } catch (err) {
    return reply.code(404).send({ success: false, error: '❌ User not found' });
  }
});


//GETHASHFORM
fastify.get('/user/:username', async (request, reply) => {
  const { username } = request.params;

  try {
    const vaultPath = `secret/data/users/${username}`;
    const result = await vault.read(vaultPath);
    const { passwordHash } = result.data.data;

    return reply.send({ success: true, passwordHash });
  } catch (err) {
    console.error("Vault read failed:", err.response?.body || err.message || err);
    return reply.code(404).send({
      success: false,
      error: 'Vault read failed or user not found',
    });
  }
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

