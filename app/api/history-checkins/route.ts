import { db } from '@/db'
import {
  checkinItems,
  checkinItemsProblems,
  checkinItemPhotos,
  checkins,
  people,
  places,
  problems,
  laboratories,
  checkinEdits,
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
        createdAt: checkins.createdAt,
        observation: checkins.observation,
        unitId: checkins.unitId,
        peopleId: people.id,
        peopleName: people.name,
        itemId: checkinItems.id,
        itemStatus: checkinItems.status,
        itemObservation: checkinItems.observation,
        placeId: places.id,
        placeName: places.name,
        labId: laboratories.id,
        labName: laboratories.name,
        problemId: problems.id,
        problemName: problems.name,
        photoId: checkinItemPhotos.id,
        photoUrl: checkinItemPhotos.photoUrl,
        editId: checkinEdits.id,
        editedBy: checkinEdits.editedBy,
        editedReason: checkinEdits.reason,
        editedCreatedAt: checkinEdits.createdAt,
      })
      .from(checkins)
      .innerJoin(people, eq(checkins.peopleId, people.id))
      .leftJoin(checkinItems, eq(checkins.id, checkinItems.checkinId))
      .leftJoin(places, eq(checkinItems.placeId, places.id))
      .leftJoin(laboratories, eq(laboratories.id, places.labId))
      .leftJoin(
        checkinItemsProblems,
        eq(checkinItems.id, checkinItemsProblems.checkinItemId)
      )
      .leftJoin(checkinEdits, eq(checkinEdits.checkinId, checkins.id))
      .leftJoin(problems, eq(checkinItemsProblems.problemId, problems.id))
      .leftJoin(
        checkinItemPhotos,
        eq(checkinItems.id, checkinItemPhotos.checkinItemId)
      )
      .where(whereClause)

    const checkinsMap = new Map<string, any>()

    for (const row of rawData) {
      if (!checkinsMap.has(row.checkinId)) {
        checkinsMap.set(row.checkinId, {
          checkinId: row.checkinId,
          date: row.date,
          createdAt: row.createdAt,
          unitId: row.unitId,
          observation: row.observation,
          people: {
            id: row.peopleId,
            name: row.peopleName,
          },
          placeCount: 0,
          items: [],
          edits: [],
        })
      }

      const checkin = checkinsMap.get(row.checkinId)

      // === ITEM ===
      if (row.itemId) {
        let item = checkin.items.find((i: any) => i.itemId === row.itemId)

        if (!item) {
          item = {
            itemId: row.itemId,
            place: {
              id: row.placeId,
              name: row.placeName,
              labId: row.labId,
              labName: row.labName,
            },
            status: row.itemStatus,
            observation: row.itemObservation,
            problems: [],
            photos: [],
          }
          checkin.items.push(item)
          checkin.placeCount += 1
        }

        // === PROBLEMAS ===
        if (row.problemId) {
          if (!item.problems.find((p: any) => p.problemId === row.problemId)) {
            item.problems.push({
              problemId: row.problemId,
              name: row.problemName,
            })
          }
        }

        // === FOTOS ===
        if (row.photoId) {
          if (!item.photos.find((p: any) => p.photoId === row.photoId)) {
            item.photos.push({
              photoId: row.photoId,
              url: row.photoUrl,
            })
          }
        }
      }

      // === EDITS ===
      if (row.editId) {
        if (!checkin.edits.find((e: any) => e.editId === row.editId)) {
          checkin.edits.push({
            editId: row.editId,
            editedBy: row.editedBy,
            editedReason: row.editedReason,
            editedCreatedAt: row.editedCreatedAt,
          })
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
