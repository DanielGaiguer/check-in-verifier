import { db } from '@/db'
import { checkinItemPhotos } from '@/db/schema'
import { eq, max } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const body = await req.json()
  if (!body.checkinItemProblemId) {
    return NextResponse.json(
      {
        success: false,
        error: 'Dados incompletos',
      },
      { status: 400 }
    )
  }
  let result
  try {
    result = await db
      .select()
      .from(checkinItemPhotos)
      .where(
        eq(checkinItemPhotos.checkinItemProblemId, body.checkinItemProblemId)
      )
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: e,
      },
      { status: 400 }
    )
  }

  return NextResponse.json({
    success: true,
    data: result,
  })
}

export async function POST(req: Request) {
  const body = await req.json()

  if (!body.checkinItemProblemId || !body.photoUrl) {
    return NextResponse.json(
      {
        success: false,
        error: 'Dados incompletos',
      },
      { status: 400 }
    )
  }

  if (!body.sortOrder) {
    try {
      const result = await db
        .select({ maxSort: max(checkinItemPhotos.sortOrder) })
        .from(checkinItemPhotos)
        .where(
          eq(checkinItemPhotos.checkinItemProblemId, body.checkinItemProblemId)
        )
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

  try {
    await db.insert(checkinItemPhotos).values({
      checkinItemProblemId: body.checkinItemProblemId,
      photoUrl: body.photoUrl,
      sortOrder: body.sortOrder,
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

  return NextResponse.json({
    success: true,
    data: 'Dados da foto do check-in adicionado com sucesso.',
  })
}
