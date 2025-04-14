import { Readable } from "node:stream"
import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { makeLeftError, makeRightResult } from "@/infra/shared/either"
import { uploadFileToStorage } from "@/infra/storage/upload-file-to-storage"
import { z } from "zod"
import { InvalidFileFormat } from "./errors/invalid-file-format"

const uploadImageInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
})

// input valida os dados de entrada
// output valida os dados de saída
type UploadImageInput = z.input<typeof uploadImageInput>

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]

export async function uploadImage(input: UploadImageInput) {
  const { contentType, fileName, contentStream } = uploadImageInput.parse(input)

  if (!ALLOWED_MIME_TYPES.includes(contentType)) {
    return makeLeftError(new InvalidFileFormat())
  }

  const { url, key } = await uploadFileToStorage({
    folder: "images",
    fileName,
    contentType,
    contentStream,
  })

  await db.insert(schema.uploads).values({
    name: fileName,
    remoteKey: key,
    remoteUrl: url,
  })

  return makeRightResult({ url })
}
