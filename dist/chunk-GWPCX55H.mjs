// src/utils/genUniqueFileName.ts
import { randomUUID } from "node:crypto";
import { basename, extname } from "node:path";
function genUniqueFileName(fileName, folder) {
  const fileExtension = extname(fileName);
  const fileNameWithoutExtension = basename(fileName, fileExtension);
  const sanitizedFileName = fileNameWithoutExtension.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/\s+/g, "-").toLowerCase().slice(0, 50);
  return `${folder}/${randomUUID()}-${sanitizedFileName}${fileExtension}`;
}

export {
  genUniqueFileName
};
