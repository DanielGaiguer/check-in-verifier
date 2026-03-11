import { db } from '@/db'
import { checkins, people } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const body = await req.json()

  try {
    await db
      .update(checkins)
      .set({
        peopleId: body.peopleId ?? checkins.peopleId,
        date: body.date ?? checkins.date,
        observation: body.observation ?? checkins.observation,
      })
      .where(eq(checkins.id, id))
  } catch (e) {
		return NextResponse.json({
			success: false, 
			error: e
		}, { status: 400})
	}

	return NextResponse.json({
		success: true,
		data: "Dados do check-in alterados com sucesso."
	})
}
