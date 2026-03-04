import { NextResponse } from 'next/server'
import { db } from '@/db'
import {
  checkinPlaceIssues,
  checkinPlaces,
  checkins,
  issues,
  photos,
  users,
} from '@/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { switchWhereClause } from '@/services/checkins/checkinUtils'

type CreateCheckinInput = {
  date: string
  userId: string
  places: {
    placeId: string
    status: 'organized' | 'disorganized'
    issues?: string[]
    photos?: string[]
    observation?: string
  }[]
}

// Padrao para a requisicao:
//http://localhost:3000/api/checkins?range=today
//http://localhost:3000/api/checkins?from=2026-01-10&to=2026-01-15
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const whereClause = switchWhereClause(searchParams)

  const data = await db
    .select({
      checkinId: checkins.id,
      date: checkins.date,
      userId: users.id,
      userName: users.name,
    })
    .from(checkins)
    .innerJoin(users, eq(users.id, checkins.userId))
    .where(whereClause)

  // 🔥 Buscar status de todos de uma vez
  const checkinIds = data.map((c) => c.checkinId)

  const placesStatus = await db
    .select()
    .from(checkinPlaces)
    .where(inArray(checkinPlaces.checkinId, checkinIds))

  // 🔥 Agrupar e calcular status
  const formatted = data.map((checkin) => {
    const relatedPlaces = placesStatus.filter(
      (p) => p.checkinId === checkin.checkinId
    )

    const overallStatus =
      relatedPlaces.length > 0 &&
      relatedPlaces.every((p) => p.status === 'organized')

    return {
      id: checkin.checkinId,
      date: checkin.date,
      user: {
        id: checkin.userId,
        name: checkin.userName,
      },
      overallStatus,
    }
  })

  return NextResponse.json(formatted)
}

export async function POST(req: Request) {
  const data = (await req.json()) as CreateCheckinInput
  const isoDate = new Date(data.date ?? new Date()).toISOString().slice(0, 10)

  //Uma transaction (transação) é um bloco de operações no banco de dados que são executadas como uma única unidade.
  //Ela garante que ou todas as operações dão certo, ou nenhuma é aplicada.
  await db.transaction(async (tx) => {
    const [newCheckin] = await tx
      .insert(checkins)
      .values({ date: isoDate, userId: data.userId })
      .returning()

    await Promise.all(
      data.places.map(async (place) => {
        const [newCheckinPlace] = await tx
          .insert(checkinPlaces)
          .values({
            checkinId: newCheckin.id,
            placeId: place.placeId,
            status: place.status,
            observation: place.observation,
          })
          .returning()

        if (place.status === 'disorganized' && place.issues?.length) {
          await tx.insert(checkinPlaceIssues).values(
            //Para varios registros de uma vez
            place.issues.map(issue => ({
              checkinPlaceId: newCheckinPlace.id,
              issueId: issue,
            }))
          )
        }

        if (place.photos?.length) {
          await tx.insert(photos).values(
            //Para varios registros de uma vez
            place.photos.map(photo => ({
              checkinPlaceId: newCheckinPlace.id,
              url: photo,
            }))
          )
        }
      })
    )
  })

  return NextResponse.json({ ok: true })
}

// export async function DELETE() {
//   await db.delete(checkins).where(eq(checkins.id, 4))
// }

// export async function POST(req: Request) {
//   const body = await req.json();

//   const result = await db.insert(checkins).values({
//     date: body.date,
//     overallStatus: body.overallStatus,
//     userId: body.userId,
//   }).returning();

//   return NextResponse.json(result[0]);
// }
