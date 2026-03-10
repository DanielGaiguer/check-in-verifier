import { db } from '@/db'
import { checkins } from '@/db/schema'
import {
  SearchParamsProps,
  switchWheteClause,
} from '@/services/switchWhereClause'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const params: SearchParamsProps = {
    range: searchParams.get('range') as SearchParamsProps['range'] | undefined,
    from: searchParams.get('from') || undefined,
    to: searchParams.get('to') || undefined,
  }

  const whereClause = switchWheteClause(params)

  const checkinsFilter = await db
      .select({
				checkinsDate: checkins.date
			})
      .from(checkins)
      .where(whereClause)

  return NextResponse.json({ 
		success: true,
		data: checkinsFilter,
		count: checkinsFilter.length 
	})
}
