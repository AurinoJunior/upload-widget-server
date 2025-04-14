import { randomUUID } from "node:crypto"
import { basename, extname } from "node:path"

export function genUniqueFileName(fileName: string, folder: string) {
  const fileExtension = extname(fileName)
  const fileNameWithoutExtension = basename(fileName, fileExtension)
  const sanitizedFileName = fileNameWithoutExtension
    .replace(/[^a-zA-Z0-9._-]/g, "-") // substitui caracteres especiais
    .replace(/\s+/g, "-") // espaços viram hífens
    .toLowerCase()
    .slice(0, 50)

  return `${folder}/${randomUUID()}-${sanitizedFileName}${fileExtension}`
}
