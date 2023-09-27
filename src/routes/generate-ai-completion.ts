
import { FastifyInstance } from "fastify";
import * as yup from 'yup';
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";

export async function generateAiCompletion(app: FastifyInstance) {
    app.post('/ai/complete', async (req, reply) => {
        const bodySchema = yup.object({
            videoId: yup.string(),
            template: yup.string(),
            temperature: yup.number().min(0).max(1).default(0.5)
        })
        const { videoId, template, temperature } = await bodySchema.validate(req.body)
        const video = await prisma.video.findFirstOrThrow({
            where: {
                id: videoId
            }
        })
        if (!video.transcription) {
            return reply.status(400).send({ error: 'Vídeo transcription was not generate yes.' })
        }
        const promptMessage: any = template?.replace('{transcription}', video.transcription)
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            temperature,
            messages: [
                { role: 'user', content: promptMessage }
            ]
        })
        return response
    })
}