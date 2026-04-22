import { db } from '@/db'
import {
  checkinItemPhotos,
  checkinItems,
  checkinItemsProblems,
  checkins,
} from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  let result
  try {
    result = await db.select().from(checkins).where(eq(checkins.id, id))
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
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const body = await req.json()

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(checkins)
        .set({
          peopleId: body.peopleId,
          unitId: body.unitId,
          date: body.date,
          observation: body.observation,
        })
        .where(eq(checkins.id, id))

      for (const item of body.items) {
        await tx
          .update(checkinItems)
          .set({
            status: item.status,
            observation: item.observation,
          })
          .where(
            and(
              eq(checkinItems.checkinId, id),
              eq(checkinItems.placeId, item.place.id)
            )
          )

        const [checkinItem] = await tx
          .select({ id: checkinItems.id })
          .from(checkinItems)
          .where(
            and(
              eq(checkinItems.checkinId, id),
              eq(checkinItems.placeId, item.place.id)
            )
          )

        if (!checkinItem) continue

        const checkinItemId = checkinItem.id

        await tx
          .delete(checkinItemsProblems)
          .where(eq(checkinItemsProblems.checkinItemId, checkinItemId))

        for (const problem of item.problems) {
          await tx.insert(checkinItemsProblems).values({
            checkinItemId,
            problemId: problem.problemId,
            active: true,
          })
        }

        await tx
          .delete(checkinItemPhotos)
          .where(eq(checkinItemPhotos.checkinItemId, checkinItemId))

        for (const photo of item.photos) {
          await tx.insert(checkinItemPhotos).values({
            checkinItemId,
            photoUrl: photo.url,
          })
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: 'Check-in atualizado com sucesso!',
    })
  } catch (e) {
    return NextResponse.json({ success: false, error: e }, { status: 400 })
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    await db.delete(checkins).where(eq(checkins.id, id))
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
    data: 'Dados do check-in deletados com sucesso.',
  })
}
