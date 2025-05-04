import {
  schema
} from "./chunk-L4VP6TGO.mjs";
import {
  env
} from "./chunk-OKCKBIXE.mjs";

// src/infra/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
var pg = postgres(env.DATABASE_URL);
var db = drizzle(pg, { schema });

export {
  pg,
  db
};
