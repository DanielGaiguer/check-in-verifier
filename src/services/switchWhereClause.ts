import { checkins } from '@/db/schema'
import { format, subMonths, subWeeks, subYears } from 'date-fns'
import { between, eq, SQL } from 'drizzle-orm'

export interface SearchParamsProps {
  range?: 'today' | 'week' | 'month'
  from?: string
  to?: string
}

export function switchWheteClause(
  searchParams: SearchParamsProps
): SQL | undefined {
  const date = new Date()
  const today = format(date, 'yyyy-MM-dd')

  if (searchParams.range === 'today') {
    return eq(checkins.date, today)
  }

  if (searchParams.range === 'week') {
    const week = format(subWeeks(date, 1), 'yyyy-MM-dd')
    return between(checkins.date, week, today)
  }

  if (searchParams.range === 'month') {
    const month = format(subMonths(date, 1), 'yyyy-MM-dd')
    return between(checkins.date, month, today)
  }

  if (searchParams.range === '3-month') {
    const month = format(subMonths(date, 3), 'yyyy-MM-dd')
    return between(checkins.date, month, today)
  }

  if (searchParams.range === '6-month') {
    const month = format(subMonths(date, 6), 'yyyy-MM-dd')
    return between(checkins.date, month, today)
  }

  if (searchParams.range === 'year') {
    const year = format(subYears(date, 1), 'yyyy-MM-dd')
    return between(checkins.date, year, today)
  }

  if (searchParams.from && searchParams.to) {
    return between(checkins.date, searchParams.from, searchParams.to)
  }

  return undefined
}
