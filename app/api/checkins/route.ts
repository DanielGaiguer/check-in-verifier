import { db } from '@/db'
import { checkinItemPhotos, checkinItems, checkinItemsProblems, checkins, people } from '@/db/schema'
import {
  SearchParamsProps,
  switchWheteClause,
} from '@/services/switchWhereClause'
import { eq } from 'drizzle-orm'
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

	if (!params.range && (!params.to || !params.from)){
		return NextResponse.json({success: false, error: "Parametros da requisição não informados."}, {status: 400})
	}

  const whereClause = switchWheteClause(params)
	let checkinsFilter

	try{
		checkinsFilter = await db
			.select({
				id: checkins.id,
				peopleId: checkins.peopleId,
				peopleName: people.name,
				checkinsDate: checkins.date,
				observation: checkins.observation,
				createdAt: checkins.createdAt
			})
			.from(checkins)
			.innerJoin(people, eq(checkins.peopleId, people.id))
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
  try {
    const body = await req.json()

    if (!body.peopleId || !body.items || !Array.isArray(body.items)) {
      return NextResponse.json(
        { success: false, error: 'Payload inválido.' },
        { status: 400 }
      )
    }


    const [newCheckin] = await db
      .insert(checkins)
      .values({
        peopleId: body.peopleId,
        date: body.date,
        observation: body.observation ?? '',
      })
      .returning()

    for (const item of body.items) {
      const [newItem] = await db
        .insert(checkinItems)
        .values({
          checkinId: newCheckin.id,
          placeId: item.itemId,
          status: item.status, 
          observation: item.observation ?? '',
        })
        .returning()

      if (item.problems && item.problems.length > 0) {
        for (const problem of item.problems) {
          const [newItemProblem] = await db
            .insert(checkinItemsProblems)
            .values({
              checkinItemId: newItem.id,
              problemId: problem.problemId,
              active: true,
            })
            .returning()

          if (problem.photos && problem.photos.length > 0) {
            const photosToInsert = problem.photos.map((photo: any) => ({
              checkinItemProblemId: newItemProblem.id,
              photoUrl: photo.url,
            }))
            await db.insert(checkinItemPhotos).values(photosToInsert)
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: newCheckin,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    )
  }
}