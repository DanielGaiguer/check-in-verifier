import { db } from '@/db'
import {
  checkinItemPhotos,
  checkinItems,
  checkinItemsProblems,
  checkins,
  people,
} from '@/db/schema'
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
  const range = searchParams.get('range')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  if (!range && (!from || !to)) {
    return NextResponse.json(
      { success: false, error: 'Parâmetros da requisição não informados.' },
      { status: 400 }
    )
  }

  try {
    const checkinsFilter = await db
      .select({
        id: checkins.id,
        peopleId: checkins.peopleId,
        peopleName: people.name,
        checkinsDate: checkins.date,
        observation: checkins.observation,
        createdAt: checkins.createdAt,
      })
      .from(checkins)
      .innerJoin(people, eq(checkins.peopleId, people.id))
    return NextResponse.json({
      success: true,
      data: checkinsFilter,
      count: checkinsFilter.length,
    })
  } catch (e) {
    return NextResponse.json({ success: false, error: e }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('Payload recebido:', JSON.stringify(body, null, 2))

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
          placeId: item.place.id, // correto
          status: item.status,
          observation: item.observation ?? '',
        })
        .returning()

      if (item.photos && item.photos.length > 0) {
        const photosToInsert = item.photos.map((photo: any) => ({
          checkinItemId: newItem.id,
          photoUrl: photo.url, 
        }))
        await db.insert(checkinItemPhotos).values(photosToInsert)
      }

      if (item.problems && item.problems.length > 0) {
        const problemsToInsert = item.problems.map((problem: any) => ({
          checkinItemId: newItem.id,
          problemId: problem.problemId,
          active: true, // somente campos existentes no schema
        }))
        await db.insert(checkinItemsProblems).values(problemsToInsert)
      }
    }

    return NextResponse.json({
      success: true,
      data: newCheckin,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
