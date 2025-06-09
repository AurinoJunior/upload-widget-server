import {
  exportUploads
} from "../../chunk-7ESR3723.mjs";
import {
  makeUpload
} from "../../chunk-JNFVGKVK.mjs";
import {
  upload_file_to_storage_exports
} from "../../chunk-QU6T7HRO.mjs";
import "../../chunk-DHSCTI7N.mjs";
import "../../chunk-GWPCX55H.mjs";
import {
  isRightResult,
  unwrapEither
} from "../../chunk-TS7K2WIJ.mjs";
import "../../chunk-CWJ2IAZ7.mjs";
import "../../chunk-L4VP6TGO.mjs";
import "../../chunk-WV42ZEDY.mjs";
import "../../chunk-OKCKBIXE.mjs";
import "../../chunk-7P6ASYW6.mjs";

// src/app/functions/export-uploads.test.ts
import { randomUUID } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
describe("export uploads", () => {
  it("should be able to export uploads", async () => {
    const uploadStub = vi.spyOn(upload_file_to_storage_exports, "uploadFileToStorage").mockImplementationOnce(async () => {
      return {
        key: `${randomUUID()}.csv`,
        url: "http://example.com/file.csv"
      };
    });
    const namePattern = randomUUID();
    const upload1 = await makeUpload({ name: `${namePattern}.jpg` });
    const upload2 = await makeUpload({ name: `${namePattern}.jpg` });
    const upload3 = await makeUpload({ name: `${namePattern}.jpg` });
    const sut = await exportUploads({
      searchQuery: namePattern
    });
    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream;
    const csvAsString = await new Promise((resolve, reject) => {
      const chunks = [];
      generatedCSVStream.on("data", (chunk) => {
        chunks.push(chunk);
      });
      generatedCSVStream.on("end", () => {
        resolve(Buffer.concat(chunks).toString("utf-8"));
      });
      generatedCSVStream.on("error", (err) => {
        reject(err);
      });
    });
    const csvAsArray = csvAsString.trim().split("\n").map((row) => row.split(","));
    expect(isRightResult(sut)).toBe(true);
    expect(unwrapEither(sut).reportUrl).toBe("http://example.com/file.csv");
    expect(csvAsArray).toEqual([
      ["ID", "Name", "URL", "Uploaded at"],
      [upload1.id, upload1.name, upload1.remoteUrl, expect.any(String)],
      [upload2.id, upload2.name, upload2.remoteUrl, expect.any(String)],
      [upload3.id, upload3.name, upload3.remoteUrl, expect.any(String)]
    ]);
  });
});
