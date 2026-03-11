import { db } from '@/db'
import { checkinItems } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const body = await req.json()
  const { id } = await context.params

  try {
    await db.update(checkinItems).set({
      status: body.status ?? checkinItems.status,
      observation: body.observation ?? checkinItems.observation,
    }).where(eq(checkinItems.id, id))
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
    data: 'Dados do item do check-in alterados com sucesso.',
  })
}
