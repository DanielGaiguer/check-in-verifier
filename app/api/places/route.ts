import { db } from '@/db'
import { laboratories, places } from '@/db/schema'
import { and, eq, gte, max, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

interface PostPlaceProtocol {
  labId: string
  name: string
  sortOrder?: number
}

export async function GET(req: Request) {
  let response

  try {
    response = await db
      .select({
        id: places.id,
        labId: places.labId,
        name: places.name,
        sortOrder: places.sortOrder,
        createdAt: places.createdAt,
        labName: laboratories.name
      })
      .from(places)
      .innerJoin(laboratories, eq(places.labId, laboratories.id))
  } catch (e) {
    NextResponse.json(
      {
        success: false,
        error: e,
      },
      { status: 400 }
    )
  }

  return NextResponse.json({
    success: true,
    data: response,
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
      let maxSortOrder = result[0]?.maxSort
      body.sortOrder = (maxSortOrder || 0) + 1
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

  if (body.sortOrder) {
    try {
      await db
        .update(places)
        .set({
          sortOrder: sql`${places.sortOrder} + 1`,
        })
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
      return NextResponse.json(
        {
          success: false,
          error: e,
        },
        { status: 400 }
      )
    }
  }

  if (!inserted || !inserted[0]) {
    return NextResponse.json(
      {
        success: false,
        error: 'Não foi possível inserir o lugar.',
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    data: inserted[0],
  })
}
