import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    "/upload",
    {
      schema: {
        summary: "Upload an Image",
        body: z.object({
          name: z.string(),
          password: z.string(),
        }),
        response: {
          201: z.object({ uploadId: z.string() }),
          409: z.object({
            message: z.string().describe("Upload already exists"),
          }),
        },
      },
    },
    async (_request, reply) => {
      return reply.status(201).send({
        uploadId: "test",
      })
    }
  )
}
