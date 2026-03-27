import { db } from '@/db'
import { placeProblems } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  let result
  try {
    result = await db.select().from(placeProblems)
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

  if (!body.placeId || !Array.isArray(body.problemIds)) {
    return NextResponse.json(
      {
        success: false,
        error: 'placeId e problemIds são obrigatórios',
      },
      { status: 400 }
    )
  }

  try {
    const values = body.problemIds.map((problemId: string) => ({
      placeId: body.placeId,
      problemId,
    }))

    await db.insert(placeProblems).values(values).onConflictDoNothing()

    return NextResponse.json({
      success: true,
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

export async function DELETE(req: Request) {
  const body = await req.json()

  try {
    await db
      .delete(placeProblems)
      .where(
        and(
          eq(placeProblems.placeId, body.placeId),
          eq(placeProblems.problemId, body.problemId)
        )
      )

    return NextResponse.json({ success: true })
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
