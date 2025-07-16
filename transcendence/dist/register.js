"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fastify = require('fastify')({ logger: true });
const bcrypt = require('bcrypt');
const vault = require('node-vault')({
    endpoint: 'http://127.0.0.1:8200',
    token: process.env.VAULT_TOKEN,
});
fastify.register(require('@fastify/cors'), {
    origin: '*', // allow access from your frontend
});
fastify.post('/register', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = request.body;
    if (!username || !password) {
        return reply.code(400).send({ success: false, error: 'Missing username or password' });
    }
    try {
        const passwordHash = yield bcrypt.hash(password, 10);
        const vaultPath = `secret/data/users/${username}`;
        yield vault.write(vaultPath, {
            data: {
                username,
                passwordHash
            }
        });
        reply.send({ success: true });
    }
    catch (err) {
        console.error("Vault error:", err);
        reply.code(500).send({ success: false, error: 'Internal server error' });
    }
}));
fastify.listen({ port: 3000 }, (err, address) => {
    if (err)
        throw err;
    console.log(`Server running at ${address}`);
});
