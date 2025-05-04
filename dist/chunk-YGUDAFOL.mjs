import {
  exportUploads
} from "./chunk-7ESR3723.mjs";
import {
  unwrapEither
} from "./chunk-TS7K2WIJ.mjs";

// src/infra/http/routes/export-uploads.ts
import { z } from "zod";
var exportUploadsRoute = async (server) => {
  server.post(
    "/uploads/exports",
    {
      schema: {
        summary: "Export uploads",
        tags: ["uploads"],
        querystring: z.object({
          searchQuery: z.string().optional()
        }),
        response: {
          200: z.object({
            reportUrl: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { searchQuery } = request.query;
      const result = await exportUploads({
        searchQuery
      });
      const { reportUrl } = unwrapEither(result);
      return reply.status(200).send({ reportUrl });
    }
  );
};

export {
  exportUploadsRoute
};
