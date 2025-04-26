import { randomUUID } from "node:crypto"
import { getUploads } from "@/app/functions/get-uploads"
import { isRightResult, unwrapEither } from "@/infra/shared/either"
import { type TUploads, makeUpload } from "@/test/factories/make-upload"
import dayjs from "dayjs"
import { beforeAll, describe, expect, it } from "vitest"

describe("get uploads", () => {
  const namePattern = randomUUID()
  let upload1: TUploads
  let upload2: TUploads
  let upload3: TUploads

  beforeAll(async () => {
    upload1 = await makeUpload({
      name: `id-1-${namePattern}.webp`,
      createdAt: dayjs().subtract(2, "day").toDate(),
    })
    upload2 = await makeUpload({
      name: `id-2-${namePattern}.webp`,
      createdAt: dayjs().subtract(1, "day").toDate(),
    })
    upload3 = await makeUpload({
      name: `id-3-${namePattern}.webp`,
      createdAt: dayjs().toDate(),
    })
  })

  it("should be able to get the uploads", async () => {
    const sut = await getUploads({
      searchQuery: namePattern,
    })

    expect(isRightResult(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(3)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ])
  })

  it("should be able to get paginated uploads", async () => {
    let sut = await getUploads({
      searchQuery: namePattern,
      page: 1,
      pageSize: 2,
    })

    expect(isRightResult(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(3)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
    ])

    sut = await getUploads({
      searchQuery: namePattern,
      page: 2,
      pageSize: 2,
    })

    expect(isRightResult(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(3)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload1.id }),
    ])
  })

  it("should be able to get sorted uploads", async () => {
    let sut = await getUploads({
      searchQuery: namePattern,
      sortBy: "createdAt",
      sortDirection: "desc",
    })

    expect(isRightResult(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(3)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ])

    sut = await getUploads({
      searchQuery: namePattern,
      sortBy: "createdAt",
      sortDirection: "asc",
    })

    expect(isRightResult(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(3)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload1.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload3.id }),
    ])
  })
})
