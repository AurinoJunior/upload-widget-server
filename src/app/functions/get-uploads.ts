import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { type Either, makeRightResult } from "@/infra/shared/either"
import { asc, count, desc, ilike } from "drizzle-orm"
import { z } from "zod"

const getUploadsInput = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(["createdAt"]).optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
})

type GetUploadsInput = z.input<typeof getUploadsInput>

type GetUploadsOutput = {
  uploads: {
    id: string
    name: string
    remoteKey: string
    remoteUrl: string
    createdAt: Date
  }[]
  total: number
}

export async function getUploads(
  input: GetUploadsInput
): Promise<Either<never, GetUploadsOutput>> {
  const { page, pageSize, searchQuery, sortBy, sortDirection } =
    getUploadsInput.parse(input)

  const [uploads, resultCount] = await Promise.all([
    db
      .select({
        id: schema.uploads.id,
        name: schema.uploads.name,
        remoteKey: schema.uploads.remoteKey,
        remoteUrl: schema.uploads.remoteUrl,
        createdAt: schema.uploads.createdAt,
      })
      .from(schema.uploads)
      .where(
        // ilike faz uma busca que não diferencia maiúsculas de minúsculas
        searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : undefined
      )
      .orderBy(fields => {
        if (sortBy && sortDirection === "asc") {
          return asc(fields[sortBy])
        }

        if (sortBy && sortDirection === "desc") {
          return desc(fields[sortBy])
        }

        return desc(fields.id)
      })
      .offset((page - 1) * pageSize) // OFFSET é de qual entrada você vai começar a ler
      .limit(pageSize), // LIMIT é quantos valores você quer ler de uma vez.

    db
      .select({ total: count(schema.uploads.id) })
      .from(schema.uploads)
      .where(
        searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : undefined
      ),
  ])

  return makeRightResult({ uploads, total: resultCount[0].total })
}
