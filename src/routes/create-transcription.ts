
import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import * as yup from 'yup'
import { createReadStream } from "node:fs";
import { openai } from "../lib/openai";

export async function createTrancription(app: FastifyInstance) {
    app.post('/videos/:videoId/transcription', async (req) => {
        const paramsSchema = yup.object({
            videoId: yup.string().uuid(),
        })
        const bodySchema = yup.object({
            prompt: yup.string()
        })
        const { videoId } = await paramsSchema.validate(req.params)
        const { prompt } = await bodySchema.validate(req.body)
        const video = await prisma.video.findFirstOrThrow({
            where: {
                id: videoId,
            }
        })
        const videoPath = video.path
        const audioReadStream = createReadStream(videoPath)
        const response = await openai.audio.transcriptions.create({
            file: audioReadStream,
            model: 'whisper-1',
            language: 'pt',
            response_format: 'json',
            temperature: 0,
            prompt
        })
        await prisma.video.update({
            where: {
                id: videoId
            },
            data: {
                transcription: response.text
            }
        })
        return response.text
    })
}