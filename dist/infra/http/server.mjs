import {
  exportUploadsRoute
} from "../../chunk-YGUDAFOL.mjs";
import {
  getUploadsRoute
} from "../../chunk-P6E4XZQE.mjs";
import {
  transformSwaggerSchema
} from "../../chunk-5G2IHOYW.mjs";
import {
  uploadImageRoute
} from "../../chunk-4OJZHLRM.mjs";
import "../../chunk-7ESR3723.mjs";
import "../../chunk-R3IHKFM4.mjs";
import "../../chunk-ELFH4NGD.mjs";
import "../../chunk-YWFFMRRM.mjs";
import "../../chunk-QU6T7HRO.mjs";
import "../../chunk-DHSCTI7N.mjs";
import "../../chunk-GWPCX55H.mjs";
import "../../chunk-TS7K2WIJ.mjs";
import "../../chunk-CWJ2IAZ7.mjs";
import "../../chunk-L4VP6TGO.mjs";
import "../../chunk-WV42ZEDY.mjs";
import "../../chunk-OKCKBIXE.mjs";
import "../../chunk-7P6ASYW6.mjs";

// src/infra/http/server.ts
import { fastifyCors } from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
var server = fastify();
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);
server.setErrorHandler((error, _, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: "Validation error",
      issues: error.cause
    });
  }
  console.error(error);
  return reply.status(500).send({
    message: "Internal server error"
  });
});
server.register(fastifyCors, { origin: "*" });
server.register(fastifyMultipart);
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Upload Server",
      version: "1.0.0"
    }
  },
  transform: transformSwaggerSchema
});
server.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
server.register(uploadImageRoute);
server.register(getUploadsRoute);
server.register(exportUploadsRoute);
server.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.info("HTTP server running!");
});
