import { db } from '@/db'
import { laboratories, placeProblems, places, problems } from '@/db/schema'
import { getActiveFilter } from '@/utils/getActiveFilter'
import { and, eq, gte, max, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

interface PostPlaceProtocol {
  labId: string
  name: string
  sortOrder?: number
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

      // Adiciona problema apenas se estiver ativo ou se não filtrar
      if (row.problemName && (!onlyActive || row.problemActive)) {
        acc[row.id].problems.push(row.problemName)
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
  let inserted

  if (!body.labId || !body.name) {
    return NextResponse.json({
      success: false,
      error: `Informações sobre o lugar estão faltando.`,
    })
  }

  if (!body.sortOrder) {
    try {
      const result = await db
        .select({ maxSort: max(places.sortOrder) })
        .from(places)
        .where(eq(places.labId, body.labId))
      const maxSortOrder = result[0]?.maxSort
      body.sortOrder = (maxSortOrder || 0) + 1
    } catch (e) {
      return NextResponse.json({ success: false, error: e }, { status: 400 })
    }
  }

  if (body.sortOrder) {
    try {
      await db
        .update(places)
        .set({ sortOrder: sql`${places.sortOrder} + 1` })
        .where(
          and(
            eq(places.labId, body.labId),
            gte(places.sortOrder, body.sortOrder)
          )
        )

      inserted = await db
        .insert(places)
        .values({
          labId: body.labId,
          name: body.name,
          sortOrder: body.sortOrder,
        })
        .returning()
    } catch (e) {
      return NextResponse.json({ success: false, error: e }, { status: 400 })
    }
  }

  if (!inserted || !inserted[0]) {
    return NextResponse.json(
      { success: false, error: 'Não foi possível inserir o lugar.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, data: inserted[0] })
}
