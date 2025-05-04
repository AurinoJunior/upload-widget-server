import {
  db
} from "./chunk-CWJ2IAZ7.mjs";
import {
  schema
} from "./chunk-L4VP6TGO.mjs";

// src/test/factories/make-upload.ts
import { fakerPT_BR as faker } from "@faker-js/faker";
async function makeUpload(overrides) {
  const fileName = faker.system.fileName();
  const result = await db.insert(schema.uploads).values({
    name: fileName,
    remoteKey: `images/${fileName}`,
    remoteUrl: `http://example.com/images/${fileName}`,
    ...overrides
  }).returning();
  return result[0];
}

export {
  makeUpload
};
