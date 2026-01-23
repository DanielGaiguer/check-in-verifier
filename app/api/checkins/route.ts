import { NextResponse } from 'next/server'
import { db } from '@/db'
import { checkins, users } from '@/db/schema'
import { eq, gte, lte, and } from 'drizzle-orm'


// Padrao para a requisicao: 
//http://localhost:3000/api/checkins?range=today
//http://localhost:3000/api/checkins?from=2026-01-10&to=2026-01-15
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const range = searchParams.get('range') // 'today' | 'week' | 'month'
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  let whereClause

  const today = new Date().toISOString().split('T')[0]

  if (range) {
    if (range === 'today') {
      whereClause = eq(checkins.date, today)
    }

    if (range === 'week') {
      const weekDate = new Date(today)
      weekDate.setDate(weekDate.getDate() - 7)
      const week = weekDate.toISOString().split('T')[0]
      whereClause = and(gte(checkins.date, week), lte(checkins.date, today))
    }

    if (range === 'month') {
      const monthDate = new Date(today)
      monthDate.setDate(monthDate.getDate() - 30)
      const month = monthDate.toISOString().split('T')[0]
      whereClause = and(gte(checkins.date, month), lte(checkins.date, today))
    }
  } else if (from && to) {
  	const fromDate = new Date(from).toISOString().split('T')[0]
  	const toDate = new Date(to).toISOString().split('T')[0]
    whereClause = and(gte(checkins.date, fromDate), lte(checkins.date, toDate)) 
  }

  const data = await db
    .select()
    .from(checkins)
    .innerJoin(users, eq(users.id, checkins.userId))
    .where(whereClause)

  return NextResponse.json(data)
}
