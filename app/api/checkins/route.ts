import { NextResponse } from 'next/server'
import { db } from '@/db'
import {
  checkinPlaceIssues,
  checkinPlaces,
  checkins,
  issues,
  users,
} from '@/db/schema'
import { eq } from 'drizzle-orm'
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
    .select()
    .from(checkins)
    .innerJoin(users, eq(users.id, checkins.userId))
    .where(whereClause)

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const data = (await req.json()) as CreateCheckinInput

  const isoDate = new Date(data.date ?? new Date()).toISOString().slice(0, 10)

  const [newCheckin] = await db
    .insert(checkins)
    .values({ date: isoDate, userId: data.userId })
    .returning()

  await Promise.all(
    data.places.map(async (place) => {
      const [newCheckinPlaces] = await db
        .insert(checkinPlaces)
        .values({
          checkinId: newCheckin.id,
          placeId: place.placeId,
          status: place.status,
          observation: place.observation,
        })
        .returning()
      if (place.status === 'disorganized') {
        await Promise.all(
          
          place.issues?.map(async (issue) => {
            const [issueRow] = await db
              .select()
              .from(issues)
              .where(eq(issues.id, issue))
  
            await db.insert(checkinPlaceIssues).values({
              checkinPlaceId: newCheckinPlaces.id,
              issueId: issueRow.id,
  
            })
          }) ?? []
        )
      }
    })
  )

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
