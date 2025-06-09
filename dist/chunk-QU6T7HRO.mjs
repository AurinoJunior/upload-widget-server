import {
  r2
} from "./chunk-DHSCTI7N.mjs";
import {
  genUniqueFileName
} from "./chunk-GWPCX55H.mjs";
import {
  env
} from "./chunk-OKCKBIXE.mjs";
import {
  __export
} from "./chunk-7P6ASYW6.mjs";

// src/infra/storage/upload-file-to-storage.ts
var upload_file_to_storage_exports = {};
__export(upload_file_to_storage_exports, {
  uploadFileToStorage: () => uploadFileToStorage
});
import { Readable } from "node:stream";
import { Upload } from "@aws-sdk/lib-storage";
import { z } from "zod";
var uploadFileToStorageInput = z.object({
  folder: z.enum(["images", "downloads"]),
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable)
});
async function uploadFileToStorage(input) {
  const { folder, fileName, contentType, contentStream } = uploadFileToStorageInput.parse(input);
  const uniqueFileName = genUniqueFileName(fileName, folder);
  const upload = new Upload({
    client: r2,
    params: {
      Key: uniqueFileName,
      Bucket: env.CLOUDFLARE_BUCKET,
      Body: contentStream,
      ContentType: contentType
    }
  });
  await upload.done();
  return {
    key: uniqueFileName,
    url: new URL(uniqueFileName, env.CLOUDFLARE_PUBLIC_URL).toString()
  };
}

export {
  uploadFileToStorage,
  upload_file_to_storage_exports
};
