import { db } from '@/db'
import {
  checkinItems,
  checkinItemsProblems,
  checkinItemPhotos,
  checkins,
  people,
  places,
  problems,
} from '@/db/schema'
import {
  SearchParamsProps,
  switchWheteClause,
} from '@/services/switchWhereClause'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const params: SearchParamsProps = {
    range: searchParams.get('range') as SearchParamsProps['range'] | undefined,
    from: searchParams.get('from') || undefined,
    to: searchParams.get('to') || undefined,
  }

  if (!params.range && (!params.to || !params.from)) {
    return NextResponse.json(
      { success: false, error: 'Parametros da requisição não informados.' },
      { status: 400 }
    )
  }

  const whereClause = switchWheteClause(params)

  try {
    const rawData = await db
      .select({
        checkinId: checkins.id,
        date: checkins.date,
        observation: checkins.observation,
        peopleId: people.id,
        peopleName: people.name,
        itemId: checkinItems.id,
        itemStatus: checkinItems.status,
        itemObservation: checkinItems.observation,
        placeId: places.id,
        placeName: places.name,
        problemId: problems.id,
        problemName: problems.name,
        photoId: checkinItemPhotos.id,
        photoUrl: checkinItemPhotos.photoUrl,
      })
      .from(checkins)
      .innerJoin(people, eq(checkins.peopleId, people.id))
      .leftJoin(checkinItems, eq(checkins.id, checkinItems.checkinId))
      .leftJoin(places, eq(checkinItems.placeId, places.id))
      .leftJoin(
        checkinItemsProblems,
        eq(checkinItems.id, checkinItemsProblems.checkinItemId)
      )
      .leftJoin(problems, eq(checkinItemsProblems.problemId, problems.id))
      .leftJoin(
        checkinItemPhotos,
        eq(checkinItemsProblems.id, checkinItemPhotos.checkinItemProblemId)
      )
      .where(whereClause)

    // Transformar em estrutura hierárquica
    // Criamos um Map para armazenar os checkins.
    // A chave será o checkinId e o valor será o objeto do checkin.
    const checkinsMap = new Map<string, any>()

    // Percorre cada linha retornada do banco
    for (const row of rawData) {
      // Verifica se já existe um checkin com esse ID no Map
      if (!checkinsMap.has(row.checkinId)) {
        // Criamos o objeto do checkin e armazenamos no Map
        checkinsMap.set(row.checkinId, {
          checkinId: row.checkinId, // id do checkin
          date: row.date,
          people: {
            id: row.peopleId,
            name: row.peopleName,
          },
          observation: row.observation,
          placeCount: 0,
          items: [],
        })
      }

      const checkin = checkinsMap.get(row.checkinId)

      let item = checkin.items.find((i: any) => i.itemId === row.itemId)
      if (!item && row.itemId) {
        item = {
          itemId: row.itemId,
          place: {
            id: row.placeId,
            name: row.placeName,
          },
          status: row.itemStatus,
          observation: row.itemObservation,
          problems: [],
        }
        checkin.items.push(item)
        checkin.placeCount += 1
      }

      if (item && row.problemId) {
        // Verifica se o problema já existe
        let problem = item.problems.find(
          (p: any) => p.problemId === row.problemId
        )
        if (!problem) {
          problem = {
            problemId: row.problemId,
            name: row.problemName,
            photos: [],
          }
          item.problems.push(problem)
        }

        if (problem && row.photoId) {
          // Evita fotos duplicadas
          if (!problem.photos.find((p: any) => p.photoId === row.photoId)) {
            problem.photos.push({
              photoId: row.photoId,
              url: row.photoUrl,
            })
          }
        }
      }
    }
		//EXEMPLO: 
// 		{
//   checkinId: 1,
//   person: { id: 2, name: "Daniel" },
//   placeCount: 2,
//   items: [
//     {
//       itemId: 10,
//       place: { id: 1, name: "Lab 1" },
//       problems: [
//         {
//           problemId: 5,
//           name: "Monitor quebrado",
//           photos: [
//             { photoId: 1, url: "foto1.jpg" }
//           ]
//         }
//       ]
//     }
//   ]
// }

    return NextResponse.json({
      success: true,
      data: Array.from(checkinsMap.values()),
      count: checkinsMap.size,
    })
  } catch (e) {
    return NextResponse.json({ success: false, error: e }, { status: 400 })
  }
}
