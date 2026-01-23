import { NextResponse } from 'next/server'
import { db } from '@/db'
import { checkins, users } from '@/db/schema'
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
