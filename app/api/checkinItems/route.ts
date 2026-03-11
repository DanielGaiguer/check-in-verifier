import { db } from '@/db'
import { checkinItems } from '@/db/schema'
import { NextResponse } from 'next/server'

export async function GET() {
  let result
  try {
    result = await db.select().from(checkinItems)
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

  if (!body.checkinId || !body.placeId || !body.status) {
    return NextResponse.json(
      {
        success: false,
        error: 'Dados incompletos',
      },
      { status: 400 }
    )
  }
  try {
    await db.insert(checkinItems).values({
      checkinId: body.checkinId,
      placeId: body.placeId,
      status: body.status,
      observation: body.observation ?? "",
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
    data: 'Dados do item do check-in criado com sucesso.',
  })
}
