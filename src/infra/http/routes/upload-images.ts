import { uploadImage } from "@/app/functions/upload-image"
import { isRightResult, unwrapEither } from "@/infra/shared/either"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    "/upload",
    {
      schema: {
        summary: "Upload an Image",
        consumes: ["multipart/form-data"],
        response: {
          201: z.object({ url: z.string() }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: {
          fileSize: 1024 * 1024 * 2, // 2mb
        },
      })

      if (!uploadedFile) {
        return reply.status(400).send({ message: "File is required" })
      }

      const result = await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file,
      })

      // verifica se o arquivo é muito grande
      if(uploadedFile.file.truncated) {
        return reply.status(400).send({ message: "File is too large" })
      }

      if (isRightResult(result)) {
        return reply.status(201).send({ url: result.data.url })
      }

      const error = unwrapEither(result)
      switch (error.constructor.name) {
        case "InvalidFileFormat":
          return reply.status(400).send({ message: error.message })
      }
    }
  )
}
