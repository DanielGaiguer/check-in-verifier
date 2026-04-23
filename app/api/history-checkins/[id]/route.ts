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
        unitId: checkins.unitId,
        observation: checkins.observation,
        peopleId: people.id,
        peopleName: people.name,
        itemId: checkinItems.id,
        itemStatus: checkinItems.status,
        itemObservation: checkinItems.observation,
        placeId: places.id,
        placeName: places.name,
        placeOrder: places.sortOrder,
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
      .leftJoin(checkinItemsProblems, eq(checkinItems.id, checkinItemsProblems.checkinItemId))
      .leftJoin(problems, eq(checkinItemsProblems.problemId, problems.id))
      .leftJoin(checkinItemPhotos, eq(checkinItems.id, checkinItemPhotos.checkinItemId))
      .leftJoin(checkinEdits, eq(checkins.id, checkinEdits.checkinId))
      .where(eq(checkins.id, id))

    if (!rawData.length) {
      return NextResponse.json(
        { success: false, error: 'Checkin não encontrado' },
        { status: 404 }
      )
    }

    const checkinMap = {
      checkinId: rawData[0].checkinId,
      date: rawData[0].date,
      createdAt: rawData[0].createdAt,
      unitId: rawData[0].unitId,
      observation: rawData[0].observation,
      people: {
        id: rawData[0].peopleId,
        name: rawData[0].peopleName,
      },
      placeCount: 0,
      items: [] as any[],
      edits: [] as any[],
    }

    const itemsMap = new Map<string, any>()

    for (const row of rawData) {
      // === ITEMS ===
      if (row.itemId) {
        if (!itemsMap.has(row.itemId)) {
          const item = {
            itemId: row.itemId,
            place: {
              id: row.placeId,
              name: row.placeName,
              order: row.placeOrder,
              labId: row.labId,
              labName: row.labName,
            },
            status: row.itemStatus,
            observation: row.itemObservation,
            problems: [] as any[],
            photos: [] as any[],
          }
          itemsMap.set(row.itemId, item)
          checkinMap.items.push(item)
          checkinMap.placeCount += 1
        }

        const item = itemsMap.get(row.itemId)

        // === PROBLEMAS ===
        if (row.problemId && !item.problems.find((p: any) => p.problemId === row.problemId)) {
          item.problems.push({
            problemId: row.problemId,
            name: row.problemName,
          })
        }

        // === FOTOS ===
        if (row.photoId && !item.photos.find((p: any) => p.photoId === row.photoId)) {
          item.photos.push({
            photoId: row.photoId,
            url: row.photoUrl,
          })
        }
      }

      // === EDITS ===
      if (row.editId && !checkinMap.edits.find((e: any) => e.editId === row.editId)) {
        checkinMap.edits.push({
          editId: row.editId,
          editedBy: row.editedBy,
          editedReason: row.editedReason,
          editedCreatedAt: row.editedCreatedAt,
        })
      }
    }

    return NextResponse.json({ success: true, data: checkinMap })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar checkin' },
      { status: 500 }
    )
  }
}