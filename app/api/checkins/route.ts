import { db } from '@/db'
import { checkins } from '@/db/schema'
import {
  SearchParamsProps,
  switchWheteClause,
} from '@/services/switchWhereClause'
import { between, eq } from 'drizzle-orm'

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

  return new Response(JSON.stringify({ checkinsFilter }), {
    status: 200,
    headers: { 'Contenty-Type': 'application/json' },
  })
}
