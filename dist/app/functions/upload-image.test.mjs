import {
  uploadImage
} from "../../chunk-ELFH4NGD.mjs";
import {
  InvalidFileFormat
} from "../../chunk-YWFFMRRM.mjs";
import "../../chunk-QU6T7HRO.mjs";
import "../../chunk-DHSCTI7N.mjs";
import "../../chunk-GWPCX55H.mjs";
import {
  isLeftError,
  isRightResult,
  unwrapEither
} from "../../chunk-TS7K2WIJ.mjs";
import {
  db
} from "../../chunk-CWJ2IAZ7.mjs";
import {
  schema
} from "../../chunk-L4VP6TGO.mjs";
import "../../chunk-WV42ZEDY.mjs";
import "../../chunk-OKCKBIXE.mjs";
import "../../chunk-7P6ASYW6.mjs";

// src/app/functions/upload-image.test.ts
import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";
describe("upload image", () => {
  beforeAll(() => {
    vi.mock("@/infra/storage/upload-file-to-storage", () => {
      return {
        uploadFileToStorage: vi.fn().mockImplementation(() => {
          return {
            key: `${randomUUID()}.jpg`,
            url: "https://storage.com/image.jpg"
          };
        })
      };
    });
  });
  it("should be able to upload an image", async () => {
    const fileName = `${randomUUID()}.jpg`;
    const sut = await uploadImage({
      fileName,
      contentType: "image/jpg",
      contentStream: Readable.from([])
    });
    expect(isRightResult(sut)).toBe(true);
    const result = await db.select().from(schema.uploads).where(eq(schema.uploads.name, fileName));
    expect(result).toHaveLength(1);
  });
  it("should not be able to upload an invalid file", async () => {
    const fileName = `${randomUUID()}.pdf`;
    const sut = await uploadImage({
      fileName,
      contentType: "document/pdf",
      contentStream: Readable.from([])
    });
    expect(isLeftError(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(InvalidFileFormat);
  });
});
