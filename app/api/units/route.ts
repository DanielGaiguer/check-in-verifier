import { db } from '@/db'
import { units } from '@/db/schema'
import { getActiveFilter } from '@/utils/getActiveFilter'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const onlyActive = getActiveFilter(url)

  let response
  try {
    response = await db
      .select()
      .from(units)
      .where(onlyActive ? eq(units.active, true) : undefined)
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
    data: response,
    count: response.length,
  })
}

export async function POST(req: Request) {
  const body = await req.json()

  if (!body.name) {
    return NextResponse.json(
      {
        success: false,
        error: 'Nome da unidade não informado',
      },
      { status: 400 }
    )
  }

  try {
    await db.insert(units).values({
      name: body.name,
      active: true, 
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
    data: `Unidade ${body.name} criada com sucesso`,
  })
}
