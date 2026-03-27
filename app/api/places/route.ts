import { db } from '@/db'
import { laboratories, placeProblems, places, problems } from '@/db/schema'
import { getActiveFilter } from '@/utils/getActiveFilter'
import { and, eq, gte, max, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

interface PostPlaceProtocol {
  labId: string
  name: string
  sortOrder?: number
  problemIds?: string[]
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const onlyActive = getActiveFilter(url)

  let response

  try {
    response = await db
      .select({
        id: places.id,
        labId: places.labId,
        name: places.name,
        sortOrder: places.sortOrder,
        createdAt: places.createdAt,
        labName: laboratories.name,
        problemId: problems.id,
        problemName: problems.name,
        problemActive: problems.active,
      })
      .from(places)
      .innerJoin(laboratories, eq(places.labId, laboratories.id))
      .leftJoin(placeProblems, eq(placeProblems.placeId, places.id))
      .leftJoin(problems, eq(problems.id, placeProblems.problemId))
      .where(onlyActive ? eq(places.active, true) : undefined)
  } catch (e) {
    return NextResponse.json({ success: false, error: e }, { status: 400 })
  }

  const grouped = response.reduce(
    (acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          id: row.id,
          labId: row.labId,
          name: row.name,
          sortOrder: row.sortOrder,
          createdAt: row.createdAt,
          labName: row.labName,
          problems: [],
        }
      }

    
      if (row.problemName && (!onlyActive || row.problemActive)) {
        acc[row.id].problems.push({
          id: row.problemId,
          name: row.problemName,
        })
      }

      return acc
    },
    {} as Record<string, any>
  )

  const data = Object.values(grouped)

  return NextResponse.json({
    success: true,
    data,
    count: data.length,
  })
}
export async function POST(req: Request) {
  const body: PostPlaceProtocol = await req.json()

  if (!body.labId || !body.name) {
    return NextResponse.json(
      {
        success: false,
        error: 'Informações sobre o lugar estão faltando.',
      },
      { status: 400 }
    )
  }

  try {
    const result = await db.transaction(async (tx) => {
      let sortOrder = body.sortOrder

      if (!sortOrder) {
        const maxSortResult = await tx
          .select({ maxSort: max(places.sortOrder) })
          .from(places)
          .where(eq(places.labId, body.labId))

        const maxSortOrder = maxSortResult[0]?.maxSort
        sortOrder = (maxSortOrder || 0) + 1
      }

      await tx
        .update(places)
        .set({ sortOrder: sql`${places.sortOrder} + 1` })
        .where(
          and(eq(places.labId, body.labId), gte(places.sortOrder, sortOrder))
        )

      const inserted = await tx
        .insert(places)
        .values({
          labId: body.labId,
          name: body.name,
          sortOrder,
        })
        .returning()

      const place = inserted[0]

      if (!place) {
        throw new Error('Erro ao criar lugar')
      }

      if (body.problemIds && body.problemIds.length > 0) {
        const values = body.problemIds.map((problemId) => ({
          placeId: place.id,
          problemId,
        }))

        await tx.insert(placeProblems).values(values).onConflictDoNothing()
      }

      return place
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: e,
      },
      { status: 400 }
    )
  }
}
