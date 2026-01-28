import { NextResponse } from 'next/server'
import { db } from '@/db'
import { checkins, users, checkinPlacesIssues, photos  } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { switchWhereClause } from '@/services/checkinService'

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
  const body = await req.json();

  // 1. create check-in
  const [checkin] = await db
    .insert(checkins)
    .values({
      date: body.date,
      overallStatus: body.overallStatus,
      userId: body.userId,
    })
    .returning();

  // 2. insert issues
  for (const item of body.issues ?? []) {
    const [issue] = await db
      .insert(checkinPlacesIssues)
      .values({
        checkinId: checkin.id,
        placeId: item.placeId,
        issueId: item.issueId,
        observation: item.observation,
      })
      .returning();

    // 3. insert photos
    for (const url of item.photos ?? []) {
      await db.insert(photos).values({
        checkinPlacesIssuesId: issue.id,
        url,
      });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await db.delete(checkins).where(eq(checkins.id, 4))
}

// export async function POST(req: Request) {
//   const body = await req.json();

//   const result = await db.insert(checkins).values({
//     date: body.date,
//     overallStatus: body.overallStatus,
//     userId: body.userId,
//   }).returning();

//   return NextResponse.json(result[0]);
// }
 