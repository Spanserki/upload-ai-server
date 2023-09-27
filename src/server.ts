import { fastify } from 'fastify';
import { createTrancription } from './routes/create-transcription';
import { getAllPromptRoute } from './routes/get-all-prompts';
import { uploadVideoRoute } from './routes/upload-video';
import { generateAiCompletion } from './routes/generate-ai-completion';
import fastifyCors from '@fastify/cors';

const app = fastify();

app.register(fastifyCors, {
    origin: '*'
})

app.register(getAllPromptRoute);
app.register(uploadVideoRoute);
app.register(createTrancription);
app.register(generateAiCompletion);

app.listen({
    port: 3333
}).then(() => {
    console.log('HTTP Server Running')
})