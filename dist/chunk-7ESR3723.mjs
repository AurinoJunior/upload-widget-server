import {
  uploadFileToStorage
} from "./chunk-QU6T7HRO.mjs";
import {
  makeRightResult
} from "./chunk-TS7K2WIJ.mjs";
import {
  db,
  pg
} from "./chunk-CWJ2IAZ7.mjs";
import {
  schema
} from "./chunk-L4VP6TGO.mjs";

// src/app/functions/export-uploads.ts
import { PassThrough, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { stringify } from "csv-stringify";
import { ilike } from "drizzle-orm";
import { z } from "zod";
var exportUploadsInput = z.object({
  searchQuery: z.string().optional()
});
async function exportUploads(input) {
  const { searchQuery } = exportUploadsInput.parse(input);
  const { sql, params } = db.select({
    id: schema.uploads.id,
    name: schema.uploads.name,
    remoteUrl: schema.uploads.remoteUrl,
    createdAt: schema.uploads.createdAt
  }).from(schema.uploads).where(
    searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : void 0
  ).toSQL();
  const cursor = pg.unsafe(sql, params).cursor(2);
  const csv = stringify({
    delimiter: ",",
    header: true,
    columns: [
      { key: "id", header: "ID" },
      { key: "name", header: "Name" },
      { key: "remote_url", header: "URL" },
      { key: "created_at", header: "Uploaded at" }
    ]
  });
  const uploadToStorageStream = new PassThrough();
  const convertToCSVPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks, _encoding, callback) {
        for (const chunk of chunks) {
          this.push(chunk);
        }
        callback();
      }
    }),
    csv,
    uploadToStorageStream
  );
  const uploadToStorage = uploadFileToStorage({
    contentType: "text/csv",
    folder: "downloads",
    fileName: `${(/* @__PURE__ */ new Date()).toISOString()}-uploads.csv`,
    contentStream: uploadToStorageStream
  });
  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline]);
  return makeRightResult({ reportUrl: url });
}

export {
  exportUploads
};
