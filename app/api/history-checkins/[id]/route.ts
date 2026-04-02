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
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop() // pega o último segmento da URL

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID não informado' },
        { status: 400 }
      )
    }

    const rawData = await db
      .select({
        checkinId: checkins.id,
        date: checkins.date,
        createdAt: checkins.createdAt,
        observation: checkins.observation,
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
      .leftJoin(problems, eq(checkinItemsProblems.problemId, problems.id))
      .leftJoin(
        checkinItemPhotos,
        eq(checkinItems.id, checkinItemPhotos.checkinItemId)
      )
      .leftJoin(checkinEdits, eq(checkins.id, checkinEdits.checkinId))
      .where(eq(checkins.id, id))

    const checkinsMap = new Map<string, any>()

    for (const row of rawData) {
      if (!checkinsMap.has(row.checkinId)) {
        checkinsMap.set(row.checkinId, {
          checkinId: row.checkinId,
          date: row.date,
          createdAt: row.createdAt,
          people: {
            id: row.peopleId,
            name: row.peopleName,
            labId: row.labId,
            labName: row.labName,
          },
          observation: row.observation,
          placeCount: 0,
          items: [],
          edits: [],
        })
      }

      const checkin = checkinsMap.get(row.checkinId)

      // --- Itens ---
      let item = checkin.items.find((i: any) => i.itemId === row.itemId)

      if (!item && row.itemId) {
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

      if (item && row.problemId) {
        let problem = item.problems.find(
          (p: any) => p.problemId === row.problemId
        )
        if (!problem) {
          problem = {
            problemId: row.problemId,
            name: row.problemName,
          }
          item.problems.push(problem)
        }

        if (item && row.photoId) {
          if (!item.photos.find((p: any) => p.photoId === row.photoId)) {
            item.photos.push({
              photoId: row.photoId,
              url: row.photoUrl,
            })
          }
        }
      }

      if (row.editId) {
        const editExists = checkin.edits.find(
          (e: any) => e.editId === row.editId
        )
        if (!editExists) {
          checkin.edits.push({
            editId: row.editId,
            editedBy: row.editedBy,
            editedReason: row.editedReason,
            editedCreatedAt: row.editedCreatedAt,
          })
        }
      }
    }

    const data = Array.from(checkinsMap.values())[0]

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Checkin não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar checkin' },
      { status: 500 }
    )
  }
}
