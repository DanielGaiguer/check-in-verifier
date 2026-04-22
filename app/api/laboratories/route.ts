import { db } from '@/db'
import { laboratories } from '@/db/schema'
import { getActiveFilter } from '@/utils/getActiveFilter'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const onlyActive = getActiveFilter(url)

  let labs
  try {
    labs = await db
      .select()
      .from(laboratories)
      .where(onlyActive ? eq(laboratories.active, true) : undefined)
  } catch (e) {
    return NextResponse.json({ success: false, error: e }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    data: labs,
    count: labs.length,
  })
}

export async function POST(req: Request) {
  const body = await req.json()

  if (!body.name || !body.unitId) {
    return NextResponse.json(
      { success: false, error: 'Nome do laboratório não informado' },
      { status: 400 }
    )
  }

  try {
    await db.insert(laboratories).values({
      name: body.name,
      unitId: body.unitId,
      active: true,
    })
  } catch (e) {
    return NextResponse.json({ success: false, error: e }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
