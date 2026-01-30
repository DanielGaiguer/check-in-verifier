import { eq, gte, lte, and } from 'drizzle-orm'
import { checkin } from '@/db/schema'

export const switchWhereClause = ( searchParams: URLSearchParams ) => {
	const range = searchParams.get('range') // 'today' | 'week' | 'month'
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  let whereClause

  const today = new Date().toISOString().split('T')[0]

  if (range) {
    if (range === 'today') {
      whereClause = eq(checkin.date, today)
    }

    if (range === 'week') {
      const weekDate = new Date(today)
      weekDate.setDate(weekDate.getDate() - 7)
      const week = weekDate.toISOString().split('T')[0]
      whereClause = and(gte(checkin.date, week), lte(checkin.date, today))
    }

    if (range === 'month') {
      const monthDate = new Date(today)
      monthDate.setDate(monthDate.getDate() - 30)
      const month = monthDate.toISOString().split('T')[0]
      whereClause = and(gte(checkin.date, month), lte(checkin.date, today))
    }
  } else if (from && to) {
  	const fromDate = new Date(from).toISOString().split('T')[0]
  	const toDate = new Date(to).toISOString().split('T')[0]
    whereClause = and(gte(checkin.date, fromDate), lte(checkin.date, toDate)) 
  }

	return whereClause
}