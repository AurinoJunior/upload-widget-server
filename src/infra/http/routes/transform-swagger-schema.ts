import { jsonSchemaTransform } from "fastify-type-provider-zod"

type TransformSwaggerSchemaData = Parameters<typeof jsonSchemaTransform>[0]

// Adiciona suporte para o multipart/form-data
export function transformSwaggerSchema(data: TransformSwaggerSchemaData) {
  const { schema, url } = jsonSchemaTransform(data)

  // Verifica se o schema tem o tipo multipart/form-data
  if (!schema.consumes?.includes("multipart/form-data")) {
    return { schema, url }
  }

  if (!schema.body) {
    schema.body = {
      type: "object",
      required: [],
      properties: {},
    }
  }

  schema.body.properties.file = {
    type: "string",
    format: "binary",
  }

  // Adiciona o campo file como obrigatório
  schema.body.required.push("file")

  return { schema, url }
}
