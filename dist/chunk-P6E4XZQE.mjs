import {
  getUploads
} from "./chunk-R3IHKFM4.mjs";
import {
  unwrapEither
} from "./chunk-TS7K2WIJ.mjs";

// src/infra/http/routes/get-uploads.ts
import { z } from "zod";
var getUploadsRoute = async (server) => {
  server.get(
    "/uploads",
    {
      schema: {
        summary: "Get uploads",
        tags: ["uploads"],
        querystring: z.object({
          searchQuery: z.string().optional(),
          sortBy: z.enum(["createdAt"]).optional(),
          sortDirection: z.enum(["asc", "desc"]).optional(),
          page: z.coerce.number().optional().default(1),
          pageSize: z.coerce.number().optional().default(20)
        }),
        response: {
          200: z.object({
            uploads: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                remoteKey: z.string(),
                remoteUrl: z.string(),
                createdAt: z.date()
              })
            ),
            total: z.number()
          })
        }
      }
    },
    async (request, reply) => {
      const data = request.query;
      const result = await getUploads(data);
      const { total, uploads } = unwrapEither(result);
      return reply.status(200).send({ total, uploads });
    }
  );
};

export {
  getUploadsRoute
};
