import { db } from '@/db'
import { checkins } from '@/db/schema'
import {
  SearchParamsProps,
  switchWheteClause,
} from '@/services/switchWhereClause'
import { NextResponse } from 'next/server'

// Padrao para a requisicao:
//http://localhost:3000/api/checkins?range=today
//http://localhost:3000/api/checkins?from=2026-01-10&to=2026-01-15
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const params: SearchParamsProps = {
    range: searchParams.get('range') as SearchParamsProps['range'] | undefined,
    from: searchParams.get('from') || undefined,
    to: searchParams.get('to') || undefined,
  }

	if (!params.range || (!params.to && !params.from)){
		return NextResponse.json({success: false, error: "Parametros da requisição não informados."}, {status: 400})
	}

  const whereClause = switchWheteClause(params)
	let checkinsFilter

	try{
		checkinsFilter = await db
			.select({
				checkinsDate: checkins.date
			})
			.from(checkins)
			.where(whereClause)
	}catch(e) {
		return NextResponse.json({success: false, error: e}, {status: 400})
	}

  return NextResponse.json({ 
		success: true,
		data: checkinsFilter,
		count: checkinsFilter.length 
	})
}

export async function POST(req: Request) {
	const body = await req.json()
	let result

	try{
		result = await db.insert(checkins).values({peopleId: body.peopleId, date: body.date, observation: body.observation??""}).returning()
	}catch(e) {
		return NextResponse.json({
			success: false,
			error: e
		}, { status: 400})
	}
	return NextResponse.json({
		success: true,
		data: result[0]
	})
}