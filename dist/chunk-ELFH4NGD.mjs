import {
  InvalidFileFormat
} from "./chunk-YWFFMRRM.mjs";
import {
  uploadFileToStorage
} from "./chunk-QU6T7HRO.mjs";
import {
  makeLeftError,
  makeRightResult
} from "./chunk-TS7K2WIJ.mjs";
import {
  db
} from "./chunk-CWJ2IAZ7.mjs";
import {
  schema
} from "./chunk-L4VP6TGO.mjs";

// src/app/functions/upload-image.ts
import { Readable } from "node:stream";
import { z } from "zod";
var uploadImageInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable)
});
var ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
];
async function uploadImage(input) {
  const { contentType, fileName, contentStream } = uploadImageInput.parse(input);
  if (!ALLOWED_MIME_TYPES.includes(contentType)) {
    return makeLeftError(new InvalidFileFormat());
  }
  const { url, key } = await uploadFileToStorage({
    folder: "images",
    fileName,
    contentType,
    contentStream
  });
  await db.insert(schema.uploads).values({
    name: fileName,
    remoteKey: key,
    remoteUrl: url
  });
  return makeRightResult({ url });
}

export {
  uploadImage
};
