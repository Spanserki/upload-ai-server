import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import fastifyMultipart from "@fastify/multipart";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { promisify } from "node:util";
import { pipeline } from 'node:stream'
import fs from 'fs'

const pump = promisify(pipeline);

export async function uploadVideoRoute(app: FastifyInstance) {
    app.register(fastifyMultipart, {
        limits: {
            fileSize: 1_848_576 * 25
        }
    })

    app.post('/videos', async (request, reply) => {
        const data = await request.file();
        if (!data) {
            return reply.status(400).send({ error: 'Missing file input.' }) //Se não tiver nenhum arquivo retorna um erro
        }
        const extension = path.extname(data.filename); //Busca o nome da extensão do arquivo
        if (extension != '.mp3') {
            return reply.status(400).send({ error: 'Invalid input type, please upload a MP3' }) //Se a extensão for diferente de mp3 retorna um erro
        }
        const fileBaseName = path.basename(data.filename, extension); //Pegamos o nome do arquivo e o nome da extensão 
        const fileUploadName = `${fileBaseName}-${randomUUID()}-${extension}` //Unimos o nome do arquivo e extensão com um numero aleatório
        const uploadDestination = path.resolve(__dirname, '../../tmp', fileUploadName)  //Buscamos a pasta onde o arquivo ira ficar

        await pump(data.file, fs.createWriteStream(uploadDestination)) //Conforme os dados vao chegando, vamos escrevendo o arquivo
    })
}