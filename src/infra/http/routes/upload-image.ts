import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { uploadImage } from '@/app/functions/upload-image'
import { isRight, unwrapEither } from '@/shared/either'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload an image',
        tags: ['uploads'],
        consumes: ['multipart/form-data'],
        response: {
          201: z.object({
            uploadId: z.null().describe('Image uploaded'),
          }),
          409: z
            .object({ message: z.string() })
            .describe('Upload already exists.'),
          400: z.object({ message: z.string() }).describe('Invalid request.'),
        },
      },
    },
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: {
          fileSize: 1024 * 1024 * 2, //2mb
        },
      })

      if (!uploadedFile) {
        return reply.status(400).send({ message: 'No file uploaded.' })
      }

      const result = await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file,
      })

      if (uploadedFile.file.truncated) {
        return reply.status(400).send({ message: 'File too large.' })
      }

      if (isRight(result)) {
        console.log(unwrapEither(result))

        return reply.status(201).send()
      }

      const error = unwrapEither(result)

      switch (error.name) {
        case 'InvalidFileFormat':
          return reply.status(400).send({ message: 'Invalid file format.' })
      }
    }
  )
}
