import {
  uploadImage
} from "./chunk-ELFH4NGD.mjs";
import {
  isRightResult,
  unwrapEither
} from "./chunk-TS7K2WIJ.mjs";

// src/infra/http/routes/upload-images.ts
import { z } from "zod";
var uploadImageRoute = async (server) => {
  server.post(
    "/upload",
    {
      schema: {
        summary: "Upload an Image",
        tags: ["uploads"],
        consumes: ["multipart/form-data"],
        response: {
          201: z.object({ url: z.string() }),
          400: z.object({
            message: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: {
          fileSize: 1024 * 1024 * 2
          // 2mb
        }
      });
      if (!uploadedFile) {
        return reply.status(400).send({ message: "File is required" });
      }
      const result = await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file
      });
      if (uploadedFile.file.truncated) {
        return reply.status(400).send({ message: "File is too large" });
      }
      if (isRightResult(result)) {
        return reply.status(201).send({ url: result.data.url });
      }
      const error = unwrapEither(result);
      switch (error.constructor.name) {
        case "InvalidFileFormat":
          return reply.status(400).send({ message: error.message });
      }
    }
  );
};

export {
  uploadImageRoute
};
