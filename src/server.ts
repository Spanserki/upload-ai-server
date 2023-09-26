import { fastify } from 'fastify'
import { prisma } from './lib/prisma';
import { getAllPromptRoute } from './routes/get-all-prompts';

const app = fastify();

app.register(getAllPromptRoute);

app.listen({
    port: 3333
}).then(() => {
    console.log('HTTP Server Running')
})